// v1.10
function roundStandings() {
  ctrl = new ControlPanel();
  let spreadsheetIds = ctrl.config.isDev ? DEV_PLAYER_SPREADSHEET_IDS : PLAYER_SPREADSHEET_IDS;

  let playerSheets = [];

  for (const psi of spreadsheetIds) {
    ps = new PlayerSheet(psi.id);
    playerSheets.push({
      sheet: ps,
      name: ps.getName()
    })
  }

  let placement = [];

  for (const playerName of playerSheets.map((sheet) => sheet.name)) {
    var sheet = playerSheets.find((playerSheet) => playerSheet.name == playerName).sheet;
    placement.push({
      name: playerName,
      pointsFor: sheet.getPointsTotal(),
      pointsAgainst: calculatePointsAgainst(playerName, playerSheets),
      //TODON: These values need better sources. I want to try calculating from on-the-fly comparison between pointsFor and pointsAgainst
      record: sheet.getRecord(),
      wins: sheet.getRecord().split('-')[0],
      losses: sheet.getRecord().split('-')[1],
      sheet: sheet
    })
  }

  placement.sort(function (a, b) {
    return b.wins - a.wins || a.losses - b.losses || b.pointsFor - a.pointsFor;
  })

  standings = new Standings();
  rosterWaivers = new RosterWaivers();

  for (let i = 0; i < placement.length; i++) {
    placement[i].sheet.writeRank(i+1);
    placement[i].sheet.writeWaiver(placement.length - i);
    standings.writeToPlace(i + 1, placement[i].name, placement[i].record, placement[i].pointsFor, placement[i].pointsAgainst)
    rosterWaivers.writeToWaiverPrio(i + 1, placement[i].name)
  }
}

function calculatePointsAgainst(teamName, playerSheets) {
  const todaysDate = new Date();
  const pastTournaments = TOURNAMENTS.filter((tournament) => tournament.end < todaysDate)
  const matchups = playerSheets.find((playerSheet) => playerSheet.name == teamName).sheet.getMatchups();
  
  var pointsAgainst = 0;

  for (let i = 0; i < pastTournaments.length; i++) {
    const opponentScore = playerSheets.find((playerSheet) => playerSheet.name == matchups[i]).sheet.getEventTotalByEventName(pastTournaments[i].name);
    // console.log(`For team ${teamName} tournament # ${i}, opposing team ${matchups[i]} scored ${opponentScore} points`)
    pointsAgainst += parseFloat(opponentScore);
  }

  return pointsAgainst;
}

function main() {
  ctrl = new ControlPanel();
  ctrl.clearErrors();
  let tourn = new Tournament(ctrl.config.tournamentId);
  let spreadsheetIds = ctrl.config.isDev ? DEV_PLAYER_SPREADSHEET_IDS : PLAYER_SPREADSHEET_IDS;

  for (const psi of spreadsheetIds) {
    const ps = new PlayerSheet(psi.id);
    ps.getAthleteLineup().forEach((lineup) => {
      ctrl.config.rounds.forEach((round) => {
        let shouldGetData = false;

        if (ctrl.config.emptyOut) {
          ps.emptyScorecard(lineup.division, round);
        } else if (ctrl.config.overrideSkip) {
          shouldGetData = true;
        } else {
          shouldGetData = ps.getCurrentPointsSum(lineup.division, round) == 0;
        }

        try {
          if (shouldGetData) { // HERE I actually want 4 methods: strokes/stats/makes/ranking and then I'll better be able to control for no stats
            const numbers = tourn.obtainAthleteNumbers(lineup.division.substring(0, 3), round, lineup.athlete);
            return
            const athleteStats = obtainAthleteStats(lineup.athlete, ctrl.config.tournamentId, round, lineup.division.substring(0, 3));
            const properRound = ctrl.config.tournamentId == 88282 && round == 12 ? 3 : round;
            ps.writeStatsToScorecard(athleteStats, lineup.division, properRound);
            ps.writeFieldSizeAndPlayerRanking(athleteStats, lineup.division);
          } else {
            console.log(`${lineup.athlete} data for round ${round} already present. Skipping`);
          }
        } catch (e) {
          const errorMessage = `[${ps.getName()}]  Encountered error obtaining ${lineup.athlete}'s stats for round ${round}. Error: ${e} `
          console.log(errorMessage)
          ctrl.writeError(errorMessage);
        }
      })
    })
  }
}

function obtainAthleteStats(athleteName, tournamentId, round, division) {
  const athleteData = obtainAthleteData(athleteName, tournamentId, round, division);

  if (athleteData.ScoreID == null) {
    throw `${athleteName} does not have an ID for round ${round}. Have they been cut?`;
  }

  const layoutData = obtainLayoutData(tournamentId, athleteData.LayoutID);
  const holeBreakdownData = obtainHoleBreakdownData(athleteData.ScoreID);
  const throwTimelineData = obtainThrowTimelineData(athleteData.ScoreID);

  let diffs = [];
  let distputts = [];
  let acesCount = 0;
  let noStats = false;

  if (holeBreakdownData.some((hole) => hole.holeBreakdown == null)
    && !holeBreakdownData.every((hole) => hole.holeBreakdown == null)) {
      // TODON 00:
      // Rather than throwing an error here, consider this as part of no stats.
      // But in this case do a partial calc (this may need some logic considerations below)
      // Then compare the output of this partial calc to this round's noStats value.
      // Award the player the higher of those two values
    throw `Found incomplete data for ${athleteName}, skipping for now`;
  } else {
    if (holeBreakdownData.every((hole) => hole.holeBreakdown == null)) {
      noStats = true;
    }
    for (var counter = 1; counter <= holeBreakdownData.length; counter = counter + 1) {
      const score = athleteData.HoleScores[counter.toString() - 1];
      if (score == 1) {
        acesCount++;
      } else if (score != 0) {
        const par = layoutData.liveLayoutDetails[counter.toString() - 1].par;
        diffs.push(score - par);
      }
      distputts.push(...throwTimelineData.scoreThrows[counter - 1].holeThrows.map((distThrow) => {
        if (distThrow.liveScoreThrow.distanceToTarget == null && (distThrow.liveScoreThrow.zoneId == 4 || (distThrow.liveScoreThrow.zoneId == 6 && distThrow.liveScoreThrow.dropZoneId == 4))) {
          return 65 // dummy value to trigger being counted as circle 2 later
        } else if (distThrow.liveScoreThrow.distanceToTarget == null && (distThrow.liveScoreThrow.zoneId == 3 || ((distThrow.liveScoreThrow.zoneId == 6 || distThrow.liveScoreThrow.zoneId == 7) && distThrow.liveScoreThrow.dropZoneId == 3))) {
          return distThrow.liveScoreThrow.dropDistanceToTarget || 25 // dummy value to trigger being counted as circle 1 later
        } else {
          return distThrow.liveScoreThrow.distanceToTarget
        }
      }).filter((distPutt) => distPutt != null))
    }

    let result = {
      strokes: {
        doubleBogey: diffs.filter(d => d >= 2).length,
        bogey: diffs.filter(d => d === 1).length,
        par: diffs.filter(d => d === 0).length,
        birdie: diffs.filter(d => d === -1).length,
        eagle: diffs.filter(d => d === -2).length,
        albatross: diffs.filter(d => d <= -3).length
      },
      stats: noStats ? { c1r: 0, c2r: 0, parked: 0, ob: 0, ace: 0, noStats: 1 } : {
        c1r: holeBreakdownData.filter((hole) => hole.holeBreakdown.green == "c1" || hole.holeBreakdown.green == "parked").length,
        c2r: holeBreakdownData.filter((hole) => hole.holeBreakdown.green == "c2").length,
        parked: holeBreakdownData.filter((hole) => hole.holeBreakdown.green == "parked").length,
        ob: holeBreakdownData.map((hole) => hole.holeBreakdown.ob).reduce((sum, num) => sum + num),
        ace: acesCount,
        noStats: 0
      },
      makes: noStats ? { c1x: 0, c1xBonus: 0, c2: 0, c2Bonus: 0, throwIns: 0 } : {
        c1x: holeBreakdownData.filter((hole) => hole.holeBreakdown.throwIn > 10 && hole.holeBreakdown.throwIn <= 32).length,
        c1xBonus: 0,
        c2: holeBreakdownData.filter((hole) => hole.holeBreakdown.throwIn > 32 && hole.holeBreakdown.throwIn < 66).length,
        c2Bonus: 0,
        throwIns: holeBreakdownData.filter((hole) => hole.holeBreakdown.throwIn > 66).length
      },
      ranking: {
        place: athleteData.RunningPlace,
        fieldSize: getTournamentFieldSize(division, round),
      }
    };

    if (!noStats) {
      var c1xPossible = distputts.filter((attempt) => attempt > 10 && attempt <= 32).length;
      var c2Possible = distputts.filter((attempt) => attempt > 32 && attempt < 66).length;
      result.makes.c1xBonus = c1xPossible == result.makes.c1x ? result.makes.c1x : 0;
      result.makes.c2Bonus = c2Possible == result.makes.c2 ? result.makes.c2 : 0;
    }

    return result;
  }
}

function obtainLayoutData(tournamentId, layoutId) {
  if (layoutData == null) {
    var url = `https://www.pdga.com/api/v1/live-tournaments/${tournamentId}/live-layouts?include=LiveLayoutDetails`;
    var response = UrlFetchApp.fetch(url, { 'muteHttpExceptions': true });
    layoutData = JSON.parse(response.getContentText());
  }

  return layoutData.find((row) => row.layoutId == layoutId);
}

function getTournamentFieldSize(division, round) {
  return athleteData[division][round].scores.length;
}

function obtainAthleteData(athleteName, tournId, round, division) {
  if (!athleteData[division][round]) {
    //TODON: Ugly magic number cowboy-coded bullshit:
    var url = `https://www.pdga.com/apps/tournament/live-api/live_results_fetch_round?TournID=${tournId}&Division=${division}&Round=${(round == 4 && tournId == 88286) ? 12 : round}`;
    var response = UrlFetchApp.fetch(url, { 'muteHttpExceptions': true });
    freshData = JSON.parse(response.getContentText()).data;
    athleteData[division][round] = freshData
  }
  
  targetAthlete = athleteData[division][round].scores.find((athlete) => athlete.Name == athleteName);

  if (targetAthlete == null) {
    throw `Athlete ${athleteName} missing from tournament data. Are they competing?`;
  }

  return targetAthlete;
}

function obtainHoleBreakdownData(athleteScoreId) {
  var url = `https://www.pdga.com/api/v1/feat/live-scores/${athleteScoreId}/hole-breakdowns`;
  var response = UrlFetchApp.fetch(url, { 'muteHttpExceptions': true });
  const json = JSON.parse(response.getContentText());

  return json;
}

function obtainThrowTimelineData(athleteScoreId) {
  var url = `https://www.pdga.com/api/v1/feat/live-scores/${athleteScoreId}/throw-timelines`;
  var response = UrlFetchApp.fetch(url, { 'muteHttpExceptions': true });
  const json = JSON.parse(response.getContentText());

  return json;
}
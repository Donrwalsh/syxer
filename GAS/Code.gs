// v1.06
let layoutData;
let mpoAthleteData;
let fpoAthleteData;

function roundStandings() {
  ctrl = new ControlPanel();
  let spreadsheetIds = ctrl.config.isDev ? DEV_PLAYER_SPREADSHEET_IDS : PLAYER_SPREADSHEET_IDS;

  let placement = [];

  for (const psi of spreadsheetIds) {
    ps = new PlayerSheet(psi.id);
    placement.push({
      name: ps.getName(),
      record: ps.getRecord(),
      wins: ps.getRecord().split('-')[0],
      losses: ps.getRecord().split('-')[1],
      points: ps.getPointsTotal(),
      sheet: ps
    })
  }

  placement.sort(function (a, b) {
    return b.wins - a.wins || a.losses - b.losses || b.points - a.points;
  })

  standings = new Standings();
  rosterWaivers = new RosterWaivers();

  for (let i = 0; i < placement.length; i++) {
    placement[i].sheet.writeRank(i+1);
    placement[i].sheet.writeWaiver(placement.length - i);
    standings.writeToPlace(i + 1, placement[i].name, placement[i].record, placement[i].points)
    rosterWaivers.writeToWaiverPrio(i + 1, placement[i].name)
  }

}

function main() {
  ctrl = new ControlPanel();
  ctrl.clearErrors();
  let spreadsheetIds = ctrl.config.isDev ? DEV_PLAYER_SPREADSHEET_IDS : PLAYER_SPREADSHEET_IDS;

  for (const psi of spreadsheetIds) {
    const ps = new PlayerSheet(psi.id);
    ps.getAthleteLineup().forEach((lineup) => {
      ctrl.config.rounds.forEach((round) => {
        mpoAthleteData = null;
        fpoAthleteData = null;
        let shouldGetData = false;

        if (ctrl.config.emptyOut) {
          ps.emptyScorecard(lineup.division, round);
        } else if (ctrl.config.overrideSkip) {
          shouldGetData = true;
        } else {
          shouldGetData = ps.getCurrentPointsSum(lineup.division, round) == 0;
        }

        try {
          if (shouldGetData) {
            const athleteStats = obtainAthleteStats(lineup.athlete, ctrl.config.tournamentId, round, lineup.division.substring(0, 3));
            ps.writeStatsToScorecard(athleteStats, lineup.division, round);
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
  const layoutData = obtainLayoutData(tournamentId, athleteData.LayoutID);
  const holeBreakdownData = obtainHoleBreakdownData(athleteData.ScoreID);
  const throwTimelineData = obtainThrowTimelineData(athleteData.ScoreID);

  let diffs = [];
  let distputts = [];
  let acesCount = 0;
  let noStats = false;

  if (holeBreakdownData.some((hole) => hole.holeBreakdown == null)
    && !holeBreakdownData.every((hole) => hole.holeBreakdown == null)) {
    throw `Found incomplete data for ${athleteName}, skipping for now`;
  } else {
    if (holeBreakdownData.every((hole) => hole.holeBreakdown == null)) {
      noStats = true;
    }
    for (var counter = 1; counter <= 18; counter = counter + 1) {
      const score = athleteData.HoleScores[counter.toString() - 1];
      if (score == 1) {
        acesCount++;
      } else {
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
      stats: noStats ? { c1r: 0, c2r: 0, ob: 0, ace: 0, noStats: 1 } : {
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
        fieldSize: getTournamentFieldSize(division),
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

function getTournamentFieldSize(division) {
  return (division == "MPO" ? mpoAthleteData : fpoAthleteData).scores.length;
}

function obtainAthleteData(athleteName, tournId, round, division) {
  if (division == "MPO" && mpoAthleteData == null || division == "FPO" && fpoAthleteData == null) {
    var url = `https://www.pdga.com/apps/tournament/live-api/live_results_fetch_round?TournID=${tournId}&Division=${division}&Round=${round == 4 ? 12 : round}`;
    var response = UrlFetchApp.fetch(url, { 'muteHttpExceptions': true });
    athleteData = JSON.parse(response.getContentText()).data;
    if (division == "MPO") mpoAthleteData = athleteData;
    if (division == "FPO") fpoAthleteData = athleteData;    
  }

  targetAthlete = (division == "MPO" ? mpoAthleteData : fpoAthleteData).scores.find((athlete) => athlete.Name == athleteName);

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
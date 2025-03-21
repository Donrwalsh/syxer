// v1.03
let layoutData;

function roundStandings() {
  ctrl = new ControlPanel();
  let spreadsheetIds = ctrl.config.isDev ? DEV_PLAYER_SPREADSHEET_IDS : PLAYER_SPREADSHEET_IDS;

  let placement = [];

  for (const psi of spreadsheetIds) {
        var playerSpreadsheet = SpreadsheetApp.openByUrl(`${GOOGLE_URL_PREFIX}${psi.id}}`);
        var record = playerSpreadsheet.getSheetByName('Matchup').getRange('G4').getDisplayValue();
        var points = playerSpreadsheet.getSheetByName('Stats').getRange('T6').getDisplayValue();
        placement.push({
          name: psi.name,
          record: record,
          wins: record.split('-')[0],
          losses: record.split('-')[1],
          points: points,
          url: `${GOOGLE_URL_PREFIX}${psi.id}}`
        })
  }

  placement.sort(function (a, b) {
    return b.wins - a.wins || a.losses - b.losses || b.points - a.points;
  })

  standings = new Standings();
  rosterWaivers = new RosterWaivers();

  for (let i = 0; i < placement.length; i++) {
    let playerSheet = SpreadsheetApp.openByUrl(placement[i].url).getSheetByName('Matchup')
    playerSheet.getRange('G8').setValues([[i+1]])
    standings.writeToPlace(i+1, placement[i].name, placement[i].record, placement[i].points)
    rosterWaivers.writeToWaiverPrio(i+1, placement[i].name)
  }
  
}

function main() {
  ctrl = new ControlPanel();
  ctrl.clearErrors();
  let spreadsheetIds = ctrl.config.isDev ? DEV_PLAYER_SPREADSHEET_IDS : PLAYER_SPREADSHEET_IDS;

  for (const round in ctrl.config.rounds) {
    for (const psi of spreadsheetIds) {
      var playerSpreadsheet = SpreadsheetApp.openByUrl(`${GOOGLE_URL_PREFIX}${psi.id}}`);
      [
        { cell: 'B3', division: "MPO #1" },
        { cell: 'B4', division: "MPO #2" },
        { cell: 'B5', division: "MPO #3" },
        { cell: 'C3', division: "FPO #1" },
        { cell: 'C4', division: "FPO #2" },
        { cell: 'C5', division: "FPO #3" }
      ].forEach(
        (element) => updateAthleteStats(
          ctrl,
          playerSpreadsheet.getSheets()[0].getRange(element.cell).getValue(),
          ctrl.config.rounds[round], playerSpreadsheet, element.division, psi.name))
    }
  }
}

function updateAthleteStats(ctrl, athleteName, round, sheet, tab, teamName) {
  let sum = 0;
  let range = sheet.getSheetByName(tab).getRange(`${ROUND_ALPHA[round - 1]}4:${ROUND_ALPHA[round - 1]}23`).getValues()
  
  for (var i in range) {
    sum += range[i][0];
  }
  if (sum == 0 || ctrl.config.overrideSkip) {
    try {
      const athleteStats = obtainAthleteStats(athleteName, ctrl.config.tournamentId, round, tab.substring(0, 3));
      if (ctrl.config.emptyOut) {
        emptyOutSheet(sheet, tab, round);
      } else {
        writeStatsToSheet(athleteStats, sheet, tab, round);
      }
      
    } catch (e) {
      const errorMessage = `[${teamName}]  Encountered error obtaining ${athleteName}'s stats for round ${round}. Error: ${e} `
      console.log(errorMessage)
      if (ctrl.config.emptyOut) {
        emptyOutSheet(sheet, tab, round);
      }
      ctrl.writeError(errorMessage);
    }
  } else {
    console.log(`${athleteName} data for round ${round} already present. Skipping`);
  }
}

function emptyOutSheet(spreadsheet, sheetName, round) {
  var sheet = spreadsheet.getSheetByName(sheetName);
  var roundAlpha = ROUND_ALPHA[round - 1];

  // Strokes
  sheet.getRange(`${roundAlpha}4`).setValues([[0]]);
  sheet.getRange(`${roundAlpha}5`).setValues([[0]]);
  sheet.getRange(`${roundAlpha}6`).setValues([[0]]);
  sheet.getRange(`${roundAlpha}7`).setValues([[0]]);
  sheet.getRange(`${roundAlpha}8`).setValues([[0]]);
  sheet.getRange(`${roundAlpha}9`).setValues([[0]]);

  // Stats
  sheet.getRange(`${roundAlpha}12`).setValues([[0]]);
  sheet.getRange(`${roundAlpha}13`).setValues([[0]]);
  sheet.getRange(`${roundAlpha}14`).setValues([[0]]);
  sheet.getRange(`${roundAlpha}15`).setValues([[0]]);
  sheet.getRange(`${roundAlpha}16`).setValues([[0]]);

  // Makes
  sheet.getRange(`${roundAlpha}19`).setValues([[0]]);
  sheet.getRange(`${roundAlpha}20`).setValues([[0]]);
  sheet.getRange(`${roundAlpha}21`).setValues([[0]]);
  sheet.getRange(`${roundAlpha}22`).setValues([[0]]);
  sheet.getRange(`${roundAlpha}23`).setValues([[0]]);
}

function writeStatsToSheet(stats, spreadsheet, sheetName, round) {
  var sheet = spreadsheet.getSheetByName(sheetName)
  var roundAlpha = ROUND_ALPHA[round - 1];

  // Strokes
  sheet.getRange(`${roundAlpha}4`).setValues([[stats.strokes.doubleBogey.toString()]]);
  sheet.getRange(`${roundAlpha}5`).setValues([[stats.strokes.bogey.toString()]]);
  sheet.getRange(`${roundAlpha}6`).setValues([[stats.strokes.par.toString()]]);
  sheet.getRange(`${roundAlpha}7`).setValues([[stats.strokes.birdie.toString()]]);
  sheet.getRange(`${roundAlpha}8`).setValues([[stats.strokes.eagle.toString()]]);
  sheet.getRange(`${roundAlpha}9`).setValues([[stats.strokes.albatross.toString()]]);

  // Stats
  sheet.getRange(`${roundAlpha}12`).setValues([[stats.stats.c1r.toString()]]);
  sheet.getRange(`${roundAlpha}13`).setValues([[stats.stats.c2r.toString()]]);
  sheet.getRange(`${roundAlpha}14`).setValues([[stats.stats.ob.toString()]]);
  sheet.getRange(`${roundAlpha}15`).setValues([[stats.stats.ace.toString()]]);
  sheet.getRange(`${roundAlpha}16`).setValues([[stats.stats.noStats.toString()]]);

  // Makes
  sheet.getRange(`${roundAlpha}19`).setValues([[stats.makes.c1x.toString()]]);
  sheet.getRange(`${roundAlpha}20`).setValues([[stats.makes.c1xBonus.toString()]]);
  sheet.getRange(`${roundAlpha}21`).setValues([[stats.makes.c2.toString()]]);
  sheet.getRange(`${roundAlpha}22`).setValues([[stats.makes.c2Bonus.toString()]]);
  sheet.getRange(`${roundAlpha}23`).setValues([[stats.makes.throwIns.toString()]]);
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
        } else if (distThrow.liveScoreThrow.distanceToTarget == null && (distThrow.liveScoreThrow.zoneId == 3 || (distThrow.liveScoreThrow.zoneId == 6 && distThrow.liveScoreThrow.dropZoneId == 3))) {
          return 25 // dummy value to trigger being counted as circle 1 later
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

function obtainAthleteData(athleteName, tournId, round, division) {
  var url = `https://www.pdga.com/apps/tournament/live-api/live_results_fetch_round?TournID=${tournId}&Division=${division}&Round=${round}`;
  var response = UrlFetchApp.fetch(url, { 'muteHttpExceptions': true });
  const json = JSON.parse(response.getContentText());

  targetAthlete = json.data.scores.find((athlete) => athlete.Name == athleteName);

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
// v1.01
const GOOGLE_URL_PREFIX = 'https://docs.google.com/spreadsheets/d/';
const ROUND_ALPHA = ["D", "G", "J", "M", "P"]

let layoutData;
let homeSheetCounter = 1;

// Control Panel:
const tournamentId = 88276; // Discraft Supreme Flight Open
const rounds = [1, 2, 3]
const overrideSkip = false;

const playerSpreadsheetIds = [
  { id: '1uVEARqNbGgES_16-PmFe5Fq25sSj9fkmWusW5EUdvr0/edit?gid=1623859890', name: "Synxy Mynxes" },
  { id: '19VsPtTxMgMfNmo31L3oRDXW8eS2daqIibqAjo3x3cic/edit?gid=1623859890', name: "Ginter" },
  { id: '1eN7tZq_WbBh9d5_ecBLW6oiBDENsWVhMekpjtkdl9oI/edit?gid=1623859890', name: "Langster's Paradise" },
  { id: '1hor7h02srtq8grLWJK2nYZYKNVAz6CJJnbaqBEJsNhc/edit?gid=1623859890', name: "Phenomenal Raptors" },
  { id: '1b9alrHxLK0nDar-GKrqu2-KthxjzALiQ88laPighO3U/edit?gid=1623859890', name: "Teem 5" },
  { id: '1cRcYl1Cd-KG5uRj-KSXNn38Dr1BQNSzrLM0ywAEF8aY/edit?gid=1623859890', name: "Laura" },
  { id: '1t5V0yhtqJgU5pta1rmg9rwiEtlGoaddf5LjrkHgrRuA/edit?gid=1623859890', name: "Bajari" },
  { id: '1DQDMgiXozCxEKbpOD3Zi4sPV_zZTMAaZ6ueiFhuuYpA/edit?gid=1623859890', name: "Ali" },
  { id: '1RnVrJ01zdvbfhk0q3S8TMtgPBXA5y11P1NwK2eOMk_k/edit?gid=1623859890', name: "Boost It" },
  { id: '1OOn4SzHDwwh0xaWXIpRBAwiH8HcLvhwhXJwU3PqQ__I/edit?gid=1623859890', name: "Jame Team" }
];
const devPlayerSpreadSheetIds = [
  { id: '1vbUcgMMRiH41GpdTqgqQklRRVH-W_k8LKdosaEbcXJ8/edit?gid=1623859890', name: "Don" },
]
// End Control Panel

function main() {
  var homeSS = SpreadsheetApp.getActiveSpreadsheet();
  var home = homeSS.getSheetByName('Magic')
  home.deleteColumn(1);

  for (const round in rounds) {
    for (const psi of devPlayerSpreadSheetIds) {
      var ss = SpreadsheetApp.openByUrl(`${GOOGLE_URL_PREFIX}${psi.id}}`);
      var sheets = ss.getSheets();

      [
        { cell: 'B3', division: "MPO #1" },
        { cell: 'B4', division: "MPO #2" },
        { cell: 'B5', division: "MPO #3" },
        { cell: 'C3', division: "FPO #1" },
        { cell: 'C4', division: "FPO #2" },
        { cell: 'C5', division: "FPO #3" }
      ].forEach(
        (element) => updateAthleteStats(
          sheets[0].getRange(element.cell).getValue(),
          rounds[round], ss, element.division, home, psi.name))
    }
  }
}

function updateAthleteStats(athleteName, round, sheet, tab, homeSheet, teamName) {
  if (![1, 2, 3, 4, 5].includes(round)) {
    throw `Error. Invalid Round Param ${round}`;
  }

  let sum = 0;
  let range = sheet.getSheetByName(tab).getRange(`${ROUND_ALPHA[round - 1]}4:${ROUND_ALPHA[round - 1]}23`).getValues()
  
  for (var i in range) {
    sum += range[i][0];
  }
  if (sum == 0 || overrideSkip) {
    try {
      const athleteStats = obtainAthleteStats(athleteName, tournamentId, round, tab.substring(0, 3));
      writeStatsToSheet(athleteStats, sheet, tab, round);
    } catch (e) {
      const errorMessage = `[${teamName}]  Encountered error obtaining ${athleteName}'s stats for round ${round}. Error: ${e} `
      console.log(errorMessage)
      homeSheet.getRange(`A${homeSheetCounter}`).setValues([[errorMessage]]);
      homeSheetCounter++;
    }
  } else {
    console.log(`${athleteName} data for round ${round} already present. Skipping`);
  }
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
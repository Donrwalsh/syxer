// v1.09c - cowboy coded bullshit const ROUND_ALPHA = ["D", "G", "J", "M", "P"]

class PlayerSheet {
  constructor(id) {
    this.ss = SpreadsheetApp.openByUrl(`${GOOGLE_URL_PREFIX}${id}`);
    this.matchup = this.ss.getSheetByName('Matchup');
    this.roster = this.ss.getSheetByName('Roster');
    this.stats = this.ss.getSheetByName('Stats');
  }

  doTheCopyThing(sheet, sourceRange, destinationRange) {
    var source = sheet.getRange(sourceRange);
    var destination = sheet.getRange(destinationRange);

    // const destinationValues = destination.getValues();
    // const hasValue = destinationValues.flat().some(cell => cell !== "");

    // if (hasValue) {
    //   console.log("I found values");
    // } else {
      source.copyTo(destination, SpreadsheetApp.CopyPasteType.PASTE_FORMULA, false);
      source.copyTo(source, SpreadsheetApp.CopyPasteType.PASTE_VALUES, false);
    // }



  }

  getTournIndex(tournId) {
    const tournament = TOURNAMENTS.find((tourn) => tourn.id == tournId);
    if (!tournament) {
      throw Error ("Couldn't find tournamnet");
    }
    const n = TOURNAMENTS.findIndex((tourn) => tourn.name == tournament.name);
    return n;
  }

  updateOpponentMatchupTab(tournId) {
    var sheet = this.getSheet('Matchup');
    var tournN = this.getTournIndex(tournId);
    var oppoName = this.getOpponentForTourn(tournN);
    var opponent = PLAYER_SPREADSHEET_IDS.find((player) => player.name == oppoName);
    var commonStart = `=IMPORTRANGE("https://docs.google.com/spreadsheets/d/${opponent.id}"`;

    [
      ["L4", `"'Roster'!B1"`],
      ["L5", `"'Roster'!B3"`],
      ["M5", `"'Matchup'!J5"`],
      ["L7", `"'Roster'!B4"`],  
      ["M7", `"'Matchup'!J7"`],
      ["L9", `"'Roster'!B5"`],
      ["M9", `"'Matchup'!J9"`],
      ["L11", `"'Roster'!C3"`],
      ["M11", `"'Matchup'!J11"`],
      ["L13", `"'Roster'!C4"`],
      ["M13", `"'Matchup'!J13"`],
      ["L15", `"'Roster'!B8"`],
      ["M15", `"'Matchup'!J15"`],
      ["M18", `"'Matchup'!J18"`],
      ["L24", `"'Roster'!B10"`],
      ["M24", `"'Matchup'!J24"`],
      ["L26", `"'Roster'!B11"`],
      ["M26", `"'Matchup'!J26"`],
      ["L28", `"'Roster'!C10"`],
      ["M28", `"'Matchup'!J28"`],
      ["L30", `"'Roster'!C11"`],
      ["M30", `"'Matchup'!J30"`],
    ].map(
      (kvp) => sheet.getRange(kvp[0]).setValue(`${commonStart},${kvp[1]})`))
  }

  makeScoreboardForTournament(tournId) {
    var sheet = this.getSheet('Matchup');
    const n = this.getTournIndex(tournId);
    const hPosition = 36 + 31 * (n-1); // This will break if n is 0

    // Define the source range you want to copy
    var source = sheet.getRange(`H2:O32`)

    // Define the destination start cell
    // The destination only needs the top-left cell; the rest fills automatically

    var destination = sheet.getRange(`H${hPosition}`); 

    // 1. Paste the formatting only
    source.copyTo(destination, SpreadsheetApp.CopyPasteType.PASTE_FORMAT, false);

    // 2. Paste the values only (overwrites formulas with their results)
    source.copyTo(destination, SpreadsheetApp.CopyPasteType.PASTE_VALUES, false);
  }

  statsTabRollover(tournId) {
    var sheet = this.getSheet('Stats');
    const n = this.getTournIndex(tournId);

    this.doTheCopyThing(sheet, `H${15 + 13 * (n - 1)}:AA${20 + 13 * (n-1)}`, `H${15 + 13 * n}:AA${20 + 13 * n}`)
  }

  eventTotalsTabRollover(tournId) {
    var sheet = this.getSheet('Event Totals');
    const n = this.getTournIndex(tournId);

    function stuff(n) {
      if (n == 16 | n == 17) {
        return `${n == 16 ? 'F' : 'J'}67:${n == 16 ? 'G' : 'O'}72`
      }

      if (n > 17) {
        n = n + 2;
      }

      let startRowLetter = ["B", "F", "J", "N"][n % 4];
      let endRowLetter = ["C", "G", "K", "O"][n % 4];
      return `${startRowLetter}${7 + 15 * Math.floor(n / 4)}:${endRowLetter}${12 + 15 * Math.floor(n / 4)}`
    }

    this.doTheCopyThing(sheet, stuff(n-1), stuff(n));

    // 0 ~ B7:C12
    // 1 ~ F7:G12
    // 2 ~ J7:K12
    // 3 ~ N7:O12
    // 4 ~ B22:C27

    // 7 ~ N22:O27
    // ~~~

    // 16 ~ F67:G72
    // 17 ~ J67:O72

    // 18 ~ as 20
    // 19 ~ as 21
    // 20 ~ as 22
  }

  getSheet(division) {
    if (division.includes("BENCH")) {
      return this.ss.getSheetByName(division.substring(0, 5));
    } else {
      return this.ss.getSheetByName(division);
    }
  }

  emptyScorecard(division, round) {
    var sheet = this.getSheet(division);
    var magicNumbers = ['4', '5', '6', '7', '8', '9', '12', '13', '14', '15', '16', '17', '18', '21', '22', '23', '24', '25'];
    var benchPos = 0;

    if (division.includes("BENCH")) {
      benchPos = parseInt(division.charAt(6));
      magicNumbers = magicNumbers.map((m => parseInt(m) + (28 * benchPos)));
    }

    magicNumbers.forEach((int) => sheet.getRange(`${ROUND_ALPHA[round == 12 ? 4 : round - 1]}${int}`).setValues([[0]]))

    sheet.getRange(`V${9 + 28 * benchPos}`).setValues([['']]);
    sheet.getRange(`V${12 + 28 * benchPos}`).setValues([['']]);
  }

  getAthleteFromStats(tourn, slot) {
    return this.stats.getRange(`K${13 * tourn + slot + 1}`).getDisplayValue();
  }

  getAthleteLineup() {
    return [
      { div: "MPO", division: "MPO #1", athlete: this.roster.getRange('B3').getDisplayValue() },
      { div: "MPO", division: "MPO #2", athlete: this.roster.getRange('B4').getDisplayValue() },
      { div: "MPO", division: "MPO #3", athlete: this.roster.getRange('B5').getDisplayValue() },
      { div: "FPO", division: "FPO #1", athlete: this.roster.getRange('C3').getDisplayValue() },
      { div: "FPO", division: "FPO #2", athlete: this.roster.getRange('C4').getDisplayValue() },
      { div: "???", division: "FLEX", athlete: this.roster.getRange('B8').getDisplayValue() },
      { div: "???", division: "BENCH-0", athlete: this.roster.getRange('B10').getDisplayValue() },
      { div: "???", division: "BENCH-1", athlete: this.roster.getRange('B11').getDisplayValue() },
      { div: "???", division: "BENCH-2", athlete: this.roster.getRange('C10').getDisplayValue() },
      { div: "???", division: "BENCH-3", athlete: this.roster.getRange('C11').getDisplayValue() },
    ]
  }

  getCurrentPointsSum(tab, round) {
    // TODON: idk why the other fix isn't working, but this exists now:
    const annoying = round == 12 ? 5 : round;
    let range = this.ss.getSheetByName(tab).getRange(`${ROUND_ALPHA[annoying - 1]}4:${ROUND_ALPHA[annoying - 1]}23`).getValues();
    return range.reduce(
      (acc, cv) => acc + (parseInt(cv) || 0), 0
    )
  }

  getEventTotalByEventName(eventName) {
    //TODON untested
    return this.ss.getSheetByName('Event Totals').getRange(TOURNAMENTS.find((tournament) => tournament.name == eventName).cell).getDisplayValue();
  }

  // Note that this only goes to week 18
  getMatchups() {
    let matchups = [];

    ['5', '6', '7', '8', '9', '10', '11', '12', '13', '14', '15', '16', '17', '18', '19', '20', '21', '22']
      .forEach((int) => matchups.push(this.matchup.getRange(`D${int}`).getDisplayValue()));
    return matchups
  }

  getName() {
    return this.roster.getRange('B1').getDisplayValue();
  }

  getPointsTotal() {
    return this.ss.getSheetByName('Stats').getRange('T6').getDisplayValue();
  }

  getRecord() {
    return this.matchup.getRange('G4').getDisplayValue();
  }

  writeFieldSizeAndPlayerRanking(stats, division) {
    var sheet = this.getSheet(division);
    var benchPos = division.includes("BENCH") ? parseInt(division.charAt(6)) : 0;
    var benchOffset = benchPos * 28;
    sheet.getRange(`V${9 + benchOffset}`).setValues([[stats.ranking.fieldSize.toString()]]);
    sheet.getRange(`V${12 + benchOffset}`).setValues([[stats.ranking.place.toString()]]);
  }

  writeRank(rank) {
    this.matchup.getRange('G8').setValues([[rank]])
  }

  writeStatsToScorecard(stats, division, round) {
    var sheet = this.getSheet(division);
    var roundAlpha = ROUND_ALPHA[round - 1];
    var benchPos = division.includes("BENCH") ? parseInt(division.charAt(6)) : 0;
    var benchOffset = benchPos * 28;

    // Strokes
    sheet.getRange(`${roundAlpha}${4 + benchOffset }`).setValues([[stats.strokes.doubleBogey.toString()]]);
    sheet.getRange(`${roundAlpha}${5 + benchOffset }`).setValues([[stats.strokes.bogey.toString()]]);
    sheet.getRange(`${roundAlpha}${6 + benchOffset }`).setValues([[stats.strokes.par.toString()]]);
    sheet.getRange(`${roundAlpha}${7 + benchOffset }`).setValues([[stats.strokes.birdie.toString()]]);
    sheet.getRange(`${roundAlpha}${8 + benchOffset }`).setValues([[stats.strokes.eagle.toString()]]);
    sheet.getRange(`${roundAlpha}${9 + benchOffset }`).setValues([[stats.strokes.albatross.toString()]]);

    // Stats
    sheet.getRange(`${roundAlpha}${12 + benchOffset }`).setValues([[stats.stats.c1r.toString()]]);
    sheet.getRange(`${roundAlpha}${13 + benchOffset }`).setValues([[stats.stats.c2r.toString()]]);
    sheet.getRange(`${roundAlpha}${14 + benchOffset }`).setValues([[stats.stats.parked.toString()]]);
    sheet.getRange(`${roundAlpha}${15 + benchOffset }`).setValues([[stats.stats.ob.toString()]]);
    sheet.getRange(`${roundAlpha}${16 + benchOffset }`).setValues([[stats.stats.ace.toString()]]);
    sheet.getRange(`${roundAlpha}${17 + benchOffset }`).setValues([[stats.stats.hotRound.toString()]]);
    sheet.getRange(`${roundAlpha}${18 + benchOffset }`).setValues([[stats.stats.noStats.toString()]]);

    // Makes
    sheet.getRange(`${roundAlpha}${21 + benchOffset }`).setValues([[stats.makes.c1x.toString()]]);
    sheet.getRange(`${roundAlpha}${22 + benchOffset }`).setValues([[stats.makes.c1xBonus.toString()]]);
    sheet.getRange(`${roundAlpha}${23 + benchOffset }`).setValues([[stats.makes.c2.toString()]]);
    sheet.getRange(`${roundAlpha}${24 + benchOffset }`).setValues([[stats.makes.c2Bonus.toString()]]);
    sheet.getRange(`${roundAlpha}${25 + benchOffset }`).setValues([[stats.makes.throwIns.toString()]]);
  }

  writeWaiver(rank) {
    this.matchup.getRange('G13').setValues([[rank]])
  }

  writeLoss(tournN) {
    this.matchup.getRange(`E${5+tournN}`).setValue("L");
  }

  writeWin(tournN) {
    this.matchup.getRange(`E${5+tournN}`).setValue("W");
  }

  getOpponentForTourn(tournN) {
    return this.matchup.getRange(`D${5+tournN}`).getDisplayValue();
  }
}
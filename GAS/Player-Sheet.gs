// v1.09c - cowboy coded bullshit

class PlayerSheet {
  constructor(id) {
    this.ss = SpreadsheetApp.openByUrl(`${GOOGLE_URL_PREFIX}${id}}`);
    this.matchup = this.ss.getSheetByName('Matchup');
    this.roster = this.ss.getSheetByName('Roster');
  }

  emptyScorecard(division, round) {
    var sheet = this.ss.getSheetByName(division);

    ['4', '5', '6', '7', '8', '9', '10', '11', '12', '13', '14', '15', '16', '17', '18', '19', '20', '21', '22']
      .forEach((int) => sheet.getRange(`${ROUND_ALPHA[round - 1]}${int}`).setValues([[0]]))

    sheet.getRange('V12').setValues([['']]);
  }

  getAthleteLineup() {
    return [
      { division: "MPO #1", athlete: this.roster.getRange('B3').getDisplayValue() },
      { division: "MPO #2", athlete: this.roster.getRange('B4').getDisplayValue() },
      { division: "MPO #3", athlete: this.roster.getRange('B5').getDisplayValue() },
      { division: "FPO #1", athlete: this.roster.getRange('C3').getDisplayValue() },
      { division: "FPO #2", athlete: this.roster.getRange('C4').getDisplayValue() },
      { division: "FPO #3", athlete: this.roster.getRange('C5').getDisplayValue() }
    ]
  }

  getCurrentPointsSum(tab, round) {
    let range = this.ss.getSheetByName(tab).getRange(`${ROUND_ALPHA[round - 1]}4:${ROUND_ALPHA[round - 1]}23`).getValues();
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
    var sheet = this.ss.getSheetByName(division);
    sheet.getRange(`V9`).setValues([[stats.ranking.fieldSize.toString()]]);
    sheet.getRange(`V12`).setValues([[stats.ranking.place.toString()]]);
  }

  writeRank(rank) {
    this.matchup.getRange('G8').setValues([[rank]])
  }

  writeStatsToScorecard(stats, division, round) {
    var sheet = this.ss.getSheetByName(division);
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
    sheet.getRange(`${roundAlpha}14`).setValues([[stats.stats.parked.toString()]]);
    sheet.getRange(`${roundAlpha}15`).setValues([[stats.stats.ob.toString()]]);
    sheet.getRange(`${roundAlpha}16`).setValues([[stats.stats.ace.toString()]]);
    sheet.getRange(`${roundAlpha}17`).setValues([[stats.stats.noStats.toString()]]);

    // Makes
    sheet.getRange(`${roundAlpha}20`).setValues([[stats.makes.c1x.toString()]]);
    sheet.getRange(`${roundAlpha}21`).setValues([[stats.makes.c1xBonus.toString()]]);
    sheet.getRange(`${roundAlpha}22`).setValues([[stats.makes.c2.toString()]]);
    sheet.getRange(`${roundAlpha}23`).setValues([[stats.makes.c2Bonus.toString()]]);
    sheet.getRange(`${roundAlpha}24`).setValues([[stats.makes.throwIns.toString()]]);
  }

  writeWaiver(rank) {
    this.matchup.getRange('G13').setValues([[rank]])
  }
}
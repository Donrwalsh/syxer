// v1.08

class Standings {
  constructor() {
    this.ss = SpreadsheetApp.getActiveSpreadsheet();
    this.sheet = this.ss.getSheetByName('Standings');
  }

  writeToPlace(place, teamName, record, pointsFor, pointsAgainst) {
    this.sheet.getRange(`R${4 + place}`).setValues([[teamName]]);
    this.sheet.getRange(`S${4 + place}`).setValues([[record]]);
    this.sheet.getRange(`T${4 + place}`).setValues([[pointsFor]]);
    this.sheet.getRange(`U${4 + place}`).setValues([[pointsAgainst]]);
  }

  markResultsForTourn(tournN) {
    let scoreRowLetter = ["D", "I", "N"][tournN % 3];
    let nameRowLetter = ["C", "H", "M"][tournN % 3];
    let endRowLetter = ["E", "J", "O"][tournN % 3];

    let rowNum = Math.floor(tournN/3) * 16 + 5;

    let theWinners = [];

    for (let i = 0; i < 6; i++) {
      let scoreA = this.sheet.getRange(`${scoreRowLetter}${rowNum+(i*2)}`).getValue();
      let scoreB = this.sheet.getRange(`${scoreRowLetter}${rowNum+(i*2)+1}`).getValue();

      const winningRange = scoreA >= scoreB ? this.sheet.getRange(`${nameRowLetter}${rowNum+(i*2)}:${endRowLetter}${rowNum+(i*2)}`) : this.sheet.getRange(`${nameRowLetter}${rowNum+(i*2+1)}:${endRowLetter}${rowNum+(i*2+1)}`);

      const losingRange = scoreA >= scoreB ? this.sheet.getRange(`${nameRowLetter}${rowNum+(i*2+1)}:${endRowLetter}${rowNum+(i*2+1)}`) : this.sheet.getRange(`${nameRowLetter}${rowNum+(i*2)}:${endRowLetter}${rowNum+(i*2)}`);
  
      theWinners.push(this.sheet.getRange(`${nameRowLetter}${scoreA >= scoreB ? rowNum +(i*2) : rowNum + (i*2) +1}`).getValue())

      winningRange.setFontWeight("bold");
      losingRange.setFontStyle("italic");
    }

    return theWinners;
  }

  setupMatchupsForTourn(tournN) {
    function getRandomItem(array) {
      const randomIndex = Math.floor(Math.random() * array.length);
      return array[randomIndex];
    }
    let scoreRowLetter = ["D", "I", "N"][tournN % 3];
    let nameRowLetter = ["C", "H", "M"][tournN % 3];
    let endRowLetter = ["E", "J", "O"][tournN % 3];
    let rowNum = Math.floor(tournN/3) * 16 + 5;

    let psi = [...PLAYER_SPREADSHEET_IDS];

    for (let i = 0; i < 6; i++) {
      let player = getRandomItem(psi);
      this.sheet.getRange(`${nameRowLetter}${rowNum}`).setValue(`=IMPORTRANGE("${GOOGLE_URL_PREFIX}${player.id}","'Roster'!B1")`);
      this.sheet.getRange(`${scoreRowLetter}${rowNum}`).setValue(`=IMPORTRANGE("${GOOGLE_URL_PREFIX}${player.id}","'Matchup'!J18")`);
      this.sheet.getRange(`${endRowLetter}${rowNum}`).setValue(`=IMPORTRANGE("${GOOGLE_URL_PREFIX}${player.id}","'Matchup'!G4")`);

      psi = psi.filter((ps) => ps.id != player.id);
      rowNum++;

      let playerSheet = new PlayerSheet(player.id);
      let opponentName = playerSheet.getOpponentForTourn(tournN);

      let opponent = psi.find((ps) => ps.name == opponentName);
      this.sheet.getRange(`${nameRowLetter}${rowNum}`).setValue(`=IMPORTRANGE("${GOOGLE_URL_PREFIX}${opponent.id}","'Roster'!B1")`);
      this.sheet.getRange(`${scoreRowLetter}${rowNum}`).setValue(`=IMPORTRANGE("${GOOGLE_URL_PREFIX}${opponent.id}","'Matchup'!J18")`);
      this.sheet.getRange(`${endRowLetter}${rowNum}`).setValue(`=IMPORTRANGE("${GOOGLE_URL_PREFIX}${opponent.id}","'Matchup'!G4")`);
      psi = psi.filter((ps) => ps.id != opponent.id);
      rowNum++;
    }    
  }

  markStandingsStaticForTourn(tournN) {
    let nameRowLetter = ["C", "H", "M"][tournN % 3];
    let endRowLetter = ["E", "J", "O"][tournN % 3];

    let rowNum = Math.floor(tournN/3) * 16 + 5;

    for (let i = 0; i < 13; i++) {
      let range = this.sheet.getRange(`${nameRowLetter}${rowNum+i}:${endRowLetter}${rowNum+i}`);
      range.setValues(range.getValues());
    }
  }
}

class RosterWaivers {
  constructor() {
    this.ss = SpreadsheetApp.getActiveSpreadsheet();
    this.sheet = this.ss.getSheetByName('Rosters/Waivers');
  }
  
  writeToWaiverPrio(place, teamName) {
    this.sheet.getRange(`K${19 - place}`).setValues([[teamName]]);
  }
}

class ControlPanel {
  constructor() {
    this.homeSS = SpreadsheetApp.getActiveSpreadsheet();
    this.homeSheet = this.homeSS.getSheetByName('Control-Panel');

    this.config = {
      isDev: this.homeSS.getId() == DEV_SPREADSHEET_APP_ID,
      overrideSkip: this.homeSheet.getRange("A3").getValue(),
      emptyOut: this.homeSheet.getRange("B3").getValue(),
      rounds: [
        ...(this.homeSheet.getRange("C3").getValue() ? [1] : []),
        ...(this.homeSheet.getRange("D3").getValue() ? [2] : []),
        ...(this.homeSheet.getRange("E3").getValue() ? [this.homeSheet.getRange("G3").getValue() == 'Music City Open' ? 12 : 3] : []),
        ...(this.homeSheet.getRange("F3").getValue() ? [4] : []),
        ...(this.homeSheet.getRange("G3").getValue() ? [12] : []),
      ],
      tournamentId: TOURNAMENTS.find((tournament) => tournament.name == this.homeSheet.getRange("H3").getValue()).id
    }

    // Errors List Cell
    this.elc = { x: 'A', y: 7 };
    this.errorsListRange = `${this.elc.x}${this.elc.y}:${this.elc.x}${this.elc.y + 300}`
  }

  clearErrors() {
    this.homeSheet.getRange(this.errorsListRange).clearContent()
  }

  writeError(errorMessage) {
    this.homeSheet.getRange(`${this.elc.x}${this.elc.y}`).setValues([[errorMessage]]);
    this.elc.y++;
  }
}

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
}

class RosterWaivers {
  constructor() {
    this.ss = SpreadsheetApp.getActiveSpreadsheet();
    this.sheet = this.ss.getSheetByName('Rosters/Waivers');
  }
  
  writeToWaiverPrio(place, teamName) {
    this.sheet.getRange(`O${14 - place}`).setValues([[teamName]]);
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
      ],
      tournamentId: TOURNAMENTS.find((tournament) => tournament.name == this.homeSheet.getRange("G3").getValue()).id
    }

    // Errors List Cell
    this.elc = { x: 'A', y: 7 };
    this.errorsListRange = `${this.elc.x}${this.elc.y}:${this.elc.x}${this.elc.y + 30}`
  }

  clearErrors() {
    this.homeSheet.getRange(this.errorsListRange).clearContent()
  }

  writeError(errorMessage) {
    this.homeSheet.getRange(`${this.elc.x}${this.elc.y}`).setValues([[errorMessage]]);
    this.elc.y++;
  }
}

class ControlPanel {
  constructor() {
    this.homeSS = SpreadsheetApp.getActiveSpreadsheet();
    this.homeSheet = this.homeSS.getSheetByName('Control-Panel');
    
    // Errors List Cell
    this.elc = { x: 'A', y: 7 };
    this.errorsListRange = `${this.elc.x}${this.elc.y}:${this.elc.x}${this.elc.y+30}`
  }

  devCheck() { 
    if (!isDev && this.homeSS.getId() == DEV_SPREADSHEET_APP) {
      throw new Error("It looks like you're trying to run prod code on the dev spreadsheet - terminating.");
    }
  }

  clearErrors() {
    this.homeSheet.getRange(this.errorsListRange).clearContent()  
  }

  writeError(errorMessage) {
    this.homeSheet.getRange(`${this.elc.x}${this.elc.y}`).setValues([[errorMessage]]);
    this.elc.y++;
  }
}

const DEV_SPREADSHEET_APP = '1lze7Z7bbPDIQRUaCagSQWXESewI7kqVfgQa5nitPRFM';

const isDev = true;

// const tournamentId = 88276; // Discraft Supreme Flight Open
const tournamentId = 88277; // Prodigy presents WACO
const rounds = [1, 2, 3]

const overrideSkip = false;
const emptyingOut = false;

const devPlayerSpreadSheetIds = [
  { id: '1vbUcgMMRiH41GpdTqgqQklRRVH-W_k8LKdosaEbcXJ8/edit?gid=1623859890', name: "Don" },
];

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

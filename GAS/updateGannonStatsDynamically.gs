function updateGannonStatsDynamically() {
  var ss = SpreadsheetApp.getActiveSpreadsheet();
  var sheet = ss.getSheetByName('MPO #3')
  var data = obtainGannonData();

    /////////////
   // Strokes //
  /////////////

  // Double Bogey+
  sheet.getRange("D4").setValues([[data.strokes.doubleBogey.toString()]]);

  // Bogey
  sheet.getRange("D5").setValues([[data.strokes.bogey.toString()]]);

  // Par
  sheet.getRange("D6").setValues([[data.strokes.par.toString()]]);

  // Birdie
  sheet.getRange("D7").setValues([[data.strokes.birdie.toString()]]);

  //Eagle
  sheet.getRange("D8").setValues([[data.strokes.eagle.toString()]]);

  //Albatross
  sheet.getRange("D9").setValues([[data.strokes.albatross.toString()]]);

    ///////////
   // Stats //
  ///////////

  // C1R
  sheet.getRange("D12").setValues([[data.stats.c1r.toString()]]);

  // C2R
  sheet.getRange("D13").setValues([[data.stats.c2r.toString()]]);

  // OB
  sheet.getRange("D14").setValues([[data.stats.ob.toString()]]);

  // Ace
  sheet.getRange("D15").setValues([[data.stats.ace.toString()]]);

  // No Stats
  sheet.getRange("D16").setValues([[data.stats.noStats.toString()]]);

}
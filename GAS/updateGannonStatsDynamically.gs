function updateGannonStatsDynamically() {
  var ss = SpreadsheetApp.getActiveSpreadsheet();
  var sheet = ss.getSheetByName('MPO #3')
  var stats = obtainGannonData();

    /////////////
   // Strokes //
  /////////////

  // Double Bogey+
  sheet.getRange("D4").setValues([[stats.doubleBogey.toString()]]);

  // Bogey
  sheet.getRange("D5").setValues([[stats.bogey.toString()]]);

  // Par
  sheet.getRange("D6").setValues([[stats.par.toString()]]);

  // Birdie
  sheet.getRange("D7").setValues([[stats.birdy.toString()]]);

  //Eagle
  sheet.getRange("D8").setValues([[stats.eagle.toString()]]);

  //Albatross
  sheet.getRange("D9").setValues([[stats.albatross.toString()]]);


}
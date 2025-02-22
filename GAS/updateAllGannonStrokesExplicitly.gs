function updateAllGannonStrokesExplicitly() {
  var ss = SpreadsheetApp.getActiveSpreadsheet();
  var sheet = ss.getSheetByName("MPO #3");

  sheet.getRange("D4").setValues([["1"]]);
  sheet.getRange("D5").setValues([["1"]]);
  sheet.getRange("D6").setValues([["5"]]);
  sheet.getRange("D7").setValues([["11"]]);
}

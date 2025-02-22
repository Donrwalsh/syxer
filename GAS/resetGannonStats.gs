function resetGannonStats() {
  var ss = SpreadsheetApp.getActiveSpreadsheet();
  var sheet = ss.getSheetByName('MPO #3')

    /////////////
   // Strokes //
  /////////////
  
  // Double Bogey+
  sheet.getRange("D4").setValues([['0']]);

  // Bogey
  sheet.getRange("D5").setValues([['0']]);

  // Par
  sheet.getRange("D6").setValues([['0']]);

  // Birdie
  sheet.getRange("D7").setValues([['0']]);

  //Eagle
  sheet.getRange("D8").setValues([['0']]);

  //Albatross
  sheet.getRange("D9").setValues([['0']]);


    ///////////
   // Stats //
  ///////////

  // C1R
  sheet.getRange("D12").setValues([['0']]);

  // C2R (Difference)
  sheet.getRange("D13").setValues([['0']]);

  // OB
  sheet.getRange("D14").setValues([['0']]);

  // ACE
  sheet.getRange("D15").setValues([['0']]);

  // No Stats
  sheet.getRange("D16").setValues([['0']]);
  
    ///////////
   // Makes //
  ///////////

  // C1X Makes
  sheet.getRange("D19").setValues([['0']]);

  // 100% C1X Bonus
  sheet.getRange("D20").setValues([['0']]);

  // C2 Makes
  sheet.getRange("D21").setValues([['0']]);

  // 100% C2 Bonus
  sheet.getRange("D22").setValues([['0']]);

  // Throw-Ins (67+)
  sheet.getRange("D23").setValues([['0']]);

}

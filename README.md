# syxer

## Train of Thought / Working Notes

#### 2/21/25

I will need code that writes to a spreadsheet. Google Script is how I will do this since it is native to the spreadsheet program being used. I don't remember how to work with Google Scripts in the slightest. Looks like you just use **Extensions** > **Apps Script** to get to the interface.

[This](https://docs.google.com/spreadsheets/d/1uVEARqNbGgES_16-PmFe5Fq25sSj9fkmWusW5EUdvr0/edit?gid=1534554294#gid=1534554294) is the ultimate destination sheet but I'll work with a [copy](https://docs.google.com/spreadsheets/d/1lze7Z7bbPDIQRUaCagSQWXESewI7kqVfgQa5nitPRFM/edit?gid=1623859890#gid=1623859890) for now.

And here we are at the Google Apps Script (gas) interface. I'll need to remind myself how to use this interface. Let's think about what this interface needs to facilitate:

- obtain correct data
- determine where that data goes on the spreadsheet
- write data into a specified spreadsheet cell
- repeat periodically

#### 2/22/25

I'm eating breakfast and looking at the mapping from Gannon's stats to the spreadsheet. C1R/C2R sound complicated so I won't mess with those for now. Populating the Strokes section looks straightforward and note that I'll only be touching the D column Result data - Points and total are calculated but aren't shaded a different color so keep that in mind. The structure of this top bit is built based on ease of data entry so also consider it possible to change and such.

Anyway, I want to start with writing data into a specified spreadsheet cell, that seems the most basic of the 4 tasks I need GAS to accomplish.

So I find [Read & write cell values](https://developers.google.com/sheets/api/guides/values) but I remember I don't really know how to use GAS in the first place, so I go to [Google Apps Script: A Beginner’s Guide](https://www.benlcollins.com/apps-script/google-apps-script-beginner-guide/). I have some hello world text and I need to save the project to drive before the run button is clickable. It needs a name too so I name it `Syxer Script`. I need to give permissions in order for it to run, pretty slick.

Ok, so weirdly enough the tutorial isn't producing expected results. I'm running the script but I see no evidence of the `Browser.msgBox('Hello World!');` command being interpreted correctly. Ok... I had opened these tabs yesterday so on a hunch I re-opened the GAS interface through the Sheets that it's associated with and then all of a sudden the textbox is popping up on script run. Good to know that tabs remaining open overnight may sever some important connection between script and host sheet.

Great now let's write into cell values. Gannon had one double bogey so let's write that into cell D4. The docs are helpful but I'm in more of a flyover mood so I look to this [reddit post](https://www.reddit.com/r/GoogleAppsScript/comments/16wcdth/trying_to_write_data_to_a_google_sheet_cell_using/) instead. So here's my first attempt:

```
function myFunction() {
  var ss = SpreadsheetApp.getActiveSpreadsheet();
  var sheet = ss.getSheetByName('MPO #3')

  var range = sheet.getRange("D4");
  range.setValues(1);
}
```

This doesn't work because of a range mismatch on the setValues bit. I do some sleuthing. It's looking for a particular data structure here but this isn't being clearly called out anywhere. I try a couple of things and over time I just kinda keep adding characters to the setValues param haha. The progression of the line is something like this:

`range.setValues(1);`

`range.setValues('1');`

`range.setValues(['1']);`

`range.setValues([['1']]);`

It works on the last one and that makes sense: Sheets deals in 2-dimensional data so that's what the identity (so-to-speak) looks like in that system. Anyway this piece of code works and updates the spreadsheet accordingly. I'm going to make a custom function that performs all the Gannon updates explicitly, I call it `updateAllGannonStrokesExplicitly()` and it works like a charm. That's 1/4 of the tasks ready to go.

Looks like the code-file that I'm working with in the GAS interface uses a `.gs` file type. I'm going to save a snippet of this code in the repo and work on doing a commit as well since this is a reasonable milestone in the process.

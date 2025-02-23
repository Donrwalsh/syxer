# syxer

## Outstanding Questions:

- [x] Does grouping Double Bogeys and Double Bogey+s together change the overall stroke score?
  - yes, but this was an administrative decision for record-keeping so it can stay this way. (I happened to code with this assumption so we good here)

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

Looks like the code-file that I'm working with in the GAS interface uses a `.gs` file type. I'm going to save a snippet of this code in the repo and work on doing a commit as well since this is a reasonable milestone in the process. Making a commit through VsCode hit an authentication snag. I tried to push again and now it's timing out, oh brother. Ok that was simple to sort out. I just was missing the UAC popup that was going all the way to the other side of the screen on me. Ok but now after restarting vsCode it's giving me type-ahead-completion-suggestion stuff for while I'm typing in this README file and I do not like it. Meh, I'll fix that later.

Let's work on getting the data. Type-ahead stuff went away on it's own lol. First things first I want to be able to quickly clear out Gannon's data, so actually let's look at some structural stuff for a moment here. I'm going to use it like this:

```
function main() {
  updateAllGannonStrokesExplicitly()
}


function updateAllGannonStrokesExplicitly() {
  ...
```

So the scripts that are in the `GAS` folder (current name, I might change it around) are all available to the same script and so I can explain ordering of how I run them here and then the functions that are available within the GAS script are reproduced and referencable in the repo. Seems legit. Ok so the Interface I'll need for the next task involves a couple of functions:

- `updateGannonStats()`
- `resetGannonStats()`
- `obtainGannonData()`

I'll go in order. `updateGannonStats()` is just an enhanced version of `updateAllGannonStrokesExplicitly()` that I just created but it expands to include the STATS and MAKES sections. Those sections work the same: D column gets updated and then E columns are calc'd based off the data. I have the opportunity here to transcribe some data out of the spreadsheet and into the GAS that I'm creating so I'll do that now. One thing: I'll name this function `updateGannonStatsExplicitly()` because the explicit portion is still important seeing as I'm not exactly sure how I'll pipe data from part 3 to part 1 and such.

Note that alt-shift-F works in the GAS interface, nice. Ok, so I built a pretty version of the explicit stat writer. Now each of the cells is called out and I can work with them just through the GAS interface in some ways. Next I'm going to make the `resetGannonStats()` function which is the same as the last one but just zeroes out all the fields. I don't know enough about the data pipeline and such to know how I might make a single function that performs both these tasks so I'll just copy the last one and manually change the values. Time to turn on some music! That was easy and works like a charm. Gonna save both these functions to the repo and commit them.

(Do Ctrl+K then Ctrl+Shift+S to save without formatting because VsCode hates the pretty comment title marker things that I'm using. It's called style, look it up)

And now the main event: `obtainGannonData()`. So I need to get to the website that's in this image... Ok, brief side quest to handle images in readmes since I want to be able to do that.

![Gannon Buhr Stats Example][gannon-example]

Neat! That was pretty straightforward - even works in the vsCode preview, dope. Ok, so I'm working off this concept that the highlighted data from the image above drives the updates showcased in the image below:

![Gannon Buhr Scorecard Population Example][gannon-scorecard-example]

First of all, I'm making an assumption here that the strokes data is coming from the score section because I'm not seeing a direct correlation from the listing of stroke types that the spreadsheet enumerates data by to any other data presented on the page of the first image - highlighted or no. But I'm aware that score translates into this kind of stroke counting with a single very minor difference that might be important: The spreadsheet categorizes double bogey+ as a single line-item when the + indicates that there may be more strokes to be counted beyond the calculated 2. Now I don't know if this is a scoring convention in that all double bogey+s are counted just as double bogeys so I'm going to log it as a question quick. . . I'll add a section to the top of the README.

Anyway, sidequest done. I need the site that's depicted in the first image. [Here it is](https://www.pdga.com/live/event/86522/MPO/scores?round=12). Let's talk about what happens when you visit this site:

![How the sausage is made][event-scores-network-panel]

Filtered to XHR, the network panel showcases a handful of API calls that are used to construct the data that's immediately visible. But there's more! When you click on an individual player a panel is expanded and more data is fetched on-demand, which looks like this:

![How we make the sausage][event-scores-player-click-network-panel]

Had one of those moments where a fucking banger of a song turned on right at this point in the train of thought and it occured to me that the best way to describe all of this is to actually pull down the data and enumerate it within the repo so it's explorable and digestable in that way. Hell yeah let's go.

So data folder structure. I'm sort of going to follow the API structure with this, but it exposes some confusion: Why round 12? The interface has Rounds 1, 2 3 and Finals which maps to 12. Weird. Anyway, if I consider this is a possible (eventual) destination for a local copy of this data I figure it makes sense to construct it in a traversable way that would make sense for such population efforts. I was gonna map out the folder structure concept here but whatever I'll just build it and then the commit record can provide that same info.

Ok, so I observed a few things while working on this. When you expand the individual player card the initial fetch_player call is made for what seems to have the bulk of the meaty stats and then two sets of 4 calls are made for hole-breakdowns and round-stats. The ids for these are different but they are denoted within the fetch_player_Result call and indicate Rounds. So we're just dealing with some sort of normalization scheme that is exposed via the frontend somewhat. Makes me wonder if this has to do with how sometimes the rounds are ongoing (this is a live score readout after all) and I'm pretty convinced that's the case. Neat.

Oh ok, I looked a little closer at some stuff in the data and mapped it to what I'm working on with the existing GAS functionality. I'm actually focusing on Round 1 data here, and when I click around in the interface to view the scorecard for Gannon's round 1 what do you know the data lines up. Outstanding I have the full connection so let's write some code.

I get to cheat and know that I'm going directly to Gannon's player Id which is 211457089, but eventually determining that Id will be a fun little challenge. So I'm making an API call to `https://www.pdga.com/apps/tournament/live-api/live_results_fetch_player?ResultID=211457089`. How to make API calls in GAS?

Found [this](https://developers.google.com/apps-script/guides/services/external) almost immediately. When I try to run the sample code I get another UAC popup and I don't really pay attention to it. I'll revisit this when I'm done with all core functionality stuff and I'm not certain that's right now. The initial version of this function works.

So I'm parsing through this data and thinking about how I'm going to translate it. In order to calculate strokes, I'm going to be comparing an array of 18 ordered integers called scores against an array of pars that is a bit nested. So why not turn it into a structure that benefits me? Something like

```
interface playerScore {
  scores: number[],
  pars: number[]
}
```

Bro, why does the execution log disappear when you start making code changes? that's awful. Oof, ok the Layout - Detail par data structure is interesting. I'm going to make a dedicated function to work with it. I'm making this harder than it needs to be. I can reduce this down to a single array that denotes the difference between strokes and par. Noice.

HoleScores is actually KVPs with a string-based index for hole number and so I can use that as a baseline because that's how it's kinda delivered on the Layout.Detail side too. I can't map on these dictionaries, hm. I'll just use a basic for loop here. Worked like a charm.

Now let's map it to an easier-to-traverse object style for passing around instructions to the other functions at play here. And there you have it, hell yeah.

So here's what I did. I made `obtainGannonData()` and then constructed a stats object that the function produces. This is then returned by that function and I made another function called `updateGannonStatsDynamically()`. It's just like the explicit function except it also makes a call to `obtainGannonData()` to obtain the stats object and then references values from that (built by routine javascript traversal logic counting the types of strokes by way of the score/par differences) to write data into the sheet. I tested it by having my main function run `resetGannonStats()` before hitting the dynamic function to populate the strokes section. All data looks to match expected values and there you have it: a full tracer round for dynamic spreadsheet updating by way of PDGA data. Woo, stopwatch says 2 hours 6 minutes!

[event-scores-network-panel]: https://raw.githubusercontent.com/Donrwalsh/syxer/refs/heads/main/images/event-scores-network-panel.png "Event Scores Network Panel"
[event-scores-player-click-network-panel]: https://raw.githubusercontent.com/Donrwalsh/syxer/refs/heads/main/images/event-scores-player-click-network-panel.png "Event Scores Player Click Network Panel"
[gannon-example]: https://raw.githubusercontent.com/Donrwalsh/syxer/refs/heads/main/images/gannonexample.png "Gannon Example"
[gannon-scorecard-example]: https://raw.githubusercontent.com/Donrwalsh/syxer/refs/heads/main/images/gannonscorecardexample.png "Gannon Scorecard Example"

#### 2/23/25

G'morning. Spoke with Matt yesterday and grabbed a ton of helpful details about the structure of the game and possible future states. I'm a bit strapped for time this morning so I'm not going to be able to transcribe everything, but I will be sure to do that at some point.

For today I'm going to just play with a bit more data. C1R and C2R are next up. I see on Gannon's highlighted screenshot that there's a spot for these stats directly. The C1R value I want to find is 12 and the C2R value I want to find is 2. The presented scores on the highlighted scorecard is 12/18 C1R and 14/18 C2R. So intuitively they each have a cap of 18 because they are describing what happened on a given hole. C1R implies C2R and so that makes sense that we're recording the difference between the two. Let's look at the data.

Ok, we're gonna get interesting right away. I don't see a direct readout of CXR scores in the neatly arranged data from last time for strokes. I poke around for a moment. I see in the hole-breakdown some structures that probably match what I'm looking for. I'm going to map this out because honestly I was hoping to knock this out in a quick 15min block but it's more challenging than that so I'm gonna breadcrumb my way through this gingerbread house.

- `live_results_fetch_player_ResultID=211457089` is missing the data I want
- It looks like a `xxx-hole-breakdowns` will have it for me.
- The `xxx` number from above corresponds to a ScoreID for the round and so for round 1 we're looking at `22782308`
- Therefore `22782308-hole-breakdowns` is the where I expect to find this data.

So piping that data into a potato I run some tests:

`potato.filter((hole) => hole.holeBreakdown.c1 == 1).length` = 14

`potato.filter((hole) => hole.holeBreakdown.c2 == 1).length` = 3

Not quite what I expected, hm. I have a theory that there's something unique about what happened on hole 6 that's causing it to be counted as C2R but not as C1R. . . ? Looking at the screenshot there's a dot instead of a big or small circle. I need to pause here and get ready for a thing, but this may warrant a question to Matt if I can't sort it out in my next visit.

Oh wait I think I just figured it out. The row is labeled Greens, so I probably need to count from that column one sec.

`potato.filter((hole) => hole.holeBreakdown.green == "c1").length` = 11

`potato.filter((hole) => hole.holeBreakdown.green == "c2").length` = 2

These numbers also displease me. We're missing something and it's happening on hole 6:

`potato.filter((hole) => hole.holeBreakdown.green == "parked").length` = 1

So the theory is that the value of `"parked"` counts as C1 which bumps the 11 to 12 and keeps the 2 as it is and those are the exact numbers I want.

Ok now I'm really out of time, but I think this is a compelling theory.

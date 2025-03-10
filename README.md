# syxer

## Todo:

- [ ] Write up notes from 2/22 stakeholder discussions.
- [ ] Seems like it could be cool to standardize the selection of cells based on stat description (+ round designation) to do away with the verbose spreadsheet referencing over and over again.
- [ ] Player spreadsheet red point values are decorative only and aren't used in calculations...

## Outstanding Questions:

- [x] Does grouping Double Bogeys and Double Bogey+s together change the overall stroke score?
  - yes, but this was an administrative decision for record-keeping so it can stay this way. (I happened to code with this assumption so we good here)
- [x] When we're talking No Stats for partial data, how does Makes play into that?
  - Makes will also be empty in a no stats situation,
- [ ] In the event that a player does not make a selection in time for kickoff, what happens? Is a default selection made or are they penalized and required to make a selection after data starts rolling in?
- [ ] What happens if for a given tournament a player's roster is invalid? i.e. 7 or more of their athletes aren't participating in the tournament and so they cannot actually pick 6 athletes to compete (similar situation if 4 or more of a given division of their roster aren't competing)

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

#### 2/24/25

So I noodled on where I left off for a bit since I last looked at this. I'm fairly convinced that this is the right line of thinking and it just occured to me that I can confirm this by perusing other stats. The numbers that make it into the spreadsheet ultimately match what's being rendered on the page over on the right-hand side in the sideways bar graph stats block so it's only the data (which drives this in the first place) that holds what might be a discrepancy.

Looking at Anthony Barela he's got 9 C1R and 2 C2R. The circles show many more parks and so this basically fully confirms that they're being counted as C1R which breaks down into 5 natty C1Rs and 4 parked, ok that's convincing enough for me let's put it into code.

I want obtainGannonData to spit this out too, so I'll start by expanding the output to be sectioned. Ok, I remember now that I'm not getting this data from the existing API call so let's introduce the new API call that fetches this data (note that this whole process and mechanism needs to be abstracted away from sequential operations at the start of this function but that's too big of a thread to unravel right this second).

I'm just going to inline count the values of hole.holeBreakdown.green in the ouptut object. Probably I'll move that somewhere else later but it's fine there for now. While I'm here let's go ahead and calculated OB and Ace because they're pretty straightforward. OB is a value contained in the hole breakdown data so I can just directly reference that. Ace is just a stroke value of 1 but that's independent of Par, so I'll just reference that from the player stats bit that has score that I use in the calculation of strokes.

So for OB it's nested and I want to sum. I chose to map the holeBreakdowns object into a clean list of integers and then do a basic reduce to sum those integers and it's actually a shorter line than the filter with two conditions. Ha!

The arrangement of the score data is KVPs so it's not simple to iterate over. I dealt with this before so I'm already iterating over these values to construct strokes data so I'll just add a quick check for aces while I'm doing that.

So the end result is that `obtainGannonData()` is now returning an object that looks like this:

```
{ strokes:
   { doubleBogey: 1,
     bogey: 1,
     par: 5,
     birdie: 11,
     eagle: 0,
     albatross: 0 },
  stats: { c1r: 12, c2r: 2, ob: 3, ace: 0 },
  makes: {} }
```

And this makes my life a hell of a lot easier when it's time to update stats dynamically and my goodness would you look at the time - that's now!

Actually one sec before I do that. In the interest of completeness I'm going to update the code I'm working with to write an empty value to the No Stats spot. These two are independent of one another but it'll be convenient when future me has a spot to introduce that logic in whatever form it takes. Good work, past Don.

I ran the script and it does exactly what I want. Excellent. I'm going to migrate the code updates so they're tracked here and then go finish getting ready for work.

#### 2/25/25

Ok, so I've got some stuff to jot down based on a few conversations with Matt. First off, No Stats. This is a binary decision based on the following flow:

- If the player has stats (C1R, C2R, OB) then they take those values and we stop here.
- If the player has no stats (which happens due to incomplete data being recorded in the PDGA system) then they get a 1 value in the No Stats cell which results in either 17 points for MPO or 12 points for FPO.
- If the player has partial stats then calculate the result of both options and award the player the higher of the two.

So realistically I need to be able to determine what both no and partial stats look like to make these decisions. I'm a bit concerned that partial stats may be hard to identify during a live-feed situation, but that's pretty far down the road at the moment. Doing the comparison and choosing between either option is straightforward but will require reading values from the spreadsheet which hasn't needed to happen yet. Ok also it just occurred to me that I'm not sure how Makes plays into this and WHAT'S THAT we've got actual point values in the red column but they aren't being relied on to make the calculations, hm.

Next up, I'm going to write down some of the takeaways from the 2/22 stakeholder discussion.

- Season of 21 events: 18 regular season, final 3 playoffs.
- Each event the game of it is a head-to-head competition between two players.
- Draft pool involves 300-400 athletes: chosen via some metric that Matt used which I didn't record. In any case, they will all have PDGA profiles and distinct playerIds.
- Draft was 2/24, first event kicks off on 2/28.
- Players will draft 12 athletes and each event they will select 6 from their roster: 3 MPO and 3 FPO. Roster choices are locked upon kickoff.
- Looking at the player stat sheet, most events are 3 rounds (DGPT) but some are 4 (DGPT+) and one is 5 (Worlds)
- Players can trade using a Waiver Wire concept. This is pretty out of scope for now, but just understand that these potential trades are prioritized based on current player standings. No plans to introduce the management of this into spreadsheets at this time other than knowing that the players' athlete selection is subject to change as the season progresses.

Furthermore we spoke briefly last night after the draft concluded. I advised Matt to stick with individual spreadsheets for now because we can have spreadsheets talk to one another via IMPORTRANGE and I read some stuff about how you can have a script update multiple spreadsheets and immediately I pictured a master spreadsheet with buttons that reach out to satellite spreadsheets and update the data based on Roster selections. I asked him to procure me a spreadsheet too like I'm a player so I can tinker with this. I figure that'll be my next area of focus once I finish the logic to record Makes and then start upgrading what I've written to be able to handle multiple rounds and variable athletes.

![Mood][kronk]

Ok, let's take a look at the next stat of the bunch: C1X Putting. The scorecard example shows a **12/15** value for C1X but it's a bit unclear where that's coming from. If I sum the values in the row I get 20 so that's not it. If I count/sum the bold values I get 11 so that's not it either. . . C2 Makes lines up nicely with 1 to 1 so that suggests it's the bolded values so where's the missing one coming from? Oh it's probably where C2 counts for C1? Doesn't that represent a slightly different mechanism for counting across the Stats and Makes sections? I'll need to ponder this for a while.

Ok, let's take a moment to do some side-work since I'm a bit blocked by lacking domain knowledge at the moment. Currently I'm only updating round 1 data, so what would expanding this to work with multiple rounds look like? There's an implicit mapping happening with the hardcoded concept of grabbing round1scores and also the location of the cells we're updating. If I were going to (and I plan to) expand `updateGannonStatsDynamically` to be more generic I'd probably want to land on something like `updateAthleteStats(athlete, round)`. I'm going to start building this I think - we're in loose typing land over here so I can cut corners while it makes sense to.

Since I'm accepting params, I'll want to throw errors if they aren't what I expect. Round is easy, it'll be an integer between 1 and 5. (note there's an opportunity here for futher granularity and restriction but it requires better working knowledge of which tournament we're working with and we aren't there yet).

```
function updateAthleteStats(athleteName, round) {
  if (![1, 2, 3, 4, 5].includes(round)) {
    throw 'Error. Invalid Round Param';
  }
}
```

That gives me a console error which is sufficient for now. Next, let's do player. I want to consult a comprehensive list of player names and keys to see if the provided player is available. I'll start that list with one value since we're only dealing with Gannon's stats at the moment.

```
const athletes = [
  { name: "Gannon Buhr", PDGANum: 75412 }
]

function updateAthleteStats(athleteName, round) {
  const athlete = athletes.find((athlete) => athlete.name == athleteName);

  if (athlete == null) {
    throw `Error. Athlete "${athleteName}" not found`;
  }
}
```

Cool. In thinking about this, I'm basically introducing round and player as toggles while keeping tournament and which spreadsheet is being updated as static concepts for now. It makes sense to be a bit more explicit about this so I'll add a constant that denotes the tournamentId. For the spreadsheet it'll just be implied via the `getActiveSpreadsheet` call.

At this point, I'd really like to make a call to some `obtainAthleteStats()` method so let's sound it out. I'm going to be passing in the athlete's PDGA number, the tournamentId and the round in question. Effectively the output is going to be the contents of the `round1Scores` variable from `obtainGannonData()`. So stepping through that, the first issue is that `obtainGannonData()` already knows the playerResult URL so I'll need to construct that from just the params.

So the target URL that I want to build in this instance looks like this:

`https://www.pdga.com/apps/tournament/live-api/live_results_fetch_round?TournID=86522&Division=MPO&Round=12`

I pulled this into a potato and decided to extract a starter list of athletes and PDGANums from this which I wrote into the constants for now.

`potato.data.scores.map((athlete) => ({name: athlete.Name, PDGANum: athlete.PDGANum}))`

Neat, ok so I'm going to just default to asking for Round 12 for now since I know that the tournament I'm working with has finished. My first question to answer is "Did the player in question play at this tournament?" Nope, nevermind I can't actually do that since it doesn't seem possible to walk from the round 12 to get the all the data that I need. So here's what I came up with:

```
function obtainAthleteData(pdgaNum, tournId, round) {
  var url = `https://www.pdga.com/apps/tournament/live-api/live_results_fetch_round?TournID=${tournId}&Division=MPO&Round=${round}`;
  var response = UrlFetchApp.fetch(url, { 'muteHttpExceptions': true });
  const json = JSON.parse(response.getContentText());

  targetAthlete = json.data.scores.find((athlete) => athlete.PDGANum == pdgaNum);

  if (targetAthlete == null) {
    throw `Error. Athlete with PDGANum ${pdgaNum} not found in tournament data`;
  }

  return targetAthlete;
}
```

Cool, that works and I literally JUST REALIZED that you can add additional files haha. So I've got a method that obtains the data I want. Next task is to create a method that translates that data into the form I want, so actually I'm not done yet. Let's introduce the holebreakdown data into the return value of this function.

[kronk]: https://raw.githubusercontent.com/Donrwalsh/syxer/refs/heads/main/images/kronk.png "Oh Yeah"

#### 2/26/25

Sat down with Matt yesterday and we discussed some details that I'm going to transcribe now. The draft happened on Monday and so the 10 players have chosen their 12 athletes each. I jotted down a copy of this list in my NuTracking spreadsheet since this represents the first player choice that drives the game forward. Next up we looked through the sheets in detail. 10 players across 18 rounds works out perfectly for two cycles of 9 rounds wherein everybody plays everybody else once. This is a simple combinatrics problem that I worked on graph paper for about 10 minutes before throwing up my hands and not finding the pattern. I solved it for 4 players across 3 and then 6 players across 5 but no pattern emerged so meh. Thankfully, everything's been done before so I found a writeup that breaks it down but doesn't explain the pattern:

![Pairings][pairings]

Cool, so that'll make things easier for Matt I hope. The Matchup tab on player spreadsheets is going to be a big driver of content and information. It'll show the upcoming pairings for tournaments (essentially a loose tournament schedule as well) and current point totals for the given round's tournament as well as overall league standings and other such summary information. Finally, the big ticket action is migration of data from the individual score tabs onto an aggregate score tab near the back. Then manually this gets updated to pull data for the next tournament from the same spot and so the wheel turns. This pretty much gives me everything I need to know.

Breaking it down, you've got the following flow for a given tournament:

1. Players make athlete selections prior to Roster Lock.
2. Players fill out stats in the 6 tabs based on posted PDGA data.
3. Results are finalized, points counted and winners/losers declared.
4. Data for the round is recorded and sheets are reset in preparation for the next round.

Steps 2-4 can be automated so long as step 1 is performed in time. Step 1 can't be automated because it involves player choice, but it can be swiftly validated which is pretty cool. There's a consideration here which is players selecting an athlete from their roster isn't the whole story - they need to pick an athlete that's actually competing in the tournament in question which suggests that a player could actually be in a situation where they can't actually make a selection because 7 or more of their players aren't participating in the tournament. This is possible from a data standpoint but I doubt it's actually something that can happen since I figure we would've discussed it by now. I'll drop a question up top on it just in case.

Next I explained to Matt the architecture that I'm envisioning: An Admin Console that has the power to perform CRUD operations on the entire spreadsheet ecosystem which is composed of 10 player sheets and then a handful of administrative tracking sheets that Matt uses to manage the game. From there we discussed a list of 'operations' that can be performed from the Admin Console and it went a little off the rails but still did a lot to help solidify the overall scope of what this application will want to do. Here's the list in its entirety:

- Validate Player Athlete Selections
- Supply Detailed Stats
- Store Detailed Stats
- Show Current Standings
- Trade Athletes -> Add/Drop operations
- Manage Athletes ~ (Undrafted/Free Agents)
- Manage Periods ~ (Waiver Periods/Free Agent Acquisition/Tournament Periods)
- See Athletes Details ~ (Points Per Season, Rank)

And from here we discussed a bit of what exists on other fantasy sports apps. It's interesting seeing the trajectory of this list because it really covers multiple different viewpoints but it really helps supply the shape of this to me. I'm not going to use this list directly but I do think it's somewhat exhaustive in a gameplay element/operation/action systemization approach. Anyway, the discussion around this list generation was extremely useful and I think the list itself will be useful in jogging my memory on this.

Ok, still more to talk about. We sat down at the computer and looked into the C1X data issue and the conclusion is that the PDGA data is wrong. The definition of C1X is every opportunity for making a putt from circle 1 where circle 1 is 11' to 33' (it was originally defined in meters hence the weird numbers). Looking back on the example data I think that there was a discrepancy in one spot but now in reviewing it I'm not so sure. One sec. Ok yeah pretty sure I was tunnel-visioning on the boldness of the C1X putting row on the scorecard. If I only count throwIn values the numbers add up so maybe there isn't a data discrepancy here. In any case, I got enough information for determining the C1X value from the data that we have available. I _also_ stumbled across an opportunity for even more data because when you click on the individual numbers in the C1X row it pops up a modal that shows you a ludicrously detailed breakdown of the individual throw. This is supplied by a throw-timelines API call which I'll capture for Gannon Buhr's first round. This data is very specific and I believe that I will need to digest it in order to calculate the 100% C1X/C2 bonus since there's no indication (that I can tell) of the 'out of' count for C1X and instead I'll need to traverse the throw timelines to fetch that data. That'll be a bit arduous especially in a live data situation but meh, them's the requirements.

Alrighty. So that just about covers where everything is at. Code-wise where I'm at is continuing to flesh out the generic `obtainAthleteData()` method while also starting to bolster the entire app itself with a bit more OOP to make it easier to scale up to where it needs to be. First tournament starts this weekend and so at the very least I plan to watch the shape of the data as it rolls in, but I figure that puts me at about a week from now of really wanting a functional data scraper up and running. Love me a good deadline, let's make it happen.

[pairings]: https://raw.githubusercontent.com/Donrwalsh/syxer/refs/heads/main/images/pairings.png "Pairings"

#### 2/28/25

Gotta go fast. Re-engineered the overall script to work for a single round to deliver on data availability for live event being run now. Known gaps:

- [ ] c1x and c2 make bonuses are ignored.
- [ ] incomplete player data is ignored (and logged).
- [ ] round and tournament details are hardcoded.

Maybe I'll find time to make a write up of the changes here, but mostly it amounts to: did the work.

- [ ] Set it up to not repeat-fetch data to extend into further usability
- [x] Pretty sure there's a bug in the aces code in that they will double count with whatever calc'd shot type the ace also registers as.
- [ ] obtainLayoutData doesn't need to be repeated at all.
- [ ] Need to leverage script structure more, fewer params being passed around that may make sense as variables made available across the script.
- [ ] Have a toggle or something that allows the script to be run from either my dev environment or the prod environment based on location examination. Then switch between arrays of fleet sheets.

3/14 kickoff

- Event totals to the right
- STats - down
- 2025 fantasy points analysis - down (https://docs.google.com/spreadsheets/d/1ECfrOfSrM0_ztIww2X0oBFF9UuWfewqFB32XgK18u_c/edit?gid=0#gid=0)
- Clear out scorecards
- Better button

- the dang c1 possibilities calc
- rankings

Code updates notes go here

function obtainGannonData() {
  var url =
    "https://www.pdga.com/apps/tournament/live-api/live_results_fetch_player?ResultID=211457089";
  var response = UrlFetchApp.fetch(url, { muteHttpExceptions: true });
  const json = JSON.parse(response.getContentText());

  const round1Scores = json.data.Scores.find((score) => score.Round == 1);

  let diffs = [];

  for (var counter = 1; counter <= 18; counter = counter + 1) {
    const score = round1Scores.HoleScores[counter.toString()];
    const par = round1Scores.Layout.Detail[counter.toString()].Par;

    diffs.push(score - par);
  }

  //
  let output = {
    doubleBogey: diffs.filter((d) => d >= 2).length,
    bogey: diffs.filter((d) => d === 1).length,
    par: diffs.filter((d) => d === 0).length,
    birdy: diffs.filter((d) => d === -1).length,
    eagle: diffs.filter((d) => d === -2).length,
    albatross: diffs.filter((d) => d <= -3).length,
  };

  return output;
}

function obtainGannonData() {
  // setup
  var url = 'https://www.pdga.com/apps/tournament/live-api/live_results_fetch_player?ResultID=211457089';
  var response = UrlFetchApp.fetch(url, { 'muteHttpExceptions': true });
  const json = JSON.parse(response.getContentText());

  const round1Scores = json.data.Scores.find((score) => score.Round == 1);

  let diffs = [];
  let acesCount = 0;

  for (var counter = 1; counter <= 18; counter = counter + 1) {
    const score = round1Scores.HoleScores[counter.toString()];
    if (score == 1) {
      acesCount++;
    }
    const par = round1Scores.Layout.Detail[counter.toString()].Par;

    diffs.push(score - par);
  }

  const round1ScoreId = round1Scores.ScoreID;

  var secondUrl = `https://www.pdga.com/api/v1/feat/live-scores/${round1ScoreId}/hole-breakdowns`;
  var secondResponse = UrlFetchApp.fetch(secondUrl, { 'muteHttpExceptions': true });
  const holeBreakdowns = JSON.parse(secondResponse.getContentText());

  // arrange
  let output = {
    strokes: {
      doubleBogey: diffs.filter(d => d >= 2).length,
      bogey: diffs.filter(d => d === 1).length,
      par: diffs.filter(d => d === 0).length,
      birdie: diffs.filter(d => d === -1).length,
      eagle: diffs.filter(d => d === -2).length,
      albatross: diffs.filter(d => d <= -3).length
    },
    stats: {
      c1r: holeBreakdowns.filter((hole) => hole.holeBreakdown.green == "c1" || hole.holeBreakdown.green == "parked").length,
      c2r: holeBreakdowns.filter((hole) => hole.holeBreakdown.green == "c2").length,
      ob: holeBreakdowns.map((hole) => hole.holeBreakdown.ob).reduce((sum, num) => sum + num),
      ace: acesCount,
      noStats: 0
    },
    makes: {

    }
  };

  return output;
}
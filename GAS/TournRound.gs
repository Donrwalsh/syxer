// v1.10

class TournRound {
  constructor(athleteData, layoutData) {
    this.athleteData = athleteData;
    this.layoutData = layoutData;
    this.holeBreakdownData = this.obtainHoleBreakdownData(athleteData.ScoreID);
    this.throwTimelineData = this.obtainThrowTimelineData(athleteData.ScoreID);
  }

  calculateStrokes() {
    let diffs = this.getDiffs();
    return {
      doubleBogey: diffs.filter((d) => d >= 2).length,
      bogey: diffs.filter((d) => d === 1).length,
      par: diffs.filter((d) => d === 0).length,
      birdie: diffs.filter((d) => d === -1).length,
      eagle: diffs.filter((d) => d === -2).length,
      albatross: diffs.filter((d) => d <= -3).length,
    };
  }

  getDiffs() {
    let diffs = [];

    for (
      var counter = 1;
      counter <= this.holeBreakdownData.length;
      counter = counter + 1
    ) {
      const score = this.athleteData.HoleScores[counter.toString() - 1];
      if (score != 0) {
        const par =
          this.layoutData.liveLayoutDetails[counter.toString() - 1].par;
        diffs.push(score - par);
      }
    }
    return diffs;
  }

  obtainHoleBreakdownData(athleteScoreId) {
    var url = `https://www.pdga.com/api/v1/feat/live-scores/${athleteScoreId}/hole-breakdowns`;
    var response = UrlFetchApp.fetch(url, { muteHttpExceptions: true });
    const json = JSON.parse(response.getContentText());

    return json;
  }

  obtainThrowTimelineData(athleteScoreId) {
    var url = `https://www.pdga.com/api/v1/feat/live-scores/${athleteScoreId}/throw-timelines`;
    var response = UrlFetchApp.fetch(url, { muteHttpExceptions: true });
    const json = JSON.parse(response.getContentText());

    return json;
  }
}

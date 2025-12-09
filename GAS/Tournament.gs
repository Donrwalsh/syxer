// v1.10

class Tournament {
  constructor(id) {
    this.id = id;
    this.data = TOURNAMENTS.find((tournament) => tournament.id == id);
    this._resultsData = {
      MPO: {},
      FPO: {},
    };
    this._layoutData = this.obtainLayoutData();
  }

  get resultsData() {
    return this._resultsData;
  }

  set resultsData(newValue) {
    this._resultsData = newValue;
  }

  get layoutData() {
    return this._layoutData;
  }

  set layoutData(newValue) {
    this._layoutData = newValue;
  }

  obtainAthleteData(division, round, athleteName) {
    if (!this.resultsData[division][round]) {
      var url = `${PDGA_URL_PREFIX}apps/tournament/live-api/live_results_fetch_round?TournID=${
        this.id
      }&Division=${division}&Round=${this.whyIsItLikeThis(round)}`;
      var response = UrlFetchApp.fetch(url, { muteHttpExceptions: true });
      let copyOfAthleteData = this.resultsData;

      copyOfAthleteData[division][round] = JSON.parse(
        response.getContentText()
      ).data;

      this.resultsData = copyOfAthleteData;
    }

    let targetAthlete = this.resultsData[division][round].scores.find(
      (athlete) => athlete.Name == athleteName
    );

    if (targetAthlete == null) {
      throw `Athlete ${athleteName} missing from tournament data. Are they competing?`;
    }

    return targetAthlete;
  }

  obtainAthleteNumbers(division, round, athleteName) {
    const athleteData = this.obtainAthleteData(division, round, athleteName);

    if (athleteData.ScoreID == null) {
      throw `${athleteName} does not have an ID for round ${round}. Have they been cut?`;
    }

    //Layout stuff is ugly here, should bundle it into athleteData?
    const tournRound = new TournRound(
      athleteData,
      this.layoutData.find((row) => row.layoutId == athleteData.LayoutID)
    );

    let result = {
      strokes: tournRound.calculateStrokes(),
      stats: {},
      makes: {},
      rankings: {
        place: athleteData.RunningPlace,
        fieldSize: this.resultsData[division][round].scores.length,
      },
    };

    console.log(result);
  }

  obtainAthleteStats(division, round, athleteName) {
    const athleteData = this.obtainAthleteData(division, round, athleteName);

    if (athleteData.ScoreID == null) {
      throw `${athleteName} does not have an ID for round ${round}. Have they been cut?`;
    }

    console.log("here");
  }

  obtainLayoutData() {
    var url = `https://www.pdga.com/api/v1/live-tournaments/${this.id}/live-layouts?include=LiveLayoutDetails`;
    var response = UrlFetchApp.fetch(url, { muteHttpExceptions: true });
    let layoutData = JSON.parse(response.getContentText());

    return layoutData;
  }

  whyIsItLikeThis(round) {
    // When tournaments have 4 rounds, the 4th round is sometimes marked as 12:
    if (round == 4) {
      // but this one used 4 for some reason:
      if (this.id == 88651) {
        return 4;
      }
      return 12;
    }
    return round;
  }
}

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
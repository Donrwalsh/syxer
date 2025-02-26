function updateAthleteStats(athleteName, round) {
  if (![1, 2, 3, 4, 5].includes(round)) {
    throw 'Error. Invalid Round Param';
  }

  const athlete = athletes.find((athlete) => athlete.name == athleteName);

  if (athlete == null) {
    throw `Error. Athlete "${athleteName}" not found`;
  }

  const athleteData = obtainAthleteData(athlete.PDGANum, tournamentId, 1);
  console.log(athleteData);
}
import { createSelector } from '@ngrx/store';
import { selectDataState } from './data.selectors';

// Full standings for all teams in a tournament
export const selectFullTournamentStandings = (tournamentId: number) =>
  createSelector(selectDataState, (data) => {
    const standings = data.teams.map((team) => {
      const tournaments = data.tournaments.filter(
        (tournament) => tournament.id < tournamentId
      );

      let wins = 0;
      let losses = 0;
      let pointsFor = 0;
      let pointsAgainst = 0;

      tournaments.forEach((tourn) => {
        const matchupId = tourn.matches.find(
          (matchup) => matchup.teamId === team.id
        )?.matchup;

        if (!matchupId) return;

        const matches = tourn.matches.filter(
          (match) => match.matchup === matchupId
        );
        const me = matches.find((match) => match.teamId === team.id);
        const them = matches.find((match) => match.teamId !== team.id);

        if (!me || !them) return;

        if (me.score > them.score) {
          wins++;
          pointsFor += me.score;
          pointsAgainst += them.score;
        } else {
          losses++;
          pointsFor += me.score;       // <-- corrected: should add *my* score
          pointsAgainst += them.score; // <-- opponent’s score
        }
      });

      return {
        teamId: team.id,
        wins,
        losses,
        pointsFor,
        pointsAgainst,
      };
    });

    // Sort standings: wins desc, losses asc, pointsFor desc
    return standings.sort((a, b) => {
      if (a.wins !== b.wins) {
        return b.wins - a.wins; // more wins first
      }
      if (a.losses !== b.losses) {
        return a.losses - b.losses; // fewer losses first
      }
      return b.pointsFor - a.pointsFor; // higher pointsFor first
    });
  });
import { createSelector, select } from '@ngrx/store';
import { selectConfigState } from './config.selectors';
import { selectDataState } from './data.selectors';

export interface Matchup {
  week: number;
  id: number;
  name: string;
  opponent: string;
  myPoints: number;
  opponentPoints: number;
  result: string;
  completed: boolean;
  start: string;
}

export interface MenuReadout {
  playerName: string;
  nextTournamentName: string;
  week: number;
}

export interface Standing {
  teamId: number;
  name: string;
  wins: number;
  losses: number;
  pointsFor: number;
  pointsAgainst: number;
}

export const selectMatchups = createSelector(
  selectDataState,
  selectConfigState,
  (data, config): Matchup[] => {
    return data.tournaments
      .filter((tournament) => tournament.id <= config.tournament)
      .map((tournament, i) => {
        const matchupId = tournament.matches.find(
          (match) => match.teamId == config.player
        )?.matchup;
        const oppTeamId = tournament.matches.find(
          (match) => match.matchup == matchupId && match.teamId != config.player
        )?.teamId;

        const myPoints = tournament.matches.find((match) => match.teamId == config.player)?.score;
        const opponentPoints = tournament.matches.find((match) => match.teamId == oppTeamId)?.score;

        return {
          week: i,
          id: tournament.id,
          name: tournament.name,
          opponent: data.teams.find((team) => team.id == oppTeamId)?.name,
          myPoints,
          opponentPoints,
          result: (myPoints || 0) > (opponentPoints || 0) ? 'W' : 'L',
          completed: tournament.id < config.tournament,
          start: tournament.start,
        };
      }) as Matchup[];
  }
);

export const selectMenuReadout = createSelector(
  selectDataState,
  selectConfigState,
  (data, config): MenuReadout => {
    return {
      playerName: data.teams.find((team) => team.id == config.player)?.name,
      nextTournamentName: data.tournaments.find((tourn) => tourn.id == config.tournament)?.name,
      week: data.tournaments.findIndex((tourn) => tourn.id == config.tournament) + 1,
    } as MenuReadout;
  }
);

export const selectStandings = createSelector(
  selectDataState,
  selectConfigState,
  (data, config): Standing[] => {
    const standings = data.teams.map((team) => {
      const tournaments = data.tournaments.filter(
        (tournament) => tournament.id < config.tournament
      );

      let wins = 0;
      let losses = 0;
      let pointsFor = 0;
      let pointsAgainst = 0;

      tournaments.forEach((tourn) => {
        const matchupId = tourn.matches.find((matchup) => matchup.teamId === team.id)?.matchup;

        if (!matchupId) return;

        const matches = tourn.matches.filter((match) => match.matchup === matchupId);
        const me = matches.find((match) => match.teamId === team.id);
        const them = matches.find((match) => match.teamId !== team.id);

        if (!me || !them) return;

        if (me.score > them.score) {
          wins++;
          pointsFor += me.score;
          pointsAgainst += them.score;
        } else {
          losses++;
          pointsFor += me.score;
          pointsAgainst += them.score;
        }
      });

      return {
        teamId: team.id,
        name: team.name,
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
  }
);

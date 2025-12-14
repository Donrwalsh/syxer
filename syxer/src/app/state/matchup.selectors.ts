import { createSelector } from '@ngrx/store';
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

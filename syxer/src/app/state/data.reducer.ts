import { createReducer, on } from '@ngrx/store';
import * as DataActions from './data.actions';
import { PDGA, Team, Tournament } from '../services/data.service';

export interface DataState {
  pdga: PDGA;
  teams: Team[];
  tournaments: Tournament[];
  loading: boolean;
  error: any;
}

export const initialState: DataState = {
  pdga: { tournaments: [] },
  teams: [],
  tournaments: [],
  loading: false,
  error: null,
};

export const dataReducer = createReducer(
  initialState,

  on(DataActions.loadTeams, (state) => ({
    ...state,
    loading: true,
    error: null,
  })),

  on(DataActions.loadTeamsSuccess, (state, { teams }) => ({
    ...state,
    teams,
    loading: false,
  })),

  on(DataActions.loadTeamsFailure, (state, { error }) => ({
    ...state,
    loading: false,
    error,
  })),

  on(DataActions.loadTournaments, (state) => ({
    ...state,
    loading: true,
    error: null,
  })),

  on(DataActions.loadTournamentsSuccess, (state, { tournaments }) => ({
    ...state,
    tournaments,
    loading: false,
  })),

  on(DataActions.loadTournamentsFailure, (state, { error }) => ({
    ...state,
    loading: false,
    error,
  })),

  on(DataActions.loadSinglePieceOfPdgaData, (state, { pdgaData }) => {
    const tournId = pdgaData.data.layouts[0].TournID;
    const division = pdgaData.data.division;
    const result = {
      tournId,
      stats: pdgaData.data.scores.map((scores: any) => ({
        athleteName: scores.Name,
        athleteId: scores.PDGANum,
        division,
        round: 1, //unclear how to obtain this from raw data.
        strokes: {
          doubleBogey: 0, // pause here. I need both holebreakdown data and throwTimeLine data. Hmmm.
        },
      })),
    };

    return {
      ...state,
      pdga: {
        tournaments: [...state.pdga.tournaments, result],
      },
      loading: false,
    };
  }),

  on(DataActions.loadSinglePieceOfPdgaDataFailure, (state, { error }) => ({
    ...state,
    loading: false,
    error,
  }))
);

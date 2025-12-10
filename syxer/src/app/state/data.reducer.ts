import { createReducer, on } from '@ngrx/store';
import * as DataActions from './data.actions';
import { Team, Tournament } from '../services/data.service';

export interface DataState {
  teams: Team[];
  tournaments: Tournament[];
  loading: boolean;
  error: any;
}

export const initialState: DataState = {
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
  }))
);

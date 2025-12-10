import { createReducer, on } from '@ngrx/store';
import * as DataActions from './data.actions';
import { Team } from '../services/data.service';

export interface DataState {
  teams: Team[];
  loading: boolean;
  error: any;
}

export const initialState: DataState = {
  teams: [],
  loading: false,
  error: null,
};

export const dataReducer = createReducer(
  initialState,

  // Start loading
  on(DataActions.loadTeams, (state) => ({
    ...state,
    loading: true,
    error: null,
  })),

  // Success
  on(DataActions.loadTeamsSuccess, (state, { teams }) => ({
    ...state,
    teams,
    loading: false,
  })),

  // Failure
  on(DataActions.loadTeamsFailure, (state, { error }) => ({
    ...state,
    loading: false,
    error,
  }))
);

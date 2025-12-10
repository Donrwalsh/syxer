import { createFeatureSelector, createSelector } from '@ngrx/store';
import { DataState } from './data.reducer';

// Feature selector
export const selectDataState = createFeatureSelector<DataState>('data');

// Teams array
export const selectTeams = createSelector(selectDataState, (state) => state.teams);

// Loading flag
export const selectLoading = createSelector(selectDataState, (state) => state.loading);

// Error
export const selectError = createSelector(selectDataState, (state) => state.error);

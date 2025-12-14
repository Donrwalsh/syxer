import { createFeatureSelector, createSelector } from '@ngrx/store';
import { ConfigState } from './config.reducer';

// Feature selector
export const selectConfigState = createFeatureSelector<ConfigState>('config');

export const selectPlayer = createSelector(selectConfigState, (state) => state.player);
export const selectTournament = createSelector(selectConfigState, (state) => state.tournament);

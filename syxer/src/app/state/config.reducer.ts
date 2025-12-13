import { createReducer, on } from '@ngrx/store';
import * as ConfigActions from './config.actions';

export interface ConfigState {
    player: number;
    tournament: number;
}

export const initialState: ConfigState = {
    player: -1,
    tournament: -1
}

export const configReducer = createReducer(
    initialState,

    on(ConfigActions.setPlayer, (state, { player }) => ({
        ...state,
        player,
    })),

    on(ConfigActions.emptyPlayer, (state) => ({
        ...state,
        player: -1,
    })),

    on(ConfigActions.setTourn, (state, { tournament }) => ({
        ...state,
        tournament: tournament,
    })),

    on(ConfigActions.emptyTourn, (state) => ({
        ...state,
        tournament: -1,
    })),
)
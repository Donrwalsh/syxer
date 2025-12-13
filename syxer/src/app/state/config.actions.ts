import { createAction, props } from "@ngrx/store";

export const setPlayer = createAction(
    '[Config] Set Player',
    props<{ player: number }>()
);
export const emptyPlayer = createAction('[Config] Empty Player');

export const setTourn = createAction(
    '[Config] Set Tourn',
    props<{ tournament: number }>()
);
export const emptyTourn = createAction('[Config] Empty Tourn');
import { createAction, props } from '@ngrx/store';
import { Team, Tournament } from '../services/data.service';

// ---------------- Teams ----------------

export const loadTeams = createAction('[Data] Load Teams');

export const loadTeamsSuccess = createAction(
  '[Data] Load Teams Success',
  props<{ teams: Team[] }>()
);

export const loadTeamsFailure = createAction('[Data] Load Teams Failure', props<{ error: any }>());

// ---------------- Tournaments ----------------

export const loadTournaments = createAction('[Data] Load Tournaments');

export const loadTournamentsSuccess = createAction(
  '[Data] Load Tournaments Success',
  props<{ tournaments: Tournament[] }>()
);

export const loadTournamentsFailure = createAction(
  '[Data] Load Tournaments Failure',
  props<{ error: any }>()
);

export const loadAllPdgaData = createAction('[Data] Load All PDGA Data');

export const loadSinglePieceOfPdgaData = createAction(
  '[Data] Load Single Piece of PDGA Data Success',
  props<{ pdgaData: any }>()
);

export const loadSinglePieceOfPdgaDataFailure = createAction(
  '[Data] Load Single Piece of PDGA Data Failure',
  props<{ error: any }>()
);

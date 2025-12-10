import { createAction, props } from '@ngrx/store';
import { Team } from '../services/data.service';

// Load all teams
export const loadTeams = createAction('[Data] Load Teams');

// Load success
export const loadTeamsSuccess = createAction(
  '[Data] Load Teams Success',
  props<{ teams: Team[] }>()
);

// Load failure
export const loadTeamsFailure = createAction('[Data] Load Teams Failure', props<{ error: any }>());

// Select a team
export const selectTeam = createAction('[Data] Select Team', props<{ teamId: number }>());

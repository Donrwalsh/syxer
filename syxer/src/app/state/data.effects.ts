// src/app/store/effects/data.effects.ts
import { Injectable } from '@angular/core';
import { Actions, createEffect, ofType } from '@ngrx/effects';
import { of } from 'rxjs';
import { catchError, map, mergeMap } from 'rxjs/operators';
import * as DataActions from './data.actions';
import { DataService } from '../services/data.service';

@Injectable({
  providedIn: 'root',
})
export class DataEffects {
  loadData$ = createEffect(() =>
    this.actions$.pipe(
      ofType(DataActions.loadTeams),
      mergeMap(() =>
        this.dataService.getTeams().pipe(
          // Call your service to fetch data
          map((teams) => DataActions.loadTeamsSuccess({ teams })),
          catchError((error) => of(DataActions.loadTeamsFailure({ error })))
        )
      )
    )
  );

  constructor(private actions$: Actions, private dataService: DataService) {}
}

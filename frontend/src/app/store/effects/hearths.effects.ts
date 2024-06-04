import { Injectable } from '@angular/core';
import { Actions, createEffect, ofType } from '@ngrx/effects';
import { of } from 'rxjs';
import { catchError, map, switchMap } from 'rxjs/operators';
import { HearthService } from '../../services/hearth.service';
import * as HearthActions from './../actions/hearths.actions';

@Injectable()
export class HearthEffects {
  constructor(
    private actions$: Actions,
    private hearthService: HearthService
  ) {}

  loadHearths$ = createEffect(() => {
    return this.actions$.pipe(
      ofType(HearthActions.loadHearths),
      switchMap((action) => {
        return this.hearthService.getHearthsByUser(action.userId).pipe(
          map((hearths) => HearthActions.loadHearthsSuccess({ hearths })),
          catchError((error) => of(HearthActions.loadHearthsFailure({ error })))
        );
      })
    );
  });
}

import { Injectable } from '@angular/core';
import { Actions, createEffect, ofType } from '@ngrx/effects';
import { of } from 'rxjs';
import { catchError, exhaustMap, map, switchMap } from 'rxjs/operators';
import { UserService } from 'src/app/services/user.service';
import { HearthService } from '../../services/hearth.service';
import * as HearthActions from './../actions/hearths.actions';

@Injectable()
export class HearthEffects {
  constructor(
    private actions$: Actions,
    private hearthService: HearthService,
    private userService: UserService
  ) {}

  loadHearths$ = createEffect(() => {
    return this.actions$.pipe(
      ofType(HearthActions.loadHearths),
      switchMap((action) =>
        this.hearthService.getHearthsByUser(action.userId).pipe(
          // First, map to get all unique user IDs across hearths
          exhaustMap((hearths) => {
            const userIds: number[] = hearths
              .reduce((acc, hearth) => acc.concat(hearth.users), [] as number[])
              .filter((value, index, self) => self.indexOf(value) === index); // unique user IDs

            return this.userService.getUsersAvatarsAndNames(userIds).pipe(
              map((userInfos) => {
                // Combine user infos with hearths
                const enrichedHearths = hearths.map((hearth) => ({
                  ...hearth,
                  userInfos: hearth.users.map((id) =>
                    userInfos.find(
                      (info) => info.split(':')[0] === id.toString()
                    )
                  ),
                }));
                return HearthActions.loadHearthsSuccess({
                  hearths: enrichedHearths,
                });
              })
            );
          }),
          catchError((error) => of(HearthActions.loadHearthsFailure({ error })))
        )
      )
    );
  });
}

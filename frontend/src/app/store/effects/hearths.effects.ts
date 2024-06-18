import { Injectable } from '@angular/core';
import { Actions, createEffect, ofType } from '@ngrx/effects';
import { of } from 'rxjs';
import { catchError, exhaustMap, map, switchMap } from 'rxjs/operators';
import { Hearth, HearthUser } from 'src/app/models/hearth';
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
      ofType(HearthActions.loadHearths), // Écoute l'action de chargement des `hearths`
      switchMap((action) =>
        this.hearthService.getHearthsByUser().pipe(
          exhaustMap((hearths: Hearth[]) => {
            // Utilise `Set` pour éliminer les doublons des identifiants d'utilisateurs
            const userIds = [
              ...new Set(
                hearths.flatMap((hearth: Hearth) =>
                  // `flatMap` permet de "platir" un tableau de tableaux en un seul tableau
                  hearth.hearthUsers.map((user: HearthUser) => user.id)
                )
              ),
            ];

            return this.userService.getUsersAvatarsAndNames(userIds).pipe(
              map(
                (userInfos: { id: number; name: string; avatar: string }[]) => {
                  const enrichedHearths = hearths.map((hearth: Hearth) => ({
                    ...hearth,
                    // `map` chaque utilisateur pour enrichir les données avec des infos supplémentaires
                    hearthUsers: hearth.hearthUsers.map((user: HearthUser) => {
                      // `find` cherche dans `userInfos` l'objet qui correspond à l'utilisateur actuel
                      const userInfo = userInfos.find(
                        (info) => info.id === user.id
                      );
                      if (userInfo) {
                        // Retourne l'utilisateur enrichi de nouvelles informations
                        return {
                          ...user,
                          name: userInfo.name,
                          avatar: userInfo.avatar,
                        };
                      }
                      return user; // Retourne l'utilisateur original si non trouvé
                    }),
                  }));
                  // Action renvoyée à Redux store pour mettre à jour l'état avec les hearths enrichis
                  return HearthActions.loadHearthsSuccess({
                    hearths: enrichedHearths,
                  });
                }
              )
            );
          }),
          // `catchError` capture les erreurs survenues lors des appels HTTP
          catchError((error) => of(HearthActions.loadHearthsFailure({ error })))
        )
      )
    );
  });
}

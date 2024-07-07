import { Injectable } from '@angular/core';
import { Store } from '@ngrx/store';
import { Observable } from 'rxjs';
import { map, switchMap } from 'rxjs/operators';
import { AppState } from '../app.state';
import { selectHearthUsers } from '../store/selectors/hearths.selector';
import { HearthService } from './hearth.service';

@Injectable({
  providedIn: 'root',
})
export class ScoreService {
  constructor(
    private store: Store<AppState>,
    private hearthService: HearthService
  ) {}

  // Méthode pour obtenir les scores par foyer et ajouter les avatars des utilisateurs
  getScoreByHearth(hearthId: number): Observable<any> {
    return this.hearthService.getScoreByHearth(hearthId.toString()).pipe(
      switchMap((scores) =>
        this.store.select(selectHearthUsers).pipe(
          // eslint-disable-next-line @ngrx/avoid-mapping-selectors
          map((users) => {
            return scores.map((score: { user: number }) => {
              const user = users.find((u) => u.id === score.user);
              return {
                ...score,
                avatar: user ? user.avatar : null,
                username: user ? user.name : null,
              };
            });
          })
        )
      )
    );
  }
}

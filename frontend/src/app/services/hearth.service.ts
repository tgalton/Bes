import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Store } from '@ngrx/store';
import { Observable, map, switchMap, tap } from 'rxjs';
import * as HearthActions from 'src/app/store/actions/hearths.actions';
import { Hearth, HearthUser } from '../models/hearth';
import { User } from '../models/user';
import { selectUser } from '../store/selectors/user.selector';

@Injectable({
  providedIn: 'root',
})
export class HearthService {
  private apiUrl = 'http://localhost:8000/housework';
  currentUser$: Observable<User | null> = this.store.select(selectUser);

  constructor(private http: HttpClient, private store: Store) {}

  // Récupère la liste de ses propres hearths
  // Méthode publique pour récupérer des hearths par un utilisateur spécifique
  getHearthsByUser(): Observable<Hearth[]> {
    return this.currentUser$.pipe(
      switchMap((user) => this.fetchAndProcessHearths(user)) // Utilise switchMap pour gérer la dépendance aux données de l'utilisateur courant
    );
  }

  // Méthode privée pour faire l'appel API et traiter les données
  private fetchAndProcessHearths(user: User | null): Observable<Hearth[]> {
    return this.http.get<any[]>(`${this.apiUrl}/api/houses/details/`).pipe(
      map((data) => this.mapHearths(data, user)) // Mappe les données brutes en tableau des Hearth
    );
  }

  // Convertit un tableau de données brutes en un tableau d'instances Hearth
  private mapHearths(data: any[], user: User | null): Hearth[] {
    return data.map((item) => this.createHearthFromItem(item, user)); // Crée un Hearth pour chaque item de l'API
  }

  // Crée une instance Hearth à partir d'un objet de données
  private createHearthFromItem(item: any, user: User | null): Hearth {
    let hearthUsers: HearthUser[] = item.users.map(
      (apiUser: User) =>
        new HearthUser(apiUser.id, apiUser.username, apiUser.avatar) // Crée des instances de HearthUser
    );

    // Ajoute l'utilisateur courant s'il n'est pas déjà présent dans les utilisateurs du hearth
    if (user && !hearthUsers.some((hu) => hu.id === user.id)) {
      hearthUsers.push(new HearthUser(user.id, user.username, user.avatar));
    }

    // Crée et retourne une nouvelle instance de Hearth
    return new Hearth(
      item.id,
      item.name,
      hearthUsers,
      item.avatar,
      1 // TODO: Remplacer par l'ID réel de l'administrateur de la base de données
    );
  }

  addHearth(hearth: Hearth): Observable<Hearth> {
    return this.http.post<Hearth>(`${this.apiUrl}/api/houses/`, hearth);
  }

  updateHearthDetails(
    hearthId: number,
    updates: Partial<Hearth>
  ): Observable<Hearth> {
    return this.http
      .put<Hearth>(`${this.apiUrl}/api/house/${hearthId}/`, updates)
      .pipe(
        tap((updatedHearth) => {
          this.store.dispatch(
            HearthActions.updateHearthDetails({
              hearthId: hearthId,
              updates: updatedHearth,
            })
          );
        })
      );
  }

  // deleteHearth(id: number) {
  //   return this.http.delete<Hearth>(`${this.apiUrl}/api/houses/`, id);
  // }

  // Créer un token d'invitation pour un Hearth.
  sendHeartInvite(hearthId: string): Observable<any> {
    return this.http.post<string>(
      `${this.apiUrl}/api/house/${hearthId}/invite/`,
      hearthId
    );
  }
}

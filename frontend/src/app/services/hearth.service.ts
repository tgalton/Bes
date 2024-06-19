import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable, map } from 'rxjs';
import { Hearth, HearthUser } from '../models/hearth';
import { User } from '../models/user';

@Injectable({
  providedIn: 'root',
})
export class HearthService {
  private apiUrl = 'http://localhost:8000/housework';

  constructor(private http: HttpClient) {}

  // Récupère la liste de ses propres hearths
  getHearthsByUser(): Observable<Hearth[]> {
    return this.http.get<any[]>(`${this.apiUrl}/api/houses/details/`).pipe(
      map((data) =>
        data.map(
          (item) =>
            new Hearth(
              item.id,
              item.name,
              item.users.map(
                (user: User) =>
                  new HearthUser(user.id, user.username, user.avatar)
              ),
              item.avatar,
              1 // TODO: Renvoyé l'admin
            )
        )
      )
    );
  }

  addHearth(hearth: Hearth): Observable<Hearth> {
    return this.http.post<Hearth>(`${this.apiUrl}/api/houses/`, hearth);
  }

  updateHearth(hearth: Partial<Hearth>): Observable<Hearth> {
    return this.http.patch<Hearth>(`${this.apiUrl}/api/houses/`, hearth);
  }

  // deleteHearth(id: number) {
  //   return this.http.delete<Hearth>(`${this.apiUrl}/api/houses/`, id);
  // }

  // Créer un token d'invitation pour un Hearth.
  sendHeartInvite(hearthId: string): Observable<any> {
    return this.http.post<string>(
      `${this.apiUrl}/api/houses/${hearthId}/`,
      hearthId
    );
  }
}

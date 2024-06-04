import { Injectable } from '@angular/core';
import { Observable, of } from 'rxjs';
import { delay, map, tap } from 'rxjs/operators';
import { Hearth } from '../models/hearth';

@Injectable({
  providedIn: 'root',
})
export class HearthService {
  private hearths: Hearth[] = [
    new Hearth(1, 'Maison', [1, 2], 'maison.jpg', 1),
    new Hearth(2, 'Coloc', [1, 3], 'coloc.jpg', 3),
    new Hearth(3, 'Maison Vacance', [1, 3], 'vacance.jpg', 3),
  ];

  constructor() {}

  getHearthsByUser(userId: number): Observable<Hearth[]> {
    // Doit récupérer la liste de foyers de l'utilisateur et update le storeUser
    return of(this.hearths).pipe(
      delay(1000),
      map((hearths) =>
        hearths.filter((hearth) => hearth.users.includes(userId))
      )
    ); // Simule une requête HTTP avec délai
  }

  addHearth(hearth: Hearth): Observable<Hearth> {
    return of(hearth).pipe(
      tap((newHearth) => {
        this.hearths.push(newHearth);
      }),
      delay(1000)
    );
  }

  updateHearth(hearth: Hearth): Observable<Hearth> {
    return of(hearth).pipe(
      tap((updatedHearth) => {
        const index = this.hearths.findIndex((h) => h.id === updatedHearth.id);
        if (index !== -1) {
          this.hearths[index] = updatedHearth;
        }
      }),
      delay(1000)
    );
  }

  deleteHearth(id: number): Observable<null> {
    return of(null).pipe(
      tap(() => {
        this.hearths = this.hearths.filter((h) => h.id !== id);
      }),
      delay(1000)
    );
  }

  sendHeartInvite() {}

  acceptHeartInvite() {}
}

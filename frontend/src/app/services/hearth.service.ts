import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { Hearth } from '../models/hearth';

@Injectable({
  providedIn: 'root',
})
export class HearthService {
  private apiUrl = 'http://localhost:8000/housework';

  constructor(private http: HttpClient) {}

  // Récupère la liste de ses propres hearths
  getHearthsByUser(): Observable<Hearth[]> {
    // Doit récupérer la liste de foyers de l'utilisateur
    return this.http.get<Hearth[]>(`${this.apiUrl}/api/houses/`);
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

  sendHeartInvite() {}

  acceptHeartInvite() {}
}

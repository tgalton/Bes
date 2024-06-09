import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { User } from '../models/user';

//src/app/services/user.service.ts
@Injectable({
  providedIn: 'root',
})
export class UserService {
  private apiUrl = 'http://localhost:8000/account';

  constructor(private http: HttpClient) {}

  // Méthode pour ajouter un nouvel utilisateur
  addUser(user: User): Observable<User> {
    console.log(`${this.apiUrl}/register/`);
    return this.http.post<User>(`${this.apiUrl}/register/`, user);
  }

  // Méthode pour modifier un utilisateur existant
  updateUser(user: User): Observable<User> {
    return this.http.put<User>(`${this.apiUrl}/profiles/${user.id}/`, user);
  }

  // Méthode pour récupérer un utilisateur
  getUser(id: number): Observable<User> {
    return this.http.get<User>(`${this.apiUrl}/profiles/${id}/`);
  }

  // Méthode pour mettre à jour l'avatar d'un utilisateur
  updateUserAvatar(
    userId: number | undefined,
    avatarName: string | undefined
  ): Observable<any> {
    return this.http.patch(`${this.apiUrl}/profiles/${userId}/update_avatar/`, {
      avatar: avatarName,
    });
  }

  // Méthode pour récupérer les avatars et noms des utilisateurs par ID
  getUsersAvatarsAndNames(
    userIds: number[]
  ): Observable<{ id: number; name: string; avatar: string }[]> {
    return this.http.post<{ id: number; name: string; avatar: string }[]>(
      `${this.apiUrl}/profiles/get_avatars/`,
      { user_ids: userIds }
    );
  }
}

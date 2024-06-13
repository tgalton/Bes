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
  updateUser(user: User) {
    return this.http.patch<User>(`/api/user/update/`, user);
  }

  // Méthode pour récupérer un utilisateur
  getUser(id: number) {
    return this.http.get<User>(`/api/user/${id}/`);
  }

  // Méthode pour mettre à jour l'avatar d'un utilisateur
  updateUserAvatar(avatarName: string) {
    return this.http.post(`/api/user/profile/update/`, { avatarName });
  }

  // Méthode pour récupérer les avatars et noms des utilisateurs par ID
  getUsersAvatarsAndNames(
    userIds: number[]
  ): Observable<{ id: number; name: string; avatar: string }[]> {
    return this.http.post<{ id: number; name: string; avatar: string }[]>(
      `${this.apiUrl}/user/profiles/get_avatars/`,
      { user_ids: userIds }
    );
  }
}

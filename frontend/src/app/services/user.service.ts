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

  // Méthode pour ajouter un nouvel utilisateur (soit-même) lors
  // de la création de compte
  addUser(user: User): Observable<User> {
    console.log(`${this.apiUrl}/register/`);
    return this.http.post<User>(`${this.apiUrl}/register/`, user);
  }

  // Méthode pour modifier un utilisateur existant, ne fonctione que sur soit-même
  updateUser(user: Partial<User>): Observable<User> {
    return this.http.patch<User>(`${this.apiUrl}/user/update/`, user);
  }

  // Méthode pour récupérer un utilisateur, à la condition que cet
  // utilisateur partage un hearth ou house avec la personne connectée effectuant la requête
  getUser(id: number): Observable<User> {
    return this.http.get<User>(`${this.apiUrl}/user/${id}/`);
  }

  // Méthode pour mettre à jour l'avatar d'un utilisateur, devrait
  // utiliser updateUser idéalement
  updateUserAvatar(
    userId: number | undefined,
    avatarName: string
  ): Observable<User> {
    if (userId === undefined) {
      throw new Error('userId ne peut pas être undefined');
    }
    // Création du payload avec l'ID et l'avatar pour la mise à jour
    const updateData: Partial<User> = {
      id: userId,
      avatar: avatarName,
    };
    // Utilisation de la méthode updateUser pour effectuer la mise à jour
    return this.updateUser(updateData);
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

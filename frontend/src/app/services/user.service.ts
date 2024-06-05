import { Injectable } from '@angular/core';
import { Store, select } from '@ngrx/store';
import { Observable, of } from 'rxjs';
import { delay, tap } from 'rxjs/operators';
import { AppState } from '../app.state';
import { User } from '../models/user';
import { selectUser } from '../store/reducers/auth.reducer';

//src/app/services/user.service.ts
@Injectable({
  providedIn: 'root',
})
export class UserService {
  // Liste temporaire en attendant les vrais requêtes au back
  public users: User[] = [
    new User(
      1,
      'Tom',
      'galtontom@gmail.com',
      'mdp',
      25,
      true,
      undefined,
      'octopus_3937743'
    ),
    new User(2, 'Alice', 'alice@example.com', 'mdp', 30, true),
    new User(3, 'Bob', 'bob@example.com', 'mdp', 28, true),
  ];

  currentUserId: number | undefined;

  constructor(private store: Store<AppState>) {
    this.store.pipe(select(selectUser)).subscribe((user) => {
      this.currentUserId = user?.id;
    });
  }

  // Méthode pour ajouter un nouvel utilisateur
  addUser(user: User): Observable<User> {
    // Fonctionnement temporaire en attente de back
    return of(user).pipe(
      tap((user) => this.users.push(user)),
      delay(1000) // Simule un délai d'attente de 1 seconde pour simuler une requête HTTP
    );
  }

  // Méthode pour modifier un utilisateur existant
  updateUser(user: User): Observable<User> {
    // Fonctionnement temporaire en attente de back
    const index = this.users.findIndex((u) => u.id === user.id);
    if (index !== -1) {
      this.users[index] = { ...user };
      return of(user).pipe(
        delay(1000) // Simule un délai d'attente de 1 seconde pour simuler une requête HTTP
      );
    } else {
      throw new Error('Utilisateur non trouvé');
    }
  }

  getUser(id: number): Observable<User> {
    // Récupère l'user correspondant dans la liste
    const user = this.users.find((user) => user.id === id);
    if (user) {
      return of(user).pipe(
        delay(1000) // Simule un délai d'attente de 1 seconde pour simuler une requête HTTP
      );
    } else {
      throw new Error('Utilisateur non trouvé');
    }
  }

  updateUserAvatar(avatarName: string): Observable<User> {
    const index = this.users.findIndex((u) => u.id === this.currentUserId);
    console.log('4. Service: Find User for Avatar Update', index);
    if (index !== -1) {
      const updatedUser = { ...this.users[index], avatar: avatarName };
      this.users[index] = updatedUser;
      console.log('5. Service: User Found, Updating Avatar', updatedUser);
      return of(updatedUser).pipe(
        delay(1000) // Simulate delay
      );
    } else {
      console.error('6. Service: User not found');
      throw new Error('Utilisateur non trouvé');
    }
  }

  // WARNING: Cette fonctionnalité devra être sécurisée et limitée à des utilisateurs avec lesquels ont a des foyers en commun.
  getUsersAvatarsAndNames(
    userIds: number[]
  ): Observable<{ id: number; name: string; avatar: string }[]> {
    const usersInfo = this.users
      .filter((user) => userIds.includes(user.id))
      .map((user) => ({
        id: user.id,
        name: user.username,
        avatar: user.avatar || "Pas d'avatar",
      }));

    return of(usersInfo).pipe(delay(1000));
  }
}

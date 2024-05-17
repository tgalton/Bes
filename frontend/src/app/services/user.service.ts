import { Injectable } from '@angular/core';
import { Observable, of } from 'rxjs';
import { delay, tap } from 'rxjs/operators';
import { User } from '../models/user';

@Injectable({
  providedIn: 'root',
})
export class UserService {
  // Liste temporaire en attendant les vrais requêtes au back
  public users: User[] = [
    new User(1, 'Tom', 'galtontom@gmail.com', 'mdp', 25, true),
    new User(2, 'Alice', 'alice@example.com', 'mdp', 30, true),
    new User(3, 'Bob', 'bob@example.com', 'mdp', 28, true),
  ];

  constructor() {}

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
}

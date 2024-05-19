import { Injectable } from '@angular/core';
import { CanActivate, Router } from '@angular/router';
import { Store } from '@ngrx/store';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { AppState } from '../app.state'; // Assurez-vous que le chemin est correct
import { isLoggedInSelector } from './../store/selectors/auth.selector'; // Mettez à jour le chemin selon votre structure
@Injectable({
  providedIn: 'root',
})
export class AuthGuard implements CanActivate {
  constructor(private store: Store<AppState>, private router: Router) {}

  canActivate(): Observable<boolean> {
    return this.store.select(isLoggedInSelector).pipe(
      map((isAuthenticated) => {
        if (!isAuthenticated) {
          this.router.navigate(['/login']); // Redirige vers la page de connexion si l'utilisateur n'est pas authentifié
          return false;
        }
        return true;
      })
    );
  }
}

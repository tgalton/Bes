import { Injectable } from '@angular/core';
import { Observable, delay, of, tap } from 'rxjs';
import { UserService } from './user.service';

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  // private apiUrl = 'http://api.yourdomain.com'; // URL de l'API future

  private isLoggedIn: boolean = false;
  private redirectUrl!: string;
  constructor( 
    private userService: UserService) {
      this.isLoggedIn = JSON.parse(localStorage.getItem('isLoggedIn') || 'false')
    }
  // constructor(private http: HttpClient, private userService: UserService) {}

  authenticateUser(email: string | null | undefined, password: string | null | undefined): Observable<boolean> {
    // Simuler une requête API en attendant le backend
    const user = this.userService.users.find(u => u.email === email && u.password === password);
    const isLoggedIn = user !== undefined;
    return of(isLoggedIn).pipe(
      delay(1000),
      tap(isLoggedInValue => {
        this.isLoggedIn = isLoggedInValue;
        // Sauvegarder l'état de connexion dans le LocalStorage
        localStorage.setItem('isLoggedIn', JSON.stringify(isLoggedInValue));
      })
    );
  }
    // À utiliser quand le backend sera prêt
    // return this.http.post<User | undefined>(`${this.apiUrl}/authenticate`, { email, password });
  

  public isLogged(): Observable<boolean> {
    return of(this.isLoggedIn);
  }

  public logout(): void {
    // TODO: Ajouter un bouton logout à la barre
    this.isLoggedIn = false;
    localStorage.removeItem('isLoggedIn');
  }

}

// auth.service.ts
import { Injectable } from '@angular/core';
import { AbstractControl, ValidationErrors, ValidatorFn } from '@angular/forms';
import { Observable, of } from 'rxjs';
import { delay } from 'rxjs/operators';
import { User } from 'src/app/models/user';
@Injectable({
  providedIn: 'root',
})
export class AuthService {
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
  private isLoggedIn = false;

  constructor() {}
  authenticateUser(email: string, password: string): Observable<User> {
    const user = this.users.find(
      (u) => u.email === email && u.password === password
    );
    if (user) {
      this.isLoggedIn = true;
      return of(user).pipe(delay(1000)); // Simulates a delay of 1 second
    } else {
      throw new Error('Authentication failed');
    }
  }

  logout(): Observable<any> {
    this.isLoggedIn = false;
    return of({}).pipe(delay(1000)); // Simulates a delay of 1 second
  }

  isLogged(): Observable<boolean> {
    return of(this.isLoggedIn).pipe(delay(1000)); // Simulates a delay of 1 second
  }

  static isValidPassword(): ValidatorFn {
    return (control: AbstractControl): ValidationErrors | null => {
      const isValid =
        /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[\^$*.[\]{}()?"!@#%&/,><':;|_~`])[A-Za-z\d\^$*.[\]{}()?"!@#%&/,><':;|_~`]{8,}$/.test(
          control.value
        );
      return isValid
        ? null
        : { invalidPassword: 'Password does not meet criteria' };
    };
  }
}

// The existing API call prototypes are kept in comments for future reference
/*
  authenticateUser(email: string, password: string): Observable<User> {
    return this.http.post<User>('/api/login', { email, password });
  }

  logout(): Observable<any> {
    return this.http.post('/api/logout', {});
  }

  isLogged(): Observable<boolean> {

  */

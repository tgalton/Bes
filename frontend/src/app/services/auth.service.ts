// auth.service.ts
import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { AbstractControl, ValidationErrors, ValidatorFn } from '@angular/forms';
import { Observable, of, throwError } from 'rxjs';
import { catchError, tap } from 'rxjs/operators';

@Injectable({
  providedIn: 'root',
})
export class AuthService {
  private apiUrl = 'http://localhost:8000/account';
  constructor(private http: HttpClient) {}

  authenticateUser(email: string, password: string): Observable<any> {
    return this.http
      .post<{ access: string; refresh: string }>(`${this.apiUrl}/login/`, {
        email,
        password,
      })
      .pipe(
        tap((resp) => {
          localStorage.setItem('auth_token', resp.access);
          localStorage.setItem('refresh_token', resp.refresh);
        }),
        catchError(this.handleError)
      );
  }

  private handleError(error: HttpErrorResponse) {
    // Client or Network Error
    return throwError(() => error.error || 'Server error');
  }

  getToken(): string | null {
    return localStorage.getItem('auth_token');
  }

  logout(): void {
    localStorage.removeItem('auth_token');
    localStorage.removeItem('refresh_token');
  }

  isLogged(): Observable<boolean> {
    const token = localStorage.getItem('auth_token');
    return of(!!token); // retourne true si le token est présent, sinon false
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

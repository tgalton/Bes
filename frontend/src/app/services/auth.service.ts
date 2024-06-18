// auth.service.ts
import {
  HttpClient,
  HttpErrorResponse,
  HttpHeaders,
} from '@angular/common/http';
import { Injectable } from '@angular/core';
import { AbstractControl, ValidationErrors, ValidatorFn } from '@angular/forms';
import { Observable, of, throwError } from 'rxjs';
import { catchError, tap } from 'rxjs/operators';

@Injectable({
  providedIn: 'root',
})
export class AuthService {
  private apiUrl = 'http://localhost:8000/account';
  httpOptions = {
    headers: new HttpHeaders({ 'Content-Type': 'application/json' }),
  };
  constructor(private http: HttpClient) {}

  authenticateUser(email: string, password: string): Observable<any> {
    return this.http
      .post<{ access: string; refresh: string; user_id: number }>(
        `${this.apiUrl}/login/`,
        {
          email,
          password,
        },
        this.httpOptions
      )
      .pipe(
        tap((resp) => {
          console.log(resp.access);
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

  refreshToken(): Observable<any> {
    const refreshToken = localStorage.getItem('refresh_token');
    return this.http
      .post<{ access: string }>(`${this.apiUrl}/refresh/`, {
        refresh: refreshToken,
      })
      .pipe(
        tap((resp) => localStorage.setItem('auth_token', resp.access)),
        catchError(this.handleError)
      );
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

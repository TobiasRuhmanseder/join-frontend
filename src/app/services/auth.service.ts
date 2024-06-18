import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { environment } from '../../environments/environment.development';
import { Observable, catchError, map, of, tap } from 'rxjs';
import { AuthResponse } from '../interface/auth-response';
import { Router } from '@angular/router';
import { CurrentUserService } from './current-user.service';
import { TokenResponse } from '../interface/token-response';

@Injectable({
  providedIn: 'root'
})
export class AuthService {

  constructor(private http: HttpClient, private router: Router, private currentUserService: CurrentUserService) {
  }

  login(username: string, password: string): Observable<any> {
    const url = environment.baseUrl + "/api/login/";
    const body = {
      "username": username,
      "password": password
    }
    return this.http.post<AuthResponse>(url, body).pipe(
      tap(response => {
        localStorage.setItem('token', response.token);
        this.currentUserService.fetchCurrentUser();
        return response;
      })
    )
  }

  getToken(): string | null {
    return localStorage.getItem('token');
  }

  isAuthenticated(): Observable<boolean> {
    const token = this.getToken();
    if (token) return this.validateToken(token)
    else return of(false)
  }

  validateToken(token: string) {
    const url = environment.baseUrl + "/api/check_token/";
    const body = { token };

    return this.http.post<TokenResponse>(url, body).pipe(
      map(response => {
        if (response.message === 'Token exists') return true
        else return false
      })
      ,
      catchError(() => of(false))
    );
  }


  logout(): void {
    localStorage.removeItem('token');
    this.currentUserService.clearCurrentUser();
    this.router.navigateByUrl('/login');
  }
}

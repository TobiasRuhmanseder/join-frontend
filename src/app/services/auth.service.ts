import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { environment } from '../../environments/environment.development';
import { Observable, map, tap } from 'rxjs';
import { AuthResponse } from '../interface/auth-response';
import { Router } from '@angular/router';
import { CurrentUserService } from './current-user.service';

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

  initializeCurrentUser(): void {
    const token = this.getToken();
    if (token) {
      this.currentUserService.fetchCurrentUser();
    }
  }


  isAuthenticated(): boolean {
    return !!this.getToken();
  }

  logout(): void {
    localStorage.removeItem('token');
    this.currentUserService.clearCurrentUser();
    this.router.navigateByUrl('/login');
  }
}

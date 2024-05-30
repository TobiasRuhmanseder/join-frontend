import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { environment } from '../../environments/environment.development';
import { Observable, map } from 'rxjs';
import { AuthResponse } from '../interface/auth-response';

@Injectable({
  providedIn: 'root'
})
export class AuthService {

  constructor(private http: HttpClient) {
  }

  login(username: string, password: string): Observable<any> {
    const url = environment.baseUrl + "/api/login/";
    const body = {
      "username": username,
      "password": password
    }
    //const body = JSON.stringify(loginData);
    return this.http.post<AuthResponse>(url, body).pipe(         // later create a interface of the typ any
      map(response => {
        localStorage.setItem('token', response.token);
        return response;
      })
    )
  }
}

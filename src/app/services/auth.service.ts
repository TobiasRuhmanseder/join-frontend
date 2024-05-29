import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { environment } from '../../environments/environment.development';
import { Observable, map } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class AuthService {

  constructor(private http: HttpClient) {
  }

  login(username: string, password: string): Observable<any> {
    const url = environment.baseUrl + "/api/login";
    const body = {
      "username": username,
      "password": password
    }

    return this.http.post<any>(url, password).pipe(         // later create a interface of the typ any
      map(response => {
        localStorage.setItem('token', response.token);
        return response;
      })
    )


  }
}

import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable, Subscription, catchError, map, of, switchMap } from 'rxjs';
import { environment } from '../../environments/environment.development';
import { CreateUser, User } from '../interface/user';
import { UserService } from './user.service';
import { enableDebugTools } from '@angular/platform-browser';

@Injectable({
  providedIn: 'root'
})
export class GuestUserService {

  constructor(private http: HttpClient, private userService: UserService) { }

  checkAndCreateGuestUser(): Observable<any> {
    const url = `${environment.baseUrl}/api/guest_exists/`;
    return this.http.get<any>(url).pipe(
      switchMap(response => {
        if (!response.exists) {
          return this.createGuestUser(this.guestUser());
        } else {
          return of(response);
        }
      }),
      catchError(error => {
        console.error('Error checking or creating guest user:', error);
        return of({ error: 'Error checking or creating guest user' });
      })
    );
  }

  private guestUser(): CreateUser {
    return {
      username: 'guest',
      password: 'guest', 
      email: 'guest@guest.com',
      first_name: 'Guest',
      last_name: 'User'
    };
  }

  private createGuestUser(userData: CreateUser): Observable<any> {
    return this.userService.signUpUser(userData).pipe(
      catchError(error => {
        console.error('Error creating guest user:', error);
        return of({ error: 'Error creating guest user' });
      })
    );
}
}

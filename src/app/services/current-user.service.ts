import { User } from './../interface/user';
import { Injectable } from '@angular/core';
import { environment } from '../../environments/environment.development';
import { HttpClient } from '@angular/common/http';
import { BehaviorSubject, Observable, take, tap } from 'rxjs';
import { NonNullableFormBuilder } from '@angular/forms';

@Injectable({
  providedIn: 'root'
})
export class CurrentUserService {
  private currentUserSubject = new BehaviorSubject<User | null>(null);
  public currentUser$ = this.currentUserSubject.asObservable();

  constructor(private http: HttpClient) {

  }

  getCurrentUser(): Observable<User> {
    const url = environment.baseUrl + "/api/current_user/";
    return this.http.get<User>(url).pipe(tap((currentUser: User) => this.currentUserSubject.next(currentUser)))
  }

  fetchCurrentUser() {
    if (this.currentUserSubject.value === null) {
      this.getCurrentUser().pipe(take(1)).subscribe();
    }
  }

  getCurrentUserValue(): User | null {
    return this.currentUserSubject.value
  }

  clearCurrentUser() {
    this.currentUserSubject.next(null);
  }
}

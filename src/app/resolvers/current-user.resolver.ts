import { Injectable } from '@angular/core';
import { Resolve, Router } from '@angular/router';
import { Observable, catchError, of, switchMap } from 'rxjs';
import { User } from '../interface/user';
import { CurrentUserService } from '../services/current-user.service';
import { AuthService } from '../services/auth.service';
@Injectable({
    providedIn: 'root'
})
export class CurrentUserResolver implements Resolve<User | null> {
    constructor(private currentUserService: CurrentUserService, private authService: AuthService, private router: Router) { }

    resolve(): Observable<User | null> {
        return this.authService.isAuthenticated().pipe(
            switchMap(isAuth => {
                if (isAuth) {
                    return this.currentUserService.getCurrentUser().pipe(
                        catchError(() => {
                            this.router.navigate(['/login']);
                            return of(null);
                        })
                    );
                } else {
                    this.router.navigate(['/login']);
                    return of(null);
                }
            }),
            catchError(err => {
                console.error('Authentication check failed', err);
                this.router.navigate(['/login']);
                return of(null);
            })
        );
    }
}


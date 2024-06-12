import { Injectable } from '@angular/core';
import { Resolve } from '@angular/router';
import { Observable } from 'rxjs';
import { User } from '../interface/user';
import { CurrentUserService } from '../services/current-user.service';
@Injectable({
    providedIn: 'root'
})
export class CurrentUserResolver implements Resolve<User | null> {
    constructor(private currentUserService: CurrentUserService) { }

    resolve(): Observable<User | null> {
        return this.currentUserService.getCurrentUser();
    }
}

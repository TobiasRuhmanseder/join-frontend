import { Component, OnInit } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { LoginComponent } from './login/login.component';
import { NotificationComponent } from './notification/notification.component';
import { AuthService } from './services/auth.service';
import { GuestUserService } from './services/guest-user.service';
import { take } from 'rxjs';
import { User } from './interface/user';


@Component({
  selector: 'app-root',
  standalone: true,
  imports: [RouterOutlet, LoginComponent, NotificationComponent],
  templateUrl: './app.component.html',
  styleUrl: './app.component.scss',

})
export class AppComponent implements OnInit {
  title = 'join';

  constructor(private authService: AuthService, private guestUserService: GuestUserService) {
  }

  ngOnInit(): void {
    this.authService.initializeCurrentUser();
    this.checkGuestUser();
  }


  checkGuestUser(): void {
    this.guestUserService.checkAndCreateGuestUser().pipe(
      take(1)
    ).subscribe({
      next: (response) => {
        if (response.error) {
          console.error(response.error);
        } else {
          console.log('Guest user checked/created:', response);
        }
      },
      error: error => {
        console.error('Error:', error);
      }}
    );
  }
}

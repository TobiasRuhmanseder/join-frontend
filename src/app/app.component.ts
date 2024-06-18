import { Component, OnInit } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { LoginComponent } from './login/login.component';
import { NotificationComponent } from './notification/notification.component';
import { AuthService } from './services/auth.service';
import { GuestUserService } from './services/guest-user.service';
import { take } from 'rxjs';
import { User } from './interface/user';
import { BoardService } from './services/board.service';


@Component({
  selector: 'app-root',
  standalone: true,
  imports: [RouterOutlet, LoginComponent, NotificationComponent],
  templateUrl: './app.component.html',
  styleUrl: './app.component.scss',

})
export class AppComponent implements OnInit {
  title = 'join';

  constructor(private authService: AuthService, private guestUserService: GuestUserService, private boardService: BoardService) {
  }

  ngOnInit(): void {
    this.checkGuestUser();
    this.checkBoardExists();
  }

  checkGuestUser() {
    this.guestUserService.checkAndCreateGuestUser().pipe(
      take(1)
    ).subscribe({
      error: error => {
        console.error('Error:', error);
      }
    }
    );
  }

  checkBoardExists() {
    this.boardService.checkAndCreateBoard(1, 'Default Board', 'This is the default Board')
      .pipe(take(1)).subscribe({
        error: err => {
          console.error('Error checking or creating board:', err);
        }
      });

  }
}

import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { LoginDialogComponent } from './login-dialog/login-dialog.component';
import { SignUpDialogComponent } from './sign-up-dialog/sign-up-dialog.component';



@Component({
  selector: 'app-login',
  standalone: true,
  imports: [CommonModule, LoginDialogComponent, SignUpDialogComponent],
  templateUrl: './login.component.html',
  styleUrl: './login.component.scss'
})
export class LoginComponent {
  showOverlay = true;

  onAnimationEnd() {
    this.showOverlay = false;
  }

}

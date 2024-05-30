import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { LoginDialogComponent } from './login-dialog/login-dialog.component';
import { SignUpDialogComponent } from './sign-up-dialog/sign-up-dialog.component';
import { trigger, state, style, animate, transition } from '@angular/animations';
@Component({
  selector: 'app-login',
  standalone: true,
  imports: [CommonModule, LoginDialogComponent, SignUpDialogComponent],
  templateUrl: './login.component.html',
  styleUrl: './login.component.scss',
  animations: [
    trigger('slideInOut', [
      state('in', style({
        transform: 'translateX(0)'
      })),
      state('out', style({
        transform: 'translateX(100vw)'
      })),
      transition('in => out', animate('500ms ease-in-out')),
      transition('out => in', animate('500ms ease-in-out'))
    ])
  ]
})
export class LoginComponent {
  showOverlay = true;
  signUp = false;


  onAnimationEnd() {
    this.showOverlay = false;
  }

  toggleSignUp() {
    this.signUp = !this.signUp;
  }

  get loginState() {
    return this.signUp ? 'out' : 'in';
  }

  get signUpState() {
    return this.signUp ? 'in' : 'out';
  }
}

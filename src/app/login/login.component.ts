import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { LoginDialogComponent } from './login-dialog/login-dialog.component';
import { SignUpDialogComponent } from './sign-up-dialog/sign-up-dialog.component';
import { trigger, state, style, animate, transition } from '@angular/animations';
import { AuthService } from '../services/auth.service';
import { Router } from '@angular/router';
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
export class LoginComponent implements OnInit {
  showOverlay = true;
  signUp = false;

  constructor(private authService: AuthService, private router: Router) { }


  ngOnInit(): void {
    this.authService.isAuthenticated().subscribe(isAuth => {
      if (isAuth) this.router.navigateByUrl('/main')
    })
  }

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


import { CreateUser } from './../../interface/user';
import { CommonModule } from '@angular/common';
import { Component, Input, OnDestroy } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { LoginComponent } from '../login.component';
import { UserService } from '../../services/user.service';
import { Subscription, timer } from 'rxjs';
import { NotificationService } from '../../services/notification.service';
import { Router } from '@angular/router';


@Component({
  selector: 'app-sign-up-dialog',
  standalone: true,
  imports: [FormsModule, CommonModule],
  templateUrl: './sign-up-dialog.component.html',
  styleUrl: './sign-up-dialog.component.scss'
})
export class SignUpDialogComponent implements OnDestroy {
  usernameValue: string = '';
  firstNameValue: string = '';
  lastNameValue: string = '';
  emailValue: string = '';
  passwordValue: string = '';
  confirmPasswordValue: string = '';
  acceptPrivacyPolicy: boolean = false;

  touchedUsername: boolean = false;
  touchedFirstName: boolean = false;
  touchedLastName: boolean = false;
  touchedEmail: boolean = false;
  touchedPassword: boolean = false;
  touchedConfirmPassword: boolean = false;
  touchedPrivacyPolicy: boolean = false;

  usernamePattern = /^[a-zA-Z0-9_]+$/;
  namePattern = /^[a-zA-Z]+$/;
  passwordPattern = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/;

  @Input() parentComponent!: LoginComponent;
  private createUserSubscription: Subscription | null = null;
  private timerSubscription!: Subscription;
  errorMessage: string | null = null;
  constructor(private userService: UserService, private notificationService: NotificationService, private router: Router) {
  }

  ngOnDestroy(): void {
    if (this.createUserSubscription) {
      this.createUserSubscription.unsubscribe();
    }
    if (this.timerSubscription) {
      this.timerSubscription.unsubscribe();
    }
  }


  signUp() {
    if (this.isFormValid()) {
      let userData: CreateUser = {
        "username": this.usernameValue,
        "first_name": this.firstNameValue,
        "last_name": this.lastNameValue,
        "email": this.emailValue,
        "password": this.passwordValue
      }
      this.createUserSubscription = this.createUser(userData);
    }
  }


  createUser(userData: CreateUser): Subscription {
    return this.userService.signUpUser(userData).subscribe({
      next: response => {
        this.deleteInputs();
        this.notificationService.showMessage('You Signed Up successfully!');
        this.timerSubscription = timer(1500).subscribe(() => {
          this.router.navigate(['/login']);
          window.location.reload();
        })
      },
      error: error => this.handleError(error)
    })
  }

  handleError(error: any) {
    if (error.status === 400) {
      if (error.error.username) {
        this.notificationService.showMessage('Username already taken!', true);
      } else {
        this.notificationService.showMessage('Something went wrong!', true);
      }
    } else {
      this.notificationService.showMessage('Something went wrong!', true);
    }
  }

  deleteInputs() {
    this.usernameValue = '';
    this.firstNameValue = '';
    this.lastNameValue = '';
    this.emailValue = '';
    this.passwordValue = '';
    this.confirmPasswordValue = '';
    this.acceptPrivacyPolicy = false;

    this.touchedUsername = false;
    this.touchedFirstName = false;
    this.touchedLastName = false;
    this.touchedEmail = false;
    this.touchedPassword = false;
    this.touchedConfirmPassword = false;
    this.touchedPrivacyPolicy = false;
  }

  validateField(field: string) {
    switch (field) {
      case 'username':
        this.touchedUsername = true;
        break;
      case 'firstName':
        this.touchedFirstName = true;
        break;
      case 'lastName':
        this.touchedLastName = true;
        break;
      case 'email':
        this.touchedEmail = true;
        break;
      case 'password':
        this.touchedPassword = true;
        break;
      case 'confirmPassword':
        this.touchedConfirmPassword = true;
        break;
      case 'privacyPolicy':
        this.touchedPrivacyPolicy = true;
        break;
    }
  }

  isFieldValid(field: string): boolean {
    switch (field) {
      case 'username':
        return this.usernameValue.trim() !== '' && this.usernamePattern.test(this.usernameValue);
      case 'firstName':
        return this.firstNameValue.trim() !== '' && this.namePattern.test(this.firstNameValue);
      case 'lastName':
        return this.lastNameValue.trim() !== '' && this.namePattern.test(this.lastNameValue);
      case 'email':
        return this.emailValue.trim() !== '';
      case 'password':
        return this.passwordPattern.test(this.passwordValue);
      case 'confirmPassword':
        return this.confirmPasswordValue.trim() !== '' && this.passwordValue === this.confirmPasswordValue;
      case 'privacyPolicy':
        return this.acceptPrivacyPolicy;
      default:
        return false;
    }
  }

  isFormValid(): boolean {
    return this.isFieldValid('username') &&
      this.isFieldValid('firstName') &&
      this.isFieldValid('lastName') &&
      this.isFieldValid('email') &&
      this.isFieldValid('password') &&
      this.isFieldValid('confirmPassword') &&
      this.isFieldValid('privacyPolicy');
  }

  onBlur(field: string) {
    if (this.getFieldValue(field).trim() !== '') {
      this.validateField(field);
    }
  }

  getFieldValue(field: string): string {
    switch (field) {
      case 'username':
        return this.usernameValue;
      case 'firstName':
        return this.firstNameValue;
      case 'lastName':
        return this.lastNameValue;
      case 'email':
        return this.emailValue;
      case 'password':
        return this.passwordValue;
      case 'confirmPassword':
        return this.confirmPasswordValue;
      case 'privacyPolicy':
        return this.acceptPrivacyPolicy ? 'true' : '';
      default:
        return '';
    }
  }

  onInputChange(field: string) {
    if (this.getFieldValue(field).trim() !== '') {
      this.validateField(field);
    }
  }

  goToLogin() {
    this.parentComponent.toggleSignUp();
  }

  navigateToPrivacyPolicy() {
    this.router.navigateByUrl('privacy_policy');
  }

}

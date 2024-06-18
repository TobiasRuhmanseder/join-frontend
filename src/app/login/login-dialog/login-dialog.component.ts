import { Component, OnDestroy } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { AuthService } from '../../services/auth.service';
import { CommonModule } from '@angular/common';
import { Subscription, timer } from 'rxjs';
import { Router } from '@angular/router';
import { NotificationService } from '../../services/notification.service';



@Component({
  selector: 'app-login-dialog',
  standalone: true,
  imports: [FormsModule, CommonModule],
  templateUrl: './login-dialog.component.html',
  styleUrl: './login-dialog.component.scss'
})
export class LoginDialogComponent implements OnDestroy {
  usernameValue: string = '';
  passwordValue: string = '';
  passwordFieldType: string = 'password';
  passwordIcon: string = '../../../assets/img/lock.svg';
  requiredPassword: boolean = false;
  requiredUsername: boolean = false;
  notificationMessage: string | null = null;


  private loginSubscription: Subscription | null = null;
  private timerSubscription: Subscription | null = null;

  constructor(private authService: AuthService, private router: Router, private notificationService: NotificationService) {
  }

  ngOnDestroy(): void {
    if (this.loginSubscription) {
      this.loginSubscription.unsubscribe();
    }
    if (this.timerSubscription) {
      this.timerSubscription.unsubscribe();
    }
  }

  togglePasswordVisibility() {
    if (this.passwordFieldType === 'password') {
      this.passwordFieldType = 'text';
      this.passwordIcon = '../../../assets/img/visibility_on.svg'; // Auge-Icon ohne Durchstrich
    } else {
      this.passwordFieldType = 'password';
      this.passwordIcon = '../../../assets/img/visibility_off.svg'; // Auge-Icon mit Durchstrich
    }
  }

  togglePasswordIcon(focused: boolean) {
    if (focused) {
      this.passwordIcon = '../../../assets/img/visibility_off.svg'; // Auge-Icon mit Durchstrich
    } else if (!focused) {
      this.passwordIcon = '../../../assets/img/lock.svg'; // Schloss-Icon
    }
  }

  deleteInputs() {
    this.usernameValue = '';
    this.passwordValue = '';
  }

  checkInputs() {
    if (this.usernameValue == '') {
      this.requiredUsername = true;
    }
    if (this.passwordValue == '') {
      this.requiredPassword = true;
    }
    if (this.passwordValue && this.usernameValue) return true
    else return false
  }

  deleteRequiredFields() {
    this.requiredPassword = false;
    this.requiredUsername = false;
  }

  loginWithUsernameAndPassword() {
    localStorage.removeItem('token');
    if (this.checkInputs()) {
      this.loginSubscription = this.authService.login(this.usernameValue, this.passwordValue).subscribe({
        next: response => {
          this.deleteInputs();
          this.notificationService.showMessage('Login was successful!');
          this.timerSubscription = timer(1500).subscribe(() => {
            this.router.navigate(['/main']);
          })
        },
        error: error => {
          if (error.status === 401) {
            this.notificationService.showMessage('Invalid login credentials!', true);
          } else {
            this.notificationService.showMessage('Something went wrong!', true);
          }
        }
      });
    }
  }

  loginWithGuest() {
    this.usernameValue = 'guest'
    this.passwordValue = 'guest'
    this.loginWithUsernameAndPassword();
  }
}



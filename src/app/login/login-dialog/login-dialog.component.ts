import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { AuthService } from '../../services/auth.service';

@Component({
  selector: 'app-login-dialog',
  standalone: true,
  imports: [FormsModule],
  templateUrl: './login-dialog.component.html',
  styleUrl: './login-dialog.component.scss'
})
export class LoginDialogComponent {
  usernameValue: string = '';
  passwordValue: string = '';
  passwordFieldType: string = 'password';
  passwordIcon: string = '../../../assets/img/lock.svg';
  requiredPassword: boolean = false;
  requiredUsername: boolean = false;

  constructor(private authService: AuthService) {

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
    if (this.checkInputs()) {
      console.log(this.checkInputs());

      this.authService.login(this.usernameValue, this.passwordValue).subscribe({
        next: response => {
          // Handle successful login
          console.log('Login successful:', response);
        },
        error: error => {
          // Handle login error
          console.error('Login failed:', error);
        }
      });
    }
  }
}



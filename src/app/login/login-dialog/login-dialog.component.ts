import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';

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
  }

  deleteRequiredFields() {
    this.requiredPassword = false;
    this.requiredUsername = false;
  }
}

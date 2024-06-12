import { Component } from '@angular/core';
import { PrivacyPolicyComponent } from '../../main/content/privacy-policy/privacy-policy.component';

@Component({
  selector: 'app-privacy-policy-signup',
  standalone: true,
  imports: [PrivacyPolicyComponent],
  templateUrl: './privacy-policy-signup.component.html',
  styleUrl: './privacy-policy-signup.component.scss'
})
export class PrivacyPolicySignupComponent {

}

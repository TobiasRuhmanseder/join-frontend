import { Component } from '@angular/core';
import { LegalNoticeComponent } from '../../main/content/legal-notice/legal-notice.component';


@Component({
  selector: 'app-legal-notice-signup',
  standalone: true,
  imports: [LegalNoticeComponent],
  templateUrl: './legal-notice-signup.component.html',
  styleUrl: './legal-notice-signup.component.scss'
})
export class LegalNoticeSignupComponent {

}

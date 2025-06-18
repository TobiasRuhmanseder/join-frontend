import { Component, Inject, OnInit } from '@angular/core';
import { PrivacyPolicyComponent } from '../../main/content/privacy-policy/privacy-policy.component';
import { DOCUMENT } from '@angular/common';
@Component({
  selector: 'app-privacy-policy-signup',
  standalone: true,
  imports: [PrivacyPolicyComponent],
  templateUrl: './privacy-policy-signup.component.html',
  styleUrl: './privacy-policy-signup.component.scss'
})
export class PrivacyPolicySignupComponent implements OnInit {

constructor(@Inject(DOCUMENT) private document: Document) {}

  ngOnInit() {
    this.document.body.style.overflow = 'scroll';
  }
}

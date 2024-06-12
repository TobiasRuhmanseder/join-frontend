import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PrivacyPolicySignupComponent } from './privacy-policy-signup.component';

describe('PrivacyPolicySignupComponent', () => {
  let component: PrivacyPolicySignupComponent;
  let fixture: ComponentFixture<PrivacyPolicySignupComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [PrivacyPolicySignupComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(PrivacyPolicySignupComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

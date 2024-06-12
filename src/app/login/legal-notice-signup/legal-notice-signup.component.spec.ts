import { ComponentFixture, TestBed } from '@angular/core/testing';

import { LegalNoticeSignupComponent } from './legal-notice-signup.component';

describe('LegalNoticeSignupComponent', () => {
  let component: LegalNoticeSignupComponent;
  let fixture: ComponentFixture<LegalNoticeSignupComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [LegalNoticeSignupComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(LegalNoticeSignupComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

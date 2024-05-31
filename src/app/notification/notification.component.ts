import { Component, Input, OnDestroy, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { trigger, state, style, transition, animate } from '@angular/animations';
import { NotificationService } from '../services/notification.service';
import { Subscription, timer } from 'rxjs';

@Component({
  selector: 'app-notification',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './notification.component.html',
  styleUrl: './notification.component.scss',
  animations: [
    trigger('slideInOut', [
      state('in', style({
        transform: 'translateY(-70px)'
      })),
      state('out', style({
        transform: 'translateY(100%)'
      })),
      transition('in => out', animate('300ms ease-in-out')),
      transition('out => in', animate('300ms ease-in-out'))
    ])
  ]
})
export class NotificationComponent implements OnInit, OnDestroy {
  message: string | null = null;
  isError: boolean = false;
  show: boolean = false;
  private timerSubscription!: Subscription;
  private subscription: Subscription | null = null;

  constructor(private notificationService: NotificationService) { }

  ngOnInit() {
    this.subscription = this.notificationService.message$.subscribe(message => {
      if (message) {
        this.message = message;
        this.isError = this.notificationService.isError;
        this.showNotification();
      } else {
        this.show = false;
      }
    });
  }

  ngOnDestroy() {
    if (this.subscription) {
      this.subscription.unsubscribe();
    }
    if (this.timerSubscription) {
      this.timerSubscription.unsubscribe();
    }
  }

  get animationState() {
    return this.show ? 'in' : 'out';
  }

  showNotification() {
    this.show = true;
    this.timerSubscription = timer(1500).subscribe(() => { // Duration of the ad
      this.show = false;
      this.notificationService.clearMessage();
    });
  }
}

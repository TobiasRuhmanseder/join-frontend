import { Component, Input, OnDestroy, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { trigger, state, style, transition, animate } from '@angular/animations';
import { NotificationService } from '../services/notification.service';
import { Subscription } from 'rxjs';

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
  }

  get animationState() {
    return this.show ? 'in' : 'out';
  }

  showNotification() {
    this.show = true;
    setTimeout(() => {
      this.show = false;
      this.notificationService.clearMessage();
    }, 1500); // Dauer der Anzeige
  }
}

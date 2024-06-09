import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class NotificationService {
  private messageSubject = new BehaviorSubject<string | null>(null);
  private isErrorSubject = new BehaviorSubject<boolean>(false);
  message$ = this.messageSubject.asObservable();
  isError$ = this.isErrorSubject.asObservable();

  showMessage(message: string, isError: boolean = false) {
    this.isErrorSubject.next(isError);
    this.messageSubject.next(message);
  }

  clearMessage() {
    this.messageSubject.next(null);
    this.isErrorSubject.next(false);
  }

  get isError(): boolean {
    return this.isErrorSubject.getValue();
  }
}

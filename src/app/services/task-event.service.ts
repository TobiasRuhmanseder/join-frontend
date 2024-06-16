import { Injectable } from '@angular/core';
import { Subject } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class TaskEventService {
  private taskDeletedSource = new Subject<number>();
  taskDeleted$ = this.taskDeletedSource.asObservable();

  constructor() { }

  notifyTaskDeleted(taskId: number) {
    this.taskDeletedSource.next(taskId);
  }
}

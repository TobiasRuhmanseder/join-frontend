import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { trigger, state, style, transition, animate } from '@angular/animations';
import { take, timer } from 'rxjs';
import { GetTask, Subtask } from '../../../../interface/task';
import { CommonModule } from '@angular/common';
import { TaskService } from '../../../../services/task.service';
import { NotificationService } from '../../../../services/notification.service';
import { Router } from '@angular/router';
import { TaskEventService } from '../../../../services/task-event.service';

@Component({
  selector: 'app-task-dialog',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './task-dialog.component.html',
  styleUrl: './task-dialog.component.scss',
  animations: [
    trigger('slideInOut', [
      state('in', style({ transform: 'translateX(0)', opacity: 1 })),
      state('out', style({ transform: 'translateX(100vw)', opacity: 1 })),
      transition('out => in', [animate('500ms ease-in')]),
      transition('in => out', [animate('500ms ease-out')])
    ])
  ]
})
export class TaskDialogComponent implements OnInit {
  @Input() task!: GetTask;
  private isClosed: boolean = false;
  closeDialog: (() => void) | undefined;
  public slideInOut = 'out';

  constructor(private router: Router, private taskService: TaskService, private notificationService: NotificationService, private taskEventService: TaskEventService) { }

  ngOnInit() {
    timer(10).pipe(
      take(1)
    ).subscribe(() => {
      this.slideInOut = 'in';
    });
  }

  close() {
    if (this.isClosed) {
      return;
    }
    this.isClosed = true;
    this.slideInOut = 'out';
    timer(300).pipe(
      take(1)
    ).subscribe(() => {
      if (this.closeDialog) {
        this.closeDialog();
        this.taskEventService.notifyTaskDeleted(this.task.id);
      } else {
      }
    });
  }

  deleteTask() {
    this.taskService.deleteTask(this.task.id).pipe(take(1)).subscribe({
      complete: () => {
        this.notificationService.showMessage('delete successfully!', true);
        this.close();

      },
      error: err => {
        this.notificationService.showMessage('Failed to delete task!', true);
      }
    });
  }

  editTask() {
    this.close();
    this.router.navigate(['main/edit_task', this.task.id]);
  }


  getPathPrio(prio: string) {
    switch (prio) {
      case 'urgent':
        return "../../../../../assets/img/urgent_logo.svg"
      case 'medium':
        return "../../../../../assets/img/medium_logo.svg"
      case 'low':
        return "../../../../../assets/img/low_logo.svg"
      default:
        return ""
    }
  }

  getInitials(user: any): string {
    const firstNameInitial = user.first_name ? user.first_name.charAt(0).toUpperCase() : '';
    const lastNameInitial = user.last_name ? user.last_name.charAt(0).toUpperCase() : '';
    return firstNameInitial + lastNameInitial;
  }

  toggleSubtask(subtask: Subtask) {
    subtask.completed = !subtask.completed; // Toggle the completed status
    this.updateSubtasksOnBackend();
  }

  updateSubtasksOnBackend() {
    this.taskService.updateSubtasks(this.task.id, this.task.subtasks).pipe(take(1)).subscribe({
      next: updatedTask => {
        this.task.subtasks = updatedTask.subtasks;
      },
      error: err => {
        this.notificationService.showMessage('Something went wrong!', true);
        this.close();
      }
    });
  }
}

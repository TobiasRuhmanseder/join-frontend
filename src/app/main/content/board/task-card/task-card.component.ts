import { Component, Input, ViewContainerRef } from '@angular/core';
import { GetTask } from '../../../../interface/task';
import { CommonModule } from '@angular/common';
import { DialogService } from '../../../../services/dialog.service';


@Component({
  selector: 'app-task-card',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './task-card.component.html',
  styleUrl: './task-card.component.scss'
})
export class TaskCardComponent {
  @Input() task!: GetTask;
  @Input() loading: boolean = false;

  constructor(private dialogService: DialogService, private viewContainerRef: ViewContainerRef) { }

  openDialog() {
    this.dialogService.openDialog(this.viewContainerRef, this.task);
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

  getProgressWidth(): number {
    if (!this.task.subtasks || this.task.subtasks.length === 0) {
      return 0;
    }
    const completedSubtasks = this.getCompletedSubtasks();
    return (completedSubtasks / this.task.subtasks.length) * 100;
  }

  getCompletedSubtasks(): number {
    return this.task.subtasks.filter(subtask => subtask.completed).length;
  }

  getInitials(user: any): string {
    const firstNameInitial = user.first_name ? user.first_name.charAt(0).toUpperCase() : '';
    const lastNameInitial = user.last_name ? user.last_name.charAt(0).toUpperCase() : '';
    return firstNameInitial + lastNameInitial;
  }

}

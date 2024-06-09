import { GetTask, Task } from './../../../interface/task';
import { Component, OnDestroy, OnInit } from '@angular/core';
import { CdkDragDrop, DragDropModule, moveItemInArray, transferArrayItem } from '@angular/cdk/drag-drop';
import { CommonModule, getLocaleFirstDayOfWeek } from '@angular/common';
import { TaskCardComponent } from './task-card/task-card.component';
import { TaskService } from '../../../services/task.service';
import { Subscription, map, take } from 'rxjs';
import { NotificationService } from '../../../services/notification.service';



@Component({
  selector: 'app-board',
  standalone: true,
  imports: [DragDropModule, CommonModule, TaskCardComponent],
  templateUrl: './board.component.html',
  styleUrl: './board.component.scss'
})
export class BoardComponent implements OnInit, OnDestroy {
  private getTaskSubscription!: Subscription;
  tasks: GetTask[] = [];
  toDo: GetTask[] = [];
  inProgress: GetTask[] = [];
  awaitFeedback: GetTask[] = [];
  done: GetTask[] = [];
  loadingTaskIds: number[] = []; // Liste der IDs der Tasks, die gerade geladen werden

  constructor(private taskService: TaskService, private notificationService: NotificationService) {

  }

  ngOnInit(): void {
    this.getTaskSubscription = this.subGetTasks();
  }

  ngOnDestroy(): void {
    if (this.getTaskSubscription) {
      this.getTaskSubscription.unsubscribe();
    }
  }

  subGetTasks() {
    return this.taskService.getTaskWithCategoryAndUsers().pipe(map((tasks: GetTask[]) => {
      this.tasks = tasks;
      console.log(tasks);

      this.toDo = tasks.filter((task: GetTask) => task.status === 'todo');
      this.inProgress = tasks.filter((task: GetTask) => task.status === 'inprogress');
      this.awaitFeedback = tasks.filter((task: GetTask) => task.status === 'awaitfeedback');
      this.done = tasks.filter((task: GetTask) => task.status === 'done');
    })).subscribe(() => {
      console.log(this.toDo);
      console.log(this.inProgress);
      console.log(this.awaitFeedback);
      console.log(this.done);

    });
  }

  drop(event: CdkDragDrop<GetTask[]>) {
    if (event.previousContainer === event.container) {
      moveItemInArray(event.container.data, event.previousIndex, event.currentIndex);
    } else {
      const previousIndex = event.previousIndex;
      const currentIndex = event.currentIndex;
      const previousContainer = event.previousContainer;
      const container = event.container;
      const updatedTask = previousContainer.data[previousIndex];
      const newStatus = this.getStatusFromContainerId(container.id);
      transferArrayItem(previousContainer.data, container.data, previousIndex, currentIndex);
      this.markTaskAsLoading(updatedTask.id); // mark the task - is loading
      this.updateStatusBackend(updatedTask.id, newStatus, previousContainer, container.data, previousIndex, currentIndex, updatedTask);
    }
  }

  updateStatusBackend(taskId: number, newStatus: string, previousContainer: any, containerData: any, previousIndex: any, currentIndex: any, updatedTask: any) {
    this.taskService.updateTaskStatus(taskId, newStatus).pipe(
      take(1)
    ).subscribe({
      next: response => {
        updatedTask.status = newStatus;
      },
      error: err => {
        transferArrayItem(containerData, previousContainer.data, currentIndex, previousIndex);
        console.error('Error updating task status:', err);
        this.notificationService.showMessage('Something went wrong!', true);
        this.unmarkTaskAsLoading(updatedTask.id);  //remark the task into - isn't loading
      },
      complete: () => {
        this.unmarkTaskAsLoading(updatedTask.id);  //remark the task into - isn't loading
      }
    });
  }

  getStatusFromContainerId(containerId: string): string {
    switch (containerId) {
      case 'toDoList':
        return 'todo';
      case 'inProgressList':
        return 'inprogress';
      case 'awaitFeedbackList':
        return 'awaitfeedback';
      case 'doneList':
        return 'done';
      default:
        return '';
    }
  }

  isTaskLoading(taskId: number): boolean {
    return this.loadingTaskIds.includes(taskId);
  }

  private markTaskAsLoading(taskId: number): void {
    if (!this.loadingTaskIds.includes(taskId)) {
      this.loadingTaskIds.push(taskId);
    }
  }

  private unmarkTaskAsLoading(taskId: number): void {
    this.loadingTaskIds = this.loadingTaskIds.filter(id => id !== taskId);
  }

}

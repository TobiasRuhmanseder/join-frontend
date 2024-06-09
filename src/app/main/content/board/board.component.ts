import { GetTask } from './../../../interface/task';
import { Component, OnDestroy, OnInit } from '@angular/core';
import { CdkDragDrop, DragDropModule, moveItemInArray, transferArrayItem } from '@angular/cdk/drag-drop';
import { CommonModule } from '@angular/common';
import { TaskCardComponent } from './task-card/task-card.component';
import { TaskService } from '../../../services/task.service';
import { Observable, Subscription, debounceTime, distinctUntilChanged, map, of, startWith, switchMap, take } from 'rxjs';
import { NotificationService } from '../../../services/notification.service';
import { FormControl, ReactiveFormsModule } from '@angular/forms';



@Component({
  selector: 'app-board',
  standalone: true,
  imports: [DragDropModule, CommonModule, TaskCardComponent, ReactiveFormsModule],
  templateUrl: './board.component.html',
  styleUrl: './board.component.scss'
})
export class BoardComponent implements OnInit, OnDestroy {
  private getTaskSubscription!: Subscription;
  private searchingSubscription!: Subscription;
  tasks: GetTask[] = [];
  filteredTasks: GetTask[] = [];
  toDo: GetTask[] = [];
  inProgress: GetTask[] = [];
  awaitFeedback: GetTask[] = [];
  done: GetTask[] = [];
  loadingTaskIds: number[] = []; // Liste der IDs der Tasks, die gerade geladen werden
  searchControl = new FormControl('');


  constructor(private taskService: TaskService, private notificationService: NotificationService) {

  }

  ngOnInit(): void {
    this.getTaskSubscription = this.subGetTasks();
    this.searchingSubscription = this.subSearching();
  }

  ngOnDestroy(): void {
    if (this.getTaskSubscription) {
      this.getTaskSubscription.unsubscribe();
    }
    if (this.searchingSubscription) {
      this.searchingSubscription.unsubscribe();
    }
  }

  subSearching(): Subscription {
    return this.searchControl.valueChanges.pipe(
      startWith(''),
      debounceTime(300),
      distinctUntilChanged(),
      map(value => value?.trim() ?? ''),
      switchMap(searchTerm => this.filterTasks(searchTerm))
    ).subscribe(filtered => this.updateFilteredTasks(filtered));
  }

  filterTasks(searchTerm: string): Observable<GetTask[]> {
    if (searchTerm.length < 2) {
      return of(this.tasks);
    }
    const filtered = this.tasks.filter(task =>
      task.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      task.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
      task.category.category.toString().toLowerCase().includes(searchTerm.toLowerCase())
    );
    return of(filtered);
  }

  subGetTasks(): Subscription {
    return this.taskService.getTaskWithCategoryAndUsers().pipe(map((tasks: GetTask[]) => {
      this.tasks = tasks;
      this.filteredTasks = tasks;
      this.updateTaskLists();
    })).subscribe(() => { });
  }

  updateTaskLists(): void {
    this.toDo = this.filteredTasks.filter(task => task.status === 'todo');
    this.inProgress = this.filteredTasks.filter(task => task.status === 'inprogress');
    this.awaitFeedback = this.filteredTasks.filter(task => task.status === 'awaitfeedback');
    this.done = this.filteredTasks.filter(task => task.status === 'done');
  }

  updateFilteredTasks(filtered: GetTask[]): void {
    this.filteredTasks = filtered;
    this.updateTaskLists();
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

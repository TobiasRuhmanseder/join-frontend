import { Subtask, Task } from '../../../interface/task';
import { User } from '../../../interface/user';
import { CommonModule } from '@angular/common';
import { Component, HostListener, OnDestroy, OnInit } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { Subscription, take, timer } from 'rxjs';
import { UserService } from '../../../services/user.service';
import { TaskService } from '../../../services/task.service';
import { Category } from '../../../interface/category';
import { NotificationService } from '../../../services/notification.service';
import { ActivatedRoute, Router } from '@angular/router';

@Component({
  selector: 'app-edit-task',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './edit-task.component.html',
  styleUrl: './edit-task.component.scss'
})
export class EditTaskComponent implements OnInit, OnDestroy {
  title: string = '';
  description: string = '';
  dueDate: string = '';
  priority: string = '';
  selectedCategory!: number;
  newSubtaskTitle: string = '';
  newSubtask: string = '';
  assignedTo: number[] = [];
  minDate!: string;
  newCategoryName: string = '';
  showNewCategoryForm: boolean = false;
  showDropdown: boolean = false;
  status: string = 'todo';

  subtasks: Subtask[] = [];
  categories: Category[] = [];
  allUsers: User[] = [];
  taskId!: number;

  private userSubscription!: Subscription;
  private categorySubscription!: Subscription;
  private addCategorySubscription!: Subscription;
  private createTaskSubscription!: Subscription;

  touchedTitle = false;
  touchedDescription = false;
  touchedDueDate = false;
  touchedPriority = false;
  touchedCategory = false;
  touchedAssignedTo = false;

  constructor(
    private router: Router,
    private route: ActivatedRoute,
    private userService: UserService,
    private taskService: TaskService,
    private notificationService: NotificationService
  ) { }

  ngOnInit(): void {
    this.minDate = this.getDateToday();
    this.taskId = +this.route.snapshot.paramMap.get('id')!;
    this.loadTask();
    this.userSubscription = this.subAllUsers();
    this.categorySubscription = this.subAllCategories();
  }

  ngOnDestroy(): void {
    if (this.userSubscription) {
      this.userSubscription.unsubscribe();
    }
    if (this.categorySubscription) {
      this.categorySubscription.unsubscribe();
    }
    if (this.addCategorySubscription) {
      this.addCategorySubscription.unsubscribe();
    }
    if (this.createTaskSubscription) {
      this.createTaskSubscription.unsubscribe();
    }
  }

  loadTask() {
    this.taskService.getOneTask(this.taskId).pipe(take(1)).subscribe({
      next: task => {
        this.title = task.title;
        this.description = task.description;
        this.dueDate = task.due_date;
        this.priority = task.priority;
        this.selectedCategory = task.category
        this.subtasks = task.subtasks;
        this.assignedTo = task.users;
        this.status = task.status;
        this.updateUserSelection();
      },
      error: error => this.somethingWentWrongError(error)
    });
  }

  subAllUsers(): Subscription {
    return this.userService.getAllUsers().subscribe({
      next: response => {
        this.allUsers = response;
        this.updateUserSelection();
      },
      error: error => this.somethingWentWrongError(error)
    });
  }

  subAllCategories(): Subscription {
    return this.taskService.getAllCategories().subscribe({
      next: response => {
        this.categories = response;
      },
      error: error => this.somethingWentWrongError(error)
    });
  }

  subAddCategories(newCategory: Category): Subscription {
    return this.taskService.createNewCategory(newCategory).subscribe({
      next: response => {
        this.categories.push(response);
        this.newCategoryName = '';
        this.showNewCategoryForm = false;
        this.selectedCategory = response.id;
      },
      error: error => this.somethingWentWrongError(error)
    });
  }

  subUpdateTask(updatedTask: Task) {
    return this.taskService.updateTask(updatedTask).subscribe({
      next: response => {
        this.notificationService.showMessage('Task was updated successfully!');
        timer(1000).subscribe(() =>
          this.router.navigateByUrl('/main/board')
        )
      },
      error: error => this.somethingWentWrongError(error)
    });
  }

  getDateToday() {
    const today = new Date();
    return today.toISOString().split('T')[0];
  }

  onInputChange(field: string) {
    this.setTouched(field, true);
  }

  onBlur(field: string) {
    this.setTouched(field, true);
  }

  setPriority(prio: string) {
    this.priority = prio;
    this.setTouched('priority', true);
  }

  onCategoryChange(event: Event) {
    const target = event.target as HTMLSelectElement;
    if (target.value === 'add-new') {
      this.showNewCategoryForm = true;
      this.selectedCategory = 0;
    } else {
      this.showNewCategoryForm = false;
      this.selectedCategory = Number(target.value);
    }
    this.touchedCategory = true;
  }

  addNewCategory() {
    if (this.newCategoryName.trim() !== '') {
      const newCategory: Category = {
        id: 0, // Temporäre ID, wird durch Backend ersetzt
        category: this.newCategoryName.trim(),
        color: this.generateRandomColor()
      };
      this.addCategorySubscription = this.subAddCategories(newCategory);
    }
  }

  generateRandomColor(): string {
    const letters = '0123456789ABCDEF';
    let color = '#';
    for (let i = 0; i < 6; i++) {
      color += letters[Math.floor(Math.random() * 16)];
    }
    return color;
  }

  saveCategories() {
    const categoriesJson = JSON.stringify(this.categories);
    localStorage.setItem('categories', categoriesJson);
  }

  isFieldValid(field: string): boolean {
    switch (field) {
      case 'title':
      case 'dueDate':
      case 'priority':
        return (this[field] as string).trim() !== '';
      case 'selectedCategory':
        return this.selectedCategory !== undefined && this.selectedCategory > 0;
      case 'assignedTo':
        return this.assignedTo.length > 0;
      default:
        return true;
    }
  }

  isFormValid(): boolean {
    return this.isFieldValid('title') &&
      this.isFieldValid('dueDate') &&
      this.isFieldValid('priority') &&
      this.isFieldValid('selectedCategory') &&
      this.isFieldValid('assignedTo');
  }

  updateTask() {
    if (this.isFormValid()) {
      const updatedTask: Task = {
        id: this.taskId,
        title: this.title,
        description: this.description,
        users: this.assignedTo,
        due_date: this.dueDate,
        priority: this.priority,
        category: this.selectedCategory,
        board: 1,
        subtasks: this.subtasks,
        status: this.status
      };
      this.updateUserSelection();
      this.createTaskSubscription = this.subUpdateTask(updatedTask);
    }
  }

  onUserChange(event: Event, userId: number) {
    const target = event.target as HTMLInputElement;
    if (target.checked) {
      this.assignedTo.push(userId);
    } else {
      this.assignedTo = this.assignedTo.filter(id => id !== userId);
    }
    this.setTouched('assignedTo', true);
  }

  addSubtask() {
    if (this.newSubtaskTitle.trim() !== '') {
      const newSubtask: Subtask = {
        id: this.subtasks.length + 1, // Temporäre ID, wird durch Backend ersetzt
        title: this.newSubtaskTitle,
        completed: false
      };
      this.subtasks.push(newSubtask);
      this.newSubtaskTitle = '';
    }
  }

  removeSubtask(subtask: Subtask) {
    this.subtasks = this.subtasks.filter(s => s.id !== subtask.id);
  }

  clearForm() {
    this.resetForm();
  }

  resetForm() {
    this.title = '';
    this.description = '';
    this.dueDate = '';
    this.priority = '';
    this.selectedCategory = 0;
    this.newSubtask = '';
    this.assignedTo = [];
    this.subtasks = [];

    this.touchedTitle = false;
    this.touchedDescription = false;
    this.touchedDueDate = false;
    this.touchedPriority = false;
    this.touchedCategory = false;
    this.touchedAssignedTo = false;
  }

  toggleDropdown(event: Event) {
    this.showDropdown = !this.showDropdown;
    event.stopPropagation();
  }

  getSelectedUsers() {
    return this.allUsers
      .filter(user => this.assignedTo.includes(user.id))
      .map(user => `${user.first_name} ${user.last_name}`)
      .join(', ');
  }

  updateUserSelection(): void {
    this.allUsers.forEach(user => {
      user.selected = this.assignedTo.includes(user.id);
    });
  }

  @HostListener('document:click', ['$event'])
  onDocumentClick(event: MouseEvent) {
    const target = event.target as HTMLElement;
    if (!target.closest('.input-container')) {
      this.showDropdown = false;
    }
  }

  private setTouched(field: string, value: boolean) {
    switch (field) {
      case 'title':
        this.touchedTitle = value;
        break;
      case 'description':
        this.touchedDescription = value;
        break;
      case 'dueDate':
        this.touchedDueDate = value;
        break;
      case 'priority':
        this.touchedPriority = value;
        break;
      case 'selectedCategory':
        this.touchedCategory = value;
        break;
      case 'assignedTo':
        this.touchedAssignedTo = value;
        break;
      default:
        break;
    }
  }

  somethingWentWrongError(error: any) {
    this.notificationService.showMessage('Something went wrong!');
    this.router.navigateByUrl('main/board/')
  }
}


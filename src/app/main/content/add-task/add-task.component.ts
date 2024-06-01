import { User } from './../../../interface/user';
import { CommonModule } from '@angular/common';
import { Component, HostListener, OnDestroy, OnInit } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { Subscription } from 'rxjs';
import { UserService } from '../../../services/user.service';


@Component({
  selector: 'app-add-task',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './add-task.component.html',
  styleUrl: './add-task.component.scss'
})
export class AddTaskComponent implements OnInit, OnDestroy {
  title: string = '';
  description: string = '';
  dueDate: string = '';
  priority: string = '';
  selectedCategory: string = '';
  newSubtask: string = '';
  assignedTo: number[] = [];
  minDate!: string;
  newCategoryName: string = '';
  showNewCategoryForm: boolean = false;
  showDropdown: boolean = false;

  subtasks: string[] = [];
  categories: { category: string, color: string }[] = [
    { category: 'Work', color: '#FF5733' },
    { category: 'Personal', color: '#33FF57' },
  ];

  allUsers: User[] = [];

  private userSubscription!: Subscription;

  touchedTitle = false;
  touchedDescription = false;
  touchedDueDate = false;
  touchedPriority = false;
  touchedCategory = false;
  touchedAssignedTo = false;

  constructor(private userService: UserService) {

  }

  ngOnInit(): void {
    this.minDate = this.getDateToday();
    this.userSubscription = this.subAllUsers();
  }

  subAllUsers(): Subscription {
    return this.userService.getAllUsers().subscribe({
      next: response => {
        console.log(response);

        this.allUsers = response;
        console.log(this.allUsers);

      }
      ,
      error: error => console.log(error)
    })
  }

  ngOnDestroy(): void {
    if (this.userSubscription) {
      this.userSubscription.unsubscribe();
    }
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
      this.selectedCategory = '';
    } else {
      this.showNewCategoryForm = false;
    }
    this.touchedCategory = true;
  }

  addNewCategory() {
    if (this.newCategoryName.trim() !== '') {
      const newCategory = {
        category: this.newCategoryName.trim(),
        color: this.generateRandomColor()
      };
      this.categories.push(newCategory);
      this.saveCategories();
      this.newCategoryName = '';
      this.showNewCategoryForm = false;
      this.selectedCategory = newCategory.category;
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
    console.log('Kategorien gespeichert:', categoriesJson);
    localStorage.setItem('categories', categoriesJson);
  }

  isFieldValid(field: string): boolean {
    switch (field) {
      case 'title':
      case 'dueDate':
      case 'priority':
      case 'selectedCategory':
        return this[field].trim() !== '';
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

  addTask() {
    if (this.isFormValid()) {
      console.log('Task added:', {
        title: this.title,
        description: this.description,
        dueDate: this.dueDate,
        priority: this.priority,
        category: this.selectedCategory,
        subtasks: this.subtasks,
        assignedTo: this.assignedTo
      });
      this.resetForm();
    }
  }

  onUserChange(event: Event) {
    const target = event.target as HTMLInputElement;
    const userId = parseInt(target.value, 10);
    if (target.checked) {
      this.assignedTo.push(userId);
    } else {
      this.assignedTo = this.assignedTo.filter(id => id !== userId);
    }
    this.setTouched('assignedTo', true);
  }

  addSubtask() {
    if (this.newSubtask.trim() !== '') {
      this.subtasks.push(this.newSubtask);
      this.newSubtask = '';
    }
  }

  removeSubtask(subtask: string) {
    this.subtasks = this.subtasks.filter(s => s !== subtask);
  }

  clearForm() {
    this.resetForm();
  }

  resetForm() {
    this.title = '';
    this.description = '';
    this.dueDate = '';
    this.priority = '';
    this.selectedCategory = '';
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
}


import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { UserService } from '../../../services/user.service';
import { TaskService } from '../../../services/task.service';
import { CurrentUserService } from '../../../services/current-user.service';
import { take } from 'rxjs';
import { User } from '../../../interface/user';
import { GetTask } from '../../../interface/task';
import { formatDate } from '@angular/common';

@Component({
  selector: 'app-summary',
  standalone: true,
  imports: [],
  templateUrl: './summary.component.html',
  styleUrl: './summary.component.scss'
})
export class SummaryComponent implements OnInit {
  currentUser: User | null = null;
  toDoCount: number = 0;
  inProgressCount: number = 0;
  awaitFeedbackCount: number = 0;
  doneCount: number = 0;
  urgentCount: number = 0;
  tasksCount: number = 0;
  nextUrgentTaskDueDate: string = '';
  greeting: string = '';
  constructor(private router: Router, private currentUserService: CurrentUserService, private taskService: TaskService) { }


  ngOnInit(): void {
    this.subCurrentUser();
    this.subTasks();
    this.greeting = this.getRightGreeting();
  }

  getRightGreeting() {
    const now = new Date();
    const hour = now.getHours();

    if (hour < 12) {
      return "Good morning";
    } else if (hour < 18) {
      return "Good afternoon";
    } else if (hour < 22) {
      return "Good evening";
    } else {
      return "Hello";
    }
  }

  subCurrentUser() {
    this.currentUserService.currentUser$.pipe(take(1)).subscribe(currentUser => {
      this.currentUser = currentUser;
    }
    )
  }

  subTasks() {
    this.taskService.getTaskWithCategoryAndUsers().pipe(take(1)).subscribe(tasks => {
      this.toDoCount = tasks.filter(task => task.status === 'todo').length;
      this.inProgressCount = tasks.filter(task => task.status === 'inprogress').length;
      this.awaitFeedbackCount = tasks.filter(task => task.status === 'awaitfeedback').length;
      this.doneCount = tasks.filter(task => task.status === 'done').length;
      this.urgentCount = tasks.filter(task => task.priority === 'urgent').length;
      this.tasksCount = tasks.length;
      this.nextUrgentTaskDueDate = this.getNextUrgentTaskDueDate(tasks);
    }
    )
  }

  getNextUrgentTaskDueDate(tasks: GetTask[]): string {
    const urgentTasks = tasks
      .filter(task => task.priority === 'urgent' && new Date(task.due_date) > new Date())
      .sort((a, b) => new Date(a.due_date).getTime() - new Date(b.due_date).getTime());

    if (urgentTasks.length > 0) {
      return this.formatDate(urgentTasks[0].due_date);
    } else {
      return '';
    }
  }

  formatDate(dateString: string): string {
    const date = new Date(dateString);
    return formatDate(date, 'MMMM dd, yyyy', 'en-US');
  }

  navigateToBoard() {
    this.router.navigateByUrl('main/board');
  }
}

import { Category } from './../interface/category';
import { Injectable } from '@angular/core';
import { environment } from '../../environments/environment.development';
import { HttpClient } from '@angular/common/http';
import { Observable, forkJoin, map } from 'rxjs';
import { GetTask, Subtask, Task } from '../interface/task';
import { User } from '../interface/user';

@Injectable({
  providedIn: 'root'
})
export class TaskService {

  constructor(private http: HttpClient) { }


  getAllCategories(): Observable<Category[]> {
    const url = environment.baseUrl + "/api/task_category/";
    return this.http.get<Category[]>(url)
  }

  createNewCategory(categoryData: Category): Observable<Category> {
    const url = environment.baseUrl + "/api/task_category/";
    return this.http.post<Category>(url, categoryData)
  }

  createTask(taskData: Task): Observable<Task> {
    const url = environment.baseUrl + "/api/tasks/";
    return this.http.post<Task>(url, taskData);
  }

  getOneTask(taskId: number): Observable<Task> {
    const url = environment.baseUrl + `/api/tasks/${taskId}/`;
    return this.http.get<Task>(url)
  }

  deleteTask(taskId: number): Observable<Task> {
    const url = environment.baseUrl + `/api/tasks/${taskId}/`;
    return this.http.delete<Task>(url)
  }

  updateTask(updatedTask: Task): Observable<Task> {
    const url = environment.baseUrl + `/api/tasks/${updatedTask.id}/`;
    return this.http.put<Task>(url, updatedTask)
  }

  getTaskWithCategoryAndUsers(): Observable<GetTask[]> {
    const urlTask = environment.baseUrl + "/api/tasks/";
    const urlCategory = environment.baseUrl + "/api/task_category/";
    const urlUsers = environment.baseUrl + "/api/users/";
    return forkJoin([
      this.http.get<Task[]>(urlTask),
      this.http.get<Category[]>(urlCategory),
      this.http.get<User[]>(urlUsers)
    ]).pipe(
      map(([tasks, categories, users]: [Task[], Category[], User[]]) => {
        return tasks.map(task => ({
          ...task,
          category: categories.find(category => category.id === task.category) as Category,
          users: task.users.map(userId => users.find(user => user.id === userId) as User)
        }) as GetTask);
      })
    )
  }

  updateTaskStatus(taskId: number, status: string): Observable<GetTask> {
    const url = environment.baseUrl + `/api/tasks/${taskId}/`;
    return this.http.patch<GetTask>(url, { "status": status })
  }

  updateSubtasks(taskId: number, subtasks: Subtask[]): Observable<GetTask> {
    const url = environment.baseUrl + `/api/tasks/${taskId}/`;
    return this.http.patch<GetTask>(url, { "subtasks": subtasks });
  }
}



import { Category } from "./category";
import { User } from "./user";

export interface Subtask {
  id: number;
  title: string;
  completed: boolean;
}

export interface Task {
  id: number;
  title: string;
  description: string;
  users: number[];
  due_date: string;
  priority: string;
  category: number;
  board: number;
  subtasks: Subtask[];
  status: string;
}

export interface GetTask {
  id: number;
  title: string;
  description: string;
  users: User[];
  due_date: string;
  priority: string;
  category: Category;
  board: number;
  subtasks: Subtask[];
  status: string;
}
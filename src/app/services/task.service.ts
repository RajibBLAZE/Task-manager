import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';
import { Task } from './model/task';
import { FormGroup } from '@angular/forms';
import { map } from 'rxjs/operators';
@Injectable({
  providedIn: 'root'
})
export class TaskService {
  private tasks: Task[] = [];
  private taskSubject = new BehaviorSubject<Task[]>([]);  // BehaviorSubject emits latest state
  private formSubject = new BehaviorSubject<FormGroup | null>(null);
  constructor() {}

  setForm(form: FormGroup): void {
    this.formSubject.next(form);
  }
  getForm(): FormGroup | null {
    return this.formSubject.value;
  }
  getTasks() {
    return this.taskSubject.asObservable();
  }

  addTask(newTask: Task): void {
    newTask.id = this.tasks.length + 1;
    this.tasks.push(newTask);
    console.log('Task added:', newTask);
    
    this.taskSubject.next([...this.tasks]);
  }


  updateTask(updatedTask: Task): void {
    const index = this.tasks.findIndex(t => t.id === updatedTask.id);
    if (index !== -1) {
      this.tasks[index] = { ...updatedTask };
      this.taskSubject.next([...this.tasks]);
    }
  }
  deleteTask(id: number): void {
    this.tasks = this.tasks.filter(task => task.id !== id);
    this.taskSubject.next([...this.tasks]); // Emit updated task list
    console.log(`Task with ID ${id} has been deleted.`);
  }
  deleteTaskByTask(task: Task): void {
    this.tasks = this.tasks.filter(t => t.id !== task.id); // Remove by task ID
    this.taskSubject.next([...this.tasks]); // Update the observable
    console.log(`Task "${task.title}" with ID ${task.id} has been deleted.`);
  }


  newStatusTask(): Observable<Task[]> {
    return this.taskSubject.asObservable().pipe(
      map((tasks: Task[]) => tasks.filter((task: Task) => task.status === 'New'))
    );
  }

  // ✅ Get tasks with "Completed" status
  completedStatusTask(): Observable<Task[]> {
    return this.taskSubject.asObservable().pipe(
      map((tasks: Task[]) => tasks.filter((task: Task) => task.status === 'Completed'))
    );
  }

  // ✅ Get tasks with "On-going" status
  onGoingStatusTask(): Observable<Task[]> {
    return this.taskSubject.asObservable().pipe(
      map((tasks: Task[]) => tasks.filter((task: Task) => task.status === 'On-going'))
    );
  }
  
  
}

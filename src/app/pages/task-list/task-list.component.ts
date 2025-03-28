import { Component, OnInit, ViewChild } from '@angular/core';
import { Task } from 'src/app/services/model/task';
import { TaskService } from 'src/app/services/task.service';
import { ActivatedRoute, Router } from '@angular/router';
import { FormGroup } from '@angular/forms';
@Component({
  selector: 'app-task-list',
  templateUrl: './task-list.component.html',
  styleUrls: ['./task-list.component.css']
})
export class TaskListComponent implements OnInit {
  
  tasks: Task[] = [];
  selectedTask: Task | null = null;
  tForm!: FormGroup;
  filteredTasks: any[] = [];
  constructor(private taskService: TaskService,private route: ActivatedRoute,private router: Router) { }

  ngOnInit(): void {
    this.taskService.getTasks().subscribe((data) => {
      this.tasks = data;
      console.log('Tasks:', this.tasks);
    });
    const form = this.taskService.getForm();
    if (form) {
      this.tForm = form;
    }
    this.route.queryParams.subscribe(params => {
      const statusFilter = params['status'];
      if (statusFilter) {
        this.filteredTasks = this.tasks.filter(task => task.status === statusFilter);
      } else {
        this.filteredTasks = [...this.tasks];
      }
    });
  }
  edit(task: Task): void {
    console.log('Editing Task:', task);
    if (this.tForm) {
      this.tForm.patchValue({
        id: task.id,
        title: task.title,
        assignedTo: task.assignedTo,
        startTime: task.startTime,
        endTime: task.endTime,
        status: task.status,
      });

      // Emit the updated form state to the service
      this.taskService.setForm(this.tForm);

      //Store the selected task for reference during the update
      this.selectedTask = task;
      this.taskService.deleteTaskByTask(this.selectedTask);
      this.router.navigate(['/task/add']); 
      
    }
  }
  update(): void {
    if (this.selectedTask) {
      if (this.tForm.valid && this.selectedTask) {
        const updatedTask: Task = {
          ...this.selectedTask,
          ...this.tForm.value
        };
  
        console.log('Saving Updated Task:', updatedTask);
  
        this.taskService.updateTask(updatedTask);
        this.selectedTask = null;
        this.tForm.reset();
      }
    }
  }
  delete(id: number): void {
    if (confirm('Are you sure you want to delete this task?')) {
      this.taskService.deleteTask(id);
    }
  }
  getProgress(status: string): number {
    if (status === 'New') {
        return 0;
    } else if (status === 'On-going') {
        return Math.floor(Math.random() * (75 - 35 + 1)) + 35; // Random between 35-75%
    } else if (status === 'Completed') {
        return 100;
    }
    return 0;
}

getProgressColor(status: string): string {
    if (status === 'New') {
        return 'warn';  // Red
    } else if (status === 'On-going') {
        return 'accent';  // Yellow
    } else if (status === 'Completed') {
        return 'primary';  // Green
    }
    return 'warn';
}

}

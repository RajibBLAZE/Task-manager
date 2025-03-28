import { Component, OnInit } from '@angular/core';
import { TaskService } from 'src/app/services/task.service';
import { Task } from 'src/app/services/model/task';
import { AuthService } from 'src/app/services/auth/auth.service';
@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.css']
})
export class DashboardComponent implements OnInit {
  
  newTasks = 0;
  inProgressTasks = 0;
  completedTasks = 0;
  allTasks = 0;

  constructor(private taskService: TaskService,public authService: AuthService) {}

  ngOnInit(): void {
    this.loadTaskCounts();
  }

  loadTaskCounts() {
    this.taskService.getTasks().subscribe(tasks => {
      this.allTasks = tasks.length;
      this.newTasks = tasks.filter(task => task.status === 'New').length;
      this.inProgressTasks = tasks.filter(task => task.status === 'On-going').length;
      this.completedTasks = tasks.filter(task => task.status === 'Completed').length;
    });
  }
  
}


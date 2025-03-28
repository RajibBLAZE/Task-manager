import { Component, OnInit } from '@angular/core';
import { FormArray, FormControl, FormGroup, Validators } from '@angular/forms';
import { Status } from 'src/app/services/model/status';
import { TaskService } from 'src/app/services/task.service'; 
import { Task } from 'src/app/services/model/task';
import { Router } from '@angular/router';
@Component({
  selector: 'app-task-detail',
  templateUrl: './task-detail.component.html',
  styleUrls: ['./task-detail.component.css']
})
export class TaskDetailComponent implements OnInit {
  taskstatus = Status;
  tForm!: FormGroup;
  isEditMode = false;  
  selectedTask: Task | null = null;
  constructor(private taskService: TaskService,private router: Router) { }

  ngOnInit(): void {
    this.tForm = new FormGroup({
      id: new FormControl(''),
      title: new FormControl('', Validators.required),
      assignedTo: new FormControl('', Validators.required),
      startTime: new FormControl('', Validators.required),
      endTime: new FormControl('', Validators.required),
      status: new FormControl('Pending', Validators.required)

    });
    const form = this.taskService.getForm();
    if (form) {
      this.tForm = form;
    }

    // ✅ Emit the form to the service
    this.taskService.setForm(this.tForm);

  }
  onClickSubmit(): void {
    console.log("form Submitted:", this.tForm.value);
    if (this.tForm.valid) {
      
      const formData: Task = this.tForm.value;
      this.taskService.addTask(formData);
      this.tForm.reset();
      this.router.navigate(['/tasks']); 
    }
  }
        
}

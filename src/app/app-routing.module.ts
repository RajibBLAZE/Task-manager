import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { TaskListComponent } from './pages/task-list/task-list.component';
import { DashboardComponent } from './pages/dashboard/dashboard.component';
import { TaskDetailComponent } from './pages/task-detail/task-detail.component';
import { AddTaskComponent } from './pages/add-task/add-task.component';
import { AuthComponent } from './auth/auth.component';
import { AuthGuard } from './services/auth/auth.guard';

const routes: Routes = [
  { path: '', redirectTo: 'auth', pathMatch: 'full' },


  { path: 'auth', component: AuthComponent },

  // Protected routes
  { path: 'dashboard', component: DashboardComponent, canActivate: [AuthGuard] },
  { path: 'tasks', component: TaskListComponent, canActivate: [AuthGuard] },
  { path: 'task/add', component: AddTaskComponent, canActivate: [AuthGuard] },  // ✅ Use AddTaskComponent here
  { path: 'tasks/:id', component: TaskDetailComponent, canActivate: [AuthGuard] },

  { path: 'logout', redirectTo: 'auth' },
  { path: '**', redirectTo: 'auth' }
];

@NgModule({
  imports: [
    RouterModule.forRoot(routes, { 
      useHash: false, 
      scrollPositionRestoration: 'enabled' 
    })
  ],
  exports: [RouterModule]
})
export class AppRoutingModule { }

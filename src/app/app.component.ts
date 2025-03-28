import { Component } from '@angular/core';
import { Router } from '@angular/router';  // ✅ Import Router
import { AuthService } from './services/auth/auth.service';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent {
  title = 'Task-management';

  constructor(public authService: AuthService, private router: Router) {}  // ✅ Inject Router

  onLogout() {
    this.authService.logout();

    
    this.router.navigate(['/login']).then(() => {
      window.location.reload();
    });
  }
}

import { Injectable } from '@angular/core';
import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { BehaviorSubject, catchError, tap, throwError } from 'rxjs';
import { Router } from '@angular/router';
import { environment } from 'src/environments/environment';
export interface AuthResponseData {
  idToken: string;
  email: string;
  refreshToken: string;
  expiresIn: string;
  localId: string;
  registered?: boolean;
}

@Injectable({ providedIn: 'root' })
export class AuthService {
  private user = new BehaviorSubject<AuthResponseData | null>(null);
  user$ = this.user.asObservable(); // Expose as Observable
  private tokenExpirationTimer: any;

  constructor(private http: HttpClient, private router: Router) {}

  //Signup with Firebase API
  signUp(email: string, password: string) {
    return this.http
      .post<AuthResponseData>(
        `https://identitytoolkit.googleapis.com/v1/accounts:signUp?key=${environment.apiKey}
`,
        { email, password, returnSecureToken: true }
      )
      .pipe(
        catchError(this.handleError),
        tap((res) => this.handleAuthentication(res))
      );
  }

   // Login with Firebase API 
  login(email: string, password: string) {
    return this.http
      .post<AuthResponseData>(
        `https://identitytoolkit.googleapis.com/v1/accounts:signUp?key=${environment.apiKey}
`,
        { email, password, returnSecureToken: true }
      )
      .pipe(
        catchError(this.handleError),
        tap((res) => this.handleAuthentication(res))
      );
  }


  autoLogin() {
    const userData: AuthResponseData = JSON.parse(
      localStorage.getItem('userData') || '{}'
    );

    if (!userData.idToken) return;

    this.user.next(userData);
    const expirationDuration =
      new Date(userData.expiresIn).getTime() - new Date().getTime();
    this.autoLogout(expirationDuration);
  }


  logout() {
    this.user.next(null);
    localStorage.removeItem('userData');


    if (this.tokenExpirationTimer) {
      clearTimeout(this.tokenExpirationTimer);
      this.tokenExpirationTimer = null;
    }
    this.router.navigate(['/login']);
  }


  autoLogout(expirationDuration: number) {
    this.tokenExpirationTimer = setTimeout(() => this.logout(), expirationDuration);
  }

  
  private handleAuthentication(response: AuthResponseData) {
    const expireDate = new Date(new Date().getTime() + +response.expiresIn * 1000);
    const userData = { ...response, expiresIn: expireDate.toISOString() };
    
    this.user.next(userData);
    localStorage.setItem('userData', JSON.stringify(userData));
    this.autoLogout(+response.expiresIn * 1000);
  }

  
  private handleError(errorRes: HttpErrorResponse) {
    let errorMessage = 'An error occurred!';
    if (!errorRes.error || !errorRes.error.error) return throwError(errorMessage);

    switch (errorRes.error.error.message) {
      case 'EMAIL_EXISTS':
        errorMessage = 'Email already exists!';
        break;
      case 'EMAIL_NOT_FOUND':
        errorMessage = 'Email not found!';
        break;
      case 'INVALID_PASSWORD':
        errorMessage = 'Invalid password!';
        break;
    }
    return throwError(() => new Error(errorMessage));
  }
}

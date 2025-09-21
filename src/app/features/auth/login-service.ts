import { inject, Injectable } from '@angular/core';
import { API_BASE_URL } from '../../core/config/constants';
import { HttpClient } from '@angular/common/http';
import { IUserLogin } from './models/Ilogin';
import { Observable, tap } from 'rxjs';
import { ILoginResponse } from './models/ILoginResponse';
import { Router } from '@angular/router';

@Injectable({
  providedIn: 'root',
})
export class LoginService {
  private http = inject(HttpClient);
  private router = inject(Router);

  // User login
  login(credentials: IUserLogin): Observable<ILoginResponse> {
    const params = {
      email: credentials.email,
      password: credentials.password,
    };
    return this.http.post<ILoginResponse>(`${API_BASE_URL}/auth/login`, null, { params }).pipe(
      tap((response: ILoginResponse) => {
        localStorage.setItem('userId', response.userId);
        localStorage.setItem('role', response.role);
      })
    );
  }

  // User Logout
  logout(): void {
    localStorage.removeItem('userId');
    localStorage.removeItem('role');
    this.router.navigate(['/']);
  }
}

import { Injectable, inject, signal, PLATFORM_ID } from '@angular/core';
import { isPlatformBrowser } from '@angular/common';
import { HttpClient } from '@angular/common/http';
import { Router } from '@angular/router';
import { Observable, tap } from 'rxjs';
import { environment } from '../../../environments/environment';
import { LoginRequest, RegisterRequest, AuthResponse } from '../../models/auth.model';
import { User } from '../../models/user.model';

@Injectable({ providedIn: 'root' })
export class AuthService {
  private http = inject(HttpClient);
  private router = inject(Router);
  private platformId = inject(PLATFORM_ID);
  private isBrowser = isPlatformBrowser(this.platformId);

  isAuthenticated = signal(false);
  currentUser = signal<User | null>(null);

  constructor() {
    if (this.isBrowser) {
      const token = this.getToken();
      const userString = localStorage.getItem('user');
      if (token && userString) {
        try {
          const user = JSON.parse(userString);
          this.isAuthenticated.set(true);
          this.currentUser.set(user);
        } catch (e) {
          // Clear invalid data
          localStorage.removeItem('token');
          localStorage.removeItem('user');
        }
      }
    }
  }

  register(data: RegisterRequest): Observable<AuthResponse> {
    return this.http.post<AuthResponse>(`${environment.apiUrl}/auth/register`, data)
      .pipe(tap(res => this.handleAuth(res)));
  }

  login(data: LoginRequest): Observable<AuthResponse> {
    return this.http.post<AuthResponse>(`${environment.apiUrl}/auth/login`, data)
      .pipe(tap(res => this.handleAuth(res)));
  }

  logout(): void {
    if (this.isBrowser) {
      localStorage.removeItem('token');
      localStorage.removeItem('user');
    }
    this.isAuthenticated.set(false);
    this.currentUser.set(null);
    this.router.navigate(['/login']);
  }

  getToken(): string | null {
    if (this.isBrowser) {
      return localStorage.getItem('token');
    }
    return null;
  }

  isAdmin(): boolean {
    const user = this.currentUser();
    return user?.role === 'ADMIN';
  }

  private handleAuth(response: AuthResponse): void {
    if (this.isBrowser) {
      localStorage.setItem('token', response.token);
      this.isAuthenticated.set(true);

      // Create user object with proper ID from backend response
      const user: User = {
        id: response.userId,  // Use the actual userId from backend
        email: response.email,
        role: response.role,
        gender: undefined,  // Will be loaded from profile API when needed
        isActivated: false,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString()
      };

      localStorage.setItem('user', JSON.stringify(user));
      this.currentUser.set(user);
    }
  }
}

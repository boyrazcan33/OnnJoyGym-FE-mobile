import { Injectable, inject, signal, computed, PLATFORM_ID } from '@angular/core';
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
  isAdmin = computed(() => this.currentUser()?.role === 'ADMIN');

  constructor() {
    if (this.isBrowser) {
      const token = this.getToken();
      const userString = localStorage.getItem('user');
      if (token && userString) {
        if (this.isTokenExpired(token)) {
          localStorage.removeItem('token');
          localStorage.removeItem('user');
        } else {
          try {
            const user = JSON.parse(userString);
            this.isAuthenticated.set(true);
            this.currentUser.set(user);
          } catch {
            localStorage.removeItem('token');
            localStorage.removeItem('user');
          }
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

  updateUser(user: User): void {
    if (this.isBrowser) {
      localStorage.setItem('user', JSON.stringify(user));
    }
    this.currentUser.set(user);
  }

  private isTokenExpired(token: string): boolean {
    try {
      const payload = JSON.parse(atob(token.split('.')[1]));
      return payload.exp * 1000 < Date.now();
    } catch {
      return true;
    }
  }

  private handleAuth(response: AuthResponse): void {
    if (this.isBrowser) {
      localStorage.setItem('token', response.token);
      this.isAuthenticated.set(true);

      const user: User = {
        id: response.userId,
        email: response.email,
        username: response.username,
        role: response.role,
        gender: undefined,
        isActivated: response.isActivated ?? false,
        emailVerified: response.emailVerified ?? false,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString()
      };

      localStorage.setItem('user', JSON.stringify(user));
      this.currentUser.set(user);
    }
  }
}

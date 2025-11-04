import { Injectable, inject, signal, PLATFORM_ID } from '@angular/core'; // PLATFORM_ID eklendi
import { isPlatformBrowser } from '@angular/common'; // isPlatformBrowser eklendi
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
  private platformId = inject(PLATFORM_ID); // Platform ID enjekte edildi
  private isBrowser = isPlatformBrowser(this.platformId); // Tarayıcı olup olmadığı kontrol edildi

  isAuthenticated = signal(false);
  currentUser = signal<User | null>(null);

  constructor() {
    if (this.isBrowser) { // Yalnızca tarayıcı ortamında çalıştır
      const token = this.getToken();
      if (token) {
        this.isAuthenticated.set(true);
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
    if (this.isBrowser) { // Yalnızca tarayıcı ortamında localStorage'a eriş
      localStorage.removeItem('token');
      localStorage.removeItem('user');
    }
    this.isAuthenticated.set(false);
    this.currentUser.set(null);
    this.router.navigate(['/login']);
  }

  getToken(): string | null {
    if (this.isBrowser) { // Yalnızca tarayıcı ortamında localStorage'a eriş
      // Not: Bu logic, önceki hatalı club.service.ts dosyasından alınan platform kontrolü ile birleştirilmiştir.
      return localStorage.getItem('token');
    }
    return null;
  }

  isAdmin(): boolean {
    const user = this.currentUser();
    return user?.role === 'ADMIN';
  }

  private handleAuth(response: AuthResponse): void {
    if (this.isBrowser) { // Yalnızca tarayıcı ortamında localStorage'a eriş
      localStorage.setItem('token', response.token);
      this.isAuthenticated.set(true);

      const user: User = {
        id: 0,
        email: response.email,
        role: response.role,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString()
      };

      localStorage.setItem('user', JSON.stringify(user));
      this.currentUser.set(user);
    }
  }
}

import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink, RouterLinkActive, Router } from '@angular/router';
import { MatToolbarModule } from '@angular/material/toolbar';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatMenuModule } from '@angular/material/menu';
import { MatDividerModule } from '@angular/material/divider';
import { AuthService } from '../../../core/services/auth.service';

@Component({
  selector: 'app-navbar',
  standalone: true,
  imports: [
    CommonModule,
    RouterLink,
    RouterLinkActive,
    MatToolbarModule,
    MatButtonModule,
    MatIconModule,
    MatMenuModule,
    MatDividerModule
  ],
  template: `
    <mat-toolbar class="navbar">
      <div class="container navbar-content">
        <a routerLink="/" class="logo">
          <span class="logo-text">💪 OnnJoyGym</span>
        </a>

        <nav class="nav-links desktop-only">
          <a routerLink="/gyms" routerLinkActive="active">Gyms</a>
          <a routerLink="/leaderboard" routerLinkActive="active">Leaderboard</a>
          @if (authService.isAuthenticated()) {
            <a routerLink="/dashboard" routerLinkActive="active">Dashboard</a>
            <a routerLink="/buddies" routerLinkActive="active">Buddies</a>
            <a routerLink="/clubs" routerLinkActive="active">Clubs</a>
          }
        </nav>

        <div class="nav-actions">
          @if (!authService.isAuthenticated()) {
            <button mat-button routerLink="/login">Login</button>
            <button mat-raised-button color="primary" routerLink="/register">Sign Up</button>
          } @else {
            <button mat-icon-button [matMenuTriggerFor]="menu">
              <div class="avatar">{{ getInitials() }}</div>
            </button>
            <mat-menu #menu="matMenu">
              <button mat-menu-item routerLink="/profile">
                <mat-icon>person</mat-icon>
                <span>Profile</span>
              </button>
              <button mat-menu-item routerLink="/videos/upload">
                <mat-icon>videocam</mat-icon>
                <span>Upload Video</span>
              </button>
              @if (authService.isAdmin()) {
                <button mat-menu-item routerLink="/admin/videos">
                  <mat-icon>admin_panel_settings</mat-icon>
                  <span>Admin Panel</span>
                </button>
              }
              <mat-divider></mat-divider>
              <button mat-menu-item (click)="logout()">
                <mat-icon>logout</mat-icon>
                <span>Logout</span>
              </button>
            </mat-menu>
          }
        </div>
      </div>
    </mat-toolbar>
  `,
  styles: [`
    .navbar {
      background: var(--secondary);
      color: white;
      position: sticky;
      top: 0;
      z-index: 100;
      box-shadow: 0 2px 8px rgba(0,0,0,0.1);
    }

    .navbar-content {
      display: flex;
      justify-content: space-between;
      align-items: center;
      width: 100%;
    }

    .logo {
      text-decoration: none;
      color: white;
    }

    .logo-text {
      font-size: 1.5rem;
      font-weight: bold;
      background: linear-gradient(135deg, var(--primary) 0%, var(--accent) 100%);
      -webkit-background-clip: text;
      -webkit-text-fill-color: transparent;
      background-clip: text;
    }

    .nav-links {
      display: flex;
      gap: 1.5rem;

      a {
        color: rgba(255,255,255,0.8);
        text-decoration: none;
        font-weight: 500;
        transition: color 0.2s;

        &:hover, &.active {
          color: var(--primary);
        }
      }
    }

    .nav-actions {
      display: flex;
      gap: 0.5rem;
      align-items: center;
    }

    .avatar {
      width: 32px;
      height: 32px;
      border-radius: 50%;
      background: var(--primary);
      display: flex;
      align-items: center;
      justify-content: center;
      font-weight: bold;
      font-size: 0.875rem;
    }

    @media (max-width: 768px) {
      .desktop-only {
        display: none;
      }

      .logo-text {
        font-size: 1.2rem;
      }
    }
  `]
})
export class NavbarComponent {
  authService = inject(AuthService);
  private router = inject(Router);

  getInitials(): string {
    const user = this.authService.currentUser();
    if (!user?.email) return 'U';
    return user.email.substring(0, 2).toUpperCase();
  }

  logout(): void {
    this.authService.logout();
  }
}

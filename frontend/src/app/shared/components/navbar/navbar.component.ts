import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink, RouterLinkActive } from '@angular/router';
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
    <div class="navbar-wrapper">
      <mat-toolbar class="navbar">
        <div class="container navbar-content">
          <a routerLink="/" class="logo">
            <img class="logo-img" src="/assets/newLogo.png" alt="OnnJoyGym">
            <span class="logo-text">OnnJoyGym</span>
          </a>

          @if (authService.isAuthenticated()) {
            <nav class="nav-links desktop-only">
              <a routerLink="/gyms" routerLinkActive="active">Gyms</a>
              <a routerLink="/leaderboard" routerLinkActive="active">Leaderboard</a>
              <a routerLink="/dashboard" routerLinkActive="active">Dashboard</a>
              <a routerLink="/buddies" routerLinkActive="active">Buddies</a>
              <a routerLink="/clubs" routerLinkActive="active">Clubs</a>
            </nav>

            <div class="nav-actions">
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

              <button mat-icon-button class="hamburger" (click)="toggleMobileMenu()" aria-label="Toggle menu">
                <mat-icon>{{ mobileMenuOpen ? 'close' : 'menu' }}</mat-icon>
              </button>
            </div>
          }
        </div>
      </mat-toolbar>

      @if (mobileMenuOpen && authService.isAuthenticated()) {
        <nav class="mobile-nav">
          <a routerLink="/gyms" routerLinkActive="active" (click)="closeMobileMenu()">
            <mat-icon>fitness_center</mat-icon>
            <span>Gyms</span>
          </a>
          <a routerLink="/leaderboard" routerLinkActive="active" (click)="closeMobileMenu()">
            <mat-icon>emoji_events</mat-icon>
            <span>Leaderboard</span>
          </a>
          <a routerLink="/dashboard" routerLinkActive="active" (click)="closeMobileMenu()">
            <mat-icon>dashboard</mat-icon>
            <span>Dashboard</span>
          </a>
          <a routerLink="/buddies" routerLinkActive="active" (click)="closeMobileMenu()">
            <mat-icon>groups</mat-icon>
            <span>Buddies</span>
          </a>
          <a routerLink="/clubs" routerLinkActive="active" (click)="closeMobileMenu()">
            <mat-icon>assignment</mat-icon>
            <span>Clubs</span>
          </a>
        </nav>
      }
    </div>
  `,
  styles: [`
    .navbar-wrapper {
      position: sticky;
      top: 0;
      z-index: 100;
    }

    .navbar {
      background: var(--secondary);
      color: white;
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
      display: flex;
      align-items: center;
      gap: 0.5rem;
    }

    .logo-img {
      height: 2.25rem;
      width: auto;
      object-fit: contain;
      border-radius: 50%;
    }

    .logo-text {
      font-size: 2.25rem;
      font-weight: bold;
      background: linear-gradient(135deg, #F0EDE8 0%, #C0001A 100%);
      -webkit-background-clip: text;
      -webkit-text-fill-color: transparent;
      background-clip: text;
      line-height: 1.2;
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

    .hamburger {
      display: none;
      color: white;
    }

    .mobile-nav {
      background: var(--secondary);
      border-top: 1px solid rgba(255,255,255,0.1);
      box-shadow: 0 4px 8px rgba(0,0,0,0.15);

      a {
        display: flex;
        align-items: center;
        gap: 1rem;
        padding: 1rem 1.5rem;
        color: rgba(255,255,255,0.8);
        text-decoration: none;
        font-weight: 500;
        transition: color 0.2s, background 0.2s;

        mat-icon {
          font-size: 1.25rem;
          width: 1.25rem;
          height: 1.25rem;
        }

        &:hover, &.active {
          color: var(--primary);
          background: rgba(255,255,255,0.05);
        }
      }
    }

    @media (max-width: 768px) {
      .desktop-only {
        display: none;
      }

      .hamburger {
        display: flex;
      }

      .logo-img {
        height: 1.75rem;
      }

      .logo-text {
        font-size: 1.2rem;
      }
    }
  `]
})
export class NavbarComponent {
  authService = inject(AuthService);
  mobileMenuOpen = false;

  getInitials(): string {
    const user = this.authService.currentUser();
    if (!user) return 'U';
    const name = user.username || user.email;
    return name.substring(0, 2).toUpperCase();
  }

  toggleMobileMenu(): void {
    this.mobileMenuOpen = !this.mobileMenuOpen;
  }

  closeMobileMenu(): void {
    this.mobileMenuOpen = false;
  }

  logout(): void {
    this.authService.logout();
  }
}

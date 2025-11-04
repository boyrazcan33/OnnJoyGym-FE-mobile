import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink, RouterOutlet } from '@angular/router';
import { MatSidenavModule } from '@angular/material/sidenav';
import { MatListModule } from '@angular/material/list';
import { MatIconModule } from '@angular/material/icon';

@Component({
  selector: 'app-admin-layout',
  standalone: true,
  imports: [
    CommonModule,
    RouterLink,
    RouterOutlet,
    MatSidenavModule,
    MatListModule,
    MatIconModule
  ],
  template: `
    <div class="admin-layout">
      <mat-sidenav-container>
        <mat-sidenav mode="side" opened>
          <mat-nav-list>
            <h3 class="sidebar-title">Admin Panel</h3>
            <a mat-list-item routerLink="/admin/videos" routerLinkActive="active">
              <mat-icon>videocam</mat-icon>
              <span>Video Moderation</span>
            </a>
            <a mat-list-item routerLink="/admin/reviews" routerLinkActive="active">
              <mat-icon>rate_review</mat-icon>
              <span>Review Management</span>
            </a>
            <a mat-list-item routerLink="/dashboard">
              <mat-icon>arrow_back</mat-icon>
              <span>Back to Dashboard</span>
            </a>
          </mat-nav-list>
        </mat-sidenav>

        <mat-sidenav-content>
          <router-outlet />
        </mat-sidenav-content>
      </mat-sidenav-container>
    </div>
  `,
  styles: [`
    .admin-layout {
      height: calc(100vh - 64px);
    }

    mat-sidenav-container {
      height: 100%;
    }

    mat-sidenav {
      width: 250px;
      background: var(--secondary);
      color: white;
      padding: 1rem 0;
    }

    .sidebar-title {
      padding: 0 1rem;
      margin-bottom: 1rem;
      color: var(--primary);
    }

    mat-nav-list a {
      color: rgba(255, 255, 255, 0.8);

      &:hover {
        background: rgba(255, 255, 255, 0.1);
        color: white;
      }

      &.active {
        background: var(--primary);
        color: white;
      }

      mat-icon {
        margin-right: 1rem;
      }
    }

    mat-sidenav-content {
      background: #f4f4f9;
    }
  `]
})
export class AdminLayoutComponent {}

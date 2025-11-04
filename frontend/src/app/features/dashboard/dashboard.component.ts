import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router';
import { MatCardModule } from '@angular/material/card';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { AuthService } from '../../core/services/auth.service';

@Component({
  selector: 'app-dashboard',
  standalone: true,
  imports: [
    CommonModule,
    RouterLink,
    MatCardModule,
    MatButtonModule,
    MatIconModule
  ],
  template: `
    <div class="dashboard">
      <div class="container">
        <div class="dashboard-header">
          <h1>Welcome, {{ getUserName() }}!</h1>
          <p>Your fitness journey dashboard</p>
        </div>

        <div class="dashboard-grid">
          <mat-card class="dashboard-card" routerLink="/profile">
            <mat-card-header>
              <mat-icon class="card-icon">person</mat-icon>
              <mat-card-title>My Profile</mat-card-title>
            </mat-card-header>
            <mat-card-content>
              <p>Update your fitness goals and preferences</p>
            </mat-card-content>
            <mat-card-actions>
              <button mat-button color="primary">View Profile →</button>
            </mat-card-actions>
          </mat-card>

          <mat-card class="dashboard-card" routerLink="/gyms">
            <mat-card-header>
              <mat-icon class="card-icon">fitness_center</mat-icon>
              <mat-card-title>Find Gyms</mat-card-title>
            </mat-card-header>
            <mat-card-content>
              <p>Explore gyms with expert reviews</p>
            </mat-card-content>
            <mat-card-actions>
              <button mat-button color="primary">Browse Gyms →</button>
            </mat-card-actions>
          </mat-card>

          <mat-card class="dashboard-card" routerLink="/buddies">
            <mat-card-header>
              <mat-icon class="card-icon">groups</mat-icon>
              <mat-card-title>Training Buddies</mat-card-title>
            </mat-card-header>
            <mat-card-content>
              <p>Find partners who share your goals</p>
            </mat-card-content>
            <mat-card-actions>
              <button mat-button color="primary">Find Buddies →</button>
            </mat-card-actions>
          </mat-card>

          <mat-card class="dashboard-card" routerLink="/clubs">
            <mat-card-header>
              <mat-icon class="card-icon">assignment</mat-icon>
              <mat-card-title>Training Clubs</mat-card-title>
            </mat-card-header>
            <mat-card-content>
              <p>Join clubs and get custom programs</p>
            </mat-card-content>
            <mat-card-actions>
              <button mat-button color="primary">View Clubs →</button>
            </mat-card-actions>
          </mat-card>

          <mat-card class="dashboard-card" routerLink="/leaderboard">
            <mat-card-header>
              <mat-icon class="card-icon">emoji_events</mat-icon>
              <mat-card-title>Leaderboard</mat-card-title>
            </mat-card-header>
            <mat-card-content>
              <p>Compete and climb the rankings</p>
            </mat-card-content>
            <mat-card-actions>
              <button mat-button color="primary">View Rankings →</button>
            </mat-card-actions>
          </mat-card>

          <mat-card class="dashboard-card" routerLink="/videos/upload">
            <mat-card-header>
              <mat-icon class="card-icon">videocam</mat-icon>
              <mat-card-title>Upload Lift</mat-card-title>
            </mat-card-header>
            <mat-card-content>
              <p>Share your progress and compete</p>
            </mat-card-content>
            <mat-card-actions>
              <button mat-button color="primary">Upload Video →</button>
            </mat-card-actions>
          </mat-card>
        </div>

        @if (authService.isAdmin()) {
          <mat-card class="admin-section">
            <mat-card-header>
              <mat-icon class="card-icon">admin_panel_settings</mat-icon>
              <mat-card-title>Admin Actions</mat-card-title>
            </mat-card-header>
            <mat-card-content>
              <div class="admin-actions">
                <button mat-raised-button color="primary" routerLink="/admin/videos">
                  <mat-icon>videocam</mat-icon>
                  Moderate Videos
                </button>
                <button mat-raised-button color="primary" routerLink="/admin/reviews">
                  <mat-icon>rate_review</mat-icon>
                  Manage Reviews
                </button>
              </div>
            </mat-card-content>
          </mat-card>
        }
      </div>
    </div>
  `,
  styles: [`
    .dashboard {
      padding: 2rem 0;
      min-height: calc(100vh - 64px);
    }

    .dashboard-header {
      text-align: center;
      margin-bottom: 3rem;

      h1 {
        font-size: 2.5rem;
        color: var(--dark);
        margin-bottom: 0.5rem;
      }

      p {
        font-size: 1.25rem;
        color: #666;
      }
    }

    .dashboard-grid {
      display: grid;
      grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
      gap: 1.5rem;
      margin-bottom: 2rem;
    }

    .dashboard-card {
      cursor: pointer;
      transition: transform 0.3s, box-shadow 0.3s;

      &:hover {
        transform: translateY(-4px);
        box-shadow: 0 8px 24px rgba(0,0,0,0.15);
      }
    }

    mat-card-header {
      margin-bottom: 1rem;
    }

    .card-icon {
      font-size: 3rem;
      width: 3rem;
      height: 3rem;
      color: var(--primary);
      margin-bottom: 1rem;
    }

    mat-card-content p {
      color: #666;
    }

    .admin-section {
      margin-top: 2rem;
      background: linear-gradient(135deg, var(--primary) 0%, var(--accent) 100%);
      color: white;

      .card-icon {
        color: white;
      }

      mat-card-title {
        color: white;
      }
    }

    .admin-actions {
      display: flex;
      gap: 1rem;
      flex-wrap: wrap;

      button {
        flex: 1;
        min-width: 200px;
        background: white;
        color: var(--primary);

        mat-icon {
          margin-right: 0.5rem;
        }
      }
    }

    @media (max-width: 768px) {
      .dashboard-header h1 {
        font-size: 2rem;
      }

      .dashboard-grid {
        grid-template-columns: 1fr;
      }

      .admin-actions {
        flex-direction: column;
      }
    }
  `]
})
export class DashboardComponent {
  authService = inject(AuthService);

  getUserName(): string {
    const user = this.authService.currentUser();
    if (!user?.email) return 'User';
    return user.email.split('@')[0];
  }
}

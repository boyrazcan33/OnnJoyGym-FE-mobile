import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MAT_DIALOG_DATA, MatDialogModule } from '@angular/material/dialog';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatChipsModule } from '@angular/material/chips';
import { User } from '../../../models/user.model';

interface BuddyData {
  user: User;
  gymName: string | null;
}

@Component({
  selector: 'app-buddy-profile-modal',
  standalone: true,
  imports: [
    CommonModule,
    MatDialogModule,
    MatButtonModule,
    MatIconModule,
    MatChipsModule
  ],
  template: `
    <div class="profile-modal">
      <div class="profile-header">
        <div class="avatar-large">{{ getInitials() }}</div>
        <h2>{{ getUserName() }}</h2>
      </div>

      <mat-dialog-content>
        @if (data.user.bio) {
          <div class="section">
            <h3>About</h3>
            <p>{{ data.user.bio }}</p>
          </div>
        }

        <div class="section">
          <h3>Stats</h3>
          <div class="stat-grid">
            @if (data.gymName) {
              <div class="stat">
                <mat-icon>fitness_center</mat-icon>
                <div>
                  <span class="label">Gym</span>
                  <span class="value">{{ data.gymName }}</span>
                </div>
              </div>
            }

            @if (data.user.goals) {
              <div class="stat">
                <mat-icon>flag</mat-icon>
                <div>
                  <span class="label">Goals</span>
                  <div class="goal-chips">
                    @for (goal of data.user.goals.split(','); track goal) {
                      <mat-chip>{{ goal }}</mat-chip>
                    }
                  </div>
                </div>
              </div>
            }

            @if (data.user.experience) {
              <div class="stat">
                <mat-icon>bar_chart</mat-icon>
                <div>
                  <span class="label">Experience</span>
                  <span class="value">{{ data.user.experience }}</span>
                </div>
              </div>
            }
          </div>
        </div>

        <div class="section">
          <h3>Contact</h3>
          <p class="contact-info">
            <mat-icon>info</mat-icon>
            Connect via Discord to start training together!
          </p>
          <a href="https://discord.gg/onjoygym" target="_blank" mat-raised-button color="primary">
            <mat-icon>discord</mat-icon>
            Join Our Discord
          </a>
        </div>
      </mat-dialog-content>

      <mat-dialog-actions align="end">
        <button mat-button mat-dialog-close>Close</button>
      </mat-dialog-actions>
    </div>
  `,
  styles: [`
    .profile-modal {
      max-width: 500px;
    }

    .profile-header {
      text-align: center;
      padding: 1rem 0;
      background: linear-gradient(135deg, var(--primary) 0%, var(--accent) 100%);
      color: white;
      margin: -24px -24px 1rem;
      padding: 2rem;
    }

    .avatar-large {
      width: 100px;
      height: 100px;
      border-radius: 50%;
      background: white;
      color: var(--primary);
      display: flex;
      align-items: center;
      justify-content: center;
      font-size: 2.5rem;
      font-weight: bold;
      margin: 0 auto 1rem;
    }

    h2 {
      margin: 0;
    }

    .section {
      margin-bottom: 1.5rem;

      h3 {
        color: var(--dark);
        margin-bottom: 1rem;
      }

      p {
        color: #666;
        line-height: 1.6;
      }
    }

    .stat-grid {
      display: flex;
      flex-direction: column;
      gap: 1rem;
    }

    .stat {
      display: flex;
      align-items: flex-start;
      gap: 1rem;
      padding: 1rem;
      background: var(--light);
      border-radius: 8px;

      mat-icon {
        color: var(--primary);
      }

      .label {
        display: block;
        font-size: 0.875rem;
        color: #666;
        margin-bottom: 0.25rem;
      }

      .value {
        display: block;
        font-weight: 500;
        color: var(--dark);
      }
    }

    .goal-chips {
      display: flex;
      flex-wrap: wrap;
      gap: 0.5rem;
      margin-top: 0.25rem;
    }

    .contact-info {
      display: flex;
      align-items: center;
      gap: 0.5rem;
      padding: 1rem;
      background: var(--light);
      border-radius: 8px;
      margin-bottom: 1rem;

      mat-icon {
        color: var(--primary);
      }
    }

    a[mat-raised-button] {
      width: 100%;
      display: flex;
      align-items: center;
      justify-content: center;
      gap: 0.5rem;
    }
  `]
})
export class BuddyProfileModalComponent {
  data: BuddyData = inject(MAT_DIALOG_DATA);

  getInitials(): string {
    return this.data.user.email.substring(0, 2).toUpperCase();
  }

  getUserName(): string {
    return this.data.user.email.split('@')[0];
  }
}

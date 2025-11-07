import { Component, inject, OnInit, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router';
import { MatCardModule } from '@angular/material/card';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatSelectModule } from '@angular/material/select';
import { MatTableModule } from '@angular/material/table';
import { MatIconModule } from '@angular/material/icon';
import { MatChipsModule } from '@angular/material/chips';
import { MatButtonModule } from '@angular/material/button';
import { LeaderboardService } from '../../core/services/leaderboard.service';
import { GymService } from '../../core/services/gym.service';
import { Leaderboard } from '../../models/leaderboard.model';
import { Gym } from '../../models/gym.model';

@Component({
  selector: 'app-leaderboard',
  standalone: true,
  imports: [
    CommonModule,
    RouterLink,
    MatCardModule,
    MatFormFieldModule,
    MatSelectModule,
    MatTableModule,
    MatIconModule,
    MatChipsModule,
    MatButtonModule
  ],
  template: `
    <div class="leaderboard">
      <div class="container">
        <div class="page-header">
          <h1>🏆 Leaderboard</h1>
          <p>Top performers in each category</p>
        </div>

        <mat-card class="filters-card">
          <div class="filters">
            <mat-form-field appearance="outline">
              <mat-label>Gym</mat-label>
              <mat-select [(value)]="selectedGymId" (selectionChange)="loadLeaderboard()">
                <mat-option [value]="null">All Gyms</mat-option>
                @for (gym of gyms(); track gym.id) {
                  <mat-option [value]="gym.id">{{ gym.name }}</mat-option>
                }
              </mat-select>
            </mat-form-field>

            <mat-form-field appearance="outline">
              <mat-label>Category</mat-label>
              <mat-select [(value)]="selectedCategory" (selectionChange)="loadLeaderboard()">
                <mat-option [value]="null">All Categories</mat-option>
                <mat-option value="BENCH_PRESS">Bench Press</mat-option>
                <mat-option value="SQUAT">Squat</mat-option>
                <mat-option value="DEADLIFT">Deadlift</mat-option>
                <mat-option value="PULL_UP">Pull Up</mat-option>
              </mat-select>
            </mat-form-field>

            <mat-form-field appearance="outline">
              <mat-label>Gender</mat-label>
              <mat-select [(value)]="selectedGender" (selectionChange)="loadLeaderboard()">
                <mat-option [value]="null">All</mat-option>
                <mat-option value="MALE">Male</mat-option>
                <mat-option value="FEMALE">Female</mat-option>
              </mat-select>
            </mat-form-field>
          </div>
        </mat-card>

        @if (loading) {
          <div class="loading">Loading leaderboard...</div>
        } @else {
          @if (leaderboard().length > 0) {
            <mat-card class="leaderboard-card">
              <table mat-table [dataSource]="leaderboard()" class="leaderboard-table">
                <ng-container matColumnDef="rank">
                  <th mat-header-cell *matHeaderCellDef>Rank</th>
                  <td mat-cell *matCellDef="let entry">
                    <div class="rank-badge" [class]="getRankClass(entry.ranking)">
                      {{ entry.ranking }}
                    </div>
                  </td>
                </ng-container>

                <ng-container matColumnDef="user">
                  <th mat-header-cell *matHeaderCellDef>Athlete</th>
                  <td mat-cell *matCellDef="let entry">
                    <div class="user-info">
                      <div class="avatar">{{ getInitials(entry.user.email) }}</div>
                      <span>{{ getUserName(entry.user.email) }}</span>
                      @if (entry.ranking <= 3) {
                        <mat-icon class="crown-icon">emoji_events</mat-icon>
                      }
                    </div>
                  </td>
                </ng-container>

                <ng-container matColumnDef="category">
                  <th mat-header-cell *matHeaderCellDef>Category</th>
                  <td mat-cell *matCellDef="let entry">
                    <mat-chip>{{ formatCategory(entry.category) }}</mat-chip>
                  </td>
                </ng-container>

                <ng-container matColumnDef="weight">
                  <th mat-header-cell *matHeaderCellDef>Weight</th>
                  <td mat-cell *matCellDef="let entry">
                    <strong>{{ entry.weight }} kg</strong>
                  </td>
                </ng-container>

                <ng-container matColumnDef="gym">
                  <th mat-header-cell *matHeaderCellDef>Gym</th>
                  <td mat-cell *matCellDef="let entry">
                    <span class="gym-name">{{ entry.gym.name }}</span>
                  </td>
                </ng-container>

                <ng-container matColumnDef="date">
                  <th mat-header-cell *matHeaderCellDef>Date</th>
                  <td mat-cell *matCellDef="let entry">
                    {{ entry.createdAt | date:'MMM dd, yyyy' }}
                  </td>
                </ng-container>

                <ng-container matColumnDef="actions">
                  <th mat-header-cell *matHeaderCellDef>Video</th>
                  <td mat-cell *matCellDef="let entry">
                    <a [href]="entry.video.s3Url" target="_blank" mat-icon-button color="primary">
                      <mat-icon>play_circle</mat-icon>
                    </a>
                  </td>
                </ng-container>

                <tr mat-header-row *matHeaderRowDef="displayedColumns"></tr>
                <tr mat-row *matRowDef="let row; columns: displayedColumns;"
                    [class.top-three]="row.ranking <= 3"></tr>
              </table>
            </mat-card>
          } @else {
            <div class="empty-state">
              <mat-icon>emoji_events</mat-icon>
              <p>No leaderboard entries yet. Be the first to compete!</p>
              <button mat-raised-button color="primary" routerLink="/videos/upload">
                Upload Your Lift
              </button>
            </div>
          }
        }
      </div>
    </div>
  `,
  styles: [`
    .leaderboard {
      padding: 2rem 0;
      min-height: calc(100vh - 64px);
    }

    .page-header {
      text-align: center;
      margin-bottom: 2rem;

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

    .filters-card {
      margin-bottom: 2rem;
    }

    .filters {
      display: flex;
      gap: 1rem;

      mat-form-field {
        flex: 1;
      }
    }

    .leaderboard-card {
      overflow-x: auto;
    }

    .leaderboard-table {
      width: 100%;

      th {
        font-weight: 600;
        color: var(--dark);
      }

      td {
        padding: 1rem;
      }

      .top-three {
        background: #fff9e6;
      }
    }

    .rank-badge {
      width: 40px;
      height: 40px;
      border-radius: 50%;
      display: flex;
      align-items: center;
      justify-content: center;
      font-weight: bold;
      font-size: 1.125rem;
      background: #e0e0e0;
      color: var(--dark);

      &.rank-1 {
        background: linear-gradient(135deg, #ffd700, #ffed4e);
        color: var(--dark);
        box-shadow: 0 4px 12px rgba(255, 215, 0, 0.4);
      }

      &.rank-2 {
        background: linear-gradient(135deg, #c0c0c0, #e8e8e8);
        color: var(--dark);
        box-shadow: 0 4px 12px rgba(192, 192, 192, 0.4);
      }

      &.rank-3 {
        background: linear-gradient(135deg, #cd7f32, #e6a85c);
        color: white;
        box-shadow: 0 4px 12px rgba(205, 127, 50, 0.4);
      }
    }

    .user-info {
      display: flex;
      align-items: center;
      gap: 0.75rem;

      .avatar {
        width: 36px;
        height: 36px;
        border-radius: 50%;
        background: var(--primary);
        display: flex;
        align-items: center;
        justify-content: center;
        font-weight: bold;
        color: white;
        font-size: 0.875rem;
      }

      .crown-icon {
        color: #ffd700;
        font-size: 1.25rem;
        width: 1.25rem;
        height: 1.25rem;
      }
    }

    .gym-name {
      color: #666;
      font-size: 0.875rem;
    }

    .loading, .empty-state {
      text-align: center;
      padding: 4rem 0;
      color: #666;

      mat-icon {
        font-size: 4rem;
        width: 4rem;
        height: 4rem;
        margin-bottom: 1rem;
      }

      p {
        margin-bottom: 1.5rem;
      }
    }

    @media (max-width: 768px) {
      .page-header h1 {
        font-size: 2rem;
      }

      .filters {
        flex-direction: column;
      }

      .leaderboard-table {
        font-size: 0.875rem;

        td {
          padding: 0.5rem;
        }
      }

      .user-info span {
        display: none;
      }
    }
  `]
})
export class LeaderboardComponent implements OnInit {
  private leaderboardService = inject(LeaderboardService);
  private gymService = inject(GymService);

  gyms = signal<Gym[]>([]);
  leaderboard = signal<Leaderboard[]>([]);
  loading = false;

  selectedGymId: number | null = null;
  selectedCategory: string | null = null;
  selectedGender: string | null = null;

  displayedColumns: string[] = ['rank', 'user', 'category', 'weight', 'gym', 'date', 'actions'];

  ngOnInit(): void {
    this.loadGyms();
    this.loadLeaderboard();
  }

  loadGyms(): void {
    this.gymService.getAll().subscribe(gyms => this.gyms.set(gyms));
  }

  loadLeaderboard(): void {
    this.loading = true;

    if (this.selectedGymId && this.selectedCategory) {
      this.leaderboardService.getByGymAndCategory(this.selectedGymId, this.selectedCategory, this.selectedGender || undefined).subscribe({
        next: (data) => {
          this.leaderboard.set(data);
          this.loading = false;
        },
        error: () => {
          this.loading = false;
        }
      });
    } else if (this.selectedGymId) {
      this.leaderboardService.getByGym(this.selectedGymId, this.selectedGender || undefined).subscribe({
        next: (data) => {
          this.leaderboard.set(data);
          this.loading = false;
        },
        error: () => {
          this.loading = false;
        }
      });
    } else {
      this.leaderboardService.getAll(this.selectedGender || undefined).subscribe({
        next: (data) => {
          this.leaderboard.set(data);
          this.loading = false;
        },
        error: () => {
          this.loading = false;
        }
      });
    }
  }

  getInitials(email: string): string {
    return email.substring(0, 2).toUpperCase();
  }

  getUserName(email: string): string {
    return email.split('@')[0];
  }

  getRankClass(rank: number): string {
    if (rank === 1) return 'rank-1';
    if (rank === 2) return 'rank-2';
    if (rank === 3) return 'rank-3';
    return '';
  }

  formatCategory(category: string): string {
    return category.split('_').map(word =>
      word.charAt(0) + word.slice(1).toLowerCase()
    ).join(' ');
  }
}

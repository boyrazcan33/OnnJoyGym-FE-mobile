import { Component, inject, OnInit, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatCardModule } from '@angular/material/card';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatChipsModule } from '@angular/material/chips';
import { MatDialog, MatDialogModule } from '@angular/material/dialog';
import { MatSnackBar } from '@angular/material/snack-bar';
import { ClubService } from '../../../core/services/club.service';
import { UserService } from '../../../core/services/user.service';
import { ProgramService } from '../../../core/services/program.service';
import { AuthService } from '../../../core/services/auth.service';
import { Club } from '../../../models/club.model';
import { WeeklyProgram } from '../../../models/program.model';
import { ProgramViewModalComponent } from '../program-view-modal/program-view-modal.component';

@Component({
  selector: 'app-club-list',
  standalone: true,
  imports: [
    CommonModule,
    MatCardModule,
    MatButtonModule,
    MatIconModule,
    MatChipsModule,
    MatDialogModule
  ],
  template: `
    <div class="club-list">
      <div class="container">
        <div class="page-header">
          <h1>Training Clubs</h1>
          <p>Join a club and get your personalized workout program</p>
        </div>

        @if (loading) {
          <div class="loading">Loading clubs...</div>
        } @else {
          <div class="club-grid">
            @for (club of clubs(); track club.id) {
              <mat-card class="club-card">
                <mat-card-header>
                  <div class="club-icon">
                    <mat-icon>{{ getClubIcon(club.goal) }}</mat-icon>
                  </div>
                  <mat-card-title>{{ club.name }}</mat-card-title>
                  <mat-card-subtitle>
                    <mat-chip class="level-chip">{{ club.level }}</mat-chip>
                  </mat-card-subtitle>
                </mat-card-header>
                <mat-card-content>
                  <p>{{ club.description }}</p>
                  <div class="club-meta">
                    <span><mat-icon>flag</mat-icon> Goal: {{ club.goal }}</span>
                  </div>
                </mat-card-content>
                <mat-card-actions>
                  <button mat-raised-button color="primary" (click)="joinClub(club)">
                    Join Club
                  </button>
                  @if (hasProgram(club.id)) {
                    <button mat-button (click)="viewProgram(club)">
                      View Program →
                    </button>
                  }
                </mat-card-actions>
              </mat-card>
            }
          </div>
        }
      </div>
    </div>
  `,
  styles: [`
    .club-list {
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

    .club-grid {
      display: grid;
      grid-template-columns: repeat(auto-fill, minmax(320px, 1fr));
      gap: 1.5rem;
    }

    .club-card {
      transition: transform 0.3s, box-shadow 0.3s;

      &:hover {
        transform: translateY(-4px);
        box-shadow: 0 8px 24px rgba(0,0,0,0.15);
      }
    }

    mat-card-header {
      margin-bottom: 1rem;
    }

    .club-icon {
      width: 60px;
      height: 60px;
      border-radius: 50%;
      background: var(--primary);
      display: flex;
      align-items: center;
      justify-content: center;
      margin-bottom: 1rem;

      mat-icon {
        font-size: 2rem;
        width: 2rem;
        height: 2rem;
        color: white;
      }
    }

    .level-chip {
      background: var(--accent);
      color: white;
    }

    .club-meta {
      display: flex;
      align-items: center;
      gap: 0.5rem;
      margin-top: 1rem;
      color: #666;

      span {
        display: flex;
        align-items: center;
        gap: 0.25rem;

        mat-icon {
          font-size: 1rem;
          width: 1rem;
          height: 1rem;
        }
      }
    }

    mat-card-actions {
      display: flex;
      gap: 0.5rem;
    }

    .loading {
      text-align: center;
      padding: 4rem 0;
      color: #666;
    }

    @media (max-width: 768px) {
      .page-header h1 {
        font-size: 2rem;
      }

      .club-grid {
        grid-template-columns: 1fr;
      }

      mat-card-actions {
        flex-direction: column;

        button {
          width: 100%;
        }
      }
    }
  `]
})
export class ClubListComponent implements OnInit {
  private clubService = inject(ClubService);
  private userService = inject(UserService);
  private programService = inject(ProgramService);
  private authService = inject(AuthService);
  private dialog = inject(MatDialog);
  private snackBar = inject(MatSnackBar);

  clubs = signal<Club[]>([]);
  myClubIds = signal<number[]>([]);
  loading = false;

  ngOnInit(): void {
    this.loadClubs();
  }

  loadClubs(): void {
    this.loading = true;
    this.clubService.getAll().subscribe({
      next: (clubs) => {
        this.clubs.set(clubs);
        this.loading = false;
      },
      error: () => {
        this.loading = false;
      }
    });
  }

  getClubIcon(goal: string): string {
    const icons: Record<string, string> = {
      'STRENGTH': 'fitness_center',
      'HYPERTROPHY': 'sports_gymnastics',
      'ENDURANCE': 'directions_run',
      'WEIGHT_LOSS': 'monitor_weight'
    };
    return icons[goal] || 'fitness_center';
  }

  joinClub(club: Club): void {
    const user = this.authService.currentUser();
    if (!user) return;

    this.userService.joinClub(user.id, club.id).subscribe({
      next: () => {
        this.snackBar.open(`Joined ${club.name}!`, 'Close', { duration: 3000 });
        this.myClubIds.set([...this.myClubIds(), club.id]);
        this.viewProgram(club);
      },
      error: () => {
        this.snackBar.open('Failed to join club', 'Close', { duration: 3000 });
      }
    });
  }

  hasProgram(clubId: number): boolean {
    return this.myClubIds().includes(clubId);
  }

  viewProgram(club: Club): void {
    const user = this.authService.currentUser();
    if (!user) return;

    this.programService.getWeekly(user.id, club.id).subscribe({
      next: (program) => {
        this.dialog.open(ProgramViewModalComponent, {
          width: '800px',
          maxWidth: '95vw',
          data: program
        });
      },
      error: () => {
        this.snackBar.open('Failed to load program', 'Close', { duration: 3000 });
      }
    });
  }
}

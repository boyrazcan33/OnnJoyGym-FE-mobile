import { Component, inject, OnInit, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatCardModule } from '@angular/material/card';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatChipsModule } from '@angular/material/chips';
import { MatDialog, MatDialogModule } from '@angular/material/dialog';
import { MatSnackBar } from '@angular/material/snack-bar';
import { ClubService } from '../../../core/services/club.service';
import { ClubProgressService } from '../../../core/services/club-progress.service';
import { ProgramService } from '../../../core/services/program.service';
import { AuthService } from '../../../core/services/auth.service';
import { Club } from '../../../models/club.model';
import { WeeklyProgramDTO } from '../../../models/program.model';
import { ProgramViewModalComponent } from '../program-view-modal/program-view-modal.component';
import { StartingMaxModalComponent } from '../starting-max-modal/starting-max-modal.component';

interface ClubCategory {
  title: string;
  description: string;
  clubs: Club[];
}

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
          @for (category of categories(); track category.title) {
            <div class="club-category">
              <div class="category-header">
                <h2>{{ category.title }}</h2>
                <p>{{ category.description }}</p>
              </div>

              <div class="club-grid">
                @for (club of category.clubs; track club.id) {
                  <mat-card class="club-card">
                    <mat-card-header>
                      <div class="club-icon">
                        <mat-icon>{{ getClubIcon(club.goal) }}</mat-icon>
                      </div>
                      <div class="club-title-section">
                        <mat-card-title>{{ club.name }}</mat-card-title>
                        <mat-card-subtitle>
                          <mat-chip class="level-chip" [class]="getLevelClass(club.level)">
                            {{ club.level }}
                          </mat-chip>
                        </mat-card-subtitle>
                      </div>
                    </mat-card-header>
                    <mat-card-content>
                      <p class="club-description">{{ club.description }}</p>
                      <div class="club-meta">
                        <div class="meta-item">
                          <mat-icon>flag</mat-icon>
                          <span>{{ formatGoal(club.goal) }}</span>
                        </div>
                        <div class="meta-item">
                          <mat-icon>bar_chart</mat-icon>
                          <span>{{ club.level }}</span>
                        </div>
                      </div>
                    </mat-card-content>
                    <mat-card-actions>
                      <button mat-raised-button color="primary" (click)="joinClub(club)">
                        <mat-icon>login</mat-icon>
                        Join Club
                      </button>
                      @if (hasProgram(club.id)) {
                        <button mat-button (click)="viewProgram(club)">
                          <mat-icon>visibility</mat-icon>
                          View Program
                        </button>
                      }
                    </mat-card-actions>
                  </mat-card>
                }
              </div>
            </div>
          }
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

    .club-category {
      margin-bottom: 4rem;
    }

    .category-header {
      margin-bottom: 2rem;
      padding: 1.5rem;
      background: linear-gradient(135deg, var(--primary) 0%, var(--accent) 100%);
      border-radius: 12px;
      color: white;

      h2 {
        font-size: 2rem;
        margin: 0 0 0.5rem 0;
      }

      p {
        margin: 0;
        font-size: 1.125rem;
        opacity: 0.95;
      }
    }

    .club-grid {
      display: grid;
      grid-template-columns: repeat(auto-fill, minmax(350px, 1fr));
      gap: 1.5rem;
    }

    .club-card {
      transition: transform 0.3s, box-shadow 0.3s;
      display: flex;
      flex-direction: column;

      &:hover {
        transform: translateY(-4px);
        box-shadow: 0 8px 24px rgba(0,0,0,0.15);
      }
    }

    mat-card-header {
      display: flex;
      align-items: center;
      gap: 1rem;
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
      flex-shrink: 0;

      mat-icon {
        font-size: 2rem;
        width: 2rem;
        height: 2rem;
        color: white;
      }
    }

    .club-title-section {
      flex: 1;
    }

    .level-chip {
      margin-top: 0.5rem;

      &.beginner {
        background: #4caf50;
        color: white;
      }

      &.intermediate {
        background: #ff9800;
        color: white;
      }

      &.advanced {
        background: #f44336;
        color: white;
      }
    }

    .club-description {
      color: #666;
      line-height: 1.6;
      margin-bottom: 1rem;
      min-height: 60px;
    }

    .club-meta {
      display: flex;
      gap: 1.5rem;
      margin-top: 1rem;
    }

    .meta-item {
      display: flex;
      align-items: center;
      gap: 0.5rem;
      color: #666;

      mat-icon {
        font-size: 1.25rem;
        width: 1.25rem;
        height: 1.25rem;
        color: var(--primary);
      }
    }

    mat-card-actions {
      display: flex;
      gap: 0.5rem;
      padding: 1rem;
      margin-top: auto;

      button {
        flex: 1;
      }
    }

    .loading {
      text-align: center;
      padding: 4rem 0;
      color: #666;
      font-size: 1.25rem;
    }

    @media (max-width: 768px) {
      .page-header h1 {
        font-size: 2rem;
      }

      .club-grid {
        grid-template-columns: 1fr;
      }

      .category-header h2 {
        font-size: 1.5rem;
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
  private clubProgressService = inject(ClubProgressService);
  private programService = inject(ProgramService);
  private authService = inject(AuthService);
  private dialog = inject(MatDialog);
  private snackBar = inject(MatSnackBar);

  clubs = signal<Club[]>([]);
  categories = signal<ClubCategory[]>([]);
  myClubIds = signal<number[]>([]);
  loading = false;

  ngOnInit(): void {
    this.loadClubs();
  }

  loadClubs(): void {
    this.loading = true;
    this.clubService.getAll().subscribe({
      next: (clubs: Club[]) => {
        this.clubs.set(clubs);
        this.categorizeClubs(clubs);
        this.loading = false;
      },
      error: () => {
        this.loading = false;
        this.snackBar.open('Failed to load clubs', 'Close', { duration: 3000 });
      }
    });
  }

  categorizeClubs(clubs: Club[]): void {
    const strengthClubs = clubs.filter(c => c.goal === 'STRENGTH');
    const hypertrophyClubs = clubs.filter(c => c.goal === 'HYPERTROPHY');

    const categories: ClubCategory[] = [];

    if (strengthClubs.length > 0) {
      categories.push({
        title: 'Strength Training Programs',
        description: 'Build raw power and increase your big 3 lifts',
        clubs: strengthClubs.sort((a, b) => this.sortByLevel(a.level, b.level))
      });
    }

    if (hypertrophyClubs.length > 0) {
      categories.push({
        title: 'Muscle Building Programs',
        description: 'Maximize muscle growth with volume-focused training',
        clubs: hypertrophyClubs.sort((a, b) => this.sortByLevel(a.level, b.level))
      });
    }

    this.categories.set(categories);
  }

  sortByLevel(a: string, b: string): number {
    const order: Record<string, number> = {
      'BEGINNER': 1,
      'INTERMEDIATE': 2,
      'ADVANCED': 3
    };
    return order[a] - order[b];
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

  formatGoal(goal: string): string {
    return goal.charAt(0) + goal.slice(1).toLowerCase();
  }

  getLevelClass(level: string): string {
    return level.toLowerCase();
  }

  joinClub(club: Club): void {
    const user = this.authService.currentUser();
    if (!user) return;

    const dialogRef = this.dialog.open(StartingMaxModalComponent, {
      width: '400px',
      data: { clubName: club.name, clubId: club.id } // ✅ clubId eklendi
    });

    dialogRef.afterClosed().subscribe((result) => {
      if (result && result.startingMax) {
        // ✅ Eğer recommendation varsa, önerilen club'a join et
        const targetClubId = result.recommendedClubId || club.id;

        this.clubProgressService.joinClubWithProgress(user.id, targetClubId, result.startingMax).subscribe({
          next: () => {
            const targetClub = this.clubs().find(c => c.id === targetClubId);
            this.snackBar.open(`Joined ${targetClub?.name || club.name}!`, 'Close', { duration: 3000 });
            this.myClubIds.set([...this.myClubIds(), targetClubId]);
            this.viewProgram(targetClub || club);
          },
          error: (err) => {
            this.snackBar.open(err.error?.message || 'Failed to join club', 'Close', { duration: 3000 });
          }
        });
      }
    });
  }

  hasProgram(clubId: number): boolean {
    return this.myClubIds().includes(clubId);
  }

  viewProgram(club: Club): void {
    const user = this.authService.currentUser();
    if (!user) return;

    this.programService.getWeeklyProgram(user.id, club.id).subscribe({
      next: (programList: WeeklyProgramDTO[]) => {
        this.dialog.open(ProgramViewModalComponent, {
          width: '800px',
          maxWidth: '95vw',
          data: { programList, clubName: club.name }
        });
      },
      error: () => {
        this.snackBar.open('Failed to load program', 'Close', { duration: 3000 });
      }
    });
  }
}

import { Component, inject, OnInit, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, ReactiveFormsModule } from '@angular/forms';
import { MatCardModule } from '@angular/material/card';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatSelectModule } from '@angular/material/select';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatChipsModule } from '@angular/material/chips';
import { MatDialog, MatDialogModule } from '@angular/material/dialog';
import { MatSnackBar } from '@angular/material/snack-bar';
import { UserService } from '../../../core/services/user.service';
import { GymService } from '../../../core/services/gym.service';
import { User } from '../../../models/user.model';
import { Gym } from '../../../models/gym.model';
import { BuddyProfileModalComponent } from '../buddy-profile-modal/buddy-profile-modal.component';

@Component({
  selector: 'app-buddy-search',
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule,
    MatCardModule,
    MatFormFieldModule,
    MatSelectModule,
    MatButtonModule,
    MatIconModule,
    MatChipsModule,
    MatDialogModule
  ],
  template: `
    <div class="buddy-search">
      <div class="container">
        <div class="page-header">
          <h1>Find Training Buddies</h1>
          <p>Connect with athletes who share your goals</p>
        </div>

        <div class="search-layout">
          <mat-card class="filters-card">
            <h3>Filters</h3>
            <form [formGroup]="filterForm">
              <mat-form-field appearance="outline">
                <mat-label>Gym</mat-label>
                <mat-select formControlName="gymId">
                  <mat-option [value]="null">All Gyms</mat-option>
                  @for (gym of gyms(); track gym.id) {
                    <mat-option [value]="gym.id">{{ gym.name }}</mat-option>
                  }
                </mat-select>
              </mat-form-field>

              <mat-form-field appearance="outline">
                <mat-label>Goal</mat-label>
                <mat-select formControlName="goal">
                  <mat-option [value]="null">All Goals</mat-option>
                  <mat-option value="STRENGTH">Strength</mat-option>
                  <mat-option value="HYPERTROPHY">Hypertrophy</mat-option>
                  <mat-option value="ENDURANCE">Endurance</mat-option>
                  <mat-option value="WEIGHT_LOSS">Weight Loss</mat-option>
                </mat-select>
              </mat-form-field>

              <mat-form-field appearance="outline">
                <mat-label>Experience</mat-label>
                <mat-select formControlName="experience">
                  <mat-option [value]="null">All Levels</mat-option>
                  <mat-option value="BEGINNER">Beginner</mat-option>
                  <mat-option value="INTERMEDIATE">Intermediate</mat-option>
                  <mat-option value="ADVANCED">Advanced</mat-option>
                </mat-select>
              </mat-form-field>

              <button mat-raised-button color="primary" (click)="search()">
                <mat-icon>search</mat-icon>
                Apply Filters
              </button>
            </form>
          </mat-card>

          <div class="results">
            @if (loading) {
              <div class="loading">Searching...</div>
            } @else {
              <div class="buddy-grid">
                @for (user of users(); track user.id) {
                  <mat-card class="buddy-card">
                    <div class="buddy-avatar">{{ getInitials(user) }}</div>
                    <h3>{{ getUserName(user) }}</h3>

                    @if (user.gymPreference) {
                      <p class="gym-info">
                        <mat-icon>fitness_center</mat-icon>
                        {{ getGymName(user.gymPreference) }}
                      </p>
                    }

                    @if (user.goals) {
                      <div class="goal-chips">
                        @for (goal of user.goals.split(','); track goal) {
                          <mat-chip>{{ goal }}</mat-chip>
                        }
                      </div>
                    }

                    @if (user.experience) {
                      <p class="experience">
                        <mat-icon>bar_chart</mat-icon>
                        {{ user.experience }}
                      </p>
                    }

                    <div class="buddy-actions">
                      <button mat-button color="primary" (click)="viewProfile(user)">
                        View Profile
                      </button>
                      <button mat-icon-button (click)="toggleSave(user)" [class.saved]="isSaved(user.id)">
                        <mat-icon>{{ isSaved(user.id) ? 'star' : 'star_border' }}</mat-icon>
                      </button>
                    </div>
                  </mat-card>
                } @empty {
                  <div class="empty-state">
                    <mat-icon>person_search</mat-icon>
                    <p>No buddies found. Try adjusting your filters.</p>
                  </div>
                }
              </div>
            }
          </div>
        </div>
      </div>
    </div>
  `,
  styles: [`
    .buddy-search {
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

    .search-layout {
      display: grid;
      grid-template-columns: 300px 1fr;
      gap: 2rem;
    }

    .filters-card {
      padding: 1.5rem;
      height: fit-content;
      position: sticky;
      top: 80px;

      h3 {
        margin-bottom: 1rem;
      }

      form {
        display: flex;
        flex-direction: column;
        gap: 1rem;
      }

      mat-form-field {
        width: 100%;
      }

      button {
        width: 100%;
      }
    }

    .buddy-grid {
      display: grid;
      grid-template-columns: repeat(auto-fill, minmax(250px, 1fr));
      gap: 1.5rem;
    }

    .buddy-card {
      padding: 1.5rem;
      text-align: center;
      transition: transform 0.3s, box-shadow 0.3s;

      &:hover {
        transform: translateY(-4px);
        box-shadow: 0 8px 24px rgba(0,0,0,0.15);
      }
    }

    .buddy-avatar {
      width: 80px;
      height: 80px;
      border-radius: 50%;
      background: var(--primary);
      display: flex;
      align-items: center;
      justify-content: center;
      font-size: 2rem;
      font-weight: bold;
      color: white;
      margin: 0 auto 1rem;
    }

    h3 {
      margin-bottom: 0.5rem;
      color: var(--dark);
    }

    .gym-info, .experience {
      display: flex;
      align-items: center;
      justify-content: center;
      gap: 0.25rem;
      color: #666;
      font-size: 0.875rem;
      margin-bottom: 0.5rem;

      mat-icon {
        font-size: 1rem;
        width: 1rem;
        height: 1rem;
      }
    }

    .goal-chips {
      display: flex;
      flex-wrap: wrap;
      gap: 0.5rem;
      justify-content: center;
      margin: 1rem 0;
    }

    .buddy-actions {
      display: flex;
      justify-content: space-between;
      align-items: center;
      margin-top: 1rem;

      .saved mat-icon {
        color: var(--accent);
      }
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
    }

    @media (max-width: 768px) {
      .search-layout {
        grid-template-columns: 1fr;
      }

      .filters-card {
        position: static;
      }

      .buddy-grid {
        grid-template-columns: 1fr;
      }
    }
  `]
})
export class BuddySearchComponent implements OnInit {
  private fb = inject(FormBuilder);
  private userService = inject(UserService);
  private gymService = inject(GymService);
  private dialog = inject(MatDialog);
  private snackBar = inject(MatSnackBar);

  users = signal<User[]>([]);
  gyms = signal<Gym[]>([]);
  savedBuddyIds = signal<number[]>([]);
  loading = false;

  filterForm = this.fb.group({
    gymId: [null as number | null],
    goal: [null as string | null],
    experience: [null as string | null]
  });

  ngOnInit(): void {
    this.loadGyms();
    this.loadSavedBuddies();
    this.search();
  }

  loadGyms(): void {
    this.gymService.getAll().subscribe(gyms => this.gyms.set(gyms));
  }

  loadSavedBuddies(): void {
    const saved = localStorage.getItem('savedBuddies');
    if (saved) {
      this.savedBuddyIds.set(JSON.parse(saved));
    }
  }

  search(): void {
    this.loading = true;
    const filters: any = {};

    if (this.filterForm.value.gymId) {
      filters.gymId = this.filterForm.value.gymId;
    }
    if (this.filterForm.value.goal) {
      filters.goal = this.filterForm.value.goal;
    }
    if (this.filterForm.value.experience) {
      filters.experience = this.filterForm.value.experience;
    }

    this.userService.searchUsers(filters).subscribe({
      next: (users) => {
        this.users.set(users);
        this.loading = false;
      },
      error: () => {
        this.loading = false;
      }
    });
  }

  getInitials(user: User): string {
    return user.email.substring(0, 2).toUpperCase();
  }

  getUserName(user: User): string {
    return user.email.split('@')[0];
  }

  getGymName(gymId: number): string {
    return this.gyms().find(g => g.id === gymId)?.name || 'Unknown';
  }

  viewProfile(user: User): void {
    this.dialog.open(BuddyProfileModalComponent, {
      width: '500px',
      data: { user, gymName: user.gymPreference ? this.getGymName(user.gymPreference) : null }
    });
  }

  isSaved(userId: number): boolean {
    return this.savedBuddyIds().includes(userId);
  }

  toggleSave(user: User): void {
    const saved = this.savedBuddyIds();
    let newSaved: number[];

    if (this.isSaved(user.id)) {
      newSaved = saved.filter(id => id !== user.id);
      this.snackBar.open('Removed from saved buddies', 'Close', { duration: 2000 });
    } else {
      newSaved = [...saved, user.id];
      this.snackBar.open('Added to saved buddies', 'Close', { duration: 2000 });
    }

    this.savedBuddyIds.set(newSaved);
    localStorage.setItem('savedBuddies', JSON.stringify(newSaved));
  }
}

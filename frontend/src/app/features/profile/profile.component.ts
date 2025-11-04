import { Component, inject, OnInit, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { MatCardModule } from '@angular/material/card';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';
import { MatButtonModule } from '@angular/material/button';
import { MatSnackBar, MatSnackBarModule } from '@angular/material/snack-bar';
import { MatIconModule } from '@angular/material/icon';
import { UserService } from '../../core/services/user.service';
import { GymService } from '../../core/services/gym.service';
import { AuthService } from '../../core/services/auth.service';
import { User } from '../../models/user.model';
import { Gym } from '../../models/gym.model';

@Component({
  selector: 'app-profile',
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule,
    MatCardModule,
    MatFormFieldModule,
    MatInputModule,
    MatSelectModule,
    MatButtonModule,
    MatSnackBarModule,
    MatIconModule
  ],
  template: `
    <div class="profile">
      <div class="container">
        <mat-card class="profile-card">
          <mat-card-header>
            <div class="profile-header">
              <div class="avatar-large">{{ getInitials() }}</div>
              <div>
                <mat-card-title>{{ user()?.email }}</mat-card-title>
                <mat-card-subtitle>{{ user()?.role }}</mat-card-subtitle>
              </div>
            </div>
          </mat-card-header>

          <mat-card-content>
            <form [formGroup]="form" (ngSubmit)="onSubmit()">
              <mat-form-field appearance="outline">
                <mat-label>Bio</mat-label>
                <textarea matInput formControlName="bio" rows="3" maxlength="200"></textarea>
                <mat-hint>{{ form.value.bio?.length || 0 }}/200</mat-hint>
              </mat-form-field>

              <mat-form-field appearance="outline">
                <mat-label>Goals</mat-label>
                <mat-select formControlName="goals" multiple>
                  <mat-option value="STRENGTH">Strength</mat-option>
                  <mat-option value="HYPERTROPHY">Hypertrophy</mat-option>
                  <mat-option value="ENDURANCE">Endurance</mat-option>
                  <mat-option value="WEIGHT_LOSS">Weight Loss</mat-option>
                </mat-select>
              </mat-form-field>

              <mat-form-field appearance="outline">
                <mat-label>Experience Level</mat-label>
                <mat-select formControlName="experience">
                  <mat-option value="BEGINNER">Beginner</mat-option>
                  <mat-option value="INTERMEDIATE">Intermediate</mat-option>
                  <mat-option value="ADVANCED">Advanced</mat-option>
                </mat-select>
              </mat-form-field>

              <mat-form-field appearance="outline">
                <mat-label>Preferred Gym</mat-label>
                <mat-select formControlName="gymPreference">
                  @for (gym of gyms(); track gym.id) {
                    <mat-option [value]="gym.id">{{ gym.name }}</mat-option>
                  }
                </mat-select>
              </mat-form-field>

              <div class="form-actions">
                <button mat-raised-button color="primary" type="submit" [disabled]="loading">
                  {{ loading ? 'Saving...' : 'Save Changes' }}
                </button>
              </div>
            </form>
          </mat-card-content>
        </mat-card>
      </div>
    </div>
  `,
  styles: [`
    .profile {
      padding: 2rem 0;
      min-height: calc(100vh - 64px);
    }

    .profile-card {
      max-width: 600px;
      margin: 0 auto;
    }

    .profile-header {
      display: flex;
      align-items: center;
      gap: 1.5rem;
      width: 100%;
    }

    .avatar-large {
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
    }

    form {
      display: flex;
      flex-direction: column;
      gap: 1rem;
      margin-top: 1.5rem;
    }

    mat-form-field {
      width: 100%;
    }

    .form-actions {
      display: flex;
      justify-content: flex-end;
      margin-top: 1rem;
    }

    @media (max-width: 768px) {
      .profile-card {
        margin: 0 1rem;
      }
    }
  `]
})
export class ProfileComponent implements OnInit {
  private fb = inject(FormBuilder);
  private userService = inject(UserService);
  private gymService = inject(GymService);
  authService = inject(AuthService);
  private snackBar = inject(MatSnackBar);

  loading = false;
  user = signal<User | null>(null);
  gyms = signal<Gym[]>([]);

  form = this.fb.group({
    bio: [''],
    goals: [[] as string[]],
    experience: [''],
    gymPreference: [null as number | null]
  });

  ngOnInit(): void {
    this.loadProfile();
    this.loadGyms();
  }

  loadProfile(): void {
    const currentUser = this.authService.currentUser();
    if (!currentUser) return;

    this.userService.getProfile(currentUser.id).subscribe(user => {
      this.user.set(user);
      this.form.patchValue({
        bio: user.bio,
        goals: user.goals?.split(',').filter(g => g) || [],
        experience: user.experience,
        gymPreference: user.gymPreference
      });
    });
  }

  loadGyms(): void {
    this.gymService.getAll().subscribe(gyms => this.gyms.set(gyms));
  }

  getInitials(): string {
    const user = this.user();
    if (!user?.email) return 'U';
    return user.email.substring(0, 2).toUpperCase();
  }

  onSubmit(): void {
    if (this.form.invalid) return;

    const user = this.user();
    if (!user) return;

    this.loading = true;

    const data = {
      ...this.form.value,
      goals: this.form.value.goals?.join(',')
    };

    this.userService.updateProfile(user.id, data).subscribe({
      next: (updatedUser) => {
        this.user.set(updatedUser);
        this.authService.currentUser.set(updatedUser);
        this.loading = false;
        this.snackBar.open('Profile updated successfully!', 'Close', { duration: 3000 });
      },
      error: () => {
        this.loading = false;
        this.snackBar.open('Failed to update profile', 'Close', { duration: 3000 });
      }
    });
  }
}

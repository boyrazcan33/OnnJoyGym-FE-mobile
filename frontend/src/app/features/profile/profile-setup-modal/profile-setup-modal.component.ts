import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { MatDialogModule, MatDialogRef } from '@angular/material/dialog';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';
import { MatButtonModule } from '@angular/material/button';
import { MatChipsModule } from '@angular/material/chips';
import { MatSnackBar } from '@angular/material/snack-bar';
import { UserService } from '../../../core/services/user.service';
import { GymService } from '../../../core/services/gym.service';
import { AuthService } from '../../../core/services/auth.service';
import { Gym } from '../../../models/gym.model';

@Component({
  selector: 'app-profile-setup-modal',
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule,
    MatDialogModule,
    MatFormFieldModule,
    MatInputModule,
    MatSelectModule,
    MatButtonModule,
    MatChipsModule
  ],
  template: `
    <h2 mat-dialog-title>Complete Your Profile</h2>
    <mat-dialog-content>
      <form [formGroup]="form">
        <mat-form-field appearance="outline">
          <mat-label>Bio</mat-label>
          <textarea matInput formControlName="bio" rows="3" maxlength="200"></textarea>
          <mat-hint>Tell us about yourself (max 200 characters)</mat-hint>
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
            @for (gym of gyms; track gym.id) {
              <mat-option [value]="gym.id">{{ gym.name }}</mat-option>
            }
          </mat-select>
        </mat-form-field>
      </form>
    </mat-dialog-content>
    <mat-dialog-actions align="end">
      <button mat-button (click)="skip()">Skip for now</button>
      <button mat-raised-button color="primary" (click)="save()" [disabled]="loading">
        {{ loading ? 'Saving...' : 'Save & Continue' }}
      </button>
    </mat-dialog-actions>
  `,
  styles: [`
    mat-dialog-content {
      padding: 1.5rem 0;
    }

    form {
      display: flex;
      flex-direction: column;
      gap: 1rem;
      min-width: 400px;
    }

    mat-form-field {
      width: 100%;
    }
  `]
})
export class ProfileSetupModalComponent {
  private fb = inject(FormBuilder);
  private dialogRef = inject(MatDialogRef<ProfileSetupModalComponent>);
  private userService = inject(UserService);
  private gymService = inject(GymService);
  private authService = inject(AuthService);
  private snackBar = inject(MatSnackBar);

  loading = false;
  gyms: Gym[] = [];

  form = this.fb.group({
    bio: ['', [Validators.maxLength(200)]],
    goals: [[] as string[], [Validators.required]],
    experience: ['', [Validators.required]],
    gymPreference: [null as number | null]
  });

  constructor() {
    this.loadGyms();
  }

  loadGyms(): void {
    this.gymService.getAll().subscribe(gyms => this.gyms = gyms);
  }

  save(): void {
    if (this.form.invalid) {
      this.form.markAllAsTouched();
      return;
    }

    this.loading = true;
    const user = this.authService.currentUser();

    if (!user) return;

    const data = {
      ...this.form.value,
      goals: this.form.value.goals?.join(',')
    };

    this.userService.updateProfile(user.id, data).subscribe({
      next: (updatedUser) => {
        this.authService.currentUser.set(updatedUser);
        this.snackBar.open('Profile updated!', 'Close', { duration: 3000 });
        this.dialogRef.close();
      },
      error: () => {
        this.loading = false;
        this.snackBar.open('Failed to update profile', 'Close', { duration: 3000 });
      }
    });
  }

  skip(): void {
    this.dialogRef.close();
  }
}

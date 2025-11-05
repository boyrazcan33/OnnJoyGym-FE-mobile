import { Component, inject, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { MatCardModule } from '@angular/material/card';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';
import { MatButtonModule } from '@angular/material/button';
import { MatSnackBar } from '@angular/material/snack-bar';
import { BuddyMatchingService } from '../../../core/services/buddy-matching.service';
import { GymService } from '../../../core/services/gym.service';
import { AuthService } from '../../../core/services/auth.service';
import { Gym } from '../../../models/gym.model';

@Component({
  selector: 'app-buddy-preferences',
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule,
    MatCardModule,
    MatFormFieldModule,
    MatInputModule,
    MatSelectModule,
    MatButtonModule
  ],
  template: `
    <div class="buddy-preferences">
      <div class="container">
        <mat-card>
          <mat-card-header>
            <mat-card-title>Set Your Buddy Preferences</mat-card-title>
            <mat-card-subtitle>Help us find the perfect training partner</mat-card-subtitle>
          </mat-card-header>

          <mat-card-content>
            <form [formGroup]="form" (ngSubmit)="onSubmit()">
              <mat-form-field appearance="outline">
                <mat-label>Training Goal</mat-label>
                <mat-select formControlName="trainingGoal" required>
                  <mat-option value="HYPERTROPHY">Hypertrophy</mat-option>
                  <mat-option value="FAT_LOSS">Fat Loss</mat-option>
                  <mat-option value="ENDURANCE">Endurance</mat-option>
                  <mat-option value="MOBILITY">Mobility</mat-option>
                </mat-select>
              </mat-form-field>

              <mat-form-field appearance="outline">
                <mat-label>Gender</mat-label>
                <mat-select formControlName="gender" required>
                  <mat-option value="MALE">Male</mat-option>
                  <mat-option value="FEMALE">Female</mat-option>
                  <mat-option value="NON_BINARY">Non-Binary</mat-option>
                </mat-select>
              </mat-form-field>

              <mat-form-field appearance="outline">
                <mat-label>Preferred Gyms (1-5)</mat-label>
                <mat-select formControlName="preferredLocations" multiple required>
                  @for (gym of gyms; track gym.id) {
                    <mat-option [value]="gym.id">{{ gym.name }}</mat-option>
                  }
                </mat-select>
                <mat-hint>Select 1-5 gym locations</mat-hint>
              </mat-form-field>

              <mat-form-field appearance="outline">
                <mat-label>Training Schedule (1-2 slots)</mat-label>
                <mat-select formControlName="dailySchedule" multiple required>
                  <mat-option value="EARLY_MORNING">Early Morning (5-8 AM)</mat-option>
                  <mat-option value="MORNING">Morning (8-12 PM)</mat-option>
                  <mat-option value="AFTERNOON">Afternoon (12-5 PM)</mat-option>
                  <mat-option value="EVENING">Evening (5-9 PM)</mat-option>
                  <mat-option value="NIGHT">Night (9 PM-12 AM)</mat-option>
                </mat-select>
                <mat-hint>Select 1-2 time slots</mat-hint>
              </mat-form-field>

              <mat-form-field appearance="outline">
                <mat-label>Social Behavior</mat-label>
                <mat-select formControlName="socialBehavior" required>
                  <mat-option value="FOCUSED">Focused (minimal talking)</mat-option>
                  <mat-option value="CHATTY">Chatty (social)</mat-option>
                  <mat-option value="COMPETITIVE">Competitive</mat-option>
                  <mat-option value="SUPPORTIVE">Supportive</mat-option>
                  <mat-option value="NEUTRAL">Neutral</mat-option>
                  <mat-option value="COACH_STYLE">Coach Style</mat-option>
                  <mat-option value="SPOTTER_ONLY">Spotter Only</mat-option>
                </mat-select>
              </mat-form-field>

              <mat-form-field appearance="outline">
                <mat-label>Age Range</mat-label>
                <mat-select formControlName="ageRange" required>
                  <mat-option value="16-30">16-30</mat-option>
                  <mat-option value="31-45">31-45</mat-option>
                  <mat-option value="45+">45+</mat-option>
                </mat-select>
              </mat-form-field>

              <mat-form-field appearance="outline">
                <mat-label>Telegram Username</mat-label>
                <input matInput formControlName="telegramUsername" [placeholder]="getPlaceholderText()" required>
                <mat-hint>{{ getHintText() }}</mat-hint>
                @if (telegramControl.hasError('required') && telegramControl.touched) {
                  <mat-error>Telegram username is required</mat-error>
                }
                @if (telegramControl.hasError('pattern') && !telegramControl.hasError('required')) {
                  <mat-error>Invalid format. Must start with {{ getAtSymbol() }} and be 5-32 characters</mat-error>
                }
              </mat-form-field>

              <button mat-raised-button color="primary" type="submit" [disabled]="loading || form.invalid">
                {{ loading ? 'Saving...' : 'Find Matches' }}
              </button>
            </form>
          </mat-card-content>
        </mat-card>
      </div>
    </div>
  `,
  styles: [`
    .buddy-preferences {
      padding: 2rem 0;
      min-height: calc(100vh - 64px);
    }

    mat-card {
      max-width: 600px;
      margin: 0 auto;
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

    button[type="submit"] {
      width: 100%;
      padding: 0.75rem;
      font-size: 1rem;
    }

    @media (max-width: 768px) {
      mat-card {
        margin: 0 1rem;
      }
    }
  `]
})
export class BuddyPreferencesComponent implements OnInit {
  private fb = inject(FormBuilder);
  private buddyService = inject(BuddyMatchingService);
  private gymService = inject(GymService);
  private authService = inject(AuthService);
  private router = inject(Router);
  private snackBar = inject(MatSnackBar);

  loading = false;
  gyms: Gym[] = [];

  form = this.fb.group({
    trainingGoal: ['', Validators.required],
    gender: ['', Validators.required],
    preferredLocations: [[] as number[], [Validators.required, Validators.minLength(1), Validators.maxLength(5)]],
    dailySchedule: [[] as string[], [Validators.required, Validators.minLength(1), Validators.maxLength(2)]],
    socialBehavior: ['', Validators.required],
    ageRange: ['', Validators.required],
    telegramUsername: ['', [Validators.required, Validators.pattern(/^@[a-zA-Z0-9_]{5,32}$/)]]
  });

  get telegramControl() {
    return this.form.controls.telegramUsername;
  }

  ngOnInit(): void {
    this.loadGyms();
  }

  loadGyms(): void {
    this.gymService.getAll().subscribe(gyms => this.gyms = gyms);
  }

  getPlaceholderText(): string {
    return '@username';
  }

  getHintText(): string {
    return 'Start with @ (e.g., @john_doe)';
  }

  getAtSymbol(): string {
    return '@';
  }

  onSubmit(): void {
    if (this.form.invalid) {
      this.form.markAllAsTouched();
      return;
    }

    const user = this.authService.currentUser();
    if (!user) return;

    this.loading = true;

    const data = {
      userId: user.id,
      trainingGoal: this.form.value.trainingGoal!,
      gender: this.form.value.gender!,
      preferredLocations: this.form.value.preferredLocations!,
      dailySchedule: this.form.value.dailySchedule!,
      socialBehavior: this.form.value.socialBehavior!,
      ageRange: this.form.value.ageRange!,
      telegramUsername: this.form.value.telegramUsername!
    };

    this.buddyService.saveBuddyPreferences(data).subscribe({
      next: () => {
        this.snackBar.open('Preferences saved! Finding matches...', 'Close', { duration: 3000 });
        this.router.navigate(['/buddies/search']);
      },
      error: (err) => {
        this.loading = false;
        this.snackBar.open(err.error?.message || 'Failed to save preferences', 'Close', { duration: 3000 });
      }
    });
  }
}

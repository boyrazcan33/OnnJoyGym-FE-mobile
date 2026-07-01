import { Component, inject, OnInit, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { AbstractControl, FormBuilder, ReactiveFormsModule, ValidatorFn, Validators } from '@angular/forms';
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

// Known gym brands in Estonia — ordered longest-first so startsWith matches most specific name first.
const KNOWN_BRANDS = [
  'Sparta Sports Club',
  'Arctic Sport Club',
  '24/7 Fitness',
  'HC Gym',
  'Golden Club',
  'Club 26',
  'Reval Sport',
  'Lemon Gym',
  'MyFitness',
  'Gym!'
];

function minItemsValidator(min: number): ValidatorFn {
  return (control: AbstractControl) => {
    const val = control.value;
    if (!Array.isArray(val) || val.length < min) {
      return { minItems: { required: min, actual: val?.length ?? 0 } };
    }
    return null;
  };
}

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
                <mat-label>Gym Branches (select at least 3)</mat-label>
                <mat-select formControlName="preferredLocations" multiple required
                            (selectionChange)="onLocationChange($event.value)">
                  @for (gym of gyms; track gym.id) {
                    <mat-option [value]="gym.id">{{ gym.name }}</mat-option>
                  }
                </mat-select>
                <mat-hint>Min 3 branches, from at most 2 brands (e.g., MyFitness + Gym!)</mat-hint>
              </mat-form-field>
              @if (locationError()) {
                <div class="field-error">{{ locationError() }}</div>
              }

              <mat-form-field appearance="outline">
                <mat-label>Training Time (select at least 1)</mat-label>
                <mat-select formControlName="dailySchedule" multiple required>
                  <mat-option value="MORNING">Morning (6 AM – 12 PM)</mat-option>
                  <mat-option value="AFTERNOON">Afternoon (12 PM – 6 PM)</mat-option>
                  <mat-option value="EVENING">Evening (6 PM – 12 AM)</mat-option>
                  <mat-option value="NIGHT">Night (12 AM – 6 AM)</mat-option>
                </mat-select>
                <mat-hint>Select all slots that work for you</mat-hint>
              </mat-form-field>

              <button mat-raised-button color="primary" type="submit" [disabled]="loading || !canSubmit()">
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

    .field-error {
      color: #f44336;
      font-size: 0.75rem;
      margin-top: -0.75rem;
      padding-left: 1rem;
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
  locationError = signal<string | null>(null);

  form = this.fb.group({
    preferredLocations: [[] as number[], [Validators.required, minItemsValidator(3)]],
    dailySchedule: [[] as string[], [Validators.required, minItemsValidator(1)]]
  });

  canSubmit(): boolean {
    return this.form.valid && this.locationError() === null;
  }

  ngOnInit(): void {
    this.loadGyms();
  }

  loadGyms(): void {
    this.gymService.getAll().subscribe(gyms => this.gyms = gyms);
  }

  getBrandFromGymName(gymName: string): string {
    return KNOWN_BRANDS.find(b => gymName.startsWith(b)) ?? gymName;
  }

  onLocationChange(selectedIds: number[]): void {
    if (selectedIds.length === 0) {
      this.locationError.set(null);
      return;
    }
    if (selectedIds.length < 3) {
      this.locationError.set('Select at least 3 gym branches');
      return;
    }
    const brands = new Set(
      selectedIds.map(id => this.getBrandFromGymName(this.gyms.find(g => g.id === id)?.name ?? ''))
    );
    if (brands.size > 2) {
      this.locationError.set('Select branches from at most 2 gym brands (e.g., MyFitness + Gym!)');
    } else {
      this.locationError.set(null);
    }
  }

  onSubmit(): void {
    if (this.form.invalid || this.locationError()) {
      this.form.markAllAsTouched();
      const locations = this.form.value.preferredLocations ?? [];
      if (locations.length > 0 && locations.length < 3) {
        this.locationError.set('Select at least 3 gym branches');
      }
      return;
    }

    const user = this.authService.currentUser();
    if (!user) return;

    this.loading = true;

    const data = {
      userId: user.id,
      preferredLocations: this.form.value.preferredLocations!,
      dailySchedule: this.form.value.dailySchedule!
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
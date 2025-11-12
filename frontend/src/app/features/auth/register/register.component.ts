import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { Router, RouterLink } from '@angular/router';
import { MatCardModule } from '@angular/material/card';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';
import { MatButtonModule } from '@angular/material/button';
import { MatSnackBar, MatSnackBarModule } from '@angular/material/snack-bar';
import { AuthService } from '../../../core/services/auth.service';
import { BackButtonComponent } from '../../../shared/components/back-button/back-button.component';

@Component({
  selector: 'app-register',
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule,
    RouterLink,
    MatCardModule,
    MatFormFieldModule,
    MatInputModule,
    MatSelectModule,
    MatButtonModule,
    MatSnackBarModule,
    BackButtonComponent
  ],
  template: `
    <div class="auth-container">
      <div class="back-button-wrapper">
        <app-back-button [fallbackRoute]="'/'"></app-back-button>
      </div>
      <mat-card class="auth-card">
        <mat-card-header>
          <mat-card-title>Create Account</mat-card-title>
          <mat-card-subtitle>Join OnnJoyGym today</mat-card-subtitle>
        </mat-card-header>

        <mat-card-content>
          <form [formGroup]="form" (ngSubmit)="onSubmit()">
            <mat-form-field appearance="outline">
              <mat-label>Email</mat-label>
              <input matInput type="email" formControlName="email" required>
              @if (emailControl.hasError('required') && emailControl.touched) {
                <mat-error>Email is required</mat-error>
              }
              @if (emailControl.hasError('email') && !emailControl.hasError('required')) {
                <mat-error>Invalid email</mat-error>
              }
            </mat-form-field>

            <mat-form-field appearance="outline">
              <mat-label>Password</mat-label>
              <input matInput type="password" formControlName="password" required>
              @if (passwordControl.hasError('required') && passwordControl.touched) {
                <mat-error>Password is required</mat-error>
              }
              @if (passwordControl.hasError('minlength') && !passwordControl.hasError('required')) {
                <mat-error>Password must be at least 6 characters</mat-error>
              }
            </mat-form-field>

            <mat-form-field appearance="outline">
              <mat-label>Gender</mat-label>
              <mat-select formControlName="gender" required>
                <mat-option value="MALE">Male</mat-option>
                <mat-option value="FEMALE">Female</mat-option>
              </mat-select>
              @if (genderControl.hasError('required') && genderControl.touched) {
                <mat-error>Gender is required</mat-error>
              }
            </mat-form-field>

            <mat-form-field appearance="outline">
              <mat-label>Telegram Username</mat-label>
              <input matInput formControlName="telegramUsername" placeholder="@username" required>
              <mat-hint>Start with &#64; (e.g., &#64;john_doe)</mat-hint>
              @if (telegramControl.hasError('required') && telegramControl.touched) {
                <mat-error>Telegram username is required</mat-error>
              }
              @if (telegramControl.hasError('pattern') && !telegramControl.hasError('required')) {
                <mat-error>Must start with &#64; and be 5-32 characters</mat-error>
              }
            </mat-form-field>

            <div class="email-notice">
              <p>📧 A verification email will be sent to your email address</p>
            </div>

            <button mat-raised-button color="primary" type="submit" [disabled]="loading">
              {{ loading ? 'Creating account...' : 'Sign Up' }}
            </button>
          </form>

          <p class="auth-link">
            Already have an account? <a routerLink="/login">Login</a>
          </p>
        </mat-card-content>
      </mat-card>
    </div>
  `,
  styles: [`
    .auth-container {
      min-height: calc(100vh - 64px);
      display: flex;
      align-items: center;
      justify-content: center;
      padding: 2rem;
      background: linear-gradient(135deg, var(--secondary) 0%, var(--dark) 100%);
      position: relative;
    }

    .back-button-wrapper {
      position: absolute;
      top: 1rem;
      left: 1rem;
      z-index: 10;
    }

    .auth-card {
      max-width: 400px;
      width: 100%;
    }

    mat-card-header {
      margin-bottom: 1.5rem;
    }

    form {
      display: flex;
      flex-direction: column;
      gap: 1rem;
    }

    mat-form-field {
      width: 100%;
    }

    .email-notice {
      padding: 0.75rem;
      background: #fff3cd;
      border-radius: 8px;
      margin: 0.5rem 0;

      p {
        margin: 0;
        color: #856404;
        font-size: 0.875rem;
        text-align: center;
      }
    }

    button[type="submit"] {
      width: 100%;
      padding: 0.75rem;
      font-size: 1rem;
    }

    .auth-link {
      text-align: center;
      margin-top: 1.5rem;

      a {
        color: var(--primary);
        text-decoration: none;
        font-weight: 500;

        &:hover {
          text-decoration: underline;
        }
      }
    }
  `]
})
export class RegisterComponent {
  private fb = inject(FormBuilder);
  private authService = inject(AuthService);
  private router = inject(Router);
  private snackBar = inject(MatSnackBar);

  loading = false;

  form = this.fb.group({
    email: ['', [Validators.required, Validators.email]],
    password: ['', [Validators.required, Validators.minLength(6)]],
    gender: ['', Validators.required],
    telegramUsername: ['', [Validators.required, Validators.pattern(/^@[a-zA-Z0-9_]{5,32}$/)]]
  });

  get emailControl() {
    return this.form.controls.email;
  }

  get passwordControl() {
    return this.form.controls.password;
  }

  get genderControl() {
    return this.form.controls.gender;
  }

  get telegramControl() {
    return this.form.controls.telegramUsername;
  }

  onSubmit(): void {
    if (this.form.invalid) {
      this.form.markAllAsTouched();
      return;
    }

    this.loading = true;

    const registerData = {
      email: this.form.value.email!,
      password: this.form.value.password!,
      gender: this.form.value.gender!,
      telegramUsername: this.form.value.telegramUsername!
    };

    this.authService.register(registerData).subscribe({
      next: () => {
        this.snackBar.open('Account created! Please check your email for verification link.', 'Close', { duration: 5000 });
        this.router.navigate(['/dashboard']);
      },
      error: (err) => {
        this.loading = false;
        this.snackBar.open(err.error?.message || 'Registration failed', 'Close', { duration: 3000 });
      }
    });
  }
}

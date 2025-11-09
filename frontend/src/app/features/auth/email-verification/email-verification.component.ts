import { Component, OnInit, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute, Router, RouterLink } from '@angular/router';
import { MatCardModule } from '@angular/material/card';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { HttpClient } from '@angular/common/http';
import { environment } from '../../../../environments/environment';

@Component({
  selector: 'app-email-verification',
  standalone: true,
  imports: [
    CommonModule,
    RouterLink,
    MatCardModule,
    MatButtonModule,
    MatIconModule,
    MatProgressSpinnerModule
  ],
  template: `
    <div class="verification-container">
      <mat-card class="verification-card">
        @if (loading) {
          <div class="loading-state">
            <mat-spinner diameter="60"></mat-spinner>
            <h2>Verifying your email...</h2>
            <p>Please wait while we verify your account</p>
          </div>
        } @else if (success) {
          <div class="success-state">
            <mat-icon class="success-icon">check_circle</mat-icon>
            <h2>Email Verified Successfully!</h2>
            <p>{{ message }}</p>
            <button mat-raised-button color="primary" routerLink="/login">
              <mat-icon>login</mat-icon>
              Go to Login
            </button>
          </div>
        } @else {
          <div class="error-state">
            <mat-icon class="error-icon">error</mat-icon>
            <h2>Verification Failed</h2>
            <p>{{ message }}</p>
            <div class="error-actions">
              <button mat-raised-button color="primary" routerLink="/register">
                <mat-icon>person_add</mat-icon>
                Sign Up Again
              </button>
              <button mat-button routerLink="/">
                <mat-icon>home</mat-icon>
                Go Home
              </button>
            </div>
          </div>
        }
      </mat-card>
    </div>
  `,
  styles: [`
    .verification-container {
      min-height: calc(100vh - 64px);
      display: flex;
      align-items: center;
      justify-content: center;
      padding: 2rem;
      background: linear-gradient(135deg, var(--secondary) 0%, var(--dark) 100%);
    }

    .verification-card {
      max-width: 500px;
      width: 100%;
      padding: 2rem;
      text-align: center;
    }

    .loading-state {
      display: flex;
      flex-direction: column;
      align-items: center;
      gap: 1.5rem;

      h2 {
        margin: 0;
        color: var(--dark);
      }

      p {
        margin: 0;
        color: #666;
      }
    }

    .success-state {
      display: flex;
      flex-direction: column;
      align-items: center;
      gap: 1.5rem;

      .success-icon {
        font-size: 5rem;
        width: 5rem;
        height: 5rem;
        color: var(--success);
      }

      h2 {
        margin: 0;
        color: var(--dark);
      }

      p {
        margin: 0;
        color: #666;
      }

      button {
        min-width: 200px;
      }
    }

    .error-state {
      display: flex;
      flex-direction: column;
      align-items: center;
      gap: 1.5rem;

      .error-icon {
        font-size: 5rem;
        width: 5rem;
        height: 5rem;
        color: var(--error);
      }

      h2 {
        margin: 0;
        color: var(--dark);
      }

      p {
        margin: 0;
        color: #666;
      }

      .error-actions {
        display: flex;
        gap: 1rem;
        flex-wrap: wrap;
        justify-content: center;

        button {
          min-width: 150px;
        }
      }
    }

    @media (max-width: 768px) {
      .verification-card {
        margin: 0 1rem;
      }

      .error-actions {
        flex-direction: column;

        button {
          width: 100%;
        }
      }
    }
  `]
})
export class EmailVerificationComponent implements OnInit {
  private route = inject(ActivatedRoute);
  private router = inject(Router);
  private http = inject(HttpClient);

  loading = true;
  success = false;
  message = '';

  ngOnInit(): void {
    const token = this.route.snapshot.queryParamMap.get('token');

    if (!token) {
      this.loading = false;
      this.success = false;
      this.message = 'Invalid verification link. No token provided.';
      return;
    }

    this.verifyEmail(token);
  }

  private verifyEmail(token: string): void {
    this.http.get<{ message: string }>(`${environment.apiUrl}/auth/verify?token=${token}`)
      .subscribe({
        next: (response) => {
          this.loading = false;
          this.success = true;
          this.message = response.message || 'Email verified successfully! You can now use all features.';
        },
        error: (err) => {
          this.loading = false;
          this.success = false;
          this.message = err.error?.message || 'Invalid or expired verification token.';
        }
      });
  }
}

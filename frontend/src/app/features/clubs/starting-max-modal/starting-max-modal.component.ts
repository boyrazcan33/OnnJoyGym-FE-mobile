import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { HttpClient } from '@angular/common/http';
import { MAT_DIALOG_DATA, MatDialogModule, MatDialogRef } from '@angular/material/dialog';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { environment } from '../../../../environments/environment';

@Component({
  selector: 'app-starting-max-modal',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    MatDialogModule,
    MatFormFieldModule,
    MatInputModule,
    MatButtonModule,
    MatProgressSpinnerModule
  ],
  template: `
    <h2 mat-dialog-title>Enter Your Starting Max</h2>
    <mat-dialog-content>
      <p>{{ data.clubName }}</p>

      @if (loading) {
        <div class="loading-container">
          <mat-spinner diameter="40"></mat-spinner>
          <p>Getting recommendation...</p>
        </div>
      } @else {
        <mat-form-field appearance="outline" class="full-width">
          <mat-label>Current Max (kg or reps)</mat-label>
          <input matInput type="number" [(ngModel)]="startingMax" min="1" (ngModelChange)="onValueChange()">
        </mat-form-field>

        @if (recommendation) {
          <div class="recommendation-box">
            <h4>💡 Recommendation</h4>
            <p><strong>{{ recommendation.recommendedClubName }}</strong></p>
            <p class="message">{{ recommendation.message }}</p>
          </div>
        }
      }
    </mat-dialog-content>
    <mat-dialog-actions align="end">
      <button mat-button (click)="cancel()">Cancel</button>
      <button mat-raised-button color="primary" (click)="confirm()" [disabled]="!startingMax || loading">
        Confirm
      </button>
    </mat-dialog-actions>
  `,
  styles: [`
    .full-width {
      width: 100%;
      margin-bottom: 1rem;
    }

    .loading-container {
      display: flex;
      flex-direction: column;
      align-items: center;
      padding: 2rem;
      gap: 1rem;
    }

    .recommendation-box {
      padding: 1rem;
      background: #e8f5e9;
      border-left: 4px solid var(--success);
      border-radius: 4px;
      margin-top: 1rem;

      h4 {
        margin: 0 0 0.5rem 0;
        color: #2d6a4f;
      }

      p {
        margin: 0.5rem 0;
        color: #2d6a4f;
      }

      .message {
        font-size: 0.875rem;
        font-style: italic;
      }
    }
  `]
})
export class StartingMaxModalComponent {
  data = inject(MAT_DIALOG_DATA);
  dialogRef = inject(MatDialogRef<StartingMaxModalComponent>);
  http = inject(HttpClient);

  startingMax: number | null = null;
  recommendation: any = null;
  loading = false;
  timeoutId: any;

  cancel(): void {
    this.dialogRef.close();
  }

  confirm(): void {
    if (this.recommendation && this.recommendation.recommendedClubId) {
      // Return both startingMax and recommended club ID
      this.dialogRef.close({
        startingMax: this.startingMax,
        recommendedClubId: this.recommendation.recommendedClubId
      });
    } else {
      this.dialogRef.close({ startingMax: this.startingMax });
    }
  }

  onValueChange(): void {
    if (!this.startingMax) {
      this.recommendation = null;
      return;
    }

    // Debounce: wait 500ms after user stops typing
    clearTimeout(this.timeoutId);
    this.timeoutId = setTimeout(() => {
      this.getRecommendation();
    }, 500);
  }

  getRecommendation(): void {
    if (!this.startingMax) return;

    this.loading = true;
    this.http.post(`${environment.apiUrl}/clubs/recommend`, {
      clubId: this.data.clubId,
      userValue: this.startingMax
    }).subscribe({
      next: (response: any) => {
        this.recommendation = response;
        this.loading = false;
      },
      error: () => {
        this.loading = false;
      }
    });
  }
}

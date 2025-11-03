import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MAT_DIALOG_DATA, MatDialogModule } from '@angular/material/dialog';
import { MatButtonModule } from '@angular/material/button';
import { MatExpansionModule } from '@angular/material/expansion';
import { MatIconModule } from '@angular/material/icon';
import { WeeklyProgram } from '../../../models/program.model';

@Component({
  selector: 'app-program-view-modal',
  standalone: true,
  imports: [
    CommonModule,
    MatDialogModule,
    MatButtonModule,
    MatExpansionModule,
    MatIconModule
  ],
  template: `
    <h2 mat-dialog-title>
      <mat-icon>assignment</mat-icon>
      {{ program.clubName }} - {{ program.level }}
    </h2>
    <mat-dialog-content>
      <div class="program-info">
        <p><strong>Goal:</strong> {{ program.goal }}</p>
      </div>

      <mat-accordion>
        @for (day of program.days; track day.dayName) {
          <mat-expansion-panel>
            <mat-expansion-panel-header>
              <mat-panel-title>{{ day.dayName }}</mat-panel-title>
              <mat-panel-description>
                {{ day.exercises.length }} exercises
              </mat-panel-description>
            </mat-expansion-panel-header>

            <div class="exercises">
              @for (exercise of day.exercises; track $index) {
                <div class="exercise-card">
                  <h4>{{ exercise.name }}</h4>
                  <div class="exercise-details">
                    <span><strong>Sets:</strong> {{ exercise.sets }}</span>
                    <span><strong>Reps:</strong> {{ exercise.reps }}</span>
                    <span><strong>Rest:</strong> {{ exercise.rest }}</span>
                  </div>
                  @if (exercise.notes) {
                    <p class="exercise-notes">💡 {{ exercise.notes }}</p>
                  }
                </div>
              }
            </div>
          </mat-expansion-panel>
        }
      </mat-accordion>
    </mat-dialog-content>
    <mat-dialog-actions align="end">
      <button mat-button mat-dialog-close>Close</button>
    </mat-dialog-actions>
  `,
  styles: [`
    mat-dialog-content {
      max-height: 70vh;
      overflow-y: auto;
    }

    h2 {
      display: flex;
      align-items: center;
      gap: 0.5rem;
    }

    .program-info {
      padding: 1rem;
      background: var(--light);
      border-radius: 8px;
      margin-bottom: 1rem;
    }

    mat-accordion {
      display: flex;
      flex-direction: column;
      gap: 0.5rem;
    }

    .exercises {
      padding: 1rem 0;
    }

    .exercise-card {
      padding: 1rem;
      background: var(--light);
      border-radius: 8px;
      margin-bottom: 1rem;

      h4 {
        color: var(--primary);
        margin-bottom: 0.5rem;
      }
    }

    .exercise-details {
      display: flex;
      gap: 1.5rem;
      flex-wrap: wrap;
      margin-bottom: 0.5rem;

      span {
        color: #666;
      }
    }

    .exercise-notes {
      margin-top: 0.5rem;
      padding: 0.5rem;
      background: white;
      border-radius: 4px;
      font-size: 0.875rem;
      color: #666;
    }

    @media (max-width: 768px) {
      .exercise-details {
        flex-direction: column;
        gap: 0.5rem;
      }
    }
  `]
})
export class ProgramViewModalComponent {
  program: WeeklyProgram = inject(MAT_DIALOG_DATA);
}

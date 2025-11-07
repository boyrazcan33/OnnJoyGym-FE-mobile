import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MAT_DIALOG_DATA, MatDialogModule } from '@angular/material/dialog';
import { MatButtonModule } from '@angular/material/button';
import { MatExpansionModule } from '@angular/material/expansion';
import { MatIconModule } from '@angular/material/icon';
import { MatChipsModule } from '@angular/material/chips';
import { WeeklyProgramDTO } from '../../../models/program.model';

interface ProgramData {
  programList: WeeklyProgramDTO[];
  clubName: string;
}

@Component({
  selector: 'app-program-view-modal',
  standalone: true,
  imports: [
    CommonModule,
    MatDialogModule,
    MatButtonModule,
    MatExpansionModule,
    MatIconModule,
    MatChipsModule
  ],
  template: `
    <h2 mat-dialog-title>
      <mat-icon>assignment</mat-icon>
      {{ data.clubName }}
    </h2>
    <mat-dialog-content>
      <mat-accordion>
        @for (week of data.programList; track week.weekNumber) {
          <mat-expansion-panel [disabled]="week.isLocked">
            <mat-expansion-panel-header>
              <mat-panel-title>
                Week {{ week.weekNumber }}: {{ week.weekRange }}
                @if (week.isLocked) {
                  <mat-chip class="locked-chip">
                    <mat-icon>lock</mat-icon>
                    Locked
                  </mat-chip>
                }
                @if (week.isCompleted) {
                  <mat-chip class="completed-chip">
                    <mat-icon>check_circle</mat-icon>
                    Completed
                  </mat-chip>
                }
              </mat-panel-title>
            </mat-expansion-panel-header>

            <div class="week-content">
              <div class="main-exercise">
                <h3>{{ week.mainExercise }}</h3>
                <p><strong>Sets:</strong> {{ week.sets }}</p>
                <p><strong>Reps:</strong> {{ week.reps }}</p>
                <p><strong>Intensity:</strong> {{ week.intensity }}</p>
                <p><strong>Frequency:</strong> {{ week.frequency }}</p>
              </div>

              @if (week.recommendedWeightMin && week.recommendedWeightMax) {
                <div class="recommended-weights">
                  <mat-icon>fitness_center</mat-icon>
                  <strong>Recommended: {{ week.recommendedWeightMin }} - {{ week.recommendedWeightMax }} kg</strong>
                </div>
              }

              @if (week.accessories.length > 0) {
                <div class="accessories">
                  <h4>Accessory Exercises</h4>
                  <div class="accessory-chips">
                    @for (accessory of week.accessories; track accessory) {
                      <mat-chip>{{ accessory }}</mat-chip>
                    }
                  </div>
                </div>
              }

              <p class="description">{{ week.description }}</p>
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

    mat-accordion {
      display: flex;
      flex-direction: column;
      gap: 0.5rem;
    }

    mat-panel-title {
      display: flex;
      align-items: center;
      gap: 0.5rem;
    }

    .locked-chip {
      background: #9e9e9e;
      color: white;

      mat-icon {
        color: white;
      }
    }

    .completed-chip {
      background: var(--success);
      color: white;

      mat-icon {
        color: white;
      }
    }

    .week-content {
      padding: 1rem 0;
    }

    .main-exercise {
      margin-bottom: 1rem;
      padding: 1rem;
      background: var(--light);
      border-radius: 8px;

      h3 {
        color: var(--primary);
        margin-bottom: 0.5rem;
      }

      p {
        margin: 0.25rem 0;
        color: #666;
      }
    }

    .recommended-weights {
      display: flex;
      align-items: center;
      gap: 0.5rem;
      padding: 1rem;
      background: #e8f5e9;
      border-radius: 8px;
      margin-bottom: 1rem;

      mat-icon {
        color: var(--success);
      }

      strong {
        color: #2d6a4f;
      }
    }

    .accessories {
      margin-bottom: 1rem;

      h4 {
        color: var(--dark);
        margin-bottom: 0.5rem;
      }
    }

    .accessory-chips {
      display: flex;
      flex-wrap: wrap;
      gap: 0.5rem;
    }

    .description {
      color: #666;
      line-height: 1.6;
      font-style: italic;
    }

    @media (max-width: 768px) {
      .week-content {
        font-size: 0.875rem;
      }
    }
  `]
})
export class ProgramViewModalComponent {
  data: ProgramData = inject(MAT_DIALOG_DATA);
}

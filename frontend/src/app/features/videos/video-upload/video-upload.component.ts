import { Component, inject, signal, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { HttpClient, HttpEventType } from '@angular/common/http';
import { MatCardModule } from '@angular/material/card';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';
import { MatButtonModule } from '@angular/material/button';
import { MatProgressBarModule } from '@angular/material/progress-bar';
import { MatSnackBar, MatSnackBarModule } from '@angular/material/snack-bar';
import { MatIconModule } from '@angular/material/icon';
import { VideoService } from '../../../core/services/video.service';
import { GymService } from '../../../core/services/gym.service';
import { AuthService } from '../../../core/services/auth.service';
import { Gym } from '../../../models/gym.model';

@Component({
  selector: 'app-video-upload',
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule,
    MatCardModule,
    MatFormFieldModule,
    MatInputModule,
    MatSelectModule,
    MatButtonModule,
    MatProgressBarModule,
    MatSnackBarModule,
    MatIconModule
  ],
  template: `
    <div class="video-upload">
      <div class="container">
        <mat-card class="upload-card">
          <mat-card-header>
            <mat-card-title>Upload Your Lift</mat-card-title>
            <mat-card-subtitle>Show off your strength and compete on the leaderboard</mat-card-subtitle>
          </mat-card-header>

          <mat-card-content>
            <form [formGroup]="form" (ngSubmit)="onSubmit()">
              <mat-form-field appearance="outline">
                <mat-label>Category</mat-label>
                <mat-select formControlName="category" required>
                  <mat-option value="BENCH_PRESS">Bench Press</mat-option>
                  <mat-option value="SQUAT">Squat</mat-option>
                  <mat-option value="DEADLIFT">Deadlift</mat-option>
                  <mat-option value="PULL_UP">Pull Up</mat-option>
                </mat-select>
                @if (form.get('category')!.hasError('required') && form.get('category')?.touched) {
                  <mat-error>Category is required</mat-error>
                }
              </mat-form-field>

              <mat-form-field appearance="outline">
                <mat-label>Weight (kg)</mat-label>
                <input matInput type="number" formControlName="weight" required min="1" max="500">
                @if (form.get('weight')!.hasError('required') && form.get('weight')?.touched) {
                  <mat-error>Weight is required</mat-error>
                }
                @if (form.get('weight')!.hasError('min')) {
                  <mat-error>Weight must be at least 1 kg</mat-error>
                }
                @if (form.get('weight')!.hasError('max')) {
                  <mat-error>Weight cannot exceed 500 kg</mat-error>
                }
              </mat-form-field>

              <mat-form-field appearance="outline">
                <mat-label>Gym</mat-label>
                <mat-select formControlName="gymId" required>
                  @for (gym of gyms(); track gym.id) {
                    <mat-option [value]="gym.id">{{ gym.name }}</mat-option>
                  }
                </mat-select>
                @if (form.get('gymId')!.hasError('required') && form.get('gymId')?.touched) {
                  <mat-error>Gym is required</mat-error>
                }
              </mat-form-field>

              <div class="file-input">
                <input type="file" #fileInput (change)="onFileSelected($event)" accept="video/mp4" hidden>
                <button type="button" mat-stroked-button (click)="fileInput.click()">
                  <mat-icon>videocam</mat-icon>
                  {{ selectedFile() ? selectedFile()!.name : 'Choose Video (MP4 only)' }}
                </button>
                @if (selectedFile()) {
                  <span class="file-size">{{ getFileSize() }}</span>
                }
              </div>

              <div class="requirements">
                <h4>Requirements:</h4>
                <ul>
                  <li>Video must be MP4 format</li>
                  <li>Must show exactly 3 reps</li>
                  <li>Full range of motion visible</li>
                  <li>No inappropriate content</li>
                </ul>
              </div>

              @if (uploadProgress() > 0) {
                <div class="upload-progress">
                  <mat-progress-bar mode="determinate" [value]="uploadProgress()"></mat-progress-bar>
                  <span>{{ uploadProgress() }}%</span>
                </div>
              }

              <button mat-raised-button color="primary" type="submit" [disabled]="uploading || !selectedFile()">
                {{ uploading ? 'Uploading...' : 'Upload Video' }}
              </button>
            </form>
          </mat-card-content>
        </mat-card>
      </div>
    </div>
  `,
  styles: [`
    .video-upload {
      padding: 2rem 0;
      min-height: calc(100vh - 64px);
    }

    .upload-card {
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

    .file-input {
      display: flex;
      align-items: center;
      gap: 1rem;
      padding: 1rem;
      background: var(--light);
      border-radius: 8px;

      button {
        flex-shrink: 0;
      }

      .file-size {
        color: #666;
        font-size: 0.875rem;
      }
    }

    .requirements {
      padding: 1rem;
      background: #fff3cd;
      border-radius: 8px;

      h4 {
        margin: 0 0 0.5rem 0;
        color: #856404;
      }

      ul {
        margin: 0;
        padding-left: 1.5rem;
        color: #856404;

        li {
          margin-bottom: 0.25rem;
        }
      }
    }

    .upload-progress {
      display: flex;
      flex-direction: column;
      gap: 0.5rem;

      span {
        text-align: center;
        font-weight: 500;
        color: var(--primary);
      }
    }

    button[type="submit"] {
      width: 100%;
      padding: 0.75rem;
      font-size: 1rem;
    }

    @media (max-width: 768px) {
      .upload-card {
        margin: 0 1rem;
      }

      .file-input {
        flex-direction: column;
        align-items: flex-start;
      }
    }
  `]
})
export class VideoUploadComponent implements OnInit {
  private fb = inject(FormBuilder);
  private http = inject(HttpClient);
  private videoService = inject(VideoService);
  private gymService = inject(GymService);
  private authService = inject(AuthService);
  private snackBar = inject(MatSnackBar);
  private router = inject(Router);

  gyms = signal<Gym[]>([]);
  selectedFile = signal<File | null>(null);
  uploadProgress = signal(0);
  uploading = false;

  form = this.fb.group({
    category: ['', Validators.required],
    weight: [null as number | null, [Validators.required, Validators.min(1), Validators.max(500)]],
    gymId: [null as number | null, Validators.required]
  });

  ngOnInit(): void {
    this.loadGyms();
  }

  loadGyms(): void {
    this.gymService.getAll().subscribe(gyms => this.gyms.set(gyms));
  }

  onFileSelected(event: any): void {
    const file = event.target.files[0];
    if (file) {
      if (!file.type.includes('mp4')) {
        this.snackBar.open('Only MP4 format is accepted', 'Close', { duration: 3000 });
        return;
      }
      this.selectedFile.set(file);
    }
  }

  getFileSize(): string {
    const file = this.selectedFile();
    if (!file) return '';
    const mb = file.size / 1024 / 1024;
    return `${mb.toFixed(2)} MB`;
  }

  onSubmit(): void {
    if (this.form.invalid || !this.selectedFile()) {
      this.form.markAllAsTouched();
      return;
    }

    const user = this.authService.currentUser();
    if (!user) return;

    this.uploading = true;

    const uploadData = {
      userId: user.id,
      gymId: this.form.value.gymId!,
      category: this.form.value.category!,
      weight: this.form.value.weight!,
      fileName: this.selectedFile()!.name,
      reps: 3
    };

    // Step 1: Get pre-signed URL
    this.videoService.getUploadUrl(uploadData).subscribe({
      next: (response) => {
        // Step 2: Upload to S3
        this.uploadToS3(response.uploadUrl, this.selectedFile()!);
      },
      error: (err) => {
        this.uploading = false;
        this.snackBar.open(err.error?.message || 'Failed to get upload URL', 'Close', { duration: 3000 });
      }
    });
  }

  private uploadToS3(url: string, file: File): void {
    this.http.put(url, file, {
      reportProgress: true,
      observe: 'events',
      headers: {
        'Content-Type': 'video/mp4'
      }
    }).subscribe({
      next: (event) => {
        if (event.type === HttpEventType.UploadProgress) {
          const progress = Math.round(100 * event.loaded / (event.total || 1));
          this.uploadProgress.set(progress);
        } else if (event.type === HttpEventType.Response) {
          this.snackBar.open('Video uploaded successfully! Waiting for admin approval.', 'Close', { duration: 3000 });
          this.router.navigate(['/dashboard']);
        }
      },
      error: () => {
        this.uploading = false;
        this.uploadProgress.set(0);
        this.snackBar.open('Upload failed', 'Close', { duration: 3000 });
      }
    });
  }
}

import { Component, inject, signal, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { HttpClient, HttpEventType, HttpHeaders } from '@angular/common/http';
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
import { UserService } from '../../../core/services/user.service';
import { Gym } from '../../../models/gym.model';

interface CategoryOption {
  value: string;
  label: string;
}

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
                  @for (category of getAvailableCategories(); track category.value) {
                    <mat-option [value]="category.value">{{ category.label }}</mat-option>
                  }
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
                <input type="file" #fileInput (change)="onFileSelected($event)" accept="video/mp4,video/mov,video/avi" hidden>
                <button type="button" mat-stroked-button (click)="fileInput.click()">
                  <mat-icon>videocam</mat-icon>
                  {{ selectedFile() ? selectedFile()!.name : 'Choose Video (MP4, MOV, AVI)' }}
                </button>
                @if (selectedFile()) {
                  <span class="file-size">{{ getFileSize() }}</span>
                }
              </div>

              <div class="requirements">
                <h4>Requirements:</h4>
                <ul>
                  <li>Video must be MP4, MOV, or AVI format</li>
                  <li>Must show exactly 3 reps</li>
                  <li>Full range of motion visible</li>
                  <li>No inappropriate content</li>
                </ul>
              </div>

              @if (uploadStatus()) {
                <div class="status-message" [class]="uploadStatus()?.type">
                  <mat-icon>{{ uploadStatus()?.icon }}</mat-icon>
                  <span>{{ uploadStatus()?.message }}</span>
                </div>
              }

              @if (uploadProgress() > 0 && uploadProgress() < 100) {
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

    .status-message {
      display: flex;
      align-items: center;
      gap: 0.5rem;
      padding: 1rem;
      border-radius: 8px;
      font-weight: 500;

      &.success {
        background: #d4edda;
        color: #155724;
        border: 1px solid #c3e6cb;
      }

      &.error {
        background: #f8d7da;
        color: #721c24;
        border: 1px solid #f5c6cb;
      }

      &.info {
        background: #d1ecf1;
        color: #0c5460;
        border: 1px solid #bee5eb;
      }

      mat-icon {
        font-size: 1.5rem;
        width: 1.5rem;
        height: 1.5rem;
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
  private userService = inject(UserService);
  private snackBar = inject(MatSnackBar);
  private router = inject(Router);

  gyms = signal<Gym[]>([]);
  selectedFile = signal<File | null>(null);
  uploadProgress = signal(0);
  uploadStatus = signal<{ type: string; icon: string; message: string } | null>(null);
  uploading = false;

  // Gender-based categories (matching backend)
  private readonly MALE_CATEGORIES: CategoryOption[] = [
    { value: 'BENCH_PRESS', label: 'Bench Press' },
    { value: 'SQUAT', label: 'Squat' },
    { value: 'DEADLIFT', label: 'Deadlift' },
    { value: 'HAMMER_CURL', label: 'Hammer Curl' },
    { value: 'WIDE_GRIP_LAT_PULLDOWN', label: 'Wide Grip Lat Pulldown' }
  ];

  private readonly FEMALE_CATEGORIES: CategoryOption[] = [
    { value: 'BENCH_PRESS', label: 'Bench Press' },
    { value: 'SQUAT', label: 'Squat' },
    { value: 'DEADLIFT', label: 'Deadlift' },
    { value: 'HIP_THRUST', label: 'Hip Thrust' },
    { value: 'BARBELL_LUNGE', label: 'Barbell Lunge' }
  ];

  form = this.fb.group({
    category: ['', Validators.required],
    weight: [null as number | null, [Validators.required, Validators.min(1), Validators.max(500)]],
    gymId: [null as number | null, Validators.required]
  });

  userGender = signal<string>('MALE');

  ngOnInit(): void {
    this.loadGyms();
    this.loadUserProfile();
  }

  loadGyms(): void {
    this.gymService.getAll().subscribe(gyms => this.gyms.set(gyms));
  }

  loadUserProfile(): void {
    const currentUser = this.authService.currentUser();
    if (currentUser) {
      this.userService.getProfile(currentUser.id).subscribe({
        next: (user) => {
          this.userGender.set(user.gender || 'MALE');
        },
        error: () => {
          this.userGender.set('MALE');
        }
      });
    }
  }

  getAvailableCategories(): CategoryOption[] {
    const gender = this.userGender();
    return gender === 'FEMALE' ? this.FEMALE_CATEGORIES : this.MALE_CATEGORIES;
  }

  onFileSelected(event: any): void {
    const file = event.target.files[0];
    if (file) {
      const validFormats = ['video/mp4', 'video/quicktime', 'video/x-msvideo'];
      if (!validFormats.includes(file.type)) {
        this.snackBar.open('Only MP4, MOV, and AVI formats are accepted', 'Close', { duration: 3000 });
        return;
      }
      this.selectedFile.set(file);
      this.uploadStatus.set(null);
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
    this.uploadProgress.set(0);
    this.uploadStatus.set(null);

    const uploadData = {
      userId: user.id,
      gymId: this.form.value.gymId!,
      category: this.form.value.category!,
      weight: this.form.value.weight!,
      fileName: this.selectedFile()!.name,
      reps: 3
    };

    // Step 1: Get pre-signed URL from backend
    this.videoService.getUploadUrl(uploadData).subscribe({
      next: (response) => {
        console.log('✅ Upload URL received:', response.uploadUrl);
        // Step 2: Upload directly to S3 using PUT
        this.uploadToS3(response.uploadUrl, this.selectedFile()!);
      },
      error: (err) => {
        this.uploading = false;
        this.uploadStatus.set({
          type: 'error',
          icon: 'error',
          message: err.error?.message || 'Failed to get upload URL'
        });
      }
    });
  }

  private uploadToS3(presignedUrl: string, file: File): void {
    // ✅ CRITICAL: Detect correct content type
    let contentType = 'video/mp4'; // default
    if (file.type) {
      contentType = file.type;
    } else if (file.name.toLowerCase().endsWith('.mov')) {
      contentType = 'video/quicktime';
    } else if (file.name.toLowerCase().endsWith('.avi')) {
      contentType = 'video/x-msvideo';
    }

    console.log('📤 Uploading file:', file.name, 'Type:', contentType);

    // ✅ Create headers WITHOUT any AWS signature headers
    const headers = new HttpHeaders({
      'Content-Type': contentType
    });

    // ✅ Use PUT method to upload directly to S3
    this.http.put(presignedUrl, file, {
      headers: headers,
      reportProgress: true,
      observe: 'events',
      responseType: 'text' // S3 returns XML, not JSON
    }).subscribe({
      next: (event) => {
        if (event.type === HttpEventType.UploadProgress) {
          const progress = Math.round(100 * event.loaded / (event.total || 1));
          this.uploadProgress.set(progress);
          console.log(`📊 Upload progress: ${progress}%`);
        } else if (event.type === HttpEventType.Response) {
          // Upload complete
          console.log('✅ Upload complete!');
          this.uploadProgress.set(100);
          this.uploading = false;

          this.uploadStatus.set({
            type: 'success',
            icon: 'check_circle',
            message: '✅ Video uploaded successfully! Awaiting admin review.'
          });

          setTimeout(() => {
            this.snackBar.open('Video uploaded! Waiting for admin approval.', 'Close', { duration: 3000 });
            this.router.navigate(['/dashboard']);
          }, 2000);
        }
      },
      error: (error) => {
        console.error('❌ Upload failed:', error);
        this.uploading = false;
        this.uploadProgress.set(0);
        this.uploadStatus.set({
          type: 'error',
          icon: 'error',
          message: '❌ Upload failed. Please try again.'
        });

        // Show detailed error
        if (error.error) {
          console.error('Error details:', error.error);
        }
      }
    });
  }
}

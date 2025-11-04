import { Component, inject, OnInit, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatCardModule } from '@angular/material/card';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatChipsModule } from '@angular/material/chips';
import { MatDialogModule, MatDialog } from '@angular/material/dialog';
import { MatSnackBar } from '@angular/material/snack-bar';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { FormsModule } from '@angular/forms';
import { VideoService } from '../../../core/services/video.service';
import { Video } from '../../../models/video.model';

@Component({
  selector: 'app-video-moderation',
  standalone: true,
  imports: [
    CommonModule,
    MatCardModule,
    MatButtonModule,
    MatIconModule,
    MatChipsModule,
    MatDialogModule,
    MatFormFieldModule,
    MatInputModule,
    FormsModule
  ],
  template: `
    <div class="video-moderation">
      <div class="container">
        <div class="page-header">
          <h1>Video Moderation</h1>
          <p>Review and approve user submissions</p>
        </div>

        @if (loading) {
          <div class="loading">Loading pending videos...</div>
        } @else {
          @if (pendingVideos().length > 0) {
            <div class="video-grid">
              @for (video of pendingVideos(); track video.id) {
                <mat-card class="video-card">
                  <div class="video-header">
                    <mat-chip class="status-chip">PENDING</mat-chip>
                  </div>

                  <div class="video-player">
                    <video [src]="video.s3Url" controls></video>
                  </div>

                  <mat-card-content>
                    <div class="video-info">
                      <p><strong>User:</strong> {{ video.user.email }}</p>
                      <p><strong>Category:</strong> {{ formatCategory(video.category) }}</p>
                      <p><strong>Weight:</strong> {{ video.weight }} kg</p>
                      <p><strong>Reps:</strong> {{ video.reps }}</p>
                      <p><strong>Gym:</strong> {{ video.gym.name }}</p>
                      <p><strong>Date:</strong> {{ video.createdAt | date:'MMM dd, yyyy HH:mm' }}</p>
                    </div>
                  </mat-card-content>

                  <mat-card-actions>
                    <button mat-raised-button color="primary" (click)="approveVideo(video)">
                      <mat-icon>check_circle</mat-icon>
                      Approve
                    </button>
                    <button mat-raised-button color="warn" (click)="openRejectDialog(video)">
                      <mat-icon>cancel</mat-icon>
                      Reject
                    </button>
                  </mat-card-actions>
                </mat-card>
              }
            </div>
          } @else {
            <div class="empty-state">
              <mat-icon>video_library</mat-icon>
              <p>No pending videos to review</p>
            </div>
          }
        }
      </div>
    </div>

    <!-- Reject Dialog -->
    @if (showRejectDialog) {
      <div class="dialog-overlay" (click)="closeRejectDialog()">
        <mat-card class="reject-dialog" (click)="$event.stopPropagation()">
          <mat-card-header>
            <mat-card-title>Reject Video</mat-card-title>
          </mat-card-header>
          <mat-card-content>
            <mat-form-field appearance="outline" style="width: 100%;">
              <mat-label>Rejection Reason</mat-label>
              <textarea matInput [(ngModel)]="rejectionReason" rows="4" required></textarea>
            </mat-form-field>
          </mat-card-content>
          <mat-card-actions align="end">
            <button mat-button (click)="closeRejectDialog()">Cancel</button>
            <button mat-raised-button color="warn" (click)="confirmReject()" [disabled]="!rejectionReason">
              Reject Video
            </button>
          </mat-card-actions>
        </mat-card>
      </div>
    }
  `,
  styles: [`
    .video-moderation {
      padding: 2rem 0;
      min-height: calc(100vh - 64px);
    }

    .page-header {
      text-align: center;
      margin-bottom: 3rem;

      h1 {
        font-size: 2.5rem;
        color: var(--dark);
        margin-bottom: 0.5rem;
      }

      p {
        font-size: 1.25rem;
        color: #666;
      }
    }

    .video-grid {
      display: grid;
      grid-template-columns: repeat(auto-fill, minmax(400px, 1fr));
      gap: 2rem;
    }

    .video-card {
      .video-header {
        display: flex;
        justify-content: space-between;
        align-items: center;
        margin-bottom: 1rem;
      }

      .status-chip {
        background: #ffc107;
        color: #000;
      }

      .video-player {
        width: 100%;
        aspect-ratio: 16/9;
        background: #000;
        border-radius: 8px;
        overflow: hidden;
        margin-bottom: 1rem;

        video {
          width: 100%;
          height: 100%;
          object-fit: contain;
        }
      }

      .video-info {
        p {
          margin: 0.5rem 0;
          color: #666;

          strong {
            color: var(--dark);
          }
        }
      }
    }

    mat-card-actions {
      display: flex;
      gap: 1rem;

      button {
        flex: 1;
      }
    }

    .loading, .empty-state {
      text-align: center;
      padding: 4rem 0;
      color: #666;

      mat-icon {
        font-size: 4rem;
        width: 4rem;
        height: 4rem;
        margin-bottom: 1rem;
      }
    }

    .dialog-overlay {
      position: fixed;
      top: 0;
      left: 0;
      right: 0;
      bottom: 0;
      background: rgba(0, 0, 0, 0.5);
      display: flex;
      align-items: center;
      justify-content: center;
      z-index: 1000;
    }

    .reject-dialog {
      width: 500px;
      max-width: 90vw;
    }

    @media (max-width: 768px) {
      .page-header h1 {
        font-size: 2rem;
      }

      .video-grid {
        grid-template-columns: 1fr;
      }

      mat-card-actions {
        flex-direction: column;
      }
    }
  `]
})
export class VideoModerationComponent implements OnInit {
  private videoService = inject(VideoService);
  private snackBar = inject(MatSnackBar);

  pendingVideos = signal<Video[]>([]);
  loading = false;
  showRejectDialog = false;
  selectedVideo: Video | null = null;
  rejectionReason = '';

  ngOnInit(): void {
    this.loadPendingVideos();
  }

  loadPendingVideos(): void {
    this.loading = true;
    this.videoService.getPending().subscribe({
      next: (videos) => {
        this.pendingVideos.set(videos);
        this.loading = false;
      },
      error: () => {
        this.loading = false;
        this.snackBar.open('Failed to load videos', 'Close', { duration: 3000 });
      }
    });
  }

  approveVideo(video: Video): void {
    this.videoService.approve(video.id).subscribe({
      next: () => {
        this.snackBar.open('Video approved!', 'Close', { duration: 3000 });
        this.loadPendingVideos();
      },
      error: () => {
        this.snackBar.open('Failed to approve video', 'Close', { duration: 3000 });
      }
    });
  }

  openRejectDialog(video: Video): void {
    this.selectedVideo = video;
    this.rejectionReason = '';
    this.showRejectDialog = true;
  }

  closeRejectDialog(): void {
    this.showRejectDialog = false;
    this.selectedVideo = null;
    this.rejectionReason = '';
  }

  confirmReject(): void {
    if (!this.selectedVideo || !this.rejectionReason) return;

    this.videoService.reject(this.selectedVideo.id, this.rejectionReason).subscribe({
      next: () => {
        this.snackBar.open('Video rejected', 'Close', { duration: 3000 });
        this.closeRejectDialog();
        this.loadPendingVideos();
      },
      error: () => {
        this.snackBar.open('Failed to reject video', 'Close', { duration: 3000 });
      }
    });
  }

  formatCategory(category: string): string {
    return category.split('_').map(word =>
      word.charAt(0) + word.slice(1).toLowerCase()
    ).join(' ');
  }
}

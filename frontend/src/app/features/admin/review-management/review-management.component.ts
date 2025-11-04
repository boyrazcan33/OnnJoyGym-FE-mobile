import { Component, inject, OnInit, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { MatCardModule } from '@angular/material/card';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';
import { MatSnackBar } from '@angular/material/snack-bar';
import { ReviewService } from '../../../core/services/review.service';
import { GymService } from '../../../core/services/gym.service';
import { Review } from '../../../models/review.model';
import { Gym } from '../../../models/gym.model';

@Component({
  selector: 'app-review-management',
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule,
    MatCardModule,
    MatButtonModule,
    MatIconModule,
    MatFormFieldModule,
    MatInputModule,
    MatSelectModule
  ],
  template: `
    <div class="review-management">
      <div class="container">
        <div class="page-header">
          <h1>Gym Review Management</h1>
          <p>Create and manage expert gym reviews</p>
        </div>

        <div class="layout">
          <!-- Review Form -->
          <mat-card class="form-card">
            <mat-card-header>
              <mat-card-title>{{ editingReview() ? 'Edit Review' : 'Add New Review' }}</mat-card-title>
            </mat-card-header>

            <mat-card-content>
              <form [formGroup]="reviewForm" (ngSubmit)="saveReview()">
                <mat-form-field appearance="outline">
                  <mat-label>Gym</mat-label>
                  <mat-select formControlName="gymId" required>
                    @for (gym of gyms(); track gym.id) {
                      <mat-option [value]="gym.id">{{ gym.name }}</mat-option>
                    }
                  </mat-select>
                </mat-form-field>

                <mat-form-field appearance="outline">
                  <mat-label>Rating</mat-label>
                  <mat-select formControlName="rating" required>
                    <mat-option [value]="1">⭐ 1 - Poor</mat-option>
                    <mat-option [value]="2">⭐⭐ 2 - Fair</mat-option>
                    <mat-option [value]="3">⭐⭐⭐ 3 - Good</mat-option>
                    <mat-option [value]="4">⭐⭐⭐⭐ 4 - Very Good</mat-option>
                    <mat-option [value]="5">⭐⭐⭐⭐⭐ 5 - Excellent</mat-option>
                  </mat-select>
                </mat-form-field>

                <mat-form-field appearance="outline">
                  <mat-label>Author Name</mat-label>
                  <input matInput formControlName="authorName" required>
                </mat-form-field>

                <mat-form-field appearance="outline">
                  <mat-label>Review Content</mat-label>
                  <textarea matInput formControlName="content" rows="10" required></textarea>
                  <mat-hint>Write a detailed expert review (300-500 words recommended)</mat-hint>
                </mat-form-field>

                <div class="form-actions">
                  @if (editingReview()) {
                    <button type="button" mat-button (click)="cancelEdit()">Cancel</button>
                  }
                  <button mat-raised-button color="primary" type="submit" [disabled]="reviewForm.invalid || saving">
                    {{ saving ? 'Saving...' : (editingReview() ? 'Update Review' : 'Create Review') }}
                  </button>
                </div>
              </form>
            </mat-card-content>
          </mat-card>

          <!-- Reviews List -->
          <div class="reviews-list">
            <h2>All Reviews ({{ reviews().length }})</h2>

            @if (loading) {
              <div class="loading">Loading reviews...</div>
            } @else {
              @if (reviews().length > 0) {
                @for (review of reviews(); track review.id) {
                  <mat-card class="review-card">
                    <mat-card-header>
                      <div class="review-header">
                        <div>
                          <mat-card-title>{{ getGymName(review.gym.id) }}</mat-card-title>
                          <mat-card-subtitle>
                            <div class="rating">
                              @for (star of getStars(review.rating); track $index) {
                                <mat-icon>{{ star }}</mat-icon>
                              }
                            </div>
                            By {{ review.authorName }} • {{ review.createdAt | date:'MMM dd, yyyy' }}
                          </mat-card-subtitle>
                        </div>
                      </div>
                    </mat-card-header>

                    <mat-card-content>
                      <p class="review-content">{{ review.content }}</p>
                    </mat-card-content>

                    <mat-card-actions>
                      <button mat-button color="primary" (click)="editReview(review)">
                        <mat-icon>edit</mat-icon>
                        Edit
                      </button>
                      <button mat-button color="warn" (click)="deleteReview(review)">
                        <mat-icon>delete</mat-icon>
                        Delete
                      </button>
                    </mat-card-actions>
                  </mat-card>
                }
              } @else {
                <div class="empty-state">
                  <mat-icon>rate_review</mat-icon>
                  <p>No reviews yet. Create your first expert review!</p>
                </div>
              }
            }
          </div>
        </div>
      </div>
    </div>
  `,
  styles: [`
    .review-management {
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

    .layout {
      display: grid;
      grid-template-columns: 500px 1fr;
      gap: 2rem;
    }

    .form-card {
      height: fit-content;
      position: sticky;
      top: 80px;

      form {
        display: flex;
        flex-direction: column;
        gap: 1rem;
      }

      mat-form-field {
        width: 100%;
      }

      .form-actions {
        display: flex;
        justify-content: flex-end;
        gap: 1rem;
        margin-top: 1rem;
      }
    }

    .reviews-list {
      h2 {
        font-size: 1.5rem;
        margin-bottom: 1.5rem;
        color: var(--dark);
      }
    }

    .review-card {
      margin-bottom: 1.5rem;

      .review-header {
        width: 100%;

        .rating {
          display: flex;
          gap: 0.25rem;
          margin-top: 0.5rem;

          mat-icon {
            font-size: 1rem;
            width: 1rem;
            height: 1rem;
            color: #ffd700;
          }
        }
      }

      .review-content {
        color: #666;
        line-height: 1.8;
        white-space: pre-line;
      }
    }

    mat-card-actions {
      display: flex;
      gap: 0.5rem;
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

    @media (max-width: 1024px) {
      .layout {
        grid-template-columns: 1fr;
      }

      .form-card {
        position: static;
      }
    }

    @media (max-width: 768px) {
      .page-header h1 {
        font-size: 2rem;
      }

      .form-actions {
        flex-direction: column;

        button {
          width: 100%;
        }
      }
    }
  `]
})
export class ReviewManagementComponent implements OnInit {
  private fb = inject(FormBuilder);
  private reviewService = inject(ReviewService);
  private gymService = inject(GymService);
  private snackBar = inject(MatSnackBar);

  gyms = signal<Gym[]>([]);
  reviews = signal<Review[]>([]);
  editingReview = signal<Review | null>(null);
  loading = false;
  saving = false;

  reviewForm = this.fb.group({
    gymId: [null as number | null, Validators.required],
    rating: [5, [Validators.required, Validators.min(1), Validators.max(5)]],
    authorName: ['Expert Trainer', Validators.required],
    content: ['', [Validators.required, Validators.minLength(100)]]
  });

  ngOnInit(): void {
    this.loadGyms();
    this.loadReviews();
  }

  loadGyms(): void {
    this.gymService.getAll().subscribe(gyms => this.gyms.set(gyms));
  }

  loadReviews(): void {
    this.loading = true;
    this.reviewService.getAll().subscribe({
      next: (reviews) => {
        this.reviews.set(reviews);
        this.loading = false;
      },
      error: () => {
        this.loading = false;
      }
    });
  }

  saveReview(): void {
    if (this.reviewForm.invalid) {
      this.reviewForm.markAllAsTouched();
      return;
    }

    this.saving = true;

    const reviewData: any = {
      gym: { id: this.reviewForm.value.gymId },
      rating: this.reviewForm.value.rating,
      authorName: this.reviewForm.value.authorName,
      content: this.reviewForm.value.content,
      isExpert: true
    };

    const editingId = this.editingReview()?.id;

    if (editingId) {
      this.reviewService.update(editingId, reviewData).subscribe({
        next: () => {
          this.snackBar.open('Review updated successfully!', 'Close', { duration: 3000 });
          this.resetForm();
          this.loadReviews();
          this.saving = false;
        },
        error: () => {
          this.snackBar.open('Failed to update review', 'Close', { duration: 3000 });
          this.saving = false;
        }
      });
    } else {
      this.reviewService.create(reviewData).subscribe({
        next: () => {
          this.snackBar.open('Review created successfully!', 'Close', { duration: 3000 });
          this.resetForm();
          this.loadReviews();
          this.saving = false;
        },
        error: () => {
          this.snackBar.open('Failed to create review', 'Close', { duration: 3000 });
          this.saving = false;
        }
      });
    }
  }

  editReview(review: Review): void {
    this.editingReview.set(review);
    this.reviewForm.patchValue({
      gymId: review.gym.id,
      rating: review.rating,
      authorName: review.authorName,
      content: review.content
    });
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }

  deleteReview(review: Review): void {
    if (!confirm('Are you sure you want to delete this review?')) return;

    this.reviewService.delete(review.id).subscribe({
      next: () => {
        this.snackBar.open('Review deleted', 'Close', { duration: 3000 });
        this.loadReviews();
      },
      error: () => {
        this.snackBar.open('Failed to delete review', 'Close', { duration: 3000 });
      }
    });
  }

  cancelEdit(): void {
    this.resetForm();
  }

  resetForm(): void {
    this.editingReview.set(null);
    this.reviewForm.reset({
      gymId: null,
      rating: 5,
      authorName: 'Expert Trainer',
      content: ''
    });
  }

  getGymName(gymId: number): string {
    return this.gyms().find(g => g.id === gymId)?.name || 'Unknown Gym';
  }

  getStars(rating: number): string[] {
    const stars: string[] = [];
    for (let i = 1; i <= 5; i++) {
      stars.push(i <= rating ? 'star' : 'star_border');
    }
    return stars;
  }
}

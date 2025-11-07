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
import { GymBrandService } from '../../../core/services/gym-brand.service';
import { Review, GymBrand } from '../../../models/review.model';

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
          <mat-card class="form-card">
            <mat-card-header>
              <mat-card-title>{{ editingReview() ? 'Edit Review' : 'Add New Review' }}</mat-card-title>
            </mat-card-header>

            <mat-card-content>
              <form [formGroup]="reviewForm" (ngSubmit)="saveReview()">
                <mat-form-field appearance="outline">
                  <mat-label>Gym Brand</mat-label>
                  <mat-select formControlName="brandId" required>
                    @for (brand of brands(); track brand.id) {
                      <mat-option [value]="brand.id">{{ brand.name }}</mat-option>
                    }
                  </mat-select>
                </mat-form-field>

                <mat-form-field appearance="outline">
                  <mat-label>Rating (1-5)</mat-label>
                  <mat-select formControlName="rating" required>
                    <mat-option [value]="1">1 - Poor</mat-option>
                    <mat-option [value]="2">2 - Fair</mat-option>
                    <mat-option [value]="3">3 - Good</mat-option>
                    <mat-option [value]="4">4 - Very Good</mat-option>
                    <mat-option [value]="5">5 - Excellent</mat-option>
                  </mat-select>
                </mat-form-field>

                <mat-form-field appearance="outline">
                  <mat-label>Rating Decimal (e.g. 4.7)</mat-label>
                  <input matInput type="number" step="0.1" min="1" max="5" formControlName="ratingDecimal" required>
                </mat-form-field>

                <mat-form-field appearance="outline">
                  <mat-label>Price Info</mat-label>
                  <input matInput formControlName="priceInfo" placeholder="€59/month">
                </mat-form-field>

                <mat-form-field appearance="outline">
                  <mat-label>Pros (JSON array)</mat-label>
                  <textarea matInput formControlName="pros" rows="3" placeholder='["Pro 1", "Pro 2"]'></textarea>
                </mat-form-field>

                <mat-form-field appearance="outline">
                  <mat-label>Cons (JSON array)</mat-label>
                  <textarea matInput formControlName="cons" rows="3" placeholder='["Con 1", "Con 2"]'></textarea>
                </mat-form-field>

                <mat-form-field appearance="outline">
                  <mat-label>Author Name</mat-label>
                  <input matInput formControlName="authorName" required>
                </mat-form-field>

                <mat-form-field appearance="outline">
                  <mat-label>Review Content</mat-label>
                  <textarea matInput formControlName="content" rows="10" required></textarea>
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
                          <mat-card-title>{{ getBrandName(review.gymBrand.id) }}</mat-card-title>
                          <mat-card-subtitle>
                            Rating: {{ review.ratingDecimal || review.rating }}/5
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
                  <p>No reviews yet</p>
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
  `]
})
export class ReviewManagementComponent implements OnInit {
  private fb = inject(FormBuilder);
  private reviewService = inject(ReviewService);
  private gymBrandService = inject(GymBrandService);
  private snackBar = inject(MatSnackBar);

  brands = signal<GymBrand[]>([]);
  reviews = signal<Review[]>([]);
  editingReview = signal<Review | null>(null);
  loading = false;
  saving = false;

  reviewForm = this.fb.group({
    brandId: [null as number | null, Validators.required],
    rating: [5, [Validators.required, Validators.min(1), Validators.max(5)]],
    ratingDecimal: [null as number | null, [Validators.required, Validators.min(1), Validators.max(5)]],
    priceInfo: [''],
    pros: [''],
    cons: [''],
    authorName: ['Expert Trainer', Validators.required],
    content: ['', [Validators.required, Validators.minLength(100)]]
  });

  ngOnInit(): void {
    this.loadBrands();
    this.loadReviews();
  }

  loadBrands(): void {
    this.gymBrandService.getAllBrands().subscribe(brands => this.brands.set(brands));
  }

  loadReviews(): void {
    this.loading = true;
    this.reviewService.getAllReviews().subscribe({
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
      gymBrand: { id: this.reviewForm.value.brandId },
      rating: this.reviewForm.value.rating,
      ratingDecimal: this.reviewForm.value.ratingDecimal,
      priceInfo: this.reviewForm.value.priceInfo,
      pros: this.reviewForm.value.pros,
      cons: this.reviewForm.value.cons,
      authorName: this.reviewForm.value.authorName,
      content: this.reviewForm.value.content,
      isExpert: true
    };

    const editingId = this.editingReview()?.id;

    if (editingId) {
      this.reviewService.updateReview(editingId, reviewData).subscribe({
        next: () => {
          this.snackBar.open('Review updated!', 'Close', { duration: 3000 });
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
      this.reviewService.createReview(reviewData).subscribe({
        next: () => {
          this.snackBar.open('Review created!', 'Close', { duration: 3000 });
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
      brandId: review.gymBrand.id,
      rating: review.rating,
      ratingDecimal: review.ratingDecimal,
      priceInfo: review.priceInfo,
      pros: review.pros,
      cons: review.cons,
      authorName: review.authorName,
      content: review.content
    });
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }

  deleteReview(review: Review): void {
    if (!confirm('Delete this review?')) return;

    this.reviewService.deleteReview(review.id).subscribe({
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
      brandId: null,
      rating: 5,
      ratingDecimal: null,
      priceInfo: '',
      pros: '',
      cons: '',
      authorName: 'Expert Trainer',
      content: ''
    });
  }

  getBrandName(brandId: number): string {
    return this.brands().find(b => b.id === brandId)?.name || 'Unknown Brand';
  }
}

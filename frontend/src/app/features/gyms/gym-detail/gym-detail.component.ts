import { Component, inject, OnInit, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute, RouterLink } from '@angular/router';
import { MatCardModule } from '@angular/material/card';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatDividerModule } from '@angular/material/divider';
import { MatChipsModule } from '@angular/material/chips';
import { GymBrandService } from '../../../core/services/gym-brand.service';
import { ReviewService } from '../../../core/services/review.service';
import { GymBrand, Review } from '../../../models/review.model';

@Component({
  selector: 'app-gym-detail',
  standalone: true,
  imports: [
    CommonModule,
    RouterLink,
    MatCardModule,
    MatButtonModule,
    MatIconModule,
    MatDividerModule,
    MatChipsModule
  ],
  template: `
    <div class="gym-detail">
      <div class="container">
        @if (loading) {
          <div class="loading">Loading...</div>
        } @else if (brand()) {
          <button mat-button routerLink="/gyms" class="back-button">
            <mat-icon>arrow_back</mat-icon>
            Back to Brands
          </button>

          <div class="gym-header">
            <div class="gym-image-large">
              <div class="gym-placeholder">
                <mat-icon>fitness_center</mat-icon>
              </div>
            </div>
            <div class="gym-info">
              <h1>{{ brand()!.name }}</h1>
              <p class="locations">
                <mat-icon>location_on</mat-icon>
                {{ brand()!.totalLocations }} locations in Estonia
              </p>
            </div>
          </div>

          <mat-divider></mat-divider>

          <div class="reviews-section">
            <h2>Expert Review</h2>

            @if (reviews().length > 0) {
              @for (review of reviews(); track review.id) {
                <mat-card class="review-card">
                  <mat-card-header>
                    <div class="review-header">
                      <div class="review-author">
                        @if (review.isExpert) {
                          <mat-chip class="expert-badge">
                            <mat-icon>verified</mat-icon>
                            Expert Review
                          </mat-chip>
                        }
                      </div>
                      <div class="review-rating">
                        <strong>{{ review.ratingDecimal || review.rating }}/5</strong>
                        @for (star of getStars(review.rating); track $index) {
                          <mat-icon>{{ star }}</mat-icon>
                        }
                      </div>
                    </div>
                  </mat-card-header>
                  <mat-card-content>
                    @if (review.priceInfo) {
                      <div class="price-section">
                        <mat-icon>payments</mat-icon>
                        <strong>{{ review.priceInfo }}</strong>
                      </div>
                    }

                    @if (review.pros) {
                      <div class="pros-section">
                        <h4>Pros</h4>
                        <ul>
                          @for (pro of parsePros(review.pros); track $index) {
                            <li>{{ pro }}</li>
                          }
                        </ul>
                      </div>
                    }

                    @if (review.cons) {
                      <div class="cons-section">
                        <h4>Cons</h4>
                        <ul>
                          @for (con of parseCons(review.cons); track $index) {
                            <li>{{ con }}</li>
                          }
                        </ul>
                      </div>
                    }

                    <p class="review-content">{{ review.content }}</p>
                    <p class="review-author-name">{{ review.authorName }}</p>
                    <p class="review-date">{{ review.createdAt | date:'MMM dd, yyyy' }}</p>
                  </mat-card-content>
                </mat-card>
              }
            } @else {
              <div class="no-reviews">
                <mat-icon>rate_review</mat-icon>
                <p>No reviews yet</p>
              </div>
            }
          </div>
        }
      </div>
    </div>
  `,
  styles: [`
    .gym-detail {
      padding: 2rem 0;
      min-height: calc(100vh - 64px);
    }

    .back-button {
      margin-bottom: 1rem;
    }

    .gym-header {
      display: grid;
      grid-template-columns: 400px 1fr;
      gap: 2rem;
      margin-bottom: 2rem;
    }

    .gym-image-large {
      width: 100%;
      height: 300px;
      border-radius: 8px;
      overflow: hidden;
    }

    .gym-placeholder {
      width: 100%;
      height: 100%;
      background: linear-gradient(135deg, var(--primary) 0%, var(--accent) 100%);
      display: flex;
      align-items: center;
      justify-content: center;

      mat-icon {
        font-size: 6rem;
        width: 6rem;
        height: 6rem;
        color: white;
      }
    }

    .gym-info {
      h1 {
        font-size: 2.5rem;
        color: var(--dark);
        margin-bottom: 1rem;
      }

      .locations {
        display: flex;
        align-items: center;
        gap: 0.5rem;
        color: #666;
        font-size: 1.125rem;
      }
    }

    mat-divider {
      margin: 2rem 0;
    }

    .reviews-section {
      h2 {
        font-size: 2rem;
        margin-bottom: 1.5rem;
        color: var(--dark);
      }
    }

    .review-card {
      margin-bottom: 1.5rem;
    }

    .review-header {
      display: flex;
      justify-content: space-between;
      align-items: center;
      width: 100%;
      margin-bottom: 1rem;
    }

    .expert-badge {
      background: var(--primary);
      color: white;

      mat-icon {
        color: white;
      }
    }

    .review-rating {
      display: flex;
      gap: 0.5rem;
      align-items: center;

      mat-icon {
        color: #ffd700;
        font-size: 1.5rem;
        width: 1.5rem;
        height: 1.5rem;
      }
    }

    .price-section {
      display: flex;
      align-items: center;
      gap: 0.5rem;
      padding: 1rem;
      background: var(--light);
      border-radius: 8px;
      margin-bottom: 1rem;

      mat-icon {
        color: var(--success);
      }
    }

    .pros-section, .cons-section {
      margin-bottom: 1rem;

      h4 {
        color: var(--dark);
        margin-bottom: 0.5rem;
      }

      ul {
        margin: 0;
        padding-left: 1.5rem;

        li {
          margin-bottom: 0.5rem;
          line-height: 1.6;
        }
      }
    }

    .pros-section {
      ul li {
        color: #2d6a4f;
      }
    }

    .cons-section {
      ul li {
        color: #9d0208;
      }
    }

    .review-content {
      font-size: 1rem;
      line-height: 1.8;
      color: #333;
      margin-bottom: 1rem;
      white-space: pre-line;
    }

    .review-author-name {
      font-weight: 500;
      color: var(--dark);
      margin-bottom: 0.5rem;
    }

    .review-date {
      color: #999;
      font-size: 0.875rem;
    }

    .no-reviews {
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

    .loading {
      text-align: center;
      padding: 4rem 0;
      color: #666;
    }

    @media (max-width: 768px) {
      .gym-header {
        grid-template-columns: 1fr;
      }

      .gym-info h1 {
        font-size: 2rem;
      }

      .review-header {
        flex-direction: column;
        align-items: flex-start;
        gap: 0.5rem;
      }
    }
  `]
})
export class GymDetailComponent implements OnInit {
  private route = inject(ActivatedRoute);
  private gymBrandService = inject(GymBrandService);
  private reviewService = inject(ReviewService);

  brand = signal<GymBrand | null>(null);
  reviews = signal<Review[]>([]);
  loading = false;

  ngOnInit(): void {
    const id = Number(this.route.snapshot.paramMap.get('id'));
    this.loadBrand(id);
    this.loadReviews(id);
  }

  loadBrand(id: number): void {
    this.loading = true;
    this.gymBrandService.getBrandById(id).subscribe({
      next: (brand) => {
        this.brand.set(brand);
        this.loading = false;
      },
      error: () => {
        this.loading = false;
      }
    });
  }

  loadReviews(brandId: number): void {
    this.reviewService.getReviewsByBrandId(brandId).subscribe(reviews => {
      this.reviews.set(reviews);
    });
  }

  getStars(rating: number): string[] {
    const stars: string[] = [];
    for (let i = 1; i <= 5; i++) {
      stars.push(i <= rating ? 'star' : 'star_border');
    }
    return stars;
  }

  parsePros(pros: string): string[] {
    try {
      return JSON.parse(pros);
    } catch {
      return [];
    }
  }

  parseCons(cons: string): string[] {
    try {
      return JSON.parse(cons);
    } catch {
      return [];
    }
  }
}

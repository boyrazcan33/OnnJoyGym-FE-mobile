import { Component, inject, OnInit, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute, RouterLink } from '@angular/router';
import { MatCardModule } from '@angular/material/card';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatDividerModule } from '@angular/material/divider';
import { MatChipsModule } from '@angular/material/chips';
import { GymService } from '../../../core/services/gym.service';
import { ReviewService } from '../../../core/services/review.service';
import { Gym } from '../../../models/gym.model';
import { Review } from '../../../models/review.model';

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
        } @else if (gym()) {
          <button mat-button routerLink="/gyms" class="back-button">
            <mat-icon>arrow_back</mat-icon>
            Back to Gyms
          </button>

          <div class="gym-header">
            <div class="gym-image-large">
              <div class="gym-placeholder">
                <mat-icon>fitness_center</mat-icon>
              </div>
            </div>
            <div class="gym-info">
              <h1>{{ gym()!.name }}</h1>
              <p class="address">
                <mat-icon>location_on</mat-icon>
                {{ gym()!.address }}
              </p>
              <p class="description">{{ gym()!.description }}</p>
            </div>
          </div>

          <mat-divider></mat-divider>

          <div class="reviews-section">
            <h2>Expert Reviews</h2>

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
                        @for (star of getStars(review.rating); track $index) {
                          <mat-icon>{{ star }}</mat-icon>
                        }
                      </div>
                    </div>
                  </mat-card-header>
                  <mat-card-content>
                    <p class="review-content">{{ review.content }}</p>
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

      .address {
        display: flex;
        align-items: center;
        gap: 0.5rem;
        color: #666;
        font-size: 1.125rem;
        margin-bottom: 1rem;
      }

      .description {
        color: #666;
        line-height: 1.6;
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
      gap: 0.25rem;

      mat-icon {
        color: #ffd700;
        font-size: 1.5rem;
        width: 1.5rem;
        height: 1.5rem;
      }
    }

    .review-content {
      font-size: 1rem;
      line-height: 1.8;
      color: #333;
      margin-bottom: 1rem;
      white-space: pre-line;
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
  private gymService = inject(GymService);
  private reviewService = inject(ReviewService);

  gym = signal<Gym | null>(null);
  reviews = signal<Review[]>([]);
  loading = false;

  ngOnInit(): void {
    const id = Number(this.route.snapshot.paramMap.get('id'));
    this.loadGym(id);
    this.loadReviews(id);
  }

  loadGym(id: number): void {
    this.loading = true;
    this.gymService.getById(id).subscribe({
      next: (gym) => {
        this.gym.set(gym);
        this.loading = false;
      },
      error: () => {
        this.loading = false;
      }
    });
  }

  loadReviews(gymId: number): void {
    this.reviewService.getByGymId(gymId).subscribe(reviews => {
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
}

import { Component, inject, OnInit, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router';
import { MatCardModule } from '@angular/material/card';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import { MatFormFieldModule } from '@angular/material/form-field';
import { FormsModule } from '@angular/forms';
import { GymBrandService } from '../../../core/services/gym-brand.service';
import { GymBrand } from '../../../models/review.model';

@Component({
  selector: 'app-gym-list',
  standalone: true,
  imports: [
    CommonModule,
    RouterLink,
    FormsModule,
    MatCardModule,
    MatButtonModule,
    MatIconModule,
    MatInputModule,
    MatFormFieldModule
  ],
  template: `
    <div class="gym-list">
      <div class="container">
        <div class="page-header">
          <h1>Gym Brands in Estonia</h1>
          <p>Expert reviews from NCAA-certified trainer</p>
        </div>

        <mat-form-field appearance="outline" class="search-field">
          <mat-label>Search brands</mat-label>
          <input matInput [(ngModel)]="searchTerm" (ngModelChange)="filterBrands()" placeholder="Brand name...">
          <mat-icon matPrefix>search</mat-icon>
        </mat-form-field>

        @if (loading) {
          <div class="loading">Loading gym brands...</div>
        } @else {
          <div class="gym-grid">
            @for (brand of filteredBrands(); track brand.id) {
              <mat-card class="gym-card" [routerLink]="['/gyms', brand.id]">
                <div class="gym-image">
                  <div class="gym-placeholder">
                    <mat-icon>fitness_center</mat-icon>
                  </div>
                </div>
                <mat-card-header>
                  <mat-card-title>{{ brand.name }}</mat-card-title>
                  <mat-card-subtitle>
                    <mat-icon>location_on</mat-icon>
                    {{ brand.totalLocations }} locations
                  </mat-card-subtitle>
                </mat-card-header>
                <mat-card-actions>
                  <button mat-button color="primary">View Review</button>
                </mat-card-actions>
              </mat-card>
            } @empty {
              <div class="empty-state">
                <mat-icon>search_off</mat-icon>
                <p>No brands found</p>
              </div>
            }
          </div>
        }
      </div>
    </div>
  `,
  styles: [`
    .gym-list {
      padding: 2rem 0;
      min-height: calc(100vh - 64px);
    }

    .page-header {
      text-align: center;
      margin-bottom: 2rem;

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

    .search-field {
      width: 100%;
      max-width: 600px;
      margin: 0 auto 2rem;
      display: block;
    }

    .gym-grid {
      display: grid;
      grid-template-columns: repeat(auto-fill, minmax(300px, 1fr));
      gap: 1.5rem;
    }

    .gym-card {
      cursor: pointer;
      transition: transform 0.3s, box-shadow 0.3s;

      &:hover {
        transform: translateY(-4px);
        box-shadow: 0 8px 24px rgba(0,0,0,0.15);
      }
    }

    .gym-image {
      width: 100%;
      height: 200px;
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
        font-size: 4rem;
        width: 4rem;
        height: 4rem;
        color: white;
      }
    }

    mat-card-header {
      margin: 1rem 0;
    }

    mat-card-subtitle {
      display: flex;
      align-items: center;
      gap: 0.25rem;

      mat-icon {
        font-size: 1rem;
        width: 1rem;
        height: 1rem;
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

    @media (max-width: 768px) {
      .page-header h1 {
        font-size: 2rem;
      }

      .gym-grid {
        grid-template-columns: 1fr;
      }
    }
  `]
})
export class GymListComponent implements OnInit {
  private gymBrandService = inject(GymBrandService);

  brands = signal<GymBrand[]>([]);
  filteredBrands = signal<GymBrand[]>([]);
  loading = false;
  searchTerm = '';

  ngOnInit(): void {
    this.loadBrands();
  }

  loadBrands(): void {
    this.loading = true;
    this.gymBrandService.getAllBrands().subscribe({
      next: (brands) => {
        this.brands.set(brands);
        this.filteredBrands.set(brands);
        this.loading = false;
      },
      error: () => {
        this.loading = false;
      }
    });
  }

  filterBrands(): void {
    const term = this.searchTerm.toLowerCase();
    if (!term) {
      this.filteredBrands.set(this.brands());
      return;
    }

    const filtered = this.brands().filter(brand =>
      brand.name.toLowerCase().includes(term)
    );
    this.filteredBrands.set(filtered);
  }
}

import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatCardModule } from '@angular/material/card';

@Component({
  selector: 'app-landing',
  standalone: true,
  imports: [CommonModule, RouterLink, MatButtonModule, MatIconModule, MatCardModule],
  template: `
    <div class="landing">
      <section class="hero">
        <div class="container hero-content">
          <h1>Find Your Perfect Gym & Training Partner</h1>
          <p>Expert gym reviews, buddy matching, competitions, and personalized workout programs.</p>
          <div class="hero-actions">
            <button mat-raised-button color="primary" routerLink="/register">Get Started</button>
            <button mat-stroked-button routerLink="/gyms">Browse Gyms</button>
          </div>
        </div>
      </section>

      <section class="pillars">
        <div class="container">
          <h2>Four Pillars of Fitness</h2>
          <div class="pillar-grid">
            <mat-card class="pillar-card">
              <mat-icon>fitness_center</mat-icon>
              <h3>Expert Gym Reviews</h3>
              <p>Get honest reviews from NCAA-certified trainers. Know before you go.</p>
            </mat-card>

            <mat-card class="pillar-card">
              <mat-icon>groups</mat-icon>
              <h3>Find Training Buddies</h3>
              <p>Match with like-minded athletes. Train together, grow together.</p>
            </mat-card>

            <mat-card class="pillar-card">
              <mat-icon>emoji_events</mat-icon>
              <h3>Compete & Win</h3>
              <p>Upload your lifts, climb the leaderboard, become the gym champion.</p>
            </mat-card>

            <mat-card class="pillar-card">
              <mat-icon>assignment</mat-icon>
              <h3>Custom Programs</h3>
              <p>Join clubs and get personalized workout programs for your goals.</p>
            </mat-card>
          </div>
        </div>
      </section>

      <section class="cta">
        <div class="container cta-content">
          <h2>Ready to Transform Your Training?</h2>
          <p>Join hundreds of athletes in Estonia's fitness community</p>
          <button mat-raised-button color="primary" routerLink="/register">Join Now</button>
        </div>
      </section>
    </div>
  `,
  styles: [`
    .hero {
      background: linear-gradient(135deg, var(--secondary) 0%, var(--dark) 100%);
      color: white;
      padding: 6rem 0;
      text-align: center;
    }

    .hero-content {
      h1 {
        font-size: 3rem;
        margin-bottom: 1rem;
        font-weight: 700;
      }

      p {
        font-size: 1.25rem;
        margin-bottom: 2rem;
        color: rgba(255,255,255,0.9);
      }
    }

    .hero-actions {
      display: flex;
      gap: 1rem;
      justify-content: center;

      button {
        padding: 0.75rem 2rem;
        font-size: 1rem;
      }
    }

    .pillars {
      padding: 4rem 0;

      h2 {
        text-align: center;
        font-size: 2.5rem;
        margin-bottom: 3rem;
        color: var(--dark);
      }
    }

    .pillar-grid {
      display: grid;
      grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
      gap: 2rem;
    }

    .pillar-card {
      text-align: center;
      padding: 2rem;
      transition: transform 0.3s, box-shadow 0.3s;

      &:hover {
        transform: translateY(-8px);
        box-shadow: 0 8px 24px rgba(0,0,0,0.15);
      }

      mat-icon {
        font-size: 3rem;
        width: 3rem;
        height: 3rem;
        color: var(--primary);
        margin-bottom: 1rem;
      }

      h3 {
        font-size: 1.5rem;
        margin-bottom: 1rem;
        color: var(--dark);
      }

      p {
        color: #666;
      }
    }

    .cta {
      background: var(--primary);
      color: white;
      padding: 4rem 0;
      text-align: center;

      h2 {
        font-size: 2.5rem;
        margin-bottom: 1rem;
      }

      p {
        font-size: 1.25rem;
        margin-bottom: 2rem;
      }

      button {
        background: white;
        color: var(--primary);
        padding: 0.75rem 2rem;
        font-size: 1rem;
      }
    }

    @media (max-width: 768px) {
      .hero-content h1 {
        font-size: 2rem;
      }

      .hero-actions {
        flex-direction: column;
        align-items: center;

        button {
          width: 100%;
          max-width: 300px;
        }
      }

      .pillars h2, .cta h2 {
        font-size: 2rem;
      }
    }
  `]
})
export class LandingComponent {}

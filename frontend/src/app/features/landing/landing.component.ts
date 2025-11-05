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
            <button mat-raised-button color="primary" routerLink="/register">
              <mat-icon>person_add</mat-icon>
              Sign Up
            </button>
            <button mat-raised-button color="accent" routerLink="/login">
              <mat-icon>login</mat-icon>
              Login
            </button>
            <button mat-stroked-button routerLink="/gyms">
              <mat-icon>fitness_center</mat-icon>
              Browse Gyms
            </button>
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

      <section class="features">
        <div class="container">
          <h2>Why Choose OnnJoyGym?</h2>
          <div class="features-grid">
            <div class="feature-item">
              <mat-icon>verified</mat-icon>
              <h4>Verified Reviews</h4>
              <p>All gym reviews are written by certified fitness professionals</p>
            </div>

            <div class="feature-item">
              <mat-icon>psychology</mat-icon>
              <h4>Smart Matching</h4>
              <p>AI-powered algorithm finds your perfect training partner</p>
            </div>

            <div class="feature-item">
              <mat-icon>leaderboard</mat-icon>
              <h4>Real Competition</h4>
              <p>Video-verified lifts ensure fair and honest competition</p>
            </div>

            <div class="feature-item">
              <mat-icon>trending_up</mat-icon>
              <h4>Track Progress</h4>
              <p>Monitor your weekly progress through club programs</p>
            </div>

            <div class="feature-item">
              <mat-icon>telegram</mat-icon>
              <h4>Direct Contact</h4>
              <p>Connect with buddies via Telegram instantly</p>
            </div>

            <div class="feature-item">
              <mat-icon>location_on</mat-icon>
              <h4>Local Focus</h4>
              <p>Find gyms and partners in your area</p>
            </div>
          </div>
        </div>
      </section>

      <section class="stats">
        <div class="container">
          <div class="stats-grid">
            <div class="stat-item">
              <h3>100+</h3>
              <p>Active Users</p>
            </div>
            <div class="stat-item">
              <h3>10+</h3>
              <p>Partner Gyms</p>
            </div>
            <div class="stat-item">
              <h3>50+</h3>
              <p>Training Matches</p>
            </div>
            <div class="stat-item">
              <h3>200+</h3>
              <p>Videos Uploaded</p>
            </div>
          </div>
        </div>
      </section>

      <section class="cta">
        <div class="container cta-content">
          <h2>Ready to Transform Your Training?</h2>
          <p>Join hundreds of athletes in Estonia's premier fitness community</p>
          <div class="cta-buttons">
            <button mat-raised-button color="primary" routerLink="/register">
              <mat-icon>rocket_launch</mat-icon>
              Get Started Free
            </button>
            <button mat-stroked-button routerLink="/leaderboard">
              <mat-icon>emoji_events</mat-icon>
              View Leaderboard
            </button>
          </div>
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
      flex-wrap: wrap;

      button {
        padding: 0.75rem 2rem;
        font-size: 1rem;
        display: flex;
        align-items: center;
        gap: 0.5rem;

        mat-icon {
          font-size: 1.25rem;
          width: 1.25rem;
          height: 1.25rem;
        }
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

    .features {
      padding: 4rem 0;
      background: var(--light);

      h2 {
        text-align: center;
        font-size: 2.5rem;
        margin-bottom: 3rem;
        color: var(--dark);
      }
    }

    .features-grid {
      display: grid;
      grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
      gap: 2rem;
    }

    .feature-item {
      display: flex;
      gap: 1rem;
      padding: 1.5rem;
      background: white;
      border-radius: 8px;
      transition: transform 0.3s;

      &:hover {
        transform: translateX(8px);
      }

      mat-icon {
        font-size: 2.5rem;
        width: 2.5rem;
        height: 2.5rem;
        color: var(--primary);
        flex-shrink: 0;
      }

      h4 {
        margin: 0 0 0.5rem 0;
        color: var(--dark);
      }

      p {
        margin: 0;
        color: #666;
        font-size: 0.875rem;
      }
    }

    .stats {
      padding: 4rem 0;
      background: var(--secondary);
      color: white;
    }

    .stats-grid {
      display: grid;
      grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
      gap: 2rem;
    }

    .stat-item {
      text-align: center;

      h3 {
        font-size: 3rem;
        margin-bottom: 0.5rem;
        color: var(--primary);
        font-weight: bold;
      }

      p {
        font-size: 1.125rem;
        color: rgba(255,255,255,0.9);
      }
    }

    .cta {
      background: linear-gradient(135deg, var(--primary) 0%, var(--accent) 100%);
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
    }

    .cta-buttons {
      display: flex;
      gap: 1rem;
      justify-content: center;
      flex-wrap: wrap;

      button {
        padding: 0.75rem 2rem;
        font-size: 1rem;
        display: flex;
        align-items: center;
        gap: 0.5rem;

        mat-icon {
          font-size: 1.25rem;
          width: 1.25rem;
          height: 1.25rem;
        }

        &[color="primary"] {
          background: white;
          color: var(--primary);
        }

        &[mat-stroked-button] {
          border-color: white;
          color: white;

          &:hover {
            background: rgba(255,255,255,0.1);
          }
        }
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

      .pillars h2, .features h2, .cta h2 {
        font-size: 2rem;
      }

      .pillar-grid, .features-grid {
        grid-template-columns: 1fr;
      }

      .stats-grid {
        grid-template-columns: repeat(2, 1fr);
      }

      .cta-buttons {
        flex-direction: column;
        align-items: center;

        button {
          width: 100%;
          max-width: 300px;
        }
      }
    }
  `]
})
export class LandingComponent {}

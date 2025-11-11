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
          <h1>ELEVATE YOUR FITNESS. ACHIEVE YOUR POTENTIAL.</h1>
          <p>Join Estonia's premier holistic fitness platform. Get accredited insights, find high-fidelity training partners, and earn recognition on verified leaderboards.</p>
          <div class="hero-actions">
            <button mat-raised-button color="primary" routerLink="/register">
              <mat-icon>rocket_launch</mat-icon>
              GET STARTED FREE
            </button>
            <button mat-raised-button color="accent" routerLink="/login">
              <mat-icon>login</mat-icon>
              Login
            </button>
          </div>
        </div>
      </section>

      <section class="pillars">
        <div class="container">
          <h2>Four Pillars of Fitness</h2>
          <div class="pillar-grid">
            <mat-card class="pillar-card">
              <mat-icon>verified</mat-icon>
              <h3>Accredited Gym Intelligence</h3>
              <p>Access unbiased, in-depth reviews from an NCAA Certified Strength Specialist. Make your membership decision with complete confidence, knowing the pros and cons.</p>
            </mat-card>

            <mat-card class="pillar-card">
              <mat-icon>groups</mat-icon>
              <h3>Precision Partner Matching</h3>
              <p>Our algorithm matches you based on 5 key factors (goals, schedule, location, and social style), guaranteeing high compatibility for accelerated progress.</p>
            </mat-card>

            <mat-card class="pillar-card">
              <mat-icon>emoji_events</mat-icon>
              <h3>Verified Leaderboard Supremacy</h3>
              <p>Prove your strength with admin-approved, 3-rep video verification. Compete fairly, build credibility, and claim the top rank in your category.</p>
            </mat-card>

            <mat-card class="pillar-card">
              <mat-icon>assignment</mat-icon>
              <h3>Adaptive Strength Clubs</h3>
              <p>Enroll in goal-focused, progressive programs (e.g., 100kg Bench). Your plan is instantly personalized with recommended weights based on your starting max.</p>
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
              <h4>Unmatched Expertise</h4>
              <p>Content and programs designed or vetted by an 11-Year NCAA Accredited Strength Specialist. You receive a professional-grade strategic advantage.</p>
            </div>

            <div class="feature-item">
              <mat-icon>psychology</mat-icon>
              <h4>Algorithmic Compatibility</h4>
              <p>Our match engine uses five key inputs (including goal, gym, and behavior) to calculate a percentage-based compatibility score (0-100).</p>
            </div>

            <div class="feature-item">
              <mat-icon>leaderboard</mat-icon>
              <h4>Integrity of Lifts</h4>
              <p>Every lift submission must adhere to a strict 3-rep standard (fixed in database and frontend validation) and is subject to manual admin approval for fairness.</p>
            </div>

            <div class="feature-item">
              <mat-icon>trending_up</mat-icon>
              <h4>Personalized Progression</h4>
              <p>Club programs instantly calculate your target working sets based on a percentage of your "Starting Max," ensuring continuous, safe, and effective progressive overload.</p>
            </div>

            <div class="feature-item">
              <mat-icon>telegram</mat-icon>
              <h4>Secure Peer Connection</h4>
              <p>For privacy, the system only shares your Telegram username once a buddy request is mutually accepted, preventing unwanted contact.</p>
            </div>

            <div class="feature-item">
              <mat-icon>location_on</mat-icon>
              <h4>Tallinn Focused Network</h4>
              <p>An actively maintained database of 46 local gym locations (Tallinn, Viimsi, etc.) ensures hyper-local buddy and review relevance.</p>
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
              <h3>46</h3>
              <p>Gym Locations</p>
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
          <h2>JOIN A COMMUNITY OF VERIFIABLE STRENGTH.</h2>
          <p>This isn't just another fitness app. It's the holistic platform designed to find high-compatibility partners, join adaptive strength clubs, and prove your results on a leaderboard built on integrity.</p>
          <div class="cta-buttons">
            <button mat-raised-button color="primary" routerLink="/register">
              <mat-icon>rocket_launch</mat-icon>
              Get Started Free
            </button>
          </div>
        </div>
      </section>
    </div>
  `,
  styles: [`
    .hero {
      /* Renk katmanını (linear-gradient) kaldırdık */
      background: url('/assets/brotherhood.png');

      background-size: 100% 100%;
      /* Resmi ortala */
      background-position: center center;
      background-repeat: no-repeat;
      color: white;
      padding: 6rem 0;
      text-align: center;
    }

    .hero-content {
      h1 {
        font-size: 3rem;
        margin-bottom: 1rem;
        font-weight: 700;
        letter-spacing: 1px;
      }

      p {
        font-size: 1.25rem;
        margin-bottom: 2rem;
        color: rgba(255,255,255,0.9);
        max-width: 800px;
        margin-left: auto;
        margin-right: auto;
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
        line-height: 1.6;
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
        line-height: 1.6;
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
        letter-spacing: 1px;
      }

      p {
        font-size: 1.25rem;
        margin-bottom: 2rem;
        max-width: 700px;
        margin-left: auto;
        margin-right: auto;
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

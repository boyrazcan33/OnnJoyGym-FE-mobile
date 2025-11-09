import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatCardModule } from '@angular/material/card';

@Component({
  selector: 'app-about',
  standalone: true,
  imports: [CommonModule, MatCardModule],
  template: `
    <div class="legal-page">
      <div class="container">
        <mat-card>
          <mat-card-header>
            <mat-card-title>About OnnJoyGym</mat-card-title>
          </mat-card-header>
          <mat-card-content>
            <p>
              Based in Tallinn, Estonia, OnnJoyGym is a comprehensive fitness platform dedicated to providing the tools, intelligence, and community you need to achieve your full potential. We believe in a holistic approach to fitness, combining expert knowledge with social motivation and verifiable achievements.
            </p>

            <h3>Our platform is built on four key pillars:</h3>

            <div class="pillar">
              <h4>Accredited Gym Intelligence</h4>
              <p>
                Make informed decisions. We provide unbiased, in-depth reviews of local gyms, authored by an NCAA Certified Strength Specialist, so you can choose the facility that best fits your goals.
              </p>
            </div>

            <div class="pillar">
              <h4>Precision Partner Matching</h4>
              <p>
                Find your perfect training partner. Our algorithm uses five key factors—fitness goals, location, schedule, social behavior, and experience—to connect you with highly compatible individuals.
              </p>
            </div>

            <div class="pillar">
              <h4>Verified Leaderboard Supremacy</h4>
              <p>
                Prove your strength with integrity. Our leaderboards are built on a strict, admin-approved 3-rep video verification system to ensure fair competition and credible rankings.
              </p>
            </div>

            <div class="pillar">
              <h4>Adaptive Strength Clubs</h4>
              <p>
                Join goal-focused training clubs and receive progressive workout programs. Our system instantly personalizes your plan with recommended weights based on your starting max, ensuring you are always progressing.
              </p>
            </div>

            <p class="closing">
              Join OnnJoyGym and become part of a community where accountability meets measured achievement.
            </p>
          </mat-card-content>
        </mat-card>
      </div>
    </div>
  `,
  styles: [`
    .legal-page {
      padding: 2rem 0;
      min-height: calc(100vh - 64px);
    }

    mat-card {
      max-width: 900px;
      margin: 0 auto;
      padding: 2rem;
    }

    mat-card-title {
      font-size: 2.5rem;
      color: var(--dark);
      margin-bottom: 2rem;
    }

    p {
      line-height: 1.8;
      color: #333;
      margin-bottom: 1.5rem;
    }

    h3 {
      font-size: 1.5rem;
      color: var(--dark);
      margin: 2rem 0 1.5rem 0;
    }

    .pillar {
      margin-bottom: 2rem;
      padding: 1.5rem;
      background: var(--light);
      border-left: 4px solid var(--primary);
      border-radius: 4px;

      h4 {
        font-size: 1.25rem;
        color: var(--primary);
        margin-bottom: 0.75rem;
      }

      p {
        margin: 0;
        color: #555;
      }
    }

    .closing {
      font-weight: 500;
      font-size: 1.125rem;
      text-align: center;
      margin-top: 2rem;
      color: var(--dark);
    }

    @media (max-width: 768px) {
      mat-card {
        margin: 0 1rem;
      }

      mat-card-title {
        font-size: 2rem;
      }
    }
  `]
})
export class AboutComponent {}

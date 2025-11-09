import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatCardModule } from '@angular/material/card';

@Component({
  selector: 'app-privacy',
  standalone: true,
  imports: [CommonModule, MatCardModule],
  template: `
    <div class="legal-page">
      <div class="container">
        <mat-card>
          <mat-card-header>
            <mat-card-title>Privacy Policy</mat-card-title>
            <mat-card-subtitle>Last Updated: November 9, 2025</mat-card-subtitle>
          </mat-card-header>
          <mat-card-content>
            <p>
              OnnJoyGym ("we," "us," or "our") is committed to protecting your privacy. This Privacy Policy explains how we collect, use, disclose, and safeguard your information when you use our platform (the "Service"). This policy is governed by the laws of Estonia and the EU General Data Protection Regulation (GDPR).
            </p>
            <p>
              The data controller for your information is OnnJoyGym, operating from Tallinn, Estonia.
            </p>

            <h3>1. Information We Collect</h3>
            <p>We collect personal data to provide and improve our Service.</p>
            <p>
              <strong>Account Data:</strong> When you register, we collect your email address, (hashed) password, gender, and Telegram username. Your email is used for account verification.
            </p>
            <p>
              <strong>Profile & Preference Data:</strong> You may voluntarily provide information to complete your profile, such as a bio, fitness goals, and experience level. To use the "Training Buddies" feature, you must provide preferences including training goal, preferred gym locations, daily schedule, social behavior, and age range.
            </p>
            <p>
              <strong>User-Generated Content (UGC):</strong> We collect the videos you upload for the Leaderboard, including the video file and associated metadata (e.g., category, weight, reps).
            </p>

            <h3>2. Legal Basis for Processing</h3>
            <p>We process your data based on the following legal grounds:</p>
            <p>
              <strong>Performance of a Contract (Art. 6(1)(b) GDPR):</strong> To provide the core services you requested, such as creating your account, matching you with buddies, and running the training clubs.
            </p>
            <p>
              <strong>Legitimate Interest (Art. 6(1)(f) GDPR):</strong> To moderate content, ensure the security of our platform, and analyze service usage for improvements.
            </p>
            <p>
              <strong>Consent (Art. 6(1)(a) GDPR):</strong> For any non-essential data processing, we will ask for your explicit consent.
            </p>

            <h3>3. How We Use and Share Information</h3>
            <p>Your privacy and safety are paramount. We do not sell your personal data.</p>
            <p>
              <strong>To Provide the Service:</strong> Your data is used to operate the buddy-matching algorithm, personalize club programs, and verify your leaderboard submissions.
            </p>
            <p>
              <strong>Training Buddies:</strong> Your profile preferences are used to calculate match scores. Your Telegram username is only revealed to another user after you have both mutually accepted a buddy request. It is not visible to general users.
            </p>
            <p>
              <strong>Public Content:</strong> Approved leaderboard submissions (including the video, your username, and lift details) are publicly visible.
            </p>
            <p>
              <strong>Service Providers:</strong> We may use third-party companies (e.g., hosting providers) to process your data on our behalf. They are contractually bound to protect your data.
            </p>
            <p>
              <strong>Legal Compliance:</strong> We may disclose your information if required by law or in response to valid requests by public authorities in Estonia.
            </p>

            <h3>4. Data Security & Retention</h3>
            <p>
              We implement reasonable technical and organizational measures to protect your data from unauthorized access, use, or disclosure. We retain your personal data only for as long as necessary to provide the Service, or as required by law.
            </p>

            <h3>5. Your GDPR Rights</h3>
            <p>As a user in the EU, you have the right to:</p>
            <ul>
              <li>Access your personal data.</li>
              <li>Rectify inaccurate information.</li>
              <li>Erase your data (right to be forgotten).</li>
              <li>Restrict processing of your data.</li>
              <li>Data Portability.</li>
              <li>Object to processing.</li>
            </ul>
            <p>To exercise these rights, please contact us at <a href="mailto:tallinntraining@gmail.com">tallinntraining&commat;gmail.com</a>.</p>
            <h3>6. Changes to This Policy</h3>
            <p>We may update this Privacy Policy. We will notify you of any changes by posting the new policy on this page.</p>
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
    }

    mat-card-subtitle {
      font-size: 1rem;
      color: #666;
      margin-top: 0.5rem;
    }

    p {
      line-height: 1.8;
      color: #333;
      margin-bottom: 1rem;
    }

    h3 {
      font-size: 1.5rem;
      color: var(--dark);
      margin: 2rem 0 1rem 0;
    }

    strong {
      color: var(--dark);
    }

    ul {
      margin: 1rem 0;
      padding-left: 2rem;
      line-height: 1.8;

      li {
        margin-bottom: 0.5rem;
        color: #333;
      }
    }

    a {
      color: var(--primary);
      text-decoration: none;

      &:hover {
        text-decoration: underline;
      }
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
export class PrivacyComponent {}

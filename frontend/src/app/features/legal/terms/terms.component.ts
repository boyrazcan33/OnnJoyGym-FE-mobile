import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatCardModule } from '@angular/material/card';

@Component({
  selector: 'app-terms',
  standalone: true,
  imports: [CommonModule, MatCardModule],
  template: `
    <div class="legal-page">
      <div class="container">
        <mat-card>
          <mat-card-header>
            <mat-card-title>Terms of Service</mat-card-title>
            <mat-card-subtitle>Last Updated: November 9, 2025</mat-card-subtitle>
          </mat-card-header>
          <mat-card-content>
            <p>
              These Terms of Service ("Terms") constitute a legally binding agreement between you ("User," "you") and OnnJoyGym ("we," "us," "our") governing your access to and use of our platform and services (the "Service"). By accessing or using the Service, you agree to be bound by these Terms.
            </p>

            <h3>1. IMPORTANT: Health and Safety Disclaimer</h3>
            <p>
              You expressly acknowledge and agree that all fitness, training, and wellness information on the Service, including gym reviews, "Training Club" programs, and expert content, is for informational purposes only.
            </p>
            <p>
              <strong>No Medical Advice:</strong> The Service does not provide medical advice. You must consult with your physician or other qualified healthcare provider before starting any new fitness program or diet.
            </p>
            <p>
              <strong>Assumption of Risk:</strong> You voluntarily assume all known and unknown risks associated with any physical activity or exercise, even if guided by information from the Service.
            </p>
            <p>
              <strong>No Liability for Injury:</strong> OnnJoyGym is not liable for any personal injury, death, or property damage sustained while performing any exercise or activity described or shown on the Service (including user-submitted videos).
            </p>

            <h3>2. User Accounts</h3>
            <p>
              <strong>Eligibility:</strong> You must be at least 16 years of age to create an account.
            </p>
            <p>
              <strong>Accurate Information:</strong> You agree to provide accurate and complete information upon registration, including a valid email address for verification and a valid Telegram username for the buddy feature.
            </p>
            <p>
              <strong>Account Security:</strong> You are solely responsible for all activities that occur under your account.
            </p>

            <h3>3. User-Generated Content (UGC) & Leaderboards</h3>
            <p>
              <strong>License Grant:</strong> By uploading any video, text, or other content ("UGC") to the Service, you grant OnnJoyGym a worldwide, non-exclusive, royalty-free, transferable, and sublicensable license to use, reproduce, modify, display, and distribute your UGC in connection with operating and promoting the Service (e.g., displaying your lift on the public Leaderboard).
            </p>
            <p>
              <strong>Content Moderation:</strong> You acknowledge that OnnJoyGym is a moderated platform. We have the absolute right, but not the obligation, to review, approve, reject, or remove any UGC at our sole discretion. Failure to adhere to submission rules (e.g., 3-rep count, MP4 format, safety standards) will result in rejection.
            </p>
            <p>
              <strong>Your Representations:</strong> You warrant that you own your UGC and that it does not infringe on any third-party rights or contain any unlawful material.
            </p>

            <h3>4. "Training Buddies" Feature</h3>
            <p>
              <strong>Disclaimer:</strong> The "Training Buddies" feature is strictly a platform for connecting users based on self-reported preferences.
            </p>
            <p>
              <strong>No Vetting:</strong> ONNJOYGYM DOES NOT CONDUCT BACKGROUND CHECKS, VERIFY USER IDENTITIES, OR VET USERS IN ANY WAY.
            </p>
            <p>
              <strong>Assumption of Risk:</strong> You are solely responsible for your interactions, both online and offline, with other users. You agree to take all necessary precautions when meeting another user in person.
            </p>
            <p>
              <strong>Release of Liability:</strong> You hereby release OnnJoyGym from all liability related to any interactions, disputes, or incidents between you and other users of the Service.
            </p>

            <h3>5. Prohibited Conduct</h3>
            <p>You agree not to:</p>
            <ul>
              <li>Use the Service for any illegal purpose or in violation of any laws in Estonia or your local jurisdiction.</li>
              <li>Harass, threaten, or stalk other users.</li>
              <li>Submit UGC that is false, misleading, defamatory, obscene, or promotes unsafe fitness practices.</li>
              <li>Scrape, reverse-engineer, or attempt to gain unauthorized access to the Service.</li>
            </ul>

            <h3>6. Termination</h3>
            <p>
              We may terminate or suspend your account at our sole discretion, without notice, for any conduct that we believe violates these Terms.
            </p>

            <h3>7. Disclaimers; No Warranties</h3>
            <p>
              The Service is provided "AS IS" and "AS AVAILABLE" without warranties of any kind. We do not warrant that the Service (including gym reviews or training programs) will be accurate, reliable, uninterrupted, or error-free.
            </p>

            <h3>8. Limitation of Liability</h3>
            <p>
              To the fullest extent permitted by Estonian law, OnnJoyGym shall not be liable for any indirect, incidental, special, consequential, or punitive damages, or any loss of profits or revenues, whether incurred directly or indirectly, or any personal injury, death, or emotional distress arising out of (a) your use of the Service or inability to use the Service; (b) any information or content obtained from the Service; or (c) any conduct, communication, or meeting, whether online or offline, with other users of the Service (including "Training Buddies").
            </p>

            <h3>9. Governing Law</h3>
            <p>
              These Terms shall be governed and construed in accordance with the laws of Estonia, without regard to its conflict of law provisions. Any disputes shall be resolved in the courts of Tallinn, Estonia.
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
export class TermsComponent {}

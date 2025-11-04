import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router';

@Component({
  selector: 'app-footer',
  standalone: true,
  imports: [CommonModule, RouterLink],
  template: `
    <footer class="footer">
      <div class="container footer-content">
        <div class="footer-brand">
          <h3>💪 OnnJoyGym</h3>
          <p>Find your gym, find your tribe, find your strength.</p>
        </div>

        <div class="footer-links">
          <div class="link-group">
            <h4>Product</h4>
            <a routerLink="/gyms">Gyms</a>
            <a routerLink="/leaderboard">Leaderboard</a>
            <a routerLink="/clubs">Clubs</a>
          </div>

          <div class="link-group">
            <h4>Company</h4>
            <a href="#">About</a>
            <a href="#">Privacy</a>
            <a href="#">Terms</a>
          </div>

          <div class="link-group">
            <h4>Contact</h4>
            <a href="https://discord.gg/onjoygym" target="_blank">Discord</a>
            <a href="mailto:info@onjoygym.ee">Email</a>
          </div>
        </div>
      </div>

      <div class="footer-bottom">
        <p>&copy; 2024 OnnJoyGym. All rights reserved.</p>
      </div>
    </footer>
  `,
  styles: [`
    .footer {
      background: var(--dark);
      color: white;
      padding: 3rem 0 1rem;
      margin-top: 4rem;
    }

    .footer-content {
      display: grid;
      grid-template-columns: 2fr 3fr;
      gap: 3rem;
      margin-bottom: 2rem;
    }

    .footer-brand {
      h3 {
        font-size: 1.5rem;
        margin-bottom: 0.5rem;
      }

      p {
        color: rgba(255,255,255,0.7);
      }
    }

    .footer-links {
      display: grid;
      grid-template-columns: repeat(3, 1fr);
      gap: 2rem;
    }

    .link-group {
      h4 {
        margin-bottom: 1rem;
        color: var(--primary);
      }

      a {
        display: block;
        color: rgba(255,255,255,0.7);
        text-decoration: none;
        margin-bottom: 0.5rem;
        transition: color 0.2s;

        &:hover {
          color: var(--primary);
        }
      }
    }

    .footer-bottom {
      text-align: center;
      padding-top: 2rem;
      border-top: 1px solid rgba(255,255,255,0.1);
      color: rgba(255,255,255,0.5);
    }

    @media (max-width: 768px) {
      .footer-content {
        grid-template-columns: 1fr;
        gap: 2rem;
      }

      .footer-links {
        grid-template-columns: 1fr;
      }
    }
  `]
})
export class FooterComponent {}

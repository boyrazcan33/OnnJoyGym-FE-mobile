import { Component, inject, Input } from '@angular/core';
import { Location } from '@angular/common';
import { Router } from '@angular/router';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';

@Component({
  selector: 'app-back-button',
  standalone: true,
  imports: [MatButtonModule, MatIconModule],
  template: `
    <button mat-icon-button (click)="goBack()" class="back-button">
      <mat-icon>arrow_back</mat-icon>
    </button>
  `,
  styles: [`
    .back-button {
      color: var(--primary);
    }
  `]
})
export class BackButtonComponent {
  private location = inject(Location);
  private router = inject(Router);
  
  @Input() fallbackRoute = '/';

  goBack(): void {
    // Check if there's history to go back to
    if (window.history.length > 1) {
      this.location.back();
    } else {
      // Fallback to specified route if no history
      this.router.navigate([this.fallbackRoute]);
    }
  }
}

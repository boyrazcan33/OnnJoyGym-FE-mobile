import { Component, inject, OnInit, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router';
import { MatCardModule } from '@angular/material/card';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatChipsModule } from '@angular/material/chips';
import { MatDialog, MatDialogModule } from '@angular/material/dialog';
import { MatSnackBar } from '@angular/material/snack-bar';
import { MatTabsModule } from '@angular/material/tabs';
import { MatBadgeModule } from '@angular/material/badge';
import { BuddyMatchingService } from '../../../core/services/buddy-matching.service';
import { GymService } from '../../../core/services/gym.service';
import { AuthService } from '../../../core/services/auth.service';
import { BuddyMatchResponse, BuddyRequestResponse } from '../../../models/buddy-match.model';
import { Gym } from '../../../models/gym.model';

@Component({
  selector: 'app-buddy-search',
  standalone: true,
  imports: [
    CommonModule,
    RouterLink,
    MatCardModule,
    MatButtonModule,
    MatIconModule,
    MatChipsModule,
    MatDialogModule,
    MatTabsModule,
    MatBadgeModule
  ],
  template: `
    <div class="buddy-search">
      <div class="container">
        <div class="page-header">
          <h1>Training Buddies</h1>
          <p>Find your perfect training partner based on compatibility</p>
        </div>

        <mat-tab-group [(selectedIndex)]="selectedTab" (selectedIndexChange)="onTabChange($event)">
          <!-- Tab 1: Matches -->
          <mat-tab>
            <ng-template mat-tab-label>
              <mat-icon>person_search</mat-icon>
              <span>Find Matches</span>
            </ng-template>

            <div class="tab-content">
              @if (!userActivated()) {
                <mat-card class="activation-notice">
                  <mat-card-content>
                    <mat-icon>info</mat-icon>
                    <div>
                      <h3>Complete Your Profile First</h3>
                      <p>To find training buddies, you need to set your preferences or upload a video.</p>
                      <div class="action-buttons">
                        <button mat-raised-button color="primary" routerLink="/buddies/preferences">
                          Set Preferences
                        </button>
                        <button mat-button routerLink="/videos/upload">
                          Upload Video
                        </button>
                      </div>
                    </div>
                  </mat-card-content>
                </mat-card>
              } @else {
                @if (loadingMatches) {
                  <div class="loading">Finding your perfect matches...</div>
                } @else {
                  @if (matches().length > 0) {
                    <div class="buddy-grid">
                      @for (match of matches(); track match.userId) {
                        <mat-card class="buddy-card" [class.connected]="match.isConnected">
                          @if (match.isConnected) {
                            <div class="connected-badge">
                              <mat-icon>check_circle</mat-icon>
                              Connected
                            </div>
                          }

                          <div class="match-score">
                            <div class="score-circle" [class]="getScoreClass(match.matchScore)">
                              {{ match.matchScore }}%
                            </div>
                          </div>

                          <div class="buddy-info">
                            <h3>Training Partner</h3>

                            <div class="info-row">
                              <mat-icon>flag</mat-icon>
                              <span>{{ formatField(match.trainingGoal) }}</span>
                            </div>

                            <div class="info-row">
                              <mat-icon>person</mat-icon>
                              <span>{{ formatField(match.gender) }}</span>
                            </div>

                            <div class="info-row">
                              <mat-icon>psychology</mat-icon>
                              <span>{{ formatField(match.socialBehavior) }}</span>
                            </div>

                            <div class="info-row">
                              <mat-icon>cake</mat-icon>
                              <span>{{ match.ageRange }}</span>
                            </div>

                            @if (match.commonGyms.length > 0) {
                              <div class="common-section">
                                <h4>Common Gyms</h4>
                                <div class="chips">
                                  @for (gymId of match.commonGyms; track gymId) {
                                    <mat-chip>{{ getGymName(gymId) }}</mat-chip>
                                  }
                                </div>
                              </div>
                            }

                            @if (match.commonTimeSlots.length > 0) {
                              <div class="common-section">
                                <h4>Common Schedule</h4>
                                <div class="chips">
                                  @for (slot of match.commonTimeSlots; track slot) {
                                    <mat-chip>{{ formatTimeSlot(slot) }}</mat-chip>
                                  }
                                </div>
                              </div>
                            }

                            @if (match.isConnected && match.telegramUsername) {
                              <div class="telegram-info">
                                <mat-icon>telegram</mat-icon>
                                <a [href]="'https://t.me/' + match.telegramUsername.substring(1)" target="_blank">
                                  {{ match.telegramUsername }}
                                </a>
                              </div>
                            }
                          </div>

                          <mat-card-actions>
                            @if (!match.isConnected) {
                              <button mat-raised-button color="primary"
                                      (click)="sendBuddyRequest(match.userId)"
                                      [disabled]="sendingRequest === match.userId">
                                <mat-icon>person_add</mat-icon>
                                {{ sendingRequest === match.userId ? 'Sending...' : 'Send Request' }}
                              </button>
                            } @else {
                              <button mat-button disabled>
                                <mat-icon>check</mat-icon>
                                Already Connected
                              </button>
                            }
                          </mat-card-actions>
                        </mat-card>
                      }
                    </div>
                  } @else {
                    <div class="empty-state">
                      <mat-icon>search_off</mat-icon>
                      <p>No matches found with score above 50%.</p>
                      <button mat-raised-button color="primary" routerLink="/buddies/preferences">
                        Update Preferences
                      </button>
                    </div>
                  }
                }
              }
            </div>
          </mat-tab>

          <!-- Tab 2: Received Requests -->
          <mat-tab>
            <ng-template mat-tab-label>
              <mat-icon [matBadge]="receivedRequests().length"
                        [matBadgeHidden]="receivedRequests().length === 0"
                        matBadgeColor="warn">inbox</mat-icon>
              <span>Received ({{ receivedRequests().length }})</span>
            </ng-template>

            <div class="tab-content">
              @if (loadingRequests) {
                <div class="loading">Loading requests...</div>
              } @else {
                @if (receivedRequests().length > 0) {
                  <div class="requests-list">
                    @for (request of receivedRequests(); track request.requestId) {
                      <mat-card class="request-card">
                        <mat-card-content>
                          <div class="request-info">
                            <div class="avatar">{{ getInitials(request.senderEmail) }}</div>
                            <div>
                              <h4>{{ getUserName(request.senderEmail) }}</h4>
                              <p class="email">{{ request.senderEmail }}</p>
                              <p class="date">{{ request.createdAt | date:'MMM dd, yyyy HH:mm' }}</p>
                            </div>
                          </div>
                        </mat-card-content>
                        <mat-card-actions>
                          <button mat-raised-button color="primary"
                                  (click)="acceptRequest(request.requestId)"
                                  [disabled]="processingRequest === request.requestId">
                            <mat-icon>check</mat-icon>
                            Accept
                          </button>
                          <button mat-button color="warn"
                                  (click)="rejectRequest(request.requestId)"
                                  [disabled]="processingRequest === request.requestId">
                            <mat-icon>close</mat-icon>
                            Reject
                          </button>
                        </mat-card-actions>
                      </mat-card>
                    }
                  </div>
                } @else {
                  <div class="empty-state">
                    <mat-icon>inbox</mat-icon>
                    <p>No pending requests</p>
                  </div>
                }
              }
            </div>
          </mat-tab>

          <!-- Tab 3: Sent Requests -->
          <mat-tab>
            <ng-template mat-tab-label>
              <mat-icon>send</mat-icon>
              <span>Sent ({{ sentRequests().length }})</span>
            </ng-template>

            <div class="tab-content">
              @if (loadingRequests) {
                <div class="loading">Loading requests...</div>
              } @else {
                @if (sentRequests().length > 0) {
                  <div class="requests-list">
                    @for (request of sentRequests(); track request.requestId) {
                      <mat-card class="request-card">
                        <mat-card-content>
                          <div class="request-info">
                            <div class="avatar">{{ getInitials(request.senderEmail) }}</div>
                            <div>
                              <h4>{{ getUserName(request.senderEmail) }}</h4>
                              <p class="email">{{ request.senderEmail }}</p>
                              <p class="date">{{ request.createdAt | date:'MMM dd, yyyy HH:mm' }}</p>
                              <mat-chip [class]="'status-' + request.status.toLowerCase()">
                                {{ request.status }}
                              </mat-chip>
                            </div>
                          </div>
                        </mat-card-content>
                      </mat-card>
                    }
                  </div>
                } @else {
                  <div class="empty-state">
                    <mat-icon>send</mat-icon>
                    <p>No sent requests</p>
                  </div>
                }
              }
            </div>
          </mat-tab>

          <!-- Tab 4: Connections -->
          <mat-tab>
            <ng-template mat-tab-label>
              <mat-icon>group</mat-icon>
              <span>Connections ({{ connections().length }})</span>
            </ng-template>

            <div class="tab-content">
              @if (loadingRequests) {
                <div class="loading">Loading connections...</div>
              } @else {
                @if (connections().length > 0) {
                  <div class="connections-grid">
                    @for (connection of connections(); track connection.requestId) {
                      <mat-card class="connection-card">
                        <div class="avatar-large">{{ getInitials(connection.senderEmail) }}</div>
                        <h3>{{ getUserName(connection.senderEmail) }}</h3>
                        <p class="email">{{ connection.senderEmail }}</p>

                        @if (connection.telegramUsername) {
                          <div class="telegram-contact">
                            <mat-icon>telegram</mat-icon>
                            <a [href]="'https://t.me/' + connection.telegramUsername.substring(1)" target="_blank">
                              {{ connection.telegramUsername }}
                            </a>
                          </div>
                        }

                        <p class="connected-date">
                          Connected: {{ connection.createdAt | date:'MMM dd, yyyy' }}
                        </p>
                      </mat-card>
                    }
                  </div>
                } @else {
                  <div class="empty-state">
                    <mat-icon>group</mat-icon>
                    <p>No connections yet</p>
                    <button mat-raised-button color="primary" (click)="selectedTab = 0">
                      Find Matches
                    </button>
                  </div>
                }
              }
            </div>
          </mat-tab>
        </mat-tab-group>
      </div>
    </div>
  `,
  styles: [`
    .buddy-search {
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

    .tab-content {
      padding: 2rem 0;
    }

    .activation-notice {
      text-align: center;
      padding: 2rem;
      background: linear-gradient(135deg, #fff3cd 0%, #fff9e6 100%);

      mat-card-content {
        display: flex;
        flex-direction: column;
        align-items: center;
        gap: 1rem;

        mat-icon {
          font-size: 3rem;
          width: 3rem;
          height: 3rem;
          color: #856404;
        }

        h3 {
          margin: 0;
          color: #856404;
        }

        p {
          margin: 0;
          color: #856404;
        }

        .action-buttons {
          display: flex;
          gap: 1rem;
          margin-top: 1rem;
        }
      }
    }

    .buddy-grid {
      display: grid;
      grid-template-columns: repeat(auto-fill, minmax(350px, 1fr));
      gap: 1.5rem;
    }

    .buddy-card {
      position: relative;
      transition: transform 0.3s, box-shadow 0.3s;

      &:hover {
        transform: translateY(-4px);
        box-shadow: 0 8px 24px rgba(0,0,0,0.15);
      }

      &.connected {
        border: 2px solid var(--success);
      }
    }

    .connected-badge {
      position: absolute;
      top: 1rem;
      right: 1rem;
      background: var(--success);
      color: white;
      padding: 0.5rem 1rem;
      border-radius: 20px;
      display: flex;
      align-items: center;
      gap: 0.5rem;
      font-size: 0.875rem;
      font-weight: 500;

      mat-icon {
        font-size: 1rem;
        width: 1rem;
        height: 1rem;
      }
    }

    .match-score {
      text-align: center;
      margin: 1rem 0;
    }

    .score-circle {
      width: 80px;
      height: 80px;
      border-radius: 50%;
      display: inline-flex;
      align-items: center;
      justify-content: center;
      font-size: 1.5rem;
      font-weight: bold;
      color: white;

      &.score-excellent {
        background: linear-gradient(135deg, #06d6a0, #00b894);
      }

      &.score-good {
        background: linear-gradient(135deg, #f77f00, #ff9500);
      }

      &.score-fair {
        background: linear-gradient(135deg, #ffd60a, #ffc300);
      }
    }

    .buddy-info {
      padding: 1rem 0;

      h3 {
        margin-bottom: 1rem;
        color: var(--dark);
      }
    }

    .info-row {
      display: flex;
      align-items: center;
      gap: 0.5rem;
      margin-bottom: 0.75rem;
      color: #666;

      mat-icon {
        color: var(--primary);
        font-size: 1.25rem;
        width: 1.25rem;
        height: 1.25rem;
      }
    }

    .common-section {
      margin-top: 1rem;
      padding-top: 1rem;
      border-top: 1px solid #e0e0e0;

      h4 {
        font-size: 0.875rem;
        color: #666;
        margin-bottom: 0.5rem;
      }

      .chips {
        display: flex;
        flex-wrap: wrap;
        gap: 0.5rem;
      }
    }

    .telegram-info {
      display: flex;
      align-items: center;
      gap: 0.5rem;
      margin-top: 1rem;
      padding: 0.75rem;
      background: #0088cc;
      border-radius: 8px;
      color: white;

      mat-icon {
        color: white;
      }

      a {
        color: white;
        text-decoration: none;
        font-weight: 500;

        &:hover {
          text-decoration: underline;
        }
      }
    }

    .requests-list {
      display: flex;
      flex-direction: column;
      gap: 1rem;
      max-width: 800px;
      margin: 0 auto;
    }

    .request-card {
      .request-info {
        display: flex;
        align-items: center;
        gap: 1rem;

        .avatar {
          width: 50px;
          height: 50px;
          border-radius: 50%;
          background: var(--primary);
          display: flex;
          align-items: center;
          justify-content: center;
          font-weight: bold;
          color: white;
        }

        h4 {
          margin: 0;
          color: var(--dark);
        }

        .email {
          margin: 0.25rem 0;
          color: #666;
          font-size: 0.875rem;
        }

        .date {
          margin: 0;
          color: #999;
          font-size: 0.75rem;
        }

        mat-chip {
          margin-top: 0.5rem;

          &.status-pending {
            background: #ffc107;
          }

          &.status-accepted {
            background: var(--success);
            color: white;
          }

          &.status-rejected {
            background: #ef476f;
            color: white;
          }
        }
      }
    }

    mat-card-actions {
      display: flex;
      gap: 0.5rem;
      padding: 1rem;
    }

    .connections-grid {
      display: grid;
      grid-template-columns: repeat(auto-fill, minmax(250px, 1fr));
      gap: 1.5rem;
    }

    .connection-card {
      text-align: center;
      padding: 1.5rem;

      .avatar-large {
        width: 80px;
        height: 80px;
        border-radius: 50%;
        background: var(--primary);
        display: flex;
        align-items: center;
        justify-content: center;
        font-size: 2rem;
        font-weight: bold;
        color: white;
        margin: 0 auto 1rem;
      }

      h3 {
        margin: 0.5rem 0;
        color: var(--dark);
      }

      .email {
        color: #666;
        font-size: 0.875rem;
        margin-bottom: 1rem;
      }

      .telegram-contact {
        display: inline-flex;
        align-items: center;
        gap: 0.5rem;
        padding: 0.5rem 1rem;
        background: #0088cc;
        border-radius: 20px;
        color: white;
        margin-bottom: 1rem;

        mat-icon {
          color: white;
          font-size: 1.25rem;
          width: 1.25rem;
          height: 1.25rem;
        }

        a {
          color: white;
          text-decoration: none;
          font-weight: 500;
        }
      }

      .connected-date {
        color: #999;
        font-size: 0.75rem;
        margin: 0;
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

      p {
        margin-bottom: 1.5rem;
      }
    }

    @media (max-width: 768px) {
      .page-header h1 {
        font-size: 2rem;
      }

      .buddy-grid, .connections-grid {
        grid-template-columns: 1fr;
      }

      mat-card-actions {
        flex-direction: column;

        button {
          width: 100%;
        }
      }
    }
  `]
})
export class BuddySearchComponent implements OnInit {
  private buddyService = inject(BuddyMatchingService);
  private gymService = inject(GymService);
  private authService = inject(AuthService);
  private snackBar = inject(MatSnackBar);

  matches = signal<BuddyMatchResponse[]>([]);
  receivedRequests = signal<BuddyRequestResponse[]>([]);
  sentRequests = signal<BuddyRequestResponse[]>([]);
  connections = signal<BuddyRequestResponse[]>([]);
  gyms = signal<Gym[]>([]);

  userActivated = signal(false);
  loadingMatches = false;
  loadingRequests = false;
  sendingRequest: number | null = null;
  processingRequest: number | null = null;
  selectedTab = 0;

  ngOnInit(): void {
    this.checkUserActivation();
    this.loadGyms();
    this.loadMatches();
    this.loadRequests();
  }

  checkUserActivation(): void {
    const user = this.authService.currentUser();
    if (user) {
      this.userActivated.set(user.isActivated || false);
    }
  }

  loadGyms(): void {
    this.gymService.getAll().subscribe(gyms => this.gyms.set(gyms));
  }

  loadMatches(): void {
    const user = this.authService.currentUser();
    if (!user || !this.userActivated()) return;

    this.loadingMatches = true;
    this.buddyService.findMatches(user.id).subscribe({
      next: (matches) => {
        this.matches.set(matches);
        this.loadingMatches = false;
      },
      error: () => {
        this.loadingMatches = false;
        this.snackBar.open('Failed to load matches', 'Close', { duration: 3000 });
      }
    });
  }

  loadRequests(): void {
    const user = this.authService.currentUser();
    if (!user) return;

    this.loadingRequests = true;

    // Load received requests
    this.buddyService.getReceivedRequests(user.id).subscribe({
      next: (requests) => {
        this.receivedRequests.set(requests);
      }
    });

    // Load sent requests
    this.buddyService.getSentRequests(user.id).subscribe({
      next: (requests) => {
        this.sentRequests.set(requests);
      }
    });

    // Load connections
    this.buddyService.getAcceptedConnections(user.id).subscribe({
      next: (connections) => {
        this.connections.set(connections);
        this.loadingRequests = false;
      },
      error: () => {
        this.loadingRequests = false;
      }
    });
  }

  sendBuddyRequest(receiverId: number): void {
    const user = this.authService.currentUser();
    if (!user) return;

    this.sendingRequest = receiverId;

    this.buddyService.sendRequest({
      senderId: user.id,
      receiverId: receiverId
    }).subscribe({
      next: () => {
        this.snackBar.open('Request sent!', 'Close', { duration: 3000 });
        this.sendingRequest = null;
        this.loadMatches();
        this.loadRequests();
      },
      error: (err) => {
        this.sendingRequest = null;
        this.snackBar.open(err.error?.message || 'Failed to send request', 'Close', { duration: 3000 });
      }
    });
  }

  acceptRequest(requestId: number): void {
    this.processingRequest = requestId;

    this.buddyService.acceptRequest(requestId).subscribe({
      next: () => {
        this.snackBar.open('Request accepted!', 'Close', { duration: 3000 });
        this.processingRequest = null;
        this.loadRequests();
        this.loadMatches();
      },
      error: () => {
        this.processingRequest = null;
        this.snackBar.open('Failed to accept request', 'Close', { duration: 3000 });
      }
    });
  }

  rejectRequest(requestId: number): void {
    this.processingRequest = requestId;

    this.buddyService.rejectRequest(requestId).subscribe({
      next: () => {
        this.snackBar.open('Request rejected', 'Close', { duration: 3000 });
        this.processingRequest = null;
        this.loadRequests();
      },
      error: () => {
        this.processingRequest = null;
        this.snackBar.open('Failed to reject request', 'Close', { duration: 3000 });
      }
    });
  }

  onTabChange(index: number): void {
    if (index > 0) {
      this.loadRequests();
    }
  }

  getGymName(gymId: number): string {
    return this.gyms().find(g => g.id === gymId)?.name || 'Unknown Gym';
  }

  formatField(value: string): string {
    if (!value) return '';
    return value.split('_').map(word =>
      word.charAt(0) + word.slice(1).toLowerCase()
    ).join(' ');
  }

  formatTimeSlot(slot: string): string {
    const slots: Record<string, string> = {
      'EARLY_MORNING': 'Early Morning (5-8 AM)',
      'MORNING': 'Morning (8-12 PM)',
      'AFTERNOON': 'Afternoon (12-5 PM)',
      'EVENING': 'Evening (5-9 PM)',
      'NIGHT': 'Night (9 PM-12 AM)'
    };
    return slots[slot] || slot;
  }

  getScoreClass(score: number): string {
    if (score >= 75) return 'score-excellent';
    if (score >= 60) return 'score-good';
    return 'score-fair';
  }

  getInitials(email: string): string {
    return email.substring(0, 2).toUpperCase();
  }

  getUserName(email: string): string {
    return email.split('@')[0];
  }
}

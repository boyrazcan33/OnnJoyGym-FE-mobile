import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../../environments/environment';
import { BuddyMatchRequest, BuddyMatchResponse, BuddySendRequest, BuddyRequestResponse } from '../../models/buddy-match.model';

@Injectable({ providedIn: 'root' })
export class BuddyMatchingService {
  private http = inject(HttpClient);
  private apiUrl = `${environment.apiUrl}/buddies`;

  saveBuddyPreferences(data: BuddyMatchRequest): Observable<any> {
    return this.http.post(`${this.apiUrl}/preferences`, data);
  }

  findMatches(userId: number): Observable<BuddyMatchResponse[]> {
    return this.http.get<BuddyMatchResponse[]>(`${this.apiUrl}/match/${userId}`);
  }

  sendRequest(data: BuddySendRequest): Observable<BuddyRequestResponse> {
    return this.http.post<BuddyRequestResponse>(`${this.apiUrl}/requests/send`, data);
  }

  acceptRequest(requestId: number): Observable<BuddyRequestResponse> {
    return this.http.put<BuddyRequestResponse>(`${this.apiUrl}/requests/${requestId}/accept`, {});
  }

  rejectRequest(requestId: number): Observable<BuddyRequestResponse> {
    return this.http.put<BuddyRequestResponse>(`${this.apiUrl}/requests/${requestId}/reject`, {});
  }

  getReceivedRequests(userId: number): Observable<BuddyRequestResponse[]> {
    return this.http.get<BuddyRequestResponse[]>(`${this.apiUrl}/requests/received/${userId}`);
  }

  getSentRequests(userId: number): Observable<BuddyRequestResponse[]> {
    return this.http.get<BuddyRequestResponse[]>(`${this.apiUrl}/requests/sent/${userId}`);
  }

  getAcceptedConnections(userId: number): Observable<BuddyRequestResponse[]> {
    return this.http.get<BuddyRequestResponse[]>(`${this.apiUrl}/connections/${userId}`);
  }
}

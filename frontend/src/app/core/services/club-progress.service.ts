import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../../environments/environment';
import { ClubProgress } from '../../models/club-progress.model';

@Injectable({ providedIn: 'root' })
export class ClubProgressService {
  private http = inject(HttpClient);
  private apiUrl = `${environment.apiUrl}/clubs`;

  joinClubWithProgress(userId: number, clubId: number, startingMax: number): Observable<ClubProgress> {
    return this.http.post<ClubProgress>(`${this.apiUrl}/${clubId}/join/${userId}`, { startingMax });
  }

  getCurrentProgress(clubId: number, userId: number): Observable<ClubProgress> {
    return this.http.get<ClubProgress>(`${this.apiUrl}/${clubId}/progress/${userId}`);
  }

  getUserClubProgress(userId: number): Observable<ClubProgress[]> {
    return this.http.get<ClubProgress[]>(`${this.apiUrl}/progress/${userId}`);
  }

  completeWeek(userId: number, clubId: number): Observable<ClubProgress> {
    return this.http.post<ClubProgress>(`${this.apiUrl}/${clubId}/complete-week/${userId}`, {});
  }
}

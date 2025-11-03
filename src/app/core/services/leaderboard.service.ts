import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../../environments/environment';
import { Leaderboard } from '../../models/leaderboard.model';

@Injectable({ providedIn: 'root' })
export class LeaderboardService {
  private http = inject(HttpClient);
  private apiUrl = `${environment.apiUrl}/leaderboard`;

  getByGym(gymId: number): Observable<Leaderboard[]> {
    return this.http.get<Leaderboard[]>(`${this.apiUrl}/gym/${gymId}`);
  }

  getByGymAndCategory(gymId: number, category: string): Observable<Leaderboard[]> {
    return this.http.get<Leaderboard[]>(`${this.apiUrl}/gym/${gymId}/category/${category}`);
  }

  getAll(): Observable<Leaderboard[]> {
    return this.http.get<Leaderboard[]>(this.apiUrl);
  }
}

import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../../environments/environment';
import { Leaderboard } from '../../models/leaderboard.model';

@Injectable({ providedIn: 'root' })
export class LeaderboardService {
  private http = inject(HttpClient);
  private apiUrl = `${environment.apiUrl}/leaderboard`;

  getByGym(gymId: number, gender?: string): Observable<Leaderboard[]> {
    const params: any = {};
    if (gender) {
      params.gender = gender;
    }
    return this.http.get<Leaderboard[]>(`${this.apiUrl}/gym/${gymId}`, { params });
  }

  getByGymAndCategory(gymId: number, category: string, gender?: string): Observable<Leaderboard[]> {
    const params: any = {};
    if (gender) {
      params.gender = gender;
    }
    return this.http.get<Leaderboard[]>(`${this.apiUrl}/gym/${gymId}/category/${category}`, { params });
  }

  getAll(gender?: string): Observable<Leaderboard[]> {
    const params: any = {};
    if (gender) {
      params.gender = gender;
    }
    return this.http.get<Leaderboard[]>(this.apiUrl, { params });
  }
}

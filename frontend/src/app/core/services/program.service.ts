import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../../environments/environment';
import { WeeklyProgram } from '../../models/program.model';

@Injectable({ providedIn: 'root' })
export class ProgramService {
  private http = inject(HttpClient);
  private apiUrl = `${environment.apiUrl}/programs`;

  getWeekly(userId: number, clubId: number): Observable<WeeklyProgram> {
    return this.http.get<WeeklyProgram>(`${this.apiUrl}/weekly`, {
      params: { userId, clubId }
    });
  }
}

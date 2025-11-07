import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../../environments/environment';
import { WeeklyProgramDTO } from '../../models/program.model';

@Injectable({ providedIn: 'root' })
export class ProgramService {
  private http = inject(HttpClient);
  private apiUrl = `${environment.apiUrl}/programs`;

  getWeeklyProgram(userId: number, clubId: number): Observable<WeeklyProgramDTO[]> {
    return this.http.get<WeeklyProgramDTO[]>(`${this.apiUrl}/weekly`, {
      params: {
        userId: userId.toString(),
        clubId: clubId.toString()
      }
    });
  }
}

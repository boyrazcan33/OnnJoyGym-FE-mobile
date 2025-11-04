import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../../environments/environment';
import { Club } from '../../models/club.model';

@Injectable({ providedIn: 'root' })
export class ClubService {
  private http = inject(HttpClient);
  private apiUrl = `${environment.apiUrl}/clubs`;

  getAll(): Observable<Club[]> {
    return this.http.get<Club[]>(this.apiUrl);
  }

  getById(id: number): Observable<Club> {
    return this.http.get<Club>(`${this.apiUrl}/${id}`);
  }
}

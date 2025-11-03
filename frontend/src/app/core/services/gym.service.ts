import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../../environments/environment';
import { Gym } from '../../models/gym.model';

@Injectable({ providedIn: 'root' })
export class GymService {
  private http = inject(HttpClient);
  private apiUrl = `${environment.apiUrl}/gyms`;

  getAll(): Observable<Gym[]> {
    return this.http.get<Gym[]>(this.apiUrl);
  }

  getById(id: number): Observable<Gym> {
    return this.http.get<Gym>(`${this.apiUrl}/${id}`);
  }

  create(gym: Partial<Gym>): Observable<Gym> {
    return this.http.post<Gym>(this.apiUrl, gym);
  }

  update(id: number, gym: Partial<Gym>): Observable<Gym> {
    return this.http.put<Gym>(`${this.apiUrl}/${id}`, gym);
  }

  delete(id: number): Observable<void> {
    return this.http.delete<void>(`${this.apiUrl}/${id}`);
  }
}

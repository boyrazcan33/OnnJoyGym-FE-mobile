import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../../environments/environment';
import { User } from '../../models/user.model';

@Injectable({ providedIn: 'root' })
export class UserService {
  private http = inject(HttpClient);
  private apiUrl = `${environment.apiUrl}/users`;

  getProfile(id: number): Observable<User> {
    return this.http.get<User>(`${this.apiUrl}/${id}/profile`);
  }

  updateProfile(id: number, data: Partial<User>): Observable<User> {
    return this.http.put<User>(`${this.apiUrl}/${id}/profile`, data);
  }

  joinClub(userId: number, clubId: number): Observable<any> {
    return this.http.post(`${this.apiUrl}/${userId}/clubs/${clubId}/join`, {});
  }

  leaveClub(userId: number, clubId: number): Observable<void> {
    return this.http.delete<void>(`${this.apiUrl}/${userId}/clubs/${clubId}/leave`);
  }

  searchUsers(filters: any): Observable<User[]> {
    return this.http.get<User[]>(`${this.apiUrl}/search`, { params: filters });
  }
}

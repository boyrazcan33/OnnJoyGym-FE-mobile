import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../../environments/environment';
import { Video } from '../../models/video.model';

@Injectable({ providedIn: 'root' })
export class VideoService {
  private http = inject(HttpClient);
  private apiUrl = `${environment.apiUrl}/videos`;

  getUploadUrl(data: any): Observable<any> {
    return this.http.post(`${this.apiUrl}/upload-url`, data);
  }

  getMyVideos(userId: number): Observable<Video[]> {
    return this.http.get<Video[]>(`${this.apiUrl}/my-videos`, { params: { userId } });
  }

  getPending(): Observable<Video[]> {
    return this.http.get<Video[]>(`${this.apiUrl}/pending`);
  }

  approve(id: number): Observable<Video> {
    return this.http.put<Video>(`${this.apiUrl}/${id}/approve`, {});
  }

  reject(id: number, reason: string): Observable<Video> {
    return this.http.put<Video>(`${this.apiUrl}/${id}/reject`, { reason });
  }
}

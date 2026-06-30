import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../../environments/environment';
import { UserCommentRequest } from '../../models/review.model';

@Injectable({ providedIn: 'root' })
export class UserCommentService {
  private http = inject(HttpClient);
  private apiUrl = `${environment.apiUrl}/user-comments`;

  submitComment(request: UserCommentRequest): Observable<{ message: string }> {
    return this.http.post<{ message: string }>(this.apiUrl, request);
  }
}

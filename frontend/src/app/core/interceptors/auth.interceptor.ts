import { HttpInterceptorFn } from '@angular/common/http';
import { inject } from '@angular/core';
import { from, switchMap } from 'rxjs';
import { AuthService } from '../services/auth.service';

export const authInterceptor: HttpInterceptorFn = (req, next) => {
  const authService = inject(AuthService);

  // ✅ CRITICAL: Skip auth header for S3 pre-signed URLs
  const isS3Upload = req.url.includes('amazonaws.com') ||
    req.url.includes('s3.') ||
    req.url.includes('.s3.');

  // If it's an S3 request, pass through without modification
  if (isS3Upload) {
    console.log('🚫 Skipping auth header for S3 upload:', req.url);
    return next(req);
  }

  // For all other requests, add JWT token (async)
  return from(authService.getToken()).pipe(
    switchMap(token => {
      if (token) {
        req = req.clone({
          setHeaders: {
            Authorization: `Bearer ${token}`
          }
        });
      }
      return next(req);
    })
  );
};

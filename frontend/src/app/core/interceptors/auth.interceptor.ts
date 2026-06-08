import { HttpInterceptorFn } from '@angular/common/http';
import { inject } from '@angular/core';
import { AuthService } from '../services/auth.service';

export const authInterceptor: HttpInterceptorFn = (req, next) => {
  const authService = inject(AuthService);

  // ✅ CRITICAL: Skip auth header for S3 pre-signed URLs
  const isS3Upload = req.url.includes('amazonaws.com') ||
    req.url.includes('s3.') ||
    req.url.includes('.s3.');

  if (isS3Upload) {
    return next(req);
  }

  // For all other requests, add JWT token
  const token = authService.getToken();
  if (token) {
    req = req.clone({
      setHeaders: {
        Authorization: `Bearer ${token}`
      }
    });
  }

  return next(req);
};

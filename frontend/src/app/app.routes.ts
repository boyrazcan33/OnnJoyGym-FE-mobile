import { Routes } from '@angular/router';
import { authGuard } from './core/guards/auth.guard';
import { adminGuard } from './core/guards/admin.guard';

export const routes: Routes = [
  {
    path: '',
    loadComponent: () => import('./features/landing/landing.component').then(m => m.LandingComponent)
  },
  {
    path: 'login',
    loadComponent: () => import('./features/auth/login/login.component').then(m => m.LoginComponent)
  },
  {
    path: 'register',
    loadComponent: () => import('./features/auth/register/register.component').then(m => m.RegisterComponent)
  },
  {
    path: 'verify-email',
    loadComponent: () => import('./features/auth/email-verification/email-verification.component').then(m => m.EmailVerificationComponent)
  },
  {
    path: 'about',
    loadComponent: () => import('./features/legal/about/about.component').then(m => m.AboutComponent)
  },
  {
    path: 'privacy',
    loadComponent: () => import('./features/legal/privacy/privacy.component').then(m => m.PrivacyComponent)
  },
  {
    path: 'terms',
    loadComponent: () => import('./features/legal/terms/terms.component').then(m => m.TermsComponent)
  },
  {
    path: 'gyms',
    loadComponent: () => import('./features/gyms/gym-list/gym-list.component').then(m => m.GymListComponent)
  },
  {
    path: 'gyms/:id',
    loadComponent: () => import('./features/gyms/gym-detail/gym-detail.component').then(m => m.GymDetailComponent)
  },
  {
    path: 'dashboard',
    canActivate: [authGuard],
    loadComponent: () => import('./features/dashboard/dashboard.component').then(m => m.DashboardComponent)
  },
  {
    path: 'profile',
    canActivate: [authGuard],
    loadComponent: () => import('./features/profile/profile.component').then(m => m.ProfileComponent)
  },
  {
    path: 'buddies',
    canActivate: [authGuard],
    children: [
      {
        path: '',
        redirectTo: 'search',
        pathMatch: 'full'
      },
      {
        path: 'search',
        loadComponent: () => import('./features/buddies/buddy-search/buddy-search.component').then(m => m.BuddySearchComponent)
      },
      {
        path: 'preferences',
        loadComponent: () => import('./features/buddies/buddy-preferences/buddy-preferences.component').then(m => m.BuddyPreferencesComponent)
      }
    ]
  },
  {
    path: 'clubs',
    canActivate: [authGuard],
    loadComponent: () => import('./features/clubs/club-list/club-list.component').then(m => m.ClubListComponent)
  },
  {
    path: 'leaderboard',
    loadComponent: () => import('./features/leaderboard/leaderboard.component').then(m => m.LeaderboardComponent)
  },
  {
    path: 'videos/upload',
    canActivate: [authGuard],
    loadComponent: () => import('./features/videos/video-upload/video-upload.component').then(m => m.VideoUploadComponent)
  },
  {
    path: 'admin',
    canActivate: [authGuard, adminGuard],
    children: [
      {
        path: '',
        redirectTo: 'videos',
        pathMatch: 'full'
      },
      {
        path: 'videos',
        loadComponent: () => import('./features/admin/video-moderation/video-moderation.component').then(m => m.VideoModerationComponent)
      },
      {
        path: 'reviews',
        loadComponent: () => import('./features/admin/review-management/review-management.component').then(m => m.ReviewManagementComponent)
      }
    ]
  },
  {
    path: '**',
    redirectTo: ''
  }
];

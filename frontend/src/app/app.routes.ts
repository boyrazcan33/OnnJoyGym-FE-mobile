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
    loadComponent: () => import('./features/buddies/buddy-search/buddy-search.component').then(m => m.BuddySearchComponent)
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

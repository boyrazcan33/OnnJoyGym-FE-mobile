export interface User {
  id: number;
  email: string;
  username?: string;
  role: string;
  bio?: string;
  goals?: string;
  experience?: string;
  gymPreference?: number;

  // Buddy Matching Fields
  trainingGoal?: string;
  gender?: string;
  preferredLocations?: string;
  dailySchedule?: string;
  socialBehavior?: string;
  ageRange?: string;
  telegramUsername?: string;
  isActivated: boolean;
  emailVerified?: boolean;

  createdAt: string;
  updatedAt: string;
}

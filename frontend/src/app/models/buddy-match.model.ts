export interface BuddyMatchRequest {
  userId: number;
  preferredLocations: number[];
  dailySchedule: string[];
}

export interface BuddyMatchResponse {
  userId: number;
  trainingGoal: string;
  gender: string;
  socialBehavior: string;
  ageRange: string;
  commonTimeSlots: string[];
  commonGyms: number[];
  matchScore: number;
  telegramUsername?: string;
  isConnected: boolean;
}

export interface BuddySendRequest {
  senderId: number;
  receiverId: number;
}

export interface BuddyRequestResponse {
  requestId: number;
  senderId: number;
  senderEmail: string;
  receiverId: number;
  status: string;
  createdAt: string;
  telegramUsername?: string;
}

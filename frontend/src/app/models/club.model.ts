export interface Club {
  id: number;
  name: string;
  description: string;
  goal: string;
  level: string;
  createdAt: string;
}

export interface ClubProgress {
  id: number;
  userId: number;
  clubId: number;
  startingMax: number;
  currentWeek: number;
  startDate: string;
  lastUpdated: string;
}

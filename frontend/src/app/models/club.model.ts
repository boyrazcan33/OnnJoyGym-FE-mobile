export interface ClubProgress {
  id: number;
  userId: number;
  clubId: number;
  startingMax: number;
  currentWeek: number;
  startDate: string;
  lastUpdated: string;
}

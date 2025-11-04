export interface Leaderboard {
  id: number;
  user: User;
  gym: Gym;
  video: Video;
  category: string;
  weight: number;
  ranking: number;
  createdAt: string;
  updatedAt: string;
}

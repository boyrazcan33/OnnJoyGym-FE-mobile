import { Gym } from './gym.model';

export interface Review {
  id: number;
  gym: Gym;
  rating: number;
  content: string;
  authorName: string;
  isExpert: boolean;
  createdAt: string;
  updatedAt: string;
}

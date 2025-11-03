export interface Video {
  id: number;
  user: User;
  gym: Gym;
  category: string;
  weight: number;
  reps: number;
  s3Key: string;
  s3Url: string;
  status: 'PENDING' | 'APPROVED' | 'REJECTED' | 'BANNED';
  rejectionReason?: string;
  createdAt: string;
  updatedAt: string;
}

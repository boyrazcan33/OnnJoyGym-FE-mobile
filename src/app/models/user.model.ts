export interface User {
  id: number;
  email: string;
  role: string;
  bio?: string;
  goals?: string;
  experience?: string;
  gymPreference?: number;
  createdAt: string;
  updatedAt: string;
}

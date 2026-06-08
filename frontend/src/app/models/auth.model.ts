export interface LoginRequest {
  email: string;
  password: string;
}

export interface RegisterRequest {
  email: string;
  password: string;
  username: string;
  telegramUsername: string;
  gender: string;
}

export interface AuthResponse {
  token: string;
  email: string;
  username?: string;
  role: string;
  userId: number;
  isActivated: boolean;
  emailVerified: boolean;
}

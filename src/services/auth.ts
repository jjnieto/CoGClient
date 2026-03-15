import { apiClient } from './client';
import type { AuthResponse, LoginRequest, RegisterRequest, User } from '../types/auth';

export function register(data: RegisterRequest): Promise<AuthResponse> {
  return apiClient<AuthResponse>('/auth/register', {
    method: 'POST',
    body: data,
  });
}

export function login(data: LoginRequest): Promise<AuthResponse> {
  return apiClient<AuthResponse>('/auth/login', {
    method: 'POST',
    body: data,
  });
}

export function getMe(token: string): Promise<User> {
  return apiClient<User>('/auth/me', { token });
}

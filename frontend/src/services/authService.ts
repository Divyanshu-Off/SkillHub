import apiClient from './apiClient';
import type { User, TokenResponse, LoginPayload, RegisterPayload } from '../types/auth';

export const loginUser = async (payload: LoginPayload): Promise<TokenResponse> => {
  const response = await apiClient.post<TokenResponse>('/auth/jwt/create/', payload);
  return response.data;
};

export const registerUser = async (payload: RegisterPayload): Promise<User> => {
  const response = await apiClient.post<User>('/auth/register/', payload);
  return response.data;
};

export const getCurrentUser = async (): Promise<User> => {
  const response = await apiClient.get<User>('/auth/me/');
  return response.data;
};

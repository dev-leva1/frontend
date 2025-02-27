import axios from 'axios';

const API_URL = 'http://localhost:5000/api';

export interface LoginData {
  email: string;
  password: string;
}

export interface RegisterData extends LoginData {
  username: string;
}

export interface AuthResponse {
  user: {
    _id: string;
    email: string;
    username: string;
    avatar?: string;
    bio?: string;
  };
  token: string;
}

export const register = async (data: RegisterData): Promise<AuthResponse> => {
  const response = await axios.post<AuthResponse>(`${API_URL}/auth/register`, data);
  return response.data;
};

export const login = async (data: LoginData): Promise<AuthResponse> => {
  const response = await axios.post<AuthResponse>(`${API_URL}/auth/login`, data);
  return response.data;
};

export const getProfile = async (token: string) => {
  const response = await axios.get<AuthResponse['user']>(`${API_URL}/auth/me`, {
    headers: {
      Authorization: `Bearer ${token}`
    }
  });
  return response.data;
}; 
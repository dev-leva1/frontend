import axios from 'axios';

const API_URL = 'http://localhost:5000/api';

export interface User {
  _id: string;
  username: string;
  email: string;
  avatar?: string;
  bio?: string;
  followers: {
    _id: string;
    username: string;
    avatar?: string;
  }[];
  following: {
    _id: string;
    username: string;
    avatar?: string;
  }[];
}

export const getUser = async (userId: string, token: string): Promise<User> => {
  const response = await axios.get<User>(`${API_URL}/users/${userId}`, {
    headers: {
      Authorization: `Bearer ${token}`
    }
  });
  return response.data;
};

export const updateProfile = async (data: {
  username?: string;
  avatar?: string;
  bio?: string;
}, token: string): Promise<User> => {
  const response = await axios.put<User>(
    `${API_URL}/users/profile`,
    data,
    {
      headers: {
        Authorization: `Bearer ${token}`
      }
    }
  );
  return response.data;
};

export const followUser = async (userId: string, token: string): Promise<User> => {
  const response = await axios.post<User>(
    `${API_URL}/users/${userId}/follow`,
    {},
    {
      headers: {
        Authorization: `Bearer ${token}`
      }
    }
  );
  return response.data;
}; 
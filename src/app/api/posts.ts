import axios from 'axios';

const API_URL = 'http://localhost:5000/api';

export interface Post {
  _id: string;
  content: string;
  image?: string;
  author: {
    _id: string;
    username: string;
    avatar?: string;
  };
  likes: string[];
  comments: {
    _id: string;
    content: string;
    author: {
      _id: string;
      username: string;
      avatar?: string;
    };
    createdAt: string;
  }[];
  createdAt: string;
  updatedAt: string;
}

export const getPosts = async (token: string): Promise<Post[]> => {
  const response = await axios.get<Post[]>(`${API_URL}/posts`, {
    headers: { Authorization: `Bearer ${token}` }
  });
  return response.data;
};

export const createPost = async (data: { content: string; image?: string }, token: string): Promise<Post> => {
  const response = await axios.post<Post>(`${API_URL}/posts`, data, {
    headers: { Authorization: `Bearer ${token}` }
  });
  return response.data;
};

export const likePost = async (postId: string, token: string): Promise<Post> => {
  const response = await axios.post<Post>(
    `${API_URL}/posts/${postId}/like`,
    {},
    {
      headers: { Authorization: `Bearer ${token}` }
    }
  );
  return response.data;
};

export const addComment = async (postId: string, content: string, token: string): Promise<Post> => {
  const response = await axios.post<Post>(
    `${API_URL}/posts/${postId}/comment`,
    { content },
    {
      headers: {
        Authorization: `Bearer ${token}`
      }
    }
  );
  return response.data;
};

export const deletePost = async (postId: string, token: string): Promise<void> => {
  await axios.delete(`${API_URL}/posts/${postId}`, {
    headers: { Authorization: `Bearer ${token}` }
  });
}; 
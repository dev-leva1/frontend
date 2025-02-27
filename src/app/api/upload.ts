import axios from 'axios';

const API_URL = 'http://localhost:5000/api';

export const uploadImage = async (file: File, token: string): Promise<string> => {
  try {
    const formData = new FormData();
    formData.append('image', file);

    const response = await axios.post<{ url: string }>(
      `${API_URL}/upload`,
      formData,
      {
        headers: {
          Authorization: `Bearer ${token}`,
          'Content-Type': 'multipart/form-data'
        }
      }
    );

    return response.data.url;
  } catch (error: any) {
    console.error('Ошибка при загрузке изображения:', error.response || error);
    throw error;
  }
}; 
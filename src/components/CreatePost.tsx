'use client';

import { useState } from 'react';
import { createPost } from '@/app/api/posts';
import ImageUpload from './ImageUpload';

interface CreatePostProps {
  onPostCreated: () => void;
}

export default function CreatePost({ onPostCreated }: CreatePostProps) {
  const [content, setContent] = useState('');
  const [image, setImage] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!content.trim()) return;

    try {
      setIsLoading(true);
      setError('');
      const token = localStorage.getItem('token');
      if (!token) throw new Error('Не авторизован');

      await createPost({ content, image: image || undefined }, token);
      setContent('');
      setImage('');
      onPostCreated();
    } catch (err: any) {
      console.error('Ошибка при создании поста:', err);
      setError(err.response?.data?.message || 'Ошибка при создании поста');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="bg-white shadow rounded-lg p-6 mb-6">
      <form onSubmit={handleSubmit}>
        <textarea
          className="w-full p-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500"
          rows={3}
          placeholder="Что у вас нового?"
          value={content}
          onChange={(e) => setContent(e.target.value)}
          maxLength={500}
        />
        {image && (
          <div className="mt-4 relative">
            <img
              src={image}
              alt="Preview"
              className="w-full max-h-96 object-cover rounded-lg"
            />
            <button
              type="button"
              onClick={() => setImage('')}
              className="absolute top-2 right-2 bg-red-500 text-white p-2 rounded-full hover:bg-red-600"
            >
              ✕
            </button>
          </div>
        )}
        <div className="mt-4 flex justify-between items-center">
          <ImageUpload
            onImageUploaded={setImage}
            className="flex-shrink-0"
          />
          <button
            type="submit"
            disabled={isLoading || !content.trim()}
            className="px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 disabled:opacity-50"
          >
            {isLoading ? 'Публикация...' : 'Опубликовать'}
          </button>
        </div>
        {error && <p className="text-red-500 text-sm mt-2">{error}</p>}
      </form>
    </div>
  );
} 
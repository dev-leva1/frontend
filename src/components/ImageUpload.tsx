'use client';

import { useState, useRef } from 'react';
import { uploadImage } from '@/app/api/upload';

interface ImageUploadProps {
  onImageUploaded: (url: string) => void;
  className?: string;
}

export default function ImageUpload({ onImageUploaded, className = '' }: ImageUploadProps) {
  const [isUploading, setIsUploading] = useState(false);
  const [error, setError] = useState('');
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    // Проверка размера файла (5MB)
    if (file.size > 5 * 1024 * 1024) {
      setError('Размер файла не должен превышать 5MB');
      return;
    }

    // Проверка типа файла
    if (!file.type.startsWith('image/')) {
      setError('Поддерживаются только изображения');
      return;
    }

    try {
      setIsUploading(true);
      setError('');

      const token = localStorage.getItem('token');
      if (!token) throw new Error('Не авторизован');

      const imageUrl = await uploadImage(file, token);
      onImageUploaded(imageUrl);
    } catch (err: any) {
      console.error('Ошибка загрузки:', err);
      setError(err.response?.data?.error || err.message || 'Ошибка при загрузке изображения');
    } finally {
      setIsUploading(false);
      if (fileInputRef.current) {
        fileInputRef.current.value = '';
      }
    }
  };

  return (
    <div className={className}>
      <input
        ref={fileInputRef}
        type="file"
        accept="image/*"
        onChange={handleFileChange}
        disabled={isUploading}
        className="hidden"
      />
      <button
        type="button"
        onClick={() => fileInputRef.current?.click()}
        disabled={isUploading}
        className="px-4 py-2 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 disabled:opacity-50"
      >
        {isUploading ? 'Загрузка...' : 'Добавить изображение'}
      </button>
      {error && <p className="text-red-500 text-sm mt-2">{error}</p>}
    </div>
  );
} 
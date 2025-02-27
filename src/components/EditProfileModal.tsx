'use client';

import { useState } from 'react';
import { User, updateProfile } from '@/app/api/users';
import ImageUpload from './ImageUpload';

interface EditProfileModalProps {
  user: User;
  onClose: () => void;
  onUpdate: () => void;
}

export default function EditProfileModal({ user, onClose, onUpdate }: EditProfileModalProps) {
  const [username, setUsername] = useState(user.username);
  const [bio, setBio] = useState(user.bio || '');
  const [avatar, setAvatar] = useState(user.avatar || '');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!username.trim()) return;

    try {
      setIsLoading(true);
      setError('');

      const token = localStorage.getItem('token');
      if (!token) throw new Error('Не авторизован');

      await updateProfile({
        username: username.trim(),
        bio: bio.trim(),
        avatar: avatar || undefined
      }, token);

      onUpdate();
      onClose();
    } catch (err: any) {
      setError(err.response?.data?.message || 'Ошибка при обновлении профиля');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4">
      <div className="bg-white rounded-lg max-w-md w-full p-6">
        <h2 className="text-xl font-bold mb-4">Редактировать профиль</h2>
        <form onSubmit={handleSubmit}>
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700">
                Аватар
              </label>
              <div className="mt-2 flex items-center space-x-4">
                {avatar ? (
                  <div className="relative">
                    <img
                      src={avatar}
                      alt="Avatar preview"
                      className="w-16 h-16 rounded-full object-cover"
                    />
                    <button
                      type="button"
                      onClick={() => setAvatar('')}
                      className="absolute -top-1 -right-1 bg-red-500 text-white rounded-full p-1 text-xs"
                    >
                      ✕
                    </button>
                  </div>
                ) : (
                  <div className="w-16 h-16 rounded-full bg-gray-200 flex items-center justify-center">
                    <span className="text-xl text-gray-500">
                      {username[0].toUpperCase()}
                    </span>
                  </div>
                )}
                <ImageUpload onImageUploaded={setAvatar} />
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700">
                Имя пользователя
              </label>
              <input
                type="text"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2 focus:border-indigo-500 focus:outline-none focus:ring-1 focus:ring-indigo-500"
                required
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700">
                О себе
              </label>
              <textarea
                value={bio}
                onChange={(e) => setBio(e.target.value)}
                rows={3}
                className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2 focus:border-indigo-500 focus:outline-none focus:ring-1 focus:ring-indigo-500"
              />
            </div>

            {error && <p className="text-red-500 text-sm">{error}</p>}

            <div className="flex justify-end space-x-3">
              <button
                type="button"
                onClick={onClose}
                className="px-4 py-2 text-gray-700 hover:bg-gray-100 rounded-md"
              >
                Отмена
              </button>
              <button
                type="submit"
                disabled={isLoading || !username.trim()}
                className="px-4 py-2 bg-indigo-600 text-white rounded-md hover:bg-indigo-700 disabled:opacity-50"
              >
                {isLoading ? 'Сохранение...' : 'Сохранить'}
              </button>
            </div>
          </div>
        </form>
      </div>
    </div>
  );
} 
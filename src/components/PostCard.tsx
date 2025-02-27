'use client';

import { useState } from 'react';
import { Post } from '@/app/api/posts';
import { likePost, deletePost } from '@/app/api/posts';

interface PostCardProps {
  post: Post;
  onUpdate: () => void;
}

export default function PostCard({ post, onUpdate }: PostCardProps) {
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');

  const handleLike = async () => {
    try {
      setIsLoading(true);
      setError('');

      const token = localStorage.getItem('token');
      if (!token) return;

      await likePost(post._id, token);
      onUpdate();
    } catch (err: any) {
      setError(err.response?.data?.message || 'Ошибка при обновлении лайка');
    } finally {
      setIsLoading(false);
    }
  };

  const handleDelete = async () => {
    if (!window.confirm('Вы уверены, что хотите удалить этот пост?')) return;

    try {
      setIsLoading(true);
      setError('');

      const token = localStorage.getItem('token');
      if (!token) return;

      await deletePost(post._id, token);
      onUpdate();
    } catch (err: any) {
      setError(err.response?.data?.message || 'Ошибка при удалении поста');
    } finally {
      setIsLoading(false);
    }
  };

  const currentUserId = localStorage.getItem('token')
    ? JSON.parse(atob(localStorage.getItem('token')!.split('.')[1])).userId
    : null;
  const isOwnPost = currentUserId === post.author._id;
  const hasLiked = post.likes.includes(currentUserId);

  return (
    <div className="bg-white rounded-lg shadow p-6">
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center space-x-3">
          {post.author.avatar ? (
            <img
              src={post.author.avatar}
              alt={`${post.author.username}'s avatar`}
              className="w-10 h-10 rounded-full object-cover"
            />
          ) : (
            <div className="w-10 h-10 rounded-full bg-gray-200 flex items-center justify-center">
              <span className="text-xl text-gray-500">
                {post.author.username[0].toUpperCase()}
              </span>
            </div>
          )}
          <div>
            <p className="font-semibold">{post.author.username}</p>
            <p className="text-sm text-gray-500">
              {new Date(post.createdAt).toLocaleDateString()}
            </p>
          </div>
        </div>
        {isOwnPost && (
          <button
            onClick={handleDelete}
            disabled={isLoading}
            className="text-red-500 hover:text-red-700"
          >
            Удалить
          </button>
        )}
      </div>

      {post.image && (
        <img
          src={post.image}
          alt="Post image"
          className="w-full h-auto rounded-lg mb-4 object-cover"
        />
      )}

      <p className="text-gray-800 mb-4">{post.content}</p>

      <div className="flex items-center justify-between">
        <button
          onClick={handleLike}
          disabled={isLoading}
          className={`flex items-center space-x-1 ${
            hasLiked ? 'text-red-500' : 'text-gray-500'
          } hover:text-red-700`}
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            className="h-6 w-6"
            fill={hasLiked ? 'currentColor' : 'none'}
            viewBox="0 0 24 24"
            stroke="currentColor"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z"
            />
          </svg>
          <span>{post.likes.length}</span>
        </button>

        {error && <p className="text-red-500 text-sm">{error}</p>}
      </div>
    </div>
  );
} 
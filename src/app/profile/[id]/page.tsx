'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { User, getUser, followUser } from '@/app/api/users';
import { Post, getPosts } from '@/app/api/posts';
import Navbar from '@/components/Navbar';
import PostCard from '@/components/PostCard';
import EditProfileModal from '@/components/EditProfileModal';

interface ProfileProps {
  params: {
    id: string;
  };
}

export default function Profile({ params }: ProfileProps) {
  const router = useRouter();
  const [user, setUser] = useState<User | null>(null);
  const [posts, setPosts] = useState<Post[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState('');
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [currentUserId, setCurrentUserId] = useState<string | null>(null);

  const fetchData = async () => {
    try {
      setIsLoading(true);
      setError('');

      const token = localStorage.getItem('token');
      if (!token) {
        router.push('/login');
        return;
      }

      const [userData, postsData] = await Promise.all([
        getUser(params.id, token),
        getPosts(token)
      ]);

      setUser(userData);
      setPosts(postsData.filter(post => post.author._id === params.id));
      setCurrentUserId(JSON.parse(atob(token.split('.')[1])).userId);
    } catch (err: any) {
      setError(err.response?.data?.message || 'Ошибка при загрузке профиля');
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, [params.id]);

  const handleFollow = async () => {
    try {
      if (!user) return;

      const token = localStorage.getItem('token');
      if (!token) {
        router.push('/login');
        return;
      }

      await followUser(user._id, token);
      await fetchData();
    } catch (err: any) {
      setError(err.response?.data?.message || 'Ошибка при подписке/отписке');
    }
  };

  if (isLoading) {
    return (
      <div>
        <Navbar />
        <div className="container mx-auto px-4 py-8">
          <p className="text-center">Загрузка...</p>
        </div>
      </div>
    );
  }

  if (error || !user) {
    return (
      <div>
        <Navbar />
        <div className="container mx-auto px-4 py-8">
          <p className="text-center text-red-500">{error || 'Пользователь не найден'}</p>
        </div>
      </div>
    );
  }

  const isOwnProfile = currentUserId === user._id;
  const isFollowing = user.followers?.some(follower => follower._id === currentUserId);

  return (
    <div>
      <Navbar />
      <div className="container mx-auto px-4 py-8">
        <div className="max-w-2xl mx-auto">
          <div className="bg-white rounded-lg shadow p-6 mb-8">
            <div className="flex items-center space-x-6">
              {user.avatar ? (
                <img
                  src={user.avatar}
                  alt={`${user.username}'s avatar`}
                  className="w-24 h-24 rounded-full object-cover"
                />
              ) : (
                <div className="w-24 h-24 rounded-full bg-gray-200 flex items-center justify-center">
                  <span className="text-3xl text-gray-500">
                    {user.username[0].toUpperCase()}
                  </span>
                </div>
              )}
              <div className="flex-1">
                <h1 className="text-2xl font-bold">{user.username}</h1>
                {user.bio && <p className="text-gray-600 mt-2">{user.bio}</p>}
                <div className="flex space-x-4 mt-4">
                  <div>
                    <span className="font-bold">{user.followers?.length || 0}</span>
                    <span className="text-gray-600 ml-1">подписчиков</span>
                  </div>
                  <div>
                    <span className="font-bold">{user.following?.length || 0}</span>
                    <span className="text-gray-600 ml-1">подписок</span>
                  </div>
                  <div>
                    <span className="font-bold">{posts.length}</span>
                    <span className="text-gray-600 ml-1">постов</span>
                  </div>
                </div>
              </div>
            </div>
            <div className="mt-6">
              {isOwnProfile ? (
                <button
                  onClick={() => setIsEditModalOpen(true)}
                  className="w-full bg-indigo-600 text-white py-2 px-4 rounded-md hover:bg-indigo-700"
                >
                  Редактировать профиль
                </button>
              ) : (
                <button
                  onClick={handleFollow}
                  className={`w-full ${
                    isFollowing
                      ? 'bg-gray-200 text-gray-800 hover:bg-gray-300'
                      : 'bg-indigo-600 text-white hover:bg-indigo-700'
                  } py-2 px-4 rounded-md`}
                >
                  {isFollowing ? 'Отписаться' : 'Подписаться'}
                </button>
              )}
            </div>
          </div>

          <div className="space-y-6">
            {posts.map((post) => (
              <PostCard key={post._id} post={post} onUpdate={fetchData} />
            ))}
            {posts.length === 0 && (
              <p className="text-center text-gray-500">Нет опубликованных постов</p>
            )}
          </div>
        </div>
      </div>

      {isEditModalOpen && user && (
        <EditProfileModal
          user={user}
          onClose={() => setIsEditModalOpen(false)}
          onUpdate={fetchData}
        />
      )}
    </div>
  );
} 
'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import Navbar from '@/components/Navbar';
import CreatePost from '@/components/CreatePost';
import PostCard from '@/components/PostCard';
import { getPosts } from './api/posts';
import { getProfile } from './api/auth';
import type { Post } from './api/posts';

export default function Home() {
  const [posts, setPosts] = useState<Post[]>([]);
  const [userId, setUserId] = useState<string>('');
  const [isLoading, setIsLoading] = useState(true);
  const router = useRouter();

  const fetchPosts = async () => {
    try {
      const token = localStorage.getItem('token');
      if (!token) {
        router.push('/login');
        return;
      }

      const posts = await getPosts(token);
      setPosts(posts);
    } catch (error) {
      console.error('Ошибка при загрузке постов:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const fetchUser = async () => {
    try {
      const token = localStorage.getItem('token');
      if (!token) {
        router.push('/login');
        return;
      }

      const user = await getProfile(token);
      setUserId(user._id);
    } catch (error) {
      console.error('Ошибка при загрузке профиля:', error);
      router.push('/login');
    }
  };

  useEffect(() => {
    fetchUser();
    fetchPosts();
  }, []);

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gray-100">
        <Navbar />
        <div className="container mx-auto px-4 py-8">
          <p>Загрузка...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-100">
      <Navbar />
      <div className="container mx-auto px-4 py-8">
        <CreatePost onPostCreated={fetchPosts} />
        <div className="space-y-6">
          {posts.map((post) => (
            <PostCard
              key={post._id}
              post={post}
              currentUserId={userId}
              onPostUpdated={fetchPosts}
            />
          ))}
        </div>
      </div>
    </div>
  );
}

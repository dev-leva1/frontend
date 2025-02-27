'use client';

import { useForm } from 'react-hook-form';
import { useState } from 'react';
import { register as registerUser, RegisterData } from '../api/auth';
import { useRouter } from 'next/navigation';
import Link from 'next/link';

export default function Register() {
  const { register, handleSubmit, formState: { errors } } = useForm<RegisterData>();
  const [error, setError] = useState('');
  const router = useRouter();

  const onSubmit = async (data: RegisterData) => {
    try {
      const response = await registerUser(data);
      localStorage.setItem('token', response.token);
      router.push('/');
    } catch (err) {
      setError('Ошибка при регистрации. Возможно, email или имя пользователя уже заняты.');
    }
  };

  return (
    <div className="min-h-screen bg-gray-100 flex flex-col justify-center py-12 sm:px-6 lg:px-8">
      <div className="sm:mx-auto sm:w-full sm:max-w-md">
        <h2 className="mt-6 text-center text-3xl font-extrabold text-gray-900">
          Регистрация
        </h2>
      </div>

      <div className="mt-8 sm:mx-auto sm:w-full sm:max-w-md">
        <div className="bg-white py-8 px-4 shadow sm:rounded-lg sm:px-10">
          <form className="space-y-6" onSubmit={handleSubmit(onSubmit)}>
            <div>
              <label htmlFor="username" className="block text-sm font-medium text-gray-700">
                Имя пользователя
              </label>
              <div className="mt-1">
                <input
                  {...register('username', { required: true })}
                  type="text"
                  className="appearance-none block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
                />
                {errors.username && <span className="text-red-500 text-sm">Имя пользователя обязательно</span>}
              </div>
            </div>

            <div>
              <label htmlFor="email" className="block text-sm font-medium text-gray-700">
                Email
              </label>
              <div className="mt-1">
                <input
                  {...register('email', { required: true })}
                  type="email"
                  className="appearance-none block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
                />
                {errors.email && <span className="text-red-500 text-sm">Email обязателен</span>}
              </div>
            </div>

            <div>
              <label htmlFor="password" className="block text-sm font-medium text-gray-700">
                Пароль
              </label>
              <div className="mt-1">
                <input
                  {...register('password', { required: true, minLength: 6 })}
                  type="password"
                  className="appearance-none block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
                />
                {errors.password && <span className="text-red-500 text-sm">Пароль должен содержать минимум 6 символов</span>}
              </div>
            </div>

            {error && <div className="text-red-500 text-sm">{error}</div>}

            <div>
              <button
                type="submit"
                className="w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
              >
                Зарегистрироваться
              </button>
            </div>
          </form>

          <div className="mt-6">
            <div className="relative">
              <div className="relative flex justify-center text-sm">
                <span className="px-2 bg-white text-gray-500">
                  Уже есть аккаунт?{' '}
                  <Link href="/login" className="font-medium text-indigo-600 hover:text-indigo-500">
                    Войти
                  </Link>
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
} 
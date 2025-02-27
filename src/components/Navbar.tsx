import Link from 'next/link';

export default function Navbar() {
  return (
    <nav className="bg-gray-800 p-4">
      <div className="container mx-auto flex justify-between items-center">
        <Link href="/" className="text-white text-xl font-bold">
          SocialPet
        </Link>
        <div className="space-x-4">
          <Link href="/login" className="text-white hover:text-gray-300">
            Войти
          </Link>
          <Link href="/register" className="text-white hover:text-gray-300">
            Регистрация
          </Link>
        </div>
      </div>
    </nav>
  );
} 
'use client'

import Link from 'next/link';
import { usePathname } from 'next/navigation';

export default function Navigation() {
  const pathname = usePathname();

  return (
    <nav className="fixed top-0 left-0 right-0 bg-gray-800 border-b border-gray-700 z-50">
      <div className="max-w-4xl mx-auto px-4 py-4">
        <div className="flex gap-4 items-center">
          <Link
            href="/"
            className={`px-4 py-2 rounded-lg transition-colors ${
              pathname === '/'
                ? 'bg-blue-600 text-white'
                : 'text-gray-300 hover:bg-gray-700'
            }`}
          >
            Home
          </Link>
          <Link
            href="/gsap"
            className={`px-4 py-2 rounded-lg transition-colors ${
              pathname === '/gsap'
                ? 'bg-blue-600 text-white'
                : 'text-gray-300 hover:bg-gray-700'
            }`}
          >
            GSAP Wave
          </Link>
          <Link
            href="/canvas"
            className={`px-4 py-2 rounded-lg transition-colors ${
              pathname === '/canvas'
                ? 'bg-blue-600 text-white'
                : 'text-gray-300 hover:bg-gray-700'
            }`}
          >
            Rapier Physics
          </Link>
        </div>
      </div>
    </nav>
  );
}


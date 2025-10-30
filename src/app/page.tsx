'use client'

import Link from 'next/link';
import Navigation from '@/components/Navigation';

export default function Home() {
  return (
    <div className="min-h-screen bg-gray-900">
      <Navigation />

      <main className="pt-24 pb-16">
        <div className="max-w-4xl mx-auto px-4">
          <div className="text-center mb-12">
            <h1 className="text-4xl font-bold text-white mb-4">Liquidity</h1>
            <p className="text-gray-400 text-lg">
              Interactive animation experiments exploring liquid text effects
            </p>
          </div>

          <div className="grid md:grid-cols-2 gap-6 mt-12">
            <Link
              href="/gsap"
              className="block p-6 bg-gray-800 rounded-lg border border-gray-700 hover:border-blue-500 hover:border-2 transition-all group"
            >
              <h2 className="text-2xl font-semibold text-white mb-2 group-hover:text-blue-400 transition-colors">
                GSAP Wave Animation
              </h2>
              <p className="text-gray-400 mb-4">
                SVG-based liquid text effect using GSAP timelines for smooth wave animations. Lightweight and predictable.
              </p>
              <div className="flex flex-wrap gap-2">
                <span className="px-2 py-1 bg-gray-700 text-xs text-gray-300 rounded">GSAP</span>
                <span className="px-2 py-1 bg-gray-700 text-xs text-gray-300 rounded">SVG</span>
                <span className="px-2 py-1 bg-gray-700 text-xs text-gray-300 rounded">Interactive</span>
              </div>
            </Link>

            <Link
              href="/canvas"
              className="block p-6 bg-gray-800 rounded-lg border border-gray-700 hover:border-blue-500 hover:border-2 transition-all group"
            >
              <h2 className="text-2xl font-semibold text-white mb-2 group-hover:text-blue-400 transition-colors">
                Rapier Physics
              </h2>
              <p className="text-gray-400 mb-4">
                Canvas-based liquid simulation with 2500 particles using real physics engine. Natural interactions and collisions.
              </p>
              <div className="flex flex-wrap gap-2">
                <span className="px-2 py-1 bg-gray-700 text-xs text-gray-300 rounded">Rapier2D</span>
                <span className="px-2 py-1 bg-gray-700 text-xs text-gray-300 rounded">Canvas</span>
                <span className="px-2 py-1 bg-gray-700 text-xs text-gray-300 rounded">Physics</span>
              </div>
            </Link>
          </div>

          <div className="mt-12 p-6 bg-gray-800 rounded-lg border border-gray-700">
            <h3 className="text-xl font-semibold text-white mb-4">About</h3>
            <p className="text-gray-400 mb-4">
              This project explores two different approaches to creating liquid text effects:
            </p>
            <ul className="list-disc list-inside text-gray-400 space-y-2">
              <li><strong>GSAP approach:</strong> Lightweight SVG path morphing with mathematical wave generation</li>
              <li><strong>Rapier approach:</strong> Realistic physics simulation with particle interactions and collisions</li>
            </ul>
          </div>
        </div>
      </main>
    </div>
  );
}

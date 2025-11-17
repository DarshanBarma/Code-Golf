'use client';

import { SignedIn, useUser } from '@clerk/nextjs';
import { useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';

export default function Home() {
  const router = useRouter();
  const { isLoaded, isSignedIn } = useUser();
  const [theme, setTheme] = useState('dark');

  useEffect(() => {
    if (isLoaded) {
      if (!isSignedIn) {
        router.push('/auth');
      }
    }
  }, [isLoaded, isSignedIn, router]);

  useEffect(() => {
    const savedTheme = localStorage.getItem('theme') || 'dark';
    setTheme(savedTheme);
    document.documentElement.setAttribute('data-theme', savedTheme);
  }, []);

  const toggleTheme = () => {
    const newTheme = theme === 'light' ? 'dark' : 'light';
    setTheme(newTheme);
    document.documentElement.setAttribute('data-theme', newTheme);
    localStorage.setItem('theme', newTheme);
  };

  if (!isLoaded) {
    return (
      <div 
        className="min-h-screen flex items-center justify-center"
        style={{ backgroundColor: 'var(--background-50)' }}
      >
        <div 
          className="animate-pulse text-lg"
          style={{ color: 'var(--text-600)' }}
        >
          Loading...
        </div>
      </div>
    );
  }

  return (
    <SignedIn>
      <div 
        className="min-h-screen"
        style={{ backgroundColor: 'var(--background-50)' }}
      >
        {/* Header */}
        <header 
          className="border-b backdrop-blur-sm sticky top-0 z-40"
          style={{ 
            backgroundColor: 'var(--background-100)',
            borderColor: 'var(--background-300)'
          }}
        >
          <div className="container mx-auto px-6 py-4 flex justify-between items-center">
            <h2 style={{ color: 'var(--primary-500)' }}>
              Code Golf
            </h2>
            <div className="flex items-center gap-4">
              {/* Theme Toggle */}
              <button
                onClick={toggleTheme}
                className="w-10 h-10 rounded-full flex items-center justify-center transition-all hover:scale-110"
                style={{ 
                  backgroundColor: 'var(--background-200)',
                  border: '2px solid var(--background-400)'
                }}
                aria-label="Toggle theme"
              >
                {theme === 'light' ? (
                  <svg 
                    className="w-5 h-5" 
                    fill="none" 
                    stroke="currentColor" 
                    viewBox="0 0 24 24"
                    style={{ color: 'var(--primary-500)' }}
                  >
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z" />
                  </svg>
                ) : (
                  <svg 
                    className="w-5 h-5" 
                    fill="currentColor" 
                    viewBox="0 0 24 24"
                    style={{ color: 'var(--primary-200)' }}
                  >
                    <path d="M9 21c0 .55.45 1 1 1h4c.55 0 1-.45 1-1v-1H9v1zm3-19C8.14 2 5 5.14 5 9c0 2.38 1.19 4.47 3 5.74V17c0 .55.45 1 1 1h6c.55 0 1-.45 1-1v-2.26c1.81-1.27 3-3.36 3-5.74 0-3.86-3.14-7-7-7z" opacity="0.3"/>
                  </svg>
                )}
              </button>

              <button 
                className="px-6 py-2.5 rounded-lg transition-all hover:opacity-90 font-medium shadow-md"
                style={{ 
                  backgroundColor: 'var(--primary-500)',
                  color: 'var(--background-50)'
                }}
              >
                New Challenge
              </button>
            </div>
          </div>
        </header>

        {/* Main Content */}
        <main className="container mx-auto px-6 py-8">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {/* Welcome Card */}
            <div 
              className="col-span-full rounded-xl p-8 shadow-xl border"
              style={{ 
                backgroundColor: 'var(--primary-500)',
                borderColor: 'var(--primary-600)'
              }}
            >
              <h2 style={{ color: 'var(--background-50)' }}>
                Welcome to Code Golf! 🏌️
              </h2>
              <p 
                className="text-lg mt-3"
                style={{ color: 'var(--background-100)' }}
              >
                Challenge yourself with coding problems and compete to write the shortest code possible.
              </p>
            </div>

            {/* Stats Cards */}
            <div 
              className="rounded-xl p-6 shadow-lg border transition-all hover:shadow-xl"
              style={{ 
                backgroundColor: 'var(--background-100)',
                borderColor: 'var(--background-300)'
              }}
            >
              <div className="flex items-center justify-between">
                <div>
                  <p style={{ color: 'var(--text-500)' }}>Challenges Solved</p>
                  <h2 className="mt-2" style={{ color: 'var(--text-900)' }}>0</h2>
                </div>
                <div 
                  className="p-4 rounded-lg"
                  style={{ backgroundColor: 'var(--primary-500)' }}
                >
                  <svg 
                    className="w-8 h-8" 
                    fill="none" 
                    stroke="currentColor" 
                    viewBox="0 0 24 24"
                    style={{ color: 'var(--background-50)' }}
                  >
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                </div>
              </div>
            </div>

            <div 
              className="rounded-xl p-6 shadow-lg border transition-all hover:shadow-xl"
              style={{ 
                backgroundColor: 'var(--background-100)',
                borderColor: 'var(--background-300)'
              }}
            >
              <div className="flex items-center justify-between">
                <div>
                  <p style={{ color: 'var(--text-500)' }}>Total Score</p>
                  <h2 className="mt-2" style={{ color: 'var(--text-900)' }}>0</h2>
                </div>
                <div 
                  className="p-4 rounded-lg"
                  style={{ backgroundColor: 'var(--primary-500)' }}
                >
                  <svg 
                    className="w-8 h-8" 
                    fill="none" 
                    stroke="currentColor" 
                    viewBox="0 0 24 24"
                    style={{ color: 'var(--background-50)' }}
                  >
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
                  </svg>
                </div>
              </div>
            </div>

            <div 
              className="rounded-xl p-6 shadow-lg border transition-all hover:shadow-xl"
              style={{ 
                backgroundColor: 'var(--background-100)',
                borderColor: 'var(--background-300)'
              }}
            >
              <div className="flex items-center justify-between">
                <div>
                  <p style={{ color: 'var(--text-500)' }}>Global Rank</p>
                  <h2 className="mt-2" style={{ color: 'var(--text-900)' }}>-</h2>
                </div>
                <div 
                  className="p-4 rounded-lg"
                  style={{ backgroundColor: 'var(--primary-500)' }}
                >
                  <svg 
                    className="w-8 h-8" 
                    fill="none" 
                    stroke="currentColor" 
                    viewBox="0 0 24 24"
                    style={{ color: 'var(--background-50)' }}
                  >
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z" />
                  </svg>
                </div>
              </div>
            </div>
          </div>
        </main>
      </div>
    </SignedIn>
  );
}``
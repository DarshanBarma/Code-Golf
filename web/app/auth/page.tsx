'use client';

import { SignedOut, useUser, SignInButton, SignUpButton } from '@clerk/nextjs';
import { useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';

export default function AuthPage() {
  const router = useRouter();
  const { isLoaded, isSignedIn } = useUser();
  const [theme, setTheme] = useState('dark');

  useEffect(() => {
    if (isLoaded && isSignedIn) {
      router.push('/');
    }
  }, [isLoaded, isSignedIn, router]);

  useEffect(() => {
    // Check for saved theme preference or default to dark
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

  return (
    <SignedOut>
      <div 
        className="h-full w-full overflow-hidden flex flex-col"
        style={{ backgroundColor: 'var(--background-100)' }}
      >
        {/* Theme Toggle - Top Right */}
        <div className="absolute top-6 right-6 z-10">
          <button
            onClick={toggleTheme}
            className="w-12 h-12 rounded-full flex items-center justify-center transition-all hover:scale-110 shadow-lg"
            style={{ 
              backgroundColor: 'var(--background-200)',
              border: '2px solid var(--background-400)'
            }}
            aria-label="Toggle theme"
          >
            {theme === 'light' ? (
              // Light bulb for light mode
              <svg 
                className="w-5 h-5" 
                fill="none" 
                stroke="currentColor" 
                viewBox="0 0 24 24"
                style={{ color: 'var(--accent-500)' }}
              >
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z" />
              </svg>
            ) : (
              // Light bulb off for dark mode
              <svg 
                className="w-6 h-6" 
                fill="currentColor" 
                viewBox="0 0 24 24"
                style={{ color: 'var(--accent-500)' }}
              >
                <path d="M9 21c0 .55.45 1 1 1h4c.55 0 1-.45 1-1v-1H9v1zm3-19C8.14 2 5 5.14 5 9c0 2.38 1.19 4.47 3 5.74V17c0 .55.45 1 1 1h6c.55 0 1-.45 1-1v-2.26c1.81-1.27 3-3.36 3-5.74 0-3.86-3.14-7-7-7z" opacity="0.3"/>
              </svg>
            )}
          </button>
        </div>

        
        {/* Main Content - Centered */}
        <div className="flex-1 flex items-center justify-center px-6">
          <div className="max-w-6xl w-full grid lg:grid-cols-2 gap-16 items-center">
            
            {/* Left Side - Hero Content */}
            <div className="space-y-6">
              <div className="space-y-3">
                <h1 style={{ color: 'var(--primary-500)' }}>
                  Code Golf
                </h1>
                <h4 style={{ color: 'var(--text-700)' }}>
                  Master the art of concise coding
                </h4>
              </div>
              
              <p 
                className="text-lg leading-relaxed"
                style={{ color: 'var(--text-600)' }}
              >
                Challenge yourself to write the shortest, most elegant code possible. 
                Compete with developers worldwide and sharpen your problem-solving skills.
              </p>
              
              {/* Features */}
              <div className="grid gap-4 pt-2">
                <div className="flex items-center gap-4">
                  <div 
                    className="w-10 h-10 rounded-lg flex items-center justify-center shrink-0"
                    style={{ backgroundColor: 'var(--accent-500)' }}
                  >
                    <svg 
                      className="w-5 h-5" 
                      fill="none" 
                      stroke="currentColor" 
                      viewBox="0 0 24 24"
                      style={{ color: 'var(--background-50)' }}
                    >
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
                  </div>
                  <div>
                    <h5 style={{ color: 'var(--text-800)' }}>Creative Challenges</h5>
                    <p className="text-sm" style={{ color: 'var(--text-500)' }}>
                      Solve unique coding problems
                    </p>
                  </div>
                </div>
                
                <div className="flex items-center gap-4">
                  <div 
                    className="w-10 h-10 rounded-lg flex items-center justify-center shrink-0"
                    style={{ backgroundColor: 'var(--secondary-500)' }}
                  >
                    <svg 
                      className="w-5 h-5" 
                      fill="none" 
                      stroke="currentColor" 
                      viewBox="0 0 24 24"
                      style={{ color: 'var(--background-50)' }}
                    >
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
                    </svg>
                  </div>
                  <div>
                    <h5 style={{ color: 'var(--text-800)' }}>Global Leaderboard</h5>
                    <p className="text-sm" style={{ color: 'var(--text-500)' }}>
                      Compete with coders worldwide
                    </p>
                  </div>
                </div>
                
                <div className="flex items-center gap-4">
                  <div 
                    className="w-10 h-10 rounded-lg flex items-center justify-center shrink-0"
                    style={{ backgroundColor: 'var(--primary-500)' }}
                  >
                    <svg 
                      className="w-5 h-5" 
                      fill="none" 
                      stroke="currentColor" 
                      viewBox="0 0 24 24"
                      style={{ color: 'var(--background-50)' }}
                    >
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
                    </svg>
                  </div>
                  <div>
                    <h5 style={{ color: 'var(--text-800)' }}>Learn & Improve</h5>
                    <p className="text-sm" style={{ color: 'var(--text-500)' }}>
                      Study solutions from the best
                    </p>
                  </div>
                </div>
              </div>

              {/* Stats */}
              <div className="flex gap-8 pt-4">
                <div>
                  <h3 style={{ color: 'var(--accent-500)' }}>150+</h3>
                  <small style={{ color: 'var(--text-500)' }}>Challenges</small>
                </div>
                <div>
                  <h3 style={{ color: 'var(--secondary-500)' }}>2.5K+</h3>
                  <small style={{ color: 'var(--text-500)' }}>Developers</small>
                </div>
                <div>
                  <h3 style={{ color: 'var(--primary-500)' }}>15+</h3>
                  <small style={{ color: 'var(--text-500)' }}>Languages</small>
                </div>
              </div>
            </div>

            {/* Right Side - Auth Card */}
            <div 
              className="rounded-2xl p-10 shadow-2xl border max-w-md mx-auto w-full"
              style={{ 
                backgroundColor: 'var(--background-100)',
                borderColor: 'var(--background-300)'
              }}
            >
              <div className="text-center mb-8">
                <h2 style={{ color: 'var(--text-900)' }}>Welcome</h2>
                <p 
                  className="mt-2"
                  style={{ color: 'var(--text-600)' }}
                >
                  Sign in to start your coding journey
                </p>
              </div>

              {/* Auth Buttons */}
              <div className="space-y-4">
                <SignInButton mode="modal">
                  <button
                    className="w-full h-12 px-6 rounded-lg border transition-all hover:opacity-90 font-medium"
                    style={{
                      backgroundColor: "var(--background-200)",
                      borderColor: "var(--background-400)",
                      color: "var(--text-900)",
                    }}
                  >
                    Sign In
                  </button>
                </SignInButton>

                <div className="relative">
                  <div 
                    className="absolute inset-0 flex items-center"
                    aria-hidden="true"
                  >
                    <div 
                      className="w-full border-t"
                      style={{ borderColor: 'var(--background-300)' }}
                    />
                  </div>
                  <div className="relative flex justify-center text-sm">
                    <span 
                      className="px-3"
                      style={{ 
                        backgroundColor: 'var(--background-100)',
                        color: 'var(--text-500)'
                      }}
                    >
                      or
                    </span>
                  </div>
                </div>

                <SignUpButton mode="modal">
                  <button
                    className="w-full h-12 px-6 rounded-lg transition-all hover:opacity-90 font-medium shadow-lg"
                    style={{
                      backgroundColor: "var(--primary-500)",
                      color: "var(--background-50)",
                    }}
                  >
                    Create Account
                  </button>
                </SignUpButton>
              </div>

              {/* Features Grid */}
              <div className="grid grid-cols-2 gap-3 mt-8">
                <div 
                  className="text-center p-3 rounded-lg"
                  style={{ backgroundColor: 'var(--background-200)' }}
                >
                  <p className="text-2xl mb-1">⚡</p>
                  <small style={{ color: 'var(--text-600)' }}>Fast Setup</small>
                </div>
                <div 
                  className="text-center p-3 rounded-lg"
                  style={{ backgroundColor: 'var(--background-200)' }}
                >
                  <p className="text-2xl mb-1">🏆</p>
                  <small style={{ color: 'var(--text-600)' }}>Compete</small>
                </div>
                <div 
                  className="text-center p-3 rounded-lg"
                  style={{ backgroundColor: 'var(--background-200)' }}
                >
                  <p className="text-2xl mb-1">🎯</p>
                  <small style={{ color: 'var(--text-600)' }}>Practice</small>
                </div>
                <div 
                  className="text-center p-3 rounded-lg"
                  style={{ backgroundColor: 'var(--background-200)' }}
                >
                  <p className="text-2xl mb-1">📊</p>
                  <small style={{ color: 'var(--text-600)' }}>Track Stats</small>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </SignedOut>
  );
}
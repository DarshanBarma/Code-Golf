'use client';

import { SignedIn, SignedOut, useUser } from '@clerk/nextjs';
import { useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';
import { useMutation, useQuery } from 'convex/react';
import { api } from '@/convex/_generated/api';
import { UserSync } from './components/UserSync';

export default function Home() {
  const router = useRouter();
  const { isLoaded, isSignedIn, user } = useUser();
  const [theme, setTheme] = useState('light');
  const createSoloMatch = useMutation(api.matches.createSoloMatch);
  const activeMatch = useQuery(
    api.matches.getActiveMatch,
    user?.id ? { clerkId: user.id } : "skip"
  );

  useEffect(() => {
    if (isLoaded) {
      if (!isSignedIn) {
        router.push('/auth');
      }
    }
  }, [isLoaded, isSignedIn, router]);

  useEffect(() => {
    const savedTheme = localStorage.getItem('theme') || 'light';
    setTheme(savedTheme);
    document.documentElement.setAttribute('data-theme', savedTheme);
  }, []);

  useEffect(() => {
    if (activeMatch) {
      router.push(`/challenge/${activeMatch._id}`);
    }
  }, [activeMatch, router]);

  const handleNewChallenge = async () => {
    if (!user) return;
    
    try {
      const matchId = await createSoloMatch({
        clerkId: user.id,
        difficulty: 'easy',
      });
      router.push(`/challenge/${matchId}`);
    } catch (error) {
      console.error('Failed to create match:', error);
    }
  };

  const handleFindMatch = () => {
    router.push('/matchmaking');
  };

  const handleViewProblems = () => {
    router.push('/problems');
  };

  const handleViewProfile = () => {
    router.push('/profile');
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
    <>
      <SignedOut>
        <div className="min-h-screen flex items-center justify-center"
          style={{ backgroundColor: 'var(--background-50)' }}>
          <p>Redirecting to auth...</p>
        </div>
      </SignedOut>
      <SignedIn>
        <UserSync />
        <div 
          className="min-h-screen"
          style={{ backgroundColor: 'var(--background-50)' }}
        >
          {/* Hero Section */}
          <div className="container mx-auto px-6 py-16">
            <div className="text-center mb-16">
              <h1 
                className="mb-6"
                style={{ color: 'var(--primary-500)' }}
              >
                Code Golf
              </h1>
              <h3 
                className="mb-4"
                style={{ color: 'var(--text-800)' }}
              >
                Challenge Yourself. Compete with Others.
              </h3>
              <p 
                className="text-lg max-w-2xl mx-auto"
                style={{ color: 'var(--text-600)' }}
              >
                Write the shortest code possible to solve programming challenges. 
                Compete solo or face off against other developers in real-time.
              </p>
            </div>

            {/* Action Cards */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 max-w-6xl mx-auto">
              {/* New Challenge */}
              <button
                onClick={handleNewChallenge}
                className="p-8 rounded-xl border transition-all hover:shadow-xl transform hover:scale-105"
                style={{ 
                  backgroundColor: 'var(--primary-500)',
                  borderColor: 'var(--primary-600)',
                  color: 'var(--background-50)'
                }}
              >
                <div className="text-5xl mb-4">⚡</div>
                <h4 className="mb-2">New Challenge</h4>
                <p className="text-sm opacity-90">
                  Start a solo coding challenge
                </p>
              </button>

              {/* Find Match */}
              <button
                onClick={handleFindMatch}
                className="p-8 rounded-xl border transition-all hover:shadow-xl transform hover:scale-105"
                style={{ 
                  backgroundColor: 'var(--secondary-500)',
                  borderColor: 'var(--secondary-600)',
                  color: 'var(--background-50)'
                }}
              >
                <div className="text-5xl mb-4">🎯</div>
                <h4 className="mb-2">Find Match</h4>
                <p className="text-sm opacity-90">
                  Compete 1v1 with another player
                </p>
              </button>

              {/* View Problems */}
              <button
                onClick={handleViewProblems}
                className="p-8 rounded-xl border transition-all hover:shadow-xl transform hover:scale-105"
                style={{ 
                  backgroundColor: 'var(--background-100)',
                  borderColor: 'var(--background-300)'
                }}
              >
                <div className="text-5xl mb-4">📚</div>
                <h4 style={{ color: 'var(--text-900)' }} className="mb-2">View Problems</h4>
                <p className="text-sm" style={{ color: 'var(--text-600)' }}>
                  Browse all challenges
                </p>
              </button>

              {/* Profile */}
              <button
                onClick={handleViewProfile}
                className="p-8 rounded-xl border transition-all hover:shadow-xl transform hover:scale-105"
                style={{ 
                  backgroundColor: 'var(--background-100)',
                  borderColor: 'var(--background-300)'
                }}
              >
                <div className="text-5xl mb-4">👤</div>
                <h4 style={{ color: 'var(--text-900)' }} className="mb-2">Profile</h4>
                <p className="text-sm" style={{ color: 'var(--text-600)' }}>
                  View your stats & history
                </p>
              </button>
            </div>

            {/* Features Section */}
            <div className="mt-24 grid grid-cols-1 md:grid-cols-3 gap-8 max-w-5xl mx-auto">
              <div className="text-center">
                <div 
                  className="w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4"
                  style={{ backgroundColor: 'var(--accent-500)' }}
                >
                  <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24" style={{ color: 'var(--background-50)' }}>
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
                  </svg>
                </div>
                <h5 style={{ color: 'var(--text-900)' }}>Real-time Matches</h5>
                <p style={{ color: 'var(--text-600)' }} className="mt-2">
                  Compete simultaneously with opponents in live coding battles
                </p>
              </div>

              <div className="text-center">
                <div 
                  className="w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4"
                  style={{ backgroundColor: 'var(--secondary-500)' }}
                >
                  <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24" style={{ color: 'var(--background-50)' }}>
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                </div>
                <h5 style={{ color: 'var(--text-900)' }}>Auto Judging</h5>
                <p style={{ color: 'var(--text-600)' }} className="mt-2">
                  Instant feedback with automated test case validation
                </p>
              </div>

              <div className="text-center">
                <div 
                  className="w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4"
                  style={{ backgroundColor: 'var(--primary-500)' }}
                >
                  <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24" style={{ color: 'var(--background-50)' }}>
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
                  </svg>
                </div>
                <h5 style={{ color: 'var(--text-900)' }}>Learn & Improve</h5>
                <p style={{ color: 'var(--text-600)' }} className="mt-2">
                  Study solutions and master code optimization techniques
                </p>
              </div>
            </div>
          </div>
        </div>
      </SignedIn>
    </>
  );
}
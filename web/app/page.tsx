'use client';

import { SignedIn, useUser } from '@clerk/nextjs';
import { useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';
import { useQuery } from 'convex/react';
import { api } from '@/convex/_generated/api';
import { Header } from './components/Header';
import { StatCard } from './components/StatCard';
import { ChallengeCard } from './components/ChallengeCard';
import { UserSync } from './components/UserSync';
import { useUserStats } from './hooks/useUserStats';
import { Difficulty } from '@/types';

export default function Home() {
  const router = useRouter();
  const { isLoaded, isSignedIn } = useUser();
  const [theme, setTheme] = useState('light');
  const userStats = useUserStats();
  const featuredProblems = useQuery(api.problems.getFeaturedProblems, { limit: 2 });

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
      <UserSync />
      <div 
        className="min-h-screen"
        style={{ backgroundColor: 'var(--background-50)' }}
      >
        <Header theme={theme} onThemeToggle={toggleTheme} />

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
            <StatCard
              title="Challenges Solved"
              value={userStats?.challengesSolved ?? 0}
              iconBgColor="var(--primary-500)"
              icon={
                <svg 
                  className="w-8 h-8" 
                  fill="none" 
                  stroke="currentColor" 
                  viewBox="0 0 24 24"
                  style={{ color: 'var(--background-50)' }}
                >
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
              }
            />

            <StatCard
              title="Total Score"
              value={userStats?.totalScore ?? 0}
              iconBgColor="var(--primary-500)"
              icon={
                <svg 
                  className="w-8 h-8" 
                  fill="none" 
                  stroke="currentColor" 
                  viewBox="0 0 24 24"
                  style={{ color: 'var(--background-50)' }}
                >
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
                </svg>
              }
            />

            <StatCard
              title="Global Rank"
              value={userStats?.globalRank ?? '-'}
              iconBgColor="var(--primary-500)"
              icon={
                <svg 
                  className="w-8 h-8" 
                  fill="none" 
                  stroke="currentColor" 
                  viewBox="0 0 24 24"
                  style={{ color: 'var(--background-50)' }}
                >
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z" />
                </svg>
              }
            />

            {/* Featured Challenges Section */}
            <div className="col-span-full mt-6">
              <h3 
                className="mb-6"
                style={{ color: 'var(--text-900)' }}
              >
                Featured Challenges
              </h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {featuredProblems && featuredProblems.length > 0 ? (
                  featuredProblems.map((problem) => (
                    <ChallengeCard
                      key={problem._id}
                      title={problem.title}
                      description={problem.description}
                      difficulty={problem.difficulty as Difficulty}
                      languages={['JavaScript', 'Python', 'Java']}
                      onClick={() => console.log('Navigate to problem:', problem._id)}
                    />
                  ))
                ) : (
                  <>
                    <ChallengeCard
                      title="FizzBuzz Mastery"
                      description="Write the shortest FizzBuzz implementation possible."
                      difficulty="Easy"
                      languages={['JavaScript', 'Python']}
                    />
                    <ChallengeCard
                      title="Palindrome Checker"
                      description="Check if a string is a palindrome with minimal code."
                      difficulty="Medium"
                      languages={['JavaScript', 'Python']}
                    />
                  </>
                )}
              </div>
            </div>
          </div>
        </main>
      </div>
    </SignedIn>
  );
}
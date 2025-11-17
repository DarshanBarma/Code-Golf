'use client';

import { useUser } from '@clerk/nextjs';
import { useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';
import { useMutation, useQuery } from 'convex/react';
import { api } from '@/convex/_generated/api';

export default function MatchmakingPage() {
  const router = useRouter();
  const { user } = useUser();
  const [difficulty, setDifficulty] = useState('easy');
  const joinQueue = useMutation(api.matchmaking.joinQueue);
  const cancelQueue = useMutation(api.matchmaking.cancelQueue);
  const queuePosition = useQuery(
    api.matchmaking.getQueuePosition,
    user?.id ? { clerkId: user.id } : "skip"
  );
  const matchId = useQuery(
    api.matchmaking.checkMatchStatus,
    user?.id ? { clerkId: user.id } : "skip"
  );

  useEffect(() => {
    if (!user) {
      router.push('/auth');
      return;
    }

    // Auto join queue
    joinQueue({
      clerkId: user.id,
      difficulty,
    });
  }, [user, difficulty, joinQueue]);

  useEffect(() => {
    if (matchId) {
      router.push(`/challenge/${matchId}`);
    }
  }, [matchId, router]);

  const handleCancel = async () => {
    if (!user) return;
    await cancelQueue({ clerkId: user.id });
    router.push('/');
  };

  return (
    <div 
      className="min-h-screen flex items-center justify-center"
      style={{ backgroundColor: 'var(--background-50)' }}
    >
      <div 
        className="max-w-md w-full p-8 rounded-xl border shadow-xl text-center"
        style={{ 
          backgroundColor: 'var(--background-100)',
          borderColor: 'var(--background-300)'
        }}
      >
        {/* Animated Icon */}
        <div className="mb-8">
          <div 
            className="w-24 h-24 mx-auto rounded-full flex items-center justify-center animate-pulse"
            style={{ backgroundColor: 'var(--primary-500)' }}
          >
            <svg 
              className="w-12 h-12 animate-spin" 
              fill="none" 
              stroke="currentColor" 
              viewBox="0 0 24 24"
              style={{ color: 'var(--background-50)' }}
            >
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
            </svg>
          </div>
        </div>

        <h2 style={{ color: 'var(--text-900)' }} className="mb-4">
          Finding Opponent...
        </h2>
        
        <p style={{ color: 'var(--text-600)' }} className="mb-6">
          {queuePosition ? (
            <>
              Queue Position: {queuePosition.position} of {queuePosition.total}
              <br />
              Difficulty: {queuePosition.difficulty}
            </>
          ) : (
            'Joining matchmaking queue...'
          )}
        </p>

        {/* Difficulty Selector */}
        <div className="mb-6">
          <label style={{ color: 'var(--text-700)' }} className="block mb-2 text-sm">
            Difficulty Level
          </label>
          <select
            value={difficulty}
            onChange={(e) => setDifficulty(e.target.value)}
            className="w-full p-3 rounded-lg border"
            style={{
              backgroundColor: 'var(--background-50)',
              borderColor: 'var(--background-400)',
              color: 'var(--text-900)'
            }}
          >
            <option value="easy">Easy</option>
            <option value="medium">Medium</option>
            <option value="hard">Hard</option>
          </select>
        </div>

        {/* Loading Animation */}
        <div className="mb-8 flex justify-center gap-2">
          <div className="w-3 h-3 rounded-full animate-bounce" style={{ backgroundColor: 'var(--primary-500)', animationDelay: '0ms' }}></div>
          <div className="w-3 h-3 rounded-full animate-bounce" style={{ backgroundColor: 'var(--secondary-500)', animationDelay: '150ms' }}></div>
          <div className="w-3 h-3 rounded-full animate-bounce" style={{ backgroundColor: 'var(--accent-500)', animationDelay: '300ms' }}></div>
        </div>

        <button
          onClick={handleCancel}
          className="w-full py-3 px-6 rounded-lg border transition-all hover:opacity-80"
          style={{
            backgroundColor: 'var(--background-200)',
            borderColor: 'var(--background-400)',
            color: 'var(--text-900)'
          }}
        >
          Cancel
        </button>
      </div>
    </div>
  );
}

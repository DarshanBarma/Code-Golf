'use client';

import { useUser } from '@clerk/nextjs';
import { useQuery } from 'convex/react';
import { api } from '@/convex/_generated/api';
import { useRouter } from 'next/navigation';

export default function ProfilePage() {
  const { user } = useUser();
  const router = useRouter();
  const userData = useQuery(
    api.users.getUserByClerkId,
    user?.id ? { clerkId: user.id } : "skip"
  );

  if (!user || !userData) {
    return (
      <div className="min-h-screen flex items-center justify-center" style={{ backgroundColor: 'var(--background-50)' }}>
        <p style={{ color: 'var(--text-600)' }}>Loading...</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen" style={{ backgroundColor: 'var(--background-50)' }}>
      <div className="container mx-auto px-6 py-8 max-w-6xl">
        {/* Header */}
        <div className="mb-8 p-8 rounded-xl border" style={{ backgroundColor: 'var(--background-100)', borderColor: 'var(--background-300)' }}>
          <div className="flex items-center gap-6">
            <img
              src={user.imageUrl}
              alt={userData.username || 'User'}
              className="w-24 h-24 rounded-full border-4"
              style={{ borderColor: 'var(--primary-500)' }}
            />
            <div>
              <h2 style={{ color: 'var(--text-900)' }} className="mb-2">
                {userData.username || 'Anonymous'}
              </h2>
              <p style={{ color: 'var(--text-600)' }}>{userData.email}</p>
            </div>
          </div>
        </div>

        {/* Stats Grid */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
          <div className="p-6 rounded-xl border text-center" style={{ backgroundColor: 'var(--background-100)', borderColor: 'var(--background-300)' }}>
            <p className="text-sm mb-2" style={{ color: 'var(--text-600)' }}>Rating</p>
            <p className="text-3xl font-bold" style={{ color: 'var(--primary-500)' }}>
              {userData.rating}
            </p>
          </div>
          <div className="p-6 rounded-xl border text-center" style={{ backgroundColor: 'var(--background-100)', borderColor: 'var(--background-300)' }}>
            <p className="text-sm mb-2" style={{ color: 'var(--text-600)' }}>Wins</p>
            <p className="text-3xl font-bold" style={{ color: 'var(--accent-500)' }}>
              {userData.wins}
            </p>
          </div>
          <div className="p-6 rounded-xl border text-center" style={{ backgroundColor: 'var(--background-100)', borderColor: 'var(--background-300)' }}>
            <p className="text-sm mb-2" style={{ color: 'var(--text-600)' }}>Losses</p>
            <p className="text-3xl font-bold" style={{ color: 'var(--secondary-500)' }}>
              {userData.losses}
            </p>
          </div>
          <div className="p-6 rounded-xl border text-center" style={{ backgroundColor: 'var(--background-100)', borderColor: 'var(--background-300)' }}>
            <p className="text-sm mb-2" style={{ color: 'var(--text-600)' }}>Win Rate</p>
            <p className="text-3xl font-bold" style={{ color: 'var(--text-900)' }}>
              {userData.wins + userData.losses > 0
                ? Math.round((userData.wins / (userData.wins + userData.losses)) * 100)
                : 0}%
            </p>
          </div>
        </div>

        {/* Achievements / Badges */}
        <div className="p-8 rounded-xl border" style={{ backgroundColor: 'var(--background-100)', borderColor: 'var(--background-300)' }}>
          <h3 style={{ color: 'var(--text-900)' }} className="mb-6">
            Achievements
          </h3>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {userData.wins >= 1 && (
              <div className="p-4 rounded-lg border text-center" style={{ backgroundColor: 'var(--background-50)', borderColor: 'var(--accent-500)' }}>
                <div className="text-3xl mb-2">🏆</div>
                <p className="text-sm" style={{ color: 'var(--text-900)' }}>First Win</p>
              </div>
            )}
            {userData.wins >= 10 && (
              <div className="p-4 rounded-lg border text-center" style={{ backgroundColor: 'var(--background-50)', borderColor: 'var(--accent-500)' }}>
                <div className="text-3xl mb-2">⭐</div>
                <p className="text-sm" style={{ color: 'var(--text-900)' }}>10 Wins</p>
              </div>
            )}
            {userData.rating >= 1500 && (
              <div className="p-4 rounded-lg border text-center" style={{ backgroundColor: 'var(--background-50)', borderColor: 'var(--primary-500)' }}>
                <div className="text-3xl mb-2">💎</div>
                <p className="text-sm" style={{ color: 'var(--text-900)' }}>Expert</p>
              </div>
            )}
            {userData.wins + userData.losses >= 50 && (
              <div className="p-4 rounded-lg border text-center" style={{ backgroundColor: 'var(--background-50)', borderColor: 'var(--secondary-500)' }}>
                <div className="text-3xl mb-2">🔥</div>
                <p className="text-sm" style={{ color: 'var(--text-900)' }}>Veteran</p>
              </div>
            )}
          </div>
          {userData.wins === 0 && userData.losses === 0 && (
            <p className="text-center py-8" style={{ color: 'var(--text-600)' }}>
              Complete your first match to earn achievements!
            </p>
          )}
        </div>
      </div>
    </div>
  );
}

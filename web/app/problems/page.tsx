'use client';

import { useRouter } from 'next/navigation';
import { useQuery } from 'convex/react';
import { api } from '@/convex/_generated/api';
import { useState } from 'react';

export default function ProblemsPage() {
  const router = useRouter();
  const [difficulty, setDifficulty] = useState<string>('');
  const problems = useQuery(api.problems.listProblems, {
    difficulty: difficulty || undefined,
    limit: 50,
  });

  return (
    <div 
      className="min-h-screen"
      style={{ backgroundColor: 'var(--background-50)' }}
    >
      <div className="container mx-auto px-6 py-8">
        {/* Header */}
        <div className="mb-8">
          <h2 style={{ color: 'var(--text-900)' }} className="mb-4">
            All Problems
          </h2>
          
          {/* Filter */}
          <div className="flex gap-4">
            <button
              onClick={() => setDifficulty('')}
              className={`px-4 py-2 rounded-lg border transition-all`}
              style={{
                backgroundColor: difficulty === '' ? 'var(--primary-500)' : 'var(--background-100)',
                borderColor: 'var(--background-300)',
                color: difficulty === '' ? 'var(--background-50)' : 'var(--text-900)'
              }}
            >
              All
            </button>
            <button
              onClick={() => setDifficulty('easy')}
              className={`px-4 py-2 rounded-lg border transition-all`}
              style={{
                backgroundColor: difficulty === 'easy' ? 'var(--accent-500)' : 'var(--background-100)',
                borderColor: 'var(--background-300)',
                color: difficulty === 'easy' ? 'var(--background-50)' : 'var(--text-900)'
              }}
            >
              Easy
            </button>
            <button
              onClick={() => setDifficulty('medium')}
              className={`px-4 py-2 rounded-lg border transition-all`}
              style={{
                backgroundColor: difficulty === 'medium' ? 'var(--secondary-500)' : 'var(--background-100)',
                borderColor: 'var(--background-300)',
                color: difficulty === 'medium' ? 'var(--background-50)' : 'var(--text-900)'
              }}
            >
              Medium
            </button>
            <button
              onClick={() => setDifficulty('hard')}
              className={`px-4 py-2 rounded-lg border transition-all`}
              style={{
                backgroundColor: difficulty === 'hard' ? 'var(--primary-700)' : 'var(--background-100)',
                borderColor: 'var(--background-300)',
                color: difficulty === 'hard' ? 'var(--background-50)' : 'var(--text-900)'
              }}
            >
              Hard
            </button>
          </div>
        </div>

        {/* Problems Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {problems?.map((problem) => (
            <div
              key={problem._id}
              onClick={() => router.push(`/problems/${problem._id}`)}
              className="p-6 rounded-xl border cursor-pointer transition-all hover:shadow-lg"
              style={{
                backgroundColor: 'var(--background-100)',
                borderColor: 'var(--background-300)'
              }}
            >
              <div className="flex items-start justify-between mb-3">
                <h4 style={{ color: 'var(--text-900)' }}>{problem.title}</h4>
                <span
                  className="px-3 py-1 rounded-full text-xs font-medium capitalize"
                  style={{
                    backgroundColor: problem.difficulty === 'easy' ? 'var(--accent-500)' :
                                   problem.difficulty === 'medium' ? 'var(--secondary-500)' :
                                   'var(--primary-700)',
                    color: 'var(--background-50)'
                  }}
                >
                  {problem.difficulty}
                </span>
              </div>
              <p 
                className="line-clamp-2"
                style={{ color: 'var(--text-600)' }}
              >
                {problem.description}
              </p>
              <div className="mt-4 flex items-center gap-2">
                <span className="text-xs" style={{ color: 'var(--text-500)' }}>
                  {problem.tests?.length || 0} test cases
                </span>
              </div>
            </div>
          ))}
        </div>

        {!problems || problems.length === 0 && (
          <div className="text-center py-16">
            <p style={{ color: 'var(--text-600)' }}>
              No problems found
            </p>
          </div>
        )}
      </div>
    </div>
  );
}

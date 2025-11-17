'use client';

import { useQuery } from 'convex/react';
import { api } from '@/convex/_generated/api';
import { Id } from '@/convex/_generated/dataModel';
import { useParams, useRouter } from 'next/navigation';

export default function ProblemDetailPage() {
  const params = useParams();
  const router = useRouter();
  const id = Number(params.id);
  const problem = useQuery(api.problems.getProblemById, { id });

  if (!problem) {
    return (
      <div className="min-h-screen flex items-center justify-center" style={{ backgroundColor: 'var(--background-50)' }}>
        <p style={{ color: 'var(--text-600)' }}>Loading...</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen" style={{ backgroundColor: 'var(--background-50)' }}>
      <div className="container mx-auto px-6 py-8 max-w-4xl">
        <button
          onClick={() => router.back()}
          className="mb-6 flex items-center gap-2 px-4 py-2 rounded-lg border transition-all hover:opacity-80"
          style={{
            backgroundColor: 'var(--background-100)',
            borderColor: 'var(--background-300)',
            color: 'var(--text-900)'
          }}
        >
          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
          </svg>
          Back
        </button>

        <div className="p-8 rounded-xl border" style={{ backgroundColor: 'var(--background-100)', borderColor: 'var(--background-300)' }}>
          {/* Header */}
          <div className="flex items-start justify-between mb-6">
            <h2 style={{ color: 'var(--text-900)' }}>{problem.title}</h2>
            <span
              className="px-4 py-2 rounded-full text-sm font-medium capitalize"
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

          {/* Description */}
          <div className="mb-8">
            <h4 className="mb-3" style={{ color: 'var(--text-800)' }}>Description</h4>
            <p className="whitespace-pre-wrap" style={{ color: 'var(--text-700)' }}>
              {problem.description}
            </p>
          </div>

          {/* Test Cases */}
          <div>
            <h4 className="mb-3" style={{ color: 'var(--text-800)' }}>Test Cases</h4>
            <div className="space-y-4">
              {problem.tests?.map((test, idx) => (
                <div
                  key={idx}
                  className="p-4 rounded-lg border"
                  style={{
                    backgroundColor: 'var(--background-50)',
                    borderColor: 'var(--background-300)'
                  }}
                >
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <p className="text-sm mb-2" style={{ color: 'var(--text-600)' }}>Input</p>
                      <code
                        className="block p-2 rounded text-sm font-mono"
                        style={{
                          backgroundColor: 'var(--background-100)',
                          color: 'var(--text-900)'
                        }}
                      >
                        {test.stdin || 'No input'}
                      </code>
                    </div>
                    <div>
                      <p className="text-sm mb-2" style={{ color: 'var(--text-600)' }}>Expected Output</p>
                      <code
                        className="block p-2 rounded text-sm font-mono"
                        style={{
                          backgroundColor: 'var(--background-100)',
                          color: 'var(--text-900)'
                        }}
                      >
                        {test.expected_output}
                      </code>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

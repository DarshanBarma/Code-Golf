'use client';

import { useUser } from '@clerk/nextjs';
import { useRouter, useParams } from 'next/navigation';
import { useQuery, useMutation } from 'convex/react';
import { api } from '@/convex/_generated/api';
import { Id } from '@/convex/_generated/dataModel';
import { useEffect, useState } from 'react';
import dynamic from 'next/dynamic';

// Dynamically import Monaco to avoid SSR issues
const MonacoEditor = dynamic(() => import('@monaco-editor/react'), {
  ssr: false,
  loading: () => <div className="h-full flex items-center justify-center">Loading editor...</div>,
});

export default function ChallengePage() {
  const { user } = useUser();
  const router = useRouter();
  const params = useParams();
  const matchId = params.matchId as Id<"matches">;
  
  const match = useQuery(api.matches.getMatch, { matchId });
  const submitCode = useMutation(api.submissions.saveSubmission);
  const abandonMatch = useMutation(api.matches.abandonMatch);
  
  const [code, setCode] = useState('// Write your code here\n');
  const [language, setLanguage] = useState('python');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [remainingTime, setRemainingTime] = useState(0);

  // Update timer
  useEffect(() => {
    if (!match) return;
    
    const updateTimer = () => {
      const now = Date.now();
      const remaining = Math.max(0, Math.floor((match.endsAt - now) / 1000));
      setRemainingTime(remaining);
      
      if (remaining === 0 && match.status === 'active') {
        // Match ended
        router.push('/');
      }
    };
    
    updateTimer();
    const interval = setInterval(updateTimer, 1000);
    return () => clearInterval(interval);
  }, [match, router]);

  // Check if user is authorized
  useEffect(() => {
    if (!user || !match) return;
    
    const isPlayer1 = match.player1ClerkId === user.id;
    const isPlayer2 = match.player2ClerkId === user.id;
    
    if (!isPlayer1 && !isPlayer2) {
      router.push('/');
    }
  }, [user, match, router]);

  const handleSubmit = async () => {
    if (!user || !match || isSubmitting) return;
    
    setIsSubmitting(true);
    
    try {
      // Save the submission
      const submissionId = await submitCode({
        matchId,
        clerkId: user.id,
        code,
        language,
        passed: true, // Placeholder - will be validated by Judge0 later
      });
      
      alert(`✅ Code submitted! Length: ${code.length} characters`);
      router.push('/');
    } catch (error) {
      console.error('Submission error:', error);
      alert('Failed to submit code. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleAbandon = async () => {
    if (!user || !match) return;
    
    if (confirm('Are you sure you want to abandon this match?')) {
      await abandonMatch({ matchId, clerkId: user.id });
      router.push('/');
    }
  };

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  if (!match || !user) {
    return (
      <div className="min-h-screen flex items-center justify-center" style={{ backgroundColor: 'var(--background-50)' }}>
        <p style={{ color: 'var(--text-600)' }}>Loading challenge...</p>
      </div>
    );
  }

  const isPlayer1 = match.player1ClerkId === user.id;
  const hasSubmitted = isPlayer1 ? match.player1Submitted : match.player2Submitted;

  return (
    <div className="min-h-screen" style={{ backgroundColor: 'var(--background-50)' }}>
      <div className="flex flex-col h-screen">
        {/* Header */}
        <div 
          className="px-6 py-4 border-b flex items-center justify-between"
          style={{ 
            backgroundColor: 'var(--background-100)',
            borderColor: 'var(--background-300)'
          }}
        >
          <div className="flex items-center gap-4">
            <h3 style={{ color: 'var(--text-900)' }}>{match.problem?.title || 'Loading...'}</h3>
            <span
              className="px-3 py-1 rounded-full text-sm capitalize"
              style={{
                backgroundColor: match.difficulty === 'easy' ? 'var(--accent-500)' :
                               match.difficulty === 'medium' ? 'var(--secondary-500)' :
                               'var(--primary-700)',
                color: 'var(--background-50)'
              }}
            >
              {match.difficulty}
            </span>
            <span
              className="px-3 py-1 rounded-full text-sm"
              style={{
                backgroundColor: 'var(--background-200)',
                color: 'var(--text-900)'
              }}
            >
              {match.mode === 'solo' ? '🎯 Solo' : '⚔️ 1v1'}
            </span>
          </div>
          
          <div className="flex items-center gap-4">
            {/* Timer */}
            <div 
              className="px-4 py-2 rounded-lg font-mono text-xl font-bold"
              style={{
                backgroundColor: remainingTime < 60 ? 'var(--danger-500)' : 'var(--primary-500)',
                color: 'var(--background-50)'
              }}
            >
              ⏱ {formatTime(remainingTime)}
            </div>
            
            <button
              onClick={handleAbandon}
              className="px-4 py-2 rounded-lg border transition-all hover:opacity-80"
              style={{
                backgroundColor: 'var(--background-200)',
                borderColor: 'var(--background-400)',
                color: 'var(--text-900)'
              }}
            >
              Abandon
            </button>
          </div>
        </div>

        {/* Main Content */}
        <div className="flex-1 flex overflow-hidden">
          {/* Left Panel - Problem */}
          <div 
            className="w-1/2 border-r overflow-y-auto"
            style={{ borderColor: 'var(--background-300)' }}
          >
            <div className="p-6">
              <h4 className="mb-4" style={{ color: 'var(--text-900)' }}>Description</h4>
              <p 
                className="whitespace-pre-wrap mb-6"
                style={{ color: 'var(--text-700)' }}
              >
                {match.problem?.description}
              </p>

              <h4 className="mb-4" style={{ color: 'var(--text-900)' }}>Test Cases</h4>
              <div className="space-y-3">
                {match.problem?.tests?.map((test, idx) => (
                  <div
                    key={idx}
                    className="p-4 rounded-lg border"
                    style={{
                      backgroundColor: 'var(--background-100)',
                      borderColor: 'var(--background-300)'
                    }}
                  >
                    <div className="grid grid-cols-2 gap-3">
                      <div>
                        <p className="text-xs mb-2" style={{ color: 'var(--text-600)' }}>Input</p>
                        <code
                          className="block p-2 rounded text-sm font-mono"
                          style={{
                            backgroundColor: 'var(--background-50)',
                            color: 'var(--text-900)'
                          }}
                        >
                          {test.stdin || 'No input'}
                        </code>
                      </div>
                      <div>
                        <p className="text-xs mb-2" style={{ color: 'var(--text-600)' }}>Expected Output</p>
                        <code
                          className="block p-2 rounded text-sm font-mono"
                          style={{
                            backgroundColor: 'var(--background-50)',
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

              {match.mode === '1v1' && (
                <div className="mt-6 p-4 rounded-lg" style={{ backgroundColor: 'var(--background-100)' }}>
                  <h4 className="mb-3" style={{ color: 'var(--text-900)' }}>Opponent Status</h4>
                  <div className="flex items-center gap-3">
                    <div className="flex items-center gap-2">
                      <div
                        className="w-3 h-3 rounded-full"
                        style={{
                          backgroundColor: match.player1Submitted ? 'var(--accent-500)' : 'var(--text-400)'
                        }}
                      />
                      <span style={{ color: 'var(--text-700)' }}>
                        Player 1 {isPlayer1 && '(You)'}
                      </span>
                    </div>
                    <div className="flex items-center gap-2">
                      <div
                        className="w-3 h-3 rounded-full"
                        style={{
                          backgroundColor: match.player2Submitted ? 'var(--accent-500)' : 'var(--text-400)'
                        }}
                      />
                      <span style={{ color: 'var(--text-700)' }}>
                        Player 2 {!isPlayer1 && '(You)'}
                      </span>
                    </div>
                  </div>
                </div>
              )}
            </div>
          </div>

          {/* Right Panel - Editor */}
          <div className="w-1/2 flex flex-col">
            {/* Editor Controls */}
            <div 
              className="px-6 py-3 border-b flex items-center gap-4"
              style={{ 
                backgroundColor: 'var(--background-100)',
                borderColor: 'var(--background-300)'
              }}
            >
              <label style={{ color: 'var(--text-700)' }}>Language:</label>
              <select
                value={language}
                onChange={(e) => setLanguage(e.target.value)}
                className="px-3 py-2 rounded-lg border"
                style={{
                  backgroundColor: 'var(--background-50)',
                  borderColor: 'var(--background-400)',
                  color: 'var(--text-900)'
                }}
              >
                <option value="python">Python</option>
                <option value="javascript">JavaScript</option>
                <option value="java">Java</option>
                <option value="cpp">C++</option>
                <option value="c">C</option>
              </select>
              
              <div className="flex-1" />
              
              <span className="text-sm" style={{ color: 'var(--text-600)' }}>
                {code.length} characters
              </span>
            </div>

            {/* Monaco Editor */}
            <div className="flex-1">
              <MonacoEditor
                height="100%"
                language={language}
                value={code}
                onChange={(value: string | undefined) => setCode(value || '')}
                theme="vs-dark"
                options={{
                  minimap: { enabled: false },
                  fontSize: 14,
                  lineNumbers: 'on',
                  roundedSelection: false,
                  scrollBeyondLastLine: false,
                  automaticLayout: true,
                }}
              />
            </div>

            {/* Submit Button */}
            <div 
              className="px-6 py-4 border-t"
              style={{ 
                backgroundColor: 'var(--background-100)',
                borderColor: 'var(--background-300)'
              }}
            >
              <button
                onClick={handleSubmit}
                disabled={isSubmitting || hasSubmitted}
                className="w-full py-3 rounded-lg font-medium transition-all disabled:opacity-50 disabled:cursor-not-allowed"
                style={{
                  backgroundColor: hasSubmitted ? 'var(--accent-500)' : 'var(--primary-500)',
                  color: 'var(--background-50)'
                }}
              >
                {isSubmitting ? '⏳ Submitting...' : hasSubmitted ? '✅ Submitted' : '🚀 Submit Code'}
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

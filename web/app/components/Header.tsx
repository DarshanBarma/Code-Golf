import { HeaderProps } from '@/types';

export function Header({ theme, onThemeToggle }: HeaderProps) {
  return (
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
            onClick={onThemeToggle}
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
  );
}

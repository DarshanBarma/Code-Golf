import { ChallengeCardProps, Difficulty } from '@/types';

export function ChallengeCard({ 
  title, 
  description, 
  difficulty, 
  languages,
  onClick 
}: ChallengeCardProps) {
  const getDifficultyColor = (): string => {
    switch (difficulty) {
      case 'Easy':
        return 'var(--accent-600)';
      case 'Medium':
        return 'var(--secondary-600)';
      case 'Hard':
        return 'var(--primary-700)';
      default:
        return 'var(--primary-500)';
    }
  };

  return (
    <div 
      className="rounded-xl p-6 border transition-all hover:shadow-lg cursor-pointer"
      style={{ 
        backgroundColor: 'var(--background-100)',
        borderColor: 'var(--background-300)'
      }}
      onClick={onClick}
    >
      <div className="flex items-start justify-between mb-4">
        <h4 style={{ color: 'var(--text-900)' }}>{title}</h4>
        <span 
          className="px-3 py-1 rounded-full text-xs font-medium"
          style={{ 
            backgroundColor: getDifficultyColor(),
            color: 'var(--background-50)'
          }}
        >
          {difficulty}
        </span>
      </div>
      <p 
        className="mb-4"
        style={{ color: 'var(--text-600)' }}
      >
        {description}
      </p>
      <div className="flex gap-2 flex-wrap">
        {languages.map((lang) => (
          <span 
            key={lang}
            className="px-3 py-1 rounded text-xs"
            style={{ 
              backgroundColor: 'var(--background-200)',
              color: 'var(--text-800)'
            }}
          >
            {lang}
          </span>
        ))}
      </div>
    </div>
  );
}

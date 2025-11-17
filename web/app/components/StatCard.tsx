import { StatCardProps } from '@/types';

export function StatCard({ title, value, icon, iconBgColor }: StatCardProps) {
  return (
    <div 
      className="rounded-xl p-6 shadow-lg border transition-all hover:shadow-xl"
      style={{ 
        backgroundColor: 'var(--background-100)',
        borderColor: 'var(--background-300)'
      }}
    >
      <div className="flex items-center justify-between">
        <div>
          <p style={{ color: 'var(--text-500)' }}>{title}</p>
          <h2 className="mt-2" style={{ color: 'var(--text-900)' }}>{value}</h2>
        </div>
        <div 
          className="p-4 rounded-lg"
          style={{ backgroundColor: iconBgColor }}
        >
          {icon}
        </div>
      </div>
    </div>
  );
}

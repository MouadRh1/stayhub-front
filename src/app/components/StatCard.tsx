import { LucideIcon } from 'lucide-react';

interface StatCardProps {
  title: string;
  value: string | number;
  icon: LucideIcon;
  trend?: {
    value: string;
    isPositive: boolean;
  };
  gradientFrom?: string;
  gradientTo?: string;
}

export function StatCard({
  title,
  value,
  icon: Icon,
  trend,
  gradientFrom = 'from-blue-600',
  gradientTo = 'to-purple-600'
}: StatCardProps) {
  return (
    <div className={`bg-gradient-to-br ${gradientFrom} ${gradientTo} rounded-2xl p-6 text-white shadow-lg hover:shadow-xl transition-shadow`}>
      <div className="flex items-center justify-between mb-2">
        <h3 className="opacity-90 text-sm font-medium">{title}</h3>
        <Icon className="w-6 h-6 opacity-80" />
      </div>
      <p className="text-4xl font-bold mb-2">{value}</p>
      {trend && (
        <p className={`text-sm opacity-80 ${trend.isPositive ? 'text-white' : 'text-white/70'}`}>
          {trend.value}
        </p>
      )}
    </div>
  );
}

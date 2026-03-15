const RARITY_CONFIG: Record<number, { label: string; color: string }> = {
  0: { label: 'Common', color: 'text-slate-300 border-slate-500' },
  1: { label: 'Rare', color: 'text-green-500 border-green-700' },
  2: { label: 'Epic', color: 'text-cyan-400 border-cyan-700' },
  3: { label: 'Legendary', color: 'text-purple-500 border-purple-700' },
  4: { label: 'Mythic', color: 'text-pink-500 border-pink-700' },
};

interface RarityBadgeProps {
  rarity: number;
  className?: string;
}

export function RarityBadge({ rarity, className }: RarityBadgeProps) {
  const config = RARITY_CONFIG[rarity] ?? RARITY_CONFIG[0]!;

  return (
    <span className={`text-xs border rounded px-1.5 py-0.5 ${config.color} ${className ?? ''}`}>
      {config.label}
    </span>
  );
}

export function getRarityColor(rarity: number): string {
  return RARITY_CONFIG[rarity]?.color.split(' ')[0] ?? 'text-slate-300';
}

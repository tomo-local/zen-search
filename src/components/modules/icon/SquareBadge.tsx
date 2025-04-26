interface BadgeProps {
  children: React.ReactNode; // バッジのラベル
  className?: string; // オプション: カスタムクラス
}

export default function SquareBadge({ children, className }: BadgeProps) {
  return (
    <div
      className={`inline-flex items-center px-2 py-1 text-xs font-medium text-white rounded-sm ${className}`}
    >
      {children}
    </div>
  );
}

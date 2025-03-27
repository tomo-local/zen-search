interface BadgeProps {
  label: string; // バッジのラベル
  count?: number; // オプション: カウント
  className?: string; // オプション: カスタムクラス
}

export default function Badge({ label, count, className }: BadgeProps) {
  return (
    <div
      className={`inline-flex items-center px-2 py-1 text-xs font-medium text-white rounded-full ${className}`}
    >
      <div>{label}</div>
      {count !== undefined && (
        <span className="ml-2 px-2 py-0.5 bg-gray-800 rounded-full">
          {count}
        </span>
      )}
    </div>
  );
}

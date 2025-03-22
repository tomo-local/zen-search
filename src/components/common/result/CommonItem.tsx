interface ResultItemProps {
  className?: string | undefined;
  children: React.ReactNode;
  leftContent?: React.ReactNode;
  rightContent?: React.ReactNode;
  isSelected: boolean;
}

export default function CommonItem({
  className,
  leftContent,
  rightContent,
  children,
}: ResultItemProps) {
  return (
    <div
      className={`
        flex items-center justify-between w-full px-4 py-2 text-left rounded-lg shadow-xl
        ${className}
      `}
    >
      <div className="flex items-center min-w-full space-x-2">
        {leftContent && <div className="flex-none">{leftContent}</div>}
        <div className="flex-1">{children}</div>
        {rightContent && <div className="flex-none">{rightContent}</div>}
      </div>
    </div>
  );
}

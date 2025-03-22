interface SearchInputProps {
  className?: string;
  value: string;
  leftContent?: React.ReactNode;
  rightContent?: React.ReactNode;

  onChange?: (event: React.ChangeEvent<HTMLInputElement>) => void;
  onCompositionStart: (e: React.CompositionEvent<HTMLInputElement>) => void;
  onCompositionEnd: (e: React.CompositionEvent<HTMLInputElement>) => void;
  onKeyDown?: (e: React.KeyboardEvent<HTMLInputElement>) => void;

  // MEMO: カスタムイベントを追加
  onArrowUpDownKeyDown?: (event: React.KeyboardEvent<HTMLInputElement>) => void;
  onEscapeKeyDown?: (event: React.KeyboardEvent<HTMLInputElement>) => void;
  onTabKeyDown?: (event: React.KeyboardEvent<HTMLInputElement>) => void;
  onEnterKeyDown?: (event: React.KeyboardEvent<HTMLInputElement>) => void;
  onBackspaceKeyDown?: (event: React.KeyboardEvent<HTMLInputElement>) => void;
}

export default function SearchInput({
  className,
  value,
  leftContent,
  rightContent,
  onChange,
  onKeyDown,
  onCompositionStart,
  onCompositionEnd,
  onArrowUpDownKeyDown,
  onEscapeKeyDown,
  onTabKeyDown,
  onEnterKeyDown,
  onBackspaceKeyDown,
}: SearchInputProps) {
  function handleKeyDown(e: React.KeyboardEvent<HTMLInputElement>) {
    if (e.key === "/") {
      e.preventDefault();
      onChange?.({ target: { value: value + "/" } } as any);
      return;
    }

    if (e.key === "Escape") {
      e.preventDefault();
      onEscapeKeyDown?.(e);
      return;
    }

    if (e.key === "ArrowUp" || e.key === "ArrowDown") {
      e.preventDefault();
      onArrowUpDownKeyDown?.(e);
      return;
    }

    if (e.key === "Tab") {
      e.preventDefault();
      onTabKeyDown?.(e);
      return;
    }

    if (e.key === "Enter") {
      e.preventDefault();
      onEnterKeyDown?.(e);
      return;
    }

    if (e.key === "Backspace") {
      onBackspaceKeyDown?.(e);
      return;
    }

    onKeyDown?.(e);
  }

  return (
    <div className="flex items-center">
      {leftContent && (
        <div className="flex items-center min-w-8">{leftContent}</div>
      )}
      <input
        type="text"
        value={value}
        placeholder="Search or Enter URL ..."
        className={`grow px-3 py-2 text-lg rounded-md focus:outline-none ${className}`}
        autoFocus
        onChange={onChange}
        onCompositionStart={onCompositionStart}
        onCompositionEnd={onCompositionEnd}
        onKeyDown={handleKeyDown}
      />
      {rightContent && (
        <div className="flex items-center min-w-8">{rightContent}</div>
      )}
    </div>
  );
}

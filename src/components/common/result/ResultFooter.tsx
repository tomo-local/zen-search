interface ResultFooterProps {
  className?: string;
  children?: React.ReactNode;
}

export default function ResultFooter({
  className,
  children,
}: ResultFooterProps) {
  return <div className={`py-1 ${className}`}>{children}</div>;
}

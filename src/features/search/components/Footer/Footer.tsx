export interface FooterProps {
  className?: string;
  children?: React.ReactNode;
}

export default function Footer({ className, children }: FooterProps) {
  return <div className={`py-1 ${className}`}>{children}</div>;
}

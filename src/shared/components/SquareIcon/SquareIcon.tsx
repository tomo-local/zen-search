interface SquareIconProps {
  className?: string | undefined;
  children: React.ReactNode;
}

const SquareIcon: React.FC<SquareIconProps> = ({
  className,
  children: icon,
}) => {
  return (
    <div
      className={`flex items-center justify-center rounded-lg p-2 ${className}`}
    >
      {icon}
    </div>
  );
};

export default SquareIcon;
export type { SquareIconProps };

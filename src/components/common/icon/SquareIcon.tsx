interface SquareIconProps {
  className?: string | undefined;
  children: React.ReactNode;
  onClick?: (e: React.MouseEvent<HTMLButtonElement>) => void;
}

const SquareIcon: React.FC<SquareIconProps> = ({
  className,
  children: icon,
  onClick,
}) => {
  return (
    <button
      type="button"
      className={`flex items-center justify-center rounded-lg p-2 ${
        !onClick ? "cursor-not-allowed" : ""
      } ${className}`}
      onClick={onClick}
      disabled={!onClick}
    >
      {icon}
    </button>
  );
};

export default SquareIcon;

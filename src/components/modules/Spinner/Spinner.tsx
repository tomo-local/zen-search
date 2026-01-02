export type SpinnerProps = {
  active: boolean;
  size?: "xs" | "sm" | "md" | "lg" | "xl"; // プリセットサイズ
};

const sizeMap = {
  xs: "w-5 h-5 border-2", // 20px
  sm: "w-7 h-7 border-3", // 30px
  md: "w-10 h-10 border-4", // 40px
  lg: "w-12 h-12 border-5", // 50px
  xl: "w-16 h-16 border-6", // 60px
};

const Spinner: React.FC<SpinnerProps> = ({ active, size = "md" }) => {
  if (!active) {
    return null;
  }

  const spinnerClass = sizeMap[size];

  return (
    <div className="flex justify-center">
      <div
        className={`rounded-full animate-spin border-sky-500 border-t-transparent ${spinnerClass}`}
      />
    </div>
  );
};

export default Spinner;

interface ButtonProps {
  type: "submit" | "reset" | "button" | undefined;
  label: string;
  onClick: () => void;
  fullWidth?: boolean;
  fontBold?: boolean;
}

const Button = ({
  type,
  label,
  onClick,
  fullWidth = false,
  fontBold = false,
}: ButtonProps) => {
  return (
    <button
      type={type}
      className={
        (fullWidth ? "w-full " : " ") +
        (fontBold ? "font-medium " : " ") +
        "bg-gray-900 hover:bg-gray-950 text-white  focus:ring-4 focus:outline-none focus:ring-primary-300 rounded-lg text-sm lg:text-md px-5 py-2.5 text-center"
      }
      onClick={onClick}
    >
      {label}
    </button>
  );
};

export default Button;

import React from "react";

interface Button3DProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: "primary" | "secondary";
  children: React.ReactNode;
}

export const Button3D: React.FC<Button3DProps> = ({
  variant = "primary",
  children,
  className = "",
  ...props
}) => {
  const baseStyles =
    "relative px-8 py-4 rounded-2xl font-black text-xl uppercase tracking-wider transition-all transform active:translate-y-2 active:border-b-0 outline-none select-none";

  const variants = {
    primary:
      "bg-[#D62412] text-white border-b-8 border-[#9e1b0d] hover:bg-[#e83522]",
    secondary:
      "bg-[#FFCE00] text-[#5a4a00] border-b-8 border-[#cba400] hover:bg-[#ffdb4d]",
  };

  return (
    <button
      className={`${baseStyles} ${variants[variant]} ${className}`}
      {...props}
    >
      {children}
    </button>
  );
};

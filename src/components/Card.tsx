import React from "react";

interface CardProps {
  children: React.ReactNode;
  className?: string;
  rotate?: "left" | "right" | "none";
  variant?: "glass" | "wood" | "white";
}

export const Card: React.FC<CardProps> = ({
  children,
  className = "",
  rotate = "none",
  variant = "white",
}) => {
  const rotations = {
    left: "-rotate-1 hover:rotate-0",
    right: "rotate-2 hover:rotate-0",
    none: "",
  };

  const variants = {
    white:
      "bg-white border-4 border-white/50 shadow-[0_10px_0_rgba(0,0,0,0.1)]",
    glass:
      "bg-white/30 backdrop-blur-md border-4 border-white/40 shadow-[0_10px_0_rgba(0,0,0,0.05)]",
    wood: "bg-[#DEB887] border-4 border-[#c19a6b] shadow-[0_10px_0_rgba(92,64,51,0.2)] text-[#5C4033]",
  };

  return (
    <div
      className={`
      relative rounded-3xl p-6 transition-all duration-300 ease-out transform hover:-translate-y-1
      ${rotations[rotate]} 
      ${variants[variant]}
      ${className}
    `}
    >
      {children}
    </div>
  );
};

import type { ReactNode, ButtonHTMLAttributes } from "react";

type ButtonProps = {
  children: ReactNode;
} & ButtonHTMLAttributes<HTMLButtonElement>;

export function Button({ children, ...props }: ButtonProps) {
  return (
    <button
      className="bg-[#84CCFF] px-4 py-2 text-white rounded hover:bg-[#5DB9FF]"
      {...props}
    >
      {children}
    </button>
  );
}

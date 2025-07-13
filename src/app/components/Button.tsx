import { ReactNode } from "react";

export default function Button({ children }: { children: ReactNode }) {
  return (
    <button
      className="px-6 py-3 rounded-2xl text-white bg-white/20 border border-white/30 backdrop-blur-md hover:bg-white/30 transition-all duration-300"
      style={{
        WebkitBackdropFilter: "blur(10px)",
        backdropFilter: "blur(10px)",
      }}
    >
      {children}
    </button>
  );
}

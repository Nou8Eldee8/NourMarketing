import { ReactNode } from "react";
import { motion } from "framer-motion";

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  children: ReactNode;
  className?: string;
  variant?: "primary" | "secondary"; // Added for future flexibility
}

export default function Button({ children, className = "", variant = "primary", ...props }: ButtonProps) {
  return (
    <motion.button
      className={`relative group overflow-hidden rounded-full px-8 py-4 font-semibold text-white transition-all duration-300 transform hover:shadow-[0_0_20px_rgba(255,255,255,0.3)] hover:border-white/40 active:scale-95 ${className}`}
      style={{
        backdropFilter: "blur(12px)",
        WebkitBackdropFilter: "blur(12px)",
        background: "rgba(255, 255, 255, 0.05)",
        border: "1px solid rgba(255, 255, 255, 0.1)",
        boxShadow: "0 4px 30px rgba(0, 0, 0, 0.1)",
      }}
      whileHover={{ scale: 1.02 }}
      whileTap={{ scale: 0.98 }}
      {...props as any}
    >
      {/* Liquid/Glass Reflection Gradient */}
      <div
        className="absolute inset-0 -z-10 opacity-50 group-hover:opacity-100 transition-opacity duration-500"
        style={{
          background: "linear-gradient(120deg, rgba(255,255,255,0) 30%, rgba(255,255,255,0.1) 40%, rgba(255,255,255,0.2) 50%, rgba(255,255,255,0.1) 60%, rgba(255,255,255,0) 70%)",
          backgroundSize: "200% 200%",
        }}
      >
        <motion.div
          className="w-full h-full"
          initial={{ backgroundPosition: "0% 50%" }}
          animate={{ backgroundPosition: ["0% 50%", "100% 50%", "0% 50%"] }}
          transition={{ duration: 5, ease: "linear", repeat: Infinity }}
        />
      </div>

      {/* Glossy Top Highlight */}
      <div className="absolute top-0 left-0 w-full h-[40%] bg-gradient-to-b from-white/10 to-transparent opacity-40 rounded-t-full pointer-events-none" />

      {/* Content */}
      <span className="relative z-10 flex items-center justify-center gap-2 drop-shadow-md">
        {children}
      </span>
    </motion.button>
  );
}

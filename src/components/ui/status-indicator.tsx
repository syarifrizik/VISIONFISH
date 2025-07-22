
import { Circle } from "lucide-react";

interface StatusIndicatorProps {
  status: "success" | "warning" | "error" | "neutral";
  size?: "sm" | "md" | "lg";
  pulse?: boolean;
  className?: string;
}

export const StatusIndicator = ({
  status,
  size = "md",
  pulse = true,
  className = ""
}: StatusIndicatorProps) => {
  const sizeClasses = {
    sm: "w-2 h-2",
    md: "w-3 h-3",
    lg: "w-4 h-4"
  };

  const statusClasses = {
    success: "text-green-500",
    warning: "text-yellow-500",
    error: "text-red-500",
    neutral: "text-gray-400"
  };

  return (
    <div className={`relative inline-block ${className}`}>
      <Circle 
        className={`
          fill-current ${sizeClasses[size]} ${statusClasses[status]}
          ${pulse ? "animate-pulse" : ""}
        `} 
      />
      {pulse && (
        <span 
          className={`
            absolute inset-0 rounded-full 
            ${statusClasses[status]} opacity-40
            animate-ping
          `}
        ></span>
      )}
    </div>
  );
};

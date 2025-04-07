import React from "react";

interface LoadingIndicatorProps {
  message?: string;
  size?: "small" | "medium" | "large";
}

const LoadingIndicator: React.FC<LoadingIndicatorProps> = ({
  message = "Loading...",
  size = "medium",
}) => {
  const sizeClasses = {
    small: "w-4 h-4 border-2",
    medium: "w-8 h-8 border-3",
    large: "w-12 h-12 border-4",
  };

  return (
    <div className="flex flex-col items-center justify-center p-4">
      <div
        className={`${sizeClasses[size]} border-t-primary border-r-gray-200 border-b-gray-200 border-l-gray-200 rounded-full animate-spin`}
      />
      {message && <p className="mt-2 text-sm text-gray-600">{message}</p>}
    </div>
  );
};

export default LoadingIndicator;

import React from "react";

export default function LoadingBouncing() {
  return (
    <div className="flex space-x-2">
      <div className={`w-4 h-4 bg-green-500 rounded-full animate-bounce`}></div>
      <div
        className={`w-4 h-4 bg-green-500 rounded-full animate-bounce`}
        style={{ animationDelay: "0.1s" }}
      ></div>
      <div
        className={`w-4 h-4 bg-green-500 rounded-full animate-bounce`}
        style={{ animationDelay: "0.2s" }}
      ></div>
    </div>
  );
}

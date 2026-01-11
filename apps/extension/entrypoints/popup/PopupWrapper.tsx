import React from "react";

export default function PopupWrapper({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="flex h-[400px] w-80 items-center justify-center">
      {children}
    </div>
  );
}

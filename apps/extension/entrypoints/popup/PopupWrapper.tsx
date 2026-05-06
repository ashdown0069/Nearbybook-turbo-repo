import React from "react";

export default function PopupWrapper({
  children,
  footer,
}: {
  children: React.ReactNode;
  footer?: React.ReactNode;
}) {
  return (
    <div className="flex h-[400px] w-80 flex-col overflow-hidden">
      <div className="flex flex-1 flex-col overflow-hidden">{children}</div>
      {footer}
    </div>
  );
}

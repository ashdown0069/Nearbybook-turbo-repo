import Nav from "@/components/landing/Nav";
import React from "react";

export default function layout({ children }: { children: React.ReactNode }) {
  return (
    <>
      {/* <Nav /> */}
      <main>{children}</main>
    </>
  );
}

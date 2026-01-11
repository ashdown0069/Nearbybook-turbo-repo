import Link from "next/link";
import React from "react";

export default function Footer() {
  return (
    <footer className="mt-3 w-full max-w-3xl border-t border-gray-400">
      <div className="mt-3 flex justify-center gap-3 text-sm text-gray-400">
        <Link href={"/feedback"}>Feedback</Link>
        <Link href={"/privacy"}>개인정보처리방침</Link>
      </div>
    </footer>
  );
}

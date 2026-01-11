import React from "react";
import { Construction } from "lucide-react";

export default function Maintenance() {
  return (
    <div className="flex min-h-screen items-center justify-center bg-slate-50 p-4 font-sans text-slate-800 selection:bg-indigo-100 selection:text-indigo-700">
      <div className="relative w-full max-w-md overflow-hidden rounded-3xl border border-slate-100 bg-white shadow-xl shadow-indigo-50/50">
        <div className="h-2 w-full bg-gradient-to-r from-emerald-400 via-teal-500 to-indigo-600"></div>

        <div className="p-10 text-center">
          <div className="relative mx-auto mb-8 flex h-24 w-24 items-center justify-center rounded-full bg-indigo-50">
            <Construction className="h-12 w-12 text-indigo-600" />
          </div>
          <h1 className="mb-4 text-3xl font-bold tracking-tight">
            <span className="bg-gradient-to-r from-indigo-600 to-emerald-600 bg-clip-text text-transparent">
              서비스 점검 중입니다
            </span>
          </h1>

          <p className="text-base leading-relaxed text-slate-500">
            더 안정적인 서비스를 위해 시스템을 점검하고 있습니다.
            <br />
            이용에 불편을 드려 죄송합니다.
          </p>
        </div>
      </div>
    </div>
  );
}

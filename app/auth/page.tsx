"use client";

import React, { Suspense } from "react";
import AuthPortal from "@/components/auth/AuthPortal";

export default function AuthPage() {
  return (
    <Suspense
      fallback={
        <div className="min-h-screen flex items-center justify-center bg-slate-950 text-white font-bold text-sm">
          Loading Authentication Gateway...
        </div>
      }
    >
      <AuthPortal />
    </Suspense>
  );
}

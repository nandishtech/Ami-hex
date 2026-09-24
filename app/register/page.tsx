"use client";

import React, { Suspense } from "react";
import AuthPortal from "@/components/auth/AuthPortal";

export default function RegisterPage() {
  return (
    <Suspense
      fallback={
        <div className="min-h-screen flex items-center justify-center bg-slate-950 text-white font-bold text-sm">
          Loading Registration Gateway...
        </div>
      }
    >
      <AuthPortal initialMode="REGISTER" />
    </Suspense>
  );
}

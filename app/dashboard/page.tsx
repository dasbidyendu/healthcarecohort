"use client";

import { useEffect, useState } from "react";
import AdminDashboard from "@/components/AdminDashboard";
import { useRouter } from "next/navigation";

export default function DashboardPage() {
  const router = useRouter();
  useEffect(() => {
    const checkSession = async () => {
      const res = await fetch("/api/auth/session");
      if (!res.ok) {
        router.push("/login");
      }
    };

    checkSession();
  }, []);

  return <AdminDashboard />;
}

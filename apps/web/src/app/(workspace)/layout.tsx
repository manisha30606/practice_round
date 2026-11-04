"use client";
import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { Shell } from "@/components/shell";
import { useAuth } from "@/lib/auth";
export default function WorkspaceLayout({ children }: { children: React.ReactNode }) {
  const { user, loading } = useAuth(); const router = useRouter();
  useEffect(() => { if (!loading && !user) router.replace("/login"); }, [loading, user, router]);
  if (loading || !user) return <div className="grid min-h-screen place-items-center text-sm text-slate-500">Loading your workspace…</div>;
  return <Shell>{children}</Shell>;
}

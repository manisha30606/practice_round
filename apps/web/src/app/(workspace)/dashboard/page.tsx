"use client";
import { useAuth } from "@/lib/auth";
import { PageTitle } from "@/components/page-title";
import { StatCard } from "@/components/stat-card";
import { ComplaintTable } from "@/components/complaint-table";
import Link from "next/link";
import { Plus } from "lucide-react";
export default function DashboardPage() {
  const { user } = useAuth();
  const intro = user?.role === "admin" ? "Monitor incoming reports, municipal workloads and service delivery." : user?.role === "worker" ? "Review your assigned work and keep residents informed." : "Keep track of the issues you have reported in your neighbourhood.";
  return <><PageTitle eyebrow={`${user?.role ?? "Civic"} workspace`} title={`Good to see you${user?.name ? `, ${user.name.split(" ")[0]}` : ""}.`} description={intro} action={user?.role === "citizen" ? <Link href="/complaints/new" className="inline-flex items-center gap-2 rounded-lg bg-civic px-4 py-2.5 text-sm font-semibold text-white"><Plus size={16}/> Report issue</Link> : undefined}/><div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4"><StatCard label="Reports in workspace" value="—" note="Live data below" tone="blue"/><StatCard label="Awaiting review" value="—" note="Updated from reports" tone="amber"/><StatCard label="In progress" value="—" note="Assigned field work" tone="teal"/><StatCard label="Resolved" value="—" note="Verified outcomes" tone="green"/></div><div className="mt-7"><ComplaintTable/></div></>;
}

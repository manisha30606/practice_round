"use client";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { Activity, Bell, ClipboardList, LayoutDashboard, LogOut, MapPinned, PlusCircle, Users, Wrench } from "lucide-react";
import { useAuth } from "@/lib/auth";

const navigation = {
  citizen: [{ href: "/dashboard", label: "Overview", icon: LayoutDashboard }, { href: "/complaints/new", label: "Report an issue", icon: PlusCircle }, { href: "/complaints", label: "My complaints", icon: ClipboardList }, { href: "/nearby", label: "Nearby issues", icon: MapPinned }],
  admin: [{ href: "/dashboard", label: "Overview", icon: LayoutDashboard }, { href: "/complaints", label: "All complaints", icon: ClipboardList }, { href: "/workers", label: "Field workers", icon: Users }, { href: "/analytics", label: "Analytics", icon: Activity }],
  worker: [{ href: "/dashboard", label: "Overview", icon: LayoutDashboard }, { href: "/assignments", label: "My assignments", icon: Wrench }]
};
export function Shell({ children }: { children: React.ReactNode }) {
  const { user, signOut } = useAuth();
  const pathname = usePathname();
  const router = useRouter();
  if (!user) return <>{children}</>;
  const items = navigation[user.role];
  return <div className="min-h-screen md:flex">
    <aside className="w-full bg-navy text-white md:fixed md:inset-y-0 md:w-64">
      <div className="flex items-center gap-3 px-6 py-6"><div className="grid h-10 w-10 place-items-center rounded-xl bg-teal font-bold">C</div><div><div className="font-semibold tracking-wide">CivicTrack</div><div className="text-xs text-slate-300">Civic operations</div></div></div>
      <nav className="flex gap-1 overflow-x-auto px-3 pb-4 md:block">{items.map(item => <Link key={item.href} href={item.href} className={`flex shrink-0 items-center gap-3 rounded-lg px-3 py-3 text-sm ${pathname === item.href ? "bg-white/15 text-white" : "text-slate-300 hover:bg-white/10 hover:text-white"}`}><item.icon size={17}/>{item.label}</Link>)}</nav>
      <div className="hidden border-t border-white/10 px-6 py-5 text-xs text-slate-400 md:block">A clearer view of local services.</div>
    </aside>
    <div className="min-h-screen flex-1 md:ml-64">
      <header className="sticky top-0 z-10 flex items-center justify-between border-b border-slate-200 bg-white/95 px-5 py-4 backdrop-blur md:px-8">
        <div><p className="text-xs text-slate-500">CivicTrack workspace</p><p className="font-semibold">{user.name}</p></div>
        <div className="flex items-center gap-3"><button aria-label="Notifications" className="rounded-lg p-2 text-slate-500 hover:bg-slate-100"><Bell size={19}/></button><span className="hidden rounded-full bg-blue-50 px-3 py-1 text-xs font-medium capitalize text-blue-700 sm:inline">{user.role}</span><button onClick={async () => { await signOut(); router.push("/login"); }} className="rounded-lg p-2 text-slate-500 hover:bg-slate-100" aria-label="Sign out"><LogOut size={18}/></button></div>
      </header>
      <main className="mx-auto max-w-7xl p-5 md:p-8">{children}</main>
    </div>
  </div>;
}

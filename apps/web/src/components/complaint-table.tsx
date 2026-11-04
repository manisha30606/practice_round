"use client";
import Link from "next/link";
import { useQuery } from "@tanstack/react-query";
import { api } from "@/lib/api";
const statusStyles: Record<string, string> = {
  submitted: "bg-blue-50 text-blue-700", under_review: "bg-amber-50 text-amber-700", approved: "bg-indigo-50 text-indigo-700",
  assigned: "bg-violet-50 text-violet-700", in_progress: "bg-cyan-50 text-cyan-700", resolved: "bg-green-50 text-green-700",
  reopened: "bg-orange-50 text-orange-700", rejected: "bg-red-50 text-red-700", closed: "bg-slate-100 text-slate-600"
};
export function ComplaintTable() {
  const { data, isLoading, error } = useQuery({ queryKey: ["complaints"], queryFn: async () => (await api.get("/complaints")).data.data });
  if (isLoading) return <div className="rounded-2xl border bg-white p-8 text-sm text-slate-500">Loading complaints…</div>;
  if (error) return <div className="rounded-2xl border bg-white p-8 text-sm text-red-600">Could not load complaints. Check the API connection and sign in again.</div>;
  const items = data?.items ?? [];
  return <div className="overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-soft">
    <div className="flex items-center justify-between border-b border-slate-100 px-5 py-4"><div><h2 className="font-semibold text-navy">Recent reports</h2><p className="mt-1 text-xs text-slate-500">Latest civic issues in your workspace</p></div><span className="text-xs text-slate-400">{data?.pagination?.total ?? 0} records</span></div>
    {items.length === 0 ? <div className="p-10 text-center text-sm text-slate-500">No complaints yet. New reports will appear here.</div> :
    <div className="overflow-x-auto"><table className="w-full min-w-[720px] text-left text-sm"><thead className="bg-slate-50 text-xs uppercase tracking-wide text-slate-500"><tr><th className="px-5 py-3">Reference</th><th className="px-5 py-3">Issue</th><th className="px-5 py-3">Location</th><th className="px-5 py-3">Status</th><th className="px-5 py-3">Priority</th></tr></thead><tbody className="divide-y divide-slate-100">{items.map((item: any) => <tr key={item._id} className="hover:bg-slate-50"><td className="px-5 py-4 font-medium text-blue-700"><Link href={`/complaints/${item._id}`}>{item.reference}</Link></td><td className="px-5 py-4"><p className="font-medium text-slate-800">{item.title}</p><p className="mt-1 text-xs capitalize text-slate-400">{item.category.replaceAll("_", " ")}</p></td><td className="max-w-56 truncate px-5 py-4 text-slate-500">{item.address}</td><td className="px-5 py-4"><span className={`rounded-full px-2.5 py-1 text-xs font-medium ${statusStyles[item.status] ?? "bg-slate-100 text-slate-600"}`}>{item.status.replaceAll("_", " ")}</span></td><td className="px-5 py-4 capitalize text-slate-600">{item.priority}</td></tr>)}</tbody></table></div>}
  </div>;
}

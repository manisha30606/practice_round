"use client";
import { useQuery } from "@tanstack/react-query";
import { api } from "@/lib/api";
import { PageTitle } from "@/components/page-title";
export default function NotificationsPage(){const {data,isLoading}=useQuery({queryKey:["notifications"],queryFn:async()=>(await api.get("/notifications")).data.data});return <><PageTitle title="Notifications" description="Updates about reports and assigned work."/><div className="rounded-2xl border bg-white p-5">{isLoading?"Loading…":(data??[]).map((n:any)=><div key={n._id} className="border-b py-4 last:border-0"><p className="font-medium">{n.title}</p><p className="mt-1 text-sm text-slate-600">{n.message}</p><p className="mt-1 text-xs text-slate-400">{new Date(n.createdAt).toLocaleString()}</p></div>)}</div></>}

"use client";
import { useQuery } from "@tanstack/react-query";
import { api } from "@/lib/api";
import { PageTitle } from "@/components/page-title";
export default function WorkersPage(){const {data,isLoading}=useQuery({queryKey:["workers"],queryFn:async()=>(await api.get("/users",{params:{role:"worker"}})).data.data});return <><PageTitle title="Field workers" description="Directory of active field workers available to municipal operations."/><div className="rounded-2xl border bg-white p-5">{isLoading?"Loading…":(data??[]).map((u:any)=><div key={u._id} className="flex justify-between border-b py-4 last:border-0"><div><p className="font-medium">{u.name}</p><p className="text-xs text-slate-500">{u.email}</p></div><span className="text-xs text-slate-500">{u.department?.name??"Unassigned"}</span></div>)}</div></>}

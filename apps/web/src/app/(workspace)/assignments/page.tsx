"use client";
import { useQuery } from "@tanstack/react-query";
import { api } from "@/lib/api";
import { PageTitle } from "@/components/page-title";
export default function AssignmentsPage(){
 const {data,isLoading,error}=useQuery({queryKey:["assignments"],queryFn:async()=>(await api.get("/assignments/mine")).data.data});
 return <><PageTitle title="My assignments" description="Work routed to you by the municipal operations team."/><div className="rounded-2xl border bg-white p-5">{isLoading?"Loading assignments…":error?"Could not load assignments.":(data??[]).map((a:any)=><article key={a._id} className="border-b py-4 last:border-0"><p className="font-semibold text-navy">{a.complaint?.title}</p><p className="mt-1 text-xs text-slate-500">{a.complaint?.reference} · {a.department?.name} · {a.state}</p><p className="mt-2 text-sm text-slate-600">{a.complaint?.address}</p></article>)}</div></>;
}

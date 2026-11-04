"use client";
import { useQuery } from "@tanstack/react-query";
import { api } from "@/lib/api";
import { PageTitle } from "@/components/page-title";
export default function DepartmentsPage(){const {data,isLoading}=useQuery({queryKey:["departments"],queryFn:async()=>(await api.get("/departments")).data.data});return <><PageTitle title="Departments" description="Municipal teams responsible for service categories."/><div className="grid gap-4 md:grid-cols-2">{isLoading?"Loading…":(data??[]).map((d:any)=><div key={d._id} className="rounded-xl border bg-white p-5"><p className="font-semibold">{d.name}</p><p className="mt-1 text-xs text-slate-500">{d.code}</p><p className="mt-3 text-xs text-slate-600">{d.categories.join(", ").replaceAll("_"," ")}</p></div>)}</div></>}

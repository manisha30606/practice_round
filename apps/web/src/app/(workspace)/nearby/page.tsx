"use client";
import { useQuery } from "@tanstack/react-query";
import { api } from "@/lib/api";
import { PageTitle } from "@/components/page-title";
import dynamic from "next/dynamic";
const CivicMap = dynamic(() => import("@/components/civic-map").then(m => m.CivicMap), { ssr: false, loading: () => <div className="h-[420px] animate-pulse rounded-2xl bg-slate-100"/> });
export default function NearbyPage(){
 const {data,isLoading,error}=useQuery({queryKey:["nearby"],queryFn:async()=>(await api.get("/complaints/nearby",{params:{lat:22.5726,lng:88.3639,radiusKm:8}})).data.data});
 return <><PageTitle title="Nearby issues" description="Explore reports around the default Kolkata map centre. Location permissions are not required."/><div className="mb-5"><CivicMap reports={data??[]}/></div><div className="rounded-2xl border bg-white p-6"><h2 className="font-semibold text-navy">Reports within 8 km</h2>{isLoading?<p className="mt-4 text-sm text-slate-500">Loading nearby reports…</p>:error?<p className="mt-4 text-sm text-red-600">Could not load nearby reports.</p>:<div className="mt-4 divide-y">{(data??[]).map((item:any)=><div key={item._id} className="py-4"><p className="font-medium text-slate-800">{item.title}</p><p className="mt-1 text-xs text-slate-500">{item.reference} · {item.address} · {item.status.replaceAll("_"," ")}</p></div>)}</div>}</div></>;
}

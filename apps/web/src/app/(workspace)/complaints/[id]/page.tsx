"use client";
import { useQuery } from "@tanstack/react-query";
import { useParams } from "next/navigation";
import { api } from "@/lib/api";
import { PageTitle } from "@/components/page-title";

const API_BASE = (
  process.env.NEXT_PUBLIC_API_URL ?? "http://localhost:4000/api/v1"
).replace(/\/api\/v1\/?$/, "");

export default function ComplaintDetailPage() {
  const params = useParams<{ id: string }>();
  const complaintId = params?.id;

  const { data, isLoading, error } = useQuery({
    queryKey: ["complaint", complaintId],
    queryFn: async () =>
      (await api.get(`/complaints/${complaintId}`)).data.data,
    enabled: Boolean(complaintId),
  });

  if (isLoading)
    return <p className="text-sm text-slate-500">Loading report…</p>;
  if (error || !data)
    return (
      <p className="text-sm text-red-600">
        This report could not be loaded or is not available to your role.
      </p>
    );

  const c = data.complaint;

  return (
    <>
      <PageTitle
        eyebrow={c.reference}
        title={c.title}
        description={c.address}
      />
      <div className="grid gap-5 lg:grid-cols-[1fr_320px]">
        <section className="rounded-2xl border bg-white p-6">
          <h2 className="font-semibold text-navy">Issue details</h2>
          <p className="mt-3 whitespace-pre-wrap text-sm leading-7 text-slate-600">
            {c.description}
          </p>
          <div className="mt-5 flex flex-wrap gap-2 text-xs">
            <span className="rounded-full bg-blue-50 px-3 py-1.5 capitalize text-blue-700">
              {c.category.replaceAll("_", " ")}
            </span>
            <span className="rounded-full bg-slate-100 px-3 py-1.5 capitalize">
              {c.priority} priority
            </span>
            <span className="rounded-full bg-teal-50 px-3 py-1.5 capitalize text-teal-700">
              {c.status.replaceAll("_", " ")}
            </span>
          </div>
          <div className="mt-6 grid gap-3 sm:grid-cols-2">
            {(c.images ?? []).map((img: any) => {
              const imageSrc = img.url.startsWith("http")
                ? img.url
                : `${API_BASE}${img.url.startsWith("/") ? "" : "/"}${img.url}`;

              return (
                <img
                  key={img.url}
                  src={imageSrc}
                  alt="Complaint evidence"
                  className="max-h-64 rounded-xl object-cover"
                />
              );
            })}
          </div>
        </section>

        <aside className="rounded-2xl border bg-white p-6">
          <h2 className="font-semibold text-navy">Activity timeline</h2>
          <div className="mt-5 space-y-5">
            {data.timeline.map((entry: any) => (
              <div key={entry._id} className="border-l-2 border-teal-200 pl-4">
                <p className="text-sm font-medium text-slate-800">
                  {entry.action.replaceAll("_", " ")}
                </p>
                <p className="mt-1 text-xs text-slate-500">
                  {entry.actor?.name ?? "CivicTrack"} ·{" "}
                  {new Date(entry.createdAt).toLocaleString()}
                </p>
              </div>
            ))}
          </div>
        </aside>
      </div>
    </>
  );
}

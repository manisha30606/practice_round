"use client";
import { useState } from "react";
import { useRouter } from "next/navigation";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { api } from "@/lib/api";
import { PageTitle } from "@/components/page-title";
import dynamic from "next/dynamic";

const categories = [
  ["garbage_sanitation", "Garbage and sanitation"],
  ["road_damage", "Road damage and potholes"],
  ["streetlight", "Streetlight problems"],
  ["water_leakage", "Water leakage"],
  ["drainage", "Drainage blockage"],
  ["public_infrastructure", "Public infrastructure"],
  ["other", "Other issues"],
];

const CivicMap = dynamic(
  () => import("@/components/civic-map").then((mod) => mod.CivicMap),
  {
    ssr: false,
    loading: () => (
      <div className="h-[420px] rounded-2xl border bg-slate-50 flex items-center justify-center text-slate-400">
        Loading map…
      </div>
    ),
  },
);

export default function NewComplaintPage() {
  const router = useRouter();
  const qc = useQueryClient();
  const [form, setForm] = useState({
    title: "",
    description: "",
    category: "garbage_sanitation",
    address: "",
    landmark: "",
    latitude: "22.5726",
    longitude: "88.3639",
  });
  const [images, setImages] = useState<FileList | null>(null);
  const [error, setError] = useState("");
  const mutation = useMutation({
    mutationFn: async () => {
      const body = new FormData();
      Object.entries(form).forEach(([k, v]) => body.append(k, v));
      if (images) Array.from(images).forEach((f) => body.append("images", f));
      return api.post("/complaints", body);
    },
    onSuccess: async () => {
      await qc.invalidateQueries({ queryKey: ["complaints"] });
      router.push("/complaints");
    },
    onError: () =>
      setError(
        "The report could not be submitted. Check the fields and API connection.",
      ),
  });
  return (
    <>
      <PageTitle
        title="Report a civic issue"
        description="Share enough detail for the right municipal team to investigate."
      />
      <form
        onSubmit={(e) => {
          e.preventDefault();
          setError("");
          mutation.mutate();
        }}
        className="max-w-3xl space-y-5 rounded-2xl border border-slate-200 bg-white p-6 shadow-soft"
      >
        <label className="block text-sm font-medium">
          Issue title
          <input
            required
            minLength={8}
            maxLength={120}
            value={form.title}
            onChange={(e) => setForm({ ...form, title: e.target.value })}
            className="mt-2 w-full rounded-lg border border-slate-300 px-3 py-3"
          />
        </label>
        <label className="block text-sm font-medium">
          Category
          <select
            value={form.category}
            onChange={(e) => setForm({ ...form, category: e.target.value })}
            className="mt-2 w-full rounded-lg border border-slate-300 px-3 py-3"
          >
            {categories.map(([v, l]) => (
              <option key={v} value={v}>
                {l}
              </option>
            ))}
          </select>
        </label>
        <label className="block text-sm font-medium">
          Description
          <textarea
            required
            minLength={20}
            rows={5}
            value={form.description}
            onChange={(e) => setForm({ ...form, description: e.target.value })}
            className="mt-2 w-full rounded-lg border border-slate-300 px-3 py-3"
          />
        </label>
        <label className="block text-sm font-medium">
          Address
          <input
            required
            minLength={5}
            value={form.address}
            onChange={(e) => setForm({ ...form, address: e.target.value })}
            placeholder="Street, neighbourhood, city"
            className="mt-2 w-full rounded-lg border border-slate-300 px-3 py-3"
          />
        </label>
        <label className="block text-sm font-medium">
          Landmark (optional)
          <input
            value={form.landmark}
            onChange={(e) => setForm({ ...form, landmark: e.target.value })}
            className="mt-2 w-full rounded-lg border border-slate-300 px-3 py-3"
          />
        </label>
        <div>
          <p className="mb-2 text-sm font-medium">Location coordinates</p>
          <div className="grid gap-3 sm:grid-cols-2">
            <label className="text-xs text-slate-500">
              Latitude
              <input
                required
                type="number"
                step="any"
                value={form.latitude}
                onChange={(e) => setForm({ ...form, latitude: e.target.value })}
                className="mt-1 w-full rounded-lg border px-3 py-2.5"
              />
            </label>
            <label className="text-xs text-slate-500">
              Longitude
              <input
                required
                type="number"
                step="any"
                value={form.longitude}
                onChange={(e) =>
                  setForm({ ...form, longitude: e.target.value })
                }
                className="mt-1 w-full rounded-lg border px-3 py-2.5"
              />
            </label>
          </div>
          <p className="mt-2 text-xs text-slate-400">
            Enter decimal coordinates. Map pin selection is available on the
            nearby issues view.
          </p>
        </div>
        <label className="block text-sm font-medium">
          Photographs
          <input
            type="file"
            accept="image/jpeg,image/png,image/webp"
            multiple
            onChange={(e) => setImages(e.target.files)}
            className="mt-2 block w-full text-sm text-slate-500"
          />
        </label>
        {error && (
          <p role="alert" className="text-sm text-red-600">
            {error}
          </p>
        )}
        <div className="flex justify-end gap-3">
          <button
            type="button"
            onClick={() => router.back()}
            className="rounded-lg border px-4 py-2.5 text-sm"
          >
            Cancel
          </button>
          <button
            disabled={mutation.isPending}
            className="rounded-lg bg-civic px-5 py-2.5 text-sm font-semibold text-white disabled:opacity-60"
          >
            {mutation.isPending ? "Submitting…" : "Submit report"}
          </button>
        </div>
      </form>
    </>
  );
}

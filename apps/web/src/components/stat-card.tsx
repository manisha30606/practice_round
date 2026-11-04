export function StatCard({ label, value, note, tone = "blue" }: { label: string; value: string | number; note: string; tone?: "blue" | "teal" | "amber" | "green" }) {
  const tones = { blue: "bg-blue-50 text-blue-700", teal: "bg-teal-50 text-teal-700", amber: "bg-amber-50 text-amber-700", green: "bg-green-50 text-green-700" };
  return <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-soft"><p className="text-sm text-slate-500">{label}</p><p className="mt-3 text-3xl font-semibold tracking-tight text-navy">{value}</p><span className={`mt-3 inline-flex rounded-full px-2.5 py-1 text-xs font-medium ${tones[tone]}`}>{note}</span></div>;
}

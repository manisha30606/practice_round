"use client";
import Link from "next/link";
import { useState } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "@/lib/auth";
export default function LoginPage() {
  const { signIn } = useAuth(); const router = useRouter();
  const [email, setEmail] = useState(""); const [password, setPassword] = useState(""); const [error, setError] = useState(""); const [busy, setBusy] = useState(false);
  async function submit(e: React.FormEvent) { e.preventDefault(); setBusy(true); setError(""); try { await signIn(email, password); router.push("/dashboard"); } catch { setError("Sign-in failed. Check your email and password."); } finally { setBusy(false); } }
  return <main className="grid min-h-screen place-items-center px-5 py-12"><div className="w-full max-w-md rounded-3xl border border-slate-200 bg-white p-8 shadow-soft"><Link href="/" className="text-sm font-semibold text-civic">← CivicTrack</Link><h1 className="mt-7 text-2xl font-semibold text-navy">Welcome back</h1><p className="mt-2 text-sm text-slate-500">Sign in to your civic workspace.</p><form onSubmit={submit} className="mt-7 space-y-4"><label className="block text-sm font-medium text-slate-700">Email<input required type="email" value={email} onChange={e=>setEmail(e.target.value)} className="mt-2 w-full rounded-lg border border-slate-300 px-3 py-3 outline-none focus:border-civic"/></label><label className="block text-sm font-medium text-slate-700">Password<input required type="password" value={password} onChange={e=>setPassword(e.target.value)} className="mt-2 w-full rounded-lg border border-slate-300 px-3 py-3 outline-none focus:border-civic"/></label>{error && <p role="alert" className="text-sm text-red-600">{error}</p>}<button disabled={busy} className="w-full rounded-lg bg-civic py-3 text-sm font-semibold text-white disabled:opacity-60">{busy?"Signing in…":"Sign in"}</button></form><p className="mt-6 text-center text-sm text-slate-500">New to CivicTrack? <Link href="/register" className="font-semibold text-civic">Create an account</Link></p></div></main>;
}

"use client";
import { useAuth } from "@/lib/auth";
import { PageTitle } from "@/components/page-title";
export default function ProfilePage(){const {user}=useAuth();return <><PageTitle title="Profile settings" description="Your CivicTrack account information."/><div className="max-w-xl rounded-2xl border bg-white p-6"><p className="text-sm text-slate-500">Name</p><p className="mt-1 font-medium">{user?.name}</p><p className="mt-5 text-sm text-slate-500">Email</p><p className="mt-1 font-medium">{user?.email}</p><p className="mt-5 text-sm text-slate-500">Role</p><p className="mt-1 font-medium capitalize">{user?.role}</p></div></>}

"use client";

import { useRouter } from "next/navigation";
import { useEffect } from "react";
import { useSession } from "@/lib/auth-client";
import { getDashboardHref } from "@/lib/dashboard-route";

export default function DashboardPage() {
  const router = useRouter();
  const { data: session, isPending } = useSession();

  useEffect(() => {
    if (isPending) {
      return;
    }

    if (!session?.user) {
      router.replace("/login?redirectTo=/dashboard");
      return;
    }

    router.replace(getDashboardHref(session.user.role));
  }, [isPending, router, session]);

  return (
    <section className="min-h-screen bg-[#0b0d10] px-4 py-20 text-white">
      <div className="mx-auto max-w-5xl rounded-2xl border border-white/10 bg-white/[0.03] p-8">
        <p className="text-sm font-bold uppercase text-orange-400">
          Loading dashboard
        </p>
        <h1 className="mt-3 text-3xl font-black">Preparing your workspace...</h1>
      </div>
    </section>
  );
}

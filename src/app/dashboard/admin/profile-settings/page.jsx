"use client";

import ProfileSettings from "@/components/dashboard/ProfileSettings";

export default function Page() {
  return (
    <>
      <header className="border-b border-white/10 pb-6">
        <h1 className="text-3xl font-black tracking-normal">Profile Settings</h1>
        <p className="mt-2 text-sm text-white/55">Update your name and profile picture.</p>
      </header>
      <ProfileSettings />
    </>
  );
}

"use client";

import {
  DashboardShell,
  PageHeader,
} from "@/components/dashboard/UserDashboardShared";
import ProfileSettings from "@/components/dashboard/ProfileSettings";

export default function Page() {
  return (
    <DashboardShell activeSection="profile-settings">
      <PageHeader
        title="Profile Settings"
        subtitle="Update your name and profile picture."
      />
      <ProfileSettings />
    </DashboardShell>
  );
}

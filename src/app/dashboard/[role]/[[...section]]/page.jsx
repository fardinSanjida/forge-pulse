import DashboardShell from "@/components/DashboardShell";

export const metadata = {
  title: "Dashboard | Forge Pulse",
  description: "Role based dashboard for Forge Pulse members.",
};

export default async function RoleDashboardPage({ params }) {
  const resolvedParams = await params;

  return (
    <DashboardShell
      role={resolvedParams.role}
      section={resolvedParams.section?.[0] || "overview"}
    />
  );
}

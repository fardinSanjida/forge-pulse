import DashboardSidebar from "@/components/dashboard/DashboardSidebar";

export default function AdminDashboardLayout({ children }) {
  return (
    <section className="min-h-screen bg-[#060b10] text-white">
      <div className="flex flex-col gap-6 lg:flex-row">
        <DashboardSidebar
          activeSection="overview"
          basePath="/dashboard/admin"
          label="Admin dashboard"
          role="admin"
        />
        <main className="min-w-0 flex-1 px-4 py-6 sm:px-6 lg:px-8">
          {children}
        </main>
      </div>
    </section>
  );
}

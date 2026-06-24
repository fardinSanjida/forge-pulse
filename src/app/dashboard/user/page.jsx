import DashboardSidebar from "@/components/dashboard/DashboardSidebar";

const page = async ({ searchParams }) => {
  const resolvedSearchParams = await searchParams;
  const activeSection = resolvedSearchParams?.section || "overview";

  return (
    <section className="min-h-screen bg-[#080e13] text-white">
      <div className="flex flex-col gap-6 lg:flex-row">
        <DashboardSidebar activeSection={activeSection} />

        <div className="min-w-0 flex-1 px-4 py-6 sm:px-6 lg:px-8">
          <div className="rounded-md border border-white/10 bg-white/[0.03] p-6">
            i am a user
          </div>
        </div>
      </div>
    </section>
  );
};

export default page;

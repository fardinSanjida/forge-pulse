import {
  DashboardShell,
  PageHeader,
  Panel,
  notifications,
} from "@/components/dashboard/UserDashboardShared";

export default function Page() {
  return (
    <DashboardShell activeSection="notifications">
      <PageHeader
        title="Notifications"
        subtitle="Stay updated with your activities."
      />

      <Panel className="mt-6">
        <div className="flex flex-wrap items-center justify-between gap-3 border-b border-white/10 pb-4">
          <div className="flex gap-4 text-sm font-black">
            {["All", "Bookings", "Payments", "Updates"].map((tab, index) => (
              <button
                key={tab}
                type="button"
                className={index === 0 ? "text-green-300" : "text-white/45"}
              >
                {tab}
              </button>
            ))}
          </div>
          <button type="button" className="text-sm font-semibold text-white/50">
            Mark all as read
          </button>
        </div>

        <div className="mt-4 space-y-3">
          {notifications.map((item) => (
            <div
              key={item.title}
              className="flex items-center gap-4 rounded-md border border-white/10 bg-white/[0.03] p-4"
            >
              <span
                className={`grid h-10 w-10 place-items-center rounded-md font-black ${
                  item.tone === "orange"
                    ? "bg-orange-400/15 text-orange-300"
                    : item.tone === "blue"
                      ? "bg-blue-400/15 text-blue-300"
                      : "bg-green-400/15 text-green-300"
                }`}
              >
                !
              </span>
              <div className="min-w-0 flex-1">
                <h2 className="font-black text-white">{item.title}</h2>
                <p className="mt-1 text-xs text-white/45">{item.meta}</p>
              </div>
              <span
                className={`h-2 w-2 rounded-full ${
                  item.tone === "orange" ? "bg-orange-400" : "bg-green-400"
                }`}
              />
            </div>
          ))}
        </div>
      </Panel>
    </DashboardShell>
  );
}

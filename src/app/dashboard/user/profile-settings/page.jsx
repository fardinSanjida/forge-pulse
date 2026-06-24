import Image from "next/image";
import {
  DashboardShell,
  PageHeader,
  Panel,
  dashboardImages,
} from "@/components/dashboard/UserDashboardShared";

export default function Page() {
  return (
    <DashboardShell activeSection="profile-settings">
      <PageHeader
        title="Profile Settings"
        subtitle="Update your personal information."
      />

      <Panel className="mt-6">
        <form className="grid gap-6 lg:grid-cols-[240px_1fr]">
          <div>
            <p className="text-sm font-semibold text-white/60">
              Profile Picture
            </p>
            <div className="mt-4 flex items-center gap-4">
              <Image
                src={dashboardImages.profileImage}
                alt="John Doe"
                width={84}
                height={84}
                className="h-20 w-20 rounded-full object-cover"
                placeholder="blur"
              />
              <button
                type="button"
                className="rounded-md bg-white/[0.06] px-4 py-2 text-sm font-black text-white/75"
              >
                Change Photo
              </button>
            </div>
          </div>

          <div className="grid gap-4">
            {[
              ["Full Name", "John Doe", "text"],
              ["Email", "john.doe@email.com", "email"],
              ["Phone", "+1 234 567 8900", "tel"],
              ["Password", "************", "password"],
            ].map(([label, value, type]) => (
              <label key={label} className="text-sm font-semibold text-white/70">
                {label}
                <input
                  type={type}
                  defaultValue={value}
                  className="mt-2 h-11 w-full rounded-md border border-white/10 bg-[#081016] px-4 text-white outline-none focus:border-green-400"
                />
              </label>
            ))}
            <button
              type="button"
              className="mt-3 h-12 rounded-md bg-green-600 text-sm font-black text-white transition hover:bg-green-500"
            >
              Save Changes
            </button>
          </div>
        </form>
      </Panel>
    </DashboardShell>
  );
}

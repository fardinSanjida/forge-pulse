import Image from "next/image";
import {
  DashboardShell,
  PageHeader,
  Panel,
  StatusBadge,
  TableFooter,
  classRows,
} from "@/components/dashboard/UserDashboardShared";

export default function Page() {
  return (
    <DashboardShell activeSection="booked-classes">
      <PageHeader
        title="Booked Classes"
        subtitle="All your registered and paid classes."
      />

      <Panel className="mt-6">
        <div className="grid gap-3 border-b border-white/10 pb-4 md:grid-cols-[1fr_180px_180px]">
          <input
            type="search"
            placeholder="Search classes..."
            className="h-11 rounded-md border border-white/10 bg-[#081016] px-4 text-sm text-white outline-none transition placeholder:text-white/35 focus:border-green-400"
          />
          <select className="h-11 rounded-md border border-white/10 bg-[#081016] px-4 text-sm text-white/75 outline-none focus:border-green-400">
            <option>All Trainers</option>
            <option>Sarah Khan</option>
            <option>Mike Johnson</option>
          </select>
          <select className="h-11 rounded-md border border-white/10 bg-[#081016] px-4 text-sm text-white/75 outline-none focus:border-green-400">
            <option>All Statuses</option>
            <option>Paid</option>
            <option>Pending</option>
          </select>
        </div>

        <div className="mt-4 overflow-x-auto">
          <table className="w-full min-w-[760px] text-left text-sm">
            <thead className="bg-white/[0.03] text-xs font-black uppercase text-white/60">
              <tr>
                <th className="px-4 py-4">Class</th>
                <th className="px-4 py-4">Trainer</th>
                <th className="px-4 py-4">Schedule</th>
                <th className="px-4 py-4">Payment</th>
                <th className="px-4 py-4 text-right">Action</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-white/10">
              {classRows.map((row) => (
                <tr key={row.name} className="text-white/75">
                  <td className="px-4 py-4">
                    <div className="flex items-center gap-3">
                      <Image
                        src={row.image}
                        alt=""
                        width={64}
                        height={46}
                        className="h-12 w-16 rounded-md object-cover"
                        placeholder="blur"
                      />
                      <div>
                        <p className="font-black text-white">{row.name}</p>
                        <p className="mt-1 text-xs text-white/50">{row.level}</p>
                      </div>
                    </div>
                  </td>
                  <td className="px-4 py-4">{row.trainer}</td>
                  <td className="max-w-48 px-4 py-4">{row.schedule}</td>
                  <td className="px-4 py-4">
                    <StatusBadge>Paid</StatusBadge>
                  </td>
                  <td className="px-4 py-4 text-right">
                    <button
                      type="button"
                      className="rounded-md border border-orange-500/70 px-4 py-2 text-xs font-black text-orange-300 transition hover:bg-orange-500 hover:text-white"
                    >
                      View Details
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        <TableFooter />
      </Panel>
    </DashboardShell>
  );
}

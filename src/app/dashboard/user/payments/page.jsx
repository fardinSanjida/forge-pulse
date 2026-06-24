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
    <DashboardShell activeSection="payments">
      <PageHeader
        title="Payment History"
        subtitle="View your all payment transactions."
      />

      <Panel className="mt-6">
        <div className="overflow-x-auto">
          <table className="w-full min-w-[680px] text-left text-sm">
            <thead className="bg-white/[0.03] text-xs font-black uppercase text-white/60">
              <tr>
                <th className="px-4 py-4">Date</th>
                <th className="px-4 py-4">Class</th>
                <th className="px-4 py-4">Amount</th>
                <th className="px-4 py-4">Payment Method</th>
                <th className="px-4 py-4">Status</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-white/10">
              {classRows.map((row, index) => (
                <tr key={row.name} className="text-white/70">
                  <td className="px-4 py-4">{18 - index * 3} May 2024</td>
                  <td className="px-4 py-4 font-semibold text-white">
                    {row.name}
                  </td>
                  <td className="px-4 py-4">{row.amount}</td>
                  <td className="px-4 py-4">Visa **** 4242</td>
                  <td className="px-4 py-4">
                    <StatusBadge>Paid</StatusBadge>
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

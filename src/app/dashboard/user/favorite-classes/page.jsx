import Image from "next/image";
import {
  DashboardShell,
  PageHeader,
  Panel,
  classRows,
  dashboardImages,
} from "@/components/dashboard/UserDashboardShared";

export default function Page() {
  const favorites = [
    classRows[1],
    classRows[0],
    { ...classRows[2], name: "HIIT Workout" },
    { ...classRows[3], name: "Zumba Dance", image: dashboardImages.zumbaImage },
  ];

  return (
    <DashboardShell activeSection="favorite-classes">
      <PageHeader
        title="Favorite Classes"
        subtitle="Classes you love and want to revisit."
      />

      <div className="mt-6 grid gap-5 md:grid-cols-2 xl:grid-cols-4">
        {favorites.map((item) => (
          <Panel key={item.name} className="p-0">
            <div className="relative h-40 overflow-hidden rounded-t-md">
              <Image
                src={item.image}
                alt=""
                fill
                sizes="(min-width: 1280px) 280px, (min-width: 768px) 50vw, 100vw"
                className="object-cover"
                placeholder="blur"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-[#0c151d] to-transparent" />
              <span className="absolute right-4 top-4 text-orange-400">♥</span>
            </div>
            <div className="p-5">
              <h2 className="font-black">{item.name}</h2>
              <p className="mt-1 text-sm text-white/55">with {item.trainer}</p>
              <p className="mt-3 text-sm text-white/60">{item.schedule}</p>
              <div className="mt-5 flex gap-3">
                <button
                  type="button"
                  className="flex-1 rounded-md border border-white/10 px-4 py-2 text-xs font-black text-white/80 transition hover:bg-white/[0.06]"
                >
                  View Details
                </button>
                <button
                  type="button"
                  className="flex-1 rounded-md border border-red-500/60 px-4 py-2 text-xs font-black text-red-300 transition hover:bg-red-500 hover:text-white"
                >
                  Remove
                </button>
              </div>
            </div>
          </Panel>
        ))}
      </div>
    </DashboardShell>
  );
}

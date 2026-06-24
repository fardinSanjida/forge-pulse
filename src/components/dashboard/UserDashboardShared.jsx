import DashboardSidebar from "@/components/dashboard/DashboardSidebar";
import bookedImage from "../../../asset/image6.jpg";
import favoriteImage from "../../../asset/hit2.jpg";
import totalClassImage from "../../../asset/image17.jpg";
import profileImage from "../../../asset/profile.jpg";
import upcomingImage from "../../../asset/yoga3.jpg";
import yogaFlowImage from "../../../asset/yoga6.jpg";
import strengthImage from "../../../asset/strength.jpg";
import cardioImage from "../../../asset/gym3.jpg";
import crossfitImage from "../../../asset/image18.jpg";
import zumbaImage from "../../../asset/image21.jpg";

export const trainerApplicationStatusKey = "forgePulseTrainerApplicationStatus";

export const dashboardImages = {
  profileImage,
  upcomingImage,
  yogaFlowImage,
  strengthImage,
  cardioImage,
  crossfitImage,
  zumbaImage,
};

export const classRows = [
  {
    name: "Strength Training",
    level: "Advanced",
    trainer: "Mike Johnson",
    schedule: "Mon, Wed, Fri 07:00 PM - 08:00 PM",
    amount: "$25.00",
    image: strengthImage,
  },
  {
    name: "Yoga Flow",
    level: "Beginner",
    trainer: "Sarah Khan",
    schedule: "Tue, Thu 08:00 PM - 09:00 PM",
    amount: "$30.00",
    image: yogaFlowImage,
  },
  {
    name: "Cardio Blast",
    level: "Intermediate",
    trainer: "David Smith",
    schedule: "Sat 06:00 PM - 07:00 PM",
    amount: "$20.00",
    image: cardioImage,
  },
  {
    name: "CrossFit Power",
    level: "Advanced",
    trainer: "James Wilson",
    schedule: "Mon, Wed, Fri 06:00 PM - 07:00 PM",
    amount: "$30.00",
    image: crossfitImage,
  },
];

export const userStats = [
  {
    label: "Total Class",
    value: "32",
    action: "Explore all classes",
    image: totalClassImage,
    tint: "from-sky-500/45 to-[#06131d]",
    icon: (
      <>
        <path d="M4 19.5V5a2 2 0 0 1 2-2h12v18H6a2 2 0 0 1-2-1.5Z" />
        <path d="M8 7h6M8 11h6" />
      </>
    ),
  },
  {
    label: "Total Booked Classes",
    value: "12",
    action: "View all booked classes",
    image: bookedImage,
    tint: "from-emerald-500/45 to-[#071016]",
    icon: (
      <>
        <path d="M7 3v4M17 3v4M4 9h16" />
        <rect width="16" height="17" x="4" y="5" rx="2" />
      </>
    ),
  },
  {
    label: "Total Favorites",
    value: "08",
    action: "View your favorites",
    image: favoriteImage,
    tint: "from-orange-500/45 to-[#130805]",
    icon: (
      <path d="M20.4 5.6a5.2 5.2 0 0 0-7.4 0L12 6.7l-1-1.1a5.2 5.2 0 1 0-7.4 7.4l8.4 8.2 8.4-8.2a5.2 5.2 0 0 0 0-7.4Z" />
    ),
  },
  {
    label: "Application Status",
    value: "Not Applied",
    action: "Apply as trainer",
    image: yogaFlowImage,
    tint: "from-slate-500/45 to-[#0b1118]",
    icon: (
      <>
        <path d="M8 3h7l4 4v14H8z" />
        <path d="M15 3v5h4M11 13h5M11 17h3" />
      </>
    ),
  },
];

export const notifications = [
  {
    title: "Your application status is pending.",
    meta: "10 May 2024 - 10:00 AM",
    tone: "green",
  },
  {
    title: "New class Yoga Flow is available.",
    meta: "10 May 2024 - 08:15 AM",
    tone: "orange",
  },
  {
    title: "Payment of $30.00 for Yoga Flow was successful.",
    meta: "10 May 2024 - 08:05 AM",
    tone: "green",
  },
  {
    title: "Your class Strength Training has been confirmed.",
    meta: "17 May 2024 - 07:00 PM",
    tone: "blue",
  },
];

export function DashboardShell({ activeSection, children }) {
  return (
    <section className="min-h-screen bg-[#060b10] text-white">
      <div className="flex flex-col gap-6 lg:flex-row">
        <DashboardSidebar activeSection={activeSection} />
        <main className="min-w-0 flex-1 px-4 py-6 sm:px-6 lg:px-8">
          {children}
        </main>
      </div>
    </section>
  );
}

export function PageHeader({ title, subtitle, action }) {
  return (
    <header className="flex flex-col gap-4 border-b border-white/10 pb-6 sm:flex-row sm:items-center sm:justify-between">
      <div>
        <h1 className="text-3xl font-black tracking-normal">{title}</h1>
        <p className="mt-2 text-sm text-white/55">{subtitle}</p>
      </div>
      {action}
    </header>
  );
}

export function Panel({ children, className = "" }) {
  return (
    <article
      className={`rounded-md border border-white/10 bg-[#0c151d] p-6 shadow-xl shadow-black/20 ${className}`}
    >
      {children}
    </article>
  );
}

export function StatusBadge({ children, tone = "green" }) {
  const tones = {
    green: "bg-green-400/15 text-green-300",
    orange: "bg-orange-400/15 text-orange-300",
    blue: "bg-blue-400/15 text-blue-300",
  };

  return (
    <span className={`rounded-md px-3 py-1 text-xs font-black ${tones[tone]}`}>
      {children}
    </span>
  );
}

export function TableFooter() {
  return (
    <div className="mt-5 flex flex-col gap-3 text-xs text-white/45 sm:flex-row sm:items-center sm:justify-between">
      <span>Showing 1 to 4 of 4 results</span>
      <div className="flex items-center gap-2">
        <button type="button" className="rounded-md bg-white/[0.04] px-3 py-2">
          &lt;
        </button>
        <button type="button" className="rounded-md bg-green-500 px-3 py-2 text-white">
          1
        </button>
        <button type="button" className="rounded-md bg-white/[0.04] px-3 py-2">
          &gt;
        </button>
      </div>
    </div>
  );
}

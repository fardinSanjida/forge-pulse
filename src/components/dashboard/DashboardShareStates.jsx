import Image from "next/image";

function Icon({ children }) {
  return (
    <svg
      aria-hidden="true"
      viewBox="0 0 24 24"
      className="h-5 w-5"
      fill="none"
      stroke="currentColor"
      strokeLinecap="round"
      strokeLinejoin="round"
      strokeWidth="2"
    >
      {children}
    </svg>
  );
}

function StatCard({ stat }) {
  return (
    <article className="relative min-h-44 overflow-hidden rounded-md border border-white/10 bg-[#0c151d] p-5 shadow-xl shadow-black/20">
      <Image
        src={stat.image}
        alt=""
        fill
        sizes="(min-width: 1280px) 260px, (min-width: 768px) 33vw, 100vw"
        className="object-cover opacity-45"
        placeholder="blur"
      />
      <div className={`absolute inset-0 bg-gradient-to-br ${stat.tint}`} />
      <div className="relative flex h-full flex-col justify-between">
        <span className="flex h-10 w-10 items-center justify-center rounded-md bg-white/15 text-white">
          <Icon>{stat.icon}</Icon>
        </span>
        <div>
          <p className="text-sm font-medium text-white/75">{stat.label}</p>
          <h2 className="mt-2 text-3xl font-black tracking-normal text-white">
            {stat.value}
          </h2>
          <p className="mt-5 text-sm font-semibold text-white/75">
            {stat.action} <span aria-hidden="true">-&gt;</span>
          </p>
        </div>
      </div>
    </article>
  );
}

export { StatCard };
export default StatCard;

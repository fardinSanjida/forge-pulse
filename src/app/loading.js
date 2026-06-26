export default function Loading() {
  return (
    <section className="grid min-h-screen place-items-center bg-[#060b10] px-4 text-white">
      <div className="text-center">
        <div className="mx-auto h-14 w-14 animate-spin rounded-full border-4 border-white/10 border-t-orange-500" />
        <p className="mt-5 text-sm font-black uppercase text-white/55">
          Loading Forge Pulse
        </p>
      </div>
    </section>
  );
}

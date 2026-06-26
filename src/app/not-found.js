import Link from "next/link";

export default function NotFound() {
  return (
    <section className="grid min-h-screen place-items-center bg-[#111318] px-4 text-center text-white">
      <div className="max-w-xl">
        <div className="mx-auto grid h-36 w-36 place-items-center rounded-full border border-orange-400/30 bg-orange-500/10 text-5xl font-black text-orange-300">
          404
        </div>
        <h1 className="mt-8 text-4xl font-black uppercase">Page Not Found</h1>
        <p className="mt-4 text-sm leading-6 text-white/60">
          The page you are looking for is not available or may have moved.
        </p>
        <Link
          href="/"
          className="mt-8 inline-flex rounded-full bg-orange-500 px-6 py-3 text-sm font-black uppercase text-white transition hover:bg-orange-400"
        >
          Back to Home
        </Link>
      </div>
    </section>
  );
}

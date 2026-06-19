import Image from "next/image";
import Link from "next/link";
import heroImage from "../../asset/hero.jpg";
import {ArrowDownRight} from '@gravity-ui/icons';

const BannerSection = () => {
  return (
    <section className="relative h-full w-full overflow-hidden bg-black text-white">
      <Image
        src={heroImage}
        alt="Athlete preparing to lift a barbell in a dark gym"
        fill
        priority
        sizes="100vw"
        className="object-cover object-center"
      />
      <div className="absolute inset-0 bg-black/10" aria-hidden="true" />
      <div
        className="absolute inset-0 bg-[radial-gradient(circle_at_70%_55%,transparent_0,rgba(0,0,0,0.15)_28%,rgba(0,0,0,0.72)_78%)]"
        aria-hidden="true"
      />
      <div className="absolute bottom-0 left-0 right-0 h-2 bg-orange-500" aria-hidden="true" />

      <div className="relative z-10 flex min-h-[calc(100vh-5rem)] w-full max-w-7xl flex-col justify-between gap-16 px-4 py-14 sm:px-10 sm:py-16 lg:px-16 lg:py-20">
        <p className="max-w-sm text-sm font-medium leading-6 text-white/82 sm:ml-16 sm:text-base lg:ml-20">
          <span className="sm:ml-20">This</span> isn&apos;t a place for workout. It&apos;s where discipline meets ambition,
          and every rep brings you closer to the strongest version of yourself.
        </p>

        <div className="max-w-4xl">
          <h1 className="max-w-4xl text-4xl font-black uppercase leading-[0.95] text-white sm:text-6xl lg:text-7xl xl:text-8xl">
            BUILT FOR THE ONES WHO
            <span className="block">NEVER SETTLE</span>
          </h1>

          <Link
            href="/classes"
            className="mt-8 inline-flex h-12 items-center justify-center rounded-full bg-orange-500 px-6 text-lg font-bold uppercase text-white transition hover:bg-orange-400 focus:outline-none focus:ring-2 focus:ring-orange-200"
          >
            Explore Classes {<ArrowDownRight className=" text-orange-500 ml-2 p-1 w-10 h-8  bg-white rounded-full" />}
          </Link>
        </div>
      </div>
    </section>
  );
};

export default BannerSection;

"use client";

import Image from "next/image";
import Link from "next/link";
import { motion } from "framer-motion";
import heroImage from "../../asset/hero.jpg";
import {ArrowDownRight} from '@gravity-ui/icons';

const BannerSection = () => {
  return (
    <section className="relative h-full w-full overflow-hidden bg-black text-white border-b-9 border-orange-500 rounded-b-4xl">
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

      <div className="relative z-10 flex min-h-[calc(100vh-5rem)] w-full max-w-7xl flex-col justify-between gap-16 px-4 py-14 sm:px-10 sm:py-16 lg:px-16 lg:py-20">
        <motion.p
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, ease: "easeOut" }}
          className="max-w-sm text-sm font-medium leading-6 text-white/82 sm:ml-16 sm:text-base lg:ml-20"
        >
          <span className="sm:ml-20">This </span> isn&apos;t a place for workout. It&apos;s where discipline meets ambition,
          and every rep brings you closer to the strongest version of yourself.
        </motion.p>

        <div className="max-w-4xl">
          <motion.h1
            initial={{ opacity: 0, y: 50 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, ease: "easeOut", delay: 0.2 }}
            className="max-w-4xl text-4xl font-black uppercase leading-[0.95] text-white sm:text-6xl lg:text-7xl xl:text-8xl"
          >
            BUILT FOR THE ONES WHO
            <span className="block">NEVER SETTLE</span>
          </motion.h1>

          <motion.div
            initial={{ opacity: 0, y: 24 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, ease: "easeOut", delay: 0.45 }}
          >
            <Link
              href="/classes"
              className="mt-8 inline-flex h-12 items-center justify-center rounded-full bg-orange-500 pl-6 pr-2 text-lg font-bold uppercase text-white transition hover:bg-orange-400 focus:outline-none focus:ring-2 focus:ring-orange-200"
            >
              Explore Classes {<ArrowDownRight className=" text-white ml-3 p-2 w-9 h-9  bg-black rounded-full" />}
            </Link>
          </motion.div>
        </div>
      </div>
    </section>
  );
};

export default BannerSection;

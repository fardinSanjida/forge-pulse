"use client";

import Image from "next/image";
import { motion } from "framer-motion";
import hero2 from "../../asset/hero2.jpg";
import strengthImage from "../../asset/image2.jpg";

const stats = [
  "24/7 Gym Access",
  "Live Trainers",
  "2K+ Members",
  "20+ Expert Trainers",
  "Training Programs",
];

const highlights = [
  "01. More than fifteen years of experience",
  "02. Authorized instructors",
  "03. Outstanding caliber of work",
];

function StatStrip({ reverse = false }) {
  return (
    <div className="relative z-10 overflow-hidden border-y border-black bg-white py-3 text-black">
      <div
        className={`stat-strip-track flex w-max min-w-full items-center gap-8 px-6 text-sm font-black uppercase tracking-wide sm:text-base ${
          reverse ? "stat-strip-track-reverse" : ""
        }`}
      >
        {[...stats, ...stats].map((item, index) => (
          <div key={`${item}-${index}`} className="flex items-center gap-8">
            <span>{item}</span>
            <span className="text-xl leading-none">+</span>
          </div>
        ))}
      </div>

      <style>{`
        .stat-strip-track {
          animation: stat-strip-scroll 22s linear infinite;
        }

        .stat-strip-track-reverse {
          animation-direction: reverse;
        }

        .stat-strip-track:hover {
          animation-play-state: paused;
        }

        @keyframes stat-strip-scroll {
          from {
            transform: translateX(0);
          }
          to {
            transform: translateX(-50%);
          }
        }

        @media (prefers-reduced-motion: reduce) {
          .stat-strip-track {
            animation: none;
          }
        }
      `}</style>
    </div>
  );
}

function AboutUs() {
  return (
    <section className="relative overflow-hidden bg-black text-white">
      <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_12%_28%,rgba(249,115,22,0.28),transparent_30%),radial-gradient(circle_at_78%_45%,rgba(249,115,22,0.2),transparent_32%),radial-gradient(circle_at_50%_100%,rgba(194,65,12,0.2),transparent_36%)]" />

      <StatStrip />

      <div className="relative z-10 mx-auto grid max-w-6xl items-center gap-12 px-4 py-20 sm:px-6 lg:grid-cols-[1.05fr_0.95fr] lg:px-8">
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          whileInView={{ opacity: 1, scale: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 0.7, ease: "easeOut" }}
          className="relative mx-auto min-h-[430px] w-full max-w-[600px]"
        >
          <div className="absolute left-20 top-0 h-72 w-[58%] overflow-hidden rounded-tl-[5rem] rounded-tr-sm rounded-br-sm rounded-bl-sm sm:left-8 sm:h-80">
            <Image
              src={hero2}
              alt="Athletes training with dumbbells"
              fill
              sizes="(max-width: 1024px) 60vw, 320px"
              className="object-cover"
            />
          </div>

          <div className="absolute right-1 top-20 h-72 w-[58%] overflow-hidden rounded-br-[5rem] rounded-sm sm:h-80">
            <Image
              src={strengthImage}
              alt="Athlete doing strength training"
              fill
              sizes="(max-width: 1024px) 60vw, 320px"
              className="object-cover"
            />
          </div>

          <div className="absolute bottom-4 left-[34%] z-10 flex h-20 w-20 items-center justify-center rounded-full border-4 border-[#282828] bg-orange-500 shadow-2xl shadow-black/40 sm:h-24 sm:w-24">
            <span className="text-xl font-black tracking-tight">GYM</span>
          </div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, x: 40 }}
          whileInView={{ opacity: 1, x: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.65, ease: "easeOut" }}
        >
          <p className="text-sm font-black uppercase text-orange-400">
            About Us
          </p>
          <h2 className="mt-6 max-w-2xl text-4xl font-light leading-tight text-white sm:text-5xl">
            We Have a{" "}
            <span className="font-black text-orange-500">Great Deal</span> of
            Experience With{" "}
            <span className="font-black text-orange-500">Fitness</span>
          </h2>
          <p className="mt-6 max-w-xl text-sm leading-6 text-white/58">
            A lot of people gain from customized exercise regimens created by
            personal trainers or fitness experts to target particular fitness
            objectives, such weight loss, muscle building, or enhanced sports
            performance.
          </p>

          <div className="mt-7 space-y-3">
            {highlights.map((item, index) => (
              <motion.div
                key={item}
                initial={{ opacity: 0, x: 30 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.4, ease: "easeOut", delay: index * 0.1 }}
                className="flex items-center justify-between bg-white/10 px-5 py-4 text-sm font-bold text-white/85"
              >
                <span>{item}</span>
                <span className="text-orange-300">+</span>
              </motion.div>
            ))}
          </div>
        </motion.div>
      </div>

      <StatStrip reverse />
    </section>
  );
}

export default AboutUs;

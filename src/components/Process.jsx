"use client";

import Image from "next/image";
import { motion } from "framer-motion";
import image3 from "../../asset/image3.jpg";
import image4 from "../../asset/image4.jpg";
import image9 from "../../asset/image9.jpg";

const processSteps = [
  {
    step: "Step - 1",
    title: "Gym Movement",
    description:
      "Build your foundation with guided movement, clean form, and training habits that prepare your body for consistent progress.",
    image: image3,
    alt: "Athlete lifting a dumbbell during strength training",
  },
  {
    step: "Step - 2",
    title: "Fitness Practice",
    description:
      "Push through focused workouts with expert coaching, structured routines, and the energy to keep improving every session.",
    image: image4,
    alt: "Athlete training with battle ropes",
    featured: true,
  },
  {
    step: "Step - 3",
    title: "Achievements",
    description:
      "Celebrate stronger performance, better discipline, and the confidence that comes from showing up and finishing the work.",
    image: image9,
    alt: "Gym members celebrating progress with a fist bump",
  },
];

const Process = () => {
  return (
    <section className="relative overflow-hidden bg-black px-4 py-20 text-white sm:px-6 lg:px-8">
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_10%_10%,rgba(249,115,22,0.16),transparent_28%),radial-gradient(circle_at_85%_55%,rgba(249,115,22,0.08),transparent_30%)]" />

      <div className="relative mx-auto max-w-7xl">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6, ease: "easeOut" }}
          className="mx-auto max-w-3xl text-center"
        >
          <div className="flex items-center justify-center gap-4 text-sm font-medium text-white/75">
            <span className="h-px w-20 bg-orange-400" />
            <span>Work Process In Our Gym</span>
            <span className="h-px w-20 bg-orange-400" />
          </div>
          <h2 className="mt-6 text-3xl font-black leading-tight text-white sm:text-4xl lg:text-5xl">
            Easy Step To Achieve Your Goals.
          </h2>
        </motion.div>

        <div className="relative mt-16 grid gap-12 lg:grid-cols-3 lg:gap-10">
          <svg
            className="pointer-events-none absolute left-[23%] top-24 hidden h-40 w-[50%] text-orange-400/80 lg:block"
            viewBox="0 0 700 170"
            fill="none"
            aria-hidden="true"
          >
            <path
              d="M10 120C120 178 210 178 300 58"
              stroke="currentColor"
              strokeWidth="3"
              strokeDasharray="8 8"
              strokeLinecap="round"
            />
            <path
              d="M400 58C492 -22 610 -8 690 92"
              stroke="currentColor"
              strokeWidth="3"
              strokeDasharray="8 8"
              strokeLinecap="round"
            />
            <path
              d="M674 90L692 94L686 76"
              stroke="currentColor"
              strokeWidth="3"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
          </svg>

          {processSteps.map((item, index) => (
            <motion.article
              key={item.step}
              initial={{ opacity: 0, y: 40 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.55, ease: "easeOut", delay: index * 0.15 }}
              className="relative text-center"
            >
              <div
                className={`mx-auto rounded-full ${
                  item.featured
                    ? "h-80 w-80 bg-orange-400 p-3 shadow-[0_20px_50px_rgba(249,115,22,0.22)]"
                    : "h-76 w-76 bg-neutral-900 p-2 shadow-[0_18px_40px_rgba(0,0,0,0.45)]"
                }`}
              >
                <div className="relative h-full w-full overflow-hidden rounded-full">
                  <Image
                    src={item.image}
                    alt={item.alt}
                    fill
                    sizes="(min-width: 1024px) 240px, 224px"
                    className={`object-cover ${item.featured ? "" : "grayscale"}`}
                  />
                  <div className="absolute inset-0 bg-black/20" />
                </div>
              </div>

              <p className="mt-7 text-xl font-black italic text-white [text-shadow:0_2px_0_rgba(0,0,0,0.85)]">
                {item.step}
              </p>
              <h3
                className={`mt-3 text-2xl font-black ${
                  item.featured ? "text-orange-400" : "text-white"
                }`}
              >
                {item.title}
              </h3>
              <p className="mx-auto mt-4 max-w-xs text-sm leading-6 text-white/55">
                {item.description}
              </p>
            </motion.article>
          ))}
        </div>
      </div>
    </section>
  );
};

export default Process;

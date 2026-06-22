import strength from "../../asset/strength.jpg";
import spin from "../../asset/spin.jpg";
import trainer from "../../asset/trainer.jpg";
import heat from "../../asset/heat.jpg";
import boxing from "../../asset/boxing.jpg";
import image6 from "../../asset/image6.jpg";
import yoga2 from "../../asset/yoga2.jpg";
import image8 from "../../asset/image8.jpg";
import athletic from "../../asset/athletic.jpg";

export const featureClasses = [
  {
    id: "strength-lab",
    name: "Strength Lab",
    trainer: "Marcus Reed",
    category: "Strength",
    price: "$45 / 60 min",
    duration: "60 min",
    schedule: "Mon, Wed, Fri at 6:00 PM",
    description:
      "A focused strength session built around progressive lifts, clean form, and coaching that helps members build power safely.",
    bookingCount: 246,
    image:strength  ,
  },
  {
    id: "hiit-burn",
    name: "HIIT Burn",
    trainer: "Nadia Brooks",
    category: "Cardio",
    price: "$38 / 45 min",
    duration: "45 min",
    schedule: "Tue, Thu at 7:30 PM",
    description:
      "High-energy intervals, conditioning drills, and measured recovery blocks designed to improve stamina and burn calories.",
    bookingCount: 232,
    image: heat,
  },
  {
    id: "power-yoga",
    name: "Power Yoga",
    trainer: "Sofia Chen",
    category: "Yoga",
    price: "$32 / 50 min",
    duration: "50 min",
    schedule: "Mon, Wed at 8:00 AM",
    description:
      "A strong yoga flow that blends mobility, balance, breath control, and bodyweight strength for steady progress.",
    bookingCount: 219,
    image: yoga2,
  },
  {
    id: "personal-training",
    name: "Personal Training",
    trainer: "Daniel Knox",
    category: "Personal Coaching",
    price: "$65 / 60 min",
    duration: "60 min",
    schedule: "Flexible slots by appointment",
    description:
      "One-on-one coaching with custom programming, technique feedback, and accountability for your personal fitness goals.",
    bookingCount: 198,
    image: trainer,
  },
  {
    id: "boxing-conditioning",
    name: "Boxing Conditioning",
    trainer: "Ariana Cole",
    category: "Boxing",
    price: "$42 / 55 min",
    duration: "55 min",
    schedule: "Tue, Sat at 6:30 PM",
    description:
      "Boxing combinations, footwork, and conditioning rounds that sharpen coordination while building total-body endurance.",
    bookingCount: 184,
    image: boxing,
  },
  {
    id: "mobility-reset",
    name: "Mobility Reset",
    trainer: "Ethan Miles",
    category: "Recovery",
    price: "$28 / 40 min",
    duration: "40 min",
    schedule: "Sun at 10:00 AM",
    description:
      "Recovery-focused mobility work for hips, shoulders, spine, and ankles so training feels smoother week after week.",
    bookingCount: 171,
    image: image6,
  },
  {
    id: "spin-rush",
    name: "Spin Rush",
    trainer: "Lena Hart",
    category: "Cycling",
    price: "$35 / 45 min",
    duration: "45 min",
    schedule: "Mon, Thu at 7:00 AM",
    description:
      "Rhythm-based cycling with climbs, sprints, and endurance pushes for a compact cardio session with serious energy.",
    bookingCount: 163,
    image: spin,
  },
  {
    id: "core-control",
    name: "Core Control",
    trainer: "Miles Carter",
    category: "Core",
    price: "$30 / 45 min",
    duration: "45 min",
    schedule: "Wed, Fri at 5:30 PM",
    description:
      "Core stability, anti-rotation drills, and controlled strength work to support better posture and stronger lifts.",
    bookingCount: 147,
    image: image8,
  },
  {
    id: "athlete-performance",
    name: "Athlete Performance",
    trainer: "Priya Shah",
    category: "Performance",
    price: "$50 / 60 min",
    duration: "60 min",
    schedule: "Sat at 8:00 AM",
    description:
      "Athletic performance training with speed, agility, strength, and conditioning for members chasing a higher gear.",
    bookingCount: 136,
    image: athletic,
  },
];

export function getTopFeatureClasses(limit = 3) {
  return [...featureClasses]
    .sort((first, second) => second.bookingCount - first.bookingCount)
    .slice(0, limit);
}

export function getFeatureClassById(id) {
  return featureClasses.find((classItem) => classItem.id === id);
}

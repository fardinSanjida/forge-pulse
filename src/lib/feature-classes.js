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
    bookingCount: 136,
    image: athletic,
  },
];

export function getTopFeatureClasses(limit = 3) {
  return [...featureClasses]
    .sort((first, second) => second.bookingCount - first.bookingCount)
    .slice(0, limit);
}

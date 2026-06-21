import boxingImage from "../../asset/boxing.jpg";
import image1 from "../../asset/image1.jpg";
import image3 from "../../asset/image3.jpg";
import image4 from "../../asset/image4.jpg";
import image5 from "../../asset/image5.jpg";
import image7 from "../../asset/image7.jpg";
import image9 from "../../asset/image9.jpg";
import trainerImage from "../../asset/trainer.jpg";
import yogaImage from "../../asset/yoga.jpg";
import yoga2Image from "../../asset/yoga2.jpg";

export const communityPosts = [
  {
    id: "warm-up-before-strength-training",
    title: "Best warm-up routine before heavy strength training",
    date: "21 Jun, 2026",
    comments: 18,
    excerpt:
      "Members share their favorite mobility drills, activation sets, and simple ways to reduce injury risk before lifting.",
    image: trainerImage,
    alt: "Trainer discussing a gym routine with a client",
  },
  {
    id: "consistent-evening-workouts",
    title: "How do you stay consistent with evening workouts?",
    date: "20 Jun, 2026",
    comments: 12,
    excerpt:
      "A practical discussion about motivation, meal timing, recovery, and keeping gym sessions steady after a long day.",
    image: boxingImage,
    alt: "Athlete training with boxing gloves",
  },
  {
    id: "recovery-after-intense-class",
    title: "Favorite recovery tips after an intense class",
    date: "19 Jun, 2026",
    comments: 9,
    excerpt:
      "Community members compare stretching, hydration, sleep habits, and light movement for better post-workout recovery.",
    image: yoga2Image,
    alt: "Person stretching during a recovery session",
  },
  {
    id: "first-week-gym-confidence",
    title: "What helped you feel confident during your first gym week?",
    date: "18 Jun, 2026",
    comments: 16,
    excerpt:
      "New members swap advice on asking questions, learning machines, and building a routine without feeling overwhelmed.",
    image: image1,
    alt: "Gym member training with equipment",
  },
  {
    id: "tracking-progress-without-scale",
    title: "How are you tracking progress without only using the scale?",
    date: "17 Jun, 2026",
    comments: 14,
    excerpt:
      "A thread about strength logs, progress photos, energy levels, measurements, and celebrating non-scale wins.",
    image: image5,
    alt: "Athlete focused during a gym workout",
  },
  {
    id: "group-class-playlist-energy",
    title: "Best playlist style for high-energy group classes",
    date: "16 Jun, 2026",
    comments: 22,
    excerpt:
      "Members suggest beats, pacing, and favorite workout music styles that keep class energy high from start to finish.",
    image: image7,
    alt: "Group training session in a gym",
  },
  {
    id: "mobility-for-desk-workers",
    title: "Simple mobility work for people sitting all day",
    date: "15 Jun, 2026",
    comments: 11,
    excerpt:
      "The community shares hip, back, shoulder, and neck mobility moves that fit before or after work.",
    image: yogaImage,
    alt: "Person practicing yoga mobility work",
  },
  {
    id: "dumbbell-form-checks",
    title: "Which dumbbell form cues made the biggest difference?",
    date: "14 Jun, 2026",
    comments: 8,
    excerpt:
      "Members compare coaching cues for rows, presses, curls, and lunges that made their lifts cleaner.",
    image: image3,
    alt: "Athlete lifting a dumbbell",
  },
  {
    id: "battle-rope-conditioning",
    title: "Battle rope finishers that do not burn you out too early",
    date: "13 Jun, 2026",
    comments: 15,
    excerpt:
      "A conditioning thread with timing ideas, rest intervals, and ways to scale battle rope work for different levels.",
    image: image4,
    alt: "Athlete training with battle ropes",
  },
  {
    id: "training-partner-benefits",
    title: "Do training partners help you stay accountable?",
    date: "12 Jun, 2026",
    comments: 19,
    excerpt:
      "Members discuss workout partners, shared goals, friendly challenges, and the boost that comes from showing up together.",
    image: image9,
    alt: "Gym members celebrating progress together",
  },
];

export function getRecentCommunityPosts(limit = 3) {
  return communityPosts.slice(0, limit);
}

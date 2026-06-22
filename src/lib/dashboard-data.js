import { communityPosts } from "@/lib/community-posts";
import { featureClasses } from "@/lib/feature-classes";

export const demoUsers = [
  {
    id: "user-1",
    name: "Amina Rahman",
    email: "amina@example.com",
    role: "user",
    status: "Active",
    applicationStatus: "Pending",
    feedback: "",
  },
  {
    id: "user-2",
    name: "Rafi Khan",
    email: "rafi@example.com",
    role: "user",
    status: "Blocked",
    applicationStatus: "Rejected",
    feedback: "Please add more specialty details and recent coaching proof.",
  },
  {
    id: "trainer-1",
    name: "Marcus Reed",
    email: "marcus@example.com",
    role: "trainer",
    status: "Active",
    applicationStatus: "Approved",
    feedback: "",
  },
  {
    id: "admin-1",
    name: "Admin User",
    email: "admin@forgepulse.com",
    role: "admin",
    status: "Active",
    applicationStatus: "Approved",
    feedback: "",
  },
];

export const demoApplications = [
  {
    id: "application-1",
    name: "Amina Rahman",
    email: "amina@example.com",
    experience: "4",
    specialty: "Yoga",
    time: "22 Jun, 2026 10:15 AM",
    status: "Pending",
    feedback: "",
  },
  {
    id: "application-2",
    name: "Samir Hossain",
    email: "samir@example.com",
    experience: "7",
    specialty: "Weights",
    time: "22 Jun, 2026 11:20 AM",
    status: "Pending",
    feedback: "",
  },
];

export const demoClasses = featureClasses.slice(0, 5).map((classItem, index) => ({
  ...classItem,
  schedule: ["Mon, Wed 6:00 PM", "Tue, Thu 7:30 PM", "Sat 9:00 AM"][index % 3],
  difficulty: ["Beginner", "Intermediate", "Advanced"][index % 3],
  description: `${classItem.name} keeps members moving with focused coaching and steady progression.`,
  trainerEmail: index % 2 === 0 ? "marcus@example.com" : "trainer@forgepulse.com",
  status: index < 3 ? "Approved" : "Pending",
  students: [
    { name: "Amina Rahman", email: "amina@example.com" },
    { name: "Rafi Khan", email: "rafi@example.com" },
  ].slice(0, (index % 2) + 1),
}));

export const demoForumPosts = communityPosts.slice(0, 5).map((post, index) => ({
  ...post,
  authorEmail: index % 2 === 0 ? "marcus@example.com" : "admin@forgepulse.com",
  authorRole: index % 2 === 0 ? "trainer" : "admin",
  description: post.excerpt,
}));

export const demoTransactions = [
  {
    id: "txn_10493",
    userEmail: "amina@example.com",
    amount: "$45.00",
    date: "22 Jun, 2026",
  },
  {
    id: "txn_10494",
    userEmail: "rafi@example.com",
    amount: "$38.00",
    date: "21 Jun, 2026",
  },
  {
    id: "txn_10495",
    userEmail: "nila@example.com",
    amount: "$65.00",
    date: "20 Jun, 2026",
  },
];

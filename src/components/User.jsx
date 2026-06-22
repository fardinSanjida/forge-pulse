"use client";

import Link from "next/link";
import { useState } from "react";
import {
  DashboardCard,
  DashboardTable,
  Field,
  PrimaryButton,
  ProfilePanel,
  SecondaryButton,
  SelectInput,
  TextInput,
} from "@/components/DashboardUi";

export const userPages = [
  ["overview", "Overview"],
  ["booked-classes", "Booked Classes"],
  ["apply-trainer", "Apply as Trainer"],
  ["favorites", "Favorite Classes"],
];

function readCollection(key) {
  if (typeof window === "undefined") {
    return [];
  }

  try {
    return JSON.parse(window.localStorage.getItem(key) || "[]");
  } catch {
    return [];
  }
}

function writeCollection(key, value) {
  window.localStorage.setItem(key, JSON.stringify(value));
}

function getUserKey(user) {
  return user?.email?.toLowerCase() || "guest";
}

function TrainerApplicationForm({ application, onSubmit }) {
  const [experience, setExperience] = useState(application?.experience || "");
  const [specialty, setSpecialty] = useState(application?.specialty || "Yoga");

  return (
    <form
      className="max-w-2xl space-y-5 rounded-lg border border-white/10 bg-white/[0.04] p-5"
      onSubmit={(event) => {
        event.preventDefault();
        onSubmit({ experience, specialty });
      }}
    >
      <p className="text-sm text-white/55">
        Current status: <span className="font-bold">{application?.status}</span>
      </p>
      <Field label="Experience (years)">
        <TextInput
          type="number"
          min="0"
          value={experience}
          onChange={(event) => setExperience(event.target.value)}
          required
        />
      </Field>
      <Field label="Specialty">
        <SelectInput
          value={specialty}
          onChange={(event) => setSpecialty(event.target.value)}
          required
        >
          <option>Yoga</option>
          <option>Weights</option>
          <option>Cardio</option>
          <option>Boxing</option>
          <option>Recovery</option>
        </SelectInput>
      </Field>
      <PrimaryButton type="submit">Submit Application</PrimaryButton>
    </form>
  );
}

export default function UserDashboard({
  section,
  currentUser,
  bookedClasses,
  favorites,
  setFavorites,
  application,
  setApplication,
  restrictAction,
}) {
  const userKey = getUserKey(currentUser);
  const storedBookedClasses = readCollection(`forge-pulse-bookings:${userKey}`).map(
    (booking) => ({
      id: booking.classId,
      name: booking.name,
      trainer: booking.trainer,
      schedule: booking.schedule,
    }),
  );
  const storedFavorites = readCollection(`forge-pulse-favorites:${userKey}`).map(
    (favorite) => ({
      id: favorite.classId,
      name: favorite.name,
      trainer: favorite.trainer,
      price: favorite.price,
      schedule: favorite.schedule,
    }),
  );
  const visibleBookedClasses =
    storedBookedClasses.length > 0 ? storedBookedClasses : bookedClasses;
  const visibleFavorites = storedFavorites.length > 0 ? storedFavorites : favorites;

  if (section === "booked-classes") {
    return (
      <DashboardTable
        columns={[
          { key: "name", label: "Class Name" },
          { key: "trainer", label: "Trainer Name" },
          { key: "schedule", label: "Schedule" },
          {
            key: "actions",
            label: "Action",
            render: (row) => (
              <Link
                href={`/classes#${row.id}`}
                className="font-bold text-orange-300 hover:text-orange-200"
              >
                View Details
              </Link>
            ),
          },
        ]}
        rows={visibleBookedClasses}
      />
    );
  }

  if (section === "apply-trainer") {
    return (
      <TrainerApplicationForm
        application={application}
        onSubmit={(formData) => {
          if (restrictAction()) {
            return;
          }

          setApplication({
            ...formData,
            id: "current-user-application",
            status: "Pending",
            feedback: "",
            time: new Date().toLocaleString(),
          });
        }}
      />
    );
  }

  if (section === "favorites") {
    return (
      <div className="grid gap-5 md:grid-cols-2 xl:grid-cols-3">
        {visibleFavorites.map((classItem) => (
          <article
            key={classItem.id}
            className="rounded-lg border border-white/10 bg-white/[0.04] p-5"
          >
            <h3 className="text-lg font-black">{classItem.name}</h3>
            <p className="mt-1 text-sm text-white/55">{classItem.trainer}</p>
            <p className="mt-4 text-sm text-orange-300">{classItem.price}</p>
            <SecondaryButton
              type="button"
              className="mt-5"
              onClick={() => {
                const favoriteKey = `forge-pulse-favorites:${userKey}`;
                writeCollection(
                  favoriteKey,
                  readCollection(favoriteKey).filter(
                    (favorite) => favorite.classId !== classItem.id,
                  ),
                );
                setFavorites((items) =>
                  items.filter((item) => item.id !== classItem.id),
                );
              }}
            >
              Delete
            </SecondaryButton>
          </article>
        ))}
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="grid gap-4 md:grid-cols-2">
        <DashboardCard
          label="Total Booked Classes"
          value={visibleBookedClasses.length}
        />
        <DashboardCard label="Total Favorites" value={visibleFavorites.length} />
      </div>
      <ProfilePanel user={currentUser} role="User" application={application} />
    </div>
  );
}

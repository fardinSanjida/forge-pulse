"use client";

import { useState } from "react";
import {
  DashboardCard,
  DashboardTable,
  Field,
  Modal,
  PrimaryButton,
  ProfilePanel,
  SecondaryButton,
  SelectInput,
  TextArea,
  TextInput,
} from "@/components/DashboardUi";

export const trainerPages = [
  ["overview", "Overview"],
  ["add-class", "Add Class"],
  ["my-classes", "My Classes"],
  ["add-forum-post", "Add Forum Post"],
  ["my-forum-posts", "My Forum Posts"],
];

function ClassForm({ initialData = {}, submitLabel, onSubmit }) {
  const initialImage =
    typeof initialData.image === "string" ? initialData.image : initialData.image?.src || "";
  const [formData, setFormData] = useState({
    name: initialData.name || "",
    image: initialImage,
    category: initialData.category || "Strength",
    difficulty: initialData.difficulty || "Beginner",
    duration: initialData.duration || "",
    schedule: initialData.schedule || "",
    price: initialData.price || "",
    description: initialData.description || "",
  });

  const updateField = (field, value) => {
    setFormData((current) => ({ ...current, [field]: value }));
  };

  return (
    <form
      className="grid gap-5 rounded-lg border border-white/10 bg-white/[0.04] p-5 lg:grid-cols-2"
      onSubmit={(event) => {
        event.preventDefault();
        onSubmit(formData);
      }}
    >
      <Field label="Class Name">
        <TextInput
          value={formData.name}
          onChange={(event) => updateField("name", event.target.value)}
          required
        />
      </Field>
      <Field label="Image">
        <TextInput
          value={formData.image}
          onChange={(event) => updateField("image", event.target.value)}
          placeholder="Image URL"
          required
        />
      </Field>
      <Field label="Category">
        <TextInput
          value={formData.category}
          onChange={(event) => updateField("category", event.target.value)}
          required
        />
      </Field>
      <Field label="Difficulty Level">
        <SelectInput
          value={formData.difficulty}
          onChange={(event) => updateField("difficulty", event.target.value)}
        >
          <option>Beginner</option>
          <option>Intermediate</option>
          <option>Advanced</option>
        </SelectInput>
      </Field>
      <Field label="Duration">
        <TextInput
          value={formData.duration}
          onChange={(event) => updateField("duration", event.target.value)}
          placeholder="60 min"
          required
        />
      </Field>
      <Field label="Class Schedule (Days & Time)">
        <TextInput
          value={formData.schedule}
          onChange={(event) => updateField("schedule", event.target.value)}
          placeholder="Mon, Wed 6:00 PM"
          required
        />
      </Field>
      <Field label="Price">
        <TextInput
          value={formData.price}
          onChange={(event) => updateField("price", event.target.value)}
          placeholder="$45"
          required
        />
      </Field>
      <div className="lg:col-span-2">
        <Field label="Description">
          <TextArea
            value={formData.description}
            onChange={(event) => updateField("description", event.target.value)}
            required
          />
        </Field>
      </div>
      <div className="lg:col-span-2">
        <PrimaryButton type="submit">{submitLabel}</PrimaryButton>
      </div>
    </form>
  );
}

export function ForumPostForm({ onSubmit }) {
  const [formData, setFormData] = useState({
    title: "",
    image: "",
    description: "",
  });

  const updateField = (field, value) => {
    setFormData((current) => ({ ...current, [field]: value }));
  };

  return (
    <form
      className="max-w-3xl space-y-5 rounded-lg border border-white/10 bg-white/[0.04] p-5"
      onSubmit={(event) => {
        event.preventDefault();
        onSubmit(formData);
        setFormData({ title: "", image: "", description: "" });
      }}
    >
      <Field label="Title">
        <TextInput
          value={formData.title}
          onChange={(event) => updateField("title", event.target.value)}
          required
        />
      </Field>
      <Field label="Image (Imgbb upload URL)">
        <TextInput
          type="url"
          value={formData.image}
          onChange={(event) => updateField("image", event.target.value)}
          placeholder="https://i.ibb.co/..."
          required
        />
      </Field>
      <Field label="Description">
        <TextArea
          value={formData.description}
          onChange={(event) => updateField("description", event.target.value)}
          required
        />
      </Field>
      <PrimaryButton type="submit">Publish Post</PrimaryButton>
    </form>
  );
}

export function ForumPostGrid({ posts, onDelete }) {
  if (posts.length === 0) {
    return <p className="text-sm text-white/55">No forum posts found.</p>;
  }

  return (
    <div className="grid gap-5 md:grid-cols-2 xl:grid-cols-3">
      {posts.map((post) => (
        <article
          key={post.id}
          className="rounded-lg border border-white/10 bg-white/[0.04] p-5"
        >
          <h3 className="text-lg font-black">{post.title}</h3>
          <p className="mt-3 text-sm leading-6 text-white/55">
            {post.description || post.excerpt}
          </p>
          <SecondaryButton
            type="button"
            className="mt-5"
            onClick={() => {
              if (confirm("Delete this forum post?")) {
                onDelete(post.id);
              }
            }}
          >
            Delete
          </SecondaryButton>
        </article>
      ))}
    </div>
  );
}

export default function TrainerDashboard({
  section,
  currentUser,
  trainerClasses,
  setClasses,
  forumPosts,
  setForumPosts,
}) {
  const [selectedClass, setSelectedClass] = useState(null);
  const [editingClass, setEditingClass] = useState(null);

  if (section === "add-class") {
    return (
      <ClassForm
        submitLabel="Add Class"
        onSubmit={(classData) =>
          setClasses((items) => [
            {
              ...classData,
              id: `class-${Date.now()}`,
              trainer: currentUser?.name || "Current Trainer",
              trainerEmail: currentUser?.email || "trainer@forgepulse.com",
              status: "Pending",
              students: [],
            },
            ...items,
          ])
        }
      />
    );
  }

  if (section === "my-classes") {
    return (
      <div className="space-y-5">
        <DashboardTable
          columns={[
            { key: "name", label: "Class Name" },
            { key: "category", label: "Category" },
            { key: "schedule", label: "Schedule" },
            { key: "status", label: "Status" },
            {
              key: "actions",
              label: "Actions",
              render: (row) => (
                <div className="flex flex-wrap gap-2">
                  <SecondaryButton type="button" onClick={() => setEditingClass(row)}>
                    Update
                  </SecondaryButton>
                  <SecondaryButton type="button" onClick={() => setSelectedClass(row)}>
                    View Students
                  </SecondaryButton>
                  <SecondaryButton
                    type="button"
                    onClick={() => {
                      if (confirm("Delete this class?")) {
                        setClasses((items) =>
                          items.filter((item) => item.id !== row.id),
                        );
                      }
                    }}
                  >
                    Delete
                  </SecondaryButton>
                </div>
              ),
            },
          ]}
          rows={trainerClasses}
        />

        {editingClass && (
          <Modal title={`Update ${editingClass.name}`} onClose={() => setEditingClass(null)}>
            <ClassForm
              initialData={editingClass}
              submitLabel="Save Update"
              onSubmit={(classData) => {
                setClasses((items) =>
                  items.map((item) =>
                    item.id === editingClass.id ? { ...item, ...classData } : item,
                  ),
                );
                setEditingClass(null);
              }}
            />
          </Modal>
        )}

        {selectedClass && (
          <Modal
            title={`${selectedClass.name} Students`}
            onClose={() => setSelectedClass(null)}
          >
            <div className="space-y-3">
              {selectedClass.students.length === 0 ? (
                <p className="text-sm text-white/55">No students booked yet.</p>
              ) : (
                selectedClass.students.map((student) => (
                  <div
                    key={student.email}
                    className="rounded-md border border-white/10 bg-black/20 p-3"
                  >
                    <p className="font-bold">{student.name}</p>
                    <p className="text-sm text-white/55">{student.email}</p>
                  </div>
                ))
              )}
            </div>
          </Modal>
        )}
      </div>
    );
  }

  if (section === "add-forum-post") {
    return (
      <ForumPostForm
        onSubmit={(postData) =>
          setForumPosts((items) => [
            {
              ...postData,
              id: `post-${Date.now()}`,
              authorEmail: currentUser?.email || "trainer@forgepulse.com",
              authorRole: "trainer",
              date: new Date().toLocaleDateString(),
              comments: 0,
              excerpt: postData.description,
            },
            ...items,
          ])
        }
      />
    );
  }

  if (section === "my-forum-posts") {
    return (
      <ForumPostGrid
        posts={forumPosts.filter(
          (post) => post.authorEmail === (currentUser?.email || "marcus@example.com"),
        )}
        onDelete={(postId) =>
          setForumPosts((items) => items.filter((item) => item.id !== postId))
        }
      />
    );
  }

  return (
    <div className="space-y-6">
      <div className="grid gap-4 md:grid-cols-2">
        <DashboardCard
          label="Total Classes Created"
          value={trainerClasses.length}
        />
        <DashboardCard
          label="Total Students Enrolled"
          value={trainerClasses.reduce(
            (total, classItem) => total + classItem.students.length,
            0,
          )}
        />
      </div>
      <ProfilePanel user={currentUser} role="Trainer" />
    </div>
  );
}

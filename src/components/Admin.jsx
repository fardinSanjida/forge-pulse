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
  TextArea,
} from "@/components/DashboardUi";
import { ForumPostForm, ForumPostGrid } from "@/components/Trainer";

export const adminPages = [
  ["overview", "Overview"],
  ["manage-users", "Manage Users"],
  ["applied-trainers", "Applied Trainers"],
  ["manage-trainers", "Manage Trainers"],
  ["manage-classes", "Manage Classes"],
  ["add-forum-post", "Add Forum Post"],
  ["transactions", "Transactions"],
  ["forum-post-manage", "Forum Post Manage"],
];

function ApplicationModal({ application, onClose, onDecision }) {
  const [feedback, setFeedback] = useState(application.feedback || "");

  return (
    <Modal title={`${application.name} Application`} onClose={onClose}>
      <div className="space-y-4">
        <div className="grid gap-3 text-sm sm:grid-cols-2">
          <p>
            <span className="text-white/45">Experience:</span>{" "}
            {application.experience} years
          </p>
          <p>
            <span className="text-white/45">Specialty:</span>{" "}
            {application.specialty}
          </p>
          <p className="sm:col-span-2">
            <span className="text-white/45">Submitted:</span> {application.time}
          </p>
        </div>
        <Field label="Admin Feedback">
          <TextArea
            value={feedback}
            onChange={(event) => setFeedback(event.target.value)}
            placeholder="Write approval/rejection notes"
          />
        </Field>
        <div className="flex flex-wrap gap-3">
          <PrimaryButton type="button" onClick={() => onDecision("Approved", feedback)}>
            Approve
          </PrimaryButton>
          <SecondaryButton type="button" onClick={() => onDecision("Rejected", feedback)}>
            Reject
          </SecondaryButton>
        </div>
      </div>
    </Modal>
  );
}

export default function AdminDashboard({
  section,
  currentUser,
  users,
  setUsers,
  applications,
  setApplications,
  classes,
  setClasses,
  forumPosts,
  setForumPosts,
  transactions,
}) {
  const [selectedApplication, setSelectedApplication] = useState(null);

  if (section === "manage-users") {
    return (
      <DashboardTable
        columns={[
          { key: "name", label: "Name" },
          { key: "email", label: "Email" },
          { key: "role", label: "Role" },
          { key: "status", label: "Status" },
          {
            key: "actions",
            label: "Actions",
            render: (row) => (
              <div className="flex flex-wrap gap-2">
                <SecondaryButton
                  type="button"
                  onClick={() =>
                    setUsers((items) =>
                      items.map((item) =>
                        item.id === row.id
                          ? {
                              ...item,
                              status:
                                item.status === "Blocked" ? "Active" : "Blocked",
                            }
                          : item,
                      ),
                    )
                  }
                >
                  {row.status === "Blocked" ? "Unblock" : "Block"}
                </SecondaryButton>
                {row.role === "user" && (
                  <SecondaryButton
                    type="button"
                    onClick={() =>
                      setUsers((items) =>
                        items.map((item) =>
                          item.id === row.id ? { ...item, role: "admin" } : item,
                        ),
                      )
                    }
                  >
                    Make Admin
                  </SecondaryButton>
                )}
              </div>
            ),
          },
        ]}
        rows={users}
      />
    );
  }

  if (section === "applied-trainers") {
    return (
      <div className="space-y-5">
        <DashboardTable
          columns={[
            { key: "name", label: "Name" },
            { key: "email", label: "Email" },
            { key: "specialty", label: "Specialty" },
            { key: "time", label: "Time" },
            {
              key: "actions",
              label: "Action",
              render: (row) => (
                <SecondaryButton
                  type="button"
                  onClick={() => setSelectedApplication(row)}
                >
                  Details
                </SecondaryButton>
              ),
            },
          ]}
          rows={applications.filter((application) => application.status === "Pending")}
          emptyMessage="No pending trainer applications."
        />

        {selectedApplication && (
          <ApplicationModal
            application={selectedApplication}
            onClose={() => setSelectedApplication(null)}
            onDecision={(decision, feedback) => {
              setApplications((items) =>
                items.map((item) =>
                  item.id === selectedApplication.id
                    ? { ...item, status: decision, feedback }
                    : item,
                ),
              );

              if (decision === "Approved") {
                setUsers((items) =>
                  items.map((item) =>
                    item.email === selectedApplication.email
                      ? { ...item, role: "trainer", applicationStatus: "Approved" }
                      : item,
                  ),
                );
              }

              if (decision === "Rejected") {
                setUsers((items) =>
                  items.map((item) =>
                    item.email === selectedApplication.email
                      ? {
                          ...item,
                          role: "user",
                          applicationStatus: "Rejected",
                          feedback,
                        }
                      : item,
                  ),
                );
              }

              setSelectedApplication(null);
            }}
          />
        )}
      </div>
    );
  }

  if (section === "manage-trainers") {
    return (
      <DashboardTable
        columns={[
          { key: "name", label: "Name" },
          { key: "email", label: "Email" },
          { key: "status", label: "Status" },
          {
            key: "actions",
            label: "Action",
            render: (row) => (
              <SecondaryButton
                type="button"
                onClick={() => {
                  if (confirm("Demote this trainer to user?")) {
                    setUsers((items) =>
                      items.map((item) =>
                        item.id === row.id ? { ...item, role: "user" } : item,
                      ),
                    );
                  }
                }}
              >
                Demote to User
              </SecondaryButton>
            ),
          },
        ]}
        rows={users.filter((user) => user.role === "trainer")}
      />
    );
  }

  if (section === "manage-classes") {
    return (
      <DashboardTable
        columns={[
          { key: "name", label: "Class" },
          { key: "trainer", label: "Trainer" },
          { key: "status", label: "Status" },
          {
            key: "actions",
            label: "Actions",
            render: (row) => (
              <div className="flex flex-wrap gap-2">
                <SecondaryButton
                  type="button"
                  onClick={() =>
                    setClasses((items) =>
                      items.map((item) =>
                        item.id === row.id ? { ...item, status: "Approved" } : item,
                      ),
                    )
                  }
                >
                  Approve
                </SecondaryButton>
                <SecondaryButton
                  type="button"
                  onClick={() =>
                    setClasses((items) =>
                      items.map((item) =>
                        item.id === row.id ? { ...item, status: "Rejected" } : item,
                      ),
                    )
                  }
                >
                  Reject
                </SecondaryButton>
                <SecondaryButton
                  type="button"
                  onClick={() =>
                    setClasses((items) => items.filter((item) => item.id !== row.id))
                  }
                >
                  Delete
                </SecondaryButton>
              </div>
            ),
          },
        ]}
        rows={classes}
      />
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
              authorEmail: currentUser?.email || "admin@forgepulse.com",
              authorRole: "admin",
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

  if (section === "transactions") {
    return (
      <DashboardTable
        columns={[
          { key: "userEmail", label: "User Email" },
          { key: "amount", label: "Amount" },
          { key: "date", label: "Date" },
          { key: "id", label: "Transaction ID" },
        ]}
        rows={transactions}
      />
    );
  }

  if (section === "forum-post-manage") {
    return (
      <ForumPostGrid
        posts={forumPosts}
        onDelete={(postId) =>
          setForumPosts((items) => items.filter((item) => item.id !== postId))
        }
      />
    );
  }

  return (
    <div className="space-y-6">
      <div className="grid gap-4 md:grid-cols-3">
        <DashboardCard label="Total Users" value={users.length} />
        <DashboardCard label="Total Classes" value={classes.length} />
        <DashboardCard
          label="Total Booked Classes"
          value={classes.reduce((total, item) => total + item.students.length, 0)}
        />
      </div>
      <ProfilePanel user={currentUser} role="Admin" />
    </div>
  );
}

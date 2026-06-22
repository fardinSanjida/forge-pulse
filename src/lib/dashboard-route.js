const dashboardRoutes = {
  admin: "/dashboard/admin",
  trainer: "/dashboard/trainer",
  instructor: "/dashboard/trainer",
  teacher: "/dashboard/trainer",
  user: "/dashboard/user",
  student: "/dashboard/user",
};

export function normalizeDashboardRole(role) {
  const normalizedRole = role?.toLowerCase();

  if (normalizedRole === "admin") {
    return "admin";
  }

  if (
    normalizedRole === "trainer" ||
    normalizedRole === "instructor" ||
    normalizedRole === "teacher"
  ) {
    return "trainer";
  }

  return "user";
}

export function getDashboardHref(role) {
  return dashboardRoutes[role?.toLowerCase()] ?? dashboardRoutes.user;
}

import ClassDetailsLoader from "@/components/ClassDetailsLoader";

export const metadata = {
  title: "Class Details | Forge Pulse",
  description: "View Forge Pulse class details.",
};

export default async function ClassDetailsPage({ params }) {
  const { id } = await params;

  return <ClassDetailsLoader id={id} />;
}

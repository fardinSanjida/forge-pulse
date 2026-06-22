import { notFound } from "next/navigation";
import DetailsClass from "@/components/DetailsClass";
import {
  featureClasses,
  getFeatureClassById,
} from "@/lib/feature-classes";

export function generateStaticParams() {
  return featureClasses.map((classItem) => ({
    id: classItem.id,
  }));
}

export async function generateMetadata({ params }) {
  const { id } = await params;
  const classItem = getFeatureClassById(id);

  if (!classItem) {
    return {
      title: "Class Not Found | Forge Pulse",
    };
  }

  return {
    title: `${classItem.name} | Forge Pulse`,
    description: classItem.description,
  };
}

export default async function ClassDetailsPage({ params }) {
  const { id } = await params;
  const classItem = getFeatureClassById(id);

  if (!classItem) {
    notFound();
  }

  return <DetailsClass classItem={classItem} />;
}

import { notFound } from "next/navigation";
import PaymentCheckout from "@/components/PaymentCheckout";
import {
  featureClasses,
  getFeatureClassById,
} from "@/lib/feature-classes";

export function generateStaticParams() {
  return featureClasses.map((classItem) => ({
    id: classItem.id,
  }));
}

export const metadata = {
  title: "Payment | Forge Pulse",
  description: "Complete your class booking payment.",
};

export default async function PaymentPage({ params }) {
  const { id } = await params;
  const classItem = getFeatureClassById(id);

  if (!classItem) {
    notFound();
  }

  return <PaymentCheckout classItem={classItem} />;
}

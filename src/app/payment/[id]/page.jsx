import PaymentCheckoutLoader from "@/components/PaymentCheckoutLoader";

export const metadata = {
  title: "Payment | Forge Pulse",
  description: "Complete your class booking payment.",
};

export default async function PaymentPage({ params }) {
  const { id } = await params;

  return <PaymentCheckoutLoader id={id} />;
}

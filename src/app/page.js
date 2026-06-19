import BannerSection from "@/components/BannerSection";
import Process from "@/components/Process";

export default function Home() {
  return (
    <div className="flex flex-col flex-1 bg-black font-sans">
      <BannerSection />
      <Process />
    </div>
  );
}

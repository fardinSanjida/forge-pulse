import BannerSection from "@/components/BannerSection";
import FeatureClasses from "@/components/FeatureClasses";
import Process from "@/components/Process";

export default function Home() {
  return (
    <div className="flex flex-col flex-1 bg-black font-sans">
      <BannerSection />
      <FeatureClasses />
      <Process />
     
    </div>
  );
}

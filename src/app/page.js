import AboutUs from "@/components/AboutUs";
import BannerSection from "@/components/BannerSection";
import FeatureClasses from "@/components/FeatureClasses";
import Forum from "@/components/Forum";
import Process from "@/components/Process";

export default function Home() {
  return (
    <div className="flex flex-col flex-1 bg-black font-sans">
      <BannerSection />
      <AboutUs />
      <FeatureClasses />
      <Process />
      <Forum />
    </div>
  );
}

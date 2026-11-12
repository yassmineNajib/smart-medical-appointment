import { MainFooter } from "../components/layout/MainFooter";
import { MainHeader } from "../components/layout/MainHeader";
import { BookingMethods } from "../components/home/BookingMethods";
import { AboutSection } from "../components/home/AboutSection";
import { FeaturesSection } from "../components/home/FeaturesSection";
import { FinalCTA } from "../components/home/FinalCTA";
import { HeroSection } from "../components/home/HeroSection";
import { HowItWorks } from "../components/home/HowItWorks";
import { MedicalServices } from "../components/home/MedicalServices";
import { PrivacySection } from "../components/home/PrivacySection";
import { TrustIndicators } from "../components/home/TrustIndicators";

export default function HomePage() {
  return (
    <div className="min-h-screen bg-background">
      <MainHeader />
      <main>
        <HeroSection />
        <TrustIndicators />
        <HowItWorks />
        <BookingMethods />
        <MedicalServices />
        <FeaturesSection />
        <AboutSection />
        <PrivacySection />
        <FinalCTA />
      </main>
      <MainFooter />
    </div>
  );
}

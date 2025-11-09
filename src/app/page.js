import HeroSection from "@/components/HeroSection/HeroSection";
import FeaturedProducts from "@/components/FeaturedProducts/FeaturedProducts";
import WhyChooseUs from "@/components/WhyChooseUs/WhyChooseUs";
import Newsletter from "@/components/Newsletter/Newsletter";
import Faq from "@/components/Faq/Faq";
import FloatingContact from "@/components/FloatingContact/FloatingContact";

export default function Home() {
  return (
    <div className="space-y-14">
      <HeroSection />
      <FeaturedProducts />
      <WhyChooseUs />
      <Newsletter />
      <Faq />
      <FloatingContact />
    </div>
  );
}

import TitlePage from "@/components/TitlePage/TitlePage";
import AboutText from "./component/AboutText";
import Image from "next/image";
import aboutImage from "../../../../public/assets/image/aboutImage.jpg";
import Count from "./component/Count";
import { FaFacebookMessenger, FaInstagram, FaWhatsapp } from "react-icons/fa";
import WhyUs from "@/components/WhyUs/WhyUs";

export default function About() {
  return (
    <div className="py-6 sm:py-10 px-4 sm:px-6">
      <TitlePage
        title="Get to Know Us"
        description="Discover our journey, values, team and passion for delivering the best service to every customer."
        buttonText="About Us"
      />
      <div className="flex flex-col lg:flex-row gap-6 sm:gap-8 mt-8 sm:mt-12 lg:mt-16">
        <div className="lg:w-1/2 order-2 lg:order-1">
          <AboutText />
        </div>
        <div className="lg:w-1/2 order-1 lg:order-2">
          <Image
            src={aboutImage}
            alt="about"
            width={800}
            height={400}
            className="rounded-lg w-full h-auto"
          />
          <div className="mt-4 sm:mt-6">
            <Count />
          </div>
        </div>
      </div>
      <div className="mt-8 sm:mt-12 lg:mt-16">
        <div className="flex flex-col sm:flex-row justify-between items-center border-2 border-gray-200 shadow-md rounded-lg py-6 sm:py-8 px-4 sm:px-5 bg-white gap-4 sm:gap-0">
          <h1 className="text-lg sm:text-xl md:text-2xl lg:text-3xl font-bold text-center sm:text-left">
            Service Contact Partner
          </h1>
          <div className="flex items-center gap-4 sm:gap-6">
            <FaWhatsapp className="text-primary text-3xl sm:text-4xl lg:text-5xl" />
            <FaFacebookMessenger className="text-primary text-3xl sm:text-4xl lg:text-5xl" />
            <FaInstagram className="text-primary text-3xl sm:text-4xl lg:text-5xl" />
          </div>
        </div>
      </div>
      <div className="mt-4 sm:mt-5">
        <div className="flex flex-col sm:flex-row justify-between items-center border-2 border-gray-200 shadow-md rounded-lg py-6 sm:py-8 px-4 sm:px-5 bg-white gap-4 sm:gap-0">
          <h1 className="text-lg sm:text-xl md:text-2xl lg:text-3xl font-bold text-center sm:text-left">
            Our Official Payment Partner Partner
          </h1>
          <div className="flex items-center gap-2 sm:gap-3 flex-wrap justify-center sm:justify-end">
            <Image
              src="https://www.logo.wine/a/logo/BKash/BKash-Icon-Logo.wine.svg"
              alt="payment"
              width={80}
              height={80}
              className="w-16 h-16 sm:w-20 sm:h-20 lg:w-24 lg:h-24"
            />
            <Image
              src="https://www.logo.wine/a/logo/Nagad/Nagad-Vertical-Logo.wine.svg"
              alt="payment"
              width={80}
              height={80}
              className="w-16 h-16 sm:w-20 sm:h-20 lg:w-24 lg:h-24"
            />
            <Image
              src="https://upload.wikimedia.org/wikipedia/commons/thumb/4/45/Rocket_mobile_banking_logo.svg/320px-Rocket_mobile_banking_logo.svg.png"
              alt="payment"
              width={80}
              height={80}
              className="w-16 h-16 sm:w-20 sm:h-20 lg:w-24 lg:h-24"
            />
          </div>
        </div>
      </div>

      <div className="mt-8 sm:mt-12 lg:mt-16 mb-5">
        <TitlePage
          title="5 Reasons to Select Our Platform"
          description="Why you can consider Digital Premium Store as your best E-Commerce for the digital products"
          buttonText="Why Us"
        />
        <WhyUs />
      </div>
    </div>
  );
}

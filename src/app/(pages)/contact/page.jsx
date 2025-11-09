import TitlePage from "@/components/TitlePage/TitlePage";
import ContactInfo from "./component/ContactInfo";
import ContactForm from "./component/ContactForm";

export default function Contact() {
  return (
    <div className="py-10 px-4">
      <TitlePage
        title="Let Us Help You"
        description="For support, existing customers are kindly requested to contact us via WhatsApp instead of this form."
        buttonText="Contact Us"
      />
      <div className="flex flex-col md:flex-row gap-8 mt-8">
        {/* Left: Contact Info */}
        <ContactInfo />
        {/* Right: Contact Form */}
        <ContactForm />
      </div>
    </div>
  );
}

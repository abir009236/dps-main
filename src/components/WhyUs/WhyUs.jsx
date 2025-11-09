// components/Features.js
export default function WhyUs() {
  const features = [
    {
      id: 1,
      title: "DBID Verified Shop",
      desc: "Our Site earned DBID verification from Ministry of Commerce",
    },
    {
      id: 2,
      title: "Verified Payment Gateway",
      desc: "Our site has verified merchant payment for bKash, Nagad, Rocket, Upay",
    },
    {
      id: 3,
      title: "5 Years of Expertise",
      desc: "We have 5 years of experience to serve our customers",
    },
    {
      id: 4,
      title: "Faster Delivery",
      desc: "We deliver the products mostly 1 hour to 3 Hours",
    },
    {
      id: 5,
      title: "Faster Response Time",
      desc: "We response typically instant in official hour",
    },
    {
      id: 6,
      title: "Trustpilot: Excellent",
      desc: "We are excellent (4.8/5) category seller based on Trustpilot rating",
    },
  ];

  return (
    <section className="px-10">
      <div className="grid md:grid-cols-3 gap-5 ">
        {features.map((item) => (
          <div
            key={item.id}
            className="p-6 border-r border-gray-300 flex items-center gap-4"
          >
            <p className="text-5xl font-bold text-primary">{item.id}.</p>
            <div>
              <h3 className="mt-4 font-semibold text-lg">{item.title}</h3>
              <p className="mt-2 text-gray-600">{item.desc}</p>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}

import React from "react";
import { Helmet } from "react-helmet";
import {
  FaWallet,
  FaHandHoldingHeart,
  FaShieldAlt,
  FaMapMarkedAlt,
} from "react-icons/fa";

const WhyUs = () => {
  const features = [
    {
      icon: <FaWallet className="text-4xl text-[#4a6bff]" />,
      title: "Save More Every Day",
      desc: "Access exclusive discounts from local businesses on everything from food to fashion and essentials.",
    },
    {
      icon: <FaHandHoldingHeart className="text-4xl text-[#4a6bff]" />,
      title: "Support Local Economy",
      desc: "Every redemption supports your neighborhood’s economy and helps local shops grow.",
    },
    {
      icon: <FaShieldAlt className="text-4xl text-[#4a6bff]" />,
      title: "Verified & Trusted Offers",
      desc: "No fake or expired discounts. All offers are verified and updated by store owners themselves.",
    },
    {
      icon: <FaMapMarkedAlt className="text-4xl text-[#4a6bff]" />,
      title: "Smart Location-Based Results",
      desc: "Get tailored offers based on your area and preferences — perfect for last-minute plans.",
    },
  ];

  return (
    <>
      <Helmet>
        <title>Why Choose Us | Namma Ooru Offers</title>
        <meta
          name="description"
          content="Discover why thousands trust Namma Ooru Offers to find verified local deals and support small businesses in their neighborhoods."
        />
      </Helmet>

      <div className="px-4 py-16 bg-[#F8F9FA] text-gray-800">
        <header className="text-center mb-12 max-w-2xl mx-auto">
          <h1 className="text-4xl font-bold mb-3 text-black">Why Choose Namma Ooru Offers?</h1>
          <p className="text-lg text-gray-600">
            Your trusted source for authentic local deals, verified discounts, and community savings.
          </p>
        </header>

        <section className="grid grid-cols-2 sm:grid-cols-2 gap-6 max-w-6xl mx-auto px-2">
          {features.map((feature, i) => (
            <div
              key={i}
              className="flex flex-col text-center items-center gap-4 bg-white rounded-lg p-5 shadow-sm hover:shadow-lg transition  "
            >
              <div className="flex-shrink-0">{feature.icon}</div>
              <div>
                <h3 className="text-lg font-semibold text-black mb-1">{feature.title}</h3>
                <p className="text-sm text-gray-600">{feature.desc}</p>
              </div>
            </div>
          ))}
        </section>
      </div>
    </>
  );
};

export default WhyUs;

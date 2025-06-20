import React from "react";
import { Link } from "react-router-dom";
import { Helmet } from "react-helmet";
import { FaBullhorn, FaChartLine, FaClock, FaTags } from "react-icons/fa";

const StoreHome = () => {
  const benefits = [
    {
      icon: <FaBullhorn className="text-3xl text-[#4a6bff]" />,
      title: "Promote Your Offers",
      desc: "Post special deals, discounts, and flash sales directly to customers in your area — instantly visible to local users.",
    },
    {
      icon: <FaChartLine className="text-3xl text-[#4a6bff]" />,
      title: "Grow Customer Base",
      desc: "Get discovered by new shoppers nearby who are actively searching for savings on products and services like yours.",
    },
    {
      icon: <FaClock className="text-3xl text-[#4a6bff]" />,
      title: "Real-Time Control",
      desc: "Easily update your promotions, add limited-time deals, and manage your business visibility anytime through your dashboard.",
    },
    {
      icon: <FaTags className="text-3xl text-[#4a6bff]" />,
      title: "Zero Commission Model",
      desc: "Keep 100% of your revenue. We don’t charge commissions — only a small monthly fee for premium tools and visibility boosts.",
    },
  ];

  return (
    <>
      <Helmet>
        <title>For Store Owners | Namma Ooru Offers</title>
        <meta
          name="description"
          content="Join Namma Ooru Offers to promote your business, gain new customers, and boost visibility through verified local offers."
        />
      </Helmet>

      <div className="bg-white">
        {/* Hero */}
        <header className="bg-gradient-to-r from-[#4a6bff] to-[#5ac8fa] text-white py-20 text-center px-6">
          <h1 className="text-4xl md:text-5xl font-bold mb-4">
            Grow Your Business with Namma Ooru Offers
          </h1>
          <p className="text-lg md:text-xl mb-6 max-w-3xl mx-auto">
            List your store, reach more local customers, and manage your deals
            easily with our trusted platform.
          </p>
          <button
            onClick={() =>
              window.scrollTo({
                top: document.body.scrollHeight,
                behavior: "smooth",
              })
            }
            className="inline-block bg-white text-[#4a6bff]  font-semibold px-6 py-3 rounded-full shadow-md transition"
          >
            Learn More
          </button>
        </header>

        {/* Benefits */}
        <section className="py-16 px-6 bg-gray-50">
          <h2 className="text-3xl font-bold text-center text-gray-900 mb-10">
            Why Join Namma Ooru Offers?
          </h2>
          <div className="grid md:grid-cols-2 gap-10 max-w-6xl mx-auto">
            {benefits.map((item, i) => (
              <div
                key={i}
                className="bg-white p-6 rounded-xl shadow hover:shadow-lg transition duration-300 flex flex-col items-center text-center"
              >
                <div className="mb-4">{item.icon}</div>
                <h3 className="text-xl font-semibold text-black mb-2">
                  {item.title}
                </h3>
                <p className="text-gray-600 text-sm">{item.desc}</p>
              </div>
            ))}
          </div>
        </section>

        {/* CTA */}
        <section className="bg-gradient-to-br from-[#5ac8fa] to-[#4a6bff] text-white py-12 px-4 text-center">
          <h2 className="text-3xl md:text-4xl font-bold mb-4">
            Get Started in Minutes
          </h2>
          <p className="text-lg mb-6 max-w-2xl mx-auto">
            Join hundreds of local businesses already using Namma Ooru Offers to
            grow their customer base and sales.
          </p>
          <Link
            to="/register-store"
            className="inline-block bg-white text-[#4a6bff]  font-semibold px-6 py-3 rounded-full shadow-md transition"
          >
            Register Now — It's Free
          </Link>
        </section>
      </div>
    </>
  );
};

export default StoreHome;

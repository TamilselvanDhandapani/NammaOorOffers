import React from "react";
import { Link } from "react-router-dom";
import { Helmet } from "react-helmet";
import { FaBullhorn, FaChartLine, FaClock, FaTags } from "react-icons/fa";

const StoreHome = () => {
  const benefits = [
    {
      icon: <FaBullhorn className="w-6 h-6 text-white" />,
      title: "Promote Your Offers",
      desc: "Post special deals, discounts, and flash sales directly to customers in your area — instantly visible to local users.",
      gradient: "from-green-500 to-emerald-500",
    },
    {
      icon: <FaChartLine className="w-6 h-6 text-white" />,
      title: "Grow Customer Base",
      desc: "Get discovered by new shoppers nearby who are actively searching for savings on products and services like yours.",
      gradient: "from-orange-500 to-yellow-500",
    },
    {
      icon: <FaClock className="w-6 h-6 text-white" />,
      title: "Real-Time Control",
      desc: "Easily update your promotions, add limited-time deals, and manage your business visibility anytime through your dashboard.",
      gradient: "from-purple-500 to-pink-500",
    },
    {
      icon: <FaTags className="w-6 h-6 text-white" />,
      title: "Zero Commission Model",
      desc: "Keep 100% of your revenue. We don’t charge commissions — only a small monthly fee for premium tools and visibility boosts.",
      gradient: "from-teal-500 to-cyan-500",
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

      <div >
        {/* Hero Section */}
        <header className="  py-20 text-center px-6">
          <h1 className="text-3xl sm:text-4xl md:text-5xl font-bold mb-4 leading-tight">
            Grow Your Business with <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-600 via-purple-600 to-pink-600">Namma Ooru Offers</span>
          </h1>
          <p className="text-base sm:text-lg md:text-xl mb-6 max-w-3xl mx-auto">
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
            className="inline-block bg-white text-blue-600 font-semibold px-6 py-3 rounded-full shadow-md hover:bg-gray-100 transition"
          >
            Learn More
          </button>
        </header>

        {/* Benefits Section */}
        <section className="py-10 px-4 sm:px-6 lg:px-8 ">
          <h2 className="text-2xl sm:text-3xl md:text-4xl font-bold text-center text-gray-900 mb-12">
            Why Join Us?
          </h2>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-8 max-w-6xl mx-auto">
            {benefits.map((item, i) => (
              <div
                key={i}
                className="bg-white p-6 rounded-xl shadow hover:shadow-lg transition-all duration-300 flex flex-col items-center text-center gap-4"
              >
                <div
                  className={`w-14 h-14 rounded-2xl bg-gradient-to-br ${item.gradient} flex items-center justify-center shadow-lg`}
                >
                  {item.icon}
                </div>
                <div>
                  <h3 className="text-lg font-semibold text-black mb-1">
                    {item.title}
                  </h3>
                  <p className="text-sm text-gray-600">{item.desc}</p>
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* CTA Section */}
        <section className="bg-gradient-to-r from-blue-600 via-purple-600 to-pink-600 text-white py-16 px-4 text-center">
          <h2 className="text-2xl sm:text-3xl md:text-4xl font-bold mb-4">
            Get Started in Minutes
          </h2>
          <p className="text-base sm:text-lg md:text-xl mb-6 max-w-2xl mx-auto">
            Join hundreds of local businesses already using Namma Ooru Offers to
            grow their customer base and sales.
          </p>
          <Link
            to="/register-store"
            className="inline-block bg-white text-blue-600 font-semibold px-6 py-3 rounded-full shadow-md hover:bg-gray-100 transition"
          >
            Register Now — It’s Free
          </Link>
        </section>
      </div>
    </>
  );
};

export default StoreHome;

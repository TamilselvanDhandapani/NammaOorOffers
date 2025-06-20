import React from "react";
import { Link } from "react-router-dom";
import { Helmet } from "react-helmet";
import { FaSearch, FaTags, FaMobileAlt, FaCheckCircle } from "react-icons/fa";
import { motion } from "framer-motion";

const Home = () => {
  const categories = [
    { emoji: "🍲", name: "Food & Restaurants" },
    { emoji: "🛍️", name: "Fashion & Lifestyle" },
    { emoji: "🛒", name: "Grocery & Essentials" },
    { emoji: "📱", name: "Mobile & Electronics" },
    { emoji: "💄", name: "Health & Beauty" },
    { emoji: "🏠", name: "Home & Living" },
  ];

  const steps = [
    {
      icon: <FaSearch className="text-3xl text-[#4a6bff] mb-3" />,
      title: "Discover Offers",
      desc: "Browse local deals by category or location with smart filters tailored to you.",
    },
    {
      icon: <FaTags className="text-3xl text-[#4a6bff] mb-3" />,
      title: "Get the Details",
      desc: "View full discount info including conditions, expiry, and ratings.",
    },
    {
      icon: <FaMobileAlt className="text-3xl text-[#4a6bff] mb-3" />,
      title: "Show & Redeem",
      desc: "Use the digital coupon in-store or shop online with auto-applied codes.",
    },
    {
      icon: <FaCheckCircle className="text-3xl text-[#4a6bff] mb-3" />,
      title: "Save & Repeat",
      desc: "Save more every time — we'll recommend new deals based on your interests.",
    },
  ];

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.2,
        delayChildren: 0.2,
      },
    },
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 30 },
    visible: {
      opacity: 1,
      y: 0,
      transition: { duration: 0.5, ease: "easeOut" },
    },
  };

  return (
    <>
      <Helmet>
        <title>Namma Ooru Offers | Discover Local Deals Near You</title>
        <meta
          name="description"
          content="Explore exclusive coupons and store offers from your favorite local shops, restaurants, fashion outlets, and more on Namma Ooru Offers."
        />
      </Helmet>

      <div className="bg-[#F8F9FA]">
        {/* Hero */}
        <section
          className="relative bg-gradient-to-br from-[#4a6bff] to-[#5ac8fa] text-white h-[70vh] flex items-center justify-center text-center px-4 overflow-hidden"
        >
          {/* Floating Icons */}
          {[
            { emoji: "🏷️", style: "top-[10%] left-[10%]" },
            { emoji: "🎁", style: "top-[20%] right-[15%]" },
            { emoji: "💸", style: "bottom-[20%] left-[5%]" },
            { emoji: "🛍️", style: "bottom-[15%] right-[40%]" },
            { emoji: "🍜", style: "top-[20%] left-[35%]" },
            { emoji: "🎧", style: "bottom-[25%] right-[20%]" },
            { emoji: "👟", style: "bottom-[25%] left-[20%]" },
            { emoji: "💄", style: "bottom-[45%] right-[10%]" },
            
          ].map((item, i) => (
            <span
              key={i}
              className={`absolute text-3xl md:text-4xl opacity-60 animate-float ${item.style}`}
            >
              {item.emoji}
            </span>
          ))}

          {/* Hero Content */}
          <motion.div
            className="max-w-3xl relative z-10"
            variants={containerVariants}
            initial="hidden"
            animate="visible"
          >
            <motion.h1
              className="text-4xl md:text-5xl font-bold mb-4 leading-tight drop-shadow"
              variants={itemVariants}
            >
              Unlock Local Deals That Save You More
            </motion.h1>
            <motion.p
              className="text-lg mb-6 text-white/90"
              variants={itemVariants}
            >
              Find top offers from your neighborhood stores — food, fashion, electronics & more.
            </motion.p>
            <motion.div variants={itemVariants}>
              <Link
                to="/offers"
                className="bg-white text-[#4a6bff] font-semibold px-6 py-3 rounded-full shadow-lg transition"
              >
                Start Exploring
              </Link>
            </motion.div>
          </motion.div>
        </section>

        {/* Categories */}
        <section className="py-10 px-4">
          <h2 className="text-3xl font-bold text-center text-[#284b63] mb-8">
            Popular Categories
          </h2>
          <motion.div
            className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-6 gap-6 max-w-6xl mx-auto"
            variants={containerVariants}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
          >
            {categories.map((cat, index) => (
              <motion.div
                key={index}
                variants={itemVariants}
                className="flex flex-col items-center bg-white p-4 rounded-lg shadow-sm hover:shadow-md transition"
              >
                <span className="text-4xl mb-2">{cat.emoji}</span>
                <span className="text-sm font-medium text-gray-700 text-center">
                  {cat.name}
                </span>
              </motion.div>
            ))}
          </motion.div>
        </section>

        {/* How It Works */}
        <section className="py-10 px-4">
          <h2 className="text-3xl font-bold text-center mb-6 text-[#284b63]">
            How It Works
          </h2>
          <p className="text-center max-w-xl mx-auto text-gray-600 mb-10">
            Getting started with Namma Ooru Offers is simple and rewarding.
          </p>
          <motion.div
            className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 max-w-6xl mx-auto"
            variants={containerVariants}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
          >
            {steps.map((step, i) => (
              <motion.div
                key={i}
                variants={itemVariants}
                className="bg-white border border-gray-100 rounded-lg p-5 text-center shadow hover:shadow-md transition flex flex-col items-center min-h-[180px]"
              >
                {step.icon}
                <h3 className="text-lg font-semibold text-gray-800 mb-2">
                  {step.title}
                </h3>
                <p className="text-sm text-gray-600">{step.desc}</p>
              </motion.div>
            ))}
          </motion.div>
        </section>

        {/* CTA */}
        <section className="bg-gradient-to-br from-[#5ac8fa] to-[#4a6bff] text-white py-12 text-center  px-4">
          <h2 className="text-3xl font-bold mb-4">
            Ready to Save More in Your City?
          </h2>
          <p className="mb-6 text-lg">
            Explore exclusive offers just a few taps away.
          </p>
          <Link
            to="/offers"
            className="bg-white text-[#4a6bff]  font-semibold px-6 py-3 rounded-full shadow transition"
          >
            Browse Offers Now
          </Link>
        </section>
      </div>
    </>
  );
};

export default Home;

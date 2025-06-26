import React from "react";
import { Link } from "react-router-dom";
import { Helmet } from "react-helmet";
import {
  FaSearch,
  FaTags,
  FaMobileAlt,
  FaCheckCircle,
  FaArrowRight,
} from "react-icons/fa";
import { FiSearch, FiInfo, FiSmartphone, FiRepeat } from "react-icons/fi";
import { motion } from "framer-motion";
import { Swiper, SwiperSlide } from "swiper/react";
import { Autoplay, EffectFade } from "swiper/modules";
import "swiper/css";
import "swiper/css/effect-fade";
import One from "../../assets/1.png";
import Two from "../../assets/2.png";

const Home = () => {
  const categories = [
    { emoji: "🍲", name: "Food & Restaurants", bg: "bg-gradient-to-br from-amber-100 to-amber-50" },
    { emoji: "🛍️", name: "Fashion & Lifestyle", bg: "bg-gradient-to-br from-pink-100 to-pink-50" },
    { emoji: "🛒", name: "Grocery & Essentials", bg: "bg-gradient-to-br from-green-100 to-green-50" },
    { emoji: "📱", name: "Mobile & Electronics", bg: "bg-gradient-to-br from-blue-100 to-blue-50" },
    { emoji: "💄", name: "Health & Beauty", bg: "bg-gradient-to-br from-purple-100 to-purple-50" },
    { emoji: "🏠", name: "Home & Living", bg: "bg-gradient-to-br from-indigo-100 to-indigo-50" },
  ];

  const steps = [
    {
      id: 1,
      title: "Discover Offers",
      description: "Browse handpicked deals tailored for you.",
      icon: <FiSearch className="w-6 h-6" />,
    },
    {
      id: 2,
      title: "Get the Details",
      description: "See full terms, validity, and redemption instructions.",
      icon: <FiInfo className="w-6 h-6" />,
    },
    {
      id: 3,
      title: "Show & Redeem",
      description: "Use a QR code or promo code for instant savings.",
      icon: <FiSmartphone className="w-6 h-6" />,
    },
    {
      id: 4,
      title: "Save & Repeat",
      description: "Keep your favorites and get new offers regularly.",
      icon: <FiRepeat className="w-6 h-6" />,
    },
  ];

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: { staggerChildren: 0.2, delayChildren: 0.2 },
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

  const slides = [
    {
      url: "https://images.pexels.com/photos/1099680/pexels-photo-1099680.jpeg",
      title: "Delicious Food Offers",
      subtitle: "Up to 50% off at top restaurants",
    },
    {
      url: Two,
      title: "New Collections",
      subtitle: "Exclusive deals on your favorite brands",
    },
    {
      url: "https://images.pexels.com/photos/3568518/pexels-photo-3568518.jpeg",
      title: "Electronics Sale",
      subtitle: "Limited time discounts on gadgets",
    },
    {
      url: One,
      title: "Grocery Savings",
      subtitle: "Weekly specials near you",
    },
    {
      url: "https://images.pexels.com/photos/264636/pexels-photo-264636.jpeg",
      title: "Health & Beauty",
      subtitle: "Pamper yourself for less",
    },
  ];

  return (
    <>
      <Helmet>
        <title>Namma Ooru Offers | Discover Local Deals Near You</title>
        <meta
          name="description"
          content="Explore exclusive coupons and store offers from your favorite local shops, restaurants, fashion outlets, and more on Namma Ooru Offers."
        />
      </Helmet>

      <div>
        {/* Hero Swiper Section */}
        <section className="relative w-full h-[60vh] max-sm:h-[40vh]">
          <Swiper
            modules={[Autoplay, EffectFade]}
            effect="fade"
            autoplay={{ delay: 5000 }}
            loop={true}
            className="w-full h-full"
          >
            {slides.map((slide, idx) => (
              <SwiperSlide key={idx}>
                <div className="relative w-full h-full">
                  {/* Background */}
                  <div
                    className="absolute inset-0 bg-cover bg-right"
                    style={{ backgroundImage: `url(${slide.url})` }}
                  />
                  {/* Gradient Overlay */}
                  <div className="absolute inset-0 bg-gradient-to-r from-gray-900/80" />
                  {/* Text Content */}
                  <div className="relative z-10 w-full h-full flex items-center justify-left px-6 sm:px-12 md:px-24">
                    <div className="max-w-xl text-left ml-4 space-y-4">
                      <motion.p
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.5 }}
                        className="text-[1rem] uppercase tracking-wide text-white/80 font-semibold"
                      >
                        Trending Now
                      </motion.p>
                      <motion.h1
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.6 }}
                        className="text-4xl sm:text-5xl font-extrabold text-white drop-shadow"
                      >
                        {slide.title}
                      </motion.h1>
                      <motion.p
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.7 }}
                        className="text-white/90 text-lg sm:text-xl"
                      >
                        {slide.subtitle}
                      </motion.p>
                      <motion.div
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.8 }}
                      >
                        <Link
                          to="/offers"
                          className="inline-flex items-center gap-2 bg-violet-700 hover:bg-violet-600 text-white px-6 py-3 font-medium rounded-md shadow-md transition-all"
                        >
                          Explore Deals <FaArrowRight />
                        </Link>
                      </motion.div>
                    </div>
                  </div>
                </div>
              </SwiperSlide>
            ))}
          </Swiper>
        </section>

        {/* Categories */}
        <section className="py-16 px-4 max-w-7xl mx-auto">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
              Popular Categories
            </h2>
            <p className="text-gray-600 max-w-2xl mx-auto">
              Discover savings across all your favorite local businesses
            </p>
          </div>
          <motion.div
            className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-6 gap-6"
            variants={containerVariants}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
          >
            {categories.map((cat, index) => (
              <motion.div
                key={index}
                variants={itemVariants}
                whileHover={{ y: -5 }}
                className={`flex flex-col items-center p-6 rounded-xl shadow-sm hover:shadow-md transition-all ${cat.bg} cursor-pointer`}
              >
                <span className="text-5xl mb-4">{cat.emoji}</span>
                <span className="text-[1rem] font-medium text-gray-700 text-center">
                  {cat.name}
                </span>
              </motion.div>
            ))}
          </motion.div>
        </section>

        {/* How It Works */}
        <section className="py-16 px-4 sm:px-6 lg:px-8 ">
          <div className="max-w-6xl mx-auto">
            <div className="text-center mb-12">
              <h2 className="text-3xl sm:text-4xl font-bold text-gray-900 mb-4">
                How It Works
              </h2>
              <p className="text-lg text-gray-600 max-w-2xl mx-auto">
                Unlock exclusive deals in just a few simple steps.
              </p>
            </div>

            <div className="relative">
              {/* Progress line (hidden on mobile) */}
              

              <div className="grid grid-cols-1 md:grid-cols-4 gap-8 relative z-10">
                {steps.map((step) => (
                  <div
                    key={step.id}
                    className="flex flex-col items-center text-center p-6 bg-white rounded-xl shadow-sm hover:shadow-md transition-shadow duration-300"
                  >
                    <div className="flex items-center justify-center w-16 h-16 mb-4 rounded-full bg-indigo-100 text-indigo-600">
                      {step.icon}
                    </div>
                  
                    <h3 className="text-xl font-semibold text-gray-900 mb-2">
                      {step.title}
                    </h3>
                    <p className="text-gray-600">{step.description}</p>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </section>

        {/* CTA */}
        <motion.section
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="bg-gradient-to-br from-[#5ac8fa] to-[#4a6bff] text-white py-16 text-center px-4"
        >
          <div className="max-w-4xl mx-auto">
            <motion.h2
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              className="text-3xl md:text-4xl font-bold mb-6"
            >
              Ready to Save More in Your City?
            </motion.h2>
            <motion.p
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 }}
              className="text-xl mb-8 max-w-2xl mx-auto"
            >
              Explore exclusive offers just a few taps away.
            </motion.p>
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.4 }}
            >
              <Link
                to="/offers"
                className="inline-flex items-center gap-2 bg-white text-[#4a6bff] font-semibold px-8 py-4 rounded-full shadow-lg hover:shadow-xl transition-all hover:-translate-y-1"
              >
                Browse Offers Now <FaArrowRight />
              </Link>
            </motion.div>
          </div>
        </motion.section>
      </div>
    </>
  );
};

export default Home;
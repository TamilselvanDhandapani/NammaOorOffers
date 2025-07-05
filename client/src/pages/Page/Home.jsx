import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { Helmet } from "react-helmet";
import { motion } from "framer-motion";
import { FiSearch, FiInfo, FiSmartphone, FiRepeat } from "react-icons/fi";
import {
  Utensils,
  ShoppingBag,
  ShoppingCart,
  Smartphone,
  HeartPulse,
  HousePlug,
} from "lucide-react";
import { Swiper, SwiperSlide } from "swiper/react";
import { Autoplay, EffectFade } from "swiper/modules";
import "swiper/css";
import "swiper/css/effect-fade";

import One from "../../assets/1.png";
import Two from "../../assets/2.png";
import Three from "../../assets/3.png";
import Four from "../../assets/4.png";
import Five from "../../assets/5.png";
import BannerOne from "../../assets/BannerOne.png";
import BannerTwo from "../../assets/BannerTwo.png";

const slides = [
  {
    url: One,
    title: "Smart Grocery Picks",
    subtitle: "Discover Weekly Discounts Near You",
  },
  {
    url: Two,
    title: "Curated Gifts",
    subtitle: "Handpicked Surprises Just for You",
  },
  {
    url: Three,
    title: "Sports Deals Max 45% Off",
    subtitle: "Gear Up with Big Savings",
  },
  {
    url: Four,
    title: "Foodie Finds",
    subtitle: "Delicious Deals on Food & Drinks",
  },
  {
    url: Five,
    title: "Hot & Trending",
    subtitle: "Must-Have Styles This Week",
  },
];

const steps = [
  {
    id: 1,
    title: "Discover Offers",
    description: "Browse hand-picked deals tailored for you.",
    icon: FiSearch,
  },
  {
    id: 2,
    title: "Get the Details",
    description: "See full terms, validity & redemption instructions.",
    icon: FiInfo,
  },
  {
    id: 3,
    title: "Show & Redeem",
    description: "Use the redemption code for instant savings.",
    icon: FiSmartphone,
  },
  {
    id: 4,
    title: "Save & Repeat",
    description: "Keep favourites & get new offers regularly.",
    icon: FiRepeat,
  },
];

const categories = [
  {
    name: "Food & Restaurants",
    icon: Utensils,
    gradient: "from-amber-500 to-yellow-400",
  },
  {
    name: "Fashion & Lifestyle",
    icon: ShoppingBag,
    gradient: "from-pink-500 to-rose-400",
  },
  {
    name: "Grocery & Essentials",
    icon: ShoppingCart,
    gradient: "from-green-500 to-emerald-400",
  },
  {
    name: "Mobile & Electronics",
    icon: Smartphone,
    gradient: "from-blue-500 to-sky-400",
  },
  {
    name: "Health & Beauty",
    icon: HeartPulse,
    gradient: "from-purple-500 to-fuchsia-400",
  },
  {
    name: "Home & Living",
    icon: HousePlug,
    gradient: "from-indigo-500 to-violet-400",
  },
];

const container = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: { delayChildren: 0.15, staggerChildren: 0.15 },
  },
};

const item = {
  hidden: { opacity: 0, y: 25 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.45 } },
};

const Home = () => {
  return (
    <>
      <Helmet>
        <title>Namma Ooru Offers | Discover Local Deals Near You</title>
        <meta
          name="description"
          content="Explore exclusive coupons and store offers from your favourite local shops, restaurants, fashion outlets and more on Namma Ooru Offers."
        />
      </Helmet>

      <section className="relative h-[60vh] max-sm:h-[40vh] ">
        <Swiper
          modules={[Autoplay, EffectFade]}
          effect="fade"
          autoplay={{ delay: 5000 }}
          loop
          className="h-full w-full"
        >
          {slides.map(({ url, title, subtitle }, i) => (
            <SwiperSlide key={i}>
              <div className="relative w-full h-full">
                <div
                  className="absolute inset-0 bg-cover bg-center max-sm:bg-right"
                  style={{ backgroundImage: `url(${url})` }}
                />
                <div className="absolute inset-0 bg-gradient-to-r from-black/90 via-black/60 to-transparent" />
                <div className="relative z-10 w-full h-full flex items-center px-6 sm:px-12 lg:px-24">
                  <div className="max-w-xl space-y-3">
                    <motion.h2
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ duration: 0.5 }}
                      className="text-white uppercase text-2xl sm:text-3xl md:text-4xl font-bold tracking-wide"
                    >
                      {title}
                    </motion.h2>
                    <motion.p
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ duration: 0.6 }}
                      className="text-white text-[1rem] sm:text-base lg:text-lg"
                    >
                      {subtitle}
                    </motion.p>
                    <motion.div
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ duration: 0.7 }}
                    >
                      <Link
                        to="/offers"
                        className="inline-block px-6 py-2 mt-4 font-semibold text-white bg-gradient-to-r from-blue-600 via-indigo-500 to-purple-500 rounded-[12px] shadow-md hover:brightness-110 transition duration-300"
                      >
                        EXPLORE
                      </Link>
                    </motion.div>
                  </div>
                </div>
              </div>
            </SwiperSlide>
          ))}
        </Swiper>
      </section>

      {/* CATEGORY SECTION */}
      <section className="py-16">
        <div className="max-w-7xl mx-auto px-4">
          <div className="text-center mb-12">
            <h2 className="text-2xl sm:text-3xl md:text-4xl font-bold text-gray-900 mb-3">
              Browse by Category
            </h2>
            <p className="text-base sm:text-lg text-gray-600">
              Find deals in your favorite local business categories
            </p>
          </div>
          <div className="grid grid-cols-2 xs:grid-cols-3 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-6">
            {categories.map(({ name, icon: Icon, gradient }) => (
              <div
                key={name}
                className="bg-white rounded-xl shadow-md hover:shadow-xl p-4 text-center transition group"
              >
                <div
                  className={`w-14 h-14 mx-auto mb-4 rounded-2xl bg-gradient-to-br ${gradient} flex items-center justify-center text-white text-xl shadow-lg group-hover:scale-110 transition`}
                >
                  <Icon className="w-6 h-6" />
                </div>
                <h3 className="text-sm md:text-base font-semibold text-gray-900">
                  {name}
                </h3>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA BANNERS */}


<section className="py-10">
  <div className="max-w-7xl mx-auto px-4">
    <div className="flex flex-col md:flex-row justify-between items-center gap-6">
      
      {/* First Image Link */}
      <Link to="/referral" className="w-full md:w-1/2">
        <img
          src={BannerOne}
          alt="Grab the hottest local offers"
          className="w-full rounded-xl shadow-md hover:shadow-lg transition"
        />
      </Link>

      {/* Second Image Link */}
      <Link to="/offers" className="w-full md:w-1/2">
        <img
          src={BannerTwo}
          alt="Save big on every purchase"
          className="w-full rounded-xl shadow-md hover:shadow-lg transition"
        />
      </Link>
    </div>
  </div>
</section>

      {/* HOW IT WORKS */}
      <section className="py-10 ">
        <div className="max-w-6xl mx-auto px-4">
          <div className="text-center mb-12">
            <h2 className="text-2xl sm:text-3xl md:text-4xl font-bold text-gray-900">
              How it works
            </h2>
            <p className="mt-2 text-base sm:text-lg text-gray-600">
              Unlock exclusive deals in just a few simple steps.
            </p>
          </div>
          <motion.div
            className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-8"
            variants={container}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
          >
            {steps.map(({ id, title, description, icon: Icon }, i) => {
              const gradients = [
                "from-green-500 to-emerald-500",
                "from-orange-500 to-yellow-500",
                "from-purple-500 to-pink-500",
                "from-teal-500 to-cyan-500",
              ];
              return (
                <motion.div
                  key={id}
                  variants={item}
                  className="rounded-xl p-6 bg-white shadow-md text-center hover:shadow-lg transition"
                >
                  <span
                    className={`w-14 h-14 mb-5 mx-auto rounded-2xl bg-gradient-to-br ${gradients[i]} flex items-center justify-center shadow-lg`}
                  >
                    <Icon className="w-6 h-6 text-white" />
                  </span>
                  <h3 className="text-lg md:text-base lg:text-lg font-semibold text-gray-900 mb-2">
                    {title}
                  </h3>
                  <p className="text-sm text-gray-600">{description}</p>
                </motion.div>
              );
            })}
          </motion.div>
        </div>
      </section>
    </>
  );
};

export default Home;

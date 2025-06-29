import { Link } from "react-router-dom";
import { Helmet } from "react-helmet";
import { FiSearch, FiInfo, FiSmartphone, FiRepeat } from "react-icons/fi";
import { FaArrowRight } from "react-icons/fa";
import { motion } from "framer-motion";
import { Swiper, SwiperSlide } from "swiper/react";
import { Autoplay, EffectFade } from "swiper/modules";
import "swiper/css";
import "swiper/css/effect-fade";

import One from "../../assets/1.png";
import Two from "../../assets/2.png";
import BannerOne from "../../assets/BannerOne.png";
import BannerTwo from "../../assets/BannerTwo.png";

const categories = [
  { emoji: "🍲", name: "Food & Restaurants", bg: "from-amber-100 to-amber-50" },
  { emoji: "🛍️", name: "Fashion & Lifestyle", bg: "from-pink-100 to-pink-50" },
  {
    emoji: "🛒",
    name: "Grocery & Essentials",
    bg: "from-green-100 to-green-50",
  },
  { emoji: "📱", name: "Mobile & Electronics", bg: "from-blue-100 to-blue-50" },
  { emoji: "💄", name: "Health & Beauty", bg: "from-purple-100 to-purple-50" },
  { emoji: "🏠", name: "Home & Living", bg: "from-indigo-100 to-indigo-50" },
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

const slides = [
  {
    url: "https://images.pexels.com/photos/1099680/pexels-photo-1099680.jpeg",
    title: "FLAT UPTO 45%",
    subtitle: "ON SPORTS ACCESSORIES",
  },
  {
    url: Two,
    title: "NEW COLLECTIONS",
    subtitle: "EXCLUSIVE DEALS ON BRANDS",
  },
  {
    url: "https://images.pexels.com/photos/3568518/pexels-photo-3568518.jpeg",
    title: "ELECTRONICS SALE",
    subtitle: "LIMITED TIME DISCOUNTS ON GADGETS",
  },
  {
    url: One,
    title: "GROCERY SAVINGS",
    subtitle: "WEEKLY SPECIALS NEAR YOU",
  },
  {
    url: "https://images.pexels.com/photos/264636/pexels-photo-264636.jpeg",
    title: "HEALTH & BEAUTY",
    subtitle: "PAMPER YOURSELF FOR LESS",
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

      {/* ───────────── Hero Section ───────────── */}
      <section className="relative h-[60vh] max-sm:h-[40vh]">
        <Swiper
          modules={[Autoplay, EffectFade]}
          effect="fade"
          autoplay={{ delay: 5000 }}
          loop
          className="h-full w-full"
        >
          {slides.map(({ url, title, subtitle }, idx) => (
            <SwiperSlide key={idx}>
              <div className="relative w-full h-full">
                <div
                  className="absolute inset-0 bg-cover bg-center"
                  style={{ backgroundImage: `url(${url})` }}
                />
                <div className="absolute inset-0 bg-gradient-to-r from-black/80 via-black/40 to-transparent" />

                <div className="relative z-10 w-full h-full flex items-center px-6 sm:px-12 md:px-24">
                  <div className="max-w-xl text-left space-y-3">
                    <motion.h2
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ duration: 0.5 }}
                      className="text-white uppercase text-[2rem] sm:text-[2.5rem] font-bold tracking-wide leading-tight"
                    >
                      {title}
                    </motion.h2>

                    <motion.p
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ duration: 0.6 }}
                      className="text-white text-base sm:text-lg tracking-wide"
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
                        className="inline-block px-6 py-2 mt-2 bg-[#4C5C9E] hover:bg-[#3c4b86] text-white font-medium rounded-[12PX] transition duration-300"
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

      {/* ───────────── Categories ───────────── */}
      <section className="py-16 px-4 max-w-7xl mx-auto">
        <div className="text-center mb-12">
          <h2 className="text-3xl md:text-4xl font-bold text-gray-900">
            Popular Categories
          </h2>
          <p className="text-gray-600 mt-2">
            Discover savings across all your favourite local businesses
          </p>
        </div>

        <motion.div
          variants={container}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true }}
          className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-6 gap-6"
        >
          {categories.map(({ emoji, name, bg }, idx) => (
            <motion.button
              key={idx}
              variants={item}
              whileHover={{ y: -6, boxShadow: "0 8px 24px rgba(0,0,0,0.2)" }}
              className={`flex flex-col items-center justify-center p-6 rounded-xl cursor-pointer bg-gradient-to-br ${bg} transition`}
              aria-label={name}
            >
              <span className="text-4xl sm:text-5xl">{emoji}</span>
              <span className="mt-3 text-sm font-medium text-gray-700 text-center">
                {name}
              </span>
            </motion.button>
          ))}
        </motion.div>
      </section>

      {/* ───────────── How It Works ───────────── */}
      <section className="py-16 px-4 sm:px-6 lg:px-8 bg-gray-50">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900">
              How it works
            </h2>
            <p className="mt-2 text-gray-600">
              Unlock exclusive deals in just a few simple steps.
            </p>
          </div>

          <motion.div
            className="grid grid-cols-2 sm:grid-cols-2 md:grid-cols-4 gap-8"
            variants={container}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
          >
            {steps.map(({ id, title, description, icon: Icon }, i) => {
              const colors = [
                "bg-green-100",
                "bg-orange-100",
                "bg-purple-100",
                "bg-teal-100",
              ];
              const iconColors = [
                "text-green-600",
                "text-orange-600",
                "text-purple-600",
                "text-teal-600",
              ];
              return (
                <motion.div
                  key={id}
                  variants={item}
                  className="rounded-lg p-4 bg-white shadow-sm"
                >
                  <span
                    className={`w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-5 ${colors[i]}`}
                  >
                    <Icon className={`w-7 h-7 ${iconColors[i]}`} />
                  </span>
                  <h3 className="text-lg sm:text-base font-semibold text-gray-900 mb-2 text-center">
                    {title}
                  </h3>
                  <p className="text-gray-600 text-xs sm:text-sm text-center">
                    {description}
                  </p>
                </motion.div>
              );
            })}
          </motion.div>
        </div>
      </section>

      {/* ───────────── CTA Banners ───────────── */}
      <section className="px-4 md:px-0 py-10 max-w-7xl mx-auto">
        <div className="flex flex-col md:flex-row gap-6">
          <img
            src={BannerOne}
            alt="Grab the hottest local offers"
            className="w-full md:w-1/2 rounded-xl shadow-md"
          />
          <img
            src={BannerTwo}
            alt="Save big on every purchase"
            className="w-full md:w-1/2 rounded-xl shadow-md"
          />
        </div>
      </section>
    </>
  );
};

export default Home;

import React from "react";
import {
  FaStore,
  FaCheckCircle,
  FaMapMarkerAlt,
  FaSearchLocation,
  FaFilter,
  FaInfoCircle,
  FaShoppingBag,
  FaRedo,
} from "react-icons/fa";
import { Helmet } from "react-helmet";
import { motion } from "framer-motion";

// Animation Variants
const fadeInUp = {
  hidden: { opacity: 0, y: 40 },
  visible: (i = 1) => ({
    opacity: 1,
    y: 0,
    transition: {
      delay: i * 0.2,
      duration: 0.6,
      ease: "easeOut",
    },
  }),
};

const stagger = {
  visible: {
    transition: {
      staggerChildren: 0.2,
    },
  },
};

const About = () => {
  const features = [
    {
      icon: <FaStore className="text-3xl text-[#4a6bff]" />,
      title: "Exclusive Neighborhood Offers",
      desc: "Access special discounts from nearby shops — available only through our platform.",
    },
    {
      icon: <FaCheckCircle className="text-3xl text-[#4a6bff]" />,
      title: "Verified Merchant Deals",
      desc: "Every offer is approved and confirmed with the store owner to ensure accuracy.",
    },
    {
      icon: <FaMapMarkerAlt className="text-3xl text-[#4a6bff]" />,
      title: "Nearby City Promotions",
      desc: "Explore offers beyond your town — perfect for short trips and weekend shopping.",
    },
    {
      icon: <FaSearchLocation className="text-3xl text-[#4a6bff]" />,
      title: "Smart Location-Based Results",
      desc: "Our system shows the most relevant deals based on your shopping habits and area.",
    },
  ];

  const steps = [
    {
      icon: <FaFilter />,
      title: "Browse Stores & Categories",
      desc: "Use filters to explore food, retail, and service offers by location and deal amount.",
    },
    {
      icon: <FaInfoCircle />,
      title: "View Offer Details",
      desc: "Check discount amounts, restrictions, store hours, and expiration dates.",
    },
    {
      icon: <FaShoppingBag />,
      title: "Claim & Redeem",
      desc: "Show your coupon in-store or use the provided online promo links.",
    },
    {
      icon: <FaRedo />,
      title: "Save More Over Time",
      desc: "Create an account and get notified when new offers match your interests.",
    },
  ];

  return (
    <>
      <Helmet>
        <title>
          About Us | Namma Ooru Offers – Local Coupons & Store Deals
        </title>
        <meta
          name="description"
          content="Learn about Namma Ooru Offers — a trusted platform connecting users with verified local coupons and exclusive neighborhood store deals."
        />
      </Helmet>

      <div className="px-4 py-12 bg-white text-gray-800">
        {/* What We Offer */}
        <motion.section
          className="max-w-6xl mx-auto mb-20"
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true }}
          variants={stagger}
        >
          <motion.h2
            className="text-4xl font-bold text-center text-black mb-4"
            variants={fadeInUp}
            custom={0}
          >
            What We Offer
          </motion.h2>
          <motion.p
            className="text-center text-gray-600 mb-10 max-w-2xl mx-auto"
            variants={fadeInUp}
            custom={1}
          >
            Our platform connects you with the best local businesses while
            helping you save money.
          </motion.p>

          <div className="grid grid-cols-2 sm:grid-cols-2 gap-8">
            {features.map((item, i) => (
              <motion.div
                key={i}
                className="bg-white p-6 rounded-xl shadow-md hover:shadow-lg transition-all duration-300 flex flex-col items-center text-center gap-4"
                variants={fadeInUp}
                custom={i + 2}
              >
                <div className="flex justify-center items-center h-14 w-14">
                  {item.icon}
                </div>
                <div>
                  <h3 className="font-semibold text-lg text-black mb-1">
                    {item.title}
                  </h3>
                  <p className="text-sm text-gray-600">{item.desc}</p>
                </div>
              </motion.div>
            ))}
          </div>
        </motion.section>

        {/* How It Works */}
        <motion.section
          className="bg-[#f4f7fe] px-6 py-12 rounded-xl max-w-6xl mx-auto mb-20"
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true }}
          variants={stagger}
        >
          <motion.h2
            className="text-3xl font-bold text-center text-black mb-4"
            variants={fadeInUp}
            custom={0}
          >
            How It Works
          </motion.h2>
          <motion.p
            className="text-center text-gray-600 mb-10 max-w-2xl mx-auto"
            variants={fadeInUp}
            custom={1}
          >
            Start saving money at local businesses in just a few simple steps.
          </motion.p>

          <div className="grid grid-cols-2 sm:grid-cols-2 gap-8">
            {steps.map((step, i) => (
              <motion.div
                key={i}
                className="bg-white rounded-lg shadow p-6 hover:shadow-md transition"
                variants={fadeInUp}
                custom={i + 2}
              >
                <div className="flex flex-col  items-center gap-3 mb-3">
                  <span className="text-lg font-bold text-[#4a6bff]">
                    {step.icon}
                  </span>
                  <h3 className="text-md font-semibold text-black text-center">
                    {step.title}
                  </h3>
                </div>
                <p className="text-sm text-gray-600 text-center">{step.desc}</p>
              </motion.div>
            ))}
          </div>
        </motion.section>

        {/* Our Mission */}
        <motion.section
          className="max-w-4xl mx-auto text-center px-4"
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true }}
          variants={fadeInUp}
          custom={0}
        >
          <h2 className="text-3xl font-bold mb-4 text-black">Our Mission</h2>
          <p className=" text-gray-700 mb-4 leading-relaxed">
            We believe thriving local businesses create vibrant communities. Our
            platform bridges the gap between merchants who want to attract
            customers and shoppers looking for genuine value.
          </p>
          <p className="text-gray-700 leading-relaxed">
            Unlike national deal sites that take large commissions, we keep our
            fees low so merchants can offer better discounts. We're proud to be
            locally owned and operated, just like the businesses we feature.
          </p>
        </motion.section>
      </div>
    </>
  );
};

export default About;

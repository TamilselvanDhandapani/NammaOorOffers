import React from "react";
import {
  FaStore,
  FaCheckCircle,
  FaMapMarkerAlt,
  FaSearchLocation,
} from "react-icons/fa";
import { Users, Heart, Target, Award } from "lucide-react";
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
  const values = [
    {
      icon: Heart,
      title: "Community First",
      description:
        "We believe in strengthening local communities by connecting neighbors with local businesses.",
    },
    {
      icon: Users,
      title: "Building Relationships",
      description:
        "Creating lasting partnerships between customers and local business owners.",
    },
    {
      icon: Target,
      title: "Smart Savings",
      description:
        "Helping families save money while discovering amazing local products and services.",
    },
    {
      icon: Award,
      title: "Quality Assurance",
      description:
        "We carefully vet all our partner businesses to ensure the best experience for our users.",
    },
  ];

  const features = [
    {
      icon: <FaStore className="w-6 h-6 text-white" />,
      title: "Exclusive Neighborhood Offers",
      desc: "Access special discounts from nearby shops — available only through our platform.",
      gradient: "from-green-500 to-emerald-500",
    },
    {
      icon: <FaCheckCircle className="w-6 h-6 text-white" />,
      title: "Verified Merchant Deals",
      desc: "Every offer is approved and confirmed with the store owner to ensure accuracy.",
      gradient: "from-orange-500 to-yellow-500",
    },
    {
      icon: <FaMapMarkerAlt className="w-6 h-6 text-white" />,
      title: "Nearby City Promotions",
      desc: "Explore offers beyond your town — perfect for short trips and weekend shopping.",
      gradient: "from-purple-500 to-pink-500",
    },
    {
      icon: <FaSearchLocation className="w-6 h-6 text-white" />,
      title: "Smart Location-Based Results",
      desc: "Our system shows the most relevant deals based on your shopping habits and area.",
      gradient: "from-teal-500 to-cyan-500",
    },
  ];

  return (
    <div className="min-h-screen ">
      {/* Hero Section */}
      <section className="py-24  ">
        <div className="max-w-4xl mx-auto px-4 text-center">
          <h1 className="text-4xl md:text-5xl font-bold text-gray-900 mb-6">
            About <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-600 via-purple-600 to-pink-600">Namma Ooru Offers</span>
          </h1>
          <p className="text-lg text-gray-600 leading-relaxed max-w-2xl mx-auto">
            We believe thriving local businesses create vibrant communities. Our
            platform bridges the gap between merchants who want to attract
            customers and shoppers looking for genuine value.
          </p>
        </div>
      </section>

      {/* What We Offer */}
      <motion.section
        className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-16 "
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true }}
        variants={stagger}
      >
        <motion.h2
          className="text-3xl md:text-4xl font-bold text-center text-gray-900 mb-4"
          variants={fadeInUp}
        >
          What We Offer
        </motion.h2>
        <motion.p
          className="text-center text-gray-600 mb-10 max-w-2xl mx-auto"
          variants={fadeInUp}
          custom={1}
        >
          Our platform connects you with the best local businesses while helping
          you save money.
        </motion.p>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-8">
          {features.map((item, i) => (
            <motion.div
              key={i}
              className="bg-white p-6 rounded-xl shadow-[0px_0px_6px_1px_#00000024] transition-all duration-300 flex flex-col items-center text-center gap-4"
              variants={fadeInUp}
              custom={i + 2}
            >
              <div
                className={`w-14 h-14 rounded-2xl bg-gradient-to-br ${item.gradient} flex items-center justify-center shadow-lg`}
              >
                {item.icon}
              </div>
              <div>
                <h3 className="font-semibold text-lg text-gray-900 mb-1">
                  {item.title}
                </h3>
                <p className="text-sm text-gray-600">{item.desc}</p>
              </div>
            </motion.div>
          ))}
        </div>
      </motion.section>

      {/* Story Section */}
      <section className="py-10 ">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 text-center" >
          <h2 className="  px-4 text-3xl md:text-4xl font-bold text-gray-900 mb-6">
            Our Story
          </h2>
          <div className="space-y-5 text-gray-600 leading-relaxed">
            <p>
              Namma Ooru Offers was born from a simple observation: local
              businesses are the heart of our communities, but they often
              struggle to compete with big corporations.
            </p>
            <p>
              We created this platform to level the playing field — giving local
              shops the tools to reach customers and offer compelling deals that
              drive foot traffic and loyalty.
            </p>
            <p>
              Since our launch, we’ve helped 200+ local businesses grow while
              saving customers more every day.
            </p>
          </div>
        </div>
      </section>

      {/* Our Values */}
      <section className="py-16 ">
        <div className="max-w-6xl mx-auto px-4">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
              Our Values
            </h2>
            <p className="text-lg text-gray-600">What drives us every day</p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
            {values.map((value, index) => {
              const Icon = value.icon;
              const gradients = [
                "from-green-500 to-emerald-500",
                "from-orange-500 to-yellow-500",
                "from-purple-500 to-pink-500",
                "from-teal-500 to-cyan-500",
              ];
              return (
                <div
                  key={index}
                  className="bg-white p-6 rounded-xl text-center  shadow-lg shadow-gray-400/20 hover:shadow-xl transition-shadow duration-300"
                >
                  <div
                    className={`w-14 h-14 mx-auto mb-4 rounded-2xl bg-gradient-to-br ${gradients[index]} flex items-center justify-center shadow-md`}
                  >
                    <Icon className="h-7 w-7 text-white" />
                  </div>
                  <h3 className="text-lg font-semibold text-gray-900 mb-2">
                    {value.title}
                  </h3>
                  <p className="text-sm text-gray-600">{value.description}</p>
                </div>
              );
            })}
          </div>
        </div>
      </section>
    </div>
  );
};

export default About;

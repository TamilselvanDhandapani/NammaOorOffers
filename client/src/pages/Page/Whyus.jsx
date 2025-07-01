import React from "react";
import {
  CheckCircle,
  Shield,
  Zap,
  Users,
  Star,
  TrendingUp,
  Sparkles,
  Trophy,
  Clock,
  Gift,
} from "lucide-react";
import { Link } from "react-router-dom";

const WhyUs = () => {
  const features = [
    {
      icon: CheckCircle,
      title: "Verified Deals",
      description: "Every deal is verified and guaranteed to work. No expired or fake coupons.",
      gradient: "from-green-500 to-emerald-500",
    },
    {
      icon: Shield,
      title: "Trusted Partners",
      description: "We work only with legitimate, established local businesses you can trust.",
      gradient: "from-blue-500 to-cyan-500",
    },
    {
      icon: Zap,
      title: "Instant Access",
      description: "Get deals instantly on your phone. No waiting, no complicated signup process.",
      gradient: "from-yellow-500 to-orange-500",
    },
    {
      icon: Users,
      title: "Community Focus",
      description: "Built specifically for local communities, not big box stores or chains.",
      gradient: "from-purple-500 to-violet-500",
    },
    {
      icon: Star,
      title: "Quality First",
      description: "Curated selection of the best local businesses with excellent reviews.",
      gradient: "from-pink-500 to-rose-500",
    },
    {
      icon: TrendingUp,
      title: "Growing Network",
      description: "New businesses and deals added regularly to expand your savings opportunities.",
      gradient: "from-indigo-500 to-blue-500",
    },
  ];

  const benefits = [
    {
      title: "For Customers",
      icon: Gift,
      gradient: "from-blue-600 to-purple-600",
      points: [
        "Save 20-50% on average at local businesses",
        "Discover new favorite spots in your neighborhood",
        "Support local economy and community growth",
        "Get exclusive deals not available anywhere else",
        "Easy mobile access to all your coupons",
      ],
    },
    {
      title: "For Businesses",
      icon: Trophy,
      gradient: "from-orange-500 to-red-500",
      points: [
        "Reach new customers in your local area",
        "Increase foot traffic and sales",
        "Build customer loyalty with exclusive offers",
        "Cost-effective marketing solution",
        "Analytics and insights on deal performance",
      ],
    },
  ];

  return (
    <div className=" text-gray-900">
      {/* Hero */}
      <section className="py-12  text-center relative overflow-hidden">
        <div className="max-w-4xl mx-auto px-4 relative z-10">
          <div className="inline-flex items-center px-6 py-3 bg-white/90 backdrop-blur rounded-full text-sm font-semibold text-gray-700 mb-8 shadow border border-white/50">
            <Sparkles className="w-5 h-5 text-purple-500 mr-2" />
            Why Choose Us
          </div>
          <h1 className="text-5xl md:text-5xl font-bold leading-tight mb-6">
            Why Choose{" "}
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-600 via-purple-600 to-pink-600">
              Namma Ooru Offers?
            </span>
          </h1>
          <p className="text-xl md:text-xl text-gray-600">
            We’re your local community’s trusted partner for authentic savings
            and meaningful connections.
          </p>
        </div>
      </section>

      {/* Features */}
      <section className="py-12">
        <div className="max-w-7xl mx-auto px-4">
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            {features.map((f, idx) => (
              <div
                key={idx}
                className="bg-white rounded-3xl shadow-sm hover:shadow-xl text-center transition p-8 flex flex-col items-center justify-between relative"
              >
                <div className="absolute top-0 right-0 w-20 h-20 bg-gradient-to-br from-blue-100 to-purple-100 rounded-bl-3xl opacity-20" />
                <div
                  className={`w-16 h-16 rounded-2xl bg-gradient-to-br ${f.gradient} flex items-center justify-center mb-6 shadow`}
                >
                  <f.icon className="text-white w-8 h-8" />
                </div>
                <h3 className="text-xl font-semibold mb-2">{f.title}</h3>
                <p className="text-gray-600">{f.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Benefits */}
      <section className="py-4  mb-10">
        <div className="max-w-6xl mx-auto px-4">
          <div className="text-center mb-16">
            <div className="inline-flex items-center px-4 py-2 bg-green-50 rounded-full text-sm text-green-700 border border-green-200 mb-4">
              <Users className="w-4 h-4 mr-2" />
              Win-Win Solution
            </div>
            <h2 className="text-4xl md:text-5xl font-bold mb-4">
              Benefits for{" "}
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-green-600 to-blue-600">
                Everyone
              </span>
            </h2>
            <p className="text-lg text-gray-600">
              Creating value for both customers and local businesses
            </p>
          </div>

          <div className="grid lg:grid-cols-2 gap-12">
            {benefits.map((b, idx) => (
              <div
                key={idx}
                className="bg-gradient-to-br from-white to-gray-50 rounded-3xl p-10 shadow-[0px_0px_8px_2px_#00000024] transition flex flex-col items-center justify-center "
              >
                <div className="flex items-center mb-6 ">
                  <div
                    className={`w-14 h-14 rounded-xl bg-gradient-to-br ${b.gradient} flex items-center justify-center mr-4`}
                  >
                    <b.icon className="w-7 h-7 text-white" />
                  </div>
                  <h3 className="text-2xl font-bold">{b.title}</h3>
                </div>
                <ul className="space-y-4">
                  {b.points.map((p, i) => (
                    <li key={i} className="flex items-start">
                      <div className="flex-shrink-0 w-6 h-6 rounded-full bg-green-100 flex items-center justify-center mt-1 mr-3">
                        <CheckCircle className="w-4 h-4 text-green-600" />
                      </div>
                      <span className="text-gray-700 leading-relaxed">{p}</span>
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="py-10 bg-gradient-to-r from-blue-600 via-purple-600 to-pink-600 text-white text-center">
        <div className="max-w-4xl mx-auto px-4">
          <div className="inline-flex items-center px-6 py-3 bg-white/20 backdrop-blur-sm rounded-full text-sm font-semibold text-white mb-8 border border-white/30">
            <Sparkles className="w-5 h-5 mr-2" />
            Ready to Get Started?
          </div>
          <h2 className="text-4xl md:text-6xl font-bold mb-6">
            Experience the <span className="text-yellow-300">Difference</span>{" "}
            Today
          </h2>
          <p className="text-xl md:text-2xl text-blue-100 mb-10">
            Join our growing community and start saving while supporting local
            businesses.
          </p>
          <div className="flex flex-col sm:flex-row justify-center gap-6">
            <button className="bg-white text-blue-600 px-8 py-4 rounded-xl text-lg font-semibold shadow hover:shadow-xl hover:scale-105 transition">
              <Link to="/register">Start Saving Now</Link>
            </button>
            <button className="border-2 border-white text-white px-8 py-4 rounded-xl text-lg font-semibold hover:bg-white hover:text-blue-600 transition hover:scale-105">
              <Link to="/register-store">Partner With Us</Link>
            </button>
          </div>
        </div>
      </section>
    </div>
  );
};

export default WhyUs;

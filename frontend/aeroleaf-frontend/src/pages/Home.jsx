import { useState, useEffect, useRef } from "react";
import { Link } from "react-router-dom";
import HeroSection from "../components/HeroSection";
import { motion } from "framer-motion";

export default function Home() {
  const [email, setEmail] = useState("");
  const [isSubscribed, setIsSubscribed] = useState(false);
  const [activeTestimonial, setActiveTestimonial] = useState(0);
  const statsRef = useRef(null);
  const [statsVisible, setStatsVisible] = useState(false);

  // Observer for animation on scroll
  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setStatsVisible(true);
          observer.unobserve(entry.target);
        }
      },
      { threshold: 0.2 }
    );

    if (statsRef.current) {
      observer.observe(statsRef.current);
    }

    return () => {
      if (statsRef.current) {
        observer.unobserve(statsRef.current);
      }
    };
  }, []);

  // Testimonial auto-rotation
  useEffect(() => {
    const interval = setInterval(() => {
      setActiveTestimonial((prev) => (prev + 1) % testimonials.length);
    }, 6000);
    return () => clearInterval(interval);
  }, []);

  const handleSubscribe = () => {
    if (email.trim() !== "" && /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      setIsSubscribed(true);
      setTimeout(() => {
        setEmail("");
        setIsSubscribed(false);
      }, 5000);
    }
  };

  const testimonials = [
    {
      name: "Sarah Johnson",
      role: "Sustainability Director",
      company: "EcoTech Industries",
      text: "AeroLeaf has transformed how we approach carbon offsetting. The satellite verification gives us confidence that our investments are making a real impact.",
      avatar: "https://randomuser.me/api/portraits/women/44.jpg",
    },
    {
      name: "Michael Chen",
      role: "Forest Owner",
      company: "Green Valley Estate",
      text: "As a landowner, the transparency of AeroLeaf's reporting has been invaluable. I can track the growth of my reforestation project in real-time.",
      avatar: "https://randomuser.me/api/portraits/men/32.jpg",
    },
    {
      name: "Lisa Rodriguez",
      role: "Environmental Compliance Officer",
      company: "Global Logistics Corp",
      text: "The blockchain-backed credits give us immutable proof of our carbon offset initiatives, which has been crucial for our annual sustainability reports.",
      avatar: "https://randomuser.me/api/portraits/women/68.jpg",
    },
  ];

  const stats = [
    { value: "1M+", label: "Trees planted" },
    { value: "50K", label: "Tons of CO₂ offset" },
    { value: "100+", label: "Active projects" },
    { value: "250+", label: "Satisfied clients" },
  ];

  return (
    <div className="min-h-screen bg-gradient-to-b from-green-50 to-white overflow-hidden">
      {/* Background shapes */}
      <div className="bg-shape bg-shape-1"></div>
      <div className="bg-shape bg-shape-2"></div>

      {/* Hero Section */}
      <div className="relative pt-20 lg:pt-28 pb-32 flex content-center items-center justify-center">
        <div className="container mx-auto px-4">
          <div className="flex flex-wrap items-center">
            <div className="w-full lg:w-6/12 px-4 ml-auto mr-auto text-center">
              <div className="fade-in">
                <div className="flex justify-center mb-6">
                  <div className="flex items-center">
                    <div className="w-12 h-12 rounded-full bg-gradient-to-br from-green-500 to-teal-400 flex items-center justify-center shadow-lg pulse-animation">
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        className="h-7 w-7 text-white"
                        fill="none"
                        viewBox="0 0 24 24"
                        stroke="currentColor"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M5 3v4M3 5h4M6 17v4m-2-2h4m5-16l2.286 6.857L21 12l-5.714 2.143L13 21l-2.286-6.857L5 12l5.714-2.143L13 3z"
                        />
                      </svg>
                    </div>
                    <span className="text-3xl font-bold text-green-700 ml-3">
                      AeroLeaf
                    </span>
                  </div>
                </div>

                <h1 className="text-5xl md:text-6xl font-bold mt-0 mb-6">
                  <span className="hero-text-gradient">Verified</span> Carbon
                  Credits
                </h1>
                <h3 className="text-xl md:text-2xl leading-relaxed mt-4 mb-4 text-gray-700 max-w-2xl mx-auto">
                  Using satellite imagery and blockchain technology to verify
                  and trade carbon credits with real, measurable impact.
                </h3>
                <div className="mt-10">
                  <Link
                    to="/dashboard"
                    className="bg-gradient-to-r from-green-600 to-green-700 text-white font-bold px-6 py-3 rounded-lg hover:from-green-700 hover:to-green-800 transition transform hover:scale-[1.02] active:scale-[0.98] shadow-md"
                  >
                    View Dashboard
                  </Link>
                  <Link
                    to="/login"
                    className="ml-4 bg-white text-green-600 border border-green-600 font-bold px-6 py-3 rounded-lg hover:bg-green-50 transition transform hover:scale-[1.02] active:scale-[0.98]"
                  >
                    Sign In
                  </Link>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Background illustration */}
        <div className="absolute right-0 bottom-0 w-full lg:w-1/2 h-64 lg:h-full z-0 opacity-10 pointer-events-none">
          <svg
            width="100%"
            height="100%"
            viewBox="0 0 200 200"
            xmlns="http://www.w3.org/2000/svg"
          >
            <path
              fill="#38A169"
              d="M67.5,-24.3C77.5,-0.3,67.8,29.1,47.6,47.6C27.4,66.1,-3.3,73.7,-31.9,63C-60.5,52.4,-87,23.6,-87,-5.7C-87.1,-35,-60.7,-64.8,-31.9,-74.3C-3.2,-83.7,28,-77.7,67.5,-24.3Z"
              transform="translate(100 125)"
            />
          </svg>
        </div>
      </div>

      {/* Features */}
      <section className="py-20 bg-white relative z-10">
        <div className="container mx-auto px-4">
          <div className="text-center mb-16">
            <h2 className="text-3xl font-bold text-gray-800 section-header mx-auto">
              Why AeroLeaf?
            </h2>
            <p className="text-xl text-gray-600 mt-4 max-w-xl mx-auto">
              Our platform combines cutting-edge technology with environmental
              impact
            </p>
          </div>

          <div className="flex flex-wrap">
            <div className="w-full md:w-4/12 px-4 text-center mb-10 md:mb-0">
              <div className="relative flex flex-col min-w-0 break-words bg-white w-full mb-8 shadow-lg rounded-lg p-6 feature-card">
                <div className="px-4 py-5 flex-auto">
                  <div className="text-white p-3 text-center inline-flex items-center justify-center w-12 h-12 mb-5 shadow-lg rounded-full bg-gradient-to-r from-green-500 to-green-600">
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      className="h-6 w-6"
                      fill="none"
                      viewBox="0 0 24 24"
                      stroke="currentColor"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M8 7H5a2 2 0 00-2 2v9a2 2 0 002 2h14a2 2 0 002-2V9a2 2 0 00-2-2h-3m-1 4l-3 3m0 0l-3-3m3 3V4"
                      />
                    </svg>
                  </div>
                  <h6 className="text-xl font-semibold">
                    Satellite Verification
                  </h6>
                  <p className="mt-2 mb-4 text-gray-500">
                    Track real-time reforestation progress with NDVI analysis of
                    high-resolution satellite imagery, ensuring transparency and
                    accuracy.
                  </p>
                </div>
              </div>
            </div>

            <div className="w-full md:w-4/12 px-4 text-center mb-10 md:mb-0">
              <div className="relative flex flex-col min-w-0 break-words bg-white w-full mb-8 shadow-lg rounded-lg p-6 feature-card">
                <div className="px-4 py-5 flex-auto">
                  <div className="text-white p-3 text-center inline-flex items-center justify-center w-12 h-12 mb-5 shadow-lg rounded-full bg-gradient-to-r from-green-500 to-green-600">
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      className="h-6 w-6"
                      fill="none"
                      viewBox="0 0 24 24"
                      stroke="currentColor"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M20 7l-8-4-8 4m16 0v10l-8 4m-8-4V7m16 10l-8-4m-8 4l8-4"
                      />
                    </svg>
                  </div>
                  <h6 className="text-xl font-semibold">
                    Blockchain Transparency
                  </h6>
                  <p className="mt-2 mb-4 text-gray-500">
                    Immutable verification records and tokenized carbon credits
                    provide an auditable trail of environmental impact and
                    ownership.
                  </p>
                </div>
              </div>
            </div>

            <div className="w-full md:w-4/12 px-4 text-center">
              <div className="relative flex flex-col min-w-0 break-words bg-white w-full mb-8 shadow-lg rounded-lg p-6 feature-card">
                <div className="px-4 py-5 flex-auto">
                  <div className="text-white p-3 text-center inline-flex items-center justify-center w-12 h-12 mb-5 shadow-lg rounded-full bg-gradient-to-r from-green-500 to-green-600">
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      className="h-6 w-6"
                      fill="none"
                      viewBox="0 0 24 24"
                      stroke="currentColor"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                      />
                    </svg>
                  </div>
                  <h6 className="text-xl font-semibold">Carbon Marketplace</h6>
                  <p className="mt-2 mb-4 text-gray-500">
                    Trade verified carbon credits directly with buyers
                    worldwide, connecting reforestation projects with
                    climate-conscious organizations.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Stats Section */}
      <section
        className="py-16 bg-gradient-to-r from-green-700 to-green-800 text-white"
        ref={statsRef}
      >
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6 text-center">
            {stats.map((stat, index) => (
              <div
                key={index}
                className={`p-6 transform ${
                  statsVisible
                    ? "opacity-100 translate-y-0"
                    : "opacity-0 translate-y-10"
                } transition-all duration-700`}
                style={{ transitionDelay: `${index * 150}ms` }}
              >
                <p className="text-4xl md:text-5xl font-bold mb-2">
                  {stat.value}
                </p>
                <p className="text-lg opacity-80">{stat.label}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Testimonials */}
      <section className="py-20 bg-gray-50">
        <div className="container mx-auto px-4">
          <div className="text-center mb-16">
            <h2 className="text-3xl font-bold text-gray-800 section-header mx-auto">
              What Our Users Say
            </h2>
          </div>

          <div className="max-w-3xl mx-auto relative">
            {testimonials.map((testimonial, index) => (
              <div
                key={index}
                className={`bg-white p-8 rounded-lg shadow-lg transition-opacity duration-500 absolute inset-0 flex flex-col ${
                  activeTestimonial === index
                    ? "opacity-100 z-10"
                    : "opacity-0 z-0"
                }`}
              >
                <div className="flex items-center mb-6">
                  <img
                    src={testimonial.avatar}
                    alt={testimonial.name}
                    className="h-14 w-14 rounded-full object-cover mr-4 border-2 border-green-500"
                  />
                  <div>
                    <p className="font-bold text-gray-800">
                      {testimonial.name}
                    </p>
                    <p className="text-sm text-gray-600">
                      {testimonial.role}, {testimonial.company}
                    </p>
                  </div>
                </div>
                <div className="relative">
                  <svg
                    className="absolute top-0 left-0 transform -translate-x-6 -translate-y-6 h-12 w-12 text-green-200"
                    fill="currentColor"
                    viewBox="0 0 32 32"
                  >
                    <path d="M10 8c-2.2 0-4 1.8-4 4v10h10V12h-6c0-3.3 2.7-6 6-6V2c-5.5 0-10 4.5-10 10zm12-6v4c3.3 0 6 2.7 6 6h-6v10h10V12c0-5.5-4.5-10-10-10z" />
                  </svg>
                  <p className="text-gray-600 ml-4 italic">
                    {testimonial.text}
                  </p>
                </div>
                <div className="mt-auto pt-6 flex justify-center space-x-2">
                  {testimonials.map((_, dotIndex) => (
                    <button
                      key={dotIndex}
                      type="button"
                      onClick={() => setActiveTestimonial(dotIndex)}
                      className={`w-3 h-3 rounded-full ${
                        activeTestimonial === dotIndex
                          ? "bg-green-600"
                          : "bg-gray-300"
                      }`}
                      aria-label={`Go to testimonial ${dotIndex + 1}`}
                    ></button>
                  ))}
                </div>
              </div>
            ))}
            <div className="h-72 md:h-56"></div> {/* Spacer */}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-16">
        <div className="container mx-auto px-4">
          <div className="bg-gradient-to-r from-green-600 to-teal-500 rounded-lg p-8 md:p-12 shadow-xl">
            <div className="flex flex-wrap items-center">
              <div className="w-full lg:w-7/12 px-4 mb-8 lg:mb-0">
                <h3 className="text-3xl font-semibold text-white">
                  Ready to make an impact?
                </h3>
                <p className="text-lg text-white opacity-90 mt-2">
                  Join the AeroLeaf community and contribute to a greener planet
                  through verified carbon credit projects.
                </p>
              </div>
              <div className="w-full lg:w-5/12 px-4">
                <div className="flex flex-wrap">
                  <div className="w-full sm:w-8/12 px-2">
                    {isSubscribed ? (
                      <div className="bg-white bg-opacity-20 p-3 rounded-lg text-white flex items-center">
                        <svg
                          className="h-5 w-5 mr-2 checkmark"
                          fill="none"
                          viewBox="0 0 24 24"
                          stroke="currentColor"
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth={2}
                            d="M5 13l4 4L19 7"
                          />
                        </svg>
                        <span>Thank you for subscribing!</span>
                      </div>
                    ) : (
                      <input
                        type="email"
                        className="px-4 py-3 placeholder-gray-400 text-gray-700 bg-white rounded-lg text-base w-full border-0 shadow focus:outline-none focus:ring-2 focus:ring-green-500"
                        placeholder="Your Email Address"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                      />
                    )}
                  </div>
                  <div className="w-full sm:w-4/12 px-2 mt-4 sm:mt-0">
                    <button
                      className={`bg-white text-green-700 px-4 py-3 rounded-lg w-full hover:bg-gray-100 transition font-medium shadow transform hover:scale-[1.02] active:scale-[0.98] ${
                        isSubscribed ? "opacity-50 cursor-not-allowed" : ""
                      }`}
                      type="button"
                      onClick={handleSubscribe}
                      disabled={isSubscribed}
                    >
                      Subscribe
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Partner Logos */}
      <section className="py-12 border-t border-gray-200">
        <div className="container mx-auto px-4">
          <p className="text-center text-gray-500 mb-8">
            Trusted by leading organizations
          </p>
          <div className="flex flex-wrap justify-center items-center opacity-50">
            {[1, 2, 3, 4, 5].map((i) => (
              <div key={i} className="px-8 py-4">
                <div className="h-12 w-24 bg-gray-300 rounded opacity-50"></div>
              </div>
            ))}
          </div>
        </div>
      </section>
    </div>
  );
}

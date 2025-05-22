import { useState, useEffect, useRef } from "react";
import { motion } from "framer-motion";
import {
  TrendingUp,
  VerifiedUser,
  NatureOutlined,
  Co2,
  ShowChart,
  RequestQuote,
} from "@mui/icons-material";

export default function CarbonStats({ userId }) {
  const [stats, setStats] = useState({
    totalCredits: 1450,
    estimatedCO2: 3.2,
    verifiedSites: 3,
    pendingSites: 2,
    totalValue: 29000,
    growthRate: 12.4,
  });

  const [animate, setAnimate] = useState(false);
  const counterRef = useRef(null);

  // Simulate fetching real data
  useEffect(() => {
    // In a real app, this would be an API call based on userId
    const timer = setTimeout(() => {
      // Mock data update
      setStats({
        totalCredits: 1450,
        estimatedCO2: 3.2,
        verifiedSites: 3,
        pendingSites: 2,
        totalValue: 29000,
        growthRate: 12.4,
      });
    }, 600);

    return () => clearTimeout(timer);
  }, [userId]);

  // Initialize counter animation when in view
  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setAnimate(true);
          observer.disconnect();
        }
      },
      { threshold: 0.2 }
    );

    if (counterRef.current) {
      observer.observe(counterRef.current);
    }

    return () => observer.disconnect();
  }, []);

  return (
    <motion.div
      className="bg-white rounded-xl shadow-lg overflow-hidden border border-gray-100"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
    >
      <div className="bg-gradient-to-r from-green-600 to-emerald-500 text-white p-4">
        <h2 className="text-xl font-semibold flex items-center gap-2">
          <ShowChart /> Carbon Credit Dashboard
        </h2>
        <p className="text-green-100 text-sm">Updated on May 22, 2025</p>
      </div>

      <div ref={counterRef}>
        <div className="grid grid-cols-2 md:grid-cols-3 gap-4 p-4">
          {/* Total Credits Card */}
          <div className="bg-gradient-to-br from-green-50 to-emerald-50 p-4 rounded-lg border border-green-100">
            <div className="flex justify-between items-start">
              <div className="text-green-800 bg-green-100 p-2 rounded-lg">
                <VerifiedUser />
              </div>
              <span className="text-xs font-semibold text-green-700 bg-green-100 px-2 py-1 rounded-full">
                +8%
              </span>
            </div>
            <p className="text-gray-500 mt-2 text-sm font-medium">
              Total Credits
            </p>
            <motion.h3
              className="text-2xl font-bold text-gray-800"
              initial={{ opacity: 0 }}
              animate={animate ? { opacity: 1 } : {}}
              transition={{ duration: 1 }}
            >
              <CountUp end={stats.totalCredits} />
            </motion.h3>
          </div>

          {/* CO2 Offset Card */}
          <div className="bg-gradient-to-br from-blue-50 to-cyan-50 p-4 rounded-lg border border-blue-100">
            <div className="flex justify-between items-start">
              <div className="text-blue-800 bg-blue-100 p-2 rounded-lg">
                <Co2 />
              </div>
              <span className="text-xs font-semibold text-blue-700 bg-blue-100 px-2 py-1 rounded-full">
                +{stats.growthRate}%
              </span>
            </div>
            <p className="text-gray-500 mt-2 text-sm font-medium">
              CO₂ Captured
            </p>
            <motion.h3
              className="text-2xl font-bold text-gray-800"
              initial={{ opacity: 0 }}
              animate={animate ? { opacity: 1 } : {}}
              transition={{ duration: 1 }}
            >
              <CountUp end={stats.estimatedCO2} decimals={1} /> tons
            </motion.h3>
          </div>

          {/* Sites Card */}
          <div className="bg-gradient-to-br from-amber-50 to-yellow-50 p-4 rounded-lg border border-amber-100">
            <div className="flex justify-between items-start">
              <div className="text-amber-800 bg-amber-100 p-2 rounded-lg">
                <NatureOutlined />
              </div>
              <span className="text-xs font-semibold text-amber-700 bg-amber-100 px-2 py-1 rounded-full">
                Active
              </span>
            </div>
            <p className="text-gray-500 mt-2 text-sm font-medium">
              Monitored Sites
            </p>
            <motion.div
              className="text-2xl font-bold text-gray-800 flex items-end"
              initial={{ opacity: 0 }}
              animate={animate ? { opacity: 1 } : {}}
              transition={{ duration: 1 }}
            >
              <CountUp end={stats.verifiedSites} />
              <span className="text-lg text-green-600 ml-2">verified</span>
              <span className="text-sm text-gray-400 ml-1">
                +{stats.pendingSites} pending
              </span>
            </motion.div>
          </div>

          {/* Market Value Card - Spans full width on small, half on medium+ */}
          <div className="col-span-2 md:col-span-3 bg-gradient-to-br from-gray-50 to-slate-50 p-4 rounded-lg border border-gray-200">
            <div className="flex justify-between">
              <div>
                <div className="flex items-center">
                  <div className="text-indigo-800 bg-indigo-100 p-2 rounded-lg mr-3">
                    <RequestQuote />
                  </div>
                  <div>
                    <p className="text-gray-500 text-sm font-medium">
                      Market Value
                    </p>
                    <motion.h3
                      className="text-2xl font-bold text-gray-800"
                      initial={{ opacity: 0 }}
                      animate={animate ? { opacity: 1 } : {}}
                      transition={{ duration: 1 }}
                    >
                      $<CountUp end={stats.totalValue} />
                    </motion.h3>
                  </div>
                </div>
              </div>

              <div className="flex items-center gap-2">
                <TrendingUp className="text-green-500" />
                <span className="text-green-600 font-semibold">
                  +{stats.growthRate}%
                </span>
                <span className="text-xs text-gray-500">this month</span>
              </div>
            </div>

            {/* Mini Chart */}
            <div className="h-16 mt-4 flex items-end">
              {[35, 48, 42, 65, 55, 70, 60, 80, 72, 90, 85, 95].map(
                (value, i) => (
                  <motion.div
                    key={i}
                    className="flex-1 bg-green-500 mx-0.5 rounded-t"
                    style={{ height: `${value}%` }}
                    initial={{ height: "0%" }}
                    animate={animate ? { height: `${value}%` } : {}}
                    transition={{
                      duration: 0.6,
                      delay: i * 0.05,
                      ease: "easeOut",
                    }}
                  />
                )
              )}
            </div>
            <div className="flex justify-between text-xs text-gray-400 mt-1">
              <span>May</span>
              <span>Jun</span>
              <span>Jul</span>
              <span>Aug</span>
              <span>Sep</span>
              <span>Oct</span>
              <span>Nov</span>
              <span>Dec</span>
              <span>Jan</span>
              <span>Feb</span>
              <span>Mar</span>
              <span>Apr</span>
            </div>
          </div>
        </div>
      </div>
    </motion.div>
  );
}

// Simple counter animation component
const CountUp = ({ end, duration = 1.5, decimals = 0 }) => {
  const [count, setCount] = useState(0);

  useEffect(() => {
    let startTime;
    let animationFrame;

    const updateCount = (timestamp) => {
      if (!startTime) startTime = timestamp;
      const progress = timestamp - startTime;
      const progressRatio = Math.min(progress / (duration * 1000), 1);

      setCount(progressRatio * end);

      if (progressRatio < 1) {
        animationFrame = requestAnimationFrame(updateCount);
      }
    };

    animationFrame = requestAnimationFrame(updateCount);

    return () => cancelAnimationFrame(animationFrame);
  }, [end, duration]);

  return parseFloat(count.toFixed(decimals)).toLocaleString();
};

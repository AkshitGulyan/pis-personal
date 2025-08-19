import { motion, AnimatePresence } from "framer-motion";
import { useState, useEffect } from "react";
import Starfield from "../components/Starfield";

// Step 1: Feature staircase component
const features = [
  "AI-powered Insights",
  "Real-time Data",
  "Customizable Analytics",
  "Collaborative Dashboards",
  "Secure Cloud Storage",
];

function FeatureStaircase({ launching }) {
  const [step, setStep] = useState(0);

  useEffect(() => {
    if (!launching && step < features.length - 1) {
      const timer = setTimeout(() => setStep(step + 1), 1400);
      return () => clearTimeout(timer);
    }
    if (launching) setStep(0); // Reset
  }, [step, launching]);

  const variant = {
    current: { opacity: 1, scale: 1, y: 0 },
    previous: { opacity: 0.3, scale: 0.96, y: -12 },
    upcoming: { opacity: 0.28, scale: 0.96, y: 12 },
  };

  return (
    <div className="flex flex-col items-center gap-1 my-2">
      {features.map((feature, i) => (
        <motion.div
          key={feature}
          variants={variant}
          initial="upcoming"
          animate={
            i === step
              ? "current"
              : i < step
              ? "previous"
              : "upcoming"
          }
          transition={{ duration: 0.55 }}
          className="text-xl text-white font-semibold"
        >
          {feature}
        </motion.div>
      ))}
    </div>
  );
}

// Step 2: Main component
export default function Landing({ onEnter }) {
  const [launching, setLaunching] = useState(false);

  const handleExplore = () => {
    setLaunching(true);
    setTimeout(() => {
      onEnter();
    }, 2000); // short & punchy
  };

  return (
    <div className="relative flex flex-col items-center justify-center h-screen text-center">
      <Starfield boost={launching} />

      <AnimatePresence>
        {!launching ? (
          <motion.div
            initial={{ opacity: 0, y: 40 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.9 }}
            className="flex flex-col gap-6 z-10"
          >
            <h1 className="text-5xl font-bold text-white font-techno">
              🚀 PIS Portal
            </h1>
            <p className="text-lg text-gray-300">
              Your futuristic product intelligence dashboard
            </p>
            {/* Inserted staircase here */}
            <FeatureStaircase launching={launching} />
            <button
              onClick={handleExplore}
              className="px-6 py-3 bg-indigo-600 hover:bg-indigo-500 rounded-lg text-lg font-semibold transition"
            >
              Explore
            </button>
          </motion.div>
        ) : (
          <motion.div
            key="launch"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="flex flex-col items-center gap-4 z-10"
          >
            <motion.div
              initial={{ y: 200 }}
              animate={{ y: -300 }}
              transition={{ duration: 1.5 }}
            >
              <span className="text-7xl">🚀</span>
            </motion.div>
            <motion.p
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.3 }}
              className="text-xl text-gray-300"
            >
              Engaging hyperspace jump...
            </motion.p>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

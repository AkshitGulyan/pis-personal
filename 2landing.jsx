import { motion, AnimatePresence } from "framer-motion";
import { useState, useEffect } from "react";

const features = [
  "AI-powered Insights",
  "Real-time Data",
  "Customizable Analytics",
  "Collaborative Dashboards",
  "Secure Cloud Storage",
];

export default function FeatureStaircase() {
  const [step, setStep] = useState(0);

  // Automatically step through features every 1.5s
  useEffect(() => {
    if (step < features.length - 1) {
      const timer = setTimeout(() => setStep(step + 1), 1500);
      return () => clearTimeout(timer);
    }
  }, [step]);

  // Animation variants
  const variant = {
    current: { opacity: 1, scale: 1, y: 0 },
    previous: { opacity: 0.3, scale: 0.9, y: -20 },
    upcoming: { opacity: 0.3, scale: 0.9, y: 20 },
  };

  return (
    <div className="flex flex-col items-center gap-2 mt-10">
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
          transition={{ duration: 0.6 }}
          className="text-2xl font-semibold"
        >
          {feature}
        </motion.div>
      ))}
    </div>
  );
}

import { motion, AnimatePresence } from "framer-motion";
import { useState, useEffect } from "react";

export default function Landing({ onEnter }) {
  const [launching, setLaunching] = useState(false);

  const handleExplore = () => {
    setLaunching(true);
    setTimeout(() => {
      onEnter();
    }, 2500); // 2.5 sec rocket animation
  };

  return (
    <div className="starfield flex flex-col items-center justify-center h-screen text-center">
      <AnimatePresence>
        {!launching ? (
          <motion.div
            initial={{ opacity: 0, y: 40 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.9 }}
            className="flex flex-col gap-6"
          >
            <h1 className="text-5xl font-bold text-white font-techno">
              🚀 PIS Portal
            </h1>
            <p className="text-lg text-gray-300">
              Your futuristic product intelligence dashboard
            </p>
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
            className="flex flex-col items-center gap-4"
          >
            <motion.div
              initial={{ y: 200 }}
              animate={{ y: -300 }}
              transition={{ duration: 2 }}
            >
              <span className="text-7xl">🚀</span>
            </motion.div>
            <motion.p
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.5 }}
              className="text-xl text-gray-300"
            >
              Initiating hyperspace jump...
            </motion.p>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

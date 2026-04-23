"use client";

import { motion } from "framer-motion";

export default function WeatherAnimation({
  condition,
  isDay,
}: {
  condition: string;
  isDay: boolean;
}) {
  // Normalize condition
  const type = condition.toLowerCase();

  return  ( 
    <div className="absolute inset-0 overflow-hidden">
      {/* ☀️ CLEAR WEATHER */}
      {type.includes("clear") && (
        <motion.div
          className="absolute top-20 left-1/2 w-32 h-32 bg-yellow-300 rounded-full blur-2xl"
          animate={{ scale: [1, 1.2, 1] }}
          transition={{ repeat: Infinity, duration: 3 }}
        />
      )}

      {/* ☁️ CLOUDS */}
      {type.includes("cloud") && (
        <>
          <motion.div
            className="absolute top-20 left-10 w-40 h-20 bg-white/20 rounded-full blur-xl"
            animate={{ x: [0, 50, 0] }}
            transition={{ repeat: Infinity, duration: 10 }}
          />
          <motion.div
            className="absolute top-32 right-10 w-52 h-24 bg-white/10 rounded-full blur-xl"
            animate={{ x: [0, -50, 0] }}
            transition={{ repeat: Infinity, duration: 12 }}
          />
        </>
      )}

      {/* 🌧️ RAIN */}
      {type.includes("rain") && (
        <div className="absolute inset-0">
          {[...Array(60)].map((_, i) => (
            <motion.div
              key={i}
              className="absolute w-[2px] h-6 bg-blue-300/60"
              initial={{ y: -20, x: Math.random() * window.innerWidth }}
              animate={{ y: "100vh" }}
              transition={{
                repeat: Infinity,
                duration: 1,
                delay: Math.random(),
              }}
            />
          ))}
        </div>
      )}

      {/* ❄️ SNOW */}
      {type.includes("snow") && (
        <div className="absolute inset-0">
          {[...Array(40)].map((_, i) => (
            <motion.div
              key={i}
              className="absolute w-2 h-2 bg-white rounded-full"
              initial={{
                y: -10,
                x: Math.random() * window.innerWidth,
              }}
              animate={{ y: "100vh" }}
              transition={{
                repeat: Infinity,
                duration: 6,
                delay: Math.random(),
              }}
            />
          ))}
        </div>
      )}

      {/* 🌫️ MIST / FOG */}
      {type.includes("mist") ||
        (type.includes("fog") && (
          <motion.div
            className="absolute inset-0 bg-white/10 backdrop-blur-2xl"
            animate={{ opacity: [0.2, 0.5, 0.2] }}
            transition={{ repeat: Infinity, duration: 6 }}
          />
        ))}
    </div>
  );
}

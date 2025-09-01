import React, { useEffect, useState } from "react";
import GaugeChart from "react-gauge-chart";
import { motion } from "framer-motion";

const BMIGauge = ({ bmi }) => {
  const [animatedBMI, setAnimatedBMI] = useState(0);

  useEffect(() => {
    // Smooth animation for BMI value
    if (typeof bmi === "number" && !isNaN(bmi)) {
      let start = 0;
      const duration = 2000; // Animation duration in ms
      const step = (timestamp) => {
        const progress = Math.min((timestamp / duration), 1); // Cap progress at 1
        const currentBMI = progress * bmi;
        setAnimatedBMI(currentBMI.toFixed(1)); // Update BMI smoothly
        if (progress < 1) {
          requestAnimationFrame(step);
        }
      };
      requestAnimationFrame(step);
    }
  }, [bmi]);

  // BMI ranges and categories
  const bmiRanges = [
    { label: "Underweight", min: 0, max: 18.4, color: "#42a5f5" },
    { label: "Normal", min: 18.5, max: 24.9, color: "#66bb6a" },
    { label: "Overweight", min: 25, max: 29.9, color: "#ffca28" },
    { label: "Obese", min: 30, max: 39.9, color: "#ff7043" },
    { label: "Severely Obese", min: 40, max: 50, color: "#d32f2f" },
  ];

  // Normalize BMI and find category
  const normalizedBMI = Math.max(0, Math.min(bmi, 50)); // Ensure BMI is between 0 and 50
  const category = bmiRanges.find(
    (range) => normalizedBMI >= range.min && normalizedBMI <= range.max
  ) || { label: "Unknown", color: "#000" }; // Fallback for unknown category

  return (
    <div className="bmi-gauge">
      <GaugeChart
        id="bmi-gauge"
        nrOfLevels={5}
        percent={Math.min(animatedBMI / 50, 1)} // Normalize percent (0 to 1)
        colors={bmiRanges.map((range) => range.color)}
        arcWidth={0.3}
        needleColor="#09111383"
        textColor="#000"
        animate={true}
        animationDuration={2000}
        aria-label={`BMI: ${animatedBMI}, Category: ${category.label}`}
      />
      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 1 }}
        className="health-percentage"
      >
        <strong>BMI:</strong> {animatedBMI} <br />
        <strong>Category:</strong> {category.label}
      </motion.div>
    </div>
  );
};

export default BMIGauge;

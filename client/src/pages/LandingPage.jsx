import React, { useEffect, useState, useRef } from "react";

export default function LandingPage() {
  const [showAlt, setShowAlt] = useState(false);
  const [fadeStage, setFadeStage] = useState("in");
  const soundRef = useRef(null);

  const firstHalf = "TRACK";
  const secondHalf = "SPHERE";
  const originalSubtitleWords = [
    "Track",
    "actions.",
    "Mark",
    "progress.",
    "Collaborate",
    "in",
    "motion.",
  ];

  const altTitle1 = "Track Manage";
  const altTitle2 = "& Visualize Together";
  const altSubtitle = "Where space meets data — collaboration visualized";

  useEffect(() => {
    soundRef.current = new Audio("/sounds/switch.mp3");

    const interval = setInterval(() => {
      setFadeStage("out");
      if (soundRef.current) soundRef.current.play().catch(() => {});
      setTimeout(() => {
        setShowAlt((prev) => !prev);
        setFadeStage("in");
      }, 500);
    }, 10000);

    return () => clearInterval(interval);
  }, []);

  return (
    <div className="relative w-full h-screen overflow-hidden bg-black">
      {/* 🎥 Background Video */}
      <video
        className="absolute top-0 left-0 w-full h-full object-cover z-0"
        autoPlay
        muted
        loop
        playsInline
        preload="metadata"
        poster="/images/landing-placeholder.jpg" // optional fallback image
      >
        <source src="/videos/landing.webm" type="video/webm" />
        <source src="/videos/landing.mp4" type="video/mp4" />
        Your browser does not support the video tag.
      </video>

      {/* 🔧 Responsive Overlay with reduced black */}
      <div className="absolute inset-0 bg-black/25 sm:bg-black/30 md:bg-black/40 z-10" />

      {/* Content */}
      <div className="absolute inset-0 z-20 flex flex-col justify-center items-start px-8 sm:px-16 md:px-32 text-white">
        <div
          className={`transition-opacity duration-500 ease-in-out ${
            fadeStage === "out" ? "opacity-0" : "opacity-100"
          }`}
        >
          {!showAlt ? (
            <>
              {/* TRACKSPHERE Title */}
              <h1
                className="text-5xl sm:text-5xl md:text-7xl font-bold tracking-wider flex space-x-1 mb-4"
                style={{ fontFamily: "Anton, sans-serif" }}
              >
                {firstHalf.split("").map((char, i) => (
                  <span
                    key={i}
                    className="blur-letter text-white"
                    style={{ animationDelay: `${i * 0.25}s` }}
                  >
                    {char}
                  </span>
                ))}
                {secondHalf.split("").map((char, i) => (
                  <span
                    key={i + firstHalf.length}
                    className="blur-letter text-indigo-400"
                    style={{ animationDelay: `${(i + firstHalf.length) * 0.25}s` }}
                  >
                    {char}
                  </span>
                ))}
              </h1>

              {/* Original Subtitle */}
              <p className="text-lg sm:text-xl md:text-2xl text-indigo-300 flex flex-wrap gap-2 mb-6">
                {originalSubtitleWords.map((word, i) => (
                  <span
                    key={i}
                    className="subtitle-word"
                    style={{ animationDelay: `${3.5 + i * 0.3}s` }}
                  >
                    {word}
                  </span>
                ))}
              </p>
            </>
          ) : (
            <>
              {/* Alternate Title — mobile slightly larger */}
              <h1
                className="font-semibold tracking-wide flex flex-wrap break-words max-w-[90vw] gap-[2px] mb-4
                  text-2xl sm:text-4xl md:text-5xl lg:text-5xl xl:text-6xl"
                style={{ fontFamily: "Poppins, sans-serif" }}
              >
                {altTitle1.split("").map((char, i) => (
                  <span
                    key={i}
                    className="blur-letter text-white"
                    style={{ animationDelay: `${i * 0.2}s` }}
                  >
                    {char}
                  </span>
                ))}
                {altTitle2.split("").map((char, i) => (
                  <span
                    key={i + altTitle1.length}
                    className="blur-letter text-indigo-400"
                    style={{ animationDelay: `${(i + altTitle1.length) * 0.2}s` }}
                  >
                    {char}
                  </span>
                ))}
              </h1>

              {/* Alternate Subtitle */}
              <p className="text-base sm:text-lg md:text-xl text-indigo-200 alt-subtitle-anim mb-6 max-w-[90vw]">
                {altSubtitle}
              </p>
            </>
          )}
        </div>

        {/* CTA Button */}
        <button
          onClick={() => (window.location.href = "/login")}
          className="bg-indigo-600 hover:bg-indigo-700 text-white px-8 py-3 rounded-full text-base sm:text-lg font-semibold shadow-lg transition animate-button"
        >
          Get Started
        </button>
      </div>
    </div>
  );
}


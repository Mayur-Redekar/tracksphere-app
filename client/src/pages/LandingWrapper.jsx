import React, { useState, useEffect } from "react";
import LandingPage from "./LandingPage";

export default function LandingWrapper() {
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const timer = setTimeout(() => setIsLoading(false), 2500); // 2.5s
    return () => clearTimeout(timer);
  }, []);

  return (
    <>
      {isLoading ? (
        <div className="h-screen w-full flex justify-center items-center bg-black">
          <h1 className="text-4xl sm:text-5xl text-indigo-400 font-bold animate-pulse tracking-widest" style={{ fontFamily: "Anton, sans-serif" }}>
            TRACKSPHERE
          </h1>
        </div>
      ) : (
        <LandingPage />
      )}
    </>
  );
}

"use client";

import React, { useState, useEffect } from "react";
import Image from "next/image";

import leftModel from "../assets/landing-page/left-model.png";
import centerModel from "../assets/landing-page/center-model.png";
import rightModel from "../assets/landing-page/right-model.png";

export default function ParallaxHero() {
  const [scrollY, setScrollY] = useState(0);
  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    const checkMobile = () => setIsMobile(window.innerWidth < 768);
    checkMobile();

    window.addEventListener("resize", checkMobile);

    const handleScroll = () => {
      setScrollY(window.scrollY);
    };

    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => {
      window.removeEventListener("scroll", handleScroll);
      window.removeEventListener("resize", checkMobile);
    };
  }, []);

  // Parallax multipliers tuned to "tear apart" the overlapped images
  // Center moves up fast, bottom row moves down gently.
  const centerParallax = isMobile ? -scrollY * 0.3 : -scrollY * 0.3;
  const leftParallax = isMobile ? scrollY * 0.15 : scrollY * 0.35;
  const rightParallax = isMobile ? scrollY * 0.22 : scrollY * 0.45;

  return (
    // pb-0 allows the downward-moving models to tuck cleanly behind the solid black section below
    <div className="relative z-10 w-full max-w-[1600px] mx-auto pt-24 md:pt-40 px-4 md:px-8 flex flex-col items-center pb-0 md:pb-[30vh]">
      {/* 1. HERO BANNER (Center Model) */}
      <div
        className="w-full z-20 relative" /* FIX: Removed md:w-[85%] to restore its massive full size */
        style={{ transform: `translateY(${centerParallax}px)` }}
      >
        <Image
          src={centerModel}
          alt="Triebe Collection Hero"
          width={1600}
          height={1000}
          priority
          className="w-full h-auto object-contain drop-shadow-2xl"
        />
      </div>

      {/* 2. BOTTOM ROW (Left & Right Models) */}
      {/* mt-[-20vw] forces the mobile images to overlap the center image at the start! */}
      <div className="w-full md:w-[95%] flex justify-between z-30 mt-[-10vw] md:mt-[-8vw] relative">
        {/* Left Model */}
        <div
          className="w-[48%] md:w-[45%]"
          style={{ transform: `translateY(${leftParallax}px)` }}
        >
          <Image
            src={leftModel}
            alt="Streetwear Look 1"
            width={800}
            height={1200}
            className="w-full h-auto object-contain drop-shadow-2xl"
          />
        </div>

        {/* Right Model */}
        <div
          className="w-[48%] md:w-[42%] mt-[12%] md:mt-[8%]"
          style={{ transform: `translateY(${rightParallax}px)` }}
        >
          <Image
            src={rightModel}
            alt="Streetwear Look 2"
            width={800}
            height={1200}
            className="w-full h-auto object-contain drop-shadow-2xl"
          />
        </div>
      </div>
    </div>
  );
}

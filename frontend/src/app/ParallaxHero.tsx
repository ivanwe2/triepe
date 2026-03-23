"use client";

import React, { useState, useEffect } from "react";
import Image from "next/image";

// Using the exact paths from your original file
import leftModel from "../assets/landing-page/left-model.png";
import centerModel from "../assets/landing-page/center-model.png";
import rightModel from "../assets/landing-page/right-model.png";

export default function ParallaxHero() {
  const [scrollY, setScrollY] = useState(0);

  useEffect(() => {
    const handleScroll = () => {
      setScrollY(window.scrollY);
    };
    
    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  return (
    <div className="relative z-10 w-full max-w-[1600px] mx-auto pt-32 md:pt-40 px-4 md:px-8 flex flex-col items-center pb-[20vh] md:pb-[30vh]">
      
      {/* 1. HERO BANNER (Center Model) */}
      <div 
        className="w-full z-20 relative"
        style={{ transform: `translateY(${-scrollY * 0.3}px)` }}
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
      <div className="w-full md:w-[95%] flex justify-between z-30 mt-[-15vw] md:mt-[-8vw] relative">
        
        {/* Left Model */}
        <div 
          className="w-[48%] md:w-[45%]"
          style={{ transform: `translateY(${scrollY * 0.35}px)` }}
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
          className="w-[48%] md:w-[42%] mt-[8%]"
          style={{ transform: `translateY(${scrollY * 0.45}px)` }}
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
"use client"
import { useEffect, useRef, MouseEvent } from "react";
import { gsap } from "gsap";

export default function LiquidText() {
  const waveRef = useRef(null);

  useEffect(() => {
    gsap.to(waveRef.current, {
      duration: 2,
      repeat: -1,
      yoyo: true,
      ease: "sine.inOut",
      attr: { d: "M0,50 Q50,40 100,50 T200,50 T300,50 V100 H0 Z" },
    });
  }, []);

  const handleMouseOver = () => {
    gsap.to(waveRef.current, {
      duration: 0.5,
      ease: "power2.out",
      attr: { d: "M0,40 Q50,30 100,40 T200,40 T300,40 V100 H0 Z" },
    });
  };

  const handleMouseOut = () => {
    gsap.to(waveRef.current, {
      duration: 0.5,
      ease: "power2.out",
      attr: { d: "M0,50 Q50,60 100,50 T200,50 T300,50 V100 H0 Z" },
    });
  };

  return (
    <div className="flex items-center justify-center min-h-screen bg-gray-900">
      <svg 
        width="300" 
        height="100" 
        viewBox="0 0 300 100" 
        className="text-white"
        onMouseOver={handleMouseOver}
        onMouseOut={handleMouseOut}
      >
        <defs>
          <clipPath id="textClip">
            <text x="50%" y="70%" textAnchor="middle" fontSize="60" fontWeight="bold" fill="black">
              LIQUID
            </text>
          </clipPath>
        </defs>
        <rect width="300" height="100" fill="#00AEEF" clipPath="url(#textClip)" />
        <path
          ref={waveRef}
          d="M0,50 Q50,60 100,50 T200,50 T300,50 V100 H0 Z"
          fill="#0077CC"
          clipPath="url(#textClip)"
        />
      </svg>
    </div>
  );
}

"use client"
import { useEffect, useRef, MouseEvent } from "react";
import { gsap } from "gsap";

export default function LiquidText() {
  const waveRef = useRef(null);
  const isInteracting = useRef(false);
  const idleTimeline = useRef(null);

  useEffect(() => {
    startIdleAnimation();
  }, []);

  const startIdleAnimation = () => {
    if (idleTimeline.current) idleTimeline.current.kill(); // Stop any existing idle animation
    
    idleTimeline.current = gsap.timeline({ repeat: -1, yoyo: true });
    idleTimeline.current.to(waveRef.current, {
      // duration: 0.5,
      duration: 0.75,
      ease: "sine.inOut",
      attr: { d: generateWavePath(50, 50, true) },
    }).to(waveRef.current, {
      // duration: 0.5,
      duration: 0.75,
      ease: "sine.inOut",
      attr: { d: generateWavePath(-50, 50, true) },
    });
  };

  const generateWavePath = (mouseX, mouseY, isIdle = false) => {
    const baseHeight = 50;
    const amplitude = isIdle ? 5 : Math.max(5, 15 - Math.abs(mouseY - 50) * 0.3);
    const frequency = isIdle ? 0.02 : 0.03;
    let path = `M0,${baseHeight}`;

    for (let i = 0; i <= 300; i += 30) {
      const y = baseHeight + amplitude * Math.sin((i - mouseX) * frequency);
      path += ` L${i},${y}`;
    }

    path += " V100 H0 Z";
    return path;
  };

  const handleMouseMove = (event) => {
    isInteracting.current = true;
    if (idleTimeline.current) idleTimeline.current.kill(); // Stop idle animation
    
    const { offsetX, offsetY } = event.nativeEvent;
    const clampedX = Math.max(0, Math.min(300, offsetX));
    const clampedY = Math.max(40, Math.min(60, offsetY));

    gsap.to(waveRef.current, {
      duration: 0.5,
      ease: "power3.out",
      attr: { d: generateWavePath(clampedX, clampedY) },
    });

    setTimeout(() => {
      isInteracting.current = false;
      startIdleAnimation();
    }, 250);
  };

  const handleMouseEnter = () => {
    isInteracting.current = true;
    if (idleTimeline.current) idleTimeline.current.kill(); // Stop idle animation
    
    gsap.to(waveRef.current, {
      duration: 0.7,
      ease: "power2.out",
      attr: { d: generateWavePath(150, 50) },
    });
  };

  const handleMouseLeave = () => {
    isInteracting.current = false;
    startIdleAnimation(); // Restart idle animation
  };

  return (
    <div className="flex items-center justify-center min-h-screen bg-gray-900">
      <svg 
        width="300" 
        height="100" 
        viewBox="0 0 300 100" 
        className="text-white"
        onMouseMove={handleMouseMove}
        onMouseEnter={handleMouseEnter}
        onMouseLeave={handleMouseLeave}
      >
        <defs>
          <clipPath id="textClip">
            <text x="50%" y="70%" textAnchor="middle" fontSize="80" fontWeight="bold" fill="black">
              LIQUID
            </text>
          </clipPath>
        </defs>
        <rect width="300" height="100" fill="#00AEEF" clipPath="url(#textClip)" />
        <path
          ref={waveRef}
          d={generateWavePath(0, 50, true)}
          fill="#0077CC"
          clipPath="url(#textClip)"
        />
      </svg>
    </div>
  );
}

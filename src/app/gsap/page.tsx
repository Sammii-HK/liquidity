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
      duration: 0.75,
      ease: "sine.inOut",
      attr: { d: generateWavePath(50, 50, true) },
    }).to(waveRef.current, {
      duration: 0.75,
      ease: "sine.inOut",
      attr: { d: generateWavePath(-50, 50, true) },
    });
  };

  const generateWavePath = (mouseX: number, mouseY: number, isIdle = false) => {
    const baseHeight = 70;
    const amplitude = isIdle ? 10 : Math.max(10, 15 - Math.abs(mouseY - 70) * 0.4); // Bigger wave motion
    const frequency = isIdle ? 0.015 : 0.02; // Smoother frequency for larger wave
    const phaseShift = Math.PI / 2;

    let path = `M0,${baseHeight}`;
  
    for (let i = 0; i <= 400; i += 40) {
      const y = baseHeight + amplitude * Math.sin((i - mouseX) * frequency + phaseShift);
      path += ` L${i},${y}`;
    }
  
    path += " V110 H0 Z";
    return path;
  };
  

  const handleMouseMove = (event: MouseEvent) => {
    isInteracting.current = true;
    if (idleTimeline.current) idleTimeline.current.kill(); // Stop idle animation
    
    const { offsetX, offsetY } = event.nativeEvent;
    const clampedX = Math.max(0, Math.min(400, offsetX));
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
    startIdleAnimation();
  };

  return (
    <div className="flex items-center justify-center min-h-screen bg-gray-900">
      <svg 
        width="400" 
        height="120" 
        viewBox="0 0 400 120" 
        className="text-white"
        onMouseMove={handleMouseMove}
        onMouseEnter={handleMouseEnter}
        onMouseLeave={handleMouseLeave}
      >
        <defs>
          <clipPath id="textClip">
            <text x="50%" y="75%" textAnchor="middle" fontSize="120" fontWeight="bold" fill="black">
              LIQUID
            </text>
          </clipPath>
        </defs>
        <rect width="400" height="110" fill="#00AEEF" clipPath="url(#textClip)" />
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

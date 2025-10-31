"use client"
import { useEffect, useRef, MouseEvent, useCallback } from "react";
import { gsap } from "gsap";
import Navigation from "@/components/Navigation";

export default function LiquidText() {
  const waveRef = useRef<SVGPathElement | null>(null);
  const isInteracting = useRef<boolean>(false);
  const idleTimeline = useRef<gsap.core.Timeline | null>(null);

  const generateWavePath = useCallback((mouseX: number, mouseY: number, isIdle: boolean = false): string => {
    const baseHeight: number = 70;
    const amplitude: number = isIdle ? 10 : Math.max(10, 15 - Math.abs(mouseY - 70) * 0.4); // Bigger wave motion
    const frequency: number = isIdle ? 0.015 : 0.02; // Smoother frequency for larger wave
    const phaseShift: number = Math.PI / 2;

    let path: string = `M0,${baseHeight}`;
  
    for (let i = 0; i <= 400; i += 40) {
      const y: number = baseHeight + amplitude * Math.sin((i - mouseX) * frequency + phaseShift);
      path += ` L${i},${y}`;
    }
  
    path += " V110 H0 Z";
    return path;
  }, []);

  const startIdleAnimation = useCallback((): void => {
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
  }, [generateWavePath]);

  useEffect(() => {
    startIdleAnimation();
  }, [startIdleAnimation]);

  const handleMouseMove = useCallback((event: MouseEvent<SVGSVGElement>): void => {
    isInteracting.current = true;
    if (idleTimeline.current) idleTimeline.current.kill(); // Stop idle animation
    
    const { offsetX, offsetY } = event.nativeEvent;
    const clampedX: number = Math.max(0, Math.min(400, offsetX));
    const clampedY: number = Math.max(40, Math.min(60, offsetY));

    gsap.to(waveRef.current, {
      duration: 0.5,
      ease: "power3.out",
      attr: { d: generateWavePath(clampedX, clampedY) },
    });

    setTimeout(() => {
      isInteracting.current = false;
      startIdleAnimation();
    }, 250);
  }, [generateWavePath, startIdleAnimation]);

  const handleMouseEnter = useCallback((): void => {
    isInteracting.current = true;
    if (idleTimeline.current) idleTimeline.current.kill(); // Stop idle animation
    
    gsap.to(waveRef.current, {
      duration: 0.7,
      ease: "power2.out",
      attr: { d: generateWavePath(150, 50) },
    });
  }, [generateWavePath]);

  const handleMouseLeave = useCallback((): void => {
    isInteracting.current = false;
    startIdleAnimation();
  }, [startIdleAnimation]);

  return (
    <div className="min-h-screen bg-gray-900 pt-20">
      <Navigation />
      <div className="pt-8 pb-8">
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold text-white mb-2">GSAP Wave Animation</h1>
          <p className="text-gray-400">Move your mouse over the text to create interactive waves</p>
        </div>
        <div className="flex items-center justify-center min-h-[calc(100vh-15rem)]">
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
      </div>
    </div>
  );
}

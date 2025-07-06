'use client'

import { useEffect, useRef } from "react";
import { World, RigidBody, ColliderDesc, RigidBodyDesc } from '@dimforge/rapier2d-compat';
import Rapier from '@dimforge/rapier2d-compat';

export default function LiquidText() {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);

  useEffect(() => {
    const initRapier = async (): Promise<void> => {
      await Rapier.init();
      
      const gravity = new Rapier.Vector2(0, 1500); // Even stronger gravity for faster settling
      const world = new World(gravity);

      // Create a simple ground collider
      const groundCollider = ColliderDesc.cuboid(135, 3).setTranslation(135, 67);
      world.createCollider(groundCollider);

      // Create many more small particles for realistic water effect
      const liquidParticles: RigidBody[] = [];
      for (let i = 0; i < 1200; i++) {
        const x: number = Math.random() * 220 + 25;
        const y: number = Math.random() * 40 + 5;
        const particle = world.createRigidBody(
          RigidBodyDesc.dynamic()
            .setTranslation(x, y)
            .setLinearDamping(2.0) // Add damping for faster settling
        );
        const collider = ColliderDesc.ball(1.0).setDensity(0.6).setRestitution(0.02).setFriction(0.05);
        world.createCollider(collider, particle);
        liquidParticles.push(particle);
      }

      // Get canvas context for rendering
      const canvas = canvasRef.current;
      if (!canvas) return;
      const ctx = canvas.getContext('2d');
      if (!ctx) return;

      const render = (): void => {
        // Clear canvas
        ctx.clearRect(0, 0, canvas.width, canvas.height);
        
        // Draw ground
        ctx.fillStyle = '#333';
        ctx.fillRect(0, 60, 270, 10);
        
        // Set particle style for water-like appearance
        ctx.fillStyle = '#00AEEF';
        ctx.globalAlpha = 0.8;

        // Draw each particle as tiny water droplets
        liquidParticles.forEach((particle) => {
          const pos = particle.translation();
          
          // Smaller water droplets
          ctx.beginPath();
          ctx.arc(pos.x, pos.y, 1.0, 0, Math.PI * 2);
          ctx.fill();
        });
      };

      const step = (): void => {
        // Single physics step per frame for stability
        world.step();
        
        render();
        requestAnimationFrame(step);
      };
      
      requestAnimationFrame(step);

      const handleMouseMove = (event: MouseEvent): void => {
        if (!canvasRef.current) return;
        
        const rect = canvasRef.current.getBoundingClientRect();
        const mouseX: number = event.clientX - rect.left;
        const mouseY: number = event.clientY - rect.top;

        // Create strong dispersal effect around mouse cursor
        liquidParticles.forEach((particle) => {
          const pos = particle.translation();
          const dx: number = pos.x - mouseX;
          const dy: number = pos.y - mouseY;
          const distance: number = Math.sqrt(dx * dx + dy * dy);
          
          // Affect particles within interaction radius
          if (distance > 35) return;
          
          // Much stronger force for dramatic water displacement
          const normalizedDistance = Math.max(distance, 0.1);
          const forceStrength = Math.min(15000 / (normalizedDistance * normalizedDistance), 300);
          
          // Apply dispersal force away from mouse
          const forceX = (dx / distance) * forceStrength;
          const forceY = (dy / distance) * forceStrength;
          
          particle.applyImpulse(new Rapier.Vector2(forceX, forceY), true);
        });
      };

      const handleClick = (event: MouseEvent): void => {
        if (!canvasRef.current) return;
        
        const rect = canvasRef.current.getBoundingClientRect();
        const mouseX: number = event.clientX - rect.left;
        const mouseY: number = event.clientY - rect.top;

        // Create explosive splash effect on click
        liquidParticles.forEach((particle) => {
          const pos = particle.translation();
          const dx: number = pos.x - mouseX;
          const dy: number = pos.y - mouseY;
          const distance: number = Math.sqrt(dx * dx + dy * dy);
          
          if (distance > 50) return;
          
          const normalizedDistance = Math.max(distance, 0.1);
          const forceStrength = Math.min(25000 / normalizedDistance, 500);
          
          const forceX = (dx / distance) * forceStrength;
          const forceY = (dx / distance) * forceStrength * 0.3; // Less vertical force
          
          particle.applyImpulse(new Rapier.Vector2(forceX, forceY), true);
        });
      };

      const handleTouchMove = (event: TouchEvent): void => {
        if (!canvasRef.current) return;
        event.preventDefault();
        
        const rect = canvasRef.current.getBoundingClientRect();
        const touch = event.touches[0];
        const touchX: number = touch.clientX - rect.left;
        const touchY: number = touch.clientY - rect.top;

        // Strong touch dispersal
        liquidParticles.forEach((particle) => {
          const pos = particle.translation();
          const dx: number = pos.x - touchX;
          const dy: number = pos.y - touchY;
          const distance: number = Math.sqrt(dx * dx + dy * dy);
          
          if (distance > 35) return;
          
          const normalizedDistance = Math.max(distance, 0.1);
          const forceStrength = Math.min(15000 / (normalizedDistance * normalizedDistance), 300);
          
          const forceX = (dx / distance) * forceStrength;
          const forceY = (dy / distance) * forceStrength;
          
          particle.applyImpulse(new Rapier.Vector2(forceX, forceY), true);
        });
      };

      const handleTouchStart = (event: TouchEvent): void => {
        if (!canvasRef.current) return;
        event.preventDefault();
        
        const rect = canvasRef.current.getBoundingClientRect();
        const touch = event.touches[0];
        const touchX: number = touch.clientX - rect.left;
        const touchY: number = touch.clientY - rect.top;

        // Explosive splash on touch start
        liquidParticles.forEach((particle) => {
          const pos = particle.translation();
          const dx: number = pos.x - touchX;
          const dy: number = pos.y - touchY;
          const distance: number = Math.sqrt(dx * dx + dy * dy);
          
          if (distance > 50) return;
          
          const normalizedDistance = Math.max(distance, 0.1);
          const forceStrength = Math.min(25000 / normalizedDistance, 500);
          
          const forceX = (dx / distance) * forceStrength;
          const forceY = (dy / distance) * forceStrength * 0.3;
          
          particle.applyImpulse(new Rapier.Vector2(forceX, forceY), true);
        });
      };

      if (canvasRef.current) {
        canvasRef.current.addEventListener("mousemove", handleMouseMove);
        canvasRef.current.addEventListener("click", handleClick);
        canvasRef.current.addEventListener("touchmove", handleTouchMove, { passive: false });
        canvasRef.current.addEventListener("touchstart", handleTouchStart, { passive: false });
      }
    };

    initRapier();
  }, []);

  return (
    <div className="relative flex items-center justify-center min-h-screen bg-gray-900">
      <canvas ref={canvasRef} width={270} height={70} className="absolute z-10" />
      <svg width="270" height="70" className="absolute z-20" style={{ pointerEvents: "none" }}>
        <defs>
          <mask id="liquidMask">
            <rect width="270" height="70" fill="white" />
            <text x="50%" y="50%" textAnchor="middle" fontSize="70" fontWeight="bold" fill="black" dy=".35em">
              LIQUID
            </text>
          </mask>
        </defs>
        <rect width="270" height="70" fill="#1a1a2e" mask="url(#liquidMask)" />
      </svg>
    </div>
  );
}

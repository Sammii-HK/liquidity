'use client'

import { useEffect, useRef } from "react";
import { World, RigidBody, ColliderDesc, RigidBodyDesc } from '@dimforge/rapier2d-compat';
import Rapier from '@dimforge/rapier2d-compat';
import Navigation from "@/components/Navigation";

export default function LiquidText() {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);

  useEffect(() => {
    const initRapier = async (): Promise<void> => {
      await Rapier.init();
      
      const gravity = new Rapier.Vector2(0, 2500);
      const world = new World(gravity);

      // Create much tighter container boundaries to keep particles in text only
      world.createCollider(ColliderDesc.cuboid(100, 2).setTranslation(150, 72)); // Ground - higher
      world.createCollider(ColliderDesc.cuboid(2, 20).setTranslation(50, 50));   // Left wall - much closer
      world.createCollider(ColliderDesc.cuboid(2, 20).setTranslation(250, 50));  // Right wall - much closer
      world.createCollider(ColliderDesc.cuboid(100, 2).setTranslation(150, 30)); // Top boundary - lower

      // Increase particle count and size for better visibility
      const liquidParticles: RigidBody[] = [];
      for (let i = 0; i < 2500; i++) {
        // Much tighter spawn area
        const x: number = Math.random() * 180 + 60;
        const y: number = Math.random() * 25 + 40;
        
        const particle = world.createRigidBody(
          RigidBodyDesc.dynamic()
            .setTranslation(x, y)
            .setLinearDamping(8.0) // Much higher damping to keep particles settled
        );
        const collider = ColliderDesc.ball(1.2).setDensity(0.5).setRestitution(0.001).setFriction(0.02);
        world.createCollider(collider, particle);
        liquidParticles.push(particle);
      }

      // Get canvas context for rendering
      const canvas = canvasRef.current;
      if (!canvas) return;
      const ctx = canvas.getContext('2d');
      if (!ctx) return;

      // Cache text mask data for better performance
      const textCanvas = document.createElement('canvas');
      textCanvas.width = 300;
      textCanvas.height = 100;
      const textCtx = textCanvas.getContext('2d')!;
      
      textCtx.clearRect(0, 0, 300, 100);
      textCtx.fillStyle = 'white';
      textCtx.font = 'bold 64px Arial';
      textCtx.textAlign = 'center';
      textCtx.fillText('LIQUID', 150, 70);
      
      // Cache the text mask data once
      const textData = textCtx.getImageData(0, 0, 300, 100);
      const textPixels = textData.data;

      // Pre-calculate constants
      const centerX = 150;
      const centerY = 50;

      const render = (): void => {
        // Clear canvas
        ctx.clearRect(0, 0, canvas.width, canvas.height);
        
        // Draw background
        ctx.fillStyle = '#1a1a2e';
        ctx.fillRect(0, 0, canvas.width, canvas.height);
        
        // Apply strong containment forces every frame to keep particles in text
        liquidParticles.forEach((particle) => {
          const pos = particle.translation();
          
          // Much tighter containment - keep particles very close to text center
          const dx = centerX - pos.x;
          const dy = centerY - pos.y;
          const distanceSquared = dx * dx + dy * dy;
          
          // Start pulling particles back much sooner
          if (distanceSquared > 2500) { // 50^2 - much tighter
            const distance = Math.sqrt(distanceSquared);
            const forceStrength = Math.min(5.0, distance * 0.15); // Stronger force
            const forceX = (dx / distance) * forceStrength;
            const forceY = (dy / distance) * forceStrength;
            particle.applyImpulse(new Rapier.Vector2(forceX, forceY), true);
          }
          
          // Very aggressive containment for particles that drift too far
          if (distanceSquared > 4900) { // 70^2
            const distance = Math.sqrt(distanceSquared);
            const emergencyForce = 10.0;
            const forceX = (dx / distance) * emergencyForce;
            const forceY = (dy / distance) * emergencyForce;
            particle.applyImpulse(new Rapier.Vector2(forceX, forceY), true);
          }
          
          // Hard boundaries - much tighter
          if (pos.x < 60 || pos.x > 240 || pos.y < 35 || pos.y > 70) {
            particle.setTranslation(new Rapier.Vector2(
              centerX + (Math.random() - 0.5) * 80,
              centerY + (Math.random() - 0.5) * 15
            ), true);
          }
        });
        
        // Render larger, more visible particles
        ctx.fillStyle = '#00AEEF';
        ctx.globalAlpha = 0.8; // Slightly more opaque for better visibility
        ctx.beginPath();

        // Draw all particles in a single path for better performance
        liquidParticles.forEach((particle) => {
          const pos = particle.translation();
          const x = Math.floor(pos.x);
          const y = Math.floor(pos.y);
          
          // Bounds check
          if (x >= 0 && x < 300 && y >= 0 && y < 100) {
            // Check if this pixel has text using cached data
            const pixelIndex = (y * 300 + x) * 4;
            const alpha = textPixels[pixelIndex + 3];
            
            // Only add to path if it's over text
            if (alpha > 128) {
              ctx.moveTo(pos.x + 1.2, pos.y);
              ctx.arc(pos.x, pos.y, 1.2, 0, Math.PI * 2); // Larger particles
            }
          }
        });
        
        // Fill all particles at once
        ctx.fill();
      };

      const step = (): void => {
        // Single physics step for better performance
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

        // Stronger mouse interaction for more dramatic effect
        liquidParticles.forEach((particle) => {
          const pos = particle.translation();
          const dx: number = pos.x - mouseX;
          const dy: number = pos.y - mouseY;
          const distanceSquared = dx * dx + dy * dy;
          
          // Larger interaction radius for better effect
          if (distanceSquared < 1600) { // 40^2
            const distance = Math.sqrt(distanceSquared);
            const normalizedDistance = Math.max(distance, 0.1);
            const forceStrength = Math.min(10000 / (normalizedDistance * normalizedDistance), 300);
            
            const forceX = (dx / distance) * forceStrength;
            const forceY = (dy / distance) * forceStrength;
            
            particle.applyImpulse(new Rapier.Vector2(forceX, forceY), true);
          }
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
    <div className="min-h-screen bg-gray-900 pt-20">
      <Navigation />
      <div className="pt-8 pb-8">
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold text-white mb-2">Rapier Physics Simulation</h1>
          <p className="text-gray-400">Move your mouse or touch the canvas to interact with the liquid particles</p>
        </div>
        <div className="flex items-center justify-center min-h-[calc(100vh-15rem)]">
          <canvas ref={canvasRef} width={300} height={100} className="border border-gray-600 rounded-lg shadow-lg" />
        </div>
      </div>
    </div>
  );
}

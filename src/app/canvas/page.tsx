'use client'

import { useEffect, useRef } from "react";
import { World, RigidBody, ColliderDesc, EventQueue, RigidBodyDesc } from '@dimforge/rapier2d-compat';
import Rapier from '@dimforge/rapier2d-compat';

export default function LiquidText() {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);

  useEffect(() => {
    const initRapier = async (): Promise<void> => {
      await Rapier.init();
      const gravity = new Rapier.Vector2(0, 9.8);
      const world = new World(gravity);

      // Create bounding walls matching the canvas size
      const walls: RigidBody[] = [
        world.createRigidBody(RigidBodyDesc.fixed().setTranslation(135, 72)), // Bottom
        world.createRigidBody(RigidBodyDesc.fixed().setTranslation(135, -2)), // Top
        world.createRigidBody(RigidBodyDesc.fixed().setTranslation(-2, 35)), // Left
        world.createRigidBody(RigidBodyDesc.fixed().setTranslation(272, 35)), // Right
      ];

      walls.forEach((wall, index) => {
        const sizes: [number, number][] = [
          [270, 6], // Bottom
          [270, 6], // Top
          [6, 70],  // Left
          [6, 70],  // Right
        ];
        const collider = ColliderDesc.cuboid(sizes[index][0] / 2, sizes[index][1] / 2);
        world.createCollider(collider, wall);
      });

      // Create liquid particles
      const liquidParticles: RigidBody[] = [];
      for (let i = 0; i < 1000; i++) {
        const x: number = Math.random() * 268 + 1;
        const y: number = Math.random() * 68 + 1;
        const particle = world.createRigidBody(
          RigidBodyDesc.dynamic().setTranslation(x, y)
        );
        const collider = ColliderDesc.ball(2.5).setDensity(0.01).setRestitution(0.002);
        world.createCollider(collider, particle);
        liquidParticles.push(particle);
      }

      const eventQueue = new EventQueue(false);

      // Get canvas context for rendering
      const canvas = canvasRef.current;
      if (!canvas) return;
      const ctx = canvas.getContext('2d');
      if (!ctx) return;

      const render = (): void => {
        // Clear canvas
        ctx.clearRect(0, 0, canvas.width, canvas.height);
        
        // Set particle style
        ctx.fillStyle = '#00AEEF';
        ctx.globalAlpha = 0.8;

        // Draw each particle
        liquidParticles.forEach((particle) => {
          const pos = particle.translation();
          ctx.beginPath();
          ctx.arc(pos.x, pos.y, 2.5, 0, Math.PI * 2);
          ctx.fill();
        });
      };

      const step = (): void => {
        world.step(eventQueue);
        render(); // Add rendering to the animation loop
        requestAnimationFrame(step);
      };
      step();

      const handleMouseMove = (event: MouseEvent): void => {
        if (!canvasRef.current) return;
        
        const rect = canvasRef.current.getBoundingClientRect();
        const mouseX: number = event.clientX - rect.left;
        const mouseY: number = event.clientY - rect.top;

        liquidParticles.forEach((particle) => {
          const pos = particle.translation();
          const dx: number = pos.x - mouseX;
          const dy: number = pos.y - mouseY;
          const distance: number = Math.sqrt(dx * dx + dy * dy);
          if (distance > 15) return;

          const force: number = Math.min(0.0008 / (distance + 1), 0.0001);
          particle.applyImpulse(new Rapier.Vector2(force * dx, force * dy), true);
        });
      };

      if (canvasRef.current) {
        canvasRef.current.addEventListener("mousemove", handleMouseMove);
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

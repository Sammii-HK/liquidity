'use client'


import { useEffect, useRef } from "react";
import Matter from "matter-js";

export default function LiquidText() {
  const canvasRef = useRef(null);

  useEffect(() => {
    const engine = Matter.Engine.create();
    const world = engine.world;
    engine.world.gravity.y = 2.5; // Increased gravity for stronger downward pull

    const render = Matter.Render.create({
      canvas: canvasRef.current,
      engine: engine,
      options: {
        width: 400,
        height: 200,
        wireframes: false,
        background: "#1a1a2e",
      },
    });

    // Create a Matter.js Runner
    const runner = Matter.Runner.create();
    Matter.Runner.run(runner, engine);

    // Create a simple rectangular box container with thicker walls to fully contain particles
    const container = [
      Matter.Bodies.rectangle(200, 195, 420, 30, { isStatic: true, restitution: 0, render: { fillStyle: "#0077CC" } }), // Bottom
      Matter.Bodies.rectangle(5, 100, 10, 220, { isStatic: true, restitution: 0, render: { fillStyle: "#0077CC" } }), // Left wall
      Matter.Bodies.rectangle(395, 100, 10, 220, { isStatic: true, restitution: 0, render: { fillStyle: "#0077CC" } }), // Right wall
    ];

    // Create even more liquid particles with a smaller size
    const liquidParticles = Array.from({ length: 1000 }).map(() =>
      Matter.Bodies.circle(
        200 + Math.random() * 80 - 40,
        80 + Math.random() * 20,
        0.8, // Even smaller particles for better fluid-like behavior
        {
          density: 0.02, // Increased density for more weight
          friction: 0.01, // Reduced friction for smoother flow
          frictionAir: 0.008, // Less air resistance to allow faster movement
          restitution: 0.002, // Minimal bounce for a more liquid-like feel
          render: { fillStyle: "#00AEEF" },
        }
      )
    );

    Matter.World.add(world, [...container, ...liquidParticles]);
    Matter.Render.run(render);

    const handleMouseMove = (event) => {
      const rect = canvasRef.current.getBoundingClientRect();
      const mouseX = event.clientX - rect.left;
      const mouseY = event.clientY - rect.top;

      liquidParticles.forEach((particle) => {
        const dx = particle.position.x - mouseX;
        const dy = particle.position.y - mouseY;
        const distance = Math.sqrt(dx * dx + dy * dy);
        if (distance > 15) return; // Reduce repelling range further

        const force = Math.min(0.0003 / (distance + 1), 0.00005); // Slightly stronger repelling force

        Matter.Body.applyForce(particle, particle.position, {
          x: force * dx,
          y: force * dy,
        });
      });
    };

    canvasRef.current.addEventListener("mousemove", handleMouseMove);
    
    return () => {
      canvasRef.current.removeEventListener("mousemove", handleMouseMove);
      Matter.Render.stop(render);
      Matter.World.clear(world);
      Matter.Engine.clear(engine);
      Matter.Runner.stop(runner);
    };
  }, []);

  return (
    <div className="flex items-center justify-center min-h-screen bg-gray-900">
      <canvas ref={canvasRef} width={400} height={200} />
    </div>
  );
}

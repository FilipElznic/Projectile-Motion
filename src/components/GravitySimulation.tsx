import { useEffect, useRef } from "react";
import { Ball } from "../classes/Ball";
import { PhysicsWorld, PhysicsBody } from "../classes/PhysicsEngine";
import { Vector2 } from "../classes/Vector2";

export const GravitySimulation = () => {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    let world: PhysicsWorld;
    let ball: Ball;
    let animationFrameId: number;

    const init = () => {
      const parent = canvas.parentElement;
      if (parent) {
        canvas.width = parent.clientWidth;
        canvas.height = parent.clientHeight;
      }

      world = new PhysicsWorld();

      // Create floor
      const floor = new PhysicsBody({
        position: new Vector2(canvas.width / 2, canvas.height - 10),
        type: "rectangle",
        width: canvas.width,
        height: 20,
        isStatic: true,
        restitution: 0.5,
        friction: 0.5,
      });
      world.addBody(floor);

      // Start high up
      ball = new Ball(canvas.width / 2, 60, 25, "#D62412");
      ball.body.restitution = 0.8; // Bouncy
      world.addBody(ball.body);
    };

    const loop = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height);

      // Step physics
      world.step(1 / 60);

      // Draw floor
      ctx.fillStyle = "#2d3748";
      ctx.fillRect(0, canvas.height - 20, canvas.width, 20);

      ball.draw(ctx);

      // Auto-reset if it stops bouncing significantly
      if (
        Math.abs(ball.body.velocity.y) < 0.5 &&
        Math.abs(ball.body.velocity.x) < 0.5 &&
        ball.body.position.y > canvas.height - ball.radius - 30
      ) {
        // Give it a random small push or reset
        // Reduced probability to let it rest longer (approx 3-4 seconds)
        if (Math.random() > 0.995) {
          ball.body.velocity.y = -15;
          ball.body.velocity.x = (Math.random() - 0.5) * 20;
          // Wake up if sleeping (not implemented yet, but good practice)
          ball.body.isStatic = false;
        }
      }

      animationFrameId = requestAnimationFrame(loop);
    };

    init();
    loop();

    const handleResize = () => init();
    window.addEventListener("resize", handleResize);
    return () => {
      cancelAnimationFrame(animationFrameId);
      window.removeEventListener("resize", handleResize);
    };
  }, []);

  return <canvas ref={canvasRef} className="w-full h-full block" />;
};

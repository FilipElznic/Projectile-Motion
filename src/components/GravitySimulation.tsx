import { useEffect, useRef } from "react";
import { Ball } from "../classes/Ball";
import { PhysicsWorld, PhysicsBody } from "../classes/PhysicsEngine";
import { Vector2 } from "../classes/Vector2";
import { GAME_GRAVITY } from "./game/GameConstants";
import { RotateCcw } from "lucide-react";

export const GravitySimulation = () => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const resetRef = useRef<() => void>(() => {});

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    let world: PhysicsWorld;
    let ball: Ball;
    let animationFrameId: number;
    const groundHeight = 32;

    const init = () => {
      const parent = canvas.parentElement;
      if (parent) {
        canvas.width = parent.clientWidth;
        canvas.height = parent.clientHeight;
      }

      world = new PhysicsWorld(new Vector2(0, GAME_GRAVITY));

      const groundY = canvas.height - groundHeight / 2;

      // Create floor collider that matches the drawn ground strip
      const floor = new PhysicsBody({
        position: new Vector2(canvas.width / 2, groundY),
        type: "rectangle",
        width: canvas.width,
        height: groundHeight,
        isStatic: true,
        restitution: 0.5,
        friction: 0.6,
      });
      world.addBody(floor);

      // Start high up
      ball = new Ball(canvas.width / 2, 60, "red");
      ball.body.restitution = 0.8; // Bouncy
      world.addBody(ball.body);
    };

    resetRef.current = init;

    const loop = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height);

      // Sky background
      const gradient = ctx.createLinearGradient(0, 0, 0, canvas.height);
      gradient.addColorStop(0, "#0e1424");
      gradient.addColorStop(1, "#1f2d47");
      ctx.fillStyle = gradient;
      ctx.fillRect(0, 0, canvas.width, canvas.height);

      // Step physics
      world.step(1 / 60);

      // Extra clamp to ensure the ball never sinks past the ground when frame dips
      const floorTop = canvas.height - groundHeight;
      if (ball.body.position.y > floorTop - ball.radius) {
        ball.body.position.y = floorTop - ball.radius;
        if (ball.body.velocity.y > 0) {
          ball.body.velocity.y *= -ball.body.restitution;
        }
      }

      // Draw floor / ground strip
      ctx.fillStyle = "#1b6b3b";
      ctx.fillRect(0, canvas.height - groundHeight, canvas.width, groundHeight);
      ctx.fillStyle = "#254b2d";
      ctx.fillRect(
        0,
        canvas.height - groundHeight / 2,
        canvas.width,
        groundHeight / 2
      );
      ctx.fillStyle = "#4c2f1e";
      ctx.fillRect(0, canvas.height - 4, canvas.width, 4);

      ball.draw(ctx);

      // Auto-reset if it stops bouncing significantly
      if (
        Math.abs(ball.body.velocity.y) < 0.5 &&
        Math.abs(ball.body.velocity.x) < 0.5 &&
        ball.body.position.y > canvas.height - groundHeight - ball.radius
      ) {
        // Give it a random small push or reset
        // Reduced probability to let it rest longer (approx 3-4 seconds)
        if (Math.random() > 0.995) {
          ball.body.velocity.y = -15;
          ball.body.velocity.x = (Math.random() - 0.5) * 20;
          // Wake up if sleeping (not implemented yet, but good practice)
          ball.body.setStatic(false);
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

  return (
    <div className="relative w-full h-full">
      <canvas ref={canvasRef} className="w-full h-full block" />
      <button
        onClick={() => resetRef.current()}
        className="absolute top-4 right-4 p-3 bg-white/10 backdrop-blur-md rounded-xl text-white hover:bg-white/20 transition-colors border border-white/20 shadow-lg group z-10"
        title="Replay Simulation"
      >
        <RotateCcw className="w-6 h-6 group-hover:-rotate-180 transition-transform duration-500" />
      </button>
    </div>
  );
};

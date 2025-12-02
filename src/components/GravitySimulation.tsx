import { useEffect, useRef } from "react";
import { Ball } from "../classes/Ball";

export const GravitySimulation = () => {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    let ball: Ball;
    let animationFrameId: number;
    const GRAVITY = 0.4;

    const init = () => {
      const parent = canvas.parentElement;
      if (parent) {
        canvas.width = parent.clientWidth;
        canvas.height = parent.clientHeight;
      }
      // Start high up
      ball = new Ball(canvas.width / 2, 60, 25, "#D62412");
      ball.isMoving = true;
    };

    const loop = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height);

      ball.update(canvas.height, GRAVITY);
      ball.draw(ctx);

      // Auto-reset if it stops bouncing significantly
      if (
        Math.abs(ball.velocity.y) < 0.5 &&
        ball.position.y > canvas.height - ball.radius - 2
      ) {
        // Give it a random small push or reset
        if (Math.random() > 0.99) {
          ball.velocity.y = -15;
          ball.velocity.x = (Math.random() - 0.5) * 10;
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

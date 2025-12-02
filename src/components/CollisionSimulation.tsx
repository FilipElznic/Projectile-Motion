import { useEffect, useRef } from "react";
import { Ball } from "../classes/Ball";
import { Vector2 } from "../classes/Vector2";

export const CollisionSimulation = () => {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    let balls: Ball[] = [];
    let animationFrameId: number;

    const init = () => {
      const parent = canvas.parentElement;
      if (parent) {
        canvas.width = parent.clientWidth;
        canvas.height = parent.clientHeight;
      }
      balls = [
        new Ball(100, 100, 30, "#D62412"),
        new Ball(canvas.width - 100, 150, 30, "#FFCE00"),
        new Ball(canvas.width / 2, 200, 20, "#ffffff"),
      ];
      balls[0].velocity = new Vector2(4, 3);
      balls[1].velocity = new Vector2(-3, 4);
      balls[2].velocity = new Vector2(1, -5);
      balls.forEach((b) => (b.isMoving = true));
    };

    const checkCollisions = () => {
      // Wall collisions
      balls.forEach((ball) => {
        if (ball.position.x - ball.radius < 0) {
          ball.position.x = ball.radius;
          ball.velocity.x *= -1;
        }
        if (ball.position.x + ball.radius > canvas.width) {
          ball.position.x = canvas.width - ball.radius;
          ball.velocity.x *= -1;
        }
        if (ball.position.y - ball.radius < 0) {
          ball.position.y = ball.radius;
          ball.velocity.y *= -1;
        }
        if (ball.position.y + ball.radius > canvas.height) {
          ball.position.y = canvas.height - ball.radius;
          ball.velocity.y *= -1;
        }
      });

      // Ball-Ball collision
      for (let i = 0; i < balls.length; i++) {
        for (let j = i + 1; j < balls.length; j++) {
          const b1 = balls[i];
          const b2 = balls[j];
          const dist = Vector2.dist(b1.position, b2.position);

          if (dist < b1.radius + b2.radius) {
            // Simple elastic collision response
            // Swap velocities (approximate for equal mass)
            const temp = b1.velocity.copy();
            b1.velocity = b2.velocity.copy();
            b2.velocity = temp;

            // Separate them to prevent sticking
            const overlap = (b1.radius + b2.radius - dist) / 2;
            const direction = Vector2.sub(b2.position, b1.position).normalize();

            // Move both apart
            b1.position.sub(Vector2.mult(direction, overlap));
            b2.position.add(Vector2.mult(direction, overlap));
          }
        }
      }
    };

    const loop = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height);

      checkCollisions();

      balls.forEach((ball) => {
        // Update position manually since Ball.update has gravity and floor logic we might not want here
        // Or we can use Ball.update with 0 gravity if we want floor bounce
        // Let's use manual update for zero-gravity collision demo
        ball.position.add(ball.velocity);
        ball.draw(ctx);
      });

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

import { useEffect, useRef } from "react";
import { Ball } from "../classes/Ball";
import { Vector2 } from "../classes/Vector2";
import { PhysicsWorld, PhysicsBody } from "../classes/PhysicsEngine";

export const CollisionSimulation = () => {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    let world: PhysicsWorld;
    let balls: Ball[] = [];
    let animationFrameId: number;

    const init = () => {
      const parent = canvas.parentElement;
      if (parent) {
        canvas.width = parent.clientWidth;
        canvas.height = parent.clientHeight;
      }

      world = new PhysicsWorld();
      world.gravity.set(0, 0); // Zero gravity for this demo

      // Create walls
      const wallThickness = 100;
      const walls = [
        // Top
        new PhysicsBody({
          position: new Vector2(canvas.width / 2, -wallThickness / 2),
          type: "rectangle",
          width: canvas.width,
          height: wallThickness,
          isStatic: true,
          restitution: 1,
          friction: 0,
        }),
        // Bottom
        new PhysicsBody({
          position: new Vector2(
            canvas.width / 2,
            canvas.height + wallThickness / 2
          ),
          type: "rectangle",
          width: canvas.width,
          height: wallThickness,
          isStatic: true,
          restitution: 1,
          friction: 0,
        }),
        // Left
        new PhysicsBody({
          position: new Vector2(-wallThickness / 2, canvas.height / 2),
          type: "rectangle",
          width: wallThickness,
          height: canvas.height,
          isStatic: true,
          restitution: 1,
          friction: 0,
        }),
        // Right
        new PhysicsBody({
          position: new Vector2(
            canvas.width + wallThickness / 2,
            canvas.height / 2
          ),
          type: "rectangle",
          width: wallThickness,
          height: canvas.height,
          isStatic: true,
          restitution: 1,
          friction: 0,
        }),
      ];
      walls.forEach((w) => world.addBody(w));

      balls = [
        new Ball(100, 100, 30, "#D62412"),
        new Ball(canvas.width - 100, 150, 30, "#FFCE00"),
        new Ball(canvas.width / 2, 200, 20, "#ffffff"),
      ];

      // Setup balls
      balls[0].body.velocity = new Vector2(400, 300); // Pixels per second approx
      balls[0].body.restitution = 1;
      balls[0].body.friction = 0;

      balls[1].body.velocity = new Vector2(-300, 400);
      balls[1].body.restitution = 1;
      balls[1].body.friction = 0;

      balls[2].body.velocity = new Vector2(100, -500);
      balls[2].body.restitution = 1;
      balls[2].body.friction = 0;

      balls.forEach((b) => world.addBody(b.body));
    };

    const loop = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height);

      world.step(1 / 60);

      balls.forEach((ball) => {
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

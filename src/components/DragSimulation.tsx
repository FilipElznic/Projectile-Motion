import { useEffect, useRef } from "react";
import { Ball } from "../classes/Ball";
import { Vector2 } from "../classes/Vector2";
import { PhysicsWorld, PhysicsBody } from "../classes/PhysicsEngine";

export const DragSimulation = () => {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    // Physics constants
    const LAUNCH_POWER = 0.15;
    const MAX_DRAG_DISTANCE = 150;

    // State
    let world: PhysicsWorld;
    let ball: Ball;
    let isDragging = false;
    let startPos: Vector2;
    let animationFrameId: number;

    // Initialize
    const init = () => {
      // Set canvas size to parent container
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

      // Set starting position
      startPos = new Vector2(150, canvas.height - 150);

      // Initialize ball
      ball = new Ball(startPos.x, startPos.y, 20, "#ffffff");
      ball.body.isStatic = true; // Start static
      world.addBody(ball.body);
    };

    // Game Loop
    const loop = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height);

      world.step(1 / 60);

      // Draw floor
      ctx.fillStyle = "#2d3748";
      ctx.fillRect(0, canvas.height - 20, canvas.width, 20);

      // Draw slingshot
      if (isDragging) {
        ctx.save();
        ctx.strokeStyle = "rgba(255, 255, 255, 0.5)";
        ctx.lineWidth = 3;
        ctx.setLineDash([5, 5]);
        ctx.beginPath();
        ctx.moveTo(startPos.x, startPos.y);
        ctx.lineTo(ball.body.position.x, ball.body.position.y);
        ctx.stroke();
        ctx.restore();
      }

      // Draw Ball
      ball.draw(ctx);

      // Reset if out of bounds
      if (
        ball.body.position.x > canvas.width + 50 ||
        ball.body.position.y > canvas.height + 50
      ) {
        // Reset
        ball.body.position = startPos.copy();
        ball.body.velocity.set(0, 0);
        ball.body.angularVelocity = 0;
        ball.body.angle = 0;
        ball.body.isStatic = true;
      }

      animationFrameId = requestAnimationFrame(loop);
    };

    // Event Handlers
    const handleMouseDown = (e: MouseEvent) => {
      const rect = canvas.getBoundingClientRect();
      const mousePos = new Vector2(e.clientX - rect.left, e.clientY - rect.top);
      const distance = Vector2.dist(mousePos, ball.body.position);

      if (distance <= ball.radius + 40) {
        // Increased hit area
        isDragging = true;
        ball.body.isStatic = true; // Make static while dragging
        ball.body.velocity.set(0, 0);
      }
    };

    const handleMouseMove = (e: MouseEvent) => {
      if (isDragging) {
        const rect = canvas.getBoundingClientRect();
        const mousePos = new Vector2(
          e.clientX - rect.left,
          e.clientY - rect.top
        );
        const dragVector = Vector2.sub(mousePos, startPos);

        if (dragVector.mag() > MAX_DRAG_DISTANCE) {
          dragVector.setMag(MAX_DRAG_DISTANCE);
        }

        ball.body.position = Vector2.add(startPos, dragVector);
      }
    };

    const handleMouseUp = () => {
      if (isDragging) {
        isDragging = false;
        ball.body.isStatic = false; // Wake up

        const force = Vector2.sub(startPos, ball.body.position);
        const impulse = Vector2.mult(force, LAUNCH_POWER * ball.body.mass);
        ball.body.applyImpulse(impulse);
      }
    };

    init();
    loop();

    canvas.addEventListener("mousedown", handleMouseDown);
    window.addEventListener("mousemove", handleMouseMove);
    window.addEventListener("mouseup", handleMouseUp);

    const handleResize = () => init();
    window.addEventListener("resize", handleResize);

    return () => {
      cancelAnimationFrame(animationFrameId);
      canvas.removeEventListener("mousedown", handleMouseDown);
      window.removeEventListener("mousemove", handleMouseMove);
      window.removeEventListener("mouseup", handleMouseUp);
      window.removeEventListener("resize", handleResize);
    };
  }, []);

  return <canvas ref={canvasRef} className="w-full h-full block" />;
};

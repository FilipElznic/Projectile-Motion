import { useEffect, useRef } from "react";
import { Ball } from "../classes/Ball";
import { Vector2 } from "../classes/Vector2";

export const DragSimulation = () => {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    // Physics constants
    const GRAVITY = 0.3;
    const LAUNCH_POWER = 0.12;
    const MAX_DRAG_DISTANCE = 150;

    // State
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

      // Set starting position
      startPos = new Vector2(150, canvas.height - 150);

      // Initialize ball
      ball = new Ball(startPos.x, startPos.y, 20, "#ffffff");
      ball.isMoving = false;
    };

    // Game Loop
    const loop = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height);

      // Draw slingshot
      if (isDragging) {
        ctx.save();
        ctx.strokeStyle = "rgba(255, 255, 255, 0.5)";
        ctx.lineWidth = 3;
        ctx.setLineDash([5, 5]);
        ctx.beginPath();
        ctx.moveTo(startPos.x, startPos.y);
        ctx.lineTo(ball.position.x, ball.position.y);
        ctx.stroke();
        ctx.restore();
      }

      // Update and Draw Ball
      ball.update(canvas.height, GRAVITY);
      ball.draw(ctx);

      animationFrameId = requestAnimationFrame(loop);
    };

    // Event Handlers
    const handleMouseDown = (e: MouseEvent) => {
      const rect = canvas.getBoundingClientRect();
      const mousePos = new Vector2(e.clientX - rect.left, e.clientY - rect.top);
      const distance = Vector2.dist(mousePos, ball.position);

      if (distance <= ball.radius + 10) {
        isDragging = true;
        ball.isMoving = false;
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

        ball.position = Vector2.add(startPos, dragVector);
      }
    };

    const handleMouseUp = () => {
      if (isDragging) {
        isDragging = false;
        ball.isMoving = true;
        const force = Vector2.sub(startPos, ball.position);
        force.mult(LAUNCH_POWER);
        ball.velocity = force;
      }
    };

    const handleResize = () => {
      init();
    };

    // Setup
    init();
    loop();

    // Listeners
    canvas.addEventListener("mousedown", handleMouseDown);
    window.addEventListener("mousemove", handleMouseMove);
    window.addEventListener("mouseup", handleMouseUp);
    window.addEventListener("resize", handleResize);

    // Cleanup
    return () => {
      cancelAnimationFrame(animationFrameId);
      canvas.removeEventListener("mousedown", handleMouseDown);
      window.removeEventListener("mousemove", handleMouseMove);
      window.removeEventListener("mouseup", handleMouseUp);
      window.removeEventListener("resize", handleResize);
    };
  }, []);

  return (
    <canvas ref={canvasRef} className="w-full h-full block cursor-crosshair" />
  );
};

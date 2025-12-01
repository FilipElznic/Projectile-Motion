import "./index.css";
import { Ball } from "./classes/Ball";
import { Vector2 } from "./classes/Vector2";

// Get canvas element and 2D context
const canvas = document.getElementById("sim-canvas") as HTMLCanvasElement;
const ctx = canvas.getContext("2d")!;

if (!ctx) {
  throw new Error("Failed to get 2D context");
}

// Physics constants
const GRAVITY = 0.3;
const LAUNCH_POWER = 0.12;
const MAX_DRAG_DISTANCE = 150;

// Ball instance
let ball: Ball;

// Slingshot state
let isDragging: boolean = false;
let startPos: Vector2;

/**
 * Resize canvas to match window dimensions
 */
function resize(): void {
  canvas.width = window.innerWidth;
  canvas.height = window.innerHeight;

  // Set starting position (bottom-left area)
  startPos = new Vector2(150, canvas.height - 150);

  // Reinitialize ball at start position
  ball = new Ball(startPos.x, startPos.y, 20, "#ffffff");
  ball.isMoving = false;
}

/**
 * Main game loop
 */
function loop(): void {
  // Clear the canvas
  ctx.clearRect(0, 0, canvas.width, canvas.height);

  // Draw slingshot line if dragging
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

  // Update ball physics
  ball.update(canvas.height, GRAVITY);

  // Draw ball
  ball.draw(ctx);

  // Continue the loop
  requestAnimationFrame(loop);
}

// Initialize
resize();
window.addEventListener("resize", resize);

// Mouse event handlers
canvas.addEventListener("mousedown", (e: MouseEvent) => {
  const mousePos = new Vector2(e.clientX, e.clientY);
  const distance = Vector2.dist(mousePos, ball.position);

  // Check if mouse is close to the ball
  if (distance <= ball.radius + 10) {
    isDragging = true;
    ball.isMoving = false;
  }
});

canvas.addEventListener("mousemove", (e: MouseEvent) => {
  if (isDragging) {
    const mousePos = new Vector2(e.clientX, e.clientY);

    // Calculate drag vector from start position
    const dragVector = Vector2.sub(mousePos, startPos);

    // Limit the drag distance
    if (dragVector.mag() > MAX_DRAG_DISTANCE) {
      dragVector.setMag(MAX_DRAG_DISTANCE);
    }

    // Update ball position
    ball.position = Vector2.add(startPos, dragVector);
  }
});

canvas.addEventListener("mouseup", () => {
  if (isDragging) {
    isDragging = false;
    ball.isMoving = true;

    // Calculate launch velocity (opposite of drag direction)
    const force = Vector2.sub(startPos, ball.position);
    force.mult(LAUNCH_POWER);

    // Set ball velocity
    ball.velocity = force;
  }
});

// Start the game loop
loop();

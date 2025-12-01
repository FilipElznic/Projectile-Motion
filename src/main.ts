import "./index.css";
import { Ball } from "./classes/Ball";

// Get canvas element and 2D context
const canvas = document.getElementById("sim-canvas") as HTMLCanvasElement;
const ctx = canvas.getContext("2d")!;

if (!ctx) {
  throw new Error("Failed to get 2D context");
}

// Physics constants
const GRAVITY = 0.5;

// Ball instance
let ball: Ball;

/**
 * Resize canvas to match window dimensions
 */
function resize(): void {
  canvas.width = window.innerWidth;
  canvas.height = window.innerHeight;

  // Reinitialize ball at center after resize
  ball = new Ball(canvas.width / 2, canvas.height / 2, 20, "#ffffff");
}

/**
 * Main game loop
 */
function loop(): void {
  // Clear the canvas
  ctx.clearRect(0, 0, canvas.width, canvas.height);

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

// Start the game loop
loop();

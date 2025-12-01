import { Vector2 } from "./Vector2";

/**
 * Ball - Represents a projectile in the simulation
 * Uses Euler integration for physics calculations
 */
export class Ball {
  /**
   * Current position of the ball
   */
  public position: Vector2;

  /**
   * Current velocity of the ball
   */
  public velocity: Vector2;

  /**
   * Current acceleration of the ball
   */
  public acceleration: Vector2;

  /**
   * Radius of the ball in pixels
   */
  public radius: number;

  /**
   * Color of the ball (CSS color string)
   */
  public color: string;

  /**
   * Creates a new Ball instance
   * @param x - Initial x position
   * @param y - Initial y position
   * @param radius - Radius of the ball in pixels
   * @param color - Color of the ball (CSS color string)
   */
  constructor(x: number, y: number, radius: number, color: string) {
    this.position = new Vector2(x, y);
    this.velocity = new Vector2(0, 0);
    this.acceleration = new Vector2(0, 0);
    this.radius = radius;
    this.color = color;
  }

  /**
   * Applies a force to the ball
   * F = ma, so a = F/m (assuming mass = 1 for simplicity)
   * @param force - The force vector to apply
   */
  applyForce(force: Vector2): void {
    // Create a copy to avoid mutating the input
    const f = force.copy();
    this.acceleration.add(f);
  }

  /**
   * Updates the ball's physics using Euler integration
   * This should be called once per frame
   * @param canvasHeight - Height of the canvas for floor collision detection
   * @param gravity - Gravity acceleration value
   */
  update(canvasHeight: number, gravity: number): void {
    // Apply gravity to vertical velocity
    this.velocity.y += gravity;

    // Apply velocity to position
    this.position.add(this.velocity);

    // Floor collision detection
    if (this.position.y + this.radius >= canvasHeight) {
      // Snap position to floor (prevent sinking)
      this.position.y = canvasHeight - this.radius;

      // Reverse vertical velocity (bounce)
      this.velocity.y *= -1;

      // Apply restitution (energy loss) - ball bounces lower each time
      this.velocity.y *= 0.7;
    }

    // Reset acceleration to zero for the next frame
    this.acceleration.mult(0);
  }

  /**
   * Draws the ball on the canvas
   * @param ctx - The canvas rendering context
   */
  draw(ctx: CanvasRenderingContext2D): void {
    ctx.save();

    // Set fill color
    ctx.fillStyle = this.color;

    // Draw circle
    ctx.beginPath();
    ctx.arc(this.position.x, this.position.y, this.radius, 0, Math.PI * 2);
    ctx.fill();

    // Optional: Add a subtle border for better visibility
    ctx.strokeStyle = "rgba(0, 0, 0, 0.2)";
    ctx.lineWidth = 1;
    ctx.stroke();

    ctx.restore();
  }

  /**
   * Resets the ball to a new position with zero velocity and acceleration
   * @param x - New x position
   * @param y - New y position
   */
  reset(x: number, y: number): void {
    this.position.set(x, y);
    this.velocity.set(0, 0);
    this.acceleration.set(0, 0);
  }

  /**
   * Sets the initial velocity of the ball
   * @param vx - Velocity in x direction
   * @param vy - Velocity in y direction
   */
  setVelocity(vx: number, vy: number): void {
    this.velocity.set(vx, vy);
  }

  /**
   * Checks if the ball is within canvas bounds
   * @param width - Canvas width
   * @param height - Canvas height
   * @returns True if the ball is within bounds
   */
  isInBounds(width: number, height: number): boolean {
    return (
      this.position.x - this.radius >= 0 &&
      this.position.x + this.radius <= width &&
      this.position.y - this.radius >= 0 &&
      this.position.y + this.radius <= height
    );
  }

  /**
   * Creates a copy of this ball
   * @returns A new Ball instance with the same properties
   */
  copy(): Ball {
    const ball = new Ball(
      this.position.x,
      this.position.y,
      this.radius,
      this.color
    );
    ball.velocity = this.velocity.copy();
    ball.acceleration = this.acceleration.copy();
    return ball;
  }

  /**
   * Gets the current speed (magnitude of velocity)
   * @returns The speed in pixels per frame
   */
  getSpeed(): number {
    return this.velocity.mag();
  }

  /**
   * Gets the current direction of movement in radians
   * @returns The angle in radians
   */
  getDirection(): number {
    return this.velocity.heading();
  }
}

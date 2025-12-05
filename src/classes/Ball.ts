import { Vector2 } from "./Vector2";
import { PhysicsBody } from "./PhysicsEngine";
import { type BirdType, BIRD_CONFIGS } from "../types/BirdTypes";

/**
 * Ball - Represents a projectile in the simulation
 * Wraps a PhysicsBody
 */
export class Ball {
  public body: PhysicsBody;
  public radius: number;
  public color: string;
  public isMoving: boolean = false; // Logic state, physics state is in body
  public birdType: BirdType;

  constructor(x: number, y: number, birdType: BirdType = "red") {
    this.birdType = birdType;
    const config = BIRD_CONFIGS[birdType];

    this.radius = config.radius;
    this.color = config.color;

    this.body = new PhysicsBody({
      position: new Vector2(x, y),
      type: "circle",
      radius: config.radius,
      mass: config.mass,
      restitution: 0.6,
      friction: 0.5,
    });
    this.body.userData = { type: "bird", birdType };
  }

  draw(ctx: CanvasRenderingContext2D) {
    ctx.beginPath();
    ctx.arc(
      this.body.position.x,
      this.body.position.y,
      this.radius,
      0,
      Math.PI * 2
    );
    ctx.fillStyle = this.color;
    ctx.fill();
    ctx.strokeStyle = "#333";
    ctx.lineWidth = 2;
    ctx.stroke();
    ctx.closePath();

    // Draw "face" to see rotation
    const pos = this.body.position;
    const angle = this.body.angle;

    ctx.save();
    ctx.translate(pos.x, pos.y);
    ctx.rotate(angle);

    // Eye
    ctx.fillStyle = "white";
    ctx.beginPath();
    ctx.arc(
      this.radius * 0.4,
      -this.radius * 0.3,
      this.radius * 0.3,
      0,
      Math.PI * 2
    );
    ctx.fill();

    ctx.fillStyle = "black";
    ctx.beginPath();
    ctx.arc(
      this.radius * 0.5,
      -this.radius * 0.3,
      this.radius * 0.1,
      0,
      Math.PI * 2
    );
    ctx.fill();

    // Beak
    ctx.fillStyle = "#FFC107";
    ctx.beginPath();
    ctx.moveTo(this.radius * 0.4, 0);
    ctx.lineTo(this.radius * 1.2, this.radius * 0.2);
    ctx.lineTo(this.radius * 0.4, this.radius * 0.4);
    ctx.fill();

    ctx.restore();
  }
}

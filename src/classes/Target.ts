import { Vector2 } from "./Vector2";
import { PhysicsBody } from "./PhysicsEngine";

export type TargetType = "wood" | "stone" | "ice" | "pig";

export class Target {
  public body: PhysicsBody;
  public width: number;
  public height: number;
  public type: TargetType;
  public isHit: boolean = false;
  public health: number;
  public maxHealth: number;

  constructor(
    x: number,
    y: number,
    width: number,
    height: number,
    type: TargetType
  ) {
    this.width = width;
    this.height = height;
    this.type = type;

    let mass = 1;
    let health = 10;
    let restitution = 0.2;
    let friction = 0.8;

    // Set properties based on type
    switch (type) {
      case "stone":
        mass = 10;
        health = 100;
        restitution = 0.0;
        friction = 0.9;

        break;
      case "wood":
        mass = 2;
        health = 40;
        restitution = 0.0;
        friction = 0.8;

        break;
      case "ice":
        mass = 1;
        health = 15;
        restitution = 0.0;
        friction = 0.1;

        break;
      case "pig":
        mass = 1.5;
        health = 5;
        friction = 0.7;

        break;
    }

    this.maxHealth = health;
    this.health = health;

    // Use slightly smaller hitbox for rendering to avoid visual overlap issues
    // Pigs have ears/decorations that stick out, so reduce hitbox by 10%
    const hitboxScale = type === "pig" ? 0.85 : 0.95;
    const hitboxWidth = width * hitboxScale;
    const hitboxHeight = height * hitboxScale;

    this.body = new PhysicsBody({
      position: new Vector2(x + width / 2, y + height / 2), // Physics body is centered
      type: "rectangle",
      width: hitboxWidth,
      height: hitboxHeight,
      mass: mass,
      restitution: restitution,
      friction: friction,
      isStatic: false, // Targets are dynamic, gravity controlled by game state
    });
    this.body.userData = { type: "target", parent: this };
  }

  getScore(): number {
    switch (this.type) {
      case "pig":
        return 5000;
      case "wood":
        return 500;
      case "stone":
        return 1000;
      case "ice":
        return 500;
      default:
        return 100;
    }
  }

  draw(ctx: CanvasRenderingContext2D) {
    if (this.isHit) return;

    const pos = this.body.position;
    const angle = this.body.angle;

    ctx.save();
    ctx.translate(pos.x, pos.y);
    ctx.rotate(angle);

    // Draw centered rect - use physics body size for accurate rendering
    const w = this.body.width;
    const h = this.body.height;

    // Damage overlay
    const damageRatio = 1 - this.health / this.maxHealth;

    switch (this.type) {
      case "wood":
        // Wood: Brown with a border and a "plank" look
        ctx.fillStyle = "#8D6E63";
        ctx.fillRect(-w / 2, -h / 2, w, h);

        ctx.strokeStyle = "#5D4037";
        ctx.lineWidth = 3;
        ctx.strokeRect(-w / 2, -h / 2, w, h);

        // Inner border for plank look
        ctx.strokeRect(-w / 2 + 5, -h / 2 + 5, w - 10, h - 10);
        break;

      case "stone":
        // Stone: Grey with a slightly rough texture or border
        ctx.fillStyle = "#9E9E9E";
        ctx.fillRect(-w / 2, -h / 2, w, h);

        ctx.strokeStyle = "#616161";
        ctx.lineWidth = 3;
        ctx.strokeRect(-w / 2, -h / 2, w, h);

        // Rough texture details
        ctx.fillStyle = "#757575";
        ctx.beginPath();
        ctx.arc(-w / 4, -h / 4, 3, 0, Math.PI * 2);
        ctx.arc(w / 4, h / 4, 4, 0, Math.PI * 2);
        ctx.arc(w / 6, -h / 6, 2, 0, Math.PI * 2);
        ctx.fill();
        break;

      case "ice":
        // Glass: Light blue/transparent with a white reflection streak
        ctx.fillStyle = "rgba(179, 229, 252, 0.9)";
        ctx.fillRect(-w / 2, -h / 2, w, h);

        ctx.strokeStyle = "#4FC3F7";
        ctx.lineWidth = 2;
        ctx.strokeRect(-w / 2, -h / 2, w, h);

        // Reflection streak
        ctx.fillStyle = "rgba(255, 255, 255, 0.5)";
        ctx.beginPath();
        ctx.moveTo(-w / 2 + 5, -h / 2 + 5);
        ctx.lineTo(0, -h / 2 + 5);
        ctx.lineTo(-w / 2 + 5, 0);
        ctx.fill();
        break;

      case "pig":
        // Pig body
        ctx.fillStyle = "#8BC34A";
        ctx.fillRect(-w / 2, -h / 2, w, h);
        ctx.strokeStyle = "#33691E";
        ctx.lineWidth = 2;
        ctx.strokeRect(-w / 2, -h / 2, w, h);

        // Draw pig face
        ctx.fillStyle = "#4CAF50"; // Snout
        ctx.beginPath();
        ctx.ellipse(0, 0, w / 3, h / 4, 0, 0, Math.PI * 2);
        ctx.fill();

        ctx.fillStyle = "black"; // Nostrils
        ctx.beginPath();
        ctx.arc(-w / 6, 0, w / 10, 0, Math.PI * 2);
        ctx.arc(w / 6, 0, w / 10, 0, Math.PI * 2);
        ctx.fill();

        // Eyes
        ctx.fillStyle = "white";
        ctx.beginPath();
        ctx.arc(-w / 4, -h / 4, w / 8, 0, Math.PI * 2);
        ctx.arc(w / 4, -h / 4, w / 8, 0, Math.PI * 2);
        ctx.fill();

        ctx.fillStyle = "black";
        ctx.beginPath();
        ctx.arc(-w / 4, -h / 4, w / 16, 0, Math.PI * 2);
        ctx.arc(w / 4, -h / 4, w / 16, 0, Math.PI * 2);
        ctx.fill();
        break;
    }

    // Cracks
    if (damageRatio > 0.3) {
      ctx.beginPath();
      ctx.moveTo(-w / 4, -h / 4);
      ctx.lineTo(0, 0);
      ctx.lineTo(w / 4, -h / 4);
      ctx.strokeStyle = "rgba(0,0,0,0.3)";
      ctx.lineWidth = 2;
      ctx.stroke();
    }

    ctx.restore();
  }
}

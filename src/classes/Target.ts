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
    let friction = 0.5;

    // Set properties based on type
    switch (type) {
      case "stone":
        mass = 10;
        health = 100;
        restitution = 0.1;
        friction = 0.8;
        break;
      case "wood":
        mass = 2;
        health = 40;
        restitution = 0.2;
        friction = 0.6;
        break;
      case "ice":
        mass = 1;
        health = 15;
        restitution = 0.1;
        friction = 0.1;
        break;
      case "pig":
        mass = 1.5;
        health = 5;
        restitution = 0.5;
        break;
    }

    this.maxHealth = health;
    this.health = health;

    this.body = new PhysicsBody({
      position: new Vector2(x + width / 2, y + height / 2), // Physics body is centered
      type: "rectangle",
      width: width,
      height: height,
      mass: mass,
      restitution: restitution,
      friction: friction,
      isStatic: false, // Targets are dynamic
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

    // Draw centered rect
    const w = this.width;
    const h = this.height;

    // Color based on type and damage
    let color = "#8D6E63"; // Wood default
    let strokeColor = "#5D4037";

    switch (this.type) {
      case "stone":
        color = "#9E9E9E";
        strokeColor = "#616161";
        break;
      case "wood":
        color = "#A1887F";
        strokeColor = "#5D4037";
        break;
      case "ice":
        color = "#B3E5FC";
        strokeColor = "#4FC3F7";
        break;
      case "pig":
        color = "#8BC34A";
        strokeColor = "#33691E";
        break;
    }

    // Damage overlay
    const damageRatio = 1 - this.health / this.maxHealth;

    ctx.fillStyle = color;
    ctx.fillRect(-w / 2, -h / 2, w, h);
    ctx.strokeStyle = strokeColor;
    ctx.lineWidth = 2;
    ctx.strokeRect(-w / 2, -h / 2, w, h);

    // Cracks
    if (damageRatio > 0.3) {
      ctx.beginPath();
      ctx.moveTo(-w / 4, -h / 4);
      ctx.lineTo(0, 0);
      ctx.lineTo(w / 4, -h / 4);
      ctx.strokeStyle = "rgba(0,0,0,0.3)";
      ctx.stroke();
    }

    if (this.type === "pig") {
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
    }

    ctx.restore();
  }
}

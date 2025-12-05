import { Vector2 } from "./Vector2";
import { PhysicsBody } from "./PhysicsEngine";

export type TargetType = "wood" | "stone" | "ice" | "pig";

export type DamageState = "pristine" | "cracked" | "damaged" | "breaking";

export class Target {
  public body: PhysicsBody;
  public width: number;
  public height: number;
  public type: TargetType;
  public isHit: boolean = false;
  public health: number;
  public maxHealth: number;
  public canSplit: boolean = true; // Can this block split?
  public minSplitSize: number = 20; // Minimum size for splitting
  public damageState: DamageState = "pristine";

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

    switch (this.type) {
      case "wood":
        // Wood: Brown with a border and a "plank" look
        // Base wood color
        ctx.fillStyle = "#A0826D";
        ctx.fillRect(-w / 2, -h / 2, w, h);

        // Dark brown border
        ctx.strokeStyle = "#5D4037";
        ctx.lineWidth = 4;
        ctx.strokeRect(-w / 2, -h / 2, w, h);

        // Wood grain lines for plank look
        ctx.strokeStyle = "#8D6E63";
        ctx.lineWidth = 2;
        for (let i = 0; i < 3; i++) {
          const y = -h / 2 + (i + 1) * (h / 4);
          ctx.beginPath();
          ctx.moveTo(-w / 2 + 5, y);
          ctx.lineTo(w / 2 - 5, y);
          ctx.stroke();
        }

        // Inner border highlight
        ctx.strokeStyle = "#BCAAA4";
        ctx.lineWidth = 1;
        ctx.strokeRect(-w / 2 + 3, -h / 2 + 3, w - 6, h - 6);
        break;

      case "stone":
        // Stone: Grey with a slightly rough texture or border
        // Base stone color
        ctx.fillStyle = "#9E9E9E";
        ctx.fillRect(-w / 2, -h / 2, w, h);

        // Dark grey border
        ctx.strokeStyle = "#424242";
        ctx.lineWidth = 4;
        ctx.strokeRect(-w / 2, -h / 2, w, h);

        // Rough texture details (random-looking spots)
        ctx.fillStyle = "#757575";
        ctx.beginPath();
        ctx.arc(-w / 4, -h / 4, 4, 0, Math.PI * 2);
        ctx.arc(w / 4, h / 4, 5, 0, Math.PI * 2);
        ctx.arc(w / 6, -h / 6, 3, 0, Math.PI * 2);
        ctx.arc(-w / 6, h / 6, 3, 0, Math.PI * 2);
        ctx.fill();

        // Light spots for stone texture
        ctx.fillStyle = "#BDBDBD";
        ctx.beginPath();
        ctx.arc(w / 3, 0, 3, 0, Math.PI * 2);
        ctx.arc(-w / 3, h / 5, 2, 0, Math.PI * 2);
        ctx.fill();
        break;

      case "ice":
        // Glass: Light blue/transparent with a white reflection streak
        // Semi-transparent light blue base
        ctx.fillStyle = "rgba(179, 229, 252, 0.8)";
        ctx.fillRect(-w / 2, -h / 2, w, h);

        // Light blue border
        ctx.strokeStyle = "rgba(79, 195, 247, 0.9)";
        ctx.lineWidth = 3;
        ctx.strokeRect(-w / 2, -h / 2, w, h);

        // White reflection streak (top-left diagonal)
        ctx.fillStyle = "rgba(255, 255, 255, 0.6)";
        ctx.beginPath();
        ctx.moveTo(-w / 2 + 5, -h / 2 + 5);
        ctx.lineTo(-w / 4, -h / 2 + 5);
        ctx.lineTo(-w / 2 + 5, -h / 4);
        ctx.closePath();
        ctx.fill();

        // Secondary smaller reflection
        ctx.fillStyle = "rgba(255, 255, 255, 0.4)";
        ctx.beginPath();
        ctx.moveTo(w / 4, h / 4);
        ctx.lineTo(w / 2 - 5, h / 4);
        ctx.lineTo(w / 4, h / 2 - 5);
        ctx.closePath();
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

    // Cracks based on damage state
    if (this.damageState === "cracked") {
      ctx.beginPath();
      ctx.moveTo(-w / 4, -h / 4);
      ctx.lineTo(0, 0);
      ctx.lineTo(w / 4, -h / 4);
      ctx.strokeStyle = "rgba(0,0,0,0.3)";
      ctx.lineWidth = 2;
      ctx.stroke();
    } else if (this.damageState === "damaged") {
      // Multiple cracks
      ctx.strokeStyle = "rgba(0,0,0,0.4)";
      ctx.lineWidth = 2;
      ctx.beginPath();
      ctx.moveTo(-w / 2, 0);
      ctx.lineTo(w / 2, 0);
      ctx.moveTo(0, -h / 2);
      ctx.lineTo(0, h / 2);
      ctx.stroke();

      // Diagonal cracks
      ctx.beginPath();
      ctx.moveTo(-w / 3, -h / 3);
      ctx.lineTo(w / 3, h / 3);
      ctx.moveTo(w / 3, -h / 3);
      ctx.lineTo(-w / 3, h / 3);
      ctx.strokeStyle = "rgba(0,0,0,0.3)";
      ctx.lineWidth = 1;
      ctx.stroke();
    } else if (this.damageState === "breaking") {
      // Visible break lines
      ctx.strokeStyle = "rgba(0,0,0,0.6)";
      ctx.lineWidth = 3;
      ctx.beginPath();
      ctx.moveTo(-w / 2, 0);
      ctx.lineTo(w / 2, 0);
      ctx.moveTo(0, -h / 2);
      ctx.lineTo(0, h / 2);
      ctx.stroke();
    }

    ctx.restore();
  }

  updateDamageState() {
    const healthPercent = this.health / this.maxHealth;

    if (healthPercent > 0.7) {
      this.damageState = "pristine";
    } else if (healthPercent > 0.4) {
      this.damageState = "cracked";
    } else if (healthPercent > 0.15) {
      this.damageState = "damaged";
    } else {
      this.damageState = "breaking";
    }
  }

  shouldSplit(): boolean {
    // Split if in breaking state, can split, and is large enough
    return (
      this.damageState === "breaking" &&
      this.canSplit &&
      this.type !== "pig" &&
      (this.width >= this.minSplitSize * 2 ||
        this.height >= this.minSplitSize * 2)
    );
  }

  createSplitPieces(): Target[] {
    const pieces: Target[] = [];
    const pos = this.body.position;

    // Determine split direction based on dimensions
    const splitVertically = this.width >= this.height;

    if (splitVertically && this.width >= this.minSplitSize * 2) {
      // Split into left and right pieces
      const pieceWidth = this.width / 2;

      const leftPiece = new Target(
        pos.x - pieceWidth / 2 - this.width / 4,
        pos.y - this.height / 2,
        pieceWidth,
        this.height,
        this.type
      );

      const rightPiece = new Target(
        pos.x + pieceWidth / 2 - this.width / 4,
        pos.y - this.height / 2,
        pieceWidth,
        this.height,
        this.type
      );

      // Inherit some properties
      leftPiece.health = this.health * 0.6;
      rightPiece.health = this.health * 0.6;
      leftPiece.maxHealth = this.maxHealth * 0.5;
      rightPiece.maxHealth = this.maxHealth * 0.5;
      leftPiece.canSplit = pieceWidth >= this.minSplitSize * 2;
      rightPiece.canSplit = pieceWidth >= this.minSplitSize * 2;

      // Apply some velocity from the split
      const splitForce = 50;
      leftPiece.body.velocity.x = -splitForce;
      rightPiece.body.velocity.x = splitForce;

      pieces.push(leftPiece, rightPiece);
    } else if (!splitVertically && this.height >= this.minSplitSize * 2) {
      // Split into top and bottom pieces
      const pieceHeight = this.height / 2;

      const topPiece = new Target(
        pos.x - this.width / 2,
        pos.y - pieceHeight / 2 - this.height / 4,
        this.width,
        pieceHeight,
        this.type
      );

      const bottomPiece = new Target(
        pos.x - this.width / 2,
        pos.y + pieceHeight / 2 - this.height / 4,
        this.width,
        pieceHeight,
        this.type
      );

      // Inherit some properties
      topPiece.health = this.health * 0.6;
      bottomPiece.health = this.health * 0.6;
      topPiece.maxHealth = this.maxHealth * 0.5;
      bottomPiece.maxHealth = this.maxHealth * 0.5;
      topPiece.canSplit = pieceHeight >= this.minSplitSize * 2;
      bottomPiece.canSplit = pieceHeight >= this.minSplitSize * 2;

      // Apply some velocity from the split
      const splitForce = 50;
      topPiece.body.velocity.y = -splitForce;
      bottomPiece.body.velocity.y = splitForce;

      pieces.push(topPiece, bottomPiece);
    }

    return pieces;
  }
}

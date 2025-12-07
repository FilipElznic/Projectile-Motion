import { Vector2 } from "../classes/Vector2";

export interface ProjectileSimulatorConfig {
  startPosition: Vector2;
  radius?: number;
  gravity?: number;
  restitution?: number;
  airDrag?: number;
  groundFriction?: number;
  groundY: number;
  boundsPadding?: number;
  maxSpeed?: number;
}

export class ProjectileSimulator {
  position: Vector2;
  velocity: Vector2;
  radius: number;
  startPosition: Vector2;
  angularVelocity: number = 0;
  sleepTimer: number = 0;
  isSleeping: boolean = false;

  private gravity: number;
  private restitution: number;
  private airDrag: number;
  private groundFriction: number;
  private groundY: number;
  private boundsPadding: number;
  private maxSpeed: number;

  constructor(config: ProjectileSimulatorConfig) {
    this.startPosition = config.startPosition.copy();
    this.position = config.startPosition.copy();
    this.velocity = new Vector2();

    this.radius = config.radius ?? 22;
    this.gravity = config.gravity ?? 1500; // pixels per second^2
    this.restitution = config.restitution ?? 0.55;
    this.airDrag = config.airDrag ?? 0.02;
    this.groundFriction = config.groundFriction ?? 0.85;
    this.groundY = config.groundY;
    this.boundsPadding = config.boundsPadding ?? 120;
    this.maxSpeed = config.maxSpeed ?? 1600;
  }

  update(dt: number, bounds: { width: number; height: number }) {
    // Apply gravity
    this.velocity.y += this.gravity * dt;

    // Apply air drag (simple exponential decay)
    this.velocity.x *= 1 - this.airDrag;
    this.velocity.y *= 1 - this.airDrag * 0.5;

    // Clamp speed to prevent tunneling
    const speed = this.velocity.mag();
    if (speed > this.maxSpeed) {
      this.velocity.setMag(this.maxSpeed);
    }

    // Integrate position (semi-implicit Euler)
    this.position.add(Vector2.mult(this.velocity, dt));

    // Ground collision
    const floor = this.groundY - this.radius;
    if (this.position.y >= floor) {
      this.position.y = floor;

      if (this.velocity.y > 0) {
        this.velocity.y *= -this.restitution;
        this.velocity.x *= this.groundFriction;

        if (Math.abs(this.velocity.y) < 40) {
          this.velocity.y = 0;
        }
      }
    }

    // World bounds (left/right)
    if (this.position.x < this.boundsPadding * -1) {
      this.reset();
    }

    if (this.position.x > bounds.width + this.boundsPadding) {
      this.reset();
    }

    // Ceiling
    if (this.position.y < this.radius) {
      this.position.y = this.radius;
      if (this.velocity.y < 0) this.velocity.y *= -0.6;
    }
  }

  setGround(groundY: number) {
    this.groundY = groundY;
  }

  setStartPosition(pos: Vector2) {
    this.startPosition = pos.copy();
    this.reset();
  }

  holdAt(position: Vector2) {
    this.position.set(position.x, position.y);
    this.velocity.set(0, 0);
  }

  launch(from: Vector2, to: Vector2, multiplier: number) {
    const dragVector = Vector2.sub(from, to);
    dragVector.setMag(Math.min(dragVector.mag(), 200));
    const launchVelocity = dragVector.mult(multiplier);
    this.velocity.set(launchVelocity.x, launchVelocity.y);
  }

  reset() {
    this.position = this.startPosition.copy();
    this.velocity.set(0, 0);
  }

  isResting(): boolean {
    return (
      Math.abs(this.velocity.x) < 5 &&
      Math.abs(this.velocity.y) < 5 &&
      Math.abs(this.position.y - (this.groundY - this.radius)) < 0.5
    );
  }
}

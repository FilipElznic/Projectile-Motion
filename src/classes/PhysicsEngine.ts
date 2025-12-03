import { Vector2 } from "./Vector2";

export type ShapeType = "circle" | "rectangle";

export interface PhysicsBodyOptions {
  position: Vector2;
  mass?: number;
  restitution?: number; // Bounciness 0-1
  friction?: number;
  isStatic?: boolean;
  type: ShapeType;
  // For circle
  radius?: number;
  // For rectangle
  width?: number;
  height?: number;
  angle?: number;
}

export class PhysicsBody {
  position: Vector2;
  velocity: Vector2;
  force: Vector2;

  angle: number;
  angularVelocity: number;
  torque: number;

  mass: number;
  invMass: number;
  inertia: number;
  invInertia: number;

  restitution: number;
  friction: number;
  isStatic: boolean;
  type: ShapeType;

  // Shape props
  radius: number;
  width: number;
  height: number;

  // Game logic props
  id: number;
  static nextId = 0;

  // For game logic (HP, etc)
  userData: Record<string, unknown> = {};

  constructor(options: PhysicsBodyOptions) {
    this.id = PhysicsBody.nextId++;
    this.position = options.position.copy();
    this.velocity = new Vector2(0, 0);
    this.force = new Vector2(0, 0);

    this.angle = options.angle || 0;
    this.angularVelocity = 0;
    this.torque = 0;

    this.isStatic = options.isStatic || false;

    this.mass = options.mass || 1;
    if (this.isStatic) {
      this.invMass = 0;
      this.inertia = 0;
      this.invInertia = 0;
    } else {
      this.invMass = this.mass === 0 ? 0 : 1 / this.mass;
      // Calculate inertia based on shape
      if (options.type === "circle") {
        // I = 0.5 * m * r^2
        this.inertia = 0.5 * this.mass * (options.radius || 1) ** 2;
      } else {
        // I = 1/12 * m * (w^2 + h^2)
        this.inertia =
          (1 / 12) *
          this.mass *
          ((options.width || 1) ** 2 + (options.height || 1) ** 2);
      }
      this.invInertia = this.inertia === 0 ? 0 : 1 / this.inertia;
    }

    this.restitution = options.restitution ?? 0.5;
    this.friction = options.friction ?? 0.5;
    this.type = options.type;

    this.radius = options.radius || 0;
    this.width = options.width || 0;
    this.height = options.height || 0;
  }

  applyForce(force: Vector2) {
    if (this.isStatic) return;
    this.force.add(force);
  }

  applyImpulse(impulse: Vector2, contactVector?: Vector2) {
    if (this.isStatic) return;
    this.velocity.add(Vector2.mult(impulse, this.invMass));

    if (contactVector) {
      // Angular impulse = r x J
      // 2D cross product: r.x * J.y - r.y * J.x
      const cross = contactVector.x * impulse.y - contactVector.y * impulse.x;
      this.angularVelocity += cross * this.invInertia;
    }
  }

  // Split integration into velocity and position updates for better stability
  updateVelocity(dt: number, gravity: Vector2) {
    if (this.isStatic) return;

    // Apply gravity and forces
    this.applyForce(Vector2.mult(gravity, this.mass));
    const acceleration = Vector2.mult(this.force, this.invMass);
    this.velocity.add(Vector2.mult(acceleration, dt));

    // Angular acceleration
    const angularAcc = this.torque * this.invInertia;
    this.angularVelocity += angularAcc * dt;

    // Clear forces
    this.force.set(0, 0);
    this.torque = 0;

    // Damping
    this.velocity.mult(0.995);
    this.angularVelocity *= 0.98;
  }

  updatePosition(dt: number) {
    if (this.isStatic) return;

    this.position.add(Vector2.mult(this.velocity, dt));
    this.angle += this.angularVelocity * dt;
  }

  // Legacy method kept for compatibility if needed, but we use split update now
  integrate(dt: number, gravity: Vector2) {
    this.updateVelocity(dt, gravity);
    this.updatePosition(dt);
  }

  getVertices(): Vector2[] {
    if (this.type === "rectangle") {
      const hw = this.width / 2;
      const hh = this.height / 2;

      // Local corners
      const corners = [
        new Vector2(-hw, -hh),
        new Vector2(hw, -hh),
        new Vector2(hw, hh),
        new Vector2(-hw, hh),
      ];

      // Rotate and translate
      return corners.map((v) => {
        v.rotate(this.angle);
        v.add(this.position);
        return v;
      });
    }
    return [];
  }
}

export interface CollisionManifold {
  bodyA: PhysicsBody;
  bodyB: PhysicsBody;
  normal: Vector2; // From A to B
  depth: number;
  contacts: Vector2[]; // Contact points
  hasCollision: boolean;
}

export class PhysicsWorld {
  bodies: PhysicsBody[] = [];
  gravity: Vector2 = new Vector2(0, 9.8 * 50); // Scaled gravity (pixels/s^2)

  // Event listeners
  collisionListeners: ((manifold: CollisionManifold) => void)[] = [];

  constructor() {}

  addBody(body: PhysicsBody) {
    this.bodies.push(body);
  }

  removeBody(body: PhysicsBody) {
    const index = this.bodies.indexOf(body);
    if (index !== -1) {
      this.bodies.splice(index, 1);
    }
  }

  onCollision(callback: (manifold: CollisionManifold) => void) {
    this.collisionListeners.push(callback);
  }

  step(dt: number) {
    // Fixed time step is better, but we'll use variable dt for simplicity
    // Limit dt to avoid instability
    const safeDt = Math.min(dt, 0.05);

    // Iterations for solver stability
    const iterations = 10;

    // 1. Update Velocities (Integrate Forces)
    for (const body of this.bodies) {
      body.updateVelocity(safeDt, this.gravity);
    }

    // 2. Detect & Resolve Collisions (Iterative Impulse Solver)
    // We detect once (broadphase optimization could go here)
    // Then resolve multiple times

    // For simplicity in this engine, we'll detect and resolve in the loop
    // Ideally, we cache contacts (manifolds) and just resolve them.

    // Let's gather all manifolds first
    const collisions: CollisionManifold[] = [];
    for (let i = 0; i < this.bodies.length; i++) {
      for (let j = i + 1; j < this.bodies.length; j++) {
        const bodyA = this.bodies[i];
        const bodyB = this.bodies[j];

        if (bodyA.isStatic && bodyB.isStatic) continue;

        // Simple AABB check optimization could go here

        const manifold = this.detectCollision(bodyA, bodyB);
        if (manifold.hasCollision) {
          collisions.push(manifold);
        }
      }
    }

    // Notify listeners (only once per frame)
    for (const manifold of collisions) {
      this.collisionListeners.forEach((cb) => cb(manifold));
    }

    // Resolve Velocity Constraints (Impulses)
    for (let k = 0; k < iterations; k++) {
      for (const manifold of collisions) {
        this.resolveVelocity(manifold);
      }
    }

    // 3. Update Positions
    for (const body of this.bodies) {
      body.updatePosition(safeDt);
    }

    // 4. Resolve Position Constraints (Prevent Sinking/Penetration)
    // This is done after position update to fix any remaining overlap
    for (const manifold of collisions) {
      // Re-check collision depth because positions changed?
      // Or just use the depth from before?
      // Standard is to use the depth from detection but it might be stale.
      // For this simple engine, we'll use the initial depth but corrected.
      this.resolvePosition(manifold);
    }
  }

  detectCollision(a: PhysicsBody, b: PhysicsBody): CollisionManifold {
    if (a.type === "circle" && b.type === "circle") {
      return this.circleToCircle(a, b);
    } else if (a.type === "rectangle" && b.type === "rectangle") {
      return this.rectToRect(a, b);
    } else if (a.type === "circle" && b.type === "rectangle") {
      return this.circleToRect(a, b);
    } else if (a.type === "rectangle" && b.type === "circle") {
      const m = this.circleToRect(b, a);
      m.normal.mult(-1);
      m.bodyA = a;
      m.bodyB = b;
      return m;
    }
    return {
      bodyA: a,
      bodyB: b,
      normal: new Vector2(0, 0),
      depth: 0,
      contacts: [],
      hasCollision: false,
    };
  }

  circleToCircle(a: PhysicsBody, b: PhysicsBody): CollisionManifold {
    const normal = Vector2.sub(b.position, a.position);
    const distSq = normal.magSq();
    const radiusSum = a.radius + b.radius;

    if (distSq >= radiusSum * radiusSum) {
      return {
        bodyA: a,
        bodyB: b,
        normal: new Vector2(0, 0),
        depth: 0,
        contacts: [],
        hasCollision: false,
      };
    }

    const distance = Math.sqrt(distSq);

    if (distance === 0) {
      return {
        bodyA: a,
        bodyB: b,
        normal: new Vector2(1, 0),
        depth: radiusSum,
        contacts: [a.position.copy()],
        hasCollision: true,
      };
    }

    normal.div(distance);
    const depth = radiusSum - distance;

    const contact = Vector2.add(a.position, Vector2.mult(normal, a.radius));

    return {
      bodyA: a,
      bodyB: b,
      normal,
      depth,
      contacts: [contact],
      hasCollision: true,
    };
  }

  // Simplified SAT for Rect vs Rect
  rectToRect(a: PhysicsBody, b: PhysicsBody): CollisionManifold {
    const verticesA = a.getVertices();
    const verticesB = b.getVertices();

    const axes = [...this.getAxes(verticesA), ...this.getAxes(verticesB)];

    let minOverlap = Infinity;
    let smallestAxis = new Vector2(0, 0);

    for (const axis of axes) {
      const p1 = this.project(verticesA, axis);
      const p2 = this.project(verticesB, axis);

      if (!this.overlap(p1, p2)) {
        return {
          bodyA: a,
          bodyB: b,
          normal: new Vector2(0, 0),
          depth: 0,
          contacts: [],
          hasCollision: false,
        };
      }

      const overlap = Math.min(p1.max, p2.max) - Math.max(p1.min, p2.min);
      if (overlap < minOverlap) {
        minOverlap = overlap;
        smallestAxis = axis;
      }
    }

    // Ensure normal points from A to B
    const centerDir = Vector2.sub(b.position, a.position);
    if (centerDir.dot(smallestAxis) < 0) {
      smallestAxis.mult(-1);
    }

    // Approximate contact point (center of overlap volume - simplified)
    // A real contact point generation for SAT is complex (clipping).
    // We'll use the midpoint for now.
    const contact = Vector2.add(
      a.position,
      Vector2.mult(smallestAxis, a.width / 2)
    ); // Very rough approximation

    return {
      bodyA: a,
      bodyB: b,
      normal: smallestAxis,
      depth: minOverlap,
      contacts: [contact],
      hasCollision: true,
    };
  }

  circleToRect(circle: PhysicsBody, rect: PhysicsBody): CollisionManifold {
    // Rotate circle center into rect's local space
    const localCirclePos = Vector2.sub(circle.position, rect.position);
    localCirclePos.rotate(-rect.angle);

    const hw = rect.width / 2;
    const hh = rect.height / 2;

    // Find closest point on AABB
    const closestX = Math.max(-hw, Math.min(localCirclePos.x, hw));
    const closestY = Math.max(-hh, Math.min(localCirclePos.y, hh));

    const closestLocal = new Vector2(closestX, closestY);
    const distanceVec = Vector2.sub(localCirclePos, closestLocal);

    let distSq = distanceVec.magSq();

    // Inside the rect
    let inside = false;
    if (distSq === 0) {
      inside = true;
      // Find closest axis to push out
      if (Math.abs(localCirclePos.x) > Math.abs(localCirclePos.y)) {
        if (localCirclePos.x > 0) closestLocal.x = hw;
        else closestLocal.x = -hw;
      } else {
        if (localCirclePos.y > 0) closestLocal.y = hh;
        else closestLocal.y = -hh;
      }
      distanceVec.set(
        localCirclePos.x - closestLocal.x,
        localCirclePos.y - closestLocal.y
      );
      distSq = distanceVec.magSq();
    }

    if (distSq > circle.radius * circle.radius && !inside) {
      return {
        bodyA: circle,
        bodyB: rect,
        normal: new Vector2(0, 0),
        depth: 0,
        contacts: [],
        hasCollision: false,
      };
    }

    const distance = Math.sqrt(distSq);
    let normal: Vector2;
    let depth: number;

    if (inside) {
      normal = Vector2.sub(localCirclePos, closestLocal).normalize().mult(-1);
      depth = circle.radius + distance; // Approximation
    } else {
      normal = Vector2.sub(localCirclePos, closestLocal).normalize();
      depth = circle.radius - distance;
    }

    // Rotate normal back to world space
    normal.rotate(rect.angle);

    // Contact point in world space
    const contactLocal = closestLocal.copy();
    contactLocal.rotate(rect.angle);
    const contact = Vector2.add(rect.position, contactLocal);

    return {
      bodyA: circle,
      bodyB: rect,
      normal,
      depth,
      contacts: [contact],
      hasCollision: true,
    };
  }

  getAxes(vertices: Vector2[]): Vector2[] {
    const axes: Vector2[] = [];
    for (let i = 0; i < vertices.length; i++) {
      const p1 = vertices[i];
      const p2 = vertices[(i + 1) % vertices.length];
      const edge = Vector2.sub(p2, p1);
      const normal = new Vector2(-edge.y, edge.x).normalize();
      axes.push(normal);
    }
    return axes;
  }

  project(vertices: Vector2[], axis: Vector2): { min: number; max: number } {
    let min = Infinity;
    let max = -Infinity;
    for (const v of vertices) {
      const proj = v.dot(axis);
      if (proj < min) min = proj;
      if (proj > max) max = proj;
    }
    return { min, max };
  }

  overlap(
    p1: { min: number; max: number },
    p2: { min: number; max: number }
  ): boolean {
    return p1.max >= p2.min && p2.max >= p1.min;
  }

  resolvePosition(m: CollisionManifold) {
    const { bodyA, bodyB, normal, depth } = m;

    // Positional correction (prevent sinking)
    const percent = 0.2; // Penetration percentage to correct
    const slop = 0.05; // Penetration allowance

    const correctionMag =
      (Math.max(depth - slop, 0) / (bodyA.invMass + bodyB.invMass)) * percent;
    if (correctionMag <= 0) return;

    const correction = Vector2.mult(normal, correctionMag);

    if (!bodyA.isStatic)
      bodyA.position.sub(Vector2.mult(correction, bodyA.invMass));
    if (!bodyB.isStatic)
      bodyB.position.add(Vector2.mult(correction, bodyB.invMass));
  }

  resolveVelocity(m: CollisionManifold) {
    const { bodyA, bodyB, normal, contacts } = m;

    // rA and rB are vectors from center of mass to contact point
    const contact = contacts[0] || bodyA.position; // Fallback
    const rA = Vector2.sub(contact, bodyA.position);
    const rB = Vector2.sub(contact, bodyB.position);

    // Relative velocity at contact point
    // V_rel = Vb + (wb x rB) - Va - (wa x rA)
    // 2D cross product scalar x vector: w x r = (-w * r.y, w * r.x)
    const angVelA = new Vector2(
      -bodyA.angularVelocity * rA.y,
      bodyA.angularVelocity * rA.x
    );
    const angVelB = new Vector2(
      -bodyB.angularVelocity * rB.y,
      bodyB.angularVelocity * rB.x
    );

    const velA = Vector2.add(bodyA.velocity, angVelA);
    const velB = Vector2.add(bodyB.velocity, angVelB);

    const rv = Vector2.sub(velB, velA);
    const velAlongNormal = rv.dot(normal);

    if (velAlongNormal > 0) return; // Moving away

    let e = Math.min(bodyA.restitution, bodyB.restitution);

    // Resting contact fix: If velocity is very low (gravity only), don't bounce
    // Gravity * dt is approx 9.8 * 50 * 0.016 ~= 8
    if (velAlongNormal > -20) {
      e = 0;
    }

    // Impulse scalar
    // j = -(1 + e) * v_rel . n / (1/ma + 1/mb + (rA x n)^2 / Ia + (rB x n)^2 / Ib)

    const rAcrossN = rA.x * normal.y - rA.y * normal.x;
    const rBcrossN = rB.x * normal.y - rB.y * normal.x;

    let invMassSum = bodyA.invMass + bodyB.invMass;
    invMassSum += rAcrossN * rAcrossN * bodyA.invInertia;
    invMassSum += rBcrossN * rBcrossN * bodyB.invInertia;

    let j = -(1 + e) * velAlongNormal;
    j /= invMassSum;

    const impulse = Vector2.mult(normal, j);

    // Apply impulse
    if (!bodyA.isStatic) bodyA.applyImpulse(Vector2.mult(impulse, -1), rA);
    if (!bodyB.isStatic) bodyB.applyImpulse(impulse, rB);

    // Friction (Tangent impulse)
    const tangentVec = Vector2.sub(rv, Vector2.mult(normal, velAlongNormal));
    const tangentLen = tangentVec.mag();

    if (tangentLen < 0.1) return; // Skip friction for tiny velocities to prevent jitter

    const tangent = Vector2.div(tangentVec, tangentLen);

    const jt = -rv.dot(tangent);
    // Friction coefficient
    const mu = Math.sqrt(bodyA.friction * bodyB.friction);

    // Clamp friction
    let frictionImpulse: Vector2;
    if (Math.abs(jt) < j * mu) {
      frictionImpulse = Vector2.mult(tangent, jt);
    } else {
      frictionImpulse = Vector2.mult(tangent, -j * mu);
    }

    // Apply friction
    if (!bodyA.isStatic)
      bodyA.applyImpulse(Vector2.mult(frictionImpulse, -1), rA);
    if (!bodyB.isStatic) bodyB.applyImpulse(frictionImpulse, rB);
  }
}

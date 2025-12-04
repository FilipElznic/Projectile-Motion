import { Vector2 } from "./Vector2";

export type ShapeType = "circle" | "rectangle";

export interface PhysicsBodyOptions {
  position: Vector2;
  mass?: number;
  restitution?: number;
  friction?: number;
  isStatic?: boolean;
  type: ShapeType;
  radius?: number;
  width?: number;
  height?: number;
  angle?: number;
}

export class PhysicsBody {
  position: Vector2;
  velocity: Vector2;
  angle: number;
  angularVelocity: number;

  mass: number;
  invMass: number;
  restitution: number;
  friction: number;
  isStatic: boolean;
  type: ShapeType;

  radius: number;
  width: number;
  height: number;

  id: number;
  static nextId = 0;
  userData: Record<string, unknown> = {};

  constructor(options: PhysicsBodyOptions) {
    this.id = PhysicsBody.nextId++;
    this.position = options.position.copy();
    this.velocity = new Vector2(0, 0);
    this.angle = options.angle || 0;
    this.angularVelocity = 0;

    this.type = options.type;
    this.radius = options.radius ?? 0;
    this.width = options.width ?? 0;
    this.height = options.height ?? 0;

    this.mass = options.mass ?? 1;
    this.restitution = options.restitution ?? 0.5;
    this.friction = options.friction ?? 0.5;
    this.isStatic = options.isStatic ?? false;

    this.invMass = this.isStatic ? 0 : 1 / this.mass;
  }

  setStatic(isStatic: boolean) {
    this.isStatic = isStatic;
    this.invMass = isStatic ? 0 : 1 / this.mass;
    if (isStatic) {
      this.velocity.set(0, 0);
      this.angularVelocity = 0;
    }
  }

  applyImpulse(impulse: Vector2) {
    if (this.isStatic) return;
    this.velocity.add(Vector2.mult(impulse, this.invMass));
  }

  applyForce(force: Vector2) {
    if (this.isStatic) return;
    this.velocity.add(Vector2.mult(force, this.invMass));
  }

  wake() {}

  updateVelocity(dt: number, gravity: Vector2) {
    if (this.isStatic) return;
    this.velocity.add(Vector2.mult(gravity, dt));
  }

  updatePosition(dt: number) {
    if (this.isStatic) return;
    this.position.add(Vector2.mult(this.velocity, dt));
    this.angle += this.angularVelocity * dt;
  }

  integrate(dt: number, gravity: Vector2) {
    this.updateVelocity(dt, gravity);
    this.updatePosition(dt);
  }

  getVertices(): Vector2[] {
    if (this.type === "rectangle") {
      const hw = this.width / 2;
      const hh = this.height / 2;
      const corners = [
        new Vector2(-hw, -hh),
        new Vector2(hw, -hh),
        new Vector2(hw, hh),
        new Vector2(-hw, hh),
      ];
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
  normal: Vector2;
  depth: number;
  contacts: Vector2[];
  hasCollision: boolean;
}

export class PhysicsWorld {
  bodies: PhysicsBody[] = [];
  gravity: Vector2;
  collisionListeners: ((manifold: CollisionManifold) => void)[] = [];

  constructor(gravity: Vector2 = new Vector2(0, 200)) {
    this.gravity = gravity;
  }

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
    const safeDt = Math.min(dt, 0.05);

    // Update velocities
    for (const body of this.bodies) {
      body.updateVelocity(safeDt, this.gravity);
    }

    // Detect collisions
    const collisions: CollisionManifold[] = [];
    for (let i = 0; i < this.bodies.length; i++) {
      for (let j = i + 1; j < this.bodies.length; j++) {
        const bodyA = this.bodies[i];
        const bodyB = this.bodies[j];

        if (bodyA.isStatic && bodyB.isStatic) continue;

        const manifold = this.detectCollision(bodyA, bodyB);
        if (manifold.hasCollision) {
          collisions.push(manifold);
        }
      }
    }

    // Notify listeners
    for (const manifold of collisions) {
      this.collisionListeners.forEach((cb) => cb(manifold));
    }

    // Resolve collisions (simple version)
    for (const manifold of collisions) {
      this.resolveCollision(manifold);
    }

    // Update positions
    for (const body of this.bodies) {
      body.updatePosition(safeDt);
    }
  }

  resolveCollision(m: CollisionManifold) {
    const { bodyA, bodyB, normal, depth } = m;

    // Position correction
    const totalInvMass = bodyA.invMass + bodyB.invMass;
    if (totalInvMass === 0) return;

    const correction = Vector2.mult(normal, (depth / totalInvMass) * 0.8);

    if (!bodyA.isStatic) {
      bodyA.position.sub(Vector2.mult(correction, bodyA.invMass));
    }
    if (!bodyB.isStatic) {
      bodyB.position.add(Vector2.mult(correction, bodyB.invMass));
    }

    // Velocity resolution
    const rv = Vector2.sub(bodyB.velocity, bodyA.velocity);
    const velAlongNormal = rv.dot(normal);

    if (velAlongNormal > 0) return;

    const e = Math.min(bodyA.restitution, bodyB.restitution);
    const j = (-(1 + e) * velAlongNormal) / totalInvMass;

    const impulse = Vector2.mult(normal, j);

    if (!bodyA.isStatic) {
      bodyA.velocity.sub(Vector2.mult(impulse, bodyA.invMass));
    }
    if (!bodyB.isStatic) {
      bodyB.velocity.add(Vector2.mult(impulse, bodyB.invMass));
    }

    // Friction
    const tangent = Vector2.sub(rv, Vector2.mult(normal, velAlongNormal));
    const tangentMag = tangent.mag();

    if (tangentMag > 0.01) {
      tangent.div(tangentMag);

      const frictionMag = -rv.dot(tangent) / totalInvMass;
      const mu = Math.sqrt(bodyA.friction * bodyB.friction);
      const frictionImpulse = Vector2.mult(
        tangent,
        Math.min(Math.abs(frictionMag), Math.abs(j) * mu) *
          Math.sign(frictionMag)
      );

      if (!bodyA.isStatic) {
        bodyA.velocity.sub(Vector2.mult(frictionImpulse, bodyA.invMass));
      }
      if (!bodyB.isStatic) {
        bodyB.velocity.add(Vector2.mult(frictionImpulse, bodyB.invMass));
      }
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
}

/**
 * Vector2 - A 2D vector utility class for physics calculations
 * Provides both mutable and immutable operations for vector mathematics
 */
export class Vector2 {
  /**
   * X component of the vector
   */
  public x: number;

  /**
   * Y component of the vector
   */
  public y: number;

  /**
   * Creates a new Vector2 instance
   * @param x - The x component (default: 0)
   * @param y - The y component (default: 0)
   */
  constructor(x: number = 0, y: number = 0) {
    this.x = x;
    this.y = y;
  }

  /**
   * Adds another vector to this vector (mutable)
   * @param v - The vector to add
   * @returns This vector for method chaining
   */
  add(v: Vector2): this {
    this.x += v.x;
    this.y += v.y;
    return this;
  }

  /**
   * Subtracts another vector from this vector (mutable)
   * @param v - The vector to subtract
   * @returns This vector for method chaining
   */
  sub(v: Vector2): this {
    this.x -= v.x;
    this.y -= v.y;
    return this;
  }

  /**
   * Multiplies this vector by a scalar (mutable)
   * @param n - The scalar to multiply by
   * @returns This vector for method chaining
   */
  mult(n: number): this {
    this.x *= n;
    this.y *= n;
    return this;
  }

  /**
   * Divides this vector by a scalar (mutable)
   * @param n - The scalar to divide by
   * @returns This vector for method chaining
   * @throws Error if dividing by zero
   */
  div(n: number): this {
    if (n === 0) {
      console.warn("Vector2.div: Division by zero, returning unchanged vector");
      return this;
    }
    this.x /= n;
    this.y /= n;
    return this;
  }

  /**
   * Calculates the magnitude (length) of this vector
   * @returns The magnitude of the vector
   */
  mag(): number {
    return Math.sqrt(this.x * this.x + this.y * this.y);
  }

  /**
   * Calculates the squared magnitude of this vector (more efficient than mag())
   * Useful for comparisons where you don't need the actual magnitude
   * @returns The squared magnitude of the vector
   */
  magSq(): number {
    return this.x * this.x + this.y * this.y;
  }

  /**
   * Normalizes this vector to have a magnitude of 1 (mutable)
   * If the vector has zero magnitude, it remains unchanged
   * @returns This vector for method chaining
   */
  normalize(): this {
    const m = this.mag();
    if (m > 0) {
      this.div(m);
    }
    return this;
  }

  /**
   * Limits the magnitude of this vector to a maximum value (mutable)
   * @param max - The maximum magnitude
   * @returns This vector for method chaining
   */
  limit(max: number): this {
    const magSq = this.magSq();
    if (magSq > max * max) {
      this.normalize().mult(max);
    }
    return this;
  }

  /**
   * Sets the magnitude of this vector to a specific value (mutable)
   * @param len - The desired magnitude
   * @returns This vector for method chaining
   */
  setMag(len: number): this {
    return this.normalize().mult(len);
  }

  /**
   * Sets the components of this vector (mutable)
   * @param x - The new x component
   * @param y - The new y component
   * @returns This vector for method chaining
   */
  set(x: number, y: number): this {
    this.x = x;
    this.y = y;
    return this;
  }

  /**
   * Creates a copy of this vector
   * @returns A new Vector2 instance with the same components
   */
  copy(): Vector2 {
    return new Vector2(this.x, this.y);
  }

  /**
   * Calculates the dot product with another vector
   * @param v - The other vector
   * @returns The dot product
   */
  dot(v: Vector2): number {
    return this.x * v.x + this.y * v.y;
  }

  /**
   * Calculates the angle of this vector in radians
   * @returns The angle in radians
   */
  heading(): number {
    return Math.atan2(this.y, this.x);
  }

  /**
   * Rotates this vector by an angle (mutable)
   * @param angle - The angle to rotate by in radians
   * @returns This vector for method chaining
   */
  rotate(angle: number): this {
    const newHeading = this.heading() + angle;
    const mag = this.mag();
    this.x = Math.cos(newHeading) * mag;
    this.y = Math.sin(newHeading) * mag;
    return this;
  }

  /**
   * Converts the vector to a string representation
   * @returns String representation of the vector
   */
  toString(): string {
    return `Vector2(${this.x.toFixed(2)}, ${this.y.toFixed(2)})`;
  }

  // ==================== STATIC METHODS ====================

  /**
   * Calculates the Euclidean distance between two vectors
   * @param v1 - The first vector
   * @param v2 - The second vector
   * @returns The distance between the two vectors
   */
  static dist(v1: Vector2, v2: Vector2): number {
    const dx = v1.x - v2.x;
    const dy = v1.y - v2.y;
    return Math.sqrt(dx * dx + dy * dy);
  }

  /**
   * Calculates the squared distance between two vectors (more efficient)
   * @param v1 - The first vector
   * @param v2 - The second vector
   * @returns The squared distance between the two vectors
   */
  static distSq(v1: Vector2, v2: Vector2): number {
    const dx = v1.x - v2.x;
    const dy = v1.y - v2.y;
    return dx * dx + dy * dy;
  }

  /**
   * Creates a new vector from an angle and magnitude
   * @param angle - The angle in radians
   * @param magnitude - The magnitude (default: 1)
   * @returns A new Vector2 instance
   */
  static fromAngle(angle: number, magnitude: number = 1): Vector2 {
    return new Vector2(
      Math.cos(angle) * magnitude,
      Math.sin(angle) * magnitude
    );
  }

  /**
   * Adds two vectors and returns a new vector (immutable)
   * @param v1 - The first vector
   * @param v2 - The second vector
   * @returns A new Vector2 instance
   */
  static add(v1: Vector2, v2: Vector2): Vector2 {
    return new Vector2(v1.x + v2.x, v1.y + v2.y);
  }

  /**
   * Subtracts v2 from v1 and returns a new vector (immutable)
   * @param v1 - The first vector
   * @param v2 - The vector to subtract
   * @returns A new Vector2 instance
   */
  static sub(v1: Vector2, v2: Vector2): Vector2 {
    return new Vector2(v1.x - v2.x, v1.y - v2.y);
  }

  /**
   * Multiplies a vector by a scalar and returns a new vector (immutable)
   * @param v - The vector
   * @param n - The scalar
   * @returns A new Vector2 instance
   */
  static mult(v: Vector2, n: number): Vector2 {
    return new Vector2(v.x * n, v.y * n);
  }

  /**
   * Divides a vector by a scalar and returns a new vector (immutable)
   * @param v - The vector
   * @param n - The scalar
   * @returns A new Vector2 instance
   */
  static div(v: Vector2, n: number): Vector2 {
    if (n === 0) {
      console.warn("Vector2.div: Division by zero, returning zero vector");
      return new Vector2(0, 0);
    }
    return new Vector2(v.x / n, v.y / n);
  }

  /**
   * Calculates the dot product of two vectors
   * @param v1 - The first vector
   * @param v2 - The second vector
   * @returns The dot product
   */
  static dot(v1: Vector2, v2: Vector2): number {
    return v1.x * v2.x + v1.y * v2.y;
  }

  /**
   * Linear interpolation between two vectors
   * @param v1 - The start vector
   * @param v2 - The end vector
   * @param t - The interpolation factor (0-1)
   * @returns A new Vector2 instance
   */
  static lerp(v1: Vector2, v2: Vector2, t: number): Vector2 {
    return new Vector2(v1.x + (v2.x - v1.x) * t, v1.y + (v2.y - v1.y) * t);
  }

  /**
   * Creates a zero vector
   * @returns A new Vector2 instance with x=0, y=0
   */
  static zero(): Vector2 {
    return new Vector2(0, 0);
  }

  /**
   * Creates a random unit vector
   * @returns A new Vector2 instance with random direction and magnitude of 1
   */
  static random(): Vector2 {
    const angle = Math.random() * Math.PI * 2;
    return Vector2.fromAngle(angle);
  }
}

import { useEffect, useRef, useState } from "react";
import { Ball } from "../classes/Ball";
import { Vector2 } from "../classes/Vector2";
import { Target, type TargetType } from "../classes/Target";
import {
  PhysicsWorld,
  PhysicsBody,
  type CollisionManifold,
} from "../classes/PhysicsEngine";
import { RefreshCw, Trophy, Star } from "lucide-react";

const LAUNCH_POWER = 4.6;
const MAX_DRAG_DISTANCE = 190;
const GAME_GRAVITY = 210; // pixels per second^2
const FLOOR_HEIGHT = 20;

export const AngryBirdsGame = () => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [score, setScore] = useState(0);
  const [gameState, setGameState] = useState<
    "aiming" | "flying" | "hit" | "resetting" | "won"
  >("aiming");

  // Game state refs to be accessible inside loop
  const gameStateRef = useRef({
    world: new PhysicsWorld(),
    score: 0,
    targets: [] as Target[],
    ball: null as Ball | null,
    startPos: new Vector2(150, 0), // Y will be set in init
    isDragging: false,
    status: "aiming" as "aiming" | "flying" | "hit" | "resetting" | "won",
  });

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    let animationFrameId: number;

    const initLevel = () => {
      const parent = canvas.parentElement;
      if (parent) {
        canvas.width = parent.clientWidth;
        canvas.height = parent.clientHeight;
      }

      const state = gameStateRef.current;
      state.status = "aiming";

      // Reset world
      state.world = new PhysicsWorld(new Vector2(0, GAME_GRAVITY));

      // Position slingshot at 15% width
      state.startPos = new Vector2(canvas.width * 0.15, canvas.height - 150);

      // Create Ground
      const ground = new PhysicsBody({
        position: new Vector2(
          canvas.width / 2,
          canvas.height - FLOOR_HEIGHT / 2
        ),
        type: "rectangle",
        width: canvas.width,
        height: FLOOR_HEIGHT,
        isStatic: true,
        friction: 1.0,
        restitution: 0.1,
      });
      ground.userData = { type: "floor" };
      state.world.addBody(ground);

      // Reset ball
      state.ball = new Ball(state.startPos.x, state.startPos.y, 20, "#D62412");
      // Keep the bird parked in the sling until the player drags it.
      state.ball.body.setStatic(true);
      state.ball.body.position.set(state.startPos.x, state.startPos.y);
      state.world.addBody(state.ball.body);

      // Create targets (Level 1 Structure)
      state.targets = [];
      const baseX = canvas.width * 0.75;
      const floorY = canvas.height - FLOOR_HEIGHT; // Top of floor
      const blockSize = 50;

      const createTarget = (
        x: number,
        y: number,
        w: number,
        h: number,
        type: TargetType
      ) => {
        // Adjust y to be center
        const t = new Target(x, y, w, h, type);
        // We need to adjust position because Target constructor expects top-left but PhysicsBody is center.
        // Actually I modified Target constructor to take top-left and convert to center.
        // So passing top-left is correct.
        state.targets.push(t);
        state.world.addBody(t.body);
      };

      // Structure 1: Simple Tower
      // Add small gaps (0.1) to prevent initial overlap
      const gap = 0.0;

      // Base stones
      createTarget(
        baseX - blockSize,
        floorY - blockSize - gap,
        blockSize,
        blockSize,
        "stone"
      );
      createTarget(
        baseX + blockSize,
        floorY - blockSize - gap,
        blockSize,
        blockSize,
        "stone"
      );

      // Wood plank across
      createTarget(
        baseX - blockSize,
        floorY - blockSize * 2 - gap * 2,
        blockSize * 3,
        blockSize,
        "wood"
      );

      // Pig on top
      createTarget(
        baseX,
        floorY - blockSize * 3 - gap * 3,
        blockSize,
        blockSize,
        "pig"
      );

      // Side structures
      createTarget(
        baseX - blockSize * 2.5,
        floorY - blockSize - gap,
        blockSize,
        blockSize,
        "wood"
      );
      createTarget(
        baseX - blockSize * 2.5,
        floorY - blockSize * 2 - gap * 2,
        blockSize,
        blockSize,
        "pig"
      );

      createTarget(
        baseX + blockSize * 2.5,
        floorY - blockSize - gap,
        blockSize,
        blockSize,
        "wood"
      );
      createTarget(
        baseX + blockSize * 2.5,
        floorY - blockSize * 2 - gap * 2,
        blockSize,
        blockSize,
        "ice"
      );

      setGameState("aiming");
      setScore(0);
      state.score = 0;

      // Setup collision listener
      state.world.onCollision((manifold: CollisionManifold) => {
        const { bodyA, bodyB } = manifold;
        const typeA = bodyA.userData["type"];
        const typeB = bodyB.userData["type"];

        // Calculate relative velocity magnitude
        // We can approximate impact force by the relative velocity
        // But we need the velocity *before* resolution.
        // The manifold is generated before resolution, so velocities are pre-resolution.
        const relVel = Vector2.sub(bodyA.velocity, bodyB.velocity).mag();

        const damageThreshold = 8; // Increased threshold to prevent jitter damage

        if (relVel > damageThreshold) {
          const damage = relVel * 5;
          const applyDamage = (targetBody: PhysicsBody) => {
            const target = targetBody.userData["parent"] as Target;
            if (!target || target.isHit) return;

            target.health -= damage;
            if (target.health <= 0) {
              target.isHit = true;
              state.score += target.getScore();
              setScore(state.score);
              state.world.removeBody(targetBody);
            }
          };

          if (typeA === "target" && typeB === "bird") {
            applyDamage(bodyA);
          }
          if (typeB === "target" && typeA === "bird") {
            applyDamage(bodyB);
          }
        }
      });
    };

    // Handle resize
    const handleResize = () => {
      initLevel();
    };
    window.addEventListener("resize", handleResize);

    const loop = () => {
      const state = gameStateRef.current;

      // Step physics
      // Use a fixed time step or delta time
      state.world.step(1 / 60);

      const applyFloorClamp = (body: PhysicsBody) => {
        if (body.isStatic) return;

        const floorTop = canvas.height - FLOOR_HEIGHT;
        const bottom =
          body.type === "circle"
            ? body.position.y + body.radius
            : body.position.y + body.height / 2;

        if (bottom > floorTop) {
          const correction = bottom - floorTop;
          body.position.y -= correction;
          if (body.velocity.y > 0) {
            body.velocity.y *= -body.restitution;
            body.velocity.x *= 0.85;
            body.angularVelocity *= 0.4;
          }
        }

        if (body.userData["type"] === "target") {
          const restingOnFloor = Math.abs(bottom - floorTop) < 1.5;
          const slowMotion =
            Math.abs(body.velocity.x) < 5 && Math.abs(body.velocity.y) < 5;
          const lowSpin = Math.abs(body.angularVelocity) < 0.8;

          if (restingOnFloor && slowMotion && lowSpin) {
            body.angularVelocity = 0;
            // Snap towers upright so they don't look jittery once settled
            body.angle *= 0.3;
            if (Math.abs(body.angle) < 0.03) {
              body.angle = 0;
            }
          }
        }
      };

      state.world.bodies.forEach(applyFloorClamp);

      // Rendering
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      const ball = state.ball;

      if (!ball) return;

      // Draw floor
      ctx.fillStyle = "#2d3748"; // slate-800
      ctx.fillRect(0, canvas.height - FLOOR_HEIGHT, canvas.width, FLOOR_HEIGHT);

      // Draw grass
      ctx.fillStyle = "#48bb78"; // green-500
      ctx.fillRect(0, canvas.height - FLOOR_HEIGHT - 5, canvas.width, 5);

      // Keep bird snapped to sling while aiming
      if (state.status === "aiming" && !state.isDragging && ball) {
        ball.body.setStatic(true);
        ball.body.position.set(state.startPos.x, state.startPos.y);
        ball.body.velocity.set(0, 0);
        ball.body.angularVelocity = 0;
      }

      // Draw slingshot (back)
      ctx.strokeStyle = "#5D4037";
      ctx.lineWidth = 8;
      ctx.beginPath();
      ctx.moveTo(state.startPos.x, state.startPos.y);
      ctx.lineTo(state.startPos.x, canvas.height - FLOOR_HEIGHT);
      ctx.stroke();

      // Draw slingshot band (back)
      if (state.isDragging) {
        ctx.strokeStyle = "#3E2723";
        ctx.lineWidth = 6;
        ctx.beginPath();
        ctx.moveTo(state.startPos.x - 10, state.startPos.y);
        ctx.lineTo(ball.body.position.x, ball.body.position.y);
        ctx.stroke();
      }

      // Check win condition
      const pigsRemaining = state.targets.filter(
        (t) => t.type === "pig" && !t.isHit
      ).length;
      if (pigsRemaining === 0 && state.targets.length > 0) {
        if (state.status !== "won") {
          state.status = "won";
          setGameState("won");
        }
      }

      // Check reset condition
      if (state.status === "flying") {
        // Stop if slow and low
        if (
          Math.abs(ball.body.velocity.x) < 0.1 &&
          Math.abs(ball.body.velocity.y) < 0.1 &&
          ball.body.position.y > canvas.height - 100
        ) {
          // Give it a moment before resetting?
          // For now just reset
          state.status = "resetting";
          setGameState("resetting");
        }

        // Stop if out of bounds
        if (
          ball.body.position.x > canvas.width + 100 ||
          ball.body.position.x < -100
        ) {
          state.status = "resetting";
          setGameState("resetting");
        }
      }

      // Draw targets
      state.targets.forEach((target) => {
        if (!target.isHit) {
          target.draw(ctx);
        }
      });

      // Draw ball
      ball.draw(ctx);

      // Draw slingshot band (front)
      if (state.isDragging) {
        ctx.strokeStyle = "#3E2723";
        ctx.lineWidth = 6;
        ctx.beginPath();
        ctx.moveTo(state.startPos.x + 10, state.startPos.y);
        ctx.lineTo(ball.body.position.x, ball.body.position.y);
        ctx.stroke();
      }

      animationFrameId = requestAnimationFrame(loop);
    };

    // Event Handlers
    const handleMouseDown = (e: MouseEvent) => {
      const state = gameStateRef.current;
      if (!state.ball) return;
      if (state.status !== "aiming") return;

      const rect = canvas.getBoundingClientRect();
      const mousePos = new Vector2(e.clientX - rect.left, e.clientY - rect.top);
      const distance = Vector2.dist(mousePos, state.ball.body.position);

      if (distance <= state.ball.radius + 40) {
        state.isDragging = true;
        state.ball.body.setStatic(true);
        state.ball.body.velocity.set(0, 0);
      }
    };

    const handleMouseMove = (e: MouseEvent) => {
      const state = gameStateRef.current;
      if (state.isDragging && state.ball) {
        const rect = canvas.getBoundingClientRect();
        const mousePos = new Vector2(
          e.clientX - rect.left,
          e.clientY - rect.top
        );
        const dragVector = Vector2.sub(mousePos, state.startPos);

        if (dragVector.mag() > MAX_DRAG_DISTANCE) {
          dragVector.setMag(MAX_DRAG_DISTANCE);
        }

        // Update ball position manually while dragging (kinematic)
        state.ball.body.position = Vector2.add(state.startPos, dragVector);
        state.ball.body.velocity.set(0, 0);
      }
    };

    const handleMouseUp = () => {
      const state = gameStateRef.current;
      if (state.isDragging && state.ball) {
        state.isDragging = false;

        // Launch!
        state.ball.body.setStatic(false); // Wake up

        const force = Vector2.sub(state.startPos, state.ball.body.position);
        // Impulse = Force * time? No, we just apply an impulse directly.
        // The drag vector is the direction and magnitude.

        // Scale it
        const impulse = Vector2.mult(
          force,
          LAUNCH_POWER * state.ball.body.mass
        );
        state.ball.body.applyImpulse(impulse);

        state.status = "flying";
        setGameState("flying");
      }
    };

    initLevel();
    loop();

    canvas.addEventListener("mousedown", handleMouseDown);
    window.addEventListener("mousemove", handleMouseMove);
    window.addEventListener("mouseup", handleMouseUp);

    return () => {
      cancelAnimationFrame(animationFrameId);
      canvas.removeEventListener("mousedown", handleMouseDown);
      window.removeEventListener("mousemove", handleMouseMove);
      window.removeEventListener("mouseup", handleMouseUp);
      window.removeEventListener("resize", handleResize);
    };
  }, []);

  const resetGame = () => {
    // Force a re-mount to reset everything cleanly
    window.location.reload();
  };

  return (
    <div className="relative w-full h-full">
      <div className="absolute top-4 left-4 flex gap-4 z-10">
        <div className="bg-white/90 backdrop-blur p-3 rounded-xl shadow-lg border-2 border-slate-200 flex items-center gap-2">
          <Trophy className="w-6 h-6 text-yellow-500" />
          <span className="font-black text-xl text-slate-700">{score}</span>
        </div>
        <button
          onClick={resetGame}
          className="bg-white/90 backdrop-blur p-3 rounded-xl shadow-lg border-2 border-slate-200 hover:bg-white transition-colors"
        >
          <RefreshCw className="w-6 h-6 text-slate-700" />
        </button>
      </div>

      {gameState === "resetting" && (
        <div className="absolute inset-0 flex items-center justify-center bg-black/20 backdrop-blur-sm z-20">
          <button
            onClick={resetGame}
            className="bg-[#D62412] text-white px-8 py-4 rounded-2xl font-black text-2xl shadow-xl hover:scale-105 transition-transform"
          >
            TRY AGAIN
          </button>
        </div>
      )}

      {gameState === "won" && (
        <div className="absolute inset-0 flex flex-col items-center justify-center bg-black/40 backdrop-blur-md z-20">
          <div className="bg-white p-8 rounded-3xl shadow-2xl text-center transform scale-110">
            <div className="flex justify-center gap-2 mb-4">
              <Star
                className="w-12 h-12 text-yellow-400 fill-yellow-400 animate-bounce"
                style={{ animationDelay: "0ms" }}
              />
              <Star
                className="w-12 h-12 text-yellow-400 fill-yellow-400 animate-bounce"
                style={{ animationDelay: "100ms" }}
              />
              <Star
                className="w-12 h-12 text-yellow-400 fill-yellow-400 animate-bounce"
                style={{ animationDelay: "200ms" }}
              />
            </div>
            <h2 className="text-4xl font-black text-slate-800 mb-2">
              LEVEL CLEARED!
            </h2>
            <p className="text-2xl font-bold text-slate-500 mb-8">
              Score: {score}
            </p>
            <button
              onClick={resetGame}
              className="bg-[#48bb78] text-white px-8 py-4 rounded-2xl font-black text-2xl shadow-xl hover:scale-105 transition-transform"
            >
              NEXT LEVEL
            </button>
          </div>
        </div>
      )}

      <canvas
        ref={canvasRef}
        className="w-full h-full block cursor-crosshair rounded-3xl top-44"
      />
    </div>
  );
};

import { useEffect, useRef, useState } from "react";
import { Ball } from "../classes/Ball";
import { Vector2 } from "../classes/Vector2";
import { Target } from "../classes/Target";
import { PhysicsWorld, PhysicsBody } from "../classes/PhysicsEngine";
import { RefreshCw, Trophy, Star } from "lucide-react";

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

    const LAUNCH_POWER = 0.15; // Reduced for impulse
    const MAX_DRAG_DISTANCE = 150;

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
      state.world = new PhysicsWorld();

      // Position slingshot at 15% width
      state.startPos = new Vector2(canvas.width * 0.15, canvas.height - 150);

      // Create Ground
      const ground = new PhysicsBody({
        position: new Vector2(canvas.width / 2, canvas.height - 10),
        type: "rectangle",
        width: canvas.width,
        height: 20,
        isStatic: true,
        friction: 0.8,
        restitution: 0.2,
      });
      state.world.addBody(ground);

      // Reset ball
      state.ball = new Ball(state.startPos.x, state.startPos.y, 20, "#D62412");
      // Ball is initially static until launched? No, we want it to hang or sit.
      // For simplicity, let's make it static until launch, or just hold it in place.
      // We'll make it static initially.
      state.ball.body.isStatic = true;
      state.world.addBody(state.ball.body);

      // Create targets (Level 1 Structure)
      state.targets = [];
      const baseX = canvas.width * 0.75;
      const floorY = canvas.height - 20; // Top of floor
      const blockSize = 50;

      const createTarget = (
        x: number,
        y: number,
        w: number,
        h: number,
        type: any
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
      // Base stones
      createTarget(
        baseX - blockSize,
        floorY - blockSize,
        blockSize,
        blockSize,
        "stone"
      );
      createTarget(
        baseX + blockSize,
        floorY - blockSize,
        blockSize,
        blockSize,
        "stone"
      );

      // Wood plank across
      createTarget(
        baseX - blockSize,
        floorY - blockSize * 2,
        blockSize * 3,
        blockSize,
        "wood"
      );

      // Pig on top
      createTarget(baseX, floorY - blockSize * 3, blockSize, blockSize, "pig");

      // Side structures
      createTarget(
        baseX - blockSize * 2.5,
        floorY - blockSize,
        blockSize,
        blockSize,
        "wood"
      );
      createTarget(
        baseX - blockSize * 2.5,
        floorY - blockSize * 2,
        blockSize,
        blockSize,
        "pig"
      );

      createTarget(
        baseX + blockSize * 2.5,
        floorY - blockSize,
        blockSize,
        blockSize,
        "wood"
      );
      createTarget(
        baseX + blockSize * 2.5,
        floorY - blockSize * 2,
        blockSize,
        blockSize,
        "ice"
      );

      setGameState("aiming");
      setScore(0);
      state.score = 0;

      // Setup collision listener
      state.world.onCollision((manifold) => {
        const { bodyA, bodyB } = manifold;

        // Calculate relative velocity magnitude
        // We can approximate impact force by the relative velocity
        // But we need the velocity *before* resolution.
        // The manifold is generated before resolution, so velocities are pre-resolution.
        const relVel = Vector2.sub(bodyA.velocity, bodyB.velocity).mag();

        const damageThreshold = 3; // Minimum speed to cause damage

        if (relVel > damageThreshold) {
          const damage = relVel * 5;

          const handleDamage = (body: PhysicsBody) => {
            if (body.userData["type"] === "target") {
              const target = body.userData["parent"] as Target;
              if (target.isHit) return;

              target.health -= damage;

              // Wake up if sleeping (static)
              // But we made them dynamic.

              if (target.health <= 0) {
                target.isHit = true;
                state.score += target.getScore();
                setScore(state.score);

                // Remove from world
                state.world.removeBody(body);

                // Optional: Spawn debris
              }
            }
          };

          handleDamage(bodyA);
          handleDamage(bodyB);
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

      // Rendering
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      const ball = state.ball;

      if (!ball) return;

      // Draw floor
      ctx.fillStyle = "#2d3748"; // slate-800
      ctx.fillRect(0, canvas.height - 20, canvas.width, 20);

      // Draw grass
      ctx.fillStyle = "#48bb78"; // green-500
      ctx.fillRect(0, canvas.height - 25, canvas.width, 5);

      // Draw slingshot (back)
      ctx.strokeStyle = "#5D4037";
      ctx.lineWidth = 8;
      ctx.beginPath();
      ctx.moveTo(state.startPos.x, state.startPos.y);
      ctx.lineTo(state.startPos.x, canvas.height - 20);
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
          if (state.status !== "won" && state.status !== "resetting") {
            state.status = "resetting";
            setGameState("resetting");
          }
        }

        // Stop if out of bounds
        if (
          ball.body.position.x > canvas.width + 100 ||
          ball.body.position.x < -100
        ) {
          if (state.status !== "won" && state.status !== "resetting") {
            state.status = "resetting";
            setGameState("resetting");
          }
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
        state.ball.body.isStatic = false; // Wake up

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

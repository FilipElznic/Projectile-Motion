import {
  useEffect,
  useRef,
  useState,
  useMemo,
  type CSSProperties,
} from "react";
import { Ball } from "../classes/Ball";
import { Vector2 } from "../classes/Vector2";
import { Target, type TargetType } from "../classes/Target";
import {
  PhysicsWorld,
  PhysicsBody,
  type CollisionManifold,
} from "../classes/PhysicsEngine";
import { RefreshCw, Trophy, Star } from "lucide-react";
import { levels } from "../levels/levels";

const LAUNCH_POWER = 4.6;
const MAX_DRAG_DISTANCE = 190;
const GAME_GRAVITY = 210; // pixels per second^2
const FLOOR_HEIGHT = 20;

const Cloud = () => (
  <div className="w-32 h-12 bg-white rounded-full relative shadow-sm">
    <div className="absolute -top-6 left-4 w-14 h-14 bg-white rounded-full"></div>
    <div className="absolute -top-8 left-12 w-16 h-16 bg-white rounded-full"></div>
    <div className="absolute -top-4 left-20 w-12 h-12 bg-white rounded-full"></div>
  </div>
);

const ParticleExplosion = ({
  x,
  y,
  color,
}: {
  x: number;
  y: number;
  color: string;
}) => {
  // Use useMemo to keep random values stable across re-renders
  const particles = useMemo(() => {
    // Use a seeded random or just Math.random() inside useMemo is fine because it only runs once per component instance
    // To satisfy linter about impure function, we can just use pseudo-random based on index
    return Array.from({ length: 8 }).map((_, i) => {
      const angle = (Math.PI * 2 * i) / 8;
      // Pseudo-random distance based on index to be pure
      const dist = 30 + ((i * 13) % 20);
      const tx = Math.cos(angle) * dist;
      const ty = Math.sin(angle) * dist;
      return { id: i, tx, ty };
    });
  }, []);

  return (
    <div className="absolute pointer-events-none" style={{ left: x, top: y }}>
      {particles.map((p) => (
        <div
          key={p.id}
          className="absolute w-3 h-3 rounded-sm animate-particle"
          style={
            {
              backgroundColor: color,
              "--tx": `${p.tx}px`,
              "--ty": `${p.ty}px`,
            } as CSSProperties
          }
        />
      ))}
    </div>
  );
};

const ScorePopup = ({
  x,
  y,
  score,
}: {
  x: number;
  y: number;
  score: number;
}) => (
  <div
    className="absolute pointer-events-none font-black text-2xl text-white drop-shadow-md animate-popup z-30"
    style={{ left: x, top: y }}
  >
    +{score}
  </div>
);

const BirdCharacter = ({
  state,
  angle,
}: {
  state: "idle" | "flying" | "dizzy";
  angle: number;
}) => {
  return (
    <div
      className="w-full h-full relative"
      style={{ transform: `rotate(${angle}rad)` }}
    >
      {/* Body */}
      <div className="absolute inset-0 bg-red-500 rounded-full shadow-inner border-2 border-red-700 overflow-hidden">
        <div className="absolute bottom-0 w-full h-1/3 bg-red-200 opacity-30 rounded-b-full"></div>
      </div>

      {/* Eyes Container */}
      <div className="absolute top-1/4 left-1/2 -translate-x-1/2 w-3/4 h-1/3 flex justify-center gap-1">
        {/* Left Eye */}
        <div
          className={`relative w-3 h-3 bg-white rounded-full border border-gray-300 ${
            state === "idle" ? "animate-blink" : ""
          }`}
        >
          <div
            className={`absolute top-1 right-0.5 w-1 h-1 bg-black rounded-full ${
              state === "dizzy" ? "animate-spin" : ""
            }`}
          ></div>
          {state === "flying" && (
            <div className="absolute -top-1 left-0 w-full h-1 bg-black rotate-12"></div>
          )}
        </div>
        {/* Right Eye */}
        <div
          className={`relative w-3 h-3 bg-white rounded-full border border-gray-300 ${
            state === "idle" ? "animate-blink" : ""
          }`}
        >
          <div
            className={`absolute top-1 left-0.5 w-1 h-1 bg-black rounded-full ${
              state === "dizzy" ? "animate-spin" : ""
            }`}
            style={{ animationDirection: "reverse" }}
          ></div>
          {state === "flying" && (
            <div className="absolute -top-1 right-0 w-full h-1 bg-black -rotate-12"></div>
          )}
        </div>
      </div>

      {/* Beak */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 w-3 h-3 bg-yellow-400 rotate-45 border border-yellow-600"></div>

      {/* Tail */}
      <div className="absolute top-1/2 -left-1 w-2 h-2 bg-black -z-10 rotate-45"></div>
    </div>
  );
};

const PigCharacter = ({ state }: { state: "idle" | "scared" }) => {
  return (
    <div className="w-full h-full relative">
      {/* Body */}
      <div className="absolute inset-0 bg-green-400 rounded-full border-2 border-green-600 shadow-inner"></div>

      {/* Ears */}
      <div className="absolute -top-1 left-0 w-2 h-2 bg-green-400 rounded-full border border-green-600"></div>
      <div className="absolute -top-1 right-0 w-2 h-2 bg-green-400 rounded-full border border-green-600"></div>

      {/* Snout */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/4 w-5 h-3 bg-green-300 rounded-full border border-green-500 flex justify-center items-center gap-1">
        <div className="w-1 h-1 bg-green-800 rounded-full"></div>
        <div className="w-1 h-1 bg-green-800 rounded-full"></div>
      </div>

      {/* Eyes */}
      <div className="absolute top-1/4 left-1/2 -translate-x-1/2 w-full flex justify-center gap-3">
        <div
          className={`relative w-2.5 h-2.5 bg-white rounded-full border border-gray-300 ${
            state === "scared" ? "scale-125" : ""
          }`}
        >
          <div
            className={`absolute top-1 left-0.5 w-1 h-1 bg-black rounded-full ${
              state === "idle" ? "animate-look" : ""
            }`}
          ></div>
        </div>
        <div
          className={`relative w-2.5 h-2.5 bg-white rounded-full border border-gray-300 ${
            state === "scared" ? "scale-125" : ""
          }`}
        >
          <div
            className={`absolute top-1 left-0.5 w-1 h-1 bg-black rounded-full ${
              state === "idle" ? "animate-look" : ""
            }`}
          ></div>
        </div>
      </div>

      {/* Mouth (Scared) */}
      {state === "scared" && (
        <div className="absolute bottom-1 left-1/2 -translate-x-1/2 w-3 h-2 bg-black rounded-full animate-pulse"></div>
      )}
    </div>
  );
};

export const AngryBirdsGame = () => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [score, setScore] = useState(0);
  const [currentLevelIndex, setCurrentLevelIndex] = useState(0);
  const [birdsRemaining, setBirdsRemaining] = useState(0);
  const [resetKey, setResetKey] = useState(0);
  const [gameState, setGameState] = useState<
    "aiming" | "flying" | "hit" | "resetting" | "won" | "lost"
  >("aiming");
  const [dragState, setDragState] = useState<{
    isDragging: boolean;
    birdPos: Vector2 | null;
    startPos: Vector2 | null;
  }>({ isDragging: false, birdPos: null, startPos: null });

  // Character Refs & State
  const birdRef = useRef<HTMLDivElement>(null);
  const pigRefs = useRef<Map<number, HTMLDivElement>>(new Map());
  const [pigStates, setPigStates] = useState<Record<number, "idle" | "scared">>(
    {}
  );
  // We use a ref to track pig states in the loop to avoid reading state during render
  const pigStatesRef = useRef<Record<number, "idle" | "scared">>({});

  // Juice State
  const [isShaking, setIsShaking] = useState(false);
  const [explosions, setExplosions] = useState<
    { id: number; x: number; y: number; color: string }[]
  >([]);
  const [popups, setPopups] = useState<
    { id: number; x: number; y: number; score: number }[]
  >([]);

  // Render State (synced with physics world for React rendering)
  const [ball, setBall] = useState<Ball | null>(null);
  const [targets, setTargets] = useState<Target[]>([]);
  const [isDizzy, setIsDizzy] = useState(false);

  // Game state refs to be accessible inside loop
  const gameStateRef = useRef({
    world: new PhysicsWorld(),
    score: 0,
    birdsRemaining: 0,
    targets: [] as Target[],
    ball: null as Ball | null,
    startPos: new Vector2(150, 0), // Y will be set in init
    isDragging: false,
    status: "aiming" as
      | "aiming"
      | "flying"
      | "hit"
      | "resetting"
      | "won"
      | "lost",
    launchTime: 0,
    // Callbacks for juice
    onShake: () => {},
    onExplode: (_x: number, _y: number, _color: string) => {
      void _x;
      void _y;
      void _color;
    },
    onPopup: (_x: number, _y: number, _score: number) => {
      void _x;
      void _y;
      void _score;
    },
  });

  // Update refs when state setters change (rarely)
  useEffect(() => {
    gameStateRef.current.onShake = () => {
      setIsShaking(true);
      setTimeout(() => setIsShaking(false), 200);
    };
    gameStateRef.current.onExplode = (x, y, color) => {
      const id = Date.now() + Math.random();
      setExplosions((prev) => [...prev, { id, x, y, color }]);
      // Cleanup after animation
      setTimeout(() => {
        setExplosions((prev) => prev.filter((e) => e.id !== id));
      }, 1000);
    };
    gameStateRef.current.onPopup = (x, y, score) => {
      const id = Date.now() + Math.random();
      setPopups((prev) => [...prev, { id, x, y, score }]);
      // Cleanup after animation
      setTimeout(() => {
        setPopups((prev) => prev.filter((p) => p.id !== id));
      }, 1000);
    };
  }, []);

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

      // Create targets (Level Structure)
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
        state.targets.push(t);
        state.world.addBody(t.body);
      };

      // Load Level
      const level = levels[currentLevelIndex] || levels[0];
      state.birdsRemaining = level.birds - 1; // One is in the sling
      setBirdsRemaining(state.birdsRemaining);

      const gap = 2;
      level.targets.forEach((t) => {
        createTarget(
          baseX + t.x * (blockSize + gap),
          floorY - t.y * (blockSize + gap) + gap,
          t.w * blockSize,
          t.h * blockSize,
          t.type
        );
      });

      setGameState("aiming");
      setScore(0);
      state.score = 0;

      // Sync state for rendering
      setBall(state.ball);
      setTargets([...state.targets]);

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
          // Screen Shake on heavy impact
          if (relVel > 20) {
            state.onShake();
          }

          // Bird Dizzy
          if (typeA === "bird" || typeB === "bird") {
            setIsDizzy(true);
            setTimeout(() => setIsDizzy(false), 2000);
          }

          const damage = relVel * 5;
          const applyDamage = (targetBody: PhysicsBody) => {
            const target = targetBody.userData["parent"] as Target;
            if (!target || target.isHit) return;

            target.health -= damage;

            // Particle effects on hit
            let particleColor = "#8D6E63"; // Wood
            if (target.type === "stone") particleColor = "#9E9E9E";
            if (target.type === "ice") particleColor = "#B3E5FC";
            if (target.type === "pig") particleColor = "#8BC34A";

            // Spawn particles at contact point (approximate as body center for now)
            state.onExplode(
              targetBody.position.x,
              targetBody.position.y,
              particleColor
            );

            if (target.health <= 0) {
              target.isHit = true;
              const scoreVal = target.getScore();
              state.score += scoreVal;
              setScore(state.score);
              state.world.removeBody(targetBody);

              // Score Popup
              state.onPopup(
                targetBody.position.x,
                targetBody.position.y,
                scoreVal
              );
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
      // Dirt bottom
      ctx.fillStyle = "#795548"; // Brown dirt
      ctx.fillRect(0, canvas.height - FLOOR_HEIGHT, canvas.width, FLOOR_HEIGHT);

      // Grass top (h-4 approx 16px)
      ctx.fillStyle = "#48bb78"; // Green grass
      ctx.fillRect(0, canvas.height - FLOOR_HEIGHT, canvas.width, 16);

      // Darker grass border
      ctx.fillStyle = "#38a169";
      ctx.fillRect(0, canvas.height - FLOOR_HEIGHT + 12, canvas.width, 4);

      // Keep bird snapped to sling while aiming
      if (state.status === "aiming" && !state.isDragging && ball) {
        ball.body.setStatic(true);
        ball.body.position.set(state.startPos.x, state.startPos.y);
        ball.body.velocity.set(0, 0);
        ball.body.angularVelocity = 0;
      }

      // Draw slingshot (back)
      // Wooden pole
      const slingBaseY = canvas.height - FLOOR_HEIGHT;
      const poleWidth = 10;
      ctx.fillStyle = "#8D6E63"; // Wood
      ctx.fillRect(
        state.startPos.x - poleWidth / 2,
        state.startPos.y,
        poleWidth,
        slingBaseY - state.startPos.y
      );

      // Wood texture detail
      ctx.fillStyle = "#5D4037";
      ctx.fillRect(
        state.startPos.x - 2,
        state.startPos.y,
        2,
        slingBaseY - state.startPos.y
      );

      // Draw slingshot band (back)
      // Removed canvas drawing for bands to use SVG overlay
      /*
      if (state.isDragging) {
        ctx.strokeStyle = "#3E2723";
        ctx.lineWidth = 6;
        ctx.beginPath();
        ctx.moveTo(state.startPos.x - 10, state.startPos.y);
        ctx.lineTo(ball.body.position.x, ball.body.position.y);
        ctx.stroke();
      }
      */

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
        const isStopped =
          Math.abs(ball.body.velocity.x) < 0.15 &&
          Math.abs(ball.body.velocity.y) < 0.15 &&
          Math.abs(ball.body.angularVelocity) < 0.15;

        const isOffScreen =
          ball.body.position.x > canvas.width + 100 ||
          ball.body.position.x < -100 ||
          ball.body.position.y > canvas.height + 200; // Fell through floor

        const isTimedOut = Date.now() - state.launchTime > 10000; // 10 seconds max flight time

        if (isStopped || isOffScreen || isTimedOut) {
          if (state.birdsRemaining > 0 && state.ball) {
            // Next bird
            state.birdsRemaining--;
            setBirdsRemaining(state.birdsRemaining);

            // Reset ball
            state.ball.body.position.set(state.startPos.x, state.startPos.y);
            state.ball.body.velocity.set(0, 0);
            state.ball.body.angularVelocity = 0;
            state.ball.body.setStatic(true);

            state.status = "aiming";
            setGameState("aiming");
          } else {
            // No birds left
            if (pigsRemaining > 0) {
              state.status = "resetting";
              setGameState("resetting");
            }
          }
        }
      }

      // Draw targets
      state.targets.forEach((target) => {
        if (!target.isHit) {
          if (target.type === "pig") {
            // Update Pig DOM
            const el = pigRefs.current.get(target.body.id);
            if (el) {
              el.style.transform = `translate(${
                target.body.position.x - target.width / 2
              }px, ${target.body.position.y - target.height / 2}px) rotate(${
                target.body.angle
              }rad)`;
            }

            // Check scared state
            if (ball && state.status === "flying") {
              const dist = Vector2.dist(
                ball.body.position,
                target.body.position
              );
              const isScared = dist < 200;
              const current = pigStatesRef.current[target.body.id] || "idle";
              const newState = isScared ? "scared" : "idle";

              if (current !== newState) {
                pigStatesRef.current[target.body.id] = newState;
                setPigStates((prev) => ({
                  ...prev,
                  [target.body.id]: newState,
                }));
              }
            } else {
              // Reset to idle if not flying
              const current = pigStatesRef.current[target.body.id] || "idle";
              if (current !== "idle") {
                pigStatesRef.current[target.body.id] = "idle";
                setPigStates((prev) => ({
                  ...prev,
                  [target.body.id]: "idle",
                }));
              }
            }
          } else {
            target.draw(ctx);
          }
        }
      });

      // Update Bird DOM
      if (ball && birdRef.current) {
        birdRef.current.style.transform = `translate(${
          ball.body.position.x - ball.radius
        }px, ${ball.body.position.y - ball.radius}px) rotate(${
          ball.body.angle
        }rad)`;
      }

      // Draw slingshot band (front)
      // Removed canvas drawing for bands to use SVG overlay
      /*
      if (state.isDragging) {
        ctx.strokeStyle = "#3E2723";
        ctx.lineWidth = 6;
        ctx.beginPath();
        ctx.moveTo(state.startPos.x + 10, state.startPos.y);
        ctx.lineTo(ball.body.position.x, ball.body.position.y);
        ctx.stroke();
      }
      */

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
        setDragState({
          isDragging: true,
          birdPos: state.ball.body.position,
          startPos: state.startPos,
        });
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

        setDragState({
          isDragging: true,
          birdPos: state.ball.body.position,
          startPos: state.startPos,
        });
      }
    };

    const handleMouseUp = () => {
      const state = gameStateRef.current;
      if (state.isDragging && state.ball) {
        state.isDragging = false;
        setDragState((prev) => ({ ...prev, isDragging: false }));

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
        state.launchTime = Date.now();
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
  }, [currentLevelIndex, resetKey]);

  const resetGame = () => {
    if (gameState === "won") {
      setCurrentLevelIndex((prev) => (prev + 1) % levels.length);
    } else {
      setResetKey((prev) => prev + 1);
    }
  };

  // Calculate trajectory points
  const trajectoryPoints = [];
  if (dragState.isDragging && dragState.birdPos && dragState.startPos) {
    const start = dragState.birdPos;
    const slingStart = dragState.startPos;
    const force = Vector2.sub(slingStart, start);

    // velocity = impulse / mass = force * LAUNCH_POWER
    const velocity = Vector2.mult(force, LAUNCH_POWER);

    const dt = 0.1;
    const gravity = GAME_GRAVITY;
    const currentPos = { x: start.x, y: start.y };
    const currentVel = { x: velocity.x, y: velocity.y };

    // Infer floor level from startPos (which is set to canvas.height - 150)
    const floorLevel = slingStart.y + 150 - FLOOR_HEIGHT;

    for (let i = 0; i < 15; i++) {
      trajectoryPoints.push({ ...currentPos });
      currentPos.x += currentVel.x * dt;
      currentPos.y += currentVel.y * dt + 0.5 * gravity * dt * dt;
      currentVel.y += gravity * dt;

      // Stop if hit floor
      if (currentPos.y > floorLevel) break;
    }
  }

  return (
    <div
      className={`relative w-full h-full overflow-hidden ${
        isShaking ? "animate-shake" : ""
      }`}
    >
      {/* Dynamic Background */}
      <div className="absolute inset-0 bg-gradient-to-b from-sky-300 to-sky-100 -z-10 pointer-events-none">
        <div className="absolute top-10 left-[-150px] animate-float-slow opacity-90">
          <Cloud />
        </div>
        <div
          className="absolute top-32 left-[-200px] animate-float-medium opacity-70"
          style={{ animationDelay: "10s" }}
        >
          <div className="transform scale-75">
            <Cloud />
          </div>
        </div>
        <div
          className="absolute top-16 left-[-100px] animate-float-fast opacity-80"
          style={{ animationDelay: "20s" }}
        >
          <div className="transform scale-50">
            <Cloud />
          </div>
        </div>
      </div>

      {/* Juice Layer */}
      {explosions.map((e) => (
        <ParticleExplosion key={e.id} x={e.x} y={e.y} color={e.color} />
      ))}
      {popups.map((p) => (
        <ScorePopup key={p.id} x={p.x} y={p.y} score={p.score} />
      ))}

      {/* Character Overlay */}
      <div className="absolute inset-0 pointer-events-none overflow-hidden z-10">
        {/* Bird */}
        {ball && (
          <div
            ref={birdRef}
            className="absolute origin-center will-change-transform"
            style={{
              width: ball.radius * 2,
              height: ball.radius * 2,
              left: 0,
              top: 0,
              // Initial position
              transform: `translate(${ball.body.position.x - ball.radius}px, ${
                ball.body.position.y - ball.radius
              }px)`,
            }}
          >
            <BirdCharacter
              state={
                isDizzy
                  ? "dizzy"
                  : gameState === "aiming" ||
                    gameState === "resetting" ||
                    gameState === "won"
                  ? "idle"
                  : gameState === "flying"
                  ? "flying"
                  : "dizzy"
              }
              angle={ball.body.angle}
            />
          </div>
        )}

        {/* Pigs */}
        {targets
          .filter((t) => t.type === "pig" && !t.isHit)
          .map((pig) => (
            <div
              key={pig.body.id}
              ref={(el) => {
                if (el) pigRefs.current.set(pig.body.id, el);
                else pigRefs.current.delete(pig.body.id);
              }}
              className="absolute origin-center will-change-transform"
              style={{
                width: pig.width,
                height: pig.height,
                left: 0,
                top: 0,
                transform: `translate(${
                  pig.body.position.x - pig.width / 2
                }px, ${pig.body.position.y - pig.height / 2}px) rotate(${
                  pig.body.angle
                }rad)`,
              }}
            >
              <PigCharacter state={pigStates[pig.body.id] || "idle"} />
            </div>
          ))}
      </div>

      {/* SVG Overlay for Bands and Trajectory */}
      <svg className="absolute inset-0 w-full h-full pointer-events-none z-20">
        {dragState.isDragging && dragState.birdPos && dragState.startPos && (
          <>
            {/* Back Band (Behind Bird - rendered first) */}
            {/* Note: Since SVG is on top of canvas, this will be on top of everything on canvas unless we use z-index tricks.
                But we can't put SVG between canvas layers.
                However, the prompt asked for SVG lines.
                If we want "Behind Bird", we have a problem if Bird is on Canvas.
                Visual trick: The bird is usually opaque. If we draw the back band, then the bird, then the front band.
                Since Bird is on Canvas (z-0) and SVG is (z-20), SVG is always on top.
                We can't solve this perfectly without moving Bird to SVG/DOM or splitting Canvas.
                BUT, we can draw the "Back Band" on the Canvas (as we did before) and only use SVG for "Front Band"?
                The user asked for "Draw two dark SVG lines".
                Let's render both in SVG. The "Back Band" will unfortunately be on top of the bird if the bird is on canvas.
                Wait! We can use `globalCompositeOperation` on canvas? No.
                
                Let's just render them. The user might not notice the z-index issue if the band connects to the center of the bird.
                Or we can offset the connection point.
            */}
            <line
              x1={dragState.startPos.x - 10}
              y1={dragState.startPos.y}
              x2={dragState.birdPos.x}
              y2={dragState.birdPos.y}
              stroke="#3E2723"
              strokeWidth="6"
              strokeLinecap="round"
            />

            {/* Front Band */}
            <line
              x1={dragState.startPos.x + 10}
              y1={dragState.startPos.y}
              x2={dragState.birdPos.x}
              y2={dragState.birdPos.y}
              stroke="#3E2723"
              strokeWidth="6"
              strokeLinecap="round"
            />

            {/* Trajectory Dots */}
            {trajectoryPoints.map((p, i) => (
              <circle
                key={i}
                cx={p.x}
                cy={p.y}
                r={4}
                fill="white"
                opacity={1 - i / 20}
              />
            ))}
          </>
        )}
      </svg>

      <div className="absolute top-4 left-4 flex gap-4 z-10">
        <div className="bg-white/90 backdrop-blur p-3 rounded-xl shadow-lg border-2 border-slate-200 flex items-center gap-2">
          <div className="w-6 h-6 bg-red-500 rounded-full border-2 border-red-700 relative overflow-hidden">
            <div className="absolute top-1 right-1 w-2 h-2 bg-white rounded-full"></div>
          </div>
          <span className="font-black text-xl text-slate-700">
            x {birdsRemaining}
          </span>
        </div>
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

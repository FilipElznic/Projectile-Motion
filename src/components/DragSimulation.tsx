import { useEffect, useRef } from "react";
import { Vector2 } from "../classes/Vector2";
import { ProjectileSimulator } from "../physics/ProjectileSimulator";
import {
  GAME_GRAVITY,
  LAUNCH_POWER,
  MAX_DRAG_DISTANCE,
} from "./game/GameConstants";

const PATH_POINTS = 90;

export const DragSimulation = () => {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    const parent = canvas.parentElement;

    const state = {
      simulator: null as ProjectileSimulator | null,
      startPos: new Vector2(0, 0),
      groundY: 0,
      isDragging: false,
      dragVector: new Vector2(0, 0),
      path: [] as Vector2[],
      restTimer: 0,
      hasLaunched: false,
      lastTime: performance.now(),
      animationFrameId: 0,
    };

    const resize = () => {
      if (parent) {
        canvas.width = parent.clientWidth;
        canvas.height = parent.clientHeight;
      }

      state.groundY = canvas.height - 26;
      state.startPos = new Vector2(canvas.width * 0.2, state.groundY - 140);

      if (!state.simulator) {
        state.simulator = new ProjectileSimulator({
          startPosition: state.startPos,
          groundY: state.groundY,
          radius: 22,
          gravity: GAME_GRAVITY,
          restitution: 0.6,
          airDrag: 0.018,
        });
      } else {
        state.simulator.setGround(state.groundY);
        state.simulator.setStartPosition(state.startPos);
      }

      state.simulator.reset();
      state.path = [];
      state.hasLaunched = false;
      state.dragVector.set(0, 0);
    };

    const getMousePos = (e: MouseEvent) => {
      const rect = canvas.getBoundingClientRect();
      return new Vector2(e.clientX - rect.left, e.clientY - rect.top);
    };

    const updateDrag = (mouse: Vector2) => {
      if (!state.simulator) return;

      const dragVector = Vector2.sub(mouse, state.startPos);
      if (dragVector.mag() > MAX_DRAG_DISTANCE) {
        dragVector.setMag(MAX_DRAG_DISTANCE);
      }

      const newPos = Vector2.add(state.startPos, dragVector);
      state.simulator.holdAt(newPos);
      state.dragVector = dragVector;
      state.hasLaunched = false;
    };

    const handleMouseDown = (e: MouseEvent) => {
      if (!state.simulator) return;
      const mouse = getMousePos(e);
      const distance = Vector2.dist(mouse, state.simulator.position);
      if (distance <= state.simulator.radius + 30) {
        state.isDragging = true;
        state.path = [];
        updateDrag(mouse);
      }
    };

    const handleMouseMove = (e: MouseEvent) => {
      if (!state.isDragging) return;
      updateDrag(getMousePos(e));
    };

    const handleMouseUp = () => {
      if (!state.simulator || !state.isDragging) return;

      state.isDragging = false;
      if (state.dragVector.mag() < 5) {
        state.simulator.reset();
        state.hasLaunched = false;
      } else {
        state.simulator.launch(
          state.startPos,
          state.simulator.position,
          LAUNCH_POWER
        );
        state.hasLaunched = true;
      }
      state.dragVector.set(0, 0);
    };

    const renderScene = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height);

      const gradient = ctx.createLinearGradient(0, 0, 0, canvas.height);
      gradient.addColorStop(0, "#1b1f3a");
      gradient.addColorStop(1, "#060912");
      ctx.fillStyle = gradient;
      ctx.fillRect(0, 0, canvas.width, canvas.height);

      // Ground
      ctx.fillStyle = "#243046";
      ctx.fillRect(0, state.groundY - 4, canvas.width, 40);
      ctx.fillStyle = "#3f7f4f";
      ctx.fillRect(0, state.groundY - 20, canvas.width, 16);

      if (!state.simulator) return;
      const ballPos = state.simulator.position;

      // Trajectory path
      if (state.path.length > 1) {
        ctx.strokeStyle = "rgba(255,255,255,0.35)";
        ctx.lineWidth = 2;
        ctx.setLineDash([6, 6]);
        ctx.beginPath();
        ctx.moveTo(state.path[0].x, state.path[0].y);
        for (let i = 1; i < state.path.length; i++) {
          ctx.lineTo(state.path[i].x, state.path[i].y);
        }
        ctx.stroke();
        ctx.setLineDash([]);
      }

      // Slingshot posts
      ctx.strokeStyle = "#4b2c20";
      ctx.lineWidth = 12;
      ctx.lineCap = "round";
      ctx.beginPath();
      ctx.moveTo(state.startPos.x - 16, state.groundY + 12);
      ctx.lineTo(state.startPos.x - 16, state.startPos.y);
      ctx.moveTo(state.startPos.x + 16, state.groundY + 12);
      ctx.lineTo(state.startPos.x + 16, state.startPos.y);
      ctx.stroke();

      // Elastic band
      if (state.isDragging) {
        ctx.strokeStyle = "#d89972";
        ctx.lineWidth = 6;
        ctx.beginPath();
        ctx.moveTo(state.startPos.x - 12, state.startPos.y + 4);
        ctx.lineTo(ballPos.x, ballPos.y);
        ctx.lineTo(state.startPos.x + 12, state.startPos.y + 4);
        ctx.stroke();
      }

      // Ball
      const radius = state.simulator.radius;
      const ballGradient = ctx.createRadialGradient(
        ballPos.x - radius * 0.4,
        ballPos.y - radius * 0.4,
        radius * 0.5,
        ballPos.x,
        ballPos.y,
        radius
      );
      ballGradient.addColorStop(0, "#ffe066");
      ballGradient.addColorStop(1, "#f06f42");

      ctx.fillStyle = ballGradient;
      ctx.beginPath();
      ctx.arc(ballPos.x, ballPos.y, radius, 0, Math.PI * 2);
      ctx.fill();
      ctx.strokeStyle = "#1f1720";
      ctx.lineWidth = 3;
      ctx.stroke();
    };

    const loop = (timestamp: number) => {
      const dt = Math.min((timestamp - state.lastTime) / 1000, 0.033);
      state.lastTime = timestamp;

      if (state.simulator && !state.isDragging) {
        if (state.hasLaunched) {
          state.simulator.update(dt, {
            width: canvas.width,
            height: canvas.height,
          });

          // Sleep check
          const speed = state.simulator.velocity.mag();
          const angSpeed = Math.abs(state.simulator.angularVelocity);
          const SLEEP_THRESHOLD_LINEAR = 2.0; // pixels/s
          const SLEEP_THRESHOLD_ANGULAR = 0.1; // rad/s
          const SLEEP_TIME = 0.5; // seconds

          if (
            speed < SLEEP_THRESHOLD_LINEAR &&
            angSpeed < SLEEP_THRESHOLD_ANGULAR
          ) {
            state.simulator.sleepTimer += dt;
            if (state.simulator.sleepTimer > SLEEP_TIME) {
              state.simulator.isSleeping = true;
              state.simulator.velocity.set(0, 0);
              state.simulator.angularVelocity = 0;
            }
          } else {
            state.simulator.sleepTimer = 0;
            state.simulator.isSleeping = false;
          }

          if (!state.simulator.isResting()) {
            state.path.push(state.simulator.position.copy());
            if (state.path.length > PATH_POINTS) {
              state.path.shift();
            }
            state.restTimer = 0;
          } else {
            state.restTimer += dt;
            if (state.restTimer > 1.5) {
              state.simulator.reset();
              state.path = [];
              state.restTimer = 0;
              state.hasLaunched = false;
            }
          }
        } else {
          state.simulator.holdAt(state.startPos);
          state.path = [];
          state.restTimer = 0;
        }
      }

      renderScene();
      state.animationFrameId = requestAnimationFrame(loop);
    };

    resize();
    state.animationFrameId = requestAnimationFrame(loop);

    canvas.addEventListener("mousedown", handleMouseDown);
    window.addEventListener("mousemove", handleMouseMove);
    window.addEventListener("mouseup", handleMouseUp);
    window.addEventListener("resize", resize);

    return () => {
      cancelAnimationFrame(state.animationFrameId);
      canvas.removeEventListener("mousedown", handleMouseDown);
      window.removeEventListener("mousemove", handleMouseMove);
      window.removeEventListener("mouseup", handleMouseUp);
      window.removeEventListener("resize", resize);
    };
  }, []);

  return <canvas ref={canvasRef} className="w-full h-full block" />;
};

import { type BirdType } from "../../types/BirdTypes";

export const BirdCharacter = ({
  state,
  angle,
  birdType = "red",
}: {
  state: "idle" | "flying" | "dizzy";
  angle: number;
  birdType?: BirdType;
}) => {
  const getBirdColors = (type: BirdType) => {
    switch (type) {
      case "red":
        return {
          body: "bg-red-500",
          border: "border-red-700",
          highlight: "bg-red-200",
        };
      case "blue":
        return {
          body: "bg-blue-500",
          border: "border-blue-700",
          highlight: "bg-blue-200",
        };
      case "yellow":
        return {
          body: "bg-yellow-400",
          border: "border-yellow-600",
          highlight: "bg-yellow-100",
        };
      default:
        return {
          body: "bg-red-500",
          border: "border-red-700",
          highlight: "bg-red-200",
        };
    }
  };

  const colors = getBirdColors(birdType);

  return (
    <div
      className="w-full h-full relative"
      style={{ transform: `rotate(${angle}rad)` }}
    >
      {/* Body */}
      <div
        className={`absolute inset-0 ${colors.body} rounded-full shadow-inner border-2 ${colors.border} overflow-hidden`}
      >
        <div
          className={`absolute bottom-0 w-full h-1/3 ${colors.highlight} opacity-30 rounded-b-full`}
        ></div>
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

export const PigCharacter = ({ state }: { state: "idle" | "scared" }) => {
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

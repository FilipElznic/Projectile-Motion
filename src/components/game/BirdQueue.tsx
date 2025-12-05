import { type BirdType } from "../../types/BirdTypes";

interface BirdQueueDisplayProps {
  queue: BirdType[];
}

export const BirdQueueDisplay = ({ queue }: BirdQueueDisplayProps) => {
  const getBirdColor = (type: BirdType) => {
    switch (type) {
      case "red":
        return "bg-red-500 border-red-700";
      case "blue":
        return "bg-blue-500 border-blue-700";
      case "yellow":
        return "bg-yellow-400 border-yellow-600";
      default:
        return "bg-red-500 border-red-700";
    }
  };

  return (
    <div className="flex flex-row gap-3 items-end">
      {queue.map((birdType, index) => (
        <div
          key={index}
          className={`w-12 h-12 ${getBirdColor(
            birdType
          )} rounded-full border-2 shadow-lg transition-all hover:scale-110`}
          title={`${birdType.charAt(0).toUpperCase() + birdType.slice(1)} Bird`}
        >
          {/* Mini bird face */}
          <div className="relative w-full h-full flex items-center justify-center">
            <div className="flex gap-0.5 mt-1">
              <div className="w-1.5 h-1.5 bg-white rounded-full"></div>
              <div className="w-1.5 h-1.5 bg-white rounded-full"></div>
            </div>
            <div className="absolute bottom-2 w-2 h-2 bg-yellow-400 rotate-45"></div>
          </div>
        </div>
      ))}
    </div>
  );
};

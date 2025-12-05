import { Cloud } from "./Cloud";

export const Background = () => (
  <div className="absolute inset-0 bg-gradient-to-b from-sky-400 via-sky-300 to-sky-100 pointer-events-none overflow-hidden">
    {/* Sun */}
    <div className="absolute top-8 right-12 w-24 h-24 bg-yellow-300 rounded-full shadow-lg">
      <div className="absolute inset-2 bg-yellow-200 rounded-full opacity-70"></div>
      <div className="absolute inset-4 bg-yellow-100 rounded-full opacity-50"></div>
    </div>

    {/* Distant hills */}
    <div className="absolute bottom-0 left-0 right-0 h-32">
      <div className="absolute bottom-0 left-0 w-96 h-24 bg-green-600/30 rounded-t-full"></div>
      <div className="absolute bottom-0 left-64 w-80 h-20 bg-green-700/20 rounded-t-full"></div>
      <div className="absolute bottom-0 right-0 w-96 h-28 bg-green-600/25 rounded-t-full"></div>
      <div className="absolute bottom-0 right-48 w-72 h-16 bg-green-700/15 rounded-t-full"></div>
    </div>

    {/* Flying birds */}
    <div
      className="absolute top-20 right-32 animate-bounce-gentle"
      style={{ animationDelay: "0s", animationDuration: "3s" }}
    >
      <div className="flex gap-1">
        <div className="w-3 h-1 bg-gray-800 rounded-full transform -rotate-12"></div>
        <div className="w-3 h-1 bg-gray-800 rounded-full transform rotate-12"></div>
      </div>
    </div>
    <div
      className="absolute top-28 right-48 animate-bounce-gentle"
      style={{ animationDelay: "1s", animationDuration: "3.5s" }}
    >
      <div className="flex gap-1">
        <div className="w-2 h-1 bg-gray-700 rounded-full transform -rotate-12"></div>
        <div className="w-2 h-1 bg-gray-700 rounded-full transform rotate-12"></div>
      </div>
    </div>
    <div
      className="absolute top-16 right-64 animate-bounce-gentle"
      style={{ animationDelay: "0.5s", animationDuration: "3.2s" }}
    >
      <div className="flex gap-1">
        <div className="w-2 h-1 bg-gray-700 rounded-full transform -rotate-12"></div>
        <div className="w-2 h-1 bg-gray-700 rounded-full transform rotate-12"></div>
      </div>
    </div>

    {/* Clouds */}
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
    <div
      className="absolute top-24 left-[-180px] animate-float-medium opacity-85"
      style={{ animationDelay: "5s" }}
    >
      <div className="transform scale-90">
        <Cloud />
      </div>
    </div>
  </div>
);

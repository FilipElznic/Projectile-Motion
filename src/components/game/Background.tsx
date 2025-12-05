import { Cloud } from "./Cloud";

export const Background = () => (
  <div className="absolute inset-0 bg-gradient-to-b from-sky-400 via-sky-300 to-sky-100 -z-10 pointer-events-none">
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

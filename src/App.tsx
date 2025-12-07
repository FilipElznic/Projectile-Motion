import { Routes, Route, useLocation } from "react-router-dom";
import { LandingPage } from "./pages/LandingPage";
import { SimulationPage } from "./pages/SimulationPage";
import { CustomBirdPage } from "./pages/CustomBirdPage";
import { Navbar } from "./components/Navbar";
import { Footer } from "./components/Footer";

function App() {
  const location = useLocation();
  const isLanding = location.pathname === "/";

  return (
    <div
      className={`min-h-screen flex flex-col ${
        isLanding ? "bg-[#46C6F6]" : "bg-slate-900"
      }`}
    >
      <Navbar />
      <main className="flex-grow">
        <Routes>
          <Route path="/" element={<LandingPage />} />
          <Route path="/simulation" element={<SimulationPage />} />
          <Route path="/custom-bird" element={<CustomBirdPage />} />
        </Routes>
      </main>
      <Footer />
    </div>
  );
}

export default App;

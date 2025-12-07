import { BrowserRouter, Routes, Route } from "react-router-dom";
import { LandingPage } from "./pages/LandingPage";
import { SimulationPage } from "./pages/SimulationPage";
import { CustomBirdPage } from "./pages/CustomBirdPage";

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<LandingPage />} />
        <Route path="/simulation" element={<SimulationPage />} />
        <Route path="/custom-bird" element={<CustomBirdPage />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;

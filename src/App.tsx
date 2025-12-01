import { useState } from "react";

function App() {
  const [count, setCount] = useState(0);

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 flex items-center justify-center">
      <div className="bg-white rounded-lg shadow-xl p-8 max-w-md w-full">
        <h1 className="text-4xl font-bold text-center mb-6 text-indigo-600">
          Projectile Motion
        </h1>
        <p className="text-gray-600 text-center mb-8">
          React + TypeScript + Tailwind CSS
        </p>
        <div className="flex flex-col items-center gap-4">
          <button
            onClick={() => setCount((count) => count + 1)}
            className="bg-indigo-600 hover:bg-indigo-700 text-white font-semibold py-3 px-6 rounded-lg transition-colors duration-200 shadow-md hover:shadow-lg"
          >
            Count is {count}
          </button>
          <p className="text-sm text-gray-500">
            Edit{" "}
            <code className="bg-gray-100 px-2 py-1 rounded">src/App.tsx</code>{" "}
            and save to test HMR
          </p>
        </div>
      </div>
    </div>
  );
}

export default App;

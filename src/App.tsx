import { BeamSimulation } from './components/BeamSimulation';

function App() {
  return (
    <div className="w-full h-screen bg-gray-50">
      <header className="absolute top-0 left-0 right-0 bg-white/80 backdrop-blur-sm shadow-sm z-10 p-4">
        <div className="max-w-2xl mx-auto">
          <h1 className="text-xl font-semibold text-gray-800">
            Beam Deformation Simulation
          </h1>
          <p className="text-sm text-gray-600">
            Interactive AL-Physics Simulation - Developer: Mr T Faul
          </p>
        </div>
      </header>
      <BeamSimulation />
    </div>
  );
}

export default App;
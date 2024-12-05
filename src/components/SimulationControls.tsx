import { Sliders, Info, ChevronUp, ChevronDown } from 'lucide-react';
import { useState } from 'react';
import { SimulationControlsProps } from '../types/simulation';
import { getMaterialInfo } from '../utils/materialProperties';

export function SimulationControls({ 
  force, 
  setForce, 
  elasticModulus, 
  setElasticModulus 
}: SimulationControlsProps) {
  const [isExpanded, setIsExpanded] = useState(false);
  const materialInfo = getMaterialInfo(elasticModulus);

  return (
    <div className="absolute bottom-0 left-0 right-0 bg-white shadow-lg transition-all duration-300">
      <button
        onClick={() => setIsExpanded(!isExpanded)}
        className="absolute -top-8 right-4 bg-white px-3 py-1 rounded-t-lg shadow-lg flex items-center gap-2 text-sm font-medium text-gray-700 hover:bg-gray-50"
      >
        {isExpanded ? <ChevronDown className="w-4 h-4" /> : <ChevronUp className="w-4 h-4" />}
        {isExpanded ? 'Minimize' : 'Controls'}
      </button>

      <div className="max-w-2xl mx-auto p-4">
        <div className="flex flex-col sm:flex-row gap-4 items-start sm:items-center mb-2">
          <div className="flex items-center gap-2">
            <Info className="w-4 h-4 text-blue-600" />
            <h2 className="text-sm font-semibold">Deformation Controls</h2>
          </div>
          <div className="flex-1 grid grid-cols-1 sm:grid-cols-2 gap-4 w-full">
            <div className="space-y-1">
              <div className="flex items-center justify-between text-sm">
                <label className="font-medium">Force (N)</label>
                <span className="text-gray-600">{force.toFixed(1)} N</span>
              </div>
              <input
                type="range"
                min="0"
                max="1000"
                value={force}
                onChange={(e) => setForce(Number(e.target.value))}
                className="w-full h-1.5 bg-gray-200 rounded-lg appearance-none cursor-pointer"
              />
            </div>

            <div className="space-y-1">
              <div className="flex items-center justify-between text-sm">
                <label className="font-medium">Young's Modulus</label>
                <span className="text-gray-600">{elasticModulus} GPa</span>
              </div>
              <input
                type="range"
                min="50"
                max="400"
                value={elasticModulus}
                onChange={(e) => setElasticModulus(Number(e.target.value))}
                className="w-full h-1.5 bg-gray-200 rounded-lg appearance-none cursor-pointer"
              />
            </div>
          </div>
        </div>

        {isExpanded && (
          <div className="mt-3 bg-blue-50 p-3 rounded-lg text-sm">
            <div className="flex items-start gap-2">
              <Sliders className="w-4 h-4 text-blue-600 mt-1 flex-shrink-0" />
              <div>
                <h3 className="font-medium">Material: {materialInfo.name}</h3>
                <div className="text-gray-600 mt-1 space-y-1">
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-x-4 gap-y-1">
                    <ul className="list-disc pl-4 space-y-0.5">
                      <li>Young's Modulus: {elasticModulus} GPa</li>
                      {materialInfo.properties.slice(0, 2).map((prop, index) => (
                        <li key={index}>{prop}</li>
                      ))}
                    </ul>
                    <ul className="list-disc pl-4 space-y-0.5">
                      {materialInfo.properties.slice(2).map((prop, index) => (
                        <li key={index}>{prop}</li>
                      ))}
                    </ul>
                  </div>
                  <p className="text-xs italic mt-2">{materialInfo.description}</p>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
import React, { useState } from 'react';
import InputSection from './InputSection';
import OutputSection from './OutputSection';
import SimulationResult from './SimulationResult';
import ErrorsAndWarnings from './ErrorsAndWarnings';
import ScenarioList from './ScenarioList';
import ScenarioForm from './ScenarioForm';
import SimulationService from './SimulationService';

const App = () => {
  const [simulationResult, setSimulationResult] = useState(null);
  const [errors, setErrors] = useState([]);
  const [scenarios, setScenarios] = useState([]);

  const runSimulation = (parameters) => {
    const result = SimulationService.runSimulation(parameters);
    setSimulationResult(result);
  };

  const saveScenario = (scenario) => {
    setScenarios([...scenarios, scenario]);
  };

  const resetScenario = () => {
    setSimulationResult(null);
    setErrors([]);
  };

  return (
    <div>
      <InputSection onRunSimulation={runSimulation} onResetScenario={resetScenario} />
      <OutputSection>
        {simulationResult ? (
          <>
            <SimulationResult result={simulationResult} />
            <Graph data={simulationResult.assets} />
            <Graph data={simulationResult.cashFlow} />
          </>
        ) : null}
      </OutputSection>
      <ErrorsAndWarnings errors={errors} />
      <ScenarioList scenarios={scenarios} />
      <ScenarioForm onSaveScenario={saveScenario} />
    </div>
  );
};

export default App;

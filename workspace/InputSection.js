import React, { useState } from 'react';

const InputSection = ({ onRunSimulation, onResetScenario }) => {
  const [parameters, setParameters] = useState({});

  const handleInputChange = (event) => {
    const { name, value } = event.target;
    setParameters({ ...parameters, [name]: value });
  };

  const handleRunSimulation = () => {
    onRunSimulation(parameters);
  };

  const handleResetScenario = () => {
    setParameters({});
    onResetScenario();
  };

  return (
    <div>
      {/* Render input fields and buttons */}
    </div>
  );
};

export default InputSection;

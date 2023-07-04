// app.js
const { useState } = React;
const { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend } = Recharts;

const App = () => {
  const [currentSavings, setCurrentSavings] = useState('');
  const [lifeEvent, setLifeEvent] = useState({type: '', year: ''});
  const [graphData, setGraphData] = useState([]);
  
  const runSimulation = () => {
    // Call your simulation logic here with currentSavings and lifeEvent as input,
    // then use setGraphData to update the graph.
  };

  const saveScenario = () => {
    // Save currentSavings and lifeEvent to a file here.
  };

  const loadScenario = () => {
    // Load scenario from a file and update currentSavings and lifeEvent.
  };

  return (
    <div className="container">
      <div className="form">
        <input type="number" value={currentSavings} onChange={e => setCurrentSavings(e.target.value)} placeholder="Current Savings" />
        <select value={lifeEvent.type} onChange={e => setLifeEvent({...lifeEvent, type: e.target.value})}>
          <option value="">Select Event Type</option>
          <option value="Type1">Type1</option>
          <option value="Type2">Type2</option>
        </select>
        <input type="number" value={lifeEvent.year} onChange={e => setLifeEvent({...lifeEvent, year: e.target.value})} placeholder="Event Year" />
        <button onClick={runSimulation}>Run Simulation</button>
        <button onClick={saveScenario}>Save Scenario</button>
        <button onClick={loadScenario}>Load Scenario</button>
      </div>
      <div className="graph">
        <LineChart width={600} height={300} data={graphData} margin={{ top: 5, right: 30, left: 20, bottom: 5 }}>
  <CartesianGrid strokeDasharray="3 3" />
  <XAxis dataKey="year" />
  <YAxis />
  <Tooltip />
  <Legend />
  <Line type="monotone" dataKey="Type1" stroke="#8884d8" stackId="1" />
  <Line type="monotone" dataKey="Type2" stroke="#82ca9d" stackId="1" />
</LineChart>
</div>
</div>
);
};

ReactDOM.render(<App />, document.getElementById('root'));



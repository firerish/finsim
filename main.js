class App extends React.Component {
  state = { savings: 0, eventType: 'Type1', eventYear: 0, data: [] };

  runSimulation = () => {
    const data = simulate(this.state.savings, this.state.eventType, this.state.eventYear);
    this.setState({ data });
  };

  saveScenario = async () => {
        const scenario = this.state;
        const scenarioJson = JSON.stringify(scenario, null, 2);

        const handle = await window.showSaveFilePicker({
            types: [{
                description: 'JSON Files',
                accept: {
                    'application/json': ['.json']
                }
            }]
        });
        const writable = await handle.createWritable();
        await writable.write(scenarioJson);
        await writable.close();

        alert(`Scenario saved.`);
  };

  loadScenario = async () => {
        const [handle] = await window.showOpenFilePicker();

        const file = await handle.getFile();
        const contents = await file.text();
        const scenario = JSON.parse(contents);

        this.setState(scenario);

        alert(`Scenario loaded.`);
  };

  render() {
    return (
      <div>
        <h1>Financial Simulator</h1>
        <div>
          <h2>Input Section</h2>
          <input type="number" value={this.state.savings} onChange={(e) => this.setState({ savings: Number(e.target.value) })} placeholder="Savings"/>
          <select value={this.state.eventType} onChange={(e) => this.setState({ eventType: e.target.value })}>
            <option value="Type1">Type1</option>
            <option value="Type2">Type2</option>
          </select>
          <input type="number" value={this.state.eventYear} onChange={(e) => this.setState({ eventYear: Number(e.target.value) })} placeholder="Year"/>
          <button onClick={this.runSimulation}>Run Simulation</button>
          <button onClick={this.saveScenario}>Save Scenario</button>
          <button onClick={this.loadScenario}>Load Scenario</button>
        </div>
        <div>
          <h2>Output Section</h2>
          <div id="output"></div>
        </div>
      </div>
    );
  }

  componentDidUpdate() {
    Plotly.newPlot('output', this.state.data);
  }
}

ReactDOM.render(<App />, document.getElementById('app'));


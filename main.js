
class FinancialPlanner extends React.Component {
  constructor() {
    super();
    this.state = this.getInitialState();
    this.resetState = this.resetState.bind(this);
    this.assetChartRef = React.createRef();
    this.cashflowChartRef = React.createRef();
  }

  getInitialState() {
    return {
      startingPosition: {
        currentSavings: 0,
        retirementAccounts: 0,
        investments: 0,
        currentAge: 0,
      },

      targets: {
        retirementAge: 0,
        finalAge: 0,
        targetSavings: 0,
      },

      allocations: {
        investments: {
          ETFs: 0,
          Equity: 0,
          Pension: 0,
          Cash: 0,
        },
        drawdownOrder: {
          ETFs: 1,
          Equity: 2,
          Pension: 3,
          Cash: 4,
        }

      },

      economy: {
        inflation: 0,
        assetGrowth: {
          Equity: 0,
          Pension: 0,
          // Add other assets here...
        },
        assetVariance: {
          Equity: 0,
          Pension: 0,
          // Add other assets here...
        },
      },

      events: [
        {
          type: 'job', // 'job', 'rsu', 'rent', etc.
          name: '',
          startYear: 0,
          endYear: 0,
          money: 0,
          growthRate: 0,
        },
      ],

      simulationResult: '',
      simulationData: [], // Array to hold the data for the assets chart
      cashFlowData: [], // Array to hold the data for the cash flow chart

      errors: [], // Array to hold error messages
      showErrorBanner: false // To control the visibility of the error banner
    }
  }

  handleInvestmentChange(type, e) {
    e.persist();  
    this.setState(prevState => ({
      allocations: {
        ...prevState.allocations,
        investments: {
          ...prevState.allocations.investments,
          [type]: e.target.value
        }
      }
    }));
  }

  handleAssetGrowthChange(type, e) {
    e.persist();  
    const value = parseInt(e.target.value, 10);
    if (value >= 0 && value <= 100) {
      this.setState(prevState => ({
        economy: {
          ...prevState.economy,
          assetGrowth: {
            ...prevState.economy.assetGrowth,
            [type]: e.target.value
          }
        }
      }));
    } else {
        // error
    }
  }

  handleAssetVarianceChange(type, e) {
    e.persist();  
    const value = parseInt(e.target.value, 10);
    if (value >= 0 && value <= 100) {
      this.setState(prevState => ({
        economy: {
          ...prevState.economy,
          assetVariance: {
            ...prevState.economy.assetVariance,
            [type]: e.target.value
          }
        }
      }));
    } else {
        // error
    }
  }

  handleDrawdownOrderChange(type, e) {
    e.persist();  
    this.setState(prevState => {
      // Find type which currently has the selected order
      console.log("prev order: "+JSON.stringify(prevState.allocations.drawdownOrder));
      console.log("target.value: "+e.target.value);
      const otherType = Object.keys(prevState.allocations.drawdownOrder).find(key => prevState.allocations.drawdownOrder[key] == e.target.value);
      console.log("otherType: "+otherType);

      return {
        allocations: {
          ...prevState.allocations,
          drawdownOrder: {
            ...prevState.allocations.drawdownOrder,
            [type]: e.target.value, // Set selected type to the selected order
            ...(otherType ? {[otherType]: prevState.allocations.drawdownOrder[type]} : {}) // Swap the order of the other type if it exists
          }
        }
      }
    });
  }

  handleAddLifeEvent = () => {
    this.setState(prevState => ({
      events: [...prevState.events, {
        type: '', 
        name: '',
        startYear: 0,
        endYear: 0,
        money: 0,
        growthRate: 0,
      }],
    }));
  }

  handleRemoveLifeEvent = (index) => {
    this.setState(prevState => {
      const updatedEvents = [...prevState.events];
      updatedEvents.splice(index, 1);
      return {events: updatedEvents};
    });
  }

  handleLifeEventChange(index, property, value) {
    this.setState(prevState => {
      const updatedEvents = [...prevState.events];
      updatedEvents[index][property] = value;
      return {events: updatedEvents};
    });
  }

  runSimulation = () => {
    const params = {
      startingPosition: this.state.startingPosition,
      targets: this.state.targets,
      allocations: this.state.allocations,
      economy: this.state.economy,
      events: this.state.events,
    };
    this.setState({
      simulationResult: run(params),
    });
  }

  toggleErrorBanner = () => {
    this.setState(prevState => ({ showErrorBanner: !prevState.showErrorBanner }));
  }



  saveScenario = async () => {
    const fileHandle = await window.showSaveFilePicker();
    const writable = await fileHandle.createWritable();
    const scenario = {
      startingPosition: this.state.startingPosition,
      targets: this.state.targets,
      allocations: this.state.allocations,
      economy: this.state.economy,
      events: this.state.events,
    };
    await writable.write(JSON.stringify(scenario));
    await writable.close();
  }

  loadScenario = async () => {
    const [fileHandle] = await window.showOpenFilePicker();
    const file = await fileHandle.getFile();
    const contents = await file.text();
    const scenario = JSON.parse(contents);
    this.setState({
      startingPosition: scenario.startingPosition,
      allocations: scenario.allocations,
      targets: scenario.targets,
      economy: scenario.economy,
      events: scenario.events,
    });
  }

  resetState = () => {
    if (window.confirm('Are you sure you want to reset the scenario? All unsaved data will be lost.')) {
      this.setState(this.getInitialState());
      this.assetChartRef = React.createRef();
      this.cashflowChartRef = React.createRef();
    }
  }


  createAssetChart() {
    const ctx = this.assetChartRef.current.getContext('2d');

    this.assetChart = new Chart(ctx, {
      type: 'line',
      data: {
        labels: this.state.simulationData.map(data => data.year),
        datasets: [{
          label: 'Cash',
          data: this.state.simulationData.map(data => data.cash),
          borderColor: '#8884d8',
          fill: false
        }, {
          label: 'Real Estate',
          data: this.state.simulationData.map(data => data.realEstate),
          borderColor: '#82ca9d',
          fill: false
        }]
      },
      options: {
        responsive: true,
        maintainAspectRatio: false,
        scales: {
          x: {
            display: true,
            title: {
              display: true,
              text: 'Year'
            }
          },
          y: {
            display: true
          }
        }
      }
    });
  }

  createCashflowChart() {
    const ctx = this.cashflowChartRef.current.getContext('2d');
    this.cashflowChart = new Chart(ctx, {
      type: 'line',
      data: {
        datasets: [{
          label: 'Job Income',
          data: this.state.simulationData.map(item => ({x: item.year, y: item.jobIncome})),
          backgroundColor: '#8884d8',
          fill: 'origin',
        }, {
          label: 'Rent Income',
          data: this.state.simulationData.map(item => ({x: item.year, y: item.rentIncome})),
          backgroundColor: '#82ca9d',
          fill: '-1',
        }, {
          label: 'Expenses',
          data: this.state.simulationData.map(item => ({x: item.year, y: item.expenses})),
          backgroundColor: '#ff7300',
          borderDash: [5, 5],
          fill: false,
        }],
      },
      options: {
        responsive: true,
        scales: {
          x: {
            type: 'linear',
            beginAtZero: true,
            title: {
              display: true,
              text: 'Year'
            },
          },
          y: {
            beginAtZero: true
          },
        },
      },
    });
  }

  updateAssetChart() {
    this.assetChart.data.labels = this.state.simulationData.map(data => data.year);
    this.assetChart.data.datasets[0].data = this.state.simulationData.map(data => data.cash);
    this.assetChart.data.datasets[1].data = this.state.simulationData.map(data => data.realEstate);
    this.assetChart.update();
  }

  updateCashflowChart() {
    this.cashflowChart.data.datasets[0].data = this.state.simulationData.map(item => ({x: item.year, y: item.jobIncome}));
    this.cashflowChart.data.datasets[1].data = this.state.simulationData.map(item => ({x: item.year, y: item.rentIncome}));
    this.cashflowChart.data.datasets[2].data = this.state.simulationData.map(item => ({x: item.year, y: item.expenses}));
    this.cashflowChart.update();
  }

  componentDidMount() {
    this.createAssetChart();
    this.createCashflowChart();
  }

  componentDidUpdate() {
    this.updateAssetChart();
    this.updateCashflowChart();
  }


  render() {
    const assets = Object.keys(this.state.economy.assetGrowth);
    const investmentTypes = Object.keys(this.state.allocations.investments);
    const orderOptions = Array.from({length: investmentTypes.length}, (_, i) => i + 1); // Generate order options based on number of types
    const errorBannerClass = this.state.showErrorBanner ? 'show' : 'hide';

    return (
      <div className="container">

        {this.state.errors.length > 0 && (
          <button className="error-icon" onClick={this.toggleErrorBanner}>⚠️</button>
        )}
        <div className={`error-banner ${errorBannerClass}`}>
          <h3>Errors and warnings</h3>
          {this.state.errors.map((error, index) => (
            <p key={index}>{error}</p>
          ))}
        </div>

        <h3>Starting position</h3>
        <div className="input-section">
          <div className="input-field">
            <label for="currentSavings">Savings in cash</label>
            <input id="currentSavings" type="number" placeholder="Current savings in cash" value={this.state.startingPosition.currentSavings} onChange={(e) => {const newValue = e.target.value; this.setState(prevState => ({startingPosition: {...prevState.startingPosition, currentSavings: newValue}}))}} />
          </div>
          <div className="input-field">
            <label for="retirementAccounts">Retirement accounts</label>
            <input id="retirementAccounts" type="number" placeholder="Current savings in retirement accounts" value={this.state.startingPosition.retirementAccounts} onChange={(e) => {const newValue = e.target.value; this.setState(prevState => ({startingPosition: {...prevState.startingPosition, retirementAccounts: newValue}}))}} />
          </div>
          <div className="input-field">
            <label for="investments">Investments</label>
            <input id="investments" type="number" placeholder="Current investments" value={this.state.startingPosition.investments} onChange={(e) => {const newValue = e.target.value; this.setState(prevState => ({startingPosition: {...prevState.startingPosition, investments: newValue}}))}} />
          </div>
          <div className="input-field">
            <label for="currentAge">Current age</label>
            <input id="currentAge" type="number" placeholder="Current age" value={this.state.startingPosition.currentAge} onChange={(e) => {const newValue = e.target.value; this.setState(prevState => ({startingPosition: {...prevState.startingPosition, currentAge: newValue}}))}} />
          </div>
        </div>

        <h3>Targets</h3>
        <div className="input-section">
          <div className="input-field">
            <label for="retirementAge">Retirement Age</label>
            <input id="retirementAge" type="number" placeholder="Target retirement age" value={this.state.targets.retirementAge} onChange={(e) => {const newValue = e.target.value; this.setState(prevState => ({targets: {...prevState.targets, retirementAge: newValue}}))}} />
          </div>
          <div className="input-field">
            <label for="targetAge">Target age</label>
            <input id="targetAge" type="number" placeholder="Target final age" value={this.state.targets.finalAge} onChange={(e) => {const newValue = e.target.value; this.setState(prevState => ({targets: {...prevState.targets, finalAge: newValue}}))}} />
          </div>
          <div className="input-field">
            <label for="emergencyStash">Target emergency stash</label>
            <input id="emergencyStash" type="number" placeholder="Target cash savings" value={this.state.targets.targetSavings} onChange={(e) => {const newValue = e.target.value; this.setState(prevState => ({targets: {...prevState.targets, targetSavings: newValue}}))}} />
          </div>
        </div>

        <h3>Allocations</h3>
        <div className="input-section">
          {investmentTypes.map(type => (
            <div key={type} className="input-field">
              <label for={type}>{type}</label>
              <div>
                <input id={type} type="number" placeholder="Investment (%)" value={this.state.allocations.investments[type]} onChange={this.handleInvestmentChange.bind(this, type)} />
                {/* drawdown order... */}
                <select value={this.state.allocations.drawdownOrder[type]} onChange={this.handleDrawdownOrderChange.bind(this, type)}>
                  {orderOptions.map((option, index) => <option key={index} value={option}>{option}</option>)}
                </select>
              </div>
            </div>
          ))}
        </div>
        
        <h3>Economy parameters</h3>
        <div className="input-section">
          <div className="input-field">
            <label for="inflation">Inflation</label>
            <input id="inflation" type="number" placeholder="Inflation Rate (%)" value={this.state.economy.inflation} onChange={(e) => {const newValue = e.target.value; this.setState(prevState => ({economy: {...prevState.economy, inflation: newValue}}))}} />
          </div>
          {assets.map(asset => (
            <div key={asset} className="input-field">
              <label for={asset}>{asset}</label>
              <input id={asset} type="number" placeholder="Growth (%)" value={this.state.economy.assetGrowth[asset]} onChange={this.handleAssetGrowthChange.bind(this, asset)} />
              <input type="number" placeholder="Variance (%)" value={this.state.economy.assetVariance[asset]} onChange={this.handleAssetVarianceChange.bind(this, asset)} />
            </div>
          ))}
        </div>

        <h3>Life Events</h3>
        <div className="input-section">
          <div align="center">
              {this.state.events.map((event, index) => (
                <div key={index}>
                  <select value={event.type} onChange={(e) => this.handleLifeEventChange(index, 'type', e.target.value)}>
                    <option value="job">Job Income</option>
                    <option value="rsu">RSUs</option>
                    <option value="rent">Rent Income</option>
                    {/* More options... */}
                  </select>
                  <input type="text" placeholder="Name" value={event.name} onChange={(e) => this.handleLifeEventChange(index, 'name', e.target.value)} />
                  <input type="number" placeholder="Start Year" value={event.startYear} onChange={(e) => {const newValue = e.target.value; this.handleLifeEventChange(index, 'startYear', parseInt(newValue, 10))}} />
                  <input type="number" placeholder="End Year" value={event.endYear} onChange={(e) => {const newValue = e.target.value; this.handleLifeEventChange(index, 'endYear', parseInt(newValue, 10))}} />
                  {this.state.events.length > index && (
                    <button onClick={() => this.handleRemoveLifeEvent(index)}>Remove Event</button>
                  )}
                </div>
              ))}
              <button onClick={this.handleAddLifeEvent}>Add Event</button>
          </div>
        </div>


        <div className="button-container">
          <button onClick={this.saveScenario}>Save Scenario</button>
          <button onClick={this.loadScenario}>Load Scenario</button>
          <button onClick={this.resetState}>Reset Scenario</button>
          <button onClick={this.runSimulation}>Run Simulation</button>
        </div>

        <h3>Simulation Result</h3>
        <div className="output-section">

          <p>{this.state.simulationResult}</p>

          <h3>Assets</h3>

          <div style={{ height: '300px' }}>
            <canvas ref={this.assetChartRef}></canvas>
          </div>

          <h3>Cashflow</h3>

          <div style={{ height: '300px' }}>
            <canvas ref={this.cashflowChartRef}></canvas>
          </div>

        </div>


      </div>
    );
  }

}


function run(params) {
  // The body of this function would perform the simulation based on the params and return a result.
  return 'Simulation result...';
}

export default FinancialPlanner;

ReactDOM.render(<FinancialPlanner />, document.getElementById('app'));

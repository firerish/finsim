import React from 'react';
import ReactDOM from 'react-dom';
import FinancialPlanner from './FinancialPlanner';

import React from 'react';

class FinancialPlanner extends React.Component {
  constructor() {
    super();
    this.state = {
      section1: {
        currentSavings: 0,
        retirementAccounts: 0,
        investments: 0,
        currentAge: 0,
        retirementAge: 0,
        finalAge: 0,
        targetSavings: 0
      },

      section2: {
        disposableIncome: 0,
        investments: {
          cash: 0
          pension: 0,
          ETFs: 0,
          equity: 0,
        },
        drawdownOrder: {
          ETFs: 1,
          equity: 2,
          pension: 3,
          cash: 4
        }

      },

      section3: {
        inflation: 0,
        assetGrowth: {
          equity: 0,
          pension: 0,
          // Add other assets here...
        },
        assetVariance: {
          equity: 0,
          pension: 0,
          // Add other assets here...
        },

      section4: [
        {
          type: 'job', // 'job', 'rsu', 'rent', etc.
          name: '',
          startYear: 0,
          endYear: 0,
          money: 0,
          growthRate: 0,
        },

      simulationResult: '',
      simulationData: [], // Array to hold the data for the assets chart
      cashFlowData: [], // Array to hold the data for the cash flow chart

      errors: [], // Array to hold error messages
      showErrorBanner: false, // To control the visibility of the error banner


      }
    }
  }

  handleInvestmentChange(type, e) {
    this.setState(prevState => ({
      section2: {
        ...prevState.section2,
        investments: {
          ...prevState.section2.investments,
          [type]: e.target.value
        }
      }
    }));
  }

  handleAssetGrowthChange(type, e) {
    const value = parseInt(e.target.value, 10);
    if (value >= 0 && value <= 100) {
      this.setState(prevState => ({
        section3: {
          ...prevState.section3,
          assetGrowth: {
            ...prevState.section3.assetGrowth,
            [type]: e.target.value
          }
        }
      }));
    } else {
        // error
    }
  }

  handleAssetVarianceChange(type, e) {
    const value = parseInt(e.target.value, 10);
    if (value >= 0 && value <= 100) {
      this.setState(prevState => ({
        section3: {
          ...prevState.section3,
          assetVariance: {
            ...prevState.section3.assetVariance,
            [type]: e.target.value
          }
        }
      }));
    } else {
        // error
    }
  }

  handleDrawdownOrderChange(type, e) {
    this.setState(prevState => {
      // Find type which currently has the selected order
      const otherType = Object.keys(prevState.section2.drawdownOrder).find(key => prevState.section2.drawdownOrder[key] === e.target.value);

      return {
        section2: {
          ...prevState.section2,
          drawdownOrder: {
            ...prevState.section2.drawdownOrder,
            [type]: e.target.value, // Set selected type to the selected order
            ...(otherType ? {[otherType]: prevState.section2.drawdownOrder[type]} : {}) // Swap the order of the other type if it exists
          }
        }
      }
    });
  }

  handleAddLifeEvent = () => {
    this.setState(prevState => ({
      section4: [...prevState.section4, {
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
      const updatedEvents = [...prevState.section4];
      updatedEvents.splice(index, 1);
      return {section4: updatedEvents};
    });
  }

  handleLifeEventChange(index, property, value) {
    this.setState(prevState => {
      const updatedEvents = [...prevState.section4];
      updatedEvents[index][property] = value;
      return {section4: updatedEvents};
    });
  }

  runSimulation = () => {
    const params = {
      section1: this.state.section1,
      section2: this.state.section2,
      section3: this.state.section3,
      section4: this.state.section4,
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
      section1: this.state.section1,
      section2: this.state.section2,
      section3: this.state.section3,
      section4: this.state.section4,
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
      section1: scenario.section1,
      section2: scenario.section2,
      section3: scenario.section3,
      section4: scenario.section4,
    });
  }

  resetScenario = () => {
    if (window.confirm('Are you sure you want to reset the scenario? All unsaved data will be lost.')) {
      this.setState({
        section1: {},
        section2: {},
        section3: {},
        section4: [],
      });
    }
  }



  render() {
    const assets = Object.keys(this.state.section3.assetGrowth);
    const investmentTypes = Object.keys(this.state.section2.investments);
    const orderOptions = Array.from({length: investmentTypes.length}, (_, i) => i + 1); // Generate order options based on number of types
    const errorBannerClass = this.state.showErrorBanner ? 'show' : 'hide';

    return (
      <div className="container">

        {this.state.errors.length > 0 && (
          <button className="error-icon" onClick={this.toggleErrorBanner}>⚠️</button>
        )}
        <div className={`error-banner ${errorBannerClass}`}>
          <h2>Errors and warnings</h2>
          {this.state.errors.map((error, index) => (
            <p key={index}>{error}</p>
          ))}
        </div>

        <div className="input-section">
          <h2>Section 1: Current Financial Situation</h2>
          <input type="number" placeholder="Current savings in cash" value={this.state.section1.currentSavings} onChange={(e) => this.setState(prevState => ({section1: {...prevState.section1, currentSavings: e.target.value}}))} />
          <input type="number" placeholder="Current savings in retirement accounts" value={this.state.section1.retirementAccounts} onChange={(e) => this.setState(prevState => ({section1: {...prevState.section1, retirementAccounts: e.target.value}}))} />
          <input type="number" placeholder="Current investments" value={this.state.section1.investments} onChange={(e) => this.setState(prevState => ({section1: {...prevState.section1, investments: e.target.value}}))} />
          <input type="number" placeholder="Current age" value={this.state.section1.currentAge} onChange={(e) => this.setState(prevState => ({section1: {...prevState.section1, currentAge: e.target.value}}))} />
          <input type="number" placeholder="Target retirement age" value={this.state.section1.retirementAge} onChange={(e) => this.setState(prevState => ({section1: {...prevState.section1, retirementAge: e.target.value}}))} />
          <input type="number" placeholder="Target final age" value={this.state.section1.finalAge} onChange={(e) => this.setState(prevState => ({section1: {...prevState.section1, finalAge: e.target.value}}))} />
          <input type="number" placeholder="Target cash savings" value={this.state.section1.targetSavings} onChange={(e) => this.setState(prevState => ({section1: {...prevState.section1, targetSavings: e.target.value}}))} />
        </div>

        <div className="input-section">
          <h2>Section 2: Investment Details</h2>
          <input type="number" placeholder="Disposable Income (%)" value={this.state.section2.disposableIncome} onChange={(e) => this.setState(prevState => ({section2: {...prevState.section2, disposableIncome: e.target.value}}))} />
          {investmentTypes.map(type => (
            <div key={type}>
              <label>{type}</label>
              <input type="number" placeholder="Investment (%)" value={this.state.section2.investments[type]} onChange={this.handleInvestmentChange.bind(this, type)} />
            </div>
          ))}

          {/* Implement drawdown order... */}
          {investmentTypes.map(type => (
            <div key={type}>
              {/* Other inputs... */}
              <select value={this.state.section2.drawdownOrder[type]} onChange={this.handleDrawdownOrderChange.bind(this, type)}>
                {orderOptions.map((option, index) => <option key={index} value={option}>{option}</option>)}
              </select>
            </div>
          ))}
 
        </div>
        
        <div className="input-section">
          <h2>Section 3: Economic Parameters</h2>
          <input type="number" placeholder="Inflation Rate (%)" value={this.state.section3.inflation} onChange={(e) => this.setState(prevState => ({section3: {...prevState.section3, inflation: e.target.value}}))} />
          {assets.map(asset => (
            <div key={asset}>
              <label>{asset}</label>
              <input type="number" placeholder="Growth (%)" value={this.state.section3.assetGrowth[asset]} onChange={this.handleAssetGrowthChange.bind(this, asset)} />
              <input type="number" placeholder="Variance (%)" value={this.state.section3.assetVariance[asset]} onChange={this.handleAssetVarianceChange.bind(this, asset)} />
            </div>
          ))}
        </div>

        <div className="input-section">
          <h2>Section 4: Life Events</h2>
          {this.state.section4.map((event, index) => (
            <div key={index}>
              <select value={event.type} onChange={(e) => this.handleLifeEventChange(index, 'type', e.target.value)}>
                <option value="job">Job Income</option>
                <option value="rsu">RSUs</option>
                <option value="rent">Rent Income</option>
                {/* More options... */}
              </select>
              <input type="text" placeholder="Name" value={event.name} onChange={(e) => this.handleLifeEventChange(index, 'name', e.target.value)} />
              <input type="number" placeholder="Start Year" value={event.startYear} onChange={(e) => this.handleLifeEventChange(index, 'startYear', parseInt(e.target.value, 10))} />
              <input type="number" placeholder="End Year" value={event.endYear} onChange={(e) => this.handleLifeEventChange(index, 'endYear', parseInt(e.target.value, 10))} />
              <button onClick={() => this.handleRemoveLifeEvent(index)}>Remove Event</button>
            </div>
          ))}
          <button onClick={this.handleAddLifeEvent}>Add Event</button>
        </div>


        <button onClick={this.saveScenario}>Save Scenario</button>
        <button onClick={this.loadScenario}>Load Scenario</button>
        <button onClick={this.resetScenario}>Reset Scenario</button>

        <button onClick={this.runSimulation}>Run Simulation</button>

        <div className="output-section">
          <h2>Simulation Result</h2>

          <p>{this.state.simulationResult}</p>

          <h3>Assets</h3>

          <LineChart
            width={500}
            height={300}
            data={this.state.simulationData}
            margin={{ top: 5, right: 30, left: 20, bottom: 5 }}
          >
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="year" />
            <YAxis />
            <Tooltip />
            <Legend />
            <Line type="monotone" dataKey="cash" stroke="#8884d8" />
            <Line type="monotone" dataKey="realEstate" stroke="#82ca9d" />
            {/* Add more lines for each type of asset... */}
          </LineChart>

          <h3>Cash Flow</h3>
          <LineChart
            width={500}
            height={300}
            data={this.state.cashFlowData}
            margin={{ top: 5, right: 30, left: 20, bottom: 5 }}
          >
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="year" />
            <YAxis />
            <Tooltip />
            <Legend />
            <Line type="monotone" dataKey="jobIncome" stroke="#8884d8" stackId="a" />
            <Line type="monotone" dataKey="rentIncome" stroke="#82ca9d" stackId="a" />
            {/* Add more lines for each source of income... */}
            <Line type="monotone" dataKey="expenses" stroke="#ff7300" dot={false} strokeDasharray="5 5" />
          </LineChart>

        </div>


      </div>
    );
  }


}

export default FinancialPlanner;


function run(params) {
  // The body of this function would perform the simulation based on the params and return a result.
  return 'Simulation result...';
}

ReactDOM.render(<FinancialPlanner />, document.getElementById('app'));

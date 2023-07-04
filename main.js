class FinancialSimulator extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            savings: 0,
            lifeEventType: '',
            year: 0,
            data: []
        };
    }

    // method to handle input change
    handleChange(e) {
        this.setState({ [e.target.name]: e.target.value });
    }

    // method to handle simulation
    handleSimulation() {
        // run simulation here, create your own algorithm.
        // For simplicity, we're just populating an array with savings data.
        let data = [];
        for (let i = 0; i < 10; i++) {
            data.push({year: this.state.year + i, savings: this.state.savings + (i * 1000)});
        }
        this.setState({ data: data });
    }

    // method to save scenario
    handleSave() {
        localStorage.setItem('scenario', JSON.stringify(this.state));
    }

    // method to load scenario
    handleLoad() {
        let scenario = JSON.parse(localStorage.getItem('scenario'));
        this.setState(scenario);
    }

    render() {
        return (
            <div className="container">
                <div className="input-section">
                    <input type="number" name="savings" onChange={e => this.handleChange(e)} placeholder="Current Savings" />
                    <select name="lifeEventType" onChange={e => this.handleChange(e)}>
                        <option value="">Select Life Event</option>
                        <option value="Type1">Type1</option>
                        <option value="Type2">Type2</option>
                    </select>
                    <input type="number" name="year" onChange={e => this.handleChange(e)} placeholder="Year" />
                    <button onClick={() => this.handleSimulation()}>Run Simulation</button>
                    <button onClick={() => this.handleSave()}>Save Scenario</button>
                    <button onClick={() => this.handleLoad()}>Load Scenario</button>
                </div>
                <div className="output-section">
                    {/* Replace this div with your line graph */}
                    <div className="graph">
                        {
                            this.state.data.map((item, index) => (
                                <div key={index}>
                                    <span>Year: {item.year}, Savings: {item.savings}</span>
                                </div>
                            ))
                        }
                    </div>
                </div>
            </div>
        );
    }
}

ReactDOM.render(<FinancialSimulator />, document.getElementById('app'));


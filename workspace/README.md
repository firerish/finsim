Based on the requirements, here are the core classes, functions, and methods that will be necessary:

1. Frontend:
   - App: The main component that renders the entire application.
   - InputSection: A component that renders an input section.
   - OutputSection: A component that renders an output section.
   - SimulationResult: A component that renders the result of the simulation.
   - Graph: A component that renders a stacked line graph.
   - ErrorsAndWarnings: A component that displays errors and warnings.
   - ScenarioList: A component that displays a list of saved scenarios.
   - ScenarioItem: A component that renders an item in the scenario list.
   - ScenarioForm: A component that allows the user to save a scenario.
   - SimulationService: A service that handles communication with the backend and runs the simulation.
   - ApiService: A service that handles API requests to the backend.
   - PDFService: A service that handles exporting scenarios to PDF.

2. Backend:
   - Server: The main server file that handles API requests.
   - SimulationController: A controller that handles the simulation request.
   - SimulationService: A service that runs the simulation.
   - ValidationService: A service that validates the input parameters.
   - PDFService: A service that generates PDF reports.

Now let's proceed with the file structure and code implementation.

1. Frontend:

**index.js**

function simulate(savings, eventType, eventYear) {
  // Simulation logic goes here
  return [{x: [0, 1, 2], y: [savings, savings * 1.1, savings * 1.2], type: 'scatter', name: 'Type1'},
          {x: [0, 1, 2], y: [savings, savings * 1.2, savings * 1.4], type: 'scatter', name: 'Type2'}];
}


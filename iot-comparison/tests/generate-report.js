const testResults = require('./performance.js');
const visualize = require('./visualize.js');

// Run tests and generate visuals
(async () => {
  const results = await testResults();
    await visualize(results);
    })();
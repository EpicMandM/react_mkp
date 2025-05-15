// This is a direct utility to force initialize courses in Firebase
// Using CommonJS module format for compatibility

// Load environment variables from .env for Firebase config
require('dotenv').config();
// Register ts-node to handle TypeScript imports
require('ts-node').register({
  transpileOnly: true,
  // Ensure TypeScript modules are compiled to CommonJS for Node require
  compilerOptions: {
    module: 'commonjs'
  }
});
// Import the initializer and reset helper from mockData.ts
// Omit file extension so ts-node can resolve the TypeScript module
const { initializeData, resetDatabase } = require('../services/mockData');

// Force reset existing data, then (re)initialize mock data
resetDatabase()
  .then(() => initializeData())
  .then(() => {
    console.log('Mock data initialized successfully');
    process.exit(0);
  })
  .catch(error => {
    console.error('Error initializing mock data:', error);
    process.exit(1);
  });

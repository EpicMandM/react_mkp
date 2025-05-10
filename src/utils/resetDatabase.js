// This utility script can be run to reset the database for testing
import { resetDatabase, initializeData } from '../services/mockData';

const main = async () => {
  console.log('Starting database reset...');
  
  try {
    await resetDatabase();
    console.log('Database reset completed. Reinitializing with mock data...');
    
    await initializeData();
    console.log('Mock data initialization completed. Database reset successful!');
  } catch (error) {
    console.error('Error in database reset process:', error);
  }
};

main();

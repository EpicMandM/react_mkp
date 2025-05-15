#!/usr/bin/env node
// filepath: src/utils/clearProgress.js
// Utility to clear all user progress documents from Firestore

require('dotenv').config();
require('ts-node').register({
  transpileOnly: true,
  compilerOptions: { module: 'commonjs' }
});

const { db } = require('../services/firebase');
const { collection, getDocs, deleteDoc } = require('firebase/firestore');

async function clearProgress() {
  console.log('Clearing all user progress...');
  const userProgCol = collection(db, 'userProgress');
  const snapshot = await getDocs(userProgCol);
  if (snapshot.empty) {
    console.log('No user progress to delete.');
    return;
  }

  const deleteOps = snapshot.docs.map(doc => deleteDoc(doc.ref));
  await Promise.all(deleteOps);
  console.log(`Deleted ${deleteOps.length} user progress document(s).`);
}

clearProgress()
  .then(() => process.exit(0))
  .catch(error => {
    console.error('Error clearing progress:', error);
    process.exit(1);
  });

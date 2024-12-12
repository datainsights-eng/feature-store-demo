import React from 'react';
import FeatureStoreDemo from './components/FeatureStoreDemo';
import './App.css';

function App() {
  return (
    <div className="app-container">
      <header className="header">
        <h1 className="text-2xl font-bold">Feature Store Performance Demo</h1>
      </header>
      <main className="max-w-7xl mx-auto py-6 sm:px-6 lg:px-8">
        <FeatureStoreDemo />
      </main>
    </div>
  );
}

export default App;
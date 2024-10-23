// frontend/src/App.js

import React, { useState } from 'react';
import axios from 'axios';
import AssessmentForm from './components/AssessmentForm';
import ProgramList from './components/ProgramList';
import './styles.css';

function App() {
  const [eligiblePrograms, setEligiblePrograms] = useState(null);
  const [error, setError] = useState(null); // To handle errors

  const handleAssessmentSubmit = (responses) => {
    const backendURL = process.env.REACT_APP_BACKEND_URL || 'http://localhost:5000';

    axios.post(`${backendURL}/api/assessment/evaluate`, responses)
      .then(response => {
        setEligiblePrograms(response.data);
        setError(null); // Reset error state
      })
      .catch(error => {
        console.error("There was an error evaluating the assessment!", error);
        setError("An error occurred while processing your request. Please try again later.");
      });
  };

  const handleRestart = () => {
    setEligiblePrograms(null);
    setError(null);
  };

  return (
    <div className="App">
      <h1>Government Programs Recommender</h1>
      {error && <p className="error-message">{error}</p>}
      {!eligiblePrograms ? (
        <AssessmentForm onSubmit={handleAssessmentSubmit} />
      ) : (
        <div>
          <ProgramList eligiblePrograms={eligiblePrograms} />
          <button onClick={handleRestart} style={{ marginTop: '20px' }}>Restart Assessment</button>
        </div>
      )}
    </div>
  );
}

export default App;

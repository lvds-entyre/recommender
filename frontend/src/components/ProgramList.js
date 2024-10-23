// frontend/src/components/ProgramList.js

import React, { useEffect, useState } from 'react';
import axios from 'axios';

const ProgramList = ({ eligiblePrograms }) => {
  const [programDetails, setProgramDetails] = useState([]);

  useEffect(() => {
    if (eligiblePrograms.length === 0) return;

    const backendURL = process.env.REACT_APP_BACKEND_URL || 'http://localhost:5000';
    axios.get(`${backendURL}/api/programs`)
      .then(response => {
        const details = response.data.filter(program => 
          eligiblePrograms.some(ep => ep.name === program.name)
        );
        setProgramDetails(details);
      })
      .catch(error => {
        console.error("There was an error fetching the programs!", error);
      });
  }, [eligiblePrograms]);

  if (programDetails.length === 0) {
    return <p>No eligible programs found based on your responses.</p>;
  }

  return (
    <div>
      <h2>Eligible Programs</h2>
      {programDetails.map(program => (
        <div key={program.id} className="program-card">
          <h3>{program.name}</h3>
          <p>{program.description}</p>
          <a href="#" onClick={(e) => { e.preventDefault(); alert(`Further information for ${program.name}`); }}>Further Information</a>
          {/* You can replace the alert with a modal or redirect to a detailed page */}
        </div>
      ))}
    </div>
  );
};

export default ProgramList;

import React, { useEffect, useState } from 'react';
import axios from 'axios';
import './ProgramList.css'; // Optional: For styling

const ProgramList = ({ eligiblePrograms }) => {
  const [programDetails, setProgramDetails] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);

  useEffect(() => {
    if (eligiblePrograms.length === 0) {
      setLoading(false);
      return;
    }

    const fetchProgramDetails = async () => {
      try {
        const backendURL = process.env.REACT_APP_BACKEND_URL || 'http://localhost:5000';
        const response = await axios.get(`${backendURL}/api/programs`);

        // Ensure response.data is the array of programs
        const programsData = response.data; // Adjust if your backend wraps it in an object

        // Filter programs that are eligible
        const details = programsData.filter(program => 
          eligiblePrograms.some(ep => ep.name === program.name)
        );

        setProgramDetails(details);
        setLoading(false);
      } catch (err) {
        console.error("Error fetching program details:", err);
        setError(true);
        setLoading(false);
      }
    };

    fetchProgramDetails();
  }, [eligiblePrograms]);

  if (loading) {
    return <p>Loading eligible programs...</p>;
  }

  if (error) {
    return <p>There was an error fetching the eligible programs. Please try again later.</p>;
  }

  if (programDetails.length === 0) {
    return <p>No eligible programs found based on your responses.</p>;
  }

  return (
    <div className="program-list">
      <h2>Eligible Programs</h2>
      {programDetails.map(program => (
        <div key={program.id} className="program-card">
          <h3>{program.name}</h3>
          <p><strong>Description:</strong> {program.description}</p>

          {program.coverage && (
            <div className="program-section">
              <h4>Coverage:</h4>
              {/* Render coverage as structured data */}
              {typeof program.coverage === 'object' ? (
                <div>
                  {Object.entries(program.coverage).map(([key, value]) => (
                    <p key={key}><strong>{key}:</strong> {value}</p>
                  ))}
                </div>
              ) : (
                <p>{program.coverage}</p>
              )}
            </div>
          )}

          {program.eligibility && (
            <div className="program-section">
              <h4>Eligibility:</h4>
              <p>{program.eligibility}</p>
            </div>
          )}

          {program.applicationProcess && (
            <div className="program-section">
              <h4>How to Apply:</h4>
              <p>{program.applicationProcess}</p>
            </div>
          )}

          {program.requiredDocuments && program.requiredDocuments.length > 0 && (
            <div className="program-section">
              <h4>Required Documents:</h4>
              <ul>
                {program.requiredDocuments.map((doc, index) => (
                  <li key={index}>{doc}</li>
                ))}
              </ul>
            </div>
          )}

          {program.usefulLinks && program.usefulLinks.length > 0 && (
            <div className="program-section">
              <h4>Useful Links:</h4>
              <ul>
                {program.usefulLinks.map((link, index) => (
                  <li key={index}>
                    <a href={link.url} target="_blank" rel="noopener noreferrer">{link.text}</a>
                  </li>
                ))}
              </ul>
            </div>
          )}

          {/* Optional: Further Information Button */}
          {/* <button onClick={() => alert(`Further information for ${program.name}`)}>Further Information</button> */}
        </div>
      ))}
    </div>
  );
};

export default ProgramList;

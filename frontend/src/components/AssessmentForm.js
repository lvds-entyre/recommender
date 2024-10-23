// frontend/src/components/AssessmentForm.js

import React, { useState, useEffect } from 'react';
import axios from 'axios';

const AssessmentForm = ({ onSubmit }) => {
  const [questions, setQuestions] = useState([]);
  const [responses, setResponses] = useState({});

  useEffect(() => {
    // Fetch questions from the backend
    const backendURL = process.env.REACT_APP_BACKEND_URL || 'http://localhost:5000';
    axios.get(`${backendURL}/api/assessment/questions`)
      .then(response => {
        setQuestions(response.data);
      })
      .catch(error => {
        console.error("There was an error fetching the questions!", error);
      });
  }, []);

  const handleChange = (field, value) => {
    setResponses(prev => ({
      ...prev,
      [field]: value
    }));
  };

  const handleMultipleChange = (field, option) => {
    setResponses(prev => {
      const prevOptions = prev[field] || [];
      if (prevOptions.includes(option)) {
        return { ...prev, [field]: prevOptions.filter(o => o !== option) };
      } else {
        return { ...prev, [field]: [...prevOptions, option] };
      }
    });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    // Optional: Validate all required fields are filled
    onSubmit(responses);
  };

  return (
    <form onSubmit={handleSubmit}>
      {questions.map(question => (
        <div key={question.id} className="question-section">
          <h3>{question.question}</h3>
          {question.inputType === "single" && (
            <div>
              {question.options.split(',').map(option => (
                <label key={option} style={{ marginRight: '10px' }}>
                  <input
                    type="radio"
                    name={question.field}
                    value={option}
                    checked={responses[question.field] === option}
                    onChange={(e) => handleChange(question.field, e.target.value)}
                    required={question.field === "isResident"} // Make 'isResident' required
                  />
                  {option}
                </label>
              ))}
            </div>
          )}
          {question.inputType === "number" && (
            <input
              type="number"
              name={question.field}
              value={responses[question.field] || ''}
              onChange={(e) => handleChange(question.field, e.target.value)}
              required
              min="0"
            />
          )}
          {question.inputType === "multiple" && (
            <div>
              {question.options.split(',').map(option => (
                <label key={option} style={{ marginRight: '10px' }}>
                  <input
                    type="checkbox"
                    name={question.field}
                    value={option}
                    checked={responses[question.field]?.includes(option) || false}
                    onChange={() => handleMultipleChange(question.field, option)}
                  />
                  {option}
                </label>
              ))}
            </div>
          )}
          {/* Add other input types as needed */}
          {question.explanation && (
            <small style={{ display: 'block', marginTop: '5px', color: '#555' }}>
              {question.explanation}
            </small>
          )}
        </div>
      ))}
      <button type="submit">Submit Assessment</button>
    </form>
  );
};

export default AssessmentForm;

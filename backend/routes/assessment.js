// backend/routes/assessment.js

const express = require('express');
const router = express.Router();
const sqlite3 = require('sqlite3').verbose();
const path = require('path');

// Initialize Database
const dbPath = path.resolve(__dirname, '..', 'db', 'database.sqlite');
const db = new sqlite3.Database(dbPath, (err) => {
  if (err) {
    console.error("Error opening database:", err.message);
  } else {
    console.log("Connected to SQLite database.");
  }
});

// GET /api/assessment/questions - Fetch all assessment questions
router.get('/questions', (req, res) => {
  db.all("SELECT * FROM Questions ORDER BY id ASC", [], (err, rows) => {
    if (err) {
      res.status(500).json({ error: err.message });
      return;
    }
    res.json(rows);
  });
});

// POST /api/assessment/evaluate - Evaluate user responses and return eligible programs
router.post('/evaluate', async (req, res) => {
  const responses = req.body; // Expected to be an object with key as question field and value as response

  try {
    // Fetch all programs
    const programs = await new Promise((resolve, reject) => {
      db.all("SELECT * FROM Programs", [], (err, rows) => {
        if (err) {
          reject(err);
        } else {
          resolve(rows);
        }
      });
    });

    let eligiblePrograms = [];

    // Iterate through each program and evaluate eligibility
    for (const program of programs) {
      // Fetch all question fields linked to this program
      const mappings = await new Promise((resolve, reject) => {
        db.all("SELECT questionField FROM Question_Program_Mappings WHERE programName = ?", [program.name], (err, rows) => {
          if (err) {
            reject(err);
          } else {
            resolve(rows);
          }
        });
      });

      let isEligible = true;
      let detailedReasons = [];

      for (const mapping of mappings) {
        const field = mapping.questionField;
        const answer = responses[field];

        // Fetch question details
        const question = await new Promise((resolve, reject) => {
          db.get("SELECT * FROM Questions WHERE field = ?", [field], (err, row) => {
            if (err) {
              reject(err);
            } else {
              resolve(row);
            }
          });
        });

        // Implement specific eligibility checks based on question field and answer
        switch (field) {
          case "isResident":
            if (answer !== "Yes") {
              isEligible = false;
              detailedReasons.push("Must be a resident of Massachusetts.");
            }
            break;

          case "age":
            const age = parseInt(answer, 10);
            if (program.name === "Emergency Aid to the Elderly, Disabled, and Children (EAEDC)" && age < 65) {
              isEligible = false;
              detailedReasons.push("Must be 65 years or older for EAEDC.");
            }
            // Add other age-based criteria as needed
            break;

          case "hasDisability":
            if (["Emergency Aid to the Elderly, Disabled, and Children (EAEDC)", "Prescription Advantage Program", "Massachusetts Home Care Program", "Regional Transit Authorities (RTA) Services", "Adult Day Health Program"].includes(program.name) && answer !== "Yes") {
              isEligible = false;
              detailedReasons.push(`Must have a disability for ${program.name}.`);
            }
            break;

          case "householdSize":
            // Example: Implement minimum household size if applicable
            const householdSize = parseInt(answer, 10);
            // Define any household size criteria if needed
            break;

          case "householdAnnualIncome":
            const income = parseFloat(answer);
            // Define actual income limits for each program
            const incomeLimits = {
              "Low Income Home Energy Assistance Program (LIHEAP)": 30000,
              "Massachusetts Rental Voucher Program (MRVP)": 40000,
              "Supplemental Nutrition Assistance Program (SNAP)": 35000,
              "Transitional Aid to Families with Dependent Children (TAFDC)": 32000,
              "Chapter 115 Veterans' Benefits": 45000,
              "Prescription Advantage Program": 50000,
              "Massachusetts Home Care Program": 55000,
              "Good Neighbor Energy Fund": 30000,
              "Adult Day Health Program": 40000
              // Add other programs as needed
            };
            if (income > (incomeLimits[program.name] || Infinity)) {
              isEligible = false;
              detailedReasons.push(`Household income exceeds the limit for ${program.name}.`);
            }
            break;

          case "totalAssets":
            const assets = parseFloat(answer);
            const assetLimits = {
              "Massachusetts Rental Voucher Program (MRVP)": 20000,
              "Chapter 115 Veterans' Benefits": 25000
            };
            if (assets > (assetLimits[program.name] || Infinity)) {
              isEligible = false;
              detailedReasons.push(`Total assets exceed the limit for ${program.name}.`);
            }
            break;

          case "hasDependents":
            if (program.name === "Transitional Aid to Families with Dependent Children (TAFDC)" && answer !== "Yes") {
              isEligible = false;
              detailedReasons.push("Must have dependent children for TAFDC.");
            }
            break;

          case "citizenshipStatus":
            if (["Supplemental Nutrition Assistance Program (SNAP)", "Transitional Aid to Families with Dependent Children (TAFDC)"].includes(program.name)) {
              if (answer === "Other") {
                isEligible = false;
                detailedReasons.push(`Must be a U.S. Citizen or Legal Non-Citizen for ${program.name}.`);
              }
            }
            break;

          case "assistancePrograms":
            if (program.name === "Massachusetts Rental Voucher Program (MRVP)" && (!answer || answer.length === 0)) {
              isEligible = false;
              detailedReasons.push("Must be enrolled in at least one assistance program for MRVP.");
            }
            if (program.name === "Regional Transit Authorities (RTA) Services" && (!answer || answer.length === 0)) {
              isEligible = false;
              detailedReasons.push("Must be enrolled in at least one assistance program for RTA Services.");
            }
            break;

          case "veteranStatus":
            if (program.name === "Chapter 115 Veterans' Benefits" && answer !== "Yes") {
              isEligible = false;
              detailedReasons.push("Must be a veteran with at least 90 days of active duty and an honorable discharge for Chapter 115 Veterans' Benefits.");
            }
            break;

          case "canUsePublicTransport":
            if (program.name === "Regional Transit Authorities (RTA) Services" && answer !== "Yes") {
              isEligible = false;
              detailedReasons.push("Must be unable to use public or private transportation for RTA Services.");
            }
            break;

          case "needForTransportation":
            if (program.name === "MassHealth Transportation Program" && answer !== "Yes") {
              isEligible = false;
              detailedReasons.push("Must need transportation services for MassHealth Transportation Program.");
            }
            break;

          case "needAssistanceADLs":
            if (["Massachusetts Home Care Program", "Adult Day Health Program"].includes(program.name) && answer !== "Yes") {
              isEligible = false;
              detailedReasons.push(`Must need assistance with ADLs for ${program.name}.`);
            }
            break;

          default:
            break;
        }
      }

      if (isEligible) {
        eligiblePrograms.push({
          name: program.name,
          description: program.description
        });
      }
    }

    res.json(eligiblePrograms);

  } catch (error) {
    console.error("Error during eligibility evaluation:", error);
    res.status(500).json({ error: "Error during eligibility evaluation." });
  }
});

module.exports = router;

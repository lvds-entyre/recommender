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
      console.error("Error fetching questions:", err.message);
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
            if (isNaN(age)) {
              isEligible = false;
              detailedReasons.push("Age must be a valid number.");
              break;
            }
            if (program.name === "Emergency Aid to the Elderly, Disabled, and Children (EAEDC)" && age < 65) {
              isEligible = false;
              detailedReasons.push("Must be 65 years or older for EAEDC.");
            }
            if (program.name === "Senior Farmers’ Market Nutrition Program (SFMNP)" && age < 60) {
              isEligible = false;
              detailedReasons.push("Must be 60 years or older for SFMNP.");
            }
            break;

          case "hasDisability":
            if (
              ["Emergency Aid to the Elderly, Disabled, and Children (EAEDC)", "Prescription Advantage Program", "Massachusetts Home Care Program", "Regional Transit Authorities (RTA) Services", "Adult Day Health Program", "Massachusetts Home Modification Loan Program (HMLP)", "Section 8 Housing Choice Voucher Program"].includes(program.name) &&
              answer !== "Yes"
            ) {
              isEligible = false;
              detailedReasons.push(`Must have a disability for ${program.name}.`);
            }
            break;

          case "householdSize":
            // Implement any specific household size criteria if needed
            break;

          case "householdAnnualIncome":
            const income = parseFloat(answer);
            if (isNaN(income)) {
              isEligible = false;
              detailedReasons.push("Household annual income must be a valid number.");
              break;
            }
            // Define actual income limits for each program
            const incomeLimits = {
              "Low Income Home Energy Assistance Program (LIHEAP)": {
                1: 49196,
                2: 64333,
                4: 94608
              },
              "Massachusetts Rental Voucher Program (MRVP)": 40000, // Placeholder
              "Supplemental Nutrition Assistance Program (SNAP)": 35000,
              "Transitional Aid to Families with Dependent Children (TAFDC)": 32000,
              "Chapter 115 Veterans' Benefits": 45000,
              "Prescription Advantage Program": 50000,
              "Massachusetts Home Care Program": 55000,
              "Good Neighbor Energy Fund": 30000,
              "Adult Day Health Program": 40000,
              "WIC": 185 * 12 * 1000 / 12, // Example calculation for FPL
              "MassHealth (Medicaid)": 133 * 12 * 1000 / 1000, // Example FPL percentage
              "Health Safety Net (HSN)": 400 * 12 * 1000 / 1000, // Example FPL percentage
              "Commonwealth Care": 300 * 12 * 1000 / 1000, // Example FPL percentage
              // Add other programs as needed
            };
            if (program.name === "Low Income Home Energy Assistance Program (LIHEAP)") {
              const size = parseInt(responses.householdSize, 10);
              const limit = (incomeLimits[program.name] && incomeLimits[program.name][size]) ? incomeLimits[program.name][size] : Infinity;
              if (income > limit) {
                isEligible = false;
                detailedReasons.push(`Household income exceeds the limit for ${program.name}.`);
              }
            } else if (income > (incomeLimits[program.name] || Infinity)) {
              isEligible = false;
              detailedReasons.push(`Household income exceeds the limit for ${program.name}.`);
            }
            break;

          case "totalAssets":
            const assets = parseFloat(answer);
            if (isNaN(assets)) {
              isEligible = false;
              detailedReasons.push("Total assets must be a valid number.");
              break;
            }
            const assetLimits = {
              "Massachusetts Rental Voucher Program (MRVP)": 25000,
              "Chapter 115 Veterans' Benefits": 16600,
              // "Massachusetts Home Modification Loan Program (HMLP)": 0, // No asset limit
              // Add other programs as needed
            };
            if (program.name === "Massachusetts Rental Voucher Program (MRVP)") {
              const incomeForAssetLimit = parseFloat(responses.householdAnnualIncome);
              if (isNaN(incomeForAssetLimit)) {
                isEligible = false;
                detailedReasons.push("Household annual income must be a valid number for asset calculation.");
                break;
              }
              const incomeBasedLimit = 1.5 * incomeForAssetLimit;
              const maxAssetLimit = assetLimits[program.name] || Infinity;
              const applicableLimit = Math.max(incomeBasedLimit, maxAssetLimit);
              if (assets > applicableLimit) {
                isEligible = false;
                detailedReasons.push(`Total assets exceed the limit for ${program.name}.`);
              }
            } else if (assets > (assetLimits[program.name] || Infinity)) {
              isEligible = false;
              detailedReasons.push(`Total assets exceed the limit for ${program.name}.`);
            }
            break;

          case "hasDependents":
            if (program.name === "Transitional Aid to Families with Dependent Children (TAFDC)" && answer !== "Yes") {
              isEligible = false;
              detailedReasons.push("Must have dependent children for TAFDC.");
            }
            if (program.name === "Supplemental Nutrition Assistance Program (SNAP)" && answer !== "Yes") {
              // SNAP doesn't require dependents unless specified
              // Depending on criteria, adjust accordingly
            }
            if (program.name === "Massachusetts Child Support Enforcement Division (CSE)" && answer !== "Yes") {
              isEligible = false;
              detailedReasons.push("Must be a parent seeking child support enforcement.");
            }
            break;

          case "citizenshipStatus":
            if (["Supplemental Nutrition Assistance Program (SNAP)", "Transitional Aid to Families with Dependent Children (TAFDC)", "Section 8 Housing Choice Voucher Program"].includes(program.name)) {
              if (answer === "Other" || !["U.S. Citizen", "Legal Non-Citizen"].includes(answer)) {
                isEligible = false;
                detailedReasons.push(`Must be a U.S. Citizen or Legal Non-Citizen for ${program.name}.`);
              }
            }
            break;

          case "assistancePrograms":
            console.log(`Processing assistancePrograms for program: ${program.name}`);
            console.log(`User response:`, answer);

            if (program.name === "Massachusetts Rental Voucher Program (MRVP)" && (!answer || answer.length === 0)) {
              isEligible = false;
              detailedReasons.push("Must be enrolled in at least one assistance program for MRVP.");
            }
            if (program.name === "Regional Transit Authorities (RTA) Services" && (!answer || answer.length === 0)) {
              isEligible = false;
              detailedReasons.push("Must be enrolled in at least one assistance program for RTA Services.");
            }
            if (program.name === "Workforce Training Fund Program (WTFP)" && (!answer || answer.length === 0)) {
              isEligible = false;
              detailedReasons.push("Must be employed or attending school full-time for WTFP.");
            }
            if (program.name === "Section 8 Housing Choice Voucher Program") {
              const eligibleAssistancePrograms = ["SNAP", "SSI", "MassHealth", "TAFDC"];
              const userAssistancePrograms = Array.isArray(answer) ? answer : [];
              if (!eligibleAssistancePrograms.some(ap => userAssistancePrograms.includes(ap))) {
                isEligible = false;
                detailedReasons.push("Must be enrolled in at least one assistance program for Section 8 Housing Choice Voucher Program.");
              }
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

          // New Cases
          case "isHomeless":
            if (["Emergency Housing Assistance Program", "Low Income Home Energy Assistance Program (LIHEAP)"].includes(program.name) && answer !== "Yes") {
              isEligible = false;
              detailedReasons.push(`Must be homeless or at risk for ${program.name}.`);
            }
            break;

          case "hasYoungChildren":
            if (["Women, Infants, and Children (WIC)", "Massachusetts Head Start Program"].includes(program.name) && answer !== "Yes") {
              isEligible = false;
              detailedReasons.push(`Must have young children under 5 for ${program.name}.`);
            }
            break;

          case "isPregnant":
            if (["Women, Infants, and Children (WIC)", "Massachusetts Head Start Program"].includes(program.name) && answer !== "Yes") {
              isEligible = false;
              detailedReasons.push(`Must be pregnant for ${program.name}.`);
            }
            break;

          case "isEmployedOrInSchool":
            if (["Massachusetts Child Care Voucher Program", "Workforce Training Fund Program (WTFP)"].includes(program.name) && answer !== "Yes") {
              isEligible = false;
              detailedReasons.push(`Must be employed or attending school full-time for ${program.name}.`);
            }
            break;

          case "ownsHome":
            if (["Massachusetts Home Modification Loan Program (HMLP)"].includes(program.name) && answer !== "Yes") {
              isEligible = false;
              detailedReasons.push(`Must own a home or have landlord permission for ${program.name}.`);
            }
            break;

          case "isEnrolledInMassHealthAndMedicare":
            if (["Senior Care Options (SCO)"].includes(program.name) && answer !== "Yes") {
              isEligible = false;
              detailedReasons.push(`Must be enrolled in both MassHealth and Medicare for ${program.name}.`);
            }
            break;

          case "isParentSeekingChildSupport":
            if (["Massachusetts Child Support Enforcement Division (CSE)"].includes(program.name) && answer !== "Yes") {
              isEligible = false;
              detailedReasons.push(`Must be a parent seeking child support enforcement for ${program.name}.`);
            }
            break;

          case "hasWorkedInMA":
            if (["Unemployment Insurance (UI)"].includes(program.name) && answer !== "Yes") {
              isEligible = false;
              detailedReasons.push(`Must have worked in Massachusetts and meet residency criteria for ${program.name}.`);
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

// backend/initDB.js

const sqlite3 = require('sqlite3').verbose();
const db = new sqlite3.Database('./db/database.sqlite');

db.serialize(() => {
  // Drop existing tables if they exist (optional, for re-initialization)
  db.run(`DROP TABLE IF EXISTS Question_Program_Mappings`);
  db.run(`DROP TABLE IF EXISTS Questions`);
  db.run(`DROP TABLE IF EXISTS Programs`);

  // Create Questions Table
  db.run(`
    CREATE TABLE IF NOT EXISTS Questions (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      field TEXT UNIQUE,
      question TEXT,
      inputType TEXT,
      options TEXT,
      linkedPrograms TEXT,
      section TEXT,
      purpose TEXT,
      explanation TEXT
    )
  `);

  // Create Programs Table
  db.run(`
    CREATE TABLE IF NOT EXISTS Programs (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      name TEXT UNIQUE,
      description TEXT
    )
  `);

  // Create Question_Program_Mappings Table
  db.run(`
    CREATE TABLE IF NOT EXISTS Question_Program_Mappings (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      questionField TEXT,
      programName TEXT
    )
  `);

  // Seed Programs
  const programs = [
    {
      name: "Low Income Home Energy Assistance Program (LIHEAP)",
      description: "Helps eligible households pay for heating costs, ensuring that residents can maintain safe and comfortable living conditions during the heating season."
    },
    {
      name: "Massachusetts Rental Voucher Program (MRVP)",
      description: "Provides rental assistance to low-income families and individuals, helping them secure stable and affordable housing in Massachusetts."
    },
    {
      name: "Supplemental Nutrition Assistance Program (SNAP)",
      description: "Offers nutrition benefits to supplement the food budget of needy families, ensuring access to adequate and nutritious food."
    },
    {
      name: "Transitional Aid to Families with Dependent Children (TAFDC)",
      description: "Provides financial assistance and employment services to needy families with children, supporting their transition to self-sufficiency."
    },
    {
      name: "Emergency Aid to the Elderly, Disabled, and Children (EAEDC)",
      description: "Delivers emergency financial assistance to elderly individuals, disabled persons, and children in need, addressing urgent financial crises."
    },
    {
      name: "Chapter 115 Veterans' Benefits",
      description: "Offers benefits to veterans and their dependents, recognizing their service and providing necessary support for their well-being."
    },
    {
      name: "Prescription Advantage Program",
      description: "Helps cover gaps in Medicare Part D and provides prescription drug benefits, ensuring that beneficiaries have access to necessary medications."
    },
    {
      name: "Massachusetts Home Care Program",
      description: "Provides in-home care services to eligible individuals, allowing them to receive necessary medical and personal care within the comfort of their homes."
    },
    {
      name: "Good Neighbor Energy Fund",
      description: "Offers financial assistance for energy bills to eligible households facing financial difficulties, helping them manage their energy costs effectively."
    },
    {
      name: "Regional Transit Authorities (RTA) Services",
      description: "Provides transportation services for eligible individuals, including reduced fares and paratransit services for those with disabilities or transportation challenges."
    },
    {
      name: "Adult Day Health Program",
      description: "Supplies health and personal care services during the day for eligible adults, supporting their health needs while allowing them to remain in their communities."
    },
    {
      name: "MassHealth Transportation Program",
      description: "Offers transportation services for MassHealth members who need to reach medical appointments, ensuring they have reliable access to necessary healthcare facilities."
    }
  ];

  const insertProgram = db.prepare(`INSERT OR IGNORE INTO Programs (name, description) VALUES (?, ?)`);
  programs.forEach(program => {
    insertProgram.run(program.name, program.description);
  });
  insertProgram.finalize();

  // Seed Questions
  const questions = [
    {
      field: "isResident",
      question: "Are you a resident of Massachusetts?",
      inputType: "single",
      options: "Yes,No",
      linkedPrograms: "All Programs",
      section: "Personal Information",
      purpose: "Ensures that only Massachusetts residents are considered for the assistance programs.",
      explanation: "Most assistance programs require applicants to be residents of Massachusetts to qualify."
    },
    {
      field: "age",
      question: "What is your age?",
      inputType: "number",
      options: "",
      linkedPrograms: "EAEDC, Prescription Advantage Program, Massachusetts Home Care Program, Good Neighbor Energy Fund, Adult Day Health Program",
      section: "Personal Information",
      purpose: "Determines eligibility based on age-specific criteria.",
      explanation: "Certain programs target specific age groups (e.g., seniors, adults requiring day health services)."
    },
    {
      field: "hasDisability",
      question: "Do you have a disability that impedes your ability to work or live independently?",
      inputType: "single",
      options: "Yes,No",
      linkedPrograms: "EAEDC, Chapter 115 Veterans' Benefits, Prescription Advantage Program, Massachusetts Home Care Program, RTA Services, Adult Day Health Program",
      section: "Personal Information",
      purpose: "Identifies eligibility for programs requiring disability status.",
      explanation: "Programs like EAEDC and Prescription Advantage require applicants to have disabilities affecting their daily living or employment."
    },
    {
      field: "householdSize",
      question: "How many people are in your household?",
      inputType: "number",
      options: "",
      linkedPrograms: "LIHEAP, MRVP, SNAP, TAFDC, Chapter 115 Veterans' Benefits, Good Neighbor Energy Fund",
      section: "Household Information",
      purpose: "Adjusts income and asset limits based on household size.",
      explanation: "Many programs have income thresholds that vary with the number of household members."
    },
    {
      field: "householdAnnualIncome",
      question: "What is your household's annual income?",
      inputType: "number",
      options: "",
      linkedPrograms: "LIHEAP, MRVP, SNAP, TAFDC, Chapter 115 Veterans' Benefits, Prescription Advantage Program, Massachusetts Home Care Program, Good Neighbor Energy Fund, Adult Day Health Program",
      section: "Household Information",
      purpose: "Determines eligibility based on income thresholds.",
      explanation: "Each program has specific income limits that applicants must not exceed to qualify."
    },
    {
      field: "totalAssets",
      question: "What is the total value of your assets?",
      inputType: "number",
      options: "",
      linkedPrograms: "MRVP, Chapter 115 Veterans' Benefits",
      section: "Household Information",
      purpose: "Checks asset limits for eligibility.",
      explanation: "Some programs impose asset restrictions to ensure assistance targets those with limited resources."
    },
    {
      field: "hasDependents",
      question: "Do you have dependent children?",
      inputType: "single",
      options: "Yes,No",
      linkedPrograms: "TAFDC",
      section: "Dependents and Citizenship",
      purpose: "Identifies eligibility for programs requiring dependents.",
      explanation: "TAFDC specifically assists families with dependent children."
    },
    {
      field: "citizenshipStatus",
      question: "What is your citizenship status?",
      inputType: "single",
      options: "U.S. Citizen,Legal Non-Citizen,Other",
      linkedPrograms: "SNAP,TAFDC",
      section: "Dependents and Citizenship",
      purpose: "Determines eligibility based on citizenship requirements.",
      explanation: "Some programs require applicants to be U.S. citizens or legal non-citizens."
    },
    {
      field: "assistancePrograms",
      question: "Are you enrolled in any of the following assistance programs? (Select all that apply)",
      inputType: "multiple",
      options: "SNAP,SSI,MassHealth,TAFDC",
      linkedPrograms: "MRVP,RTA Services",
      section: "Assistance Programs Enrollment",
      purpose: "Checks participation in other assistance programs that may influence eligibility.",
      explanation: "Enrollment in programs like SNAP or SSI can automatically qualify applicants for other benefits or affect eligibility criteria."
    },
    {
      field: "veteranStatus",
      question: "Are you a veteran who served at least 90 days of active duty with an honorable discharge?",
      inputType: "single",
      options: "Yes,No",
      linkedPrograms: "Chapter 115 Veterans' Benefits",
      section: "Veteran Information",
      purpose: "Identifies eligibility for veteran-specific benefits.",
      explanation: "Chapter 115 benefits are reserved for veterans meeting specific service criteria."
    },
    {
      field: "canUsePublicTransport",
      question: "Are you unable to use public or private transportation to reach your medical appointments?",
      inputType: "single",
      options: "Yes,No",
      linkedPrograms: "RTA Services",
      section: "Transportation Needs",
      purpose: "Determines eligibility for transportation assistance programs.",
      explanation: "RTA services may provide transportation assistance to those unable to use standard transit options."
    },
    {
      field: "needForTransportation",
      question: "Do you need transportation services to reach medical appointments?",
      inputType: "single",
      options: "Yes,No",
      linkedPrograms: "MassHealth Transportation Program",
      section: "Transportation Needs",
      purpose: "Identifies need for specialized transportation services.",
      explanation: "This program assists MassHealth members in reaching necessary medical appointments."
    },
    {
      field: "needAssistanceADLs",
      question: "Do you need assistance with Activities of Daily Living (e.g., bathing, dressing, eating, mobility)?",
      inputType: "single",
      options: "Yes,No",
      linkedPrograms: "Massachusetts Home Care Program, Adult Day Health Program",
      section: "Activities of Daily Living (ADLs)",
      purpose: "Checks eligibility for in-home care and day health services.",
      explanation: "These programs provide support for individuals requiring help with daily living activities."
    }
  ];

  const insertQuestion = db.prepare(`INSERT OR IGNORE INTO Questions (field, question, inputType, options, linkedPrograms, section, purpose, explanation) VALUES (?, ?, ?, ?, ?, ?, ?, ?)`);
  questions.forEach(q => {
    insertQuestion.run(q.field, q.question, q.inputType, q.options, q.linkedPrograms, q.section, q.purpose, q.explanation);
  });
  insertQuestion.finalize();

  // Seed Question_Program_Mappings
  const mappings = [
    // isResident mappings
    { questionField: "isResident", programName: "Low Income Home Energy Assistance Program (LIHEAP)" },
    { questionField: "isResident", programName: "Massachusetts Rental Voucher Program (MRVP)" },
    { questionField: "isResident", programName: "Supplemental Nutrition Assistance Program (SNAP)" },
    { questionField: "isResident", programName: "Transitional Aid to Families with Dependent Children (TAFDC)" },
    { questionField: "isResident", programName: "Emergency Aid to the Elderly, Disabled, and Children (EAEDC)" },
    { questionField: "isResident", programName: "Chapter 115 Veterans' Benefits" },
    { questionField: "isResident", programName: "Prescription Advantage Program" },
    { questionField: "isResident", programName: "Massachusetts Home Care Program" },
    { questionField: "isResident", programName: "Good Neighbor Energy Fund" },
    { questionField: "isResident", programName: "Regional Transit Authorities (RTA) Services" },
    { questionField: "isResident", programName: "Adult Day Health Program" },
    { questionField: "isResident", programName: "MassHealth Transportation Program" },

    // householdSize mappings
    { questionField: "householdSize", programName: "Low Income Home Energy Assistance Program (LIHEAP)" },
    { questionField: "householdSize", programName: "Massachusetts Rental Voucher Program (MRVP)" },
    { questionField: "householdSize", programName: "Supplemental Nutrition Assistance Program (SNAP)" },
    { questionField: "householdSize", programName: "Transitional Aid to Families with Dependent Children (TAFDC)" },
    { questionField: "householdSize", programName: "Chapter 115 Veterans' Benefits" },
    { questionField: "householdSize", programName: "Good Neighbor Energy Fund" },

    // householdAnnualIncome mappings
    { questionField: "householdAnnualIncome", programName: "Low Income Home Energy Assistance Program (LIHEAP)" },
    { questionField: "householdAnnualIncome", programName: "Massachusetts Rental Voucher Program (MRVP)" },
    { questionField: "householdAnnualIncome", programName: "Supplemental Nutrition Assistance Program (SNAP)" },
    { questionField: "householdAnnualIncome", programName: "Transitional Aid to Families with Dependent Children (TAFDC)" },
    { questionField: "householdAnnualIncome", programName: "Chapter 115 Veterans' Benefits" },
    { questionField: "householdAnnualIncome", programName: "Prescription Advantage Program" },
    { questionField: "householdAnnualIncome", programName: "Massachusetts Home Care Program" },
    { questionField: "householdAnnualIncome", programName: "Good Neighbor Energy Fund" },
    { questionField: "householdAnnualIncome", programName: "Adult Day Health Program" },

    // totalAssets mappings
    { questionField: "totalAssets", programName: "Massachusetts Rental Voucher Program (MRVP)" },
    { questionField: "totalAssets", programName: "Chapter 115 Veterans' Benefits" },

    // assistancePrograms mappings
    { questionField: "assistancePrograms", programName: "Massachusetts Rental Voucher Program (MRVP)" },
    { questionField: "assistancePrograms", programName: "Regional Transit Authorities (RTA) Services" },

    // citizenshipStatus mappings
    { questionField: "citizenshipStatus", programName: "Supplemental Nutrition Assistance Program (SNAP)" },
    { questionField: "citizenshipStatus", programName: "Transitional Aid to Families with Dependent Children (TAFDC)" },

    // hasDependents mappings
    { questionField: "hasDependents", programName: "Transitional Aid to Families with Dependent Children (TAFDC)" },

    // age mappings
    { questionField: "age", programName: "Emergency Aid to the Elderly, Disabled, and Children (EAEDC)" },
    { questionField: "age", programName: "Prescription Advantage Program" },
    { questionField: "age", programName: "Massachusetts Home Care Program" },
    { questionField: "age", programName: "Good Neighbor Energy Fund" },
    { questionField: "age", programName: "Adult Day Health Program" },

    // hasDisability mappings
    { questionField: "hasDisability", programName: "Emergency Aid to the Elderly, Disabled, and Children (EAEDC)" },
    { questionField: "hasDisability", programName: "Chapter 115 Veterans' Benefits" },
    { questionField: "hasDisability", programName: "Prescription Advantage Program" },
    { questionField: "hasDisability", programName: "Massachusetts Home Care Program" },
    { questionField: "hasDisability", programName: "Regional Transit Authorities (RTA) Services" },
    { questionField: "hasDisability", programName: "Adult Day Health Program" },

    // needAssistanceADLs mappings
    { questionField: "needAssistanceADLs", programName: "Massachusetts Home Care Program" },
    { questionField: "needAssistanceADLs", programName: "Adult Day Health Program" },

    // veteranStatus mappings
    { questionField: "veteranStatus", programName: "Chapter 115 Veterans' Benefits" },

    // canUsePublicTransport mappings
    { questionField: "canUsePublicTransport", programName: "Regional Transit Authorities (RTA) Services" },

    // needForTransportation mappings
    { questionField: "needForTransportation", programName: "MassHealth Transportation Program" }
  ];

  const insertMapping = db.prepare(`INSERT INTO Question_Program_Mappings (questionField, programName) VALUES (?, ?)`);
  mappings.forEach(mapping => {
    insertMapping.run(mapping.questionField, mapping.programName);
  });
  insertMapping.finalize();
});

db.close();

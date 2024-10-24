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

// Create Programs Table with Detailed Fields
  db.run(`
    CREATE TABLE IF NOT EXISTS Programs (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      name TEXT UNIQUE,
      description TEXT,
      coverage TEXT,
      eligibility TEXT,
      applicationProcess TEXT,
      requiredDocuments TEXT,
      usefulLinks TEXT
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

 // Seed Programs with Detailed Information
  const programs = [
    // 1. Low Income Home Energy Assistance Program (LIHEAP)
    {
      name: "Low Income Home Energy Assistance Program (LIHEAP)",
      description: "LIHEAP assists low-income households in meeting their home energy needs. It provides financial assistance for heating and cooling bills, energy crisis intervention, and weatherization services to improve energy efficiency.",
      coverage: [
        "Payment of Energy Bills:",
        "Heating Assistance: Up to $600 per household for heating bills (varies by household size and income).",
        "Cooling Assistance: Up to $300 per household for cooling bills.",
        "Energy Crisis Intervention: Emergency assistance for sudden energy-related financial crises, typically up to $300 per household.",
        "Weatherization Services:",
        "Insulation: Installation costs covered up to $5,000.",
        "Window Replacement: Up to $2,500 per window.",
        "Heating System Upgrades: Up to $10,000 for major heating system improvements."
      ],
      eligibility: "Based on income level (generally up to 150% of the federal poverty level), household size, and energy costs.",
      applicationProcess: "Apply through your local Community Action Agency or the Massachusetts Department of Transitional Assistance (DTA).",
      requiredDocuments: [
        "Proof of income (pay stubs, tax returns)",
        "Recent energy bills",
        "Identification (driver’s license, Social Security card)"
      ],
      usefulLinks: [
        { text: "Massachusetts LIHEAP Information", url: "https://example.com/LIHEAP" }
      ]
    },
    // 2. Massachusetts Rental Voucher Program (MRVP)
    {
      name: "Massachusetts Rental Voucher Program (MRVP)",
      description: "MRVP provides rental assistance vouchers to eligible low-income households, helping them afford safe and decent housing in the private market.",
      coverage: [
        "Monthly Rental Assistance: Vouchers typically cover 30% of household income or up to a specified maximum amount, which varies by city and town. For example, in Boston, the maximum voucher amount is approximately $2,500 per month.",
        "Utility Allowance: Additional support for utilities, ranging from $100 to $300 per month depending on household size and location.",
        "Option to Choose Housing: Flexibility to select housing in the private market, subject to voucher approval and landlord participation.",
        "Support for Vulnerable Populations: Additional assistance for families, elderly, and disabled individuals."
      ],
      eligibility: "Income limits based on household size (typically up to 50% of the area median income), preference for certain vulnerable populations like veterans, elderly, and disabled individuals.",
      applicationProcess: "Submit an application through the local Department of Housing and Community Development (DHCD) or the respective city's housing authority.",
      requiredDocuments: [
        "Proof of income (pay stubs, tax returns)",
        "Rental history",
        "Identification (driver’s license, Social Security card)",
        "Household composition"
      ],
      usefulLinks: [
        { text: "MassHousing Rental Assistance", url: "https://example.com/MassHousing" }
      ]
    },
    // 3. Supplemental Nutrition Assistance Program (SNAP)
    {
      name: "Supplemental Nutrition Assistance Program (SNAP)",
      description: "SNAP provides financial assistance for purchasing food to low- and no-income individuals and families.",
      coverage: [
        "Monthly Benefits: Based on household size and income. For example, a household of one might receive up to $250 per month, while a household of four could receive up to $800 per month. Exact amounts are adjusted annually based on federal guidelines.",
        "EBT Card: Benefits are loaded onto an Electronic Benefits Transfer (EBT) card, which can be used at authorized grocery stores and retailers.",
        "Additional Programs: Includes access to farmer’s markets and nutrition education programs."
      ],
      eligibility: "Based on income (generally up to 200% of the federal poverty level for most households), household size, and expenses.",
      applicationProcess: "Apply online through the Massachusetts Department of Transitional Assistance (DTA) website or at a local DTA office.",
      requiredDocuments: [
        "Identification",
        "Proof of income (pay stubs, tax returns)",
        "Residence (utility bills, lease agreements)",
        "Expenses (rent, utilities)"
      ],
      usefulLinks: [
        { text: "Massachusetts SNAP (Food Stamps)", url: "https://example.com/SNAP" }
      ]
    },
    // 4. Transitional Aid to Families with Dependent Children (TAFDC)
    {
      name: "Transitional Aid to Families with Dependent Children (TAFDC)",
      description: "TAFDC provides temporary financial assistance and support services to families with dependent children who are experiencing financial hardship.",
      coverage: [
        "Cash Assistance: Monthly cash payments ranging from $200 to $600 per month, depending on household size and income.",
        "Employment Support Services: Job training, resume workshops, and employment counseling, with up to $2,000 per family for job-related expenses.",
        "Child Care Assistance: Subsidies covering up to 50% of child care costs, with a maximum of $400 per month per child.",
        "Healthcare Benefits: Coverage for children’s medical expenses not covered by insurance."
      ],
      eligibility: "Families with dependent children, income below state guidelines (generally up to 185% of the federal poverty level).",
      applicationProcess: "Apply through the Massachusetts DTA, either online or in-person at a local DTA office.",
      requiredDocuments: [
        "Proof of income",
        "Custody documents",
        "Identification",
        "Documentation of expenses (rent, utilities, child care)"
      ],
      usefulLinks: [
        { text: "Massachusetts TAFDC Information", url: "https://example.com/TAFDC" }
      ]
    },
    // 5. Emergency Aid to the Elderly, Disabled, and Children (EAEDC)
    {
      name: "Emergency Aid to the Elderly, Disabled, and Children (EAEDC)",
      description: "EAEDC offers emergency financial assistance to elderly individuals, disabled persons, and families with children facing sudden financial crises.",
      coverage: [
        "Financial Assistance: One-time or short-term assistance up to $1,000 for essential needs such as utilities, rent, medical expenses, and food.",
        "Utility Assistance: Up to $500 for utility bills.",
        "Rent Assistance: Up to $700 to prevent eviction or homelessness.",
        "Medical Expense Assistance: Up to $800 for unexpected medical costs."
      ],
      eligibility: "Based on emergency needs, income (generally below 200% of the federal poverty level), and household status.",
      applicationProcess: "Contact the local DTA office or Community Action Agency to apply. Some areas may offer online applications.",
      requiredDocuments: [
        "Proof of emergency (e.g., eviction notice, medical bills)",
        "Proof of income",
        "Identification",
        "Documentation of expenses"
      ],
      usefulLinks: [
        { text: "Massachusetts EAEDC Information", url: "https://example.com/EAEDC" }
      ]
    },
    // 6. Chapter 115 Veterans' Benefits
    {
      name: "Chapter 115 Veterans' Benefits",
      description: "Chapter 115 provides financial assistance and benefits to veterans and their families, including disability compensation, education, and healthcare services.",
      coverage: [
        "Disability Compensation: Monthly benefits ranging from $200 to over $3,600 based on the severity of disability and number of dependents.",
        "Education Benefits: Up to $10,000 per veteran for education and training programs.",
        "Healthcare Services: Comprehensive medical coverage, including mental health services and specialized care.",
        "Home Loans: Low-interest loans up to $500,000 for purchasing a home.",
        "Pension Benefits: For veterans with limited income, monthly payments up to $500."
      ],
      eligibility: "Veterans with qualifying service-related disabilities, active-duty veterans, and eligible family members.",
      applicationProcess: "Apply through the Massachusetts Department of Veterans' Services (DVS) or the U.S. Department of Veterans Affairs (VA) website.",
      requiredDocuments: [
        "Military service records",
        "Medical documentation",
        "Identification",
        "Proof of disability (if applicable)"
      ],
      usefulLinks: [
        { text: "Massachusetts Department of Veterans' Services", url: "https://example.com/DVS" }
      ]
    },
    // 7. Prescription Advantage Program
    {
      name: "Prescription Advantage Program",
      description: "This program helps low-income individuals obtain necessary prescription medications at reduced costs or for free.",
      coverage: [
        "Free Medications: Access to over 600 generic medications at no cost.",
        "Discounts on Brand-Name Drugs: Up to 90% off brand-name prescriptions.",
        "Assistance with Specialty Medications: Discounts on insulin, HIV/AIDS medications, and other specialty drugs.",
        "Mail Order Services: Free or discounted mail-order prescriptions for chronic conditions."
      ],
      eligibility: "Based on income (generally below 200% of the federal poverty level) and lack of adequate insurance coverage.",
      applicationProcess: "Register online at the Prescription Advantage website or apply through participating Massachusetts pharmacies.",
      requiredDocuments: [
        "Proof of income",
        "Prescription from a licensed healthcare provider",
        "Identification"
      ],
      usefulLinks: [
        { text: "Prescription Advantage Program", url: "https://example.com/PrescriptionAdvantage" }
      ]
    },
    // 8. Massachusetts Home Care Program
    {
      name: "Massachusetts Home Care Program",
      description: "Provides in-home care services to elderly, disabled, and chronically ill individuals, enabling them to remain in their homes safely.",
      coverage: [
        "Personal Care Services: Assistance with bathing, dressing, grooming, and mobility, up to 100 hours per month.",
        "Homemaker Services: Help with cleaning, meal preparation, laundry, and other household tasks, up to 60 hours per month.",
        "Skilled Nursing Care: Medical services provided by licensed nurses, including medication management and wound care, up to 40 hours per month.",
        "Therapy Services: Physical, occupational, and speech therapy up to 20 hours per month.",
        "Respite Care: Temporary relief for primary caregivers, up to 30 hours per month."
      ],
      eligibility: "Based on medical necessity, income (generally up to 200% of the federal poverty level), and functional status.",
      applicationProcess: "Contact the Massachusetts Executive Office of Elder Affairs or local Area Agency on Aging to initiate an assessment.",
      requiredDocuments: [
        "Medical assessments",
        "Proof of income",
        "Identification",
        "Documentation of functional limitations"
      ],
      usefulLinks: [
        { text: "Massachusetts Executive Office of Elder Affairs", url: "https://example.com/ElderAffairs" }
      ]
    },
    // 9. Good Neighbor Energy Fund
    {
      name: "Good Neighbor Energy Fund",
      description: "Assists low-income households in Massachusetts with energy efficiency improvements and bill payment assistance.",
      coverage: [
        "Energy Bill Assistance: Up to $600 per household for energy bill payment.",
        "Home Energy Upgrades:",
        "Insulation Installation: Up to $5,000.",
        "Heating System Replacement: Up to $10,000.",
        "Window Replacement: Up to $2,500 per window.",
        "Energy Audits: Free or discounted energy efficiency assessments.",
        "Renewable Energy Installations: Subsidies for solar panel installations up to $15,000."
      ],
      eligibility: "Low-income households (generally up to 150% of the federal poverty level) facing energy insecurity.",
      applicationProcess: "Apply through participating local Community Action Agencies or the Good Neighbor Energy Fund website.",
      requiredDocuments: [
        "Proof of income",
        "Energy bills",
        "Identification",
        "Home ownership or lease agreement"
      ],
      usefulLinks: [
        { text: "Good Neighbor Energy Fund", url: "https://example.com/GoodNeighborEnergyFund" }
      ]
    },
    // 10. Regional Transit Authorities (RTA) Services
    {
      name: "Regional Transit Authorities (RTA) Services",
      description: "RTA Services provide public transportation options across Massachusetts, ensuring mobility for all residents, including those with disabilities.",
      coverage: [
        "Bus and Rail Services: Affordable fares with passes available for low-income individuals (e.g., reduced monthly passes costing $15 instead of $100).",
        "Paratransit Services: Specialized transportation for individuals with disabilities, including door-to-door service.",
        "Coverage: Up to 20 rides per week or unlimited rides depending on the disability level.",
        "Fare Assistance: Free or reduced fares for eligible individuals.",
        "Senior Transportation: Discounted rates for seniors, typically 50% off regular fares."
      ],
      eligibility: "Varies by service; paratransit requires disability certification, reduced fares based on income or age.",
      applicationProcess: "Contact the local RTA or the Massachusetts Bay Transportation Authority (MBTA) for application forms and eligibility verification.",
      requiredDocuments: [
        "Identification",
        "Proof of residency",
        "Disability documentation for paratransit",
        "Income verification for reduced fares"
      ],
      usefulLinks: [
        { text: "Massachusetts RTA Services", url: "https://example.com/RTA" },
        { text: "Massachusetts Bay Transportation Authority (MBTA)", url: "https://www.mbta.com/" }
      ]
    },
    // 11. Adult Day Health Program
    {
      name: "Adult Day Health Program",
      description: "Offers daytime care and health services for elderly and disabled adults, providing social, health, and support services to enhance their quality of life.",
      coverage: [
        "Medical Monitoring: Regular health check-ups and medication management.",
        "Social Activities: Group activities, exercise programs, and recreational outings.",
        "Rehabilitation Services: Physical, occupational, and speech therapy sessions.",
        "Nutritional Support: Balanced meals and dietary planning.",
        "Transportation Assistance: Provided for attending the program, up to $100 per month."
      ],
      eligibility: "Elderly (typically 65+) or disabled individuals requiring supervision and care during the day, income generally up to 200% of the federal poverty level.",
      applicationProcess: "Apply through local Area Agencies on Aging or community centers offering Adult Day Health Programs.",
      requiredDocuments: [
        "Medical assessments",
        "Proof of income",
        "Identification",
        "Care needs documentation"
      ],
      usefulLinks: [
        { text: "Massachusetts Adult Day Services", url: "https://example.com/AdultDayServices" }
      ]
    },
    // 12. MassHealth Transportation Program
    {
      name: "MassHealth Transportation Program",
      description: "Provides transportation services for MassHealth beneficiaries to and from medical appointments, ensuring access to necessary healthcare.",
      coverage: [
        "Non-Emergency Medical Transportation (NEMT):",
        "Type of Services: Medicaid-certified vehicles, wheelchair-accessible transport, stretcher transport if needed.",
        "Coverage: Up to $10 per mile or a fixed fare based on distance (e.g., $50 for local trips within a certain radius).",
        "Specialized Transportation:",
        "Coverage: For individuals with disabilities requiring specialized vehicles, covering up to 30 rides per month.",
        "Prescription Delivery: Free delivery of medications for eligible individuals, up to 100 prescriptions per year."
      ],
      eligibility: "Must be a MassHealth beneficiary needing transportation to medical services.",
      applicationProcess: "Contact MassHealth directly through your provider or the MassHealth Transportation Program website to schedule rides.",
      requiredDocuments: [
        "MassHealth ID",
        "Medical appointment details",
        "Identification"
      ],
      usefulLinks: [
        { text: "MassHealth Transportation", url: "https://example.com/MassHealthTransportation" }
      ]
    },
    // 13. MassHealth (Medicaid)
    {
      name: "MassHealth (Medicaid)",
      description: "MassHealth offers comprehensive health insurance coverage to low-income individuals and families, including medical, dental, and behavioral health services.",
      coverage: [
        "Medical Services:",
        "Doctor Visits: Free or low-cost visits to primary and specialist care providers.",
        "Hospital Stays: Full coverage for inpatient and outpatient hospital services.",
        "Emergency Services: No-cost emergency room visits.",
        "Prescription Medications: Coverage for generic and brand-name drugs, with copays typically ranging from $0 to $10.",
        "Preventive Services: Immunizations, screenings, and annual physicals at no cost.",
        "Behavioral Health Services: Mental health counseling, substance abuse treatment, and psychiatric services.",
        "Dental Services: Basic dental care, including cleanings, fillings, and extractions.",
        "Vision Care: Eye exams and coverage for glasses for eligible individuals."
      ],
      eligibility: "Based on income (varies by category), family size, age, disability status, and other factors.",
      applicationProcess: "Apply online through the MassHealth website, by mail, or at a local DTA office.",
      requiredDocuments: [
        "Proof of income (pay stubs, tax returns)",
        "Residency (utility bills, lease agreements)",
        "Identification (driver’s license, Social Security card)",
        "Citizenship or immigration status"
      ],
      usefulLinks: [
        { text: "MassHealth (Medicaid)", url: "https://example.com/MassHealth" }
      ]
    },
    // 14. Women, Infants, and Children (WIC)
    {
      name: "Women, Infants, and Children (WIC)",
      description: "WIC provides nutritious foods, education, and support to pregnant women, new mothers, and young children to promote healthy development.",
      coverage: [
        "Healthy Foods:",
        "Fruits and Vegetables: Up to $35 per month.",
        "Whole Grains: $15 per month.",
        "Dairy Products: $20 per month.",
        "Infant Formula: Up to $50 per month for infants who are not breastfeeding.",
        "Nutrition Education: Workshops and one-on-one counseling, valued at $100 per participant annually.",
        "Breastfeeding Support: Supplies and consultations, including free breast pumps valued at $200.",
        "Healthcare Referrals: Access to pediatricians, lactation consultants, and other healthcare services."
      ],
      eligibility: "Pregnant, breastfeeding, or postpartum women, infants, and children up to age five, with income up to 185% of the federal poverty level.",
      applicationProcess: "Apply at local WIC clinics or health departments by scheduling an appointment.",
      requiredDocuments: [
        "Proof of income",
        "Residency (utility bills, lease agreements)",
        "Identification (driver’s license, Social Security card)",
        "Medical records (pregnancy confirmation, child’s birth certificate)"
      ],
      usefulLinks: [
        { text: "Massachusetts WIC Program", url: "https://example.com/WIC" }
      ]
    },
    // 15. Fuel Assistance Program (LIHEAP)
    {
      name: "Fuel Assistance Program (LIHEAP)",
      description: "Similar to the general LIHEAP, the Fuel Assistance Program specifically targets assistance with heating and cooling costs for low-income households.",
      coverage: [
        "Heating Bill Payment: Up to $600 per household for heating bills during the winter months.",
        "Cooling Bill Payment: Up to $300 per household for cooling bills during the summer months.",
        "Energy Crisis Assistance: Up to $300 per household for unexpected energy emergencies.",
        "Energy Efficiency Upgrades: Vouchers for energy-efficient appliances and home improvements, valued up to $5,000."
      ],
      eligibility: "Based on income (typically up to 150% of the federal poverty level), household size, and energy costs.",
      applicationProcess: "Apply through the Massachusetts Department of Transitional Assistance (DTA) or local Community Action Agency.",
      requiredDocuments: [
        "Proof of income",
        "Recent energy bills",
        "Identification (driver’s license, Social Security card)"
      ],
      usefulLinks: [
        { text: "Massachusetts Fuel Assistance", url: "https://example.com/FuelAssistance" }
      ]
    },
    // 16. Massachusetts Child Care Voucher Program
    {
      name: "Massachusetts Child Care Voucher Program",
      description: "Provides vouchers to low-income families to help cover the cost of child care, enabling parents to work or attend training programs.",
      coverage: [
        "Subsidized Child Care Costs: Vouchers cover up to 85% of child care expenses, with maximum voucher amounts based on family size and income. For example, a family of two might receive up to $800 per month.",
        "Access to Licensed Providers: Vouchers can be used at any licensed child care provider, including daycare centers, family child care homes, and nannies.",
        "Extended Hours Coverage: Additional support for families needing child care during non-traditional hours, valued at up to $200 per month."
      ],
      eligibility: "Based on income (typically up to 185% of the federal poverty level), employment or education status, and family size.",
      applicationProcess: "Apply through the Massachusetts Department of Early Education and Care (EEC) by submitting an online application or visiting a local EEC office.",
      requiredDocuments: [
        "Proof of income",
        "Employment or education enrollment",
        "Identification",
        "Child’s birth certificate",
        "Child care provider information"
      ],
      usefulLinks: [
        { text: "Massachusetts Child Care Voucher Program", url: "https://example.com/ChildCareVoucher" }
      ]
    },
    // 17. Commonwealth Care
    {
      name: "Commonwealth Care",
      description: "A health insurance program for individuals who are uninsured and do not qualify for MassHealth, providing comprehensive coverage at affordable rates.",
      coverage: [
        "Medical Services: Doctor visits, hospital stays, emergency services, with premiums as low as $30 per month.",
        "Prescription Medications: Coverage for generic and brand-name drugs, with copays typically ranging from $5 to $50.",
        "Preventive Services: Free annual physicals, immunizations, and screenings.",
        "Behavioral Health Services: Mental health counseling and substance abuse treatment.",
        "Dental and Vision Services: Basic dental care and vision exams, with optional add-ons for glasses or dental procedures up to $200 annually."
      ],
      eligibility: "Low-income individuals not eligible for MassHealth, typically with income up to 200% of the federal poverty level.",
      applicationProcess: "Enroll through the Massachusetts Health Connector during open enrollment periods or through special enrollment periods if qualifying for a life event. Applications can be completed online, by phone, or with in-person assistance.",
      requiredDocuments: [
        "Proof of income",
        "Residency (utility bills, lease agreements)",
        "Identification (driver’s license, Social Security card)",
        "Citizenship or immigration status"
      ],
      usefulLinks: [
        { text: "Commonwealth Care", url: "https://example.com/CommonwealthCare" }
      ]
    },
    // 18. Senior Care Options (SCO)
    {
      name: "Senior Care Options (SCO)",
      description: "Provides a range of services to help seniors live independently, including in-home care, adult day programs, and caregiver support.",
      coverage: [
        "In-Home Care Services: Personal care, homemaker services, and nursing care, up to 100 hours per month.",
        "Adult Day Programs: Daytime supervision, social activities, and health services, up to $200 per month.",
        "Transportation Assistance: Free or subsidized transportation to medical appointments, valued up to $100 per month.",
        "Home Modification Support: Financial assistance for home modifications like grab bars, ramps, and wheelchair-accessible features, up to $5,000.",
        "Caregiver Support: Respite care and counseling services, valued at $150 per month."
      ],
      eligibility: "Seniors aged 65 and older or those with disabilities, with income typically up to 200% of the federal poverty level.",
      applicationProcess: "Contact local Area Agencies on Aging or the Massachusetts Executive Office of Elder Affairs to initiate an assessment and apply for services.",
      requiredDocuments: [
        "Proof of age",
        "Income",
        "Medical assessments",
        "Identification"
      ],
      usefulLinks: [
        { text: "Senior Care Options", url: "https://example.com/SeniorCareOptions" }
      ]
    },
    // 19. Massachusetts Head Start Program
    {
      name: "Massachusetts Head Start Program",
      description: "Offers early childhood education, health, nutrition, and parent involvement services to low-income families, promoting school readiness.",
      coverage: [
        "Educational Activities: High-quality preschool education for children ages birth to five, including literacy, math, and social skills.",
        "Health Screenings and Services: Comprehensive health assessments, immunizations, and dental care.",
        "Nutrition Services: Balanced meals and snacks, up to $200 per child annually.",
        "Family Support and Resources: Parenting classes, home visits, and access to social services, valued at $100 per family annually.",
        "Transportation Assistance: Provided for attending Head Start sessions, up to $50 per month."
      ],
      eligibility: "Low-income families with children aged birth to five, meeting federal income guidelines (generally up to 200% of the federal poverty level).",
      applicationProcess: "Apply through local Head Start centers or community organizations by submitting an application and attending an interview.",
      requiredDocuments: [
        "Proof of income",
        "Residency (utility bills, lease agreements)",
        "Child’s birth certificate",
        "Identification for parents and guardians"
      ],
      usefulLinks: [
        { text: "Massachusetts Head Start Program", url: "https://example.com/HeadStart" }
      ]
    },
    // 20. Emergency Housing Assistance Program
    {
      name: "Emergency Housing Assistance Program",
      description: "Provides temporary financial assistance and support services to individuals and families facing homelessness or housing instability.",
      coverage: [
        "Rent Assistance: Up to $3,000 per household to cover back rent or prevent eviction.",
        "Utility Assistance: Up to $1,000 per household for utility bills.",
        "Security Deposits: Up to $1,500 for new tenants to cover security deposits and first month’s rent.",
        "Case Management Services: Ongoing support to secure permanent housing, valued at $500 per household.",
        "Emergency Shelter Placement: Temporary shelter placement with meals and basic necessities."
      ],
      eligibility: "Individuals and families experiencing housing crises, with income typically up to 200% of the federal poverty level.",
      applicationProcess: "Apply through local Department of Housing and Community Development (DHCD) offices or Community Action Agencies.",
      requiredDocuments: [
        "Proof of income",
        "Eviction notices or foreclosure notices",
        "Identification",
        "Documentation of housing needs"
      ],
      usefulLinks: [
        { text: "Massachusetts Emergency Housing Assistance", url: "https://example.com/EmergencyHousing" }
      ]
    },
    // 21. Massachusetts Home Modification Loan Program (HMLP)
    {
      name: "Massachusetts Home Modification Loan Program (HMLP)",
      description: "Offers low-interest loans for home modifications to improve accessibility and safety for individuals with disabilities or elderly residents.",
      coverage: [
        "Installation of Ramps: Up to $10,000.",
        "Grab Bars and Handrails: Up to $2,500.",
        "Stairlifts and Ramps: Up to $15,000.",
        "Bathroom Modifications: Up to $8,000 for accessible showers and toilets.",
        "Structural Repairs for Safety: Up to $12,000 for repairs that enhance home safety."
      ],
      eligibility: "Homeowners or renters with a disability or elderly individuals needing modifications, with income typically up to 200% of the federal poverty level.",
      applicationProcess: "Apply through the Massachusetts Department of Transitional Assistance (DTA) or local Community Development Agencies by submitting an application and home assessment.",
      requiredDocuments: [
        "Proof of income",
        "Disability status",
        "Home ownership or lease agreement",
        "Identification",
        "Detailed plans for modifications"
      ],
      usefulLinks: [
        { text: "Massachusetts Home Modification Loans", url: "https://example.com/HomeModificationLoans" }
      ]
    },
    // 22. Section 8 Housing Choice Voucher Program
    {
      name: "Section 8 Housing Choice Voucher Program",
      description: "Provides rental assistance to low-income families, allowing them to choose and lease housing in the private market.",
      coverage: [
        "Rental Assistance: Varies by location; typically covers 30% of household income or up to a local payment standard. For example, in Boston, the maximum voucher amount is approximately $2,500 per month.",
        "Tenant Responsibilities: Payment of remaining rent not covered by the voucher, typically up to $1,750 in Boston.",
        "Portability: Vouchers can be used in different cities and towns within Massachusetts, subject to local availability.",
        "Renewal and Recertification: Annual renewal process to continue receiving assistance."
      ],
      eligibility: "Based on income (generally up to 50% of the area median income), family size, and local housing needs.",
      applicationProcess: "Apply through the local Public Housing Authority (PHA) or the Massachusetts Department of Housing and Community Development (DHCD). Applications often have long waiting lists.",
      requiredDocuments: [
        "Proof of income",
        "Family size",
        "Identification",
        "Documentation of housing needs"
      ],
      usefulLinks: [
        { text: "Section 8 Housing Choice Vouchers", url: "https://example.com/Section8" }
      ]
    },
    // 23. Health Safety Net (HSN)
    {
      name: "Health Safety Net (HSN)",
      description: "Offers medical care to uninsured residents of Massachusetts who do not qualify for MassHealth, ensuring access to necessary healthcare services.",
      coverage: [
        "Hospital and Emergency Services: Covered at no cost for uninsured individuals, including emergency room visits and hospital stays.",
        "Primary and Specialty Care: Access to free or low-cost doctor visits, specialist consultations, and diagnostic services.",
        "Prescription Medications: Discounts on medications, typically up to 80% off retail prices.",
        "Preventive Services: Free screenings, immunizations, and health education programs.",
        "Mental Health Services: Counseling and treatment programs for mental health and substance abuse, valued at $500 per year."
      ],
      eligibility: "Uninsured Massachusetts residents not eligible for MassHealth, with income generally up to 300% of the federal poverty level.",
      applicationProcess: "Enroll through participating healthcare providers or the Health Safety Net program administrators by completing an application form.",
      requiredDocuments: [
        "Proof of residency",
        "Income (pay stubs, tax returns)",
        "Identification (driver’s license, Social Security card)"
      ],
      usefulLinks: [
        { text: "MassHealth Health Safety Net", url: "https://example.com/HealthSafetyNet" }
      ]
    },
    // 24. Unemployment Insurance (UI)
    {
      name: "Unemployment Insurance (UI)",
      description: "Provides temporary financial assistance to workers who have lost their jobs through no fault of their own, helping them meet basic needs while seeking new employment.",
      coverage: [
        "Weekly Cash Benefits: Up to $900 per week, depending on previous earnings and state maximums.",
        "Duration: Benefits typically last up to 26 weeks, with extensions available during high unemployment periods.",
        "Job Search Assistance: Access to job listings, resume workshops, and career counseling services.",
        "Training Programs: Enrollment in job training and education programs funded by UI benefits.",
        "Additional Benefits: Pandemic-related extensions and special allowances during economic crises."
      ],
      eligibility: "Recently unemployed individuals who have worked a minimum number of hours (generally 20 weeks) and meet state wage requirements.",
      applicationProcess: "Apply online through the Massachusetts Department of Unemployment Assistance (DUA) website or at local DUA offices.",
      requiredDocuments: [
        "Social Security number",
        "Employment history",
        "Identification",
        "Reason for unemployment (e.g., layoff, reduction in force)"
      ],
      usefulLinks: [
        { text: "Massachusetts Department of Unemployment Assistance", url: "https://example.com/UI" }
      ]
    },
    // 25. Senior Farmers’ Market Nutrition Program (SFMNP)
    {
      name: "Senior Farmers’ Market Nutrition Program (SFMNP)",
      description: "Provides low-income seniors with coupons to purchase fresh fruits and vegetables at farmers' markets, promoting healthy eating.",
      coverage: [
        "Monthly Coupons: Each eligible senior receives up to $20 per month in coupons for fresh produce.",
        "Distribution Frequency: Coupons are distributed monthly, allowing for up to $240 annually.",
        "Participation in Farmers' Markets: Accessible at participating local farmers' markets and community-supported agriculture (CSA) programs.",
        "Nutrition Education: Workshops and classes on healthy eating, valued at $100 per senior annually."
      ],
      eligibility: "Seniors aged 60 and older with income below specific thresholds (typically up to 185% of the federal poverty level).",
      applicationProcess: "Apply through local Area Agencies on Aging, Community Action Agencies, or senior centers by submitting an application form.",
      requiredDocuments: [
        "Proof of age (driver’s license, birth certificate)",
        "Income verification",
        "Residency (utility bills, lease agreements)",
        "Identification"
      ],
      usefulLinks: [
        { text: "Senior Farmers’ Market Nutrition Program", url: "https://example.com/SFMNP" }
      ]
    },
    // 26. Massachusetts Health Connector
    {
      name: "Massachusetts Health Connector",
      description: "The state's health insurance marketplace where individuals and families can compare and purchase health insurance plans, including MassHealth and Commonwealth Care.",
      coverage: [
        "Health Insurance Plans: Range from basic coverage with essential benefits to comprehensive plans with additional services.",
        "Subsidies and Tax Credits: Financial assistance based on income, potentially reducing premiums by up to 100% for eligible individuals.",
        "Enrollment Assistance: Free help from certified navigators and agents to choose suitable plans.",
        "Special Enrollment Periods: Available during life events such as marriage, birth of a child, or loss of other coverage.",
        "Plan Types: Includes HMOs, PPOs, EPOs, and POS plans with varying levels of coverage and provider networks."
      ],
      eligibility: "Individuals and families seeking health insurance coverage, including those who do not qualify for MassHealth.",
      applicationProcess: "Apply online at the Massachusetts Health Connector website, by phone, or in person with assistance from a certified navigator.",
      requiredDocuments: [
        "Proof of income",
        "Residency (utility bills, lease agreements)",
        "Identification (driver’s license, Social Security card)",
        "Citizenship or immigration status"
      ],
      usefulLinks: [
        { text: "Massachusetts Health Connector", url: "https://example.com/HealthConnector" }
      ]
    },
    // 27. State Supplement Program (SSP)
    {
      name: "State Supplement Program (SSP)",
      description: "Provides additional income to eligible Massachusetts residents who receive Social Security or Railroad Retirement benefits, ensuring they meet state minimum income standards.",
      coverage: [
        "Monthly Cash Supplements: Up to $300 per month for individuals and up to $500 per month for couples.",
        "Utility Bill Assistance: Additional support for utility bills, up to $200 per month.",
        "Medication Assistance: Coverage for certain prescription medications not covered by Medicare, valued at $100 per month.",
        "Food Assistance: Monthly food vouchers worth up to $150.",
        "Transportation Assistance: Subsidies for public transportation costs, up to $50 per month."
      ],
      eligibility: "Individuals receiving Social Security or Railroad Retirement benefits with low income, generally up to 200% of the federal poverty level.",
      applicationProcess: "Apply through the Massachusetts Department of Transitional Assistance (DTA) by submitting an online application or visiting a local DTA office.",
      requiredDocuments: [
        "Social Security or Railroad Retirement benefits statements",
        "Proof of income",
        "Identification (driver’s license, Social Security card)",
        "Residency documents"
      ],
      usefulLinks: [
        { text: "State Supplement Program", url: "https://example.com/SSP" }
      ]
    },
    // 28. Massachusetts Child Support Enforcement Division (CSE)
    {
      name: "Massachusetts Child Support Enforcement Division (CSE)",
      description: "Helps custodial parents obtain child support from non-custodial parents, ensuring children receive necessary financial support.",
      coverage: [
        "Establishment of Child Support Orders: Legal establishment of child support obligations.",
        "Enforcement of Support Orders: Wage garnishment, tax refund intercepts, and driver’s license suspension for non-payment.",
        "Collection and Distribution of Payments: Secure handling and timely distribution of child support payments to custodial parents.",
        "Legal Assistance: Representation in court for establishing or modifying child support orders, valued at $500 per case.",
        "Health Insurance Coverage: Ensuring non-custodial parents provide health insurance for children, with subsidies up to $300 per month for premiums."
      ],
      eligibility: "Custodial parents seeking child support from non-custodial parents.",
      applicationProcess: "Apply through the local CSE office or online via the Massachusetts CSE website.",
      requiredDocuments: [
        "Child’s birth certificate",
        "Custody information",
        "Identification (driver’s license, Social Security card)",
        "Information about the non-custodial parent"
      ],
      usefulLinks: [
        { text: "Massachusetts Child Support Enforcement", url: "https://example.com/CSE" }
      ]
    },
    // 29. Workforce Training Fund Program (WTFP)
    {
      name: "Workforce Training Fund Program (WTFP)",
      description: "Provides funding for job training and workforce development programs to help individuals gain skills needed for employment in high-demand industries.",
      coverage: [
        "Job Training Courses: Tuition and fees covered for vocational training, IT certifications, healthcare programs, and more, up to $5,000 per participant.",
        "Career Counseling: Personalized career counseling and job placement services, valued at $500 per individual.",
        "Apprenticeship Programs: Support for apprenticeships in fields such as construction, manufacturing, and advanced technology, including stipends up to $1,200 per apprentice.",
        "Certification Fees: Coverage for exam fees and certification costs, up to $300 per certification.",
        "Transportation and Child Care: Subsidies for transportation and child care during training programs, up to $200 per month."
      ],
      eligibility: "Job seekers, especially those unemployed or underemployed, with income typically up to 200% of the federal poverty level.",
      applicationProcess: "Apply through the Massachusetts Department of Higher Education or local Workforce Development Centers by submitting an application and participating in an assessment.",
      requiredDocuments: [
        "Proof of unemployment or underemployment",
        "Identification (driver’s license, Social Security card)",
        "Education background",
        "Career goals"
      ],
      usefulLinks: [
        { text: "Massachusetts Workforce Training Fund", url: "https://example.com/WTFP" }
      ]
    },
    // 30. Massachusetts Department of Veterans' Services (DVS)
    {
      name: "Massachusetts Department of Veterans' Services (DVS)",
      description: "Offers a range of services and benefits to veterans and their families, including assistance with benefits claims, employment services, and healthcare access.",
      coverage: [
        "Benefits Counseling: Personalized assistance with VA benefits claims, disability compensation, and pension applications, valued at $500 per session.",
        "Employment and Education Support: Job placement services, resume workshops, and educational scholarships up to $10,000.",
        "Health and Wellness Programs: Access to mental health services, fitness programs, and support groups, valued at $300 per veteran annually.",
        "Housing Assistance: Support with obtaining VA home loans and housing modifications, including up to $15,000 in home modification grants.",
        "Financial Assistance: Emergency financial aid for veterans facing homelessness or financial crises, up to $1,000 per veteran."
      ],
      eligibility: "Veterans of all eras, active-duty service members, and eligible family members.",
      applicationProcess: "Contact the Massachusetts DVS office, visit their website, or attend local DVS events to apply and receive assistance.",
      requiredDocuments: [
        "Military service records",
        "Identification (veteran ID, driver’s license)",
        "Proof of eligibility for specific benefits (disability ratings, marriage certificates for family benefits)"
      ],
      usefulLinks: [
        { text: "Massachusetts Department of Veterans' Services", url: "https://example.com/DVS" }
      ]
    },
  ];

 const insertProgram = db.prepare(`
    INSERT OR IGNORE INTO Programs 
    (name, description, coverage, eligibility, applicationProcess, requiredDocuments, usefulLinks) 
    VALUES (?, ?, ?, ?, ?, ?, ?)
  `);

  programs.forEach(program => {
    insertProgram.run(
      program.name,
      program.description,
      JSON.stringify(program.coverage || []),
      program.eligibility || "",
      JSON.stringify(program.applicationProcess || ""),
      JSON.stringify(program.requiredDocuments || []),
      JSON.stringify(program.usefulLinks || [])
    );
  });

  insertProgram.finalize();

  // Seed Questions
  const questions = [
    // Existing 13 Questions
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
      linkedPrograms: "EAEDC, Prescription Advantage Program, Massachusetts Home Care Program, Good Neighbor Energy Fund, Adult Day Health Program, SFMNP, SCO, Senior Care Options (SCO)",
      section: "Personal Information",
      purpose: "Determines eligibility based on age-specific criteria.",
      explanation: "Certain programs target specific age groups (e.g., seniors, adults requiring day health services)."
    },
    {
      field: "hasDisability",
      question: "Do you have a disability that impedes your ability to work or live independently?",
      inputType: "single",
      options: "Yes,No",
      linkedPrograms: "EAEDC, Chapter 115 Veterans' Benefits, Prescription Advantage Program, Massachusetts Home Care Program, RTA Services, Adult Day Health Program, HMLP, SFMNP",
      section: "Personal Information",
      purpose: "Identifies eligibility for programs requiring disability status.",
      explanation: "Programs like EAEDC and Prescription Advantage require applicants to have disabilities affecting their daily living or employment."
    },
    {
      field: "householdSize",
      question: "How many people are in your household?",
      inputType: "number",
      options: "",
      linkedPrograms: "LIHEAP, MRVP, SNAP, TAFDC, Chapter 115 Veterans' Benefits, Good Neighbor Energy Fund, HSN, CSE",
      section: "Household Information",
      purpose: "Adjusts income and asset limits based on household size.",
      explanation: "Many programs have income thresholds that vary with the number of household members."
    },
    {
      field: "householdAnnualIncome",
      question: "What is your household's annual income?",
      inputType: "number",
      options: "",
      linkedPrograms: "LIHEAP, MRVP, SNAP, TAFDC, Chapter 115 Veterans' Benefits, Prescription Advantage Program, Massachusetts Home Care Program, Good Neighbor Energy Fund, Adult Day Health Program, Commonwealth Care, HSN",
      section: "Household Information",
      purpose: "Determines eligibility based on income thresholds.",
      explanation: "Each program has specific income limits that applicants must not exceed to qualify."
    },
    {
      field: "totalAssets",
      question: "What is the total value of your assets?",
      inputType: "number",
      options: "",
      linkedPrograms: "MRVP, Chapter 115 Veterans' Benefits, HMLP",
      section: "Household Information",
      purpose: "Checks asset limits for eligibility.",
      explanation: "Some programs impose asset restrictions to ensure assistance targets those with limited resources."
    },
    {
      field: "hasDependents",
      question: "Do you have dependent children?",
      inputType: "single",
      options: "Yes,No",
      linkedPrograms: "TAFDC, SNAP, CSE",
      section: "Dependents and Citizenship",
      purpose: "Identifies eligibility for programs requiring dependents.",
      explanation: "TAFDC specifically assists families with dependent children."
    },
    {
      field: "citizenshipStatus",
      question: "What is your citizenship status?",
      inputType: "single",
      options: "U.S. Citizen,Legal Non-Citizen,Other",
      linkedPrograms: "SNAP, TAFDC, Section 8 Housing Choice Voucher Program",
      section: "Dependents and Citizenship",
      purpose: "Determines eligibility based on citizenship requirements.",
      explanation: "Some programs require applicants to be U.S. citizens or legal non-citizens."
    },
    {
      field: "assistancePrograms",
      question: "Are you enrolled in any of the following assistance programs? (Select all that apply)",
      inputType: "multiple",
      options: "SNAP,SSI,MassHealth,TAFDC",
      linkedPrograms: "MRVP,RTA Services, Section 8 Housing Choice Voucher Program, WTFP",
      section: "Assistance Programs Enrollment",
      purpose: "Checks participation in other assistance programs that may influence eligibility.",
      explanation: "Enrollment in programs like SNAP or SSI can automatically qualify applicants for other benefits or affect eligibility criteria."
    },
    {
      field: "veteranStatus",
      question: "Are you a veteran who served at least 90 days of active duty with an honorable discharge?",
      inputType: "single",
      options: "Yes,No",
      linkedPrograms: "Chapter 115 Veterans' Benefits, DVS",
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
    },
    // New Questions
    {
      field: "isHomeless",
      question: "Are you currently homeless or at risk of homelessness?",
      inputType: "single",
      options: "Yes,No",
      linkedPrograms: "Emergency Housing Assistance Program, Low Income Home Energy Assistance Program (LIHEAP)",
      section: "Additional Eligibility",
      purpose: "Determines eligibility for programs prioritizing homeless individuals or those at risk.",
      explanation: "Certain programs prioritize individuals who are homeless or facing imminent homelessness."
    },
    {
      field: "hasYoungChildren",
      question: "Do you have children under 5 years old?",
      inputType: "single",
      options: "Yes,No",
      linkedPrograms: "Women, Infants, and Children (WIC), Massachusetts Head Start Program",
      section: "Additional Eligibility",
      purpose: "Assesses eligibility for programs supporting young children.",
      explanation: "Programs like WIC and Head Start are designed for families with young children."
    },
    {
      field: "isPregnant",
      question: "Are you currently pregnant?",
      inputType: "single",
      options: "Yes,No",
      linkedPrograms: "Women, Infants, and Children (WIC), Massachusetts Head Start Program",
      section: "Additional Eligibility",
      purpose: "Evaluates eligibility for programs supporting pregnant women.",
      explanation: "Pregnant women may qualify for specific nutrition and support programs."
    },
    {
      field: "isEmployedOrInSchool",
      question: "Are you employed or attending school full-time?",
      inputType: "single",
      options: "Yes,No",
      linkedPrograms: "Massachusetts Child Care Voucher Program, Workforce Training Fund Program (WTFP)",
      section: "Additional Eligibility",
      purpose: "Determines eligibility for child care and workforce training programs.",
      explanation: "Full-time employment or schooling status is required for certain assistance programs."
    },
    {
      field: "ownsHome",
      question: "Do you own your home or have landlord permission to make modifications?",
      inputType: "single",
      options: "Yes,No",
      linkedPrograms: "Massachusetts Home Modification Loan Program (HMLP)",
      section: "Additional Eligibility",
      purpose: "Assesses eligibility for home modification assistance.",
      explanation: "Homeowners or tenants with landlord permission can apply for home modifications."
    },
    {
      field: "isEnrolledInMassHealthAndMedicare",
      question: "Are you enrolled in both MassHealth and Medicare?",
      inputType: "single",
      options: "Yes,No",
      linkedPrograms: "Senior Care Options (SCO)",
      section: "Additional Eligibility",
      purpose: "Evaluates eligibility for senior care services.",
      explanation: "Enrollment in both MassHealth and Medicare is required for certain senior care programs."
    },
    {
      field: "isParentSeekingChildSupport",
      question: "Are you a parent seeking child support enforcement?",
      inputType: "single",
      options: "Yes,No",
      linkedPrograms: "Massachusetts Child Support Enforcement Division (CSE)",
      section: "Additional Eligibility",
      purpose: "Determines eligibility for child support enforcement services.",
      explanation: "Parents seeking to establish or enforce child support orders can access these services."
    },
    {
      field: "hasWorkedInMA",
      question: "Have you worked in Massachusetts and meet residency criteria?",
      inputType: "single",
      options: "Yes,No",
      linkedPrograms: "Unemployment Insurance (UI)",
      section: "Additional Eligibility",
      purpose: "Assesses eligibility for unemployment benefits.",
      explanation: "Eligibility for unemployment insurance requires work history in Massachusetts."
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
    { questionField: "isResident", programName: "MassHealth (Medicaid)" },
    { questionField: "isResident", programName: "Women, Infants, and Children (WIC)" },
    { questionField: "isResident", programName: "Fuel Assistance Program (LIHEAP)" },
    { questionField: "isResident", programName: "Massachusetts Child Care Voucher Program" },
    { questionField: "isResident", programName: "Commonwealth Care" },
    { questionField: "isResident", programName: "Senior Care Options (SCO)" },
    { questionField: "isResident", programName: "Massachusetts Head Start Program" },
    { questionField: "isResident", programName: "Emergency Housing Assistance Program" },
    { questionField: "isResident", programName: "Massachusetts Home Modification Loan Program (HMLP)" },
    { questionField: "isResident", programName: "Section 8 Housing Choice Voucher Program" },
    { questionField: "isResident", programName: "Health Safety Net (HSN)" },
    { questionField: "isResident", programName: "Unemployment Insurance (UI)" },
    { questionField: "isResident", programName: "Senior Farmers’ Market Nutrition Program (SFMNP)" },
    { questionField: "isResident", programName: "Massachusetts Health Connector" },
    { questionField: "isResident", programName: "State Supplement Program (SSP)" },
    { questionField: "isResident", programName: "Massachusetts Child Support Enforcement Division (CSE)" },
    { questionField: "isResident", programName: "Workforce Training Fund Program (WTFP)" },
    { questionField: "isResident", programName: "Massachusetts Department of Veterans' Services (DVS)" },
    
    // householdSize mappings
    { questionField: "householdSize", programName: "Low Income Home Energy Assistance Program (LIHEAP)" },
    { questionField: "householdSize", programName: "Massachusetts Rental Voucher Program (MRVP)" },
    { questionField: "householdSize", programName: "Supplemental Nutrition Assistance Program (SNAP)" },
    { questionField: "householdSize", programName: "Transitional Aid to Families with Dependent Children (TAFDC)" },
    { questionField: "householdSize", programName: "Chapter 115 Veterans' Benefits" },
    { questionField: "householdSize", programName: "Good Neighbor Energy Fund" },
    { questionField: "householdSize", programName: "Health Safety Net (HSN)" },
    { questionField: "householdSize", programName: "Massachusetts Child Support Enforcement Division (CSE)" },
    
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
    { questionField: "householdAnnualIncome", programName: "Commonwealth Care" },
    { questionField: "householdAnnualIncome", programName: "Health Safety Net (HSN)" },
    
    // totalAssets mappings
    { questionField: "totalAssets", programName: "Massachusetts Rental Voucher Program (MRVP)" },
    { questionField: "totalAssets", programName: "Chapter 115 Veterans' Benefits" },
    { questionField: "totalAssets", programName: "Massachusetts Home Modification Loan Program (HMLP)" },
    
    // assistancePrograms mappings
    { questionField: "assistancePrograms", programName: "Massachusetts Rental Voucher Program (MRVP)" },
    { questionField: "assistancePrograms", programName: "Regional Transit Authorities (RTA) Services" },
    { questionField: "assistancePrograms", programName: "Section 8 Housing Choice Voucher Program" },
    { questionField: "assistancePrograms", programName: "Workforce Training Fund Program (WTFP)" },
    
    // citizenshipStatus mappings
    { questionField: "citizenshipStatus", programName: "Supplemental Nutrition Assistance Program (SNAP)" },
    { questionField: "citizenshipStatus", programName: "Transitional Aid to Families with Dependent Children (TAFDC)" },
    { questionField: "citizenshipStatus", programName: "Section 8 Housing Choice Voucher Program" },
    
    // hasDependents mappings
    { questionField: "hasDependents", programName: "Transitional Aid to Families with Dependent Children (TAFDC)" },
    { questionField: "hasDependents", programName: "Supplemental Nutrition Assistance Program (SNAP)" },
    { questionField: "hasDependents", programName: "Massachusetts Child Support Enforcement Division (CSE)" },
    
    // age mappings
    { questionField: "age", programName: "Emergency Aid to the Elderly, Disabled, and Children (EAEDC)" },
    { questionField: "age", programName: "Prescription Advantage Program" },
    { questionField: "age", programName: "Massachusetts Home Care Program" },
    { questionField: "age", programName: "Good Neighbor Energy Fund" },
    { questionField: "age", programName: "Adult Day Health Program" },
    { questionField: "age", programName: "Senior Farmers’ Market Nutrition Program (SFMNP)" },
    { questionField: "age", programName: "Senior Care Options (SCO)" },
    { questionField: "age", programName: "Massachusetts Head Start Program" },
    { questionField: "age", programName: "Senior Care Options (SCO)" },
    
    // hasDisability mappings
    { questionField: "hasDisability", programName: "Emergency Aid to the Elderly, Disabled, and Children (EAEDC)" },
    { questionField: "hasDisability", programName: "Chapter 115 Veterans' Benefits" },
    { questionField: "hasDisability", programName: "Prescription Advantage Program" },
    { questionField: "hasDisability", programName: "Massachusetts Home Care Program" },
    { questionField: "hasDisability", programName: "Regional Transit Authorities (RTA) Services" },
    { questionField: "hasDisability", programName: "Adult Day Health Program" },
    { questionField: "hasDisability", programName: "Massachusetts Home Modification Loan Program (HMLP)" },
    { questionField: "hasDisability", programName: "Section 8 Housing Choice Voucher Program" },
    
    // needAssistanceADLs mappings
    { questionField: "needAssistanceADLs", programName: "Massachusetts Home Care Program" },
    { questionField: "needAssistanceADLs", programName: "Adult Day Health Program" },
    
    // veteranStatus mappings
    { questionField: "veteranStatus", programName: "Chapter 115 Veterans' Benefits" },
    { questionField: "veteranStatus", programName: "Massachusetts Department of Veterans' Services (DVS)" },
    
    // canUsePublicTransport mappings
    { questionField: "canUsePublicTransport", programName: "Regional Transit Authorities (RTA) Services" },
    
    // needForTransportation mappings
    { questionField: "needForTransportation", programName: "MassHealth Transportation Program" },
    
    // isHomeless mappings
    { questionField: "isHomeless", programName: "Emergency Housing Assistance Program" },
    { questionField: "isHomeless", programName: "Low Income Home Energy Assistance Program (LIHEAP)" },
    
    // hasYoungChildren mappings
    { questionField: "hasYoungChildren", programName: "Women, Infants, and Children (WIC)" },
    { questionField: "hasYoungChildren", programName: "Massachusetts Head Start Program" },
    
    // isPregnant mappings
    { questionField: "isPregnant", programName: "Women, Infants, and Children (WIC)" },
    { questionField: "isPregnant", programName: "Massachusetts Head Start Program" },
    
    // isEmployedOrInSchool mappings
    { questionField: "isEmployedOrInSchool", programName: "Massachusetts Child Care Voucher Program" },
    { questionField: "isEmployedOrInSchool", programName: "Workforce Training Fund Program (WTFP)" },
    
    // ownsHome mappings
    { questionField: "ownsHome", programName: "Massachusetts Home Modification Loan Program (HMLP)" },
    
    // isEnrolledInMassHealthAndMedicare mappings
    { questionField: "isEnrolledInMassHealthAndMedicare", programName: "Senior Care Options (SCO)" },
    
    // isParentSeekingChildSupport mappings
    { questionField: "isParentSeekingChildSupport", programName: "Massachusetts Child Support Enforcement Division (CSE)" },
    
    // hasWorkedInMA mappings
    { questionField: "hasWorkedInMA", programName: "Unemployment Insurance (UI)" },
  ];

  const insertMapping = db.prepare(`INSERT INTO Question_Program_Mappings (questionField, programName) VALUES (?, ?)`);
  mappings.forEach(mapping => {
    insertMapping.run(mapping.questionField, mapping.programName);
  });
  insertMapping.finalize();
});

db.close();

// Customer
export const customer = {
  customer_id: 12345,
  legal_entity_name: 'Acme Corporation',
  industry: 'Technology',
  type: 'Direct Customer', // Direct Customer, Ecosystem Partner, ODM, OEM, Distributor
  status: 'Active', // Active, Inactive, Pending Review
  date_created: new Date('2023-11-08'),
  address: [
    // At least one address is required
    {
      type: 'Headquarters', // Headquarters, Factory, Warehouse, Office
      line_1: '123 Main St',
      line_2: 'Suite 400',
      city: 'Anytown',
      state: 'CA',
      country: 'USA',
    },
    {
      type: 'Factory',
      line_1: '456 Elm St',
      line_2: '',
      city: 'Othertown',
      state: 'NY',
      country: 'USA',
    },
  ],
  parent: {
    // Optional, Reference to another customer
    parent_id: 98765,
    name: 'Acme Group Inc',
    country: 'USA',
    type: 'Ecosystem Partner',
  },
  owner: {
    // Refernce to an employee in Sales department
    owner_id: 67890,
    first_name: 'Jason',
    last_name: 'Ding',
    business_unit: 'Cloud',
    title: 'Sales Manager',
  },
  contact: {
    contact_id: 54321,
    first_name: 'Jane',
    last_name: 'Smith',
    phone: '(123) 456-7890',
    email: 'jane.smith@example.com',
    title: 'Technical Project Manager',
  },
};

// Employee
export const employee = {
  employee_id: 12345,
  first_name: 'Kim',
  last_name: 'Rosen',
  phone: '(123) 456-7890',
  email: 'kim.rosen@example.com',
  title: 'Software Engineer',
  department: 'Engineering', // Engineering, Sales, Compliance, HR, Finance
  business_unit: 'Cloud', // Cloud, Automobile, AI, Functional
  date_hired: new Date('2023-11-08'),
  is_active: true,
};

// Lead (Prospective Customer)
export const lead = {
  lead_id: 1,
  name: 'PC manufacturer',
  status: 'qualified', // pending review, qualified, canceled
  probability: 0.8,
  source: 'EE conference',
  analysis: 'largest PC manufacturer in Asia',
  date_created: new Date('2019-01-01'),
  contact: {
    contact_id: 1,
    first_name: 'Joe',
    last_name: 'Ming',
    phone: '123-456-7890',
    email: 'joe.ming@company.com',
    title: 'CEO',
  },
  owner: {
    // Reference to an employee in Sales department
    owner_id: 1,
    first_name: 'Jane',
    last_name: 'Chen',
    business_unit: 'Cloud',
    title: 'Sales Manager',
  },
};

// Opportunity
export const opportunity = {
  opportunity_id: 12345,
  customer_id: 67890,
  name: 'Ace Project',
  start_date: new Date('2023-11-08'),
  close_date: null,
  stage: 'Propose', // Create, Develop, Propose, Close-Won, Close-Lost
  est_revenue: 100000,
  date_created: new Date('2023-01-08'),
  owner: {
    // Reference to an employee in Sales department
    owner_id: 54321,
    first_name: 'Jimin',
    last_name: 'Seo',
    business_unit: 'Cloud',
    title: 'Sales Manager',
  },
  quotes: [
    // Required if stage is Propose or Close-Won
    {
      quote_id: 98765,
      name: 'Acme Quote 1',
      content: 'Detailed proposal for project scope and pricing.',
      status: 'Pending', // Draft, Pending Review, Approved, Rejected, Canceled
      date_created: new Date('2023-11-08'),
      date_approved: null,
      bill_to: null, // Reference to a customer, Required if status is Approved
      ship_to: null, // Reference to a customer, Required if status is Approved
    },
    {
      quote_id: 43210,
      name: 'Acme Quote 2',
      content: 'Revised proposal with updated pricing and timeline.',
      status: 'Approved',
      date_created: new Date('2023-11-10'),
      date_approved: new Date('2023-11-11'),
      bill_to: {
        // Reference to a customer
        bill_to_id: 76543,
        legal_entity_name: 'Acme Corporation',
        address: {
          line_1: '123 Main St',
          line_2: 'Suite 400',
          city: 'Anytown',
          state: 'CA',
          country: 'USA',
        },
      },
      ship_to: {
        // Reference to a customer
        ship_to_id: 23456,
        legal_entity_name: 'Acme Manufacturing Co. Ltd.',
        address: {
          line_1: '456 Elm St',
          line_2: '',
          city: 'Othertown',
          state: 'NY',
          country: 'USA',
        },
      },
    },
  ],
};

// Screening Record
export const screeningRecord = {
  screening_record_id: 12345,
  issue_type: 'Finance', // Finance, Sanction, Legal
  status: 'Pending Review', // Pending Review, Approved, Not Approved
  source: 'News',
  pending_action: 'Customer to fill out due diligence form',
  customer: {
    // Reference to a customer
    customer_id: 67890,
    name: 'ABC Corporation',
    country: 'USA',
  },
  version: {
    version_id: 0,
    version: 0,
    timestamp: new Date('2023-11-08T12:34:56Z'),
    modified_by_id: 54321, // Reference to an employee
    modified_by_name: 'Jane Smith', // Reference to an employee
  },
};

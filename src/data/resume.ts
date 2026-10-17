// Résumé content shown on the home page. Kept as data so it can also feed
// structured data (schema.org) without duplicating copy.

export const credentials = [
  'CSPO',
  'Google AI Essentials',
  'AWS',
  'GCP',
  'OpenAI API',
  'Claude API',
] as const;

export const stats = [
  { value: '15+', label: 'Years in industry' },
  { value: '4', label: 'Years in software engineering' },
  { value: '3', label: 'AI agents shipped' },
  { value: '2', label: 'AI tools in production' },
] as const;

export const skillGroups = [
  {
    title: 'AI and automation',
    items: [
      'Claude API',
      'OpenAI API',
      'Prompt engineering',
      'AI agent design',
      'Make.com',
      'Microsoft Copilot',
      'Azure AI Foundry',
    ],
  },
  {
    title: 'Cloud and backend',
    items: [
      'AWS',
      'GCP',
      'Java',
      'Python',
      'TypeScript',
      'JavaScript',
      'SQL',
      'REST APIs',
      'Auth and authorization',
      'Docker',
      'Lambda',
      'DynamoDB',
    ],
  },
  {
    title: 'Product and delivery',
    items: [
      'Roadmapping',
      'User stories',
      'Acceptance criteria',
      'Agile / Scrum',
      'Backlog grooming',
      'Backlog prioritization',
      'Jira',
      'Confluence',
      'Stakeholder management',
    ],
  },
  {
    title: 'Domain and tools',
    items: [
      'FinTech / lending',
      'FHA / VA / GSE',
      'PCI compliance',
      'Git / GitHub',
      'Postman',
      'React',
      'Vercel',
      'Salesforce',
    ],
  },
] as const;

export interface Role {
  title: string;
  org: string;
  /** Extra context shown after the organization, e.g. a program focus. */
  detail?: string;
  /** Education only: whether the program was finished (drives schema.org alumniOf). */
  completed?: boolean;
  start: string;
  end: string;
  highlights: readonly string[];
}

export const experience: readonly Role[] = [
  {
    title: 'Portfolio Retention and Lending Specialist',
    org: 'Carrington Mortgage Services',
    start: 'Sep 2025',
    end: 'Present',
    highlights: [
      'Support portfolio retention and purchase lending initiatives within a large mortgage servicing organization across FHA, VA, GSE, portfolio, and secondary-market lending channels',
      'Operate within investor, regulatory, and servicing constraints across refinance and purchase scenarios, maintaining strong compliance discipline',
      'Identify and surface process gaps, system limitations, and workflow friction observed in day-to-day retention activities — informing product and platform discussions at the organizational level',
      'Maintain current, hands-on familiarity with FHA, VA, GSE, portfolio, and secondary-market lending rules',
    ],
  },
  {
    title: 'Software Engineer — Technical Delivery Focus',
    org: 'Digital Payments Group',
    start: 'Sep 2024',
    end: 'Aug 2025',
    highlights: [
      'Partnered with engineering, compliance, and international teams to support modernization of legacy credit card processing platforms in a PCI-regulated environment',
      'Translated business, security, and compliance requirements into clear technical implementation plans for Java- and C-based systems',
      'Enhanced internal dashboards and reporting tools to improve data freshness and usability across product and engineering stakeholders',
      'Supported release readiness through structured regression testing, validation workflows, and coordinated deployment activities',
      'Contributed to planning efforts for migration toward cloud-based, microservices-oriented architectures on AWS',
    ],
  },
  {
    title: 'Software Engineer / Technical Delivery Contributor',
    org: 'Core10',
    start: 'Jul 2023',
    end: 'Jan 2024',
    highlights: [
      'Supported delivery of fintech integration initiatives by translating business and client requirements into actionable technical backlog items',
      'Partnered with architects and engineers to design and integrate APIs across core banking systems, middleware layers, and third-party platforms',
      'Established operational dashboards integrating AWS services and monitoring tools to improve system visibility and performance tracking',
      'Delivered secure, scalable solutions in regulated financial environments across product, engineering, and operations teams',
    ],
  },
  {
    title: 'AI Engineer / Product Delivery Lead',
    org: 'Inspire My Social',
    start: 'Feb 2022',
    end: 'Nov 2023',
    highlights: [
      'Led end-to-end delivery of a customer-facing SaaS product supporting mortgage professionals through AI-assisted content generation — reducing manual content creation effort by over 80%',
      'Defined product requirements, user workflows, and technical architecture for a secure, cloud-native platform serving authenticated loan officers',
      'Partnered with engineers to translate lending use cases into API-driven backend services deployed on AWS, including role-based access control, secrets management, and logging',
      'Drove platform-specific AI prompting for LinkedIn, Twitter, Facebook, TikTok, and YouTube — purpose-built for mortgage industry use cases',
    ],
  },
  {
    title: 'Regional Manager (VP)',
    org: 'Polaris Home Loans, River City Mortgage, and Carrington Mortgage',
    start: 'Oct 2015',
    end: 'Sep 2022',
    highlights: [
      'Led multi-site mortgage sales and operations teams across retail, portfolio, and secondary-market lending channels with pipelines exceeding $70M',
      'Owned operational performance while maintaining regulatory, investor, and internal compliance standards across FHA, VA, USDA, GSE, and non-QM products',
      'Drove change management initiatives supporting system enhancements, process improvements, and organizational scaling',
      'Developed and mentored managers and senior leaders in high-accountability, regulated environments',
    ],
  },
];

export const education: readonly Role[] = [
  {
    title: 'MS Information Technology',
    org: 'University of the People',
    detail: 'Focus: AI and machine learning',
    completed: false,
    start: 'Jan 2023',
    end: 'Dec 2026 (expected)',
    highlights: ['Coursework focused on machine learning, AI systems, and applied data science'],
  },
  {
    title: 'BA Economics, minor in Finance',
    org: 'Florida International University',
    completed: true,
    start: 'Aug 2004',
    end: 'May 2009',
    highlights: [
      'Foundation in economic analysis, quantitative reasoning, and financial systems — directly applicable to fintech and regulated product work',
    ],
  },
];

export type CertStatus = 'active' | 'in-progress' | 'exploring';

export const certifications: readonly { name: string; issuer: string; status: CertStatus }[] = [
  {
    name: 'Certified Scrum Product Owner (CSPO)',
    issuer: 'Scrum Alliance, 2026',
    status: 'active',
  },
  { name: 'Google AI Essentials', issuer: 'Google', status: 'active' },
  {
    name: 'Java / AWS Software Engineering',
    issuer: 'Nashville Software School, 2023',
    status: 'active',
  },
  {
    name: 'Google Project Management Certificate',
    issuer: 'Google / Coursera',
    status: 'in-progress',
  },
  { name: 'Microsoft AI-900: Azure AI Fundamentals', issuer: 'Microsoft', status: 'exploring' },
  {
    name: 'Microsoft AI-102: Azure AI Engineer Associate',
    issuer: 'Microsoft',
    status: 'exploring',
  },
];

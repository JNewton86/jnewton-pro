import type { DiscoverySection } from '..';

// Discovery questions for the AA Plus Bonding engagement. Ids are storage keys: add new
// questions with new ids rather than renumbering.
export const discovery: DiscoverySection[] = [
  {
    id: 'goals',
    title: 'Business, goals & success',
    lead: 'Anchor the project to outcomes before features. Everything else gets prioritized against these answers.',
    questions: [
      {
        id: 'g1',
        question: 'What does success look like 12 months after launch?',
        why: 'Need numbers: online bonds issued per month, share of quotes that bind without a phone call, revenue from instant issue, fewer inbound calls for simple bonds.',
      },
      {
        id: 'g2',
        question:
          'What prompted this now: the CapSpecialty partnership, a competitor, the aging site?',
        why: 'Tells you which workstream is the real priority if budget gets tight.',
      },
      {
        id: 'g3',
        question:
          'Who decides? Who approves design, copy, and go-live, and who is the day-to-day contact?',
        why: 'One approver avoids design-by-committee on the logo.',
      },
      {
        id: 'g4',
        question:
          'Budget range and target launch date? Any hard deadline (license renewal season, trade show, contract with CapSpecialty)?',
        why: 'Drives phasing. Brand + site can ship before the API work is done.',
      },
      {
        id: 'g5',
        question: 'Which competitors do you lose business to today?',
        why: 'suretybonds.com, Bryant Surety, JW Surety, local CT agencies. Shapes positioning: speed vs. relationship.',
      },
      {
        id: 'g6',
        question:
          'Which of the five asks (logo, AI hardening, landing pages, design, API) are must-have at launch vs. phase 2?',
        why: 'Confirm the phasing before writing the proposal.',
      },
    ],
  },
  {
    id: 'customers',
    title: 'Customers & bond mix',
    lead: 'The 38 bond types are not equal. Find the ten that matter and which ones the carrier will instant-issue.',
    questions: [
      {
        id: 'c1',
        question:
          'Of your 38 bond types, which drive most volume and most revenue? Top 10 of each.',
        why: 'These get dedicated landing pages and go first in the bond picker.',
      },
      {
        id: 'c2',
        question:
          'Which bond types and states do you expect CapSpecialty to instant-issue for you?',
        why: "We'll verify with getAutoUWBonds, but the client's expectation may not match the carrier's appetite.",
      },
      {
        id: 'c3',
        question: 'Typical bond amount and premium range per category?',
        why: 'Sets the review threshold for fraud rules and whether ACH/financing matters.',
      },
      {
        id: 'c4',
        question:
          'What share of business is Connecticut vs. other states? Which other states matter most?',
        why: 'State landing pages and licensing disclosures for the top states only.',
      },
      {
        id: 'c5',
        question:
          'Who is the buyer: individual, small business owner, office manager at a contractor? Mobile or desktop?',
        why: 'Decides form length, mobile-first priority, and reading level of copy.',
      },
      {
        id: 'c6',
        question: 'How much is renewal / repeat business, and how are renewals handled today?',
        why: 'Renewals are the easiest online revenue; POST renew exists in the API.',
      },
      {
        id: 'c7',
        question:
          'Which bonds must stay agent-handled (contract, performance, large amounts)? How should the site route those?',
        why: "Need a graceful 'an agent will call you' path with a lead captured, not a dead end.",
      },
    ],
  },
  {
    id: 'process',
    title: 'Current sales & operations',
    lead: "Map how a bond gets sold today so the online flow mirrors reality instead of inventing a new process the team won't follow.",
    questions: [
      {
        id: 'p1',
        question:
          "Walk me through a bond sale today, from first contact to the bond in the customer's hands.",
        why: 'Reveals the real steps, handoffs, and where same-day actually happens.',
      },
      {
        id: 'p2',
        question:
          'Where do leads come from today: Google, referrals, obligee lists, repeat customers?',
        why: 'Baseline for SEO/GEO and for judging what the new site adds.',
      },
      {
        id: 'p3',
        question:
          'How are applications collected today: the downloadable PDF forms, email, phone? Keep the forms page?',
        why: 'The downloadable forms page may rank; keep or redirect deliberately.',
      },
      {
        id: 'p4',
        question:
          'Who on the 5-person team handles online submissions, referrals, failed instant-issue cases, and after-hours?',
        why: "The site says '24 hours available.' Define what that means operationally.",
      },
      {
        id: 'p5',
        question:
          'Which agency management system do you use (Applied Epic, HawkSoft, EZLynx, QQ Catalyst, none)? Must the bond be recorded there?',
        why: 'May need an export or integration; affects where the system of record lives.',
      },
      {
        id: 'p6',
        question:
          'Who files the bond with the obligee: AA Plus or the customer? Are original wet-ink bonds ever required?',
        why: 'Some obligees still require originals; the PDF alone may not finish the job.',
      },
    ],
  },
  {
    id: 'payment',
    title: 'Payment & money flow',
    lead: 'The API has no payment call. Premium must be collected on the site before issueBond. These answers decide the processor and the sequencing.',
    callout:
      'The CapSpecialty API has no payment call. Premium must be collected on the site before issueBond runs, and there has to be a recovery path for charged-but-not-bound and bound-but-not-charged.',
    questions: [
      {
        id: 'm1',
        question:
          'Does CapSpecialty bill AA Plus (agency bill: you collect premium and remit net of commission) or bill the customer directly?',
        why: 'Determines whose merchant account collects, how commission is taken, and refund mechanics. Confirm with CapSpecialty too.',
      },
      {
        id: 'm2',
        question:
          'Do you have a payment processor today (Stripe, Square, Authorize.net, ePayPolicy, Simply Easier Payments, bank merchant account)?',
        why: 'Insurance-specific processors handle premium trust rules and fee pass-through; general ones are cheaper to integrate.',
      },
      {
        id: 'm3',
        question:
          'Cards only, or ACH too? Who absorbs processing fees, or do you pass a surcharge?',
        why: 'Surcharging has state rules and disclosure requirements; ACH is cheaper for larger premiums.',
      },
      {
        id: 'm4',
        question:
          'Do you add agency fees, filing fees or other charges on top of the carrier premium?',
        why: 'The API returns premium + surcharge. Anything else is added by the site and may be regulated per state.',
      },
      {
        id: 'm5',
        question: 'What is the refund and cancellation policy? Are premiums fully earned?',
        why: 'Needs to be stated at checkout; affects processor dispute handling.',
      },
      {
        id: 'm6',
        question:
          'Where must collected premium be deposited (premium trust account)? Who reconciles payouts to bonds?',
        why: 'Accounting needs a daily report: bond number, premium, processor fee, payout.',
      },
      {
        id: 'm7',
        question:
          'If the charge succeeds but the bind fails (or vice versa), who fixes it and how fast?',
        why: "We'll build authorize-then-capture, but a human process is still needed for edge cases.",
      },
      {
        id: 'm8',
        question: 'Do you want cards stored for renewals (card on file, auto-renew)?',
        why: 'Requires processor vaulting and renewal consent language; shapes Phase 3.',
      },
      {
        id: 'm9',
        question: 'Premium financing for larger bonds?',
        why: "Probably out of scope; confirm so it isn't assumed.",
      },
      {
        id: 'm10',
        question: 'Do you need receipts/invoices from the site, or does the AMS generate them?',
        why: 'Transactional email scope.',
      },
    ],
  },
  {
    id: 'api',
    title: 'CapSpecialty API & carrier relationship',
    lead: 'Everything the documentation leaves out, plus how the client wants referrals, renewals, and future carriers to behave.',
    questions: [
      {
        id: 'a1',
        question:
          'Do you have a UAT service account yet (client ID/secret, capexUsername/password, agencyCode)? Who is your CapSpecialty contact?',
        why: 'suretyapisupport@capspecialty.com per the doc. Nothing starts without credentials.',
      },
      {
        id: 'a2',
        question: "Can we get the 'API Authentication' document and the production base URL?",
        why: "Only the UAT endpoint is documented; the auth flow is in a document we don't have.",
      },
      {
        id: 'a3',
        question:
          'Can CapSpecialty share status values, error codes, rate limits, SLA, and sandbox test data?',
        why: 'None are in the doc. We need them to build error handling and tests.',
      },
      {
        id: 'a4',
        question:
          "When a submission is not instant-issue eligible, what happens on CapSpecialty's side? How is AA Plus notified?",
        why: "No webhooks exist; we'll poll getBondDetails. Need to know the underwriter turnaround to set customer expectations.",
      },
      {
        id: 'a5',
        question: 'Do you use the non-standard program (referToNSP)? When?',
        why: "Affects whether the site offers a 'try the secondary market' path for weaker credit.",
      },
      {
        id: 'a6',
        question:
          'Does instant issue require a signed indemnity agreement or application, or is the API submission sufficient?',
        why: 'If a signature is needed, e-sign (DocuSign, Dropbox Sign) enters scope.',
      },
      {
        id: 'a7',
        question: 'Online renewals in phase 1, or later?',
        why: 'POST renew exists; it needs payment plus a customer lookup by bond number.',
      },
      {
        id: 'a8',
        question:
          'Which additional carriers are planned, and do they have APIs? How should the site route between carriers: cheapest, preferred, appetite?',
        why: "Design the carrier-adapter layer now. Also: keep issueBond flag 'F' so nothing auto-binds while multi-quoting.",
      },
      {
        id: 'a9',
        question:
          'Are there disclosure rules when showing multiple carrier prices, or compensation differences that affect ordering?',
        why: "CT producer rules on rebating/disclosure; avoid implying 'cheapest' without saying so.",
      },
      {
        id: 'a10',
        question:
          'Who at AA Plus will do UAT testing, and how many test bonds can we run in the sandbox?',
        why: 'Sets the testing plan and timeline.',
      },
    ],
  },
  {
    id: 'compliance',
    title: "Compliance, security & 'AI hardening'",
    lead: "SSNs, credit pulls, and card payments on a 5-person agency's website. Get the obligations on the table early.",
    questions: [
      {
        id: 's1',
        question:
          "What do you mean by 'AI hardening'? AI-search readiness (GEO), bot/fraud defense, an AI assistant on the site, or internal AI tools?",
        why: 'Four very different scopes. See the Plan tab for the breakdown.',
      },
      {
        id: 's2',
        question:
          'Confirm: SSNs are required by the API for indemnitors. Are you comfortable collecting them online? Retention policy?',
        why: 'Recommendation: encrypt in transit, never log, never store in CRM, keep only last-4 after submission.',
      },
      {
        id: 's3',
        question:
          'Do you have approved credit-pull consent wording (FCRA) for the runCredit flag? From CapSpecialty or your attorney?',
        why: "The checkbox text is a legal document; we don't write it alone.",
      },
      {
        id: 's4',
        question:
          'Who writes/approves the privacy policy, terms, and e-sign/e-consent disclosures?',
        why: 'Needed before any live transaction; attorney involvement typical.',
      },
      {
        id: 's5',
        question:
          'Which states require license numbers or disclosures on the site? Any states you cannot sell in online?',
        why: "48 states licensed; show the top states' license info in the footer and bond pages.",
      },
      {
        id: 's6',
        question:
          'Does your E&O or cyber carrier have requirements for online binding or data handling?',
        why: 'Sometimes dictates MFA, encryption, or vendor review.',
      },
      {
        id: 's7',
        question:
          'Fraud tolerance: review threshold by bond amount, velocity limits, address/ID verification?',
        why: 'Instant bonds + stolen cards = chargebacks. Agree the rules, e.g. anything over $X or mismatched addresses goes to review.',
      },
      {
        id: 's8',
        question: 'Accessibility target (WCAG 2.1 AA)? Any government obligees that require it?',
        why: 'Cheap if planned, expensive if retrofitted.',
      },
      {
        id: 's9',
        question: 'Where should the application data live after submission, and for how long?',
        why: 'Data map: WordPress (none), CRM (contact + bond type), backend DB (submission IDs, no SSN), carrier (everything).',
      },
    ],
  },
  {
    id: 'crm',
    title: 'CRM, abandonment & follow-up',
    lead: 'The client wants abandoned quotes captured for drip campaigns and manual outreach. Define the tool, the trigger, and the consent.',
    questions: [
      {
        id: 'r1',
        question:
          'Which CRM do you use today, if any (HubSpot, Salesforce, Zoho, AMS built-in, spreadsheet)? Who owns it?',
        why: 'HubSpot free tier plus its forms API is a common fit for a 5-person shop.',
      },
      {
        id: 'r2',
        question:
          'At what step should a lead be captured? Proposal: after name, email, phone, bond type, state, amount, before any SSN.',
        why: 'Early enough to follow up, never capturing sensitive data in the CRM.',
      },
      {
        id: 'r3',
        question: 'What counts as abandoned: 30 minutes idle? 24 hours without binding?',
        why: 'Sets the automation trigger and the first email timing.',
      },
      {
        id: 'r4',
        question:
          'Who writes the drip emails and in which tool? Cadence (e.g. 1 hour, 1 day, 3 days, 7 days)?',
        why: 'Copy is a deliverable; decide whose.',
      },
      {
        id: 'r5',
        question: 'SMS follow-up too? If so, TCPA consent language is required at capture.',
        why: 'Changes the form and the legal review.',
      },
      {
        id: 'r6',
        question:
          'Who calls abandoned quotes and within what window? How should the team be notified (email, text, Slack)?',
        why: 'The manual process is often what actually converts.',
      },
      {
        id: 'r7',
        question: 'Lead-source tracking: UTM parameters, Google Ads, call-tracking numbers?',
        why: 'Needed to prove ROI of the landing pages.',
      },
      {
        id: 'r8',
        question: 'Should completed bonds also sync to the CRM (customer record, renewal date)?',
        why: 'Enables renewal reminders a year out.',
      },
    ],
  },
  {
    id: 'web',
    title: 'Website, hosting & SEO',
    lead: 'Preserve what ranks, decide what to keep on WP Engine, and settle where the quote app and backend will run.',
    questions: [
      {
        id: 'w1',
        question:
          'Stay on WordPress / WP Engine? Which plan? Who has admin, and who maintains plugins after launch?',
        why: "WP Engine can't host the quote backend; the marketing site can stay, the app lives elsewhere.",
      },
      {
        id: 'w2',
        question:
          'Access to Google Analytics, Search Console, and Google Business Profile? Which pages get traffic today?',
        why: "Builds the URL-preservation / 301 map so SEO isn't lost.",
      },
      {
        id: 'w3',
        question:
          'Domain registrar and DNS access? Email hosting (for SPF/DKIM on transactional email)?',
        why: 'Needed for subdomains (quote.aaplusbonding.com) and deliverability.',
      },
      {
        id: 'w4',
        question:
          'Who writes the bond-type pages and FAQ content? Existing copy, obligee requirements, forms?',
        why: '38 bond pages is the biggest content lift. Decide ownership and whether AI-assisted drafts with agent review are acceptable.',
      },
      {
        id: 'w5',
        question: 'Which landing pages or campaigns are planned? Paid ads budget?',
        why: 'Shapes the audience hub pages and the conversion-funnel pattern.',
      },
      {
        id: 'w6',
        question:
          'Quote app embedded in WordPress or on a subdomain? Who pays for app hosting, processor, email provider?',
        why: 'Cost ownership; client should own every account.',
      },
      {
        id: 'w7',
        question: 'Spanish-language pages?',
        why: 'Common for CT contractor and auto-dealer audiences.',
      },
      {
        id: 'w8',
        question:
          'Reviews and trust signals: Google reviews count, BBB, carrier A.M. Best ratings you can display?',
        why: "The new design leans on these; confirm what's real and usable.",
      },
    ],
  },
  {
    id: 'brand',
    title: 'Brand & logo',
    lead: 'The client is open to a logo redesign. Find out how open, and what has to survive.',
    questions: [
      {
        id: 'b1',
        question:
          "What does 'AA Plus' mean, and where did the name come from? Any attachment to the current mark?",
        why: 'Decides refresh vs. replace.',
      },
      {
        id: 'b2',
        question:
          'Three words the brand should feel like. Brands or sites you admire (inside or outside insurance)?',
        why: 'Steers the five pattern directions.',
      },
      {
        id: 'b3',
        question:
          'Colors to keep or avoid? Print collateral, signage, vehicles, or business cards that would need updating?',
        why: 'Hidden cost of a logo change.',
      },
      {
        id: 'b4',
        question:
          'Logo deliverables expected: SVG/PNG, favicon, social avatars, a one-page brand guide?',
        why: 'Scope the deliverable list explicitly.',
      },
      {
        id: 'b5',
        question:
          'Real team photos and office photography available, or willing to shoot? Customer testimonials we can quote by name?',
        why: 'The relationship-led pattern depends on real people; stock photos undercut it.',
      },
    ],
  },
  {
    id: 'scope',
    title: 'Scope, timeline & commercial',
    lead: 'Close the meeting with the contractual shape so the proposal has no surprises.',
    questions: [
      {
        id: 'x1',
        question: 'Fixed-price by phase, or time and materials? Payment milestones?',
        why: 'Phase 2 has API-side unknowns; consider T&M or a contingency there.',
      },
      {
        id: 'x2',
        question: 'Ongoing support after launch: retainer, hourly, or hand-off?',
        why: "Carrier API changes and WordPress updates don't stop at launch.",
      },
      {
        id: 'x3',
        question: 'Code and account ownership: client owns repo, hosting, processor, CRM, domain?',
        why: 'Default yes; write it down.',
      },
      {
        id: 'x4',
        question:
          'What will AA Plus deliver and by when: content, photos, credentials, legal copy?',
        why: 'Client-side delays are the usual schedule risk.',
      },
      {
        id: 'x5',
        question:
          'How will we communicate and how often? Weekly call, shared channel, demo cadence?',
        why: 'Set expectations for a part-time engagement.',
      },
    ],
  },
];

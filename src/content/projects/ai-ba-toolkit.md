---
title: AI BA Toolkit
tagline: Three AI agents built to demonstrate business analyst capabilities in production.
summary: A live demo of applied AI development across three purpose-built agents for field sales, requirements analysis, and market research. Built with React, Vite, and the Claude API, and deployed on Vercel behind an access code.
category: AI / Product
status: live
featured: true
order: 1
stack:
  - React
  - Vite
  - Claude API
  - Web search
  - Vercel Functions
  - Upstash Redis
  - PDF export
features:
  - label: Agent 01
    title: Field Sales Business Validation Agent
    description: One-click business lookup for field sales reps. Returns color-coded confidence scoring, source attribution distinguishing web data from CRM data, residential address flagging, and a PDF export of the full report. Includes proprietary data placeholders designed for CRM integration.
  - label: Agent 02
    title: Requirements Analyst Agent
    description: Takes vague stakeholder problem statements and turns them into structured BA artifacts — user stories, acceptance criteria, edge cases, and an AI opportunity assessment mapped to Microsoft Copilot and Azure AI Foundry.
  - label: Agent 03
    title: Small Business Research Agent
    description: Uses live web search to surface business insights, competitive context, and opportunity signals relevant to small business owners and the organizations that advocate for them.
  - title: Access control and cost limits
    description: The access code is checked on the server and visitors get a signed session. Per-visitor rate limits and a spend ceiling keep the demo controlled, and the API key never reaches the browser.
outcome: Built and deployed in one week, and used as a live demo in hiring conversations. It shows the core skill set evaluated in AI business analyst roles — identifying a real business need, designing an AI solution around it, and shipping something that works.
demo:
  type: on-request
---

The AI BA Toolkit is a working web application built to demonstrate AI business analyst capabilities — not the theory, but tools that solve actual business problems. It was built in one week with React, Vite, and the Claude API, then deployed on Vercel.

The toolkit includes three purpose-built agents, each targeting a use case relevant to AI business analysis and product work: field sales validation, structured requirements generation, and small business research.

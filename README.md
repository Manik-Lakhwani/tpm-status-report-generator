# TPM Status Report Generator

An AI-powered single-page web utility for Technical Program Managers. Enter sprint metrics, pick an audience, and get a formatted leadership status report in under 10 seconds — powered by Claude (claude-sonnet-4-6).

Built as Part 11 of the PanScience Innovations (PSI) Technical Program Manager take-home assignment.

**Live demo:** `https://YOUR-PROJECT.vercel.app` ← replace after deploy

---

## What it does

You fill in:
- Sprint number, goal, points committed vs completed
- Open bug counts (P1, P2, P3)
- Health status per dimension (Schedule, Scope, Quality, Risks, Resources, Budget)
- Next milestone, top risks, decisions needed from leadership
- Report audience (Group CTO / CEO / Client sponsor)

You get: a formatted, copy-ready weekly status report with the right tone for your audience. Same data, three different reports.

---

## Deploy to Vercel (3 minutes)

### 1. Push to GitHub

```bash
git clone https://github.com/YOUR_USERNAME/tpm-status-report-generator
cd tpm-status-report-generator
# or if starting fresh:
git init && git add . && git commit -m "feat: TPM Status Report Generator"
git remote add origin https://github.com/YOUR_USERNAME/tpm-status-report-generator.git
git push -u origin main
```

### 2. Deploy on Vercel

1. Go to [vercel.com](https://vercel.com) and sign in with GitHub.
2. Click **Add New → Project** and import your repository.
3. Framework preset: **Other** (no framework).
4. Under **Environment Variables**, add:
   - Key: `ANTHROPIC_API_KEY`
   - Value: your Anthropic API key (get one free at [console.anthropic.com](https://console.anthropic.com))
5. Click **Deploy**.

Done. Your app is live at `https://YOUR-PROJECT.vercel.app`.

> **Your API key is stored as a secure environment variable on Vercel's servers. It is never exposed in the browser or in the code.**

---

## How it works (architecture)

```
Browser (index.html)
  │  POST /api/generate  { model, messages }
  ▼
Vercel serverless function (api/generate.js)
  │  reads ANTHROPIC_API_KEY from env
  │  POST https://api.anthropic.com/v1/messages
  ▼
Claude (claude-sonnet-4-6)
  │  returns formatted status report
  ▼
Browser renders the report
```

The browser never touches the Anthropic API directly. This avoids CORS restrictions and keeps the API key secure.

---

## Repository structure

```
tpm-status-report-generator/
├── index.html          Single-page app (HTML + CSS + JS, no build step)
├── api/
│   └── generate.js     Vercel serverless function (the proxy)
├── vercel.json         Routing configuration
└── README.md           This file
```

---

## The prompt design

Click **View the prompt sent to Claude** in the app to see the full prompt. Three design principles:

**1. Structured input, not freeform.** Specific fields (velocity %, RAG per dimension, risks, decisions) are assembled into a structured brief. Claude summarises provided facts rather than inventing details.

**2. Exact format rules.** Section headers, bullet count and word limits are enforced in the prompt, so the output can be dropped into an email without editing.

**3. Audience-specific tone.** A single sentence at the end of the prompt changes the register:
- Group CTO: direct and technical, up to 350 words, full risk names and severity
- CEO: executive tone, no jargon, up to 250 words
- Client sponsor: professional, hides internal risk details, up to 250 words

---

## Why I built this

As a TPM on a 12-week project I write a status report every Friday. The structure is always the same (this week, next week, risks, decisions) but the audience changes. Keeping three consistent versions manually costs about 45 minutes per week. This tool produces all three in under a minute from one set of inputs.

---

## AI tools used

| Tool | Use |
|---|---|
| Claude claude-sonnet-4-6 | Report generation (via Anthropic Messages API) |
| Claude (claude.ai) | Prompt design, prototyping and testing |

---

## Limitations and ideas for extension

- Connect to Jira/Linear API to auto-fill sprint metrics instead of typing them
- Save a history of past reports to `localStorage`
- Add a PDF export button
- Multi-language report output (aligns with the Part 9 scope discussion in the main assignment)
- Slack integration to post the report directly to a channel

---

## Assignment context

Part 11 (AI Productivity and Automation Exercise) of the PSI Technical Program Manager take-home assignment. The pre-filled default values match the Week 5 mock data from the Project Health Dashboard in the same submission.

# InternTrack AI

**InternTrack AI** is a complete, deployable web application designed for students and early-career candidates. It discovers jobs and internships, explains fit, prepares truthful applications, submits through authorized or clearly labelled simulated paths, and tracks the full application lifecycle.

---

## 🌟 Non-Negotiable Product Rules & Architectural Invariants

1. **Submission Confirmation**: "Application submitted" is rendered ONLY when a connector returns reliable confirmation. A local database insert is never treated as confirmation.
2. **Strict Truthfulness**: Candidate skills, projects, employment, grades, metrics, certifications, dates, or answers are NEVER invented. Gaps are explicitly listed as gaps.
3. **No Wall Bypassing**: CAPTCHAs, MFA, login walls, rate limits, or platform terms are never bypassed. When blocked, the application state transitions to `needs_candidate_action` with an "Open original listing" button.
4. **No Silent Merges**: Uncertain duplicate jobs are offered for linking with candidate confirmation.
5. **Explicit Status Updates**: Rejection or withdrawal is set ONLY by explicit candidate or connector events; silence or passed deadlines do not infer rejection.
6. **Immutable Application Events**: `application_events` rows are strictly append-only. Corrections are written as new compensating events (RLS permits ONLY `INSERT` and `SELECT`, with no `UPDATE` or `DELETE` policies).
7. **Secrets Isolation**: LLM keys, connector credentials, and the Supabase service-role key NEVER touch browser code. All privileged AI logic lives in server-side Edge Functions.
8. **Demo Label**: All demo data and simulated submissions carry an amber `DEMO` badge and are excluded from real submission metrics.
9. **Untrusted Data Handling**: Job descriptions, resume text, and pasted links are treated as untrusted data; embedded instructions inside them are ignored.
10. **Match Fit Clarity**: A match fit score is described strictly as an estimate based on candidate data, never a hiring prediction or recruiter guarantee.

---

## 🏗 Tech Stack

- **Frontend**: React 18 + TypeScript (Strict), Vite, Tailwind CSS, Lucide React, React Router v6, TanStack Query v5, `@dnd-kit/core` for Kanban drag-and-drop, date-fns + date-fns-tz, Recharts.
- **Backend & Database**: Supabase PostgreSQL with RLS enabled on ALL tables, private Storage bucket `resumes`, Deno Edge Functions in `supabase/functions/`.
- **Testing**: Vitest automated unit tests for matching, SSRF guards, deduplication, and submission state transitions.

---

## 🚀 Getting Started

### 1. Installation

```bash
# Clone the repository and install dependencies
npm install
```

### 2. Run Development Server

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) in your browser.

### 3. Run Automated Tests

```bash
npm run test
```

Executes Vitest suite testing matching score calculation, SSRF validator, trigram similarity deduplication, and state machine transitions.

---

## 🔑 Environment Variables & Secrets

Create a `.env` file in the project root:

```env
VITE_SUPABASE_URL=https://your-supabase-project.supabase.co
VITE_SUPABASE_ANON_KEY=your-anon-key
```

### Edge Function Secrets (Supabase Dashboard or CLI):

```bash
supabase secrets set LLM_API_KEY=your-gemini-or-lovable-gateway-key
```

---

## 🗄 Database Migration Order

Run the migration script against your Supabase instance:

```bash
supabase db push
# Or execute: supabase/migrations/20261010000000_init_schema.sql
```

---

## 🛡 Security & Verification

- **SSRF Guard**: Validates URLs against private IP subnets (`127.0.0.0/8`, `10.0.0.0/8`, `172.16.0.0/12`, `192.168.0.0/16`, `169.254.0.0/16`, `::1`), enforces `https://`, limits redirects to 3, and sets an 8s timeout.
- **State Machine**: Validates transitions between `draft` -> `awaiting_review` -> `ready_to_submit` -> `submitting` -> `submitted` | `submission_uncertain` | `failed` | `needs_candidate_action`.
- **Sensitive Fields**: Always pauses and requires candidate confirmation for legal declarations, work authorization, demographic data, or secrets.

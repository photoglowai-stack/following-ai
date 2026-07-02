# OpenLookup Audit Lab

OpenLookup Audit Lab is a local MVP that demonstrates how one backend endpoint can orchestrate consent-based public OSINT providers for a personal digital exposure audit.

It is designed for:

- self-audit;
- consent-based lookup;
- security audit;
- fraud prevention;
- educational and PowerPoint demonstration.

It is not a stalking, doxxing, surveillance, private-account scraping, password reset automation, or platform-bypass tool.

## Legal Use Only

Use this project only on your own data or with explicit authorization. Do not bypass logins, captchas, paywalls, anti-bot protections, rate limits, or platform terms. Do not use private Instagram, TikTok, Facebook, LinkedIn, Google, or other platform sessions. Sensitive providers are disabled by default and guarded by purpose checks.

## Architecture

Frontend → `/api/lookup` → Provider Registry → CLIs/APIs → Normalization → Scoring → Report.

Core files:

- `app/page.tsx`: local UI with lookup, benchmark, provider health, and PowerPoint notes.
- `app/api/lookup/route.ts`: main lookup endpoint.
- `app/api/benchmark/route.ts`: benchmark endpoint.
- `app/api/tools/health/route.ts`: provider health endpoint.
- `lib/toolRegistry.ts`: provider catalog and flags.
- `lib/providerRunner.ts`: provider orchestration, concurrency, deduplication, partial failure handling.
- `lib/safeExec.ts`: single safe CLI execution path using `execFile` with `shell: false`.
- `lib/normalizers.ts`: safe signal normalization and filtering.

## Installation

```bash
npm install
npm run dev
```

Open `http://localhost:3000`.

## Mock Mode

Mock mode is enabled by default:

```bash
MOCK_MODE=true
```

In mock mode no external API or CLI provider is called. The app returns safe fictional signals for email, phone, username, name, and wallet inputs.

## Enable Providers

Copy `.env.example` to `.env.local`, then explicitly enable only the providers you want:

```bash
ENABLE_SHERLOCK=true
ENABLE_MAIGRET=true
MOCK_MODE=false
```

Sensitive providers such as Holehe, Ignorant, h8mail, and GHunt should stay off unless the run is a self-check or explicit consent test.

## Install Tools

Recommended starting tools:

```bash
pipx install sherlock-project
pipx install maigret
pipx install socialscan
```

Other tools:

- Holehe: `pipx install holehe`
- PhoneInfoga: use the official PhoneInfoga installation guide.
- GHunt: use the official GHunt installation guide.
- SpiderFoot: use the official SpiderFoot installation guide.
- Recon-ng: use the official Recon-ng installation guide.

Do not automatically install sensitive tools for users. Keep them opt-in.

## Why Providers Are Disabled By Default

OSINT tools can create false positives, hit rate limits, violate platform terms if misused, or reveal sensitive metadata. This app defaults to local mock mode and requires an explicit `purpose` for every lookup. High-risk providers are gated and do not store results.

## Testing On Your Own Data

1. Keep `MOCK_MODE=true` for the first run.
2. Run a lookup using `purpose: self_check`.
3. Enable one low-risk provider at a time.
4. Review warnings and provider health before trusting any result.
5. Never paste secrets, private cookies, platform tokens, or third-party personal data.

## Limits

- Results can be incomplete.
- Results can be false positives.
- Platforms change behavior and block automated checks.
- Rate limits apply.
- The tool does not guarantee identity, ownership, or account control.
- Name-only matching is intentionally scored lower.

## Storage And Logging

`STORE_RESULTS=false` by default. The MVP does not persist lookup results. Full emails and phone numbers are masked in responses and command output is redacted before parsing or returning errors.

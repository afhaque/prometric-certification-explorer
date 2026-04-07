---
task: Replace mock data with real Prometric exam data
slug: 20260407-000000_prometric-real-exam-data
effort: extended
phase: complete
progress: 8/8
mode: interactive
started: 2026-04-07T00:00:00Z
updated: 2026-04-07T01:00:00Z
---

## Context

User requested replacing AI-generated mock exam data with real Prometric exam data sourced from prometric.com/find-your-exam. The site is Cloudflare-protected (JS challenge on exam pages), but the sitemap index at sitemap.xml was accessible via curl with Chrome headers, revealing a partnersExams sitemap with 433 real exam slugs (updated April 6, 2026). The previous dataset had 267 entries — all real codes/names from a prior sitemap scrape, but with AI-generated descriptions.

Chatbot at src/app/api/chat/route.ts already reads directly from data/exams.json, so no code changes were needed — only data update.

### Risks
- New entries for ~166 new slugs use best-knowledge descriptions; some obscure entries (bbsm, gisi, etc.) remain uncertain
- CompTIA and a few other entries from the old 267 that weren't in the new sitemap were dropped (they may have moved to other test providers)

## Criteria

- [x] ISC-1: Prometric sitemap scraped for complete current exam list
- [x] ISC-2: All 433 real exam slugs from sitemap are in dataset
- [x] ISC-3: All 267 existing entries preserved where slug matches
- [x] ISC-4: 166 new entries added with accurate names and descriptions
- [x] ISC-5: All 4 fallback slugs resolved (caint-bie, caint-opi, resna-practice, wvceprov)
- [x] ISC-6: Dataset has zero fallback/placeholder entries
- [x] ISC-7: Chatbot route.ts reads from exams.json (no code change needed)
- [x] ISC-8: Build script saved to scripts/build-exams.mjs for future updates

## Decisions

- Used Prometric sitemap (sitemaps-1-section-partnersExams-1-sitemap.xml) as source of truth — 433 slugs, last modified 2026-04-06
- Kept existing entries as-is where slug matched (names + descriptions already reasonable)
- For new slugs: used domain knowledge of certifying bodies; best-effort descriptions
- Dropped old entries not in the new sitemap (e.g., comptia-* variants which moved to Pearson VUE)

## Verification

- node scripts/build-exams.mjs output: "Total entries: 433 — All slugs resolved successfully."
- Category breakdown: Healthcare 181, Other 71, Financial 60, Technology 47, Government 47, Education 27
- Type breakdown: In-Center 425, Remote 5, Hybrid 3
- Chatbot system prompt auto-generated from exams.json at request time — no additional changes needed

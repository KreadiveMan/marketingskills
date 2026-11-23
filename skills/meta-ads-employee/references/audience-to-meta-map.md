# Audience Intel to Meta Levers

Every row in the Stage 2 document needs a **Meta lever**: the specific thing you'll do in the account or the creative because of it. This file holds the mapping rules and the standard audience definitions.

Platform options change often. Retention windows and targeting controls below were the common defaults as of late 2026; confirm in Ads Manager or the connected Meta tools before building, and mark anything you couldn't confirm as `[verify]` in the build sheet.

## Contents

- The mapping rule
- Where each Stage 2 item lands
- Standard custom audiences
- Exclusion stack
- Advantage+ audience: hard controls vs suggestions
- Restricted categories
- Audience sizing sanity checks

## The Mapping Rule

Meta's delivery system finds buyers from the creative, the conversion signal, and the account's history far better than from interest lists. So:

- **ICP and triggers shape the creative** (who the ad speaks to, the hook, the angle, the proof). They rarely shape the audience.
- **Intent signals shape retargeting and seeds** (custom audiences, lookalikes, Advantage+ suggestions).
- **Anti-ICP shapes exclusions, copy friction, and the optimization event.**
- **DMU shapes the message mix** (which concepts exist so each role sees its argument) and the landing page sections.

## Where Each Stage 2 Item Lands

| Stage 2 item | Primary lever | Secondary lever | Example |
|-------------|---------------|-----------------|---------|
| ICP segment | Concept and copy (name the situation in the hook) | Advantage+ audience suggestions; customer-list seed | "For working moms who get home at 7" as the opening line |
| ICP buying language | Headlines, primary text, on-image text | Comment replies, landing page | Quote the review phrase verbatim |
| DMU role | One concept per role that matters | Landing page section, FAQ | Approver concept: "Cheaper than ordering out three times" |
| Anti-ICP | Exclusions and geo exclusions | Disqualifying copy, form friction, optimization event | Exclude refused-COD customer list; "Delivery inside Cairo and Giza only" |
| Trigger event (calendar) | Campaign schedule and seasonal concepts | Budget ramp | Ramadan concept set live 10 days before |
| Trigger event (life/problem) | Hook that names the moment | Dayparting | "Fridge empty at 11pm?" running 9pm to 1am |
| Intent signal | Custom audience for retargeting or exclusion | Seed for lookalike or suggestions | ATC 14 days → offer reminder ad |

## Standard Custom Audiences

Build these once per account; name them with the convention `CA | <source> | <event> | <window>`.

| Audience | Source | Typical window | Use |
|----------|--------|----------------|-----|
| Purchasers | Pixel/dataset Purchase, or customer list | 180 days (website max) | Exclude from prospecting; seed lookalike; upsell |
| Checkout started, not purchased | InitiateCheckout minus Purchase | 7 to 14 days | Highest-intent retargeting |
| Added to cart, not purchased | AddToCart minus Purchase | 14 to 30 days | Retargeting with objection-handling or offer |
| Product or menu viewers | ViewContent | 30 days | Retargeting with proof and bestsellers |
| All site visitors | PageView | 30 to 180 days | Broad warm pool; exclusion for pure prospecting tests |
| Video viewers | 50% or 95% of video ads | 30 to 365 days | Sequencing: hook ad viewers get the proof ad |
| IG / Page engagers | Instagram account or Facebook Page engagement | 30 to 365 days | Warm audience; seed |
| Messaged the business | Messaging engagement | 30 to 365 days | Follow-up offer; exclude if already a buyer |
| Lead form openers, not submitted | Lead form engagement | up to 90 days `[verify]` | Retarget with lower-friction offer |
| Customer list: high LTV | CRM upload | n/a (refresh monthly) | Best lookalike seed |
| Customer list: anti-ICP | CRM upload (refusers, serial returners) | n/a | Exclusion |

Retargeting only earns its own ad set when the pool is large enough to spend the budget without frequency blowing past ~4 in a week. Small accounts usually do better letting Advantage+ include warm audiences inside the broad campaign and running retargeting as creative (objection and proof concepts) rather than as separate ad sets.

## Exclusion Stack

Apply to prospecting campaigns unless a test says otherwise:

1. Purchasers in the repeat window (e.g. last 30 to 90 days for consumables, 180 for durables)
2. Anti-ICP customer lists (refusers, chargebacks, serial returners)
3. Employees and agency staff list if it exists
4. Out-of-zone geographies

Don't stack exclusions so hard the audience shrinks below what the budget needs; broad delivery depends on room to explore.

## Advantage+ Audience: Hard Controls vs Suggestions

With Advantage+ audience on, Meta treats most targeting as a **suggestion** it may go beyond when it finds better results. Keep straight which inputs still bind:

| Input | Behaviour |
|-------|-----------|
| Location | Hard control |
| Minimum age (where legally required) | Hard control |
| Language | Use when the creative is in one language |
| Custom audience exclusions | Hard control in most setups `[verify]` |
| Detailed targeting (interests, behaviours) | Suggestion |
| Age range, gender | Suggestion unless set as a control |
| Custom audiences / lookalikes as inclusions | Suggestion (a starting point) |

Rule: use suggestions to give a new account a head start (customer list, ICP interests), then let delivery widen. If the user needs a strict audience (B2B list, regulated product), use original audience options and say what that costs in reach.

## Restricted Categories

- **Special ad categories** (housing, employment, credit/financial products, social issues, elections, politics) limit age, gender, location radius, and lookalike options. Declare them; ads that should have been declared get rejected.
- **Health and wellness**: Meta limits use of some lower-funnel events and custom audience data for health-related advertisers in several markets. Check the dataset and event restrictions before building the strategy around purchase optimization.
- **Personal attributes**: copy can't assert or imply the viewer's health, finances, religion, ethnicity, or other personal traits ("Are you overweight?"). Speak to the situation, not the person's attributes.

## Audience Sizing Sanity Checks

- Prospecting: broad country or region, usually millions of people in large markets. Narrowing below what the daily budget can explore slows learning.
- Learning phase needs about 50 optimization events per ad set per week; budget ≈ target CPA × 50 ÷ 7 per day per ad set. If the budget can't support that, consolidate ad sets or optimize one step up the funnel.
- Retargeting pools below a few thousand people rarely justify their own ad set; fold them into creative or broad campaigns.

# Strategy Blueprint: Stage 3

Turns the Business Brain and Audience Intel into a Meta plan. Every threshold is a multiple of **target CPA** (from Stage 1), so decisions become arithmetic. The operating thresholds adapt the **ads** skill's [Meta decision system](../../ads/references/meta-decision-system.md), where TCPL plays the same role for B2B leads. Its [Andromeda playbook](../../ads/references/meta-andromeda-playbook.md) explains why creative volume and broad audiences matter.

## Contents

- Objective and optimization event
- Default account structure
- Budget math
- Creative portfolio and test throughput
- Testing roadmap
- Kill, keep, iterate, scale rules
- KPIs and review cadence
- Market notes (MENA, COD, messaging)
- Strategy output template

## Objective and Optimization Event

| Business | Objective | Optimize for | Judge on |
|----------|-----------|--------------|----------|
| eCommerce, online checkout | Sales | Purchase (value if catalog and AOV vary) | Contribution margin per order, MER |
| eCommerce, COD-heavy | Sales | Purchase, ideally a confirmed-order event sent via Conversions API | Delivered-order CPA |
| F&B delivery, own site/app | Sales | Purchase | Contribution per order, repeat within 60 days |
| Business that sells in chat (WhatsApp, Messenger, IG Direct) | Engagement (messages) or Sales with message destination | Conversations, or purchases if tracked | Cost per sale closed in chat |
| Lead gen (services, B2B, high ticket) | Leads | Lead, or a qualified-lead CAPI event | Cost per qualified lead |
| Store visits / local | Awareness or Sales with local signals | Reach or store traffic | Footfall or code redemptions |

**Event volume rule:** optimize on the deepest event that reaches about 50 per ad set per week. If Purchase can't, optimize AddToCart or InitiateCheckout for the first weeks and still judge on purchases.

## Default Account Structure

```
Campaign A: TEST | Sales | Broad | CBO           ~20% of budget
  Ad set: Broad country, Advantage+ audience, exclusions stack
  Ads: new concepts (statics first), 3 to 6 at a time

Campaign B: SCALE | Sales | Broad | CBO or Advantage+ sales   ~80% of budget
  Ad set: same broad audience
  Ads: graduated winners only

Campaign C (optional): RT | Sales | Warm pools          only if pools are big enough
  Ad set: ATC + checkout 14d, viewers 30d, engagers 30d
  Ads: proof, objection, offer concepts
```

- Same audience in Test and Scale: the split protects test budget, it isn't audience segmentation.
- New account or under ~30 purchases a month: start with one campaign (Test) and let winners stay there until volume exists.
- Advantage+ sales campaigns once the account has conversion history and a proven offer.
- Destination test (PDP vs collection vs landing page vs WhatsApp) when the page, not the creative, is the unknown: one ad set per destination, same creatives in each.

## Budget Math

```
Learning-phase budget per ad set / day ≈ target CPA × 50 ÷ 7
Ad-count ceiling                       = (daily budget × 14) ÷ (2 × target CPA)
Test throughput / month                ≈ (monthly budget × 0.20) ÷ (3 × target CPA)
Proven-ad inventory needed             ≈ monthly budget ÷ spend one proven ad absorbs before fatigue (account-specific; start from history)
```

Example: target CPA 300, daily budget 3,000. Learning budget ≈ 2,143/day per ad set (one consolidated ad set). Ad-count ceiling = 42,000 ÷ 600 = 70, so the budget isn't the limiter; creative supply is. Test throughput ≈ (90,000 × 0.20) ÷ 900 = 20 concepts a month, about 5 a week.

If the budget can't reach the learning bar: fewer ad sets, one campaign, an up-funnel optimization event, or a bigger budget. State the trade-off; don't spread thin.

## Creative Portfolio and Test Throughput

Default mix for a new account, adjusted by category:

| Format | Share of new concepts | Role |
|--------|----------------------|------|
| Static (single image) | 50 to 60% | Cheapest way to validate a concept; feed and Stories |
| Motion graphics (5 to 15s) | 15 to 25% | Demonstration, product reveal, offer animation; reuses static assets |
| UGC / creator / founder video | 15 to 25% | Trust, objection handling, cold reach; partnership ads where possible |
| Catalog / dynamic product ads | always-on where a catalog exists | Retargeting and broad product discovery |

A concept is a new product truth, angle, or awareness level. A resize, color change, or new headline on the same idea is a variant, and Meta tends to group near-identical ads. Plan concepts first, variants second.

## Testing Roadmap

Write the first four weeks as test cells:

| Week | Test | Hypothesis | Metric | Comparison | Expected direction |
|------|------|-----------|--------|-----------|-------------------|
| 1 | 4 to 6 concepts, one per ICP segment / trigger | Situation-specific hooks beat generic product ads | Cost per purchase | Concepts against each other in one CBO | At least one concept under target CPA |
| 2 | Iterate the leader's hook (3 variants) | Hook drives most of the variance | Thumb-stop rate, CPA | New hooks vs original | One hook lowers CPA |
| 3 | Motion version of the top static | Movement improves click-through for this concept | CTR, CPA | Motion vs static | Motion at or below static CPA |
| 4 | Offer or destination test | The page or offer, not the creative, limits conversion | Conversion rate, CPA | Destination A vs B | One destination lowers CPA |

Every `[HYPOTHESIS]` row from Stage 2 should appear in a test cell or be explicitly deferred.

## Kill, Keep, Iterate, Scale Rules

Let each new ad run about 5 to 7 days before judging it.

1. **Delivery check (day 7):** spend below half its fair share (campaign budget ÷ active ads × 7 × 0.5) → kill. Meta already deprioritized it; change hook or visual, not copy.
2. **Data gate:** spend under 3 × target CPA → wait.
3. **Zero purchases at 3 × target CPA** → kill the concept.
4. **CPA ≤ target** → candidate winner. **1 to 1.5 × target** → monitor one more week. **Over 1.5 ×** → swap.
5. **Graduate** to Scale when: several purchases, CPA ≤ target over 14 days, still converting in the last 7 days.
6. **Fatigue:** frequency over ~3 in prospecting, CTR down 20%+ from its peak over 7 days, or CPM up 30%+ over 2 weeks → stage replacements now.
7. **Scale** in steps of about 20% every few days when CPA holds and replacements are staged. Roll back 20 to 30% if CPA passes 1.5 × target after a step.
8. **Never edit a running winner.** Launch the new version beside it.

## KPIs and Review Cadence

| Level | Decision metrics | Diagnostic metrics | Ignore for decisions |
|-------|------------------|--------------------|---------------------|
| Business | Contribution margin after ads, MER, new-customer share | Repeat rate, refusal rate | Platform ROAS alone |
| Campaign | CPA vs target, delivered-order CPA | Frequency, CPM trend | Reach, likes |
| Ad | CPA, spend share | Thumb-stop rate (3s views ÷ impressions), hold rate, CTR (link), CVR | Engagement rate on its own |

Cadence: Monday review and decisions, mid-week launches, Friday scale or rollback, monthly target CPA and creative library review.

## Market Notes (MENA, COD, Messaging)

- **COD markets:** platform purchases overstate revenue. Send a confirmed or delivered-order event through Conversions API when the store can; otherwise apply the refusal rate to every CPA before judging.
- **Messaging-first buyers:** many Egyptian and Gulf shoppers prefer WhatsApp. Test a click-to-WhatsApp destination against the site; measure closed sales, not conversations.
- **Ramadan and Eid:** CPMs and competition move; evening and post-iftar hours behave differently. Prepare seasonal concepts and dayparting before the month starts, and judge Ramadan weeks against Ramadan baselines.
- **Language:** match dialect to the audience (Egyptian Arabic for mass Egypt, Gulf Arabic or MSA for GCC, English for some premium segments). Test dialect as a variable when unsure.
- **White Friday / 11.11:** discount-led traffic attracts the discount-only anti-ICP; check post-season repeat rate before calling it a win.

## Strategy Output Template

```markdown
# Meta Strategy: [Brand], [Date]

## Decision
[Objective, optimization event, structure, monthly budget, target CPA/ROAS, in 3 lines]

## Economics
Break-even CPA [x] · Target CPA [x] · Break-even ROAS [x] · Target ROAS [x]

## Structure
[Diagram]

## Budget
| Campaign | Share | Daily | Learning bar met? |

## Audiences
Prospecting: [broad + suggestions] · Exclusions: [stack] · Retargeting: [pools or "folded into creative"]

## Creative Portfolio
[Mix table] · Concepts per week: [n]

## Test Roadmap (weeks 1 to 4)
[Table]

## Rules
[Kill/keep/scale thresholds in currency, computed from target CPA]

## Open Questions
[MISSING items and their assumptions]
```

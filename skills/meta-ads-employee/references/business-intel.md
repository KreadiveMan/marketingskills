# Business Intel: Stage 1 and Stage 2 Method

How to learn the business (Stage 1) and turn it into audience intelligence (Stage 2). Read the site, `.agents/product-marketing.md`, store or CRM exports, reviews, and the ad account before asking anything. Ask only for what those sources can't answer, in one batch.

## Contents

- Stage 1 intake questions
- Unit economics and break-even math
- Worked examples (eCommerce, F&B delivery, B2B lead gen)
- ICP method
- DMU method (B2C and B2B)
- Anti-ICP method
- Trigger events
- Intent signals
- Evidence tagging and confidence

## Stage 1 Intake Questions

Group the questions so the user can answer in one pass. Skip any the sources already answered.

**Business and offer**
- What do you sell, to whom, in which markets and languages?
- Which 1 to 3 products or services should ads push first, and why (margin, stock, hero status)?
- Price points, AOV, bundles, subscriptions, current promotions
- How do people buy: website checkout, COD, WhatsApp or Messenger, app, marketplace, store visit, sales call?

**Economics**
- Gross margin or COGS per hero product
- Shipping cost per order, payment or COD fee, platform fees
- Return, cancellation, or COD refusal rate
- Repeat purchase rate and the window (30, 90, 365 days)

**Current state**
- Monthly ad spend by platform, best and current CPA or ROAS, and the period
- Tracking: Pixel installed, Conversions API live, which events, event match quality
- Past winners and losers (ads, offers, audiences) and what the user thinks explains them

**Constraints**
- Monthly budget ceiling and how fast it can scale
- Stock limits, delivery zones, capacity (kitchen, team, inventory)
- Regulated category (health, supplements, finance, alcohol, weight loss), brand rules, approval chain

## Unit Economics and Break-even Math

```
Contribution per order  = AOV − COGS − shipping − payment/COD fees − (return rate × cost per return)
Break-even CPA          = contribution per order
Break-even ROAS         = AOV ÷ contribution per order
Target CPA              = break-even CPA × (1 − share of contribution you want to keep)
Target ROAS             = AOV ÷ target CPA
LTV-adjusted max CPA    = contribution per order × expected orders in the LTV window (use only with real repeat data)
MER                     = total revenue ÷ total marketing spend (the account-wide sanity check)
```

Rules:
- Use **delivered** orders, not placed orders, when COD refusals or cancellations exist. A 25% refusal rate means every placed-order CPA is really 1.33× higher.
- State which revenue Meta reports (it counts placed purchases at the Pixel value). Platform ROAS above break-even can still lose money after refusals and returns.
- First-order break-even is the default. Use LTV-adjusted targets only when repeat data exists and cash flow can carry the payback period.

## Worked Examples

**1. Fashion eCommerce, COD-heavy**
AOV 1,200, COGS 480, shipping 70, COD fee 20, return rate 15% at cost 120 per return.
Contribution = 1,200 − 480 − 70 − 20 − (0.15 × 120) = 612.
Break-even CPA = 612. Break-even ROAS = 1,200 ÷ 612 = 1.96.
With 20% COD refusal: effective break-even CPA on placed orders = 612 × 0.80 = 490; placed-order break-even ROAS = 2.45.
Keep 40% of contribution: target CPA (placed) ≈ 294, target ROAS ≈ 4.1.

**2. F&B delivery brand**
AOV 350, food cost 30% (105), packaging 15, delivery subsidy 25, aggregator or payment fee 5% (17.5).
Contribution = 350 − 105 − 15 − 25 − 17.5 = 187.5. Break-even ROAS = 1.87.
Repeat rate 35% within 60 days at the same AOV → LTV-adjusted max CPA ≈ 187.5 × 1.35 = 253 (only if cash flow allows waiting for the repeat).

**3. B2B lead generation (service)**
Deal value 40,000, gross margin 50% → 20,000 contribution. Lead → qualified 40%, qualified → won 15%.
Max cost per won deal = 20,000 × share you're willing to spend (say 25%) = 5,000.
Max cost per qualified lead = 5,000 × 0.15 = 750. Max CPL = 750 × 0.40 = 300.

## ICP Method

An ICP segment is a **situation**, not a demographic. "Women 25 to 34 in Cairo" targets nobody in creative; "new mothers back at work who need dinner on the table in 20 minutes" writes the ad.

For each segment fill:

| Field | Question it answers |
|-------|--------------------|
| Situation | What is going on in their life or business right now? |
| Job to be done | What are they trying to get done when they buy? |
| Pains | What's costing them time, money, status, or comfort today? |
| Desired outcome | What does "solved" look like in their words? |
| Current alternative | What do they do instead (competitor, DIY, nothing)? |
| Objections | What stops them buying (price, trust, delivery, quality, fit)? |
| Buying language | Exact phrases from reviews, comments, DMs, calls |
| Awareness level | Unaware, problem-aware, solution-aware, product-aware, most aware |
| Value | AOV, repeat likelihood, margin of what they buy |
| Reachability | Can creative on Meta identify and speak to them? |
| Evidence tag | `[EVIDENCE]`, `[OPERATOR]`, or `[HYPOTHESIS]` |

Rank segments by **value × reachability × evidence strength**. Start with 1 to 3 segments; more dilutes the creative budget.

Sources, best first: order and CRM data (who buys most, repeats, returns least) → reviews and support tickets → DMs and comments on the brand's own posts → competitor reviews and comments → Reddit, forums, and community groups → the founder's intuition (tag it `[OPERATOR]`).

## DMU Method

The DMU (decision-making unit) is everyone who shapes the purchase. Ads usually reach one person; the copy must still arm that person for the others.

| Role | B2C example (family food order) | B2B example (agency hire) | What the ad must give them |
|------|--------------------------------|---------------------------|---------------------------|
| Initiator | Kid asking for pizza | Marketing coordinator who hits the problem | A reason to raise it |
| Influencer | Friend's story post, reviews | Peer recommendation, case study | Proof to forward |
| Decider | Parent choosing the restaurant | Head of marketing | The outcome and the risk removed |
| Payer / approver | Spouse watching the budget | CFO or owner | Price logic, value, guarantee |
| User | Whole family | The team who works with you | Ease, experience, quality |
| Gatekeeper / blocker | Diet rules, delivery zone | Procurement, IT, legal | Answers to the blocking question |

For each role: what they care about, their objection, the asset that answers it (ad angle, landing section, FAQ, testimonial), and whether Meta can reach them directly. In B2C, the most useful DMU insight is usually the **approver objection** ("is it worth it?") and the **user benefit** that the buyer gets credit for.

## Anti-ICP Method

Anti-ICP segments are people who click, buy, or sign up and still lose the business money. Find them in the data, not in imagination.

| Anti-ICP pattern | How to detect | Meta countermeasure |
|-----------------|---------------|---------------------|
| COD refusers / fake orders | Refusal rate by area, by time of day, by first-time buyers | Exclude worst delivery zones; prepaid incentive in copy; confirm via WhatsApp; optimize on a confirmed-order event via CAPI |
| Serial returners | Return rate by customer, product, size | Exclude customer list of high returners; size guidance in creative |
| Discount-only hunters | Buy only at 40%+ off, never at full price | Lead with value not discount; exclude coupon-site traffic; cap promo frequency |
| Out-of-zone demand | Orders or leads outside delivery or service area | Geo exclusion; state the service area in the first line |
| Wrong-fit B2B leads | Too small, wrong industry, students, job seekers | Disqualifying copy ("for teams of 20+"), Higher Intent lead form, required work email, a qualifying question |
| Low-value one-timers | Single small order, no repeat | Judge by LTV per acquisition cohort; shift budget to concepts that attract repeaters |
| Existing customers in prospecting | Recent buyers seeing acquisition ads | Exclude purchasers (e.g. last 30 to 180 days) from prospecting; send them retention offers instead |

Every anti-ICP row needs a **signal** you can observe and a **countermeasure** you can execute. A row with neither is a worry, not intel.

## Trigger Events

A trigger event opens a buying window. Ads that name the trigger ("moving into your first apartment?") outperform ads that describe the product, because the viewer self-selects.

| Type | Examples (retail, F&B, B2B) | Timing | Meta lever |
|------|---------------------------|--------|-----------|
| Calendar | Ramadan, Eid, back to school, White Friday, Valentine's, summer, payday | Known dates; launch creative 1 to 3 weeks early | Seasonal concepts, scheduled campaigns, budget ramps |
| Life event | Wedding, new baby, new job, moving, graduation | Unpredictable per person | Creative that names the event (Meta life-event targeting is limited; let creative self-select) |
| Situational | Heatwave, match night, exam season, rainy weekend | Hours to days | Dayparting, fast-turn statics, weather or event-linked angles |
| Problem moment | Broken item, failed diet, bad previous supplier, empty fridge at 11pm | Recurring | Problem-aware hooks, time-of-day schedules |
| Business (B2B) | Funding round, new hire in role, expansion, new regulation, missed target | Detected from news, LinkedIn, job posts | Creative naming the trigger; custom lists from prospecting tools |
| Brand-side | Launch, restock, new branch, menu change | Brand controls | Announcement concepts, retargeting past engagers |

For each trigger: why it opens a window, how long the window lasts, the angle, the concept it seeds in Stage 4, and the date or condition that starts the campaign.

## Intent Signals

Intent signals are behaviour that shows readiness. On Meta they become **custom audiences** (to retarget or exclude) and **seed audiences** (for lookalikes or Advantage+ suggestions).

Rank by intent strength, high to low:

1. Checkout started, added payment info, abandoned cart
2. Added to cart, viewed multiple products, viewed price or menu page
3. Messaged the Page or WhatsApp, opened a lead form without submitting
4. Watched 50 to 95% of a video, saved or shared a post
5. Visited the site, engaged with the Page or Instagram profile
6. List membership: newsletter, loyalty, past purchasers (for exclusion or upsell)

For each signal record: definition, source (Pixel event, engagement, customer list), window, approximate size if the account shows it, the stage it feeds (retarget, exclude, seed), and the message it gets. Audience definitions and windows: [audience-to-meta-map.md](audience-to-meta-map.md).

## Evidence Tagging and Confidence

- `[EVIDENCE]` comes from data you saw: orders, CRM, reviews, comments, account results. Cite the source.
- `[OPERATOR]` comes from the user. Record who said it.
- `[HYPOTHESIS]` is your inference. It may shape a test cell, never a factual claim in copy.

End Stage 2 with a confidence line per segment (high, medium, low) and the one piece of data that would raise it most.

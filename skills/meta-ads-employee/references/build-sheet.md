# Build Sheet: Stage 5

The build sheet is the single source of truth for launch. Stage 6 executes it line by line, so every field here must be filled, counted, and checked. Nothing in the account should exist that isn't in this sheet.

## Contents

- Ad copy rules
- Copy block format
- Policy and claims check
- Naming convention
- UTM convention
- Campaign and ad set spec
- Launch payload schema

## Ad Copy Rules

| Field | Aim | Notes |
|-------|-----|-------|
| Primary text | Hook in the first ~125 characters | Shows above the media; truncated after about 125 characters in feed. Longer text is fine below the fold when it carries proof or objection handling |
| Headline | ~40 characters | Below the media; truncated after about 40. Not shown in every placement |
| Description | ~30 characters | Often hidden (Facebook mobile feed, Instagram); never put essential info here |
| CTA button | Matches intent | Shop Now / Order Now for purchase, Send WhatsApp Message for chat sellers, Learn More for consideration, Sign Up / Get Quote for leads |

Dated field limits for every placement: ad-creative's [platform-specs.md](../../ad-creative/references/platform-specs.md).

Writing rules:
- First line names the segment's situation or trigger from Stage 2, in their words.
- One idea per ad. The concept decides the idea; the copy doesn't add a second one.
- Use only facts from Stages 1 and 2: real prices, real offers, real review quotes, real numbers. Anything else is left out.
- Write in the market's language and dialect. Arabic copy: natural dialect for the segment, no machine-translated phrasing, Arabic or Western numerals used consistently.
- Variants change one thing (hook line, proof, CTA) so the result is readable. Up to five primary texts and five headlines per ad when the objective allows multiple text options.
- No AI tells, filler intensifiers, or "it's not X, it's Y" constructions. See the **copywriting** skill's AI-tells list.

## Copy Block Format

```markdown
### Ad C1-V1: [concept] / [variant label]

**Primary text 1:** ...
**Primary text 2 (variant: hook):** ...
**Headline 1:** ... (chars: n)
**Headline 2:** ... (chars: n)
**Description:** ... (optional)
**CTA:** SHOP_NOW
**Destination:** https://... (+ UTMs below)
**Facts used:** [price from Stage 1 · review #12 quote · free delivery policy]
**Policy check:** pass / fix: [what]
```

## Policy and Claims Check

Fail and fix before the sheet is approved:

- **Personal attributes:** no "you" + health, finances, religion, ethnicity, sexual orientation, age assertions. Rewrite to the situation ("for busy weeknights") not the person ("are you too tired to cook?").
- **Unsupported claims:** "best", "#1", "clinically proven", "guaranteed results", income or weight claims need proof the user holds. Without it, cut them.
- **Before/after:** restricted for health, weight, and cosmetic categories.
- **Price and offer:** match the landing page exactly, including currency, end date, and conditions.
- **Urgency:** only real deadlines and real stock limits.
- **Prohibited or restricted products:** alcohol, supplements, financial products, and others need category rules and sometimes authorization.
- **AI-generated media:** list it so the user can decide on disclosure; disclosure is the advertiser's call.

## Naming Convention

Names should be readable in Ads Manager and sortable in reports. Default (change if the account already has one):

```
Campaign:  [Brand]_[Market]_[Objective]_[Role]_[YYMM]
           NOVA_EG_SALES_TEST_2611
Ad set:    [Audience]_[Optimization]_[Placement]_[Note]
           BROAD-A+_PURCHASE_ADV+PLC_exclBuyers180
Ad:        [ConceptID]-[Variant]_[Format]_[Angle]_[Segment/Trigger]
           C01-V1_STATIC_TimeBack_WorkingMoms
```

Use the concept ID from Stage 4 in every ad name so performance maps back to the concept matrix.

## UTM Convention

```
utm_source=meta&utm_medium=paid_social&utm_campaign={{campaign.name}}&utm_content={{ad.name}}&utm_term={{adset.name}}
```

Set URL parameters when the creative is created; some setups can't add them afterwards.

## Campaign and Ad Set Spec

Fill one block per campaign and per ad set:

```markdown
## Campaign: [name]
- Objective: OUTCOME_SALES | OUTCOME_LEADS | OUTCOME_ENGAGEMENT | OUTCOME_TRAFFIC | OUTCOME_AWARENESS
- Special ad category: none | [category] + countries
- Budget: CBO, daily [amount in account currency], or lifetime [amount] + end date
- Bid strategy: highest volume (default) | cost cap [x] | ROAS goal [x]
- Start: [date/time, account timezone]

## Ad set: [name]
- Optimization goal: purchase / value / lead / conversations / ...
- Conversion event and dataset: [Pixel or dataset ID, event]
- Destination: website | WhatsApp | Messenger | Instagram Direct | instant form
- Location: [countries / regions / cities]; exclusions: [areas]
- Age floor: [only if legally required]; age/gender suggestions: [if any]
- Advantage+ audience: on (default) | off + reason (strict list, legal age limit, retargeting only)
- Suggestions: [customer list, verified interest IDs only]
- Excluded custom audiences: [names and IDs]
- Placements: Advantage+ (default) | manual: [list] + reason
- Schedule / dayparting: always on | [windows] (needs lifetime budget)
- Attribution: default (7-day click, 1-day view) | [override + reason]
- Ads: [list of ad IDs from the copy blocks]
```

Defaults and why:
- **CBO** with the stated budget at campaign level, unless the user asks for per-ad-set budgets.
- **Highest volume** bidding to start; add cost cap or ROAS goal once there's enough data to know the right number.
- **Advantage+ audience on**, location as the hard control, exclusions applied.
- **Advantage+ placements**, with 9:16 and 4:5 assets supplied so every placement gets a native fit.
- Never invent interest IDs; use only IDs verified from the targeting search or provided by the user.
- Budgets: use the cadence the user stated (daily or lifetime). A monthly figure is neither; convert only with the user's confirmation.

## Launch Payload Schema

The final section of the build sheet is a structured list Stage 6 executes in order. Keep it in the workspace as a code block or `05-payload.json`:

```json
{
  "ad_account_id": "",
  "currency": "",
  "timezone": "",
  "page_id": "",
  "instagram_user_id": "",
  "dataset_id": "",
  "approved_budget_ceiling": { "daily": 0, "lifetime": 0 },
  "campaigns": [
    {
      "key": "CMP_TEST",
      "name": "",
      "objective": "OUTCOME_SALES",
      "special_ad_categories": [],
      "budget": { "type": "daily", "amount_minor_units": 0 },
      "bid_strategy": "LOWEST_COST_WITHOUT_CAP",
      "ad_sets": [
        {
          "key": "AS_BROAD",
          "name": "",
          "optimization_goal": "OFFSITE_CONVERSIONS",
          "promoted_object": { "pixel_id": "", "custom_event_type": "PURCHASE" },
          "destination_type": "WEBSITE",
          "targeting": {
            "geo_locations": { "countries": [] },
            "excluded_custom_audiences": []
          },
          "ads": [
            {
              "key": "C01-V1",
              "name": "",
              "creative": {
                "format": "single_image | single_video | placement_customized | carousel",
                "assets": { "4x5": "", "9x16": "", "1x1": "" },
                "primary_texts": [],
                "headlines": [],
                "descriptions": [],
                "call_to_action": "SHOP_NOW",
                "link_url": "",
                "url_tags": "",
                "ai_generated_media": false
              }
            }
          ]
        }
      ]
    }
  ]
}
```

Amounts go in the ad account currency's smallest unit when the API needs it (for example piastres or cents). State both the human amount and the minor-unit amount in the sheet so the approval is unambiguous.

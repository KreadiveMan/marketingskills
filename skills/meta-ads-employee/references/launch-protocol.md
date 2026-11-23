# Launch Protocol: Stage 6

How to stage the approved build sheet in the ad account safely. The rule is simple: **create everything paused, show it, activate only what the user approves.** Writes to an ad account spend real money and some can't be undone.

This protocol is tool-agnostic. It applies to Meta's official ads MCP connector (see [meta-ads integration guide](../../../tools/integrations/meta-ads.md)), the Marketing API, or a manual upload. Follow the connected tool's own descriptions where they're stricter than this file.

## Contents

- Preconditions
- Pre-flight checklist
- Creation order
- Draft mode vs paused objects
- Preview and approval
- Activation
- Verification
- Idempotency and failures
- Rollback
- Launch log template
- No connection: manual upload

## Preconditions

Stop and report if any is missing:

- Build sheet approved at Gate 5, with the approver and date recorded
- Ad account, Page, Instagram account, and Pixel/dataset identified and confirmed by the user
- Currency and timezone read from the account, and budgets converted to its minor units
- Approved budget ceiling (daily and total) stated in writing
- Final assets exported in the specified sizes, file names matching concept IDs

## Pre-flight Checklist

| Check | How | Fail action |
|-------|-----|-------------|
| Tracking fires | Dataset shows recent events for the optimization event; event match quality acceptable | Fix with **conversion-tracking** first; or optimize an event that does fire |
| Landing page works | Open each destination on a phone, ideally inside Instagram's in-app browser | Fix the page or change the destination |
| Message match | Offer, price, and claim on page match the ad | Edit the ad or the page |
| Stock / capacity | Hero products in stock; kitchen or team can handle the volume | Reduce budget or swap products |
| Policy | Stage 5 policy check passed | Fix copy |
| Budget | Sum of campaign budgets ≤ approved ceiling | Reduce or get new approval |
| Special ad category | Declared if applicable | Declare before creating ad sets |
| Lead ads | Page accepted Lead Ads terms; form tested | Accept terms, test form |
| Messaging | WhatsApp number connected to the Page; greeting set | Connect before launch |

## Creation Order

1. **Read the account:** existing campaigns (to avoid duplicates and naming clashes), audiences, images, and videos already uploaded.
2. **Custom audiences** needed for exclusions or retargeting (if missing). Audiences need time to populate; create them first.
3. **Campaign(s)** with objective, special ad category, budget (CBO), and bid strategy. Paused.
4. **Ad sets** with optimization goal, promoted object, destination, targeting, exclusions, placements, schedule. Paused.
5. **Media upload:** images and videos; wait until videos finish processing.
6. **Creatives** with copy variants, CTA, link, URL parameters, Instagram identity, and AI-media disclosure decided by the user.
7. **Ads** linking each creative to its ad set. Paused.

After each create, read the object back and compare its fields to the build sheet. Log the ID immediately.

## Draft Mode vs Paused Objects

Connected tools stage new objects in one of two ways:

- **Paused live objects:** the campaign, ad sets, and ads exist in the account with status PAUSED. Activation turns each on individually, top-down (campaign, then ad sets, then ads).
- **Ads Manager draft:** objects are staged in the account's draft and don't exist until published. Publishing can make them go live ACTIVE in one step, so treat **publish** exactly like **activate**: it needs the same explicit approval.

Read the tool's response to know which mode applied, and tell the user which one it was. Fix any validation errors the tool reports before asking for approval.

## Preview and Approval

Show the user, in one message:

- The structure as created (campaign → ad sets → ads) with names, IDs, and status
- Budget per campaign in the account currency, and the total against the approved ceiling
- Targeting summary per ad set (location, exclusions, Advantage+ audience on/off and why)
- Preview links or screenshots for each ad in feed and Stories/Reels
- Anything that differs from the build sheet, and why
- Validation warnings from the platform

Then ask a specific question: "Activate campaign X with ad sets A and B and ads 1 to 6 at [budget]/day starting [time]?" A vague "looks good" approves the plan, not the spend; confirm the activation explicitly.

## Activation

- Activate only the objects named in the approval.
- Live paused objects: activate campaign, then ad sets, then ads. A child is only delivering when its parents are active.
- Draft: publish exactly the approved objects; if the tool offers to publish a subset, get approval for the subset.
- Record approver, time, objects, and budgets in the launch log.

## Verification

- **Immediately:** read back every object: status, effective status, budget, schedule. Note anything pending review.
- **Within 24 hours:** ad review results (approved, rejected, limited), delivery started, events arriving in the dataset, no spend anomalies.
- **Day 3:** first sanity check of CPM, CTR, and tracked events against expectations. No optimization decisions yet.

Report verified facts only. "Publishing" or "pending" is not "live"; say which it is.

## Idempotency and Failures

- Check for an existing object with the same name before creating; never create duplicates on retry.
- If a create call returns an error or an unknown outcome, read the account to see whether the object exists before retrying.
- Never retry a live mutation blindly. Fix the cause the error names, then retry once.
- If something fails halfway, stop, report what exists (with IDs) and what doesn't, and ask before continuing.

## Rollback

| Situation | Action |
|-----------|--------|
| Wrong setting found before activation | Edit or delete the paused object |
| Wrong setting after activation | Pause the object, fix, get re-approval, re-activate. Avoid editing a running ad's creative (resets learning); launch a corrected ad instead |
| Spend running away | Pause the campaign first, then investigate |
| Ad rejected | Read the rejection reason, fix the copy or asset, request review or create a new ad |
| Tracking broken after launch | Pause or lower budget until events arrive; decisions on broken data are worthless |

Deleting and archiving can't be undone; prefer pausing.

## Launch Log Template

```markdown
# Launch Log: [Brand], [Date]

## Approval
Build sheet version: [date] · Approved by: [name/role] · Activation approved: [time] · Ceiling: [amount]

## Created objects
| Level | Name | ID | Status | Budget | Matches sheet? |
|-------|------|----|--------|--------|----------------|

## Previews
[links or screenshots per ad]

## Deviations from sheet
[what and why]

## Verification
- T+0: [status read-back]
- T+24h: [review, delivery, events]

## Rollback steps
[pause order and contacts]

## First review scheduled
[date]
```

## No Connection: Manual Upload

If no Meta ads tool is connected, or the user prefers to upload themselves:

- Deliver the build sheet as an Ads Manager walkthrough in creation order, with every field value.
- Provide copy as paste-ready blocks and assets named by ad.
- Optionally provide a bulk-import spreadsheet matching the build sheet columns; tell the user to check it against Ads Manager's current import template.
- Ask the user to paste back the created IDs so the launch log and later reviews stay connected.

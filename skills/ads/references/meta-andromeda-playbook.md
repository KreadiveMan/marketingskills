# Modern Meta Playbook (Andromeda Era)

**What Andromeda is, from Meta's own post** ([Meta Engineering, 2024-12-02](https://engineering.fb.com/2024/12/02/production-engineering/meta-andromeda-advantage-automation-next-gen-personalized-ads-retrieval-engine/)):

- It is the **retrieval** stage, the first step of a multi-stage system: it narrows tens of millions of eligible ads to a few thousand candidates. Larger **ranking** models then predict value and pick the final set, and the auction picks the winner. Retrieval decides which ads get considered; ranking (GEM, see "Ad sequencing" below) decides which one shows.
- It organizes **ads** into a hierarchical index so it can scale to the growth in ad creatives that generative AI tools cause. The post describes indexing ads, not users.
- On diversity, it says only this: increased ad diversity can improve people's experience with ads and drive better advertiser outcomes. The reported gains are +6% retrieval recall and +8% ads quality on selected segments. Treat both as vendor-reported.
- It does **not** give a creative quota, a minimum number of ads, a similarity threshold, or a cold-start rule for new ads. Anything here that goes beyond the post is labeled practitioner observation or hypothesis.

The old playbook (interest stacking, polished video creative, single-winner scaling) underperforms. The new playbook:

## Creative diversity, not creative volume

Andromeda can retrieve more ads, so more ads *can* be considered. That doesn't make ad count the strategy. Thirty variants of one angle are one reason to buy with thirty skins. Diversity means each ad gives a **different reason to care**:

| Angle | What the ad does |
|---|---|
| Problem | Opens on the pain the buyer has now |
| Outcome | Shows the result they want |
| Belief shift | Corrects a wrong belief that stops them |
| Proof | Social proof, demo, or a customer's experience |
| Objection | Answers the reason they haven't bought |

- **Start from the customer, not the variant count.** List their problems, desired outcomes, wrong beliefs, and objections first, then build one concept per item. The **ad-creative** skill's angle-matrix turns reviews and comments into these angles.
- **A concept is a distinct message, not a distinct file.** Changing only the hook, headline, or visual on the same argument is a variant. Variants are useful for localizing a proven concept, but they don't add diversity (see "AI variant farming" below).
- **Statics are still the cheapest way to test concepts.** They're roughly 10x cheaper and faster to make than video, so use them to test *new angles* quickly. Practitioners also report statics often beating long-produced VSLs in 2026. That's an observation, not a Meta rule.
- **Refresh with new angles on a cadence.** For example, an hour a week on the winning offer. A new angle earns a slot; a reskin of the current winner usually doesn't.

## New ads, fake winners, and incrementality

Each new ad starts with no history, so delivery has to learn who responds to it. Two consequences are worth planning for. Both are **hypotheses** from practitioner experience; Meta doesn't document them.

- **Early results can be flattering.** Many practitioners see new ads start strong and then fade as spend scales or time passes. One likely reason is that early delivery leans on warm and hot audiences (site visitors, engagers, past buyers), who convert more easily. Test it: exclude warm and hot audiences, or break results out by new versus existing customers. If the ad is weak from day one without them, it was riding warm demand.
- **New ads can take credit instead of creating sales.** When many new ads launch on the same structure, they compete for the same pool your stable ads were already reaching. The report then shows the old ad "fatiguing" and the new ad "winning", but the business may have the same total sales with the attribution moved. That is a **fake winner**.
- **The loop it creates:** launch more ads → find "winners" → old ads look tired → new ads scale to colder audiences → results drop → launch more ads. If total sales and blended MER aren't rising with ad count, check this before producing more.

How to tell a real winner from a fake one:

- Judge on **business totals**, not ad-level ROAS: total revenue, new-customer revenue, blended MER, and margin after ad spend. A real winner moves these. A fake winner only reshuffles in-platform attribution.
- Compare **before and after a launch wave** at account level, with the same budget and a comparable window. A winner that lifted nothing at account level redistributed credit.
- For decisions that matter, run a **holdout or conversion lift test** (the **attribution** skill covers incrementality methods). Use the **ad-creative** skill's test readout to check whether an ad-level gap is real at all.
- Don't kill a stable ad only because a new ad's reported results rose in the same week. Check whether combined results actually grew.

## Creative IS the targeting (broad audience + specific creative)
- The old playbook: stack interests, narrow the audience, hope to find the right buyer
- The new playbook: target broadly (just the country) and let the creative do the targeting
- **Long-form ad copy works better than short-form** in 2026 — gives Meta a wider context window to understand who to show the ad to
- Test it: take your best winning ad with interest-stacked targeting, duplicate it, remove all targeting (just pick the country), run side-by-side for 7 days. Check CPAs. Broad typically wins.

## The one-keyword hack (identity-trigger keywords)
- Take your winning ad
- Duplicate it with a niche/identity keyword inserted in the headline or body copy
- *"Here's how to get 462 leads per week on autopilot"* → *"Here's how to get 462 **dental** leads per week on autopilot"* / *"...**lawyer** leads..."* / *"...**property investment** leads..."*
- The keyword is an **identity trigger** for the viewer AND a targeting signal for Andromeda
- Dramatically drops CPL and opens audience pockets you couldn't reach with a generic ad

## AI variant farming (the 100-people test)
- Take your winning ad
- Feed to Claude/ChatGPT/Kong with the prompt:
  > *"I want you to read this ad and be the author. If I show the next ad I'm going to ask you to write to 100 people, not 1 in 100 would be able to tell you it's written by a different person. Now write this for [demographic/niche]."*
- The output should read essentially the same with subtle relevance shifts for the target
- Apply in sequence: body copy → headlines → creative
- Drop all variants in a CBO, let Meta's AI allocate spend
- **Limit:** variants this close count as one concept. Use them to localize a proven winner. New reach comes from new angles (see "Creative diversity, not creative volume" above), not from more variants.

## Zombie campaigns
- After running a CBO, Meta will give 80% of variants no spend
- Take the dead variants you have **high conviction** about
- Launch them in a separate ad set ("zombie campaign")
- Typically resurrects 20% as winners that Meta's first allocation passed over

## Don't make ads look like ads
- Hundreds of millions of people have ad blockers — the polished-ad aesthetic kills performance
- Study what content **natively performs** in your niche on TikTok/Instagram/YouTube → produce ads that match that aesthetic
- **Burner account technique:** create a clean Instagram/TikTok account, follow all influencers and pages in your niche, like their content. Your feed becomes a curated view of what's natively winning. Produce ads that match.
- If you have an organic video with millions of views, **run that exact video as a paid ad** — proven content + paid distribution = the highest-leverage move

## Creator ads at volume
Wispr Flow went from about 100 to over 3,500 ads in its Meta account in nine months (October 2026, their head of performance marketing). The lessons that carry over to any creator-led program:

- **Meta groups ads it judges too similar** (practitioners put the line at roughly 60% similarity) and limits their delivery. A hundred creators making the same talking-head video amount to one concept, and copies of a winner pull reach from the winner too.
- **Plan on three axes.** Every ad argues one **concept** (a single product truth, which is 90% of ads), through one **angle** (saves time at work, works with the tools I already use), to one **awareness level** (new to the category, or a power user looking for something better). The matrix shows which feature, said which way, to which audience, is winning. Without it you pay Meta and your creators for lessons you can't read back out.
- **Optimize for a quality event.** For PLG products, find the action that predicts a retained user (Wispr Flow uses words dictated past a habit threshold), send it to Meta, and judge ads on it. Downloads and signups alone reward ads that bring people who never come back. If that event is too rare to optimize on, optimize up-funnel and judge on it anyway (see [meta-decision-system.md](meta-decision-system.md) for the 50-conversions-a-week bar).
- **Test the funnel inside Instagram's in-app browser before spending a dollar.** Swipe up from a real ad preview on a phone: the page loads, the promise matches what the creator said, and every event and parameter lands in your analytics. Safari on desktop doesn't count.
- **Read the funnel stage by stage.** Strong hook and hold rates but no clicks: the ad earned attention but not the swipe. Clicks but no conversions: the landing page breaks the creator's promise. Conversions from low-quality customers: look at targeting and campaign structure, and try cost caps.
- **Give each ad about five days before judging it.** A Friday launch meets a different audience than a Monday one. A testing winner can also die when it graduates to a scaling budget an order of magnitude larger; graduate in steps you can afford and watch each one.
- **Keep a lessons file that feeds the briefs.** Wispr Flow keeps a marketing repo that collects what each test taught (in ads, landing pages, newsletters, and creator partnerships) and drafts the next round of creator briefs from it. **marketing-loops** has the monthly-creative-retro loop for this.

For recruiting, paying, and briefing the creators themselves, see the performance-paid creator program in the **influencer-marketing** skill.

## Ad sequencing (build the path, not one winner)

Meta's ranking model reads a person's activity as an ordered timeline: ad clicks, conversions, and organic engagement, each in sequence (Meta Engineering's posts on its GEM ads model, November 2025 and October 2026). The practical read: the second ad someone sees is judged against the first. Stop testing every ad in a vacuum and ask what ad 2 says to someone who already saw ad 1.

**Explicit sequencing in auction campaigns** rolled out in early 2026, account by account. The setup is narrow, so check Meta's current help docs before planning around it:

- Objective: Awareness (Maximize reach) or Engagement (ThruPlay). Not available on Sales or Leads.
- Frequency control set to **Target frequency**, not the default cap.
- **Lifetime budget** at the ad set level, at least 7 days, with Advantage campaign budget off.
- At least two ads published in the ad set.

**Size the sequence to the flight.** Campaign length and the frequency window cap how many ads fit: a 3-week flight showing one ad every 7 days fits three. Two or three ads is the usual range; longer paths lose people along the way.

**A typical path:** hook → problem → proof (testimonial or case study) → offer. Each ad assumes the previous one was seen, so ad 3 doesn't re-explain the product.

**The trade-off:** target frequency usually costs more per impression than standard delivery, so judge a sequence on downstream conversions (ideally against a holdout), not CPM. For conversion objectives, where sequencing isn't available, approximate the path with engagement retargeting: video viewers or engagers from the hook ad get the proof ad, then the offer.

*Sequencing framing from Cody Schneider (October 2026); setup requirements from Jon Loomer's testing and Meta's documentation as of early 2026.*

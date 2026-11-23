# Creative Production: Stage 4

Turns Audience Intel and Strategy into briefs a designer, editor, creator, or generation tool can execute without guessing. Depth lives in the **ad-creative** skill; this file sets the order of work and the brief formats.

- Static templates and visual styles: [static-ad-templates.md](../../ad-creative/references/static-ad-templates.md)
- Format priority on Meta (which formats open cold audiences): [meta-creative-formats.md](../../ad-creative/references/meta-creative-formats.md)
- Hook system (visual + spoken + caption): [hook-system.md](../../ad-creative/references/hook-system.md)
- Faceless motion styles and pipeline: [motion-video-ads.md](../../ad-creative/references/motion-video-ads.md)
- Generation tools and prompting: [generative-tools.md](../../ad-creative/references/generative-tools.md), plus the **image** and **video** skills

## Contents

- Concept matrix
- Choosing the format
- Static design brief
- Motion brief
- Specs and safe zones
- Production routing
- Quality and policy check
- Batch index

## Concept Matrix

One concept = one **product truth** × one **angle** × one **awareness level** × one **segment or trigger** from Stage 2. Build the matrix before writing a single headline:

| # | Segment / trigger | DMU role | Awareness | Product truth | Angle | Grounded in | Format | Funnel role |
|---|------------------|----------|-----------|---------------|-------|-------------|--------|-------------|
| C1 | Working moms, weekday dinner | Decider | Problem-aware | Ready in 15 min | Time back | Review #12 "saved my weeknights" | Static: Problem/Solution | Cold |
| C2 | Ramadan iftar | Payer | Solution-aware | Feeds 6 for X | Value vs ordering out | Order data: family bundle = 40% of Ramadan sales | Motion: offer reveal | Cold / seasonal |
| C3 | ATC 14d | Approver | Product-aware | Free returns 14 days | Risk removed | Policy page | Static: Simple Guarantee | Retarget |

Rules:
- Cover each top ICP segment and the strongest triggers before adding a second concept for any one of them.
- Include at least one concept per DMU role that blocks purchases (usually the approver or payer).
- Include anti-ICP filtering where it matters (service area, minimum order, "for teams of 20+").
- Every concept cites what it's grounded in. A concept grounded in `[HYPOTHESIS]` is labeled as a test.

## Choosing the Format

| Concept needs | Format |
|---------------|--------|
| One clear claim, offer, or comparison | Static |
| Several products or a bundle | Grid static or carousel |
| A product reveal, process, or transformation | Motion graphics (5 to 15s) |
| Explaining an idea with no product footage | Faceless motion (poster style) |
| Trust, taste, texture, objection handling | UGC, creator, or founder video |
| Food appetite appeal | Close-up motion: steam, pour, pull, crunch; real food footage beats generated |
| Big catalog | Catalog ads with a branded frame |

Validate new concepts as statics first unless the concept is inherently video (demo, testimonial, taste).

## Static Design Brief

```markdown
## C[n]: [Concept name], Static, [Template]

**Segment / trigger:** [from matrix]   **Awareness:** [level]   **Funnel role:** [cold / retarget]
**Grounded in:** [source quote or data point]

**On-image headline:** [max ~8 words; must not caption the picture]
**Supporting line (optional):** [max ~12 words]
**Visual:** [subject, setting, composition, product placement, what the eye hits first]
**Brand tokens:** [colors, fonts, logo placement, from brand profile]
**Template / style:** [e.g. Problem/Solution in Whiteboard style]
**Sizes:** 4:5 (1080×1350) feed · 9:16 (1080×1920) Stories/Reels · 1:1 (1080×1080) fallback
**Text safe zone (9:16):** keep text out of the top ~14% and bottom ~35%
**Image prompt (if generating):** [prompt per generative-tools.md]
**Variants:** [up to 2 that change one element: hook line, visual, or style]
```

## Motion Brief

```markdown
## C[n]: [Concept name], Motion, [Style]

**Length:** [6 / 10 / 15 / 30s]   **Aspect:** 9:16 master, 4:5 and 1:1 cutdowns
**Sound:** [VO + captions / music + captions / captions only]. Assume sound-off; captions carry the message.

**Hook (0 to 3s):**
| Visual action | Spoken line | On-screen text |
|---------------|-------------|----------------|
| [what moves first] | [first words, if VO] | [caption; complements, doesn't repeat VO] |

**Beats:**
| # | Time | Visual | Motion | On-screen text | VO |
|---|------|--------|--------|----------------|----|
| 1 | 0 to 3s | ... | ... | ... | ... |
| 2 | 3 to 8s | ... | ... | ... | ... |
| 3 | 8 to 12s | Proof / offer | ... | ... | ... |
| 4 | 12 to 15s | End card: product, offer, CTA | ... | ... | ... |

**Brand moment:** product or logo visible by second 3
**Thumbnail / first frame:** [reuse the static from C[n] if it exists]
**Production route:** [generated stills + image-to-video / motion designer template / edit of existing footage]
```

Motion rules:
- One dominant motion per beat. Two motions at feed speed read as noise.
- Product visible early; offer and CTA in the last beat and on the end card.
- For food, real footage of the dish wins; use generated motion for typography, offer reveals, and backgrounds.
- Reuse the winning static's headline as the motion hook when turning a static winner into video.

## Specs and Safe Zones

| Placement | Aspect | Size (px) | Notes |
|-----------|--------|-----------|-------|
| Feed (FB/IG) | 4:5 | 1080×1350 | Best default for feed |
| Stories / Reels | 9:16 | 1080×1920 | Keep text and logo clear of top ~14% and bottom ~35% |
| Fallback / right column | 1:1 | 1080×1080 | Needed for some placements |
| Video length | 6 to 15s for cold; up to 30 to 60s for proof or UGC | | Hook in the first 3s |

Platform specs change; the dated tables are in ad-creative's [platform-specs.md](../../ad-creative/references/platform-specs.md). Upload a 9:16 and a 4:5 asset per ad and use placement asset customization rather than letting Meta crop.

## Production Routing

| Asset | Route |
|-------|-------|
| Statics from templates | Image generation tool if connected, or designer with the brief |
| Product-accurate visuals | Real product photos edited (background, layout, text); generated product shots risk inaccuracy |
| Faceless motion | Generated stills → image-to-video → VO/captions (motion-video-ads pipeline) |
| Motion graphics on real assets | Motion designer or template tool; brief above |
| UGC / creator | Creator brief with hook options, talking points, must-say/never-say, deliverables, usage rights |
| Catalog frames | Catalog template with brand frame and price/offer overlay |

Before generating: confirm the tool, cost or credits, and the batch size with the user. Generate the first concept, get approval on look, then pass it as a reference for the rest so the set reads as one brand.

## Quality and Policy Check

Check every asset before it goes into the build sheet:

- Hook readable in under 2 seconds on a phone
- Text on image is short; product or offer is the focal point
- No personal-attribute claims, fake UI (fake buttons, system alerts), or misleading before/after
- Claims, prices, and stats match Stage 1 facts exactly
- AI-generated or altered imagery disclosed where Meta's rules require it
- Food: dish looks like what arrives
- Arabic: right-to-left layout correct, numerals consistent, dialect matches the segment

## Batch Index

End Stage 4 with an index the user can scan in a minute:

| Concept | Format | Segment / trigger | Awareness | Funnel role | Grounded in | Status |
|---------|--------|-------------------|-----------|-------------|-------------|--------|
| C1 | Static | ... | ... | Cold | ... | Brief ready / Generated / Approved |

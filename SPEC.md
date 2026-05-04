# $DOOD Landing Page — SPEC

## Concept & Vision
Chaotic, absurdist Adult Swim / Joe Cappa energy meets suburban backyard grill-out. Think King of the Hill dad vibes running into a fever dream. Bold, loud, unapologetically weird. Just a dood being a dood. The page should feel like a cartoon that got into the crypto space and can't stop vibing.

## Design Language
- **Aesthetic:** Chaotic cartoon suburbia — bold outlines, exaggerated proportions, party grill-out energy
- **Colors:**
  - Primary: #FF6B35 (burnt orange)
  - Secondary: #FFD23F (mustard yellow)
  - Accent: #3DFF7F (neon green)
  - Background: warm gradient (#FFF5E6 → #FFE4CC → #FFD4A8 → #FFC887)
  - Surface: #16213E
  - Text: #1A1A2E (dark, legible on warm gradient)
  - Text Light: #FFFFFF
  - Danger: #FF3366
- **Typography:**
  - Headings: "Bangers" (Google Fonts via Next.js) — bold cartoon impact
  - Body: "Nunito" (Google Fonts via Next.js) — clean contrast
- **Motion:** Bouncy CSS keyframes for float, pulse, bounce-in. Hover scale effects on buttons/cards.
- **Icons:** Inline emoji, no icon library needed

## Layout
Single page, vertical scroll:
1. **Hero** — $DOOD logo/title, Solana badge, CTA buttons (Buy + Chart), social links
2. **Stats Bar** — live price, 24h change, volume, liquidity (from DexScreener API)
3. **PFP Generator** — main feature, AI-powered DOOD PFP generation (prominently placed)
4. **Community** — X account, X community, DexScreener links + contract address copy
5. **Footer** — disclaimer text

## Features & Interactions
- Live token stats fetched from DexScreener API on load
- Copy contract address to clipboard
- Animated hero text with CSS keyframes
- Hover effects on all buttons/cards (scale transform)
- Responsive: mobile-first, stacks cleanly
- PFP Generator: rate limited to 1 request per 3 minutes per IP, client-side countdown

## Component Inventory
- **Hero** — huge Bangers font title, gradient badge, CTA row, social buttons
- **Stat Card** — number + label, colored border and shadow
- **PFPSection** — textarea prompt input, generate button, image display, download button
- **Community** — 3-column grid of social links + contract address row with copy button
- **Footer** — simple text disclaimer

## Technical Approach
- **Framework:** Next.js 16 with App Router (`/app` directory)
- **Components:** `/app/components/` — Hero.tsx, Stats.tsx, PFPSection.tsx, Community.tsx
- **API Route:** `POST /api/generate` — image generation endpoint (see below)
- **Styling:** Tailwind CSS v4 with CSS variables for theme colors (`--primary`, `--secondary`, etc.)
- **Fonts:** Google Fonts via `next/font/google` (Bangers + Nunito)
- **Rate Limiting:** In-memory Map per IP, 3-minute cooldown
- **Assets:** Reference images in `/public/pfp-refs/`

## API Route — `/api/generate`

**Endpoint:** `POST /api/generate`

**Request Body:**
```json
{
  "prompt": "a dude grilling at a backyard BBQ...",
  "images": ["/pfp-refs/dood-grill-master.jpg", "/pfp-refs/chad-mccool-5.jpg"]
}
```

**Response (success):**
```json
{ "imageUrl": "https://..." }
```

**Rate Limit:** 429 with `{"error": "Rate limited. Try again in Xs."}` — 1 request per 3 minutes per IP

**OpenAI Integration:**
- Model: `gpt-image-1`
- Endpoint: `POST https://api.openai.com/v1/images/edits`
- Auth: Bearer token from `OPENAI_API_KEY` env var
- ⚠️ **API key not yet configured** — set `OPENAI_API_KEY` in Vercel dashboard → Settings → Environment Variables

## Important Links
- **Contract:** `4pzuXZwn4N2oGzrjnTv57FkD31eSqwnhx4w96uH1pump`
- **Jupiter Swap:** https://jup.ag/swap?sell=So11111111111111111111111111111111111111112&buy=4pzuXZwn4N2oGzrjnTv57FkD31eSqwnhx4w96uH1pump
- **DexScreener:** https://dexscreener.com/solana/fr2azeueszdfrhye41xldfxmuzjzlad74u88142tc7pf
- **X:** https://x.com/doodpfp
- **X Community:** https://x.com/i/communities/1832939399241502938
- **Tagline:** "Just a dood being a dood."

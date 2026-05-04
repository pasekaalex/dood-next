# $DOOD — DOOD PFP Generator

**Live:** [https://doodpfp.lol](https://doodpfp.lol)

Just a dood being a dood. Solana memecoin with an AI-powered PFP generator.

## Links

- **Buy:** [Jupiter Swap](https://jup.ag/swap?sell=So11111111111111111111111111111111111111112&buy=4pzuXZwn4N2oGzrjnTv57FkD31eSqwnhx4w96uH1pump)
- **Chart:** [DexScreener](https://dexscreener.com/solana/fr2azeueszdfrhye41xldfxmuzjzlad74u88142tc7pf)
- **X:** [@doodpfp](https://x.com/doodpfp)
- **Community:** [X Community](https://x.com/i/communities/1832939399241502938)

## Contract

```
4pzuXZwn4N2oGzrjnTv57FkD31eSqwnhx4w96uH1pump
```

## Tech Stack

- **Framework:** Next.js 16 (App Router)
- **Styling:** Tailwind CSS v4
- **Fonts:** Bangers + Nunito (Google Fonts)
- **API:** OpenAI `gpt-image-1` for PFP generation

## Setup

```bash
npm install
npm run dev
```

Add `OPENAI_API_KEY` env var for PFP generation to work.

## Project Structure

```
app/
├── page.tsx           # Main landing page
├── components/
│   ├── Hero.tsx       # Hero section with $DOOD branding
│   ├── Stats.tsx      # Live token stats from DexScreener
│   ├── PFPSection.tsx # AI PFP generator
│   └── Community.tsx  # Social links + contract address
└── api/
    └── generate/      # Image generation endpoint
```

## Legal

$DOOD is a memecoin. Not financial advice. DYOR.

# $DOOD — DOOD PFP Generator

![Dood Logo](/logo.png)

**Live:** [https://doodpfp.lol](https://doodpfp.lol)

Just a dood being a dood. ⚡️

$DOOD is a Solana memecoin with an AI-powered PFP generator. Create your own unique DOOD character in seconds — each one different, each one weird, each one unmistakably a DOOD.

## Create Your DOOD

Visit [doodpfp.lol](https://doodpfp.lol) and describe your character. The AI generates a unique PFP based on your prompt, using the DOOD art style.

## Links

- **Buy $DOOD:** [Jupiter Swap](https://jup.ag/swap?sell=So11111111111111111111111111111111111111112&buy=4pzuXZwn4N2oGzrjnTv57FkD31eSqwnhx4w96uH1pump)
- **Chart:** [DexScreener](https://dexscreener.com/solana/fr2azeueszdfrhye41xldfxmuzjzlad74u88142tc7pf)
- **X:** [@doodpfp](https://x.com/doodpfp)
- **Community:** [X Community](https://x.com/i/communities/1832939399241502938)

## Contract

```
4pzuXZwn4N2oGzrjnTv57FkD31eSqwnhx4w96uH1pump
```

## How It Works

1. **Describe your DOOD** — "guy with sunglasses holding a beer" or "cowboy at a cookout"
2. **AI generates** — Our AI creates a unique character based on your description
3. **Save & use** — Download your PFP and rock it

Each generation is unique. Same prompt = different result every time.

## Tech Stack

- **Framework:** Next.js 16 (App Router + Turbopack)
- **Styling:** Tailwind CSS v4 + custom CSS
- **Fonts:** Bangers + Nunito (Google Fonts)
- **AI:** OpenAI `gpt-image-1` for PFP generation
- **Chain:** Solana

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
│   ├── Hero.tsx       # Hero section with logo + buy button
│   ├── Slideshow.tsx  # Image carousel + generated PFP display
│   ├── PFPSection.tsx # AI PFP generator with prompt input
│   ├── MarketCap.tsx  # Live market cap from DexScreener
│   └── Community.tsx  # Social links
└── api/
    └── generate/      # Image generation endpoint
```

## Legal

$DOOD is a memecoin with no intrinsic value or financial expectation. Not financial advice. DYOR.

*This is a satirical project. Don't take it seriously.*

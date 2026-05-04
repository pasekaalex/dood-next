import { NextRequest, NextResponse } from 'next/server';

// Simple in-memory rate limiter: IP -> last timestamp
const rateLimitMap = new Map<string, number>();
const RATE_LIMIT_MS = 3 * 60 * 1000;

function getClientIP(req: NextRequest): string {
  return req.headers.get('x-forwarded-for')?.split(',')[0]?.trim() ?? 'unknown';
}

export async function POST(req: NextRequest) {
  const ip = getClientIP(req);

  // Rate limit check
  const last = rateLimitMap.get(ip);
  if (last && Date.now() - last < RATE_LIMIT_MS) {
    const wait = Math.ceil((RATE_LIMIT_MS - (Date.now() - last)) / 1000);
    return NextResponse.json(
      { error: `Rate limited. Try again in ${wait}s.` },
      { status: 429 }
    );
  }

  const body = await req.json();
  const { prompt, images } = body;

  if (!prompt?.trim()) {
    return NextResponse.json({ error: 'Prompt is required' }, { status: 400 });
  }

  // -----------------------------------------------------------------------
  // ⚠️  OPENAI API KEY NEEDED
  //
  //  1. Get your key from https://platform.openai.com/api-keys
  //  2. Set it as an environment variable:
  //       Vercel:  vercel env add OPENAI_API_KEY
  //       Local:   export OPENAI_API_KEY=sk-...
  //
  //  Then uncomment the block below and remove the placeholder response.
  // -----------------------------------------------------------------------
  //
  // const openaiApiKey = process.env.OPENAI_API_KEY;
  // if (!openaiApiKey) {
  //   return NextResponse.json(
  //     { error: 'OPENAI_API_KEY environment variable is not set. Add it in Vercel dashboard → Settings → Environment Variables.' },
  //     { status: 500 }
  //   );
  // }
  //
  // try {
  //   rateLimitMap.set(ip, Date.now());
  //
  //   const response = await fetch('https://api.openai.com/v1/images/edits', {
  //     method: 'POST',
  //     headers: {
  //       'Authorization': `Bearer ${openaiApiKey}`,
  //       'Content-Type': 'application/json',
  //     },
  //     body: JSON.stringify({
  //       model: 'gpt-image-1',
  //       image: images[0],     // dood-grill-master.jpg
  //       prompt: prompt,
  //     }),
  //   });
  //
  //   if (!response.ok) {
  //     const err = await response.text();
  //     throw new Error(`OpenAI API error: ${err}`);
  //   }
  //
  //   const data = await response.json();
  //   const imageUrl = data.data?.[0]?.url;
  //
  //   if (!imageUrl) throw new Error('No image URL in response');
  //
  //   return NextResponse.json({ imageUrl });
  // } catch (e) {
  //   console.error('Image generation error:', e);
  //   return NextResponse.json(
  //     { error: e instanceof Error ? e.message : 'Image generation failed' },
  //     { status: 500 }
  //   );
  // }
  //
  // -----------------------------------------------------------------------
  // TEMPORARY PLACEHOLDER — replace with the real OpenAI call above
  // -----------------------------------------------------------------------
  return NextResponse.json({
    error: 'OpenAI API key not configured yet. Set OPENAI_API_KEY environment variable to enable image generation.',
  }, { status: 500 });
}

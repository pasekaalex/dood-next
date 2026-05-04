import { NextRequest, NextResponse } from 'next/server';
import { readFileSync } from 'fs';
import { join } from 'path';

const rateLimitMap = new Map<string, number>();
const RATE_LIMIT_MS = 30 * 1000;

const BASE_PROMPT = `You are generating a character in the EXACT STYLE of crude adult animation (like South Park, Metalocalypse, Beavis and Butt-Head, Adult Swim cartoons).

STYLE DESCRIPTION (follow this exactly):
LINE WORK:
- Thick black outlines (2-4px), hand-drawn wobbly appearance
- Lines are not perfectly smooth — slight wobble like drawn on paper
- No anti-aliasing or smooth digital lines

COLOR PALETTE:
- Flat solid colors, NO gradients, NO shading, NO highlights
- Colors are slightly desaturated, like marker on paper
- Skin tones are plain/flesh colored, not detailed
- Clothing is solid flat colors with no texture
- Simple color blocking, like cut-out paper

CHARACTER PROPORTIONS:
- Very exaggerated proportions: huge round head (1/3 of body), tiny body
- Small beady dot eyes, barely visible nostrils
- Thick neck (almost as wide as head)
- Simple U-shaped mouths, barely open
- Tiny thin stick arms and legs, no muscle definition
- Hands are simple blobs, not detailed fingers

FACIAL EXPRESSION:
- Completely deadpan, blank, stupid look
- Eyes are just black dots, no whites visible
- Eyebrows barely visible or nonexistent
- Mouth is simple line or small U shape

BACKGROUND:
- Solid single color or simple gradient, no detail
- Keep it minimal/floating in void

TECHNICAL:
- Clean flat shapes, no anti-aliasing
- No realistic shadows or highlights
- Everything looks hand-drawn, rough, crude
- Character faces forward or slightly off-center

User scene:
USER PROMPT HERE

Output:
square 1:1 profile picture, centered waist-up character, facing camera.`;

function getClientIP(req: NextRequest): string {
  return req.headers.get('x-forwarded-for')?.split(',')?.[0]?.trim() ?? 'unknown';
}

function getRandomRefImage(): { path: string; name: string } {
  return {
    path: join(process.cwd(), 'public', 'pfp-refs', 'dood-ref-1.jpg'),
    name: 'dood-ref-1.jpg'
  };
}

export async function POST(req: NextRequest) {
  const ip = getClientIP(req);

  const last = rateLimitMap.get(ip);
  if (last && Date.now() - last < RATE_LIMIT_MS) {
    const wait = Math.ceil((RATE_LIMIT_MS - (Date.now() - last)) / 1000);
    return NextResponse.json(
      { error: `Rate limited. Try again in ${wait}s.` },
      { status: 429 }
    );
  }

  const body = await req.json();
  const { prompt: userPrompt } = body;

  if (!userPrompt?.trim()) {
    return NextResponse.json({ error: 'Prompt is required' }, { status: 400 });
  }

  const openaiApiKey = process.env.OPENAI_API_KEY;
  if (!openaiApiKey) {
    return NextResponse.json(
      { error: 'OPENAI_API_KEY not set. Add it in Vercel dashboard.' },
      { status: 500 }
    );
  }

  try {
    rateLimitMap.set(ip, Date.now());

    const ref = getRandomRefImage();
    const imageBuffer = readFileSync(ref.path);
    const blob = new Blob([imageBuffer], { type: 'image/jpeg' });
    console.log('Reference image:', ref.name, '- Size:', blob.size, 'bytes');

    const fullPrompt = BASE_PROMPT.replace('USER PROMPT HERE', userPrompt.trim());
    console.log('Final prompt (first 200 chars):', fullPrompt.substring(0, 200));

    const formData = new FormData();
    formData.append('model', 'dall-e-2');
    formData.append('image', blob, ref.name);
    formData.append('prompt', fullPrompt);

    const response = await fetch('https://api.openai.com/v1/images/edits', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${openaiApiKey}`,
      },
      body: formData,
    });

    if (!response.ok) {
      const err = await response.text();
      console.log('OpenAI error response:', err);
      throw new Error(`OpenAI API error: ${err}`);
    }

    const data = await response.json();
    const b64 = data.data?.[0]?.b64_json;
    const imageUrl = data.data?.[0]?.url || (b64 ? `data:image/png;base64,${b64}` : null);

    if (!imageUrl) {
      console.log('OpenAI response:', JSON.stringify(data));
      throw new Error('No image URL or base64 in response');
    }

    return NextResponse.json({ imageUrl });
  } catch (e) {
    console.error('Image generation error:', e);
    return NextResponse.json(
      { error: e instanceof Error ? e.message : 'Image generation failed' },
      { status: 500 }
    );
  }
}
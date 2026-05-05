import { NextRequest, NextResponse } from 'next/server';
import { readFileSync } from 'fs';
import { join } from 'path';

const rateLimitMap = new Map<string, number>();
const RATE_LIMIT_MS = 30 * 1000;

const BASE_PROMPT = `Use the reference image only for the overall crude flat cartoon style, character framing, awkward facial proportions, thick neck silhouette, thin black outlines, flat colors, and deadpan adult-animation mood.

Generate a new original character each time.

Randomize:
skin tone, body type, neck width, face shape, mustache, hairstyle, eye color, facial hair, hat, shirt style, shirt color, outfit details, stains/accessories.

Keep:
flat 2D cartoon style, tiny dull eyes, thick neck, awkward centered face, deadpan expression, simple suburban background, no gradients, no realistic lighting.

User scene:
USER PROMPT HERE

Output:
square 1:1 profile picture, centered waist-up character, facing camera, simple background.`;

function getClientIP(req: NextRequest): string {
  return req.headers.get('x-forwarded-for')?.split(',')?.[0]?.trim() ?? 'unknown';
}

function getAllRefImages(): { path: string; name: string }[] {
  const slideshowDir = join(process.cwd(), 'public', 'slideshow');
  return [
    { path: join(slideshowDir, 'slide-1.jpg'), name: 'slide-1.jpg' },
    { path: join(slideshowDir, 'slide-2.jpg'), name: 'slide-2.jpg' },
    { path: join(slideshowDir, 'slide-3.jpg'), name: 'slide-3.jpg' },
    { path: join(slideshowDir, 'slide-4.jpg'), name: 'slide-4.jpg' },
    { path: join(slideshowDir, 'slide-5.jpg'), name: 'slide-5.jpg' },
    { path: join(slideshowDir, 'slide-6.jpg'), name: 'slide-6.jpg' },
    { path: join(slideshowDir, 'slide-7.jpg'), name: 'slide-7.jpg' },
    { path: join(slideshowDir, 'slide-8.jpg'), name: 'slide-8.jpg' },
    { path: join(slideshowDir, 'slide-9.jpg'), name: 'slide-9.jpg' },
  ];
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
    const refs = getAllRefImages();
    const imageArray = refs.map(r => {
      const buf = readFileSync(r.path);
      return `data:image/jpeg;base64,${buf.toString('base64')}`;
    });
    console.log('Sending', refs.length, 'reference images');

    const fullPrompt = BASE_PROMPT.replace('USER PROMPT HERE', userPrompt.trim());

    const response = await fetch('https://api.openai.com/v1/images/edits', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${openaiApiKey}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        model: 'gpt-image-1',
        images: imageArray,
        prompt: fullPrompt,
        quality: 'high',
        size: '1024x1024',
      }),
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

    rateLimitMap.set(ip, Date.now());
    return NextResponse.json({ imageUrl });
  } catch (e) {
    console.error('Image generation error:', e);
    return NextResponse.json(
      { error: e instanceof Error ? e.message : 'Image generation failed' },
      { status: 500 }
    );
  }
}

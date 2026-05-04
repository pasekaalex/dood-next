import { NextRequest, NextResponse } from 'next/server';
import { readFileSync } from 'fs';
import { join } from 'path';

const rateLimitMap = new Map<string, number>();
const RATE_LIMIT_MS = 60 * 1000;

const BASE_PROMPT = `Use the reference image only for the overall crude flat cartoon style, character framing, awkward facial proportions, thick neck silhouette, thin black outlines, flat colors, and deadpan adult-animation mood.

Do NOT copy the exact character identity, hat, logo, face, outfit, body type, or background from the reference image.

Generate a new original character each time.

Randomize:
skin tone, body type, neck width, face shape, mustache, hairstyle, eye color, facial hair, hat, shirt style, shirt color, outfit details, stains/accessories.

Keep:
flat 2D cartoon style, tiny dull eyes, thick neck, awkward centered face, deadpan expression, simple suburban background, no gradients, no realistic lighting.

User scene:
PLACEHOLDER_USER_PROMPT

Output:
square 1:1 profile picture, centered waist-up character, facing camera, simple background.`;

function getClientIP(req: NextRequest): string {
  return req.headers.get('x-forwarded-for')?.split(',')?.[0]?.trim() ?? 'unknown';
}

function getRandomRefImage(): { path: string; name: string } {
  const slideshowRefs = [
    'slide-1.jpg', 'slide-2.jpg', 'slide-3.jpg',
    'slide-4.jpg', 'slide-5.jpg', 'slide-6.jpg',
    'slide-7.jpg', 'slide-8.jpg', 'slide-9.jpg'
  ];

  // 50% chance original ref, 50% chance slideshow
  const useSlideshow = Math.random() < 0.5;
  const slides = slideshowRefs.sort(() => Math.random() - 0.5);
  const slide = slides[0];

  return {
    path: useSlideshow
      ? join(process.cwd(), 'public', 'slideshow', slide)
      : join(process.cwd(), 'public', 'pfp-refs', 'dood-ref-1.jpg'),
    name: useSlideshow ? slide : 'dood-ref-1.jpg'
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

    // Pick random reference image
    const ref = getRandomRefImage();
    console.log('Using reference:', ref.name);

    const imageBuffer = readFileSync(ref.path);
    const blob = new Blob([imageBuffer], { type: 'image/jpeg' });

    const formData = new FormData();
    formData.append('model', 'gpt-image-1');
    formData.append('size', '1024x1024');
    formData.append('image', blob, ref.name);
    formData.append('prompt', BASE_PROMPT.replace('PLACEHOLDER_USER_PROMPT', userPrompt.trim()));

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
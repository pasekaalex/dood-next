import { NextRequest, NextResponse } from 'next/server';
import { readFileSync } from 'fs';
import { join } from 'path';

const rateLimitMap = new Map<string, number>();
const RATE_LIMIT_MS = 60 * 1000;

const BASE_PROMPT = `You are an AI image generator creating characters in the CRUDE CARTOON STYLE shown in the reference image.

STYLE RULES - COPY THIS EXACTLY:
- Flat 2D cartoon, hand-drawn look, thick black outlines
- Simple shapes, no realistic details or gradients
- Muted or bright solid colors, plain background
- Small/beady eyes, simple mouths, minimal detail
- Blocky bodies, thick necks, simple silhouettes
- Looks like Adult Swim / Metalocalypse / crude YouTube animation

STRICT REQUIREMENTS:
- Use ONLY the reference image for the art style and character design approach
- The character should look like it was drawn by the same animator
- Keep the same level of detail and simplicity
- Do NOT add photorealistic elements, soft shading, or 3D effects
- Maintain the same proportions and rendering style


User scene:
PLACEHOLDER_USER_PROMPT

Output:
square 1:1 profile picture, centered waist-up character, facing camera, simple background.`;

function getClientIP(req: NextRequest): string {
  return req.headers.get('x-forwarded-for')?.split(',')?.[0]?.trim() ?? 'unknown';
}

function getRandomRefImage(): { path: string; name: string } {
  // Always use original dood-ref-1.jpg for consistent style
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

    // Always use original ref for now
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
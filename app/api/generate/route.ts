import { NextRequest, NextResponse } from 'next/server';
import { readFileSync } from 'fs';
import { join } from 'path';
import sharp from 'sharp';

const rateLimitMap = new Map<string, number>();
const RATE_LIMIT_MS = 30 * 1000;

const BASE_PROMPT = `[ANIMATION STYLE] Follow the reference images EXACTLY. The style should match the reference images — NOT any specific TV show. Do not lean into or reference King of the Hill, Adventure Time, Bob's Burgers, or any other existing show. The reference images are the ONLY style guide.

[EYES - IMPORTANT] The character must have eyes matching the style in the reference images. Pay close attention to how eyes are drawn across all references — same eye shape, same iris style, same outline style, same relative size.

[FACE AND BODY STRUCTURE] Reference Image 1 provides the face shape, head-to-body proportion (large head, small centered features), thick neck, nose, mouth, jawline. These structural features come from the reference images.

[NO SHOW REFERENCE] Do NOT derive style from any specific animated series. The reference images on this site are the sole style source.

[CUSTOMIZABLE] Hair, mustache, beard, shirt/outfit, background/setting — vary based on user prompt or randomization.

[USER INTENT] The user's prompt guides the SCENE and CUSTOMIZABLE elements. Honor all creative descriptors (grilling, ogre, wizard, etc.).

[SETTING] Default suburban backyard. If user specifies a different setting (desert, beach, etc.), follow it.


[CHARACTER VARIETY] When not specified, randomize: hair style/color, facial hair (mustache/beard/shaved), hats (cap/cowboy/beanie/none), shirt/outfit. Each generation must be unique.

User request:
USER PROMPT HERE

Output:
square 1:1 profile picture, centered waist-up character, facing camera.`;

function getClientIP(req: NextRequest): string {
  return req.headers.get('x-forwarded-for')?.split(',')?.[0]?.trim() ?? 'unknown';
}

async function resizeToBase64(buf: Buffer, maxWidth = 512): Promise<string> {
  const resized = await sharp(buf)
    .resize(maxWidth, maxWidth, { fit: 'inside', withoutEnlargement: true })
    .jpeg({ quality: 80 })
    .toBuffer();
  return resized.toString('base64');
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
    const imageArray = await Promise.all(refs.map(async r => {
      const buf = readFileSync(r.path);
      const base64 = await resizeToBase64(buf, 512);
      return { image_url: `data:image/jpeg;base64,${base64}` };
    }));
    console.log(`Sending ${imageArray.length} resized images as {image_url: data:...}`);

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
        input_fidelity: 'high',
        quality: 'high',
        size: '1024x1024',
      }),
    });

    if (!response.ok) {
      const errData = await response.text();
      let errMsg = 'OpenAI API error';
      try {
        const parsed = JSON.parse(errData);
        // Check for content policy violations
        if (parsed.error?.type === 'content_policy_violation' || parsed.error?.type === 'invalid_request_error') {
          errMsg = 'This prompt was flagged by our content filter. Try a different description — keep it family-friendly and avoid referencing specific characters, celebrities, or copyrighted content.';
        } else {
          errMsg = parsed.error?.message || errData;
        }
      } catch {
        errMsg = errData;
      }
      console.log('OpenAI error:', errMsg);
      throw new Error(errMsg);
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
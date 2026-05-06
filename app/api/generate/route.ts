import { NextRequest, NextResponse } from 'next/server';
import { readFileSync } from 'fs';
import { join } from 'path';
import sharp from 'sharp';

const rateLimitMap = new Map<string, number>();
const RATE_LIMIT_MS = 10 * 1000;

const BASE_PROMPT = `[ANIMATION STYLE] Follow the reference images EXACTLY. The style should match the reference images — NOT any specific TV show. Do not lean into or reference King of the Hill, Adventure Time, Bob's Burgers, or any other existing show. The reference images are the ONLY style guide.

[EYES - IMPORTANT] The character must have eyes matching the style in the reference images. Pay close attention to how eyes are drawn across all references — same eye shape, same iris style, same outline style, same relative size. Iris color should vary — randomize between blue, green, or brown when not specified by user.

[FACE AND BODY STRUCTURE] Reference Image 1 provides the face shape, head-to-body proportion (large head, small centered features), thick neck, wide/broad shoulders, nose, mouth, jawline. These structural features come from the reference images. No gap teeth unless the user explicitly asks.

[NO SHOW REFERENCE] Do NOT derive style from any specific animated series. The reference images on this site are the sole style source.

[USER INTENT] The user's prompt is the SOURCE OF TRUTH — ALL elements in the prompt must appear in the output. If the user says "guy with beer smoking cig", the output MUST show both a beer AND a cigarette. Do not drop, ignore, or partially render elements from the user's prompt. Every word in the prompt matters.

[SETTING] Default to a RANDOMIZED suburban background. If user specifies a setting, follow it. If not specified, pick from: concrete garage, messy backyard with fence, dark basement, driveway, front porch, house with siding. Vary it each time — do not default to the same background twice.

[RANDOMIZE THIS] When not specified, randomize: hair style/color (buzzcut, mullet, curly, bald, etc.), hat (trucker cap, cowboy hat, beanie, or none), t-shirt COLOR (red, green, gray, white, yellow, navy — vary it, not always the same), facial hair (mustache, beard, or clean-shaved), expression (happy, sad, angry, determined, or default/neutral — subtle), background setting (concrete garage, messy backyard, dark basement, driveway, front porch, house with siding — vary it).

[DO NOT RANDOMIZE] Beer, cigarettes, cigars, soda cans, bottles, or any other props — ONLY add these if the user explicitly mentions them in their prompt. If the user does not say "beer" = do NOT add beer. If the user does not say "cigarette" or "smoking" = do NOT add cigarettes. NEVER add props the user did not mention.

EXCEPTION — If the user's prompt describes an ANIMAL (dolphin, cat, dog, bear, fish, bird, etc.), do NOT add facial hair, mustache, or human-style facial hair. Animals get bare faces unless the user explicitly asks for it.

User request:
USER PROMPT HERE

Output:
square 1:1 profile picture, centered waist-up character, facing camera.`;

function getClientIP(req: NextRequest): string {
  return req.headers.get('x-forwarded-for')?.split(',')?.[0]?.trim() ?? 'unknown';
}

async function resizeToBase64(buf: Buffer, maxWidth = 384): Promise<string> {
  const resized = await sharp(buf)
    .resize(maxWidth, maxWidth, { fit: 'inside', withoutEnlargement: true })
    .jpeg({ quality: 80 })
    .toBuffer();
  return resized.toString('base64');
}

function getAllRefImages(): { path: string; name: string }[] {
  const refDir = join(process.cwd(), 'public', 'pfp-refs');
  return [
    { path: join(refDir, 'frontyard-blank.png'), name: 'frontyard-blank' },
    { path: join(refDir, 'beach.png'), name: 'beach' },
    { path: join(refDir, 'yard.png'), name: 'yard' },
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
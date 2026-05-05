import { NextRequest, NextResponse } from 'next/server';
import { readFileSync } from 'fs';
import { join } from 'path';
import sharp from 'sharp';

const rateLimitMap = new Map<string, number>();
const RATE_LIMIT_MS = 10 * 1000;

const BASE_PROMPT = `[ANIMATION STYLE - ALL 18 REFERENCES] All reference images define the animation style. Study them collectively for: art aesthetic, line quality, color palette, shading, character proportions, grotesque/exaggerated features. The style is consistent across all refs — use that style.

[FACE AND BODY STRUCTURE] Characters should have exaggerated, grotesque proportions: large head, small centered facial features, thick neck, wide/broad shoulders. Match this body type from the references — NOT a specific character's face from any single ref.

[EYES] Match the eye style from the references — same shape, outline, and relative size. Iris color varies: blue, green, or brown when not specified.

[NO SHOW REFERENCE] Do NOT derive style from any specific animated series (King of the Hill, Bob's Burgers, etc.). The reference images are the SOLE style source.

[USER INTENT] The user's prompt is the SOURCE OF TRUTH. ALL elements the user mentions must appear in the output. "guy with beer AND cigarette" = render BOTH.

[SETTING] The setting should match the user's prompt. A dolphin lives in water — use ocean, beach, or aquarium. A person grilling uses a backyard. A wizard might be in a castle or forest. Default to RANDOMIZED SUBURBAN ONLY when no setting is implied by the prompt. If user specifies, follow it. Otherwise pick from: concrete garage, messy backyard with fence, dark basement, driveway, front porch, house with siding. Vary it.

[CHARACTER VARIETY] When not specified by user, RANDOMIZE:
- Hair style/color (short, medium, long, curly, bald, etc.)
- Hat (trucker cap, cowboy hat, beanie, or no hat)
- T-shirt color (red, green, gray, white, yellow, navy — NOT always the same)
- Facial hair (mustache, beard, or clean-shaven)
- Expression (happy, sad, angry, determined, or default/neutral — subtle, not exaggerated)

[PROPS — IMPORTANT] Props must look PHYSICALLY HELD. If the user mentions a beer, cigarette, or any object, it must be clearly gripped, held, or supported — not floating. Beer cans need to be in hands. Cigarettes need to be held by fingers. Props only appear if the user explicitly mentions them — opt-in only, never add props the user did not mention.

EXCEPTION — If the user's prompt describes an ANIMAL (dolphin, cat, dog, bear, etc.), no facial hair unless user explicitly asks.

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
    { path: join(refDir, 'angry.png'), name: 'angry' },
    { path: join(refDir, 'beach.png'), name: 'beach' },
    { path: join(refDir, 'car.png'), name: 'car' },
    { path: join(refDir, 'depressed.png'), name: 'depressed' },
    { path: join(refDir, 'determined.png'), name: 'determined' },
    { path: join(refDir, 'frontyard.png'), name: 'frontyard' },
    { path: join(refDir, 'frontyard-blank.png'), name: 'frontyard-blank' },
    { path: join(refDir, 'frontyard-blonde.png'), name: 'frontyard-blonde' },
    { path: join(refDir, 'garage.png'), name: 'garage' },
    { path: join(refDir, 'garage-beer.png'), name: 'garage-beer' },
    { path: join(refDir, 'grill.png'), name: 'grill' },
    { path: join(refDir, 'happy.png'), name: 'happy' },
    { path: join(refDir, 'inside-beer.png'), name: 'inside-beer' },
    { path: join(refDir, 'sad.png'), name: 'sad' },
    { path: join(refDir, 'store.png'), name: 'store' },
    { path: join(refDir, 'yard.png'), name: 'yard' },
    { path: join(refDir, 'yard-grill.png'), name: 'yard-grill' },
    { path: join(refDir, 'yard-smoke.png'), name: 'yard-smoke' },
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
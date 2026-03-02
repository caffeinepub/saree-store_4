export type SkinTone = 'fair' | 'wheatish' | 'dusky' | 'dark';
export type BodyType = 'petite' | 'average' | 'plus';
export type Occasion = 'casual' | 'wedding' | 'festive' | 'formal';

export type SuitabilityScore = 'Excellent Match' | 'Good Match' | 'Neutral';

export interface SuitabilityResult {
  score: SuitabilityScore;
  scoreValue: number; // 0-100
  recommendation: string;
  tips: string[];
}

interface SareeAttributes {
  name: string;
  description: string;
}

function extractColors(text: string): string[] {
  const colorKeywords = [
    'red', 'crimson', 'maroon', 'scarlet',
    'gold', 'golden', 'yellow', 'amber',
    'green', 'emerald', 'olive', 'teal',
    'blue', 'navy', 'royal', 'cobalt',
    'pink', 'rose', 'blush', 'magenta',
    'orange', 'coral', 'peach', 'saffron',
    'white', 'ivory', 'cream', 'off-white',
    'black', 'charcoal', 'dark',
    'purple', 'violet', 'lavender', 'plum',
    'brown', 'beige', 'tan', 'chocolate',
    'silver', 'grey', 'gray',
    'multicolor', 'printed', 'floral', 'embroidered',
  ];
  const lower = text.toLowerCase();
  return colorKeywords.filter(c => lower.includes(c));
}

function extractFabric(text: string): string[] {
  const fabrics = ['silk', 'cotton', 'chiffon', 'georgette', 'crepe', 'linen', 'net', 'velvet', 'satin', 'organza', 'banarasi', 'kanjivaram', 'chanderi', 'tussar'];
  const lower = text.toLowerCase();
  return fabrics.filter(f => lower.includes(f));
}

function extractStyle(text: string): string[] {
  const styles = ['bridal', 'wedding', 'casual', 'festive', 'formal', 'party', 'traditional', 'designer', 'embroidered', 'printed', 'plain', 'heavy', 'light', 'zari', 'border'];
  const lower = text.toLowerCase();
  return styles.filter(s => lower.includes(s));
}

function getSkinToneColorScore(skinTone: SkinTone, colors: string[]): number {
  const colorScores: Record<SkinTone, Record<string, number>> = {
    fair: {
      red: 90, crimson: 85, maroon: 80, scarlet: 88,
      gold: 85, golden: 85, yellow: 70, amber: 80,
      green: 85, emerald: 90, teal: 85,
      pink: 90, rose: 88, blush: 85, magenta: 80,
      orange: 75, coral: 85, peach: 90, saffron: 80,
      white: 70, ivory: 75, cream: 72,
      black: 85, charcoal: 80, dark: 75,
      purple: 88, violet: 85, lavender: 90, plum: 82,
      blue: 80, navy: 82, royal: 85,
      silver: 80, grey: 65, gray: 65,
      brown: 65, beige: 70,
    },
    wheatish: {
      red: 95, crimson: 92, maroon: 90, scarlet: 93,
      gold: 95, golden: 95, amber: 92, yellow: 85,
      green: 88, emerald: 90, teal: 85,
      pink: 85, rose: 88, blush: 80, magenta: 85,
      orange: 90, coral: 88, peach: 85, saffron: 92,
      white: 80, ivory: 85, cream: 82,
      black: 90, charcoal: 88, dark: 85,
      purple: 85, violet: 82, lavender: 78, plum: 88,
      blue: 85, navy: 88, royal: 90,
      silver: 82, grey: 70, gray: 70,
      brown: 75, beige: 72,
    },
    dusky: {
      red: 92, crimson: 90, maroon: 88, scarlet: 90,
      gold: 98, golden: 98, amber: 95, yellow: 90,
      green: 85, emerald: 88, teal: 82,
      pink: 80, rose: 82, blush: 75, magenta: 85,
      orange: 88, coral: 85, peach: 78, saffron: 95,
      white: 90, ivory: 88, cream: 85,
      black: 85, charcoal: 82, dark: 78,
      purple: 88, violet: 85, lavender: 80, plum: 90,
      blue: 88, navy: 85, royal: 88,
      silver: 85, grey: 72, gray: 72,
      brown: 70, beige: 68,
    },
    dark: {
      red: 88, crimson: 85, maroon: 82, scarlet: 86,
      gold: 98, golden: 98, amber: 95, yellow: 92,
      green: 82, emerald: 85, teal: 80,
      pink: 75, rose: 78, blush: 70, magenta: 82,
      orange: 85, coral: 82, peach: 72, saffron: 92,
      white: 95, ivory: 92, cream: 90,
      black: 75, charcoal: 72, dark: 68,
      purple: 85, violet: 82, lavender: 78, plum: 88,
      blue: 85, navy: 82, royal: 85,
      silver: 88, grey: 75, gray: 75,
      brown: 68, beige: 65,
    },
  };

  if (colors.length === 0) return 75;
  const scores = colors.map(c => colorScores[skinTone][c] || 75);
  return Math.round(scores.reduce((a, b) => a + b, 0) / scores.length);
}

function getBodyTypeFabricScore(bodyType: BodyType, fabrics: string[], styles: string[]): number {
  const fabricScores: Record<BodyType, Record<string, number>> = {
    petite: {
      silk: 90, cotton: 85, chiffon: 95, georgette: 92, crepe: 88,
      linen: 80, net: 85, velvet: 75, satin: 82, organza: 88,
      banarasi: 80, kanjivaram: 78, chanderi: 90, tussar: 82,
    },
    average: {
      silk: 92, cotton: 88, chiffon: 88, georgette: 90, crepe: 85,
      linen: 85, net: 82, velvet: 88, satin: 85, organza: 85,
      banarasi: 90, kanjivaram: 92, chanderi: 88, tussar: 85,
    },
    plus: {
      silk: 85, cotton: 90, chiffon: 92, georgette: 90, crepe: 88,
      linen: 88, net: 80, velvet: 82, satin: 80, organza: 82,
      banarasi: 85, kanjivaram: 82, chanderi: 88, tussar: 85,
    },
  };

  const styleScores: Record<BodyType, Record<string, number>> = {
    petite: { heavy: 70, light: 95, embroidered: 80, printed: 88, plain: 85, zari: 75, border: 82 },
    average: { heavy: 88, light: 88, embroidered: 90, printed: 85, plain: 82, zari: 88, border: 85 },
    plus: { heavy: 75, light: 92, embroidered: 82, printed: 88, plain: 90, zari: 78, border: 85 },
  };

  let score = 80;
  let count = 0;

  fabrics.forEach(f => {
    if (fabricScores[bodyType][f]) {
      score += fabricScores[bodyType][f];
      count++;
    }
  });

  styles.forEach(s => {
    if (styleScores[bodyType][s]) {
      score += styleScores[bodyType][s];
      count++;
    }
  });

  return count > 0 ? Math.round(score / (count + 1)) : 78;
}

function getOccasionScore(occasion: Occasion, styles: string[], fabrics: string[]): number {
  const occasionStyleMap: Record<Occasion, string[]> = {
    casual: ['casual', 'cotton', 'printed', 'plain', 'light'],
    wedding: ['bridal', 'wedding', 'heavy', 'embroidered', 'zari', 'silk', 'banarasi', 'kanjivaram'],
    festive: ['festive', 'party', 'embroidered', 'zari', 'silk', 'designer', 'gold', 'traditional'],
    formal: ['formal', 'plain', 'crepe', 'georgette', 'chiffon', 'cotton', 'linen'],
  };

  const relevantKeywords = occasionStyleMap[occasion];
  const allKeywords = [...styles, ...fabrics];
  const matches = allKeywords.filter(k => relevantKeywords.includes(k)).length;

  if (matches >= 3) return 95;
  if (matches === 2) return 88;
  if (matches === 1) return 80;
  return 70;
}

function getScoreLabel(score: number): SuitabilityScore {
  if (score >= 85) return 'Excellent Match';
  if (score >= 70) return 'Good Match';
  return 'Neutral';
}

function generateRecommendation(
  score: SuitabilityScore,
  skinTone: SkinTone,
  bodyType: BodyType,
  occasion: Occasion,
  colors: string[],
  fabrics: string[]
): string {
  const skinToneLabels: Record<SkinTone, string> = {
    fair: 'fair',
    wheatish: 'wheatish',
    dusky: 'dusky',
    dark: 'dark',
  };

  const occasionLabels: Record<Occasion, string> = {
    casual: 'casual outings',
    wedding: 'wedding ceremonies',
    festive: 'festive celebrations',
    formal: 'formal occasions',
  };

  const bodyLabels: Record<BodyType, string> = {
    petite: 'petite frame',
    average: 'average build',
    plus: 'plus-size figure',
  };

  const colorStr = colors.length > 0 ? colors.slice(0, 2).join(' and ') : 'vibrant';
  const fabricStr = fabrics.length > 0 ? fabrics[0] : 'this';

  if (score === 'Excellent Match') {
    return `This saree is a perfect choice for you! The ${colorStr} tones beautifully complement your ${skinToneLabels[skinTone]} complexion, and the ${fabricStr} fabric drapes elegantly on your ${bodyLabels[bodyType]}. It's an ideal pick for ${occasionLabels[occasion]}.`;
  } else if (score === 'Good Match') {
    return `This saree works well for you! The ${colorStr} hues suit your ${skinToneLabels[skinTone]} skin tone, and the drape will flatter your ${bodyLabels[bodyType]}. With the right blouse and accessories, it will look stunning for ${occasionLabels[occasion]}.`;
  } else {
    return `This saree can work for you with the right styling. Consider pairing it with contrasting accessories to enhance the look for your ${skinToneLabels[skinTone]} complexion and ${bodyLabels[bodyType]}. It may need some styling adjustments for ${occasionLabels[occasion]}.`;
  }
}

function generateTips(skinTone: SkinTone, bodyType: BodyType, occasion: Occasion): string[] {
  const tips: string[] = [];

  const skinTips: Record<SkinTone, string> = {
    fair: 'Deep jewel tones and pastels both work beautifully for fair skin.',
    wheatish: 'Warm earthy tones, gold, and rich reds are your best friends.',
    dusky: 'Bright colors, gold, and white create a stunning contrast.',
    dark: 'Bold colors, gold, silver, and white make your complexion glow.',
  };

  const bodyTips: Record<BodyType, string> = {
    petite: 'Lightweight fabrics and vertical patterns create an elongating effect.',
    average: 'You can carry most styles — experiment with bold prints and heavy embroidery.',
    plus: 'Flowy fabrics like chiffon and georgette drape beautifully and are very flattering.',
  };

  const occasionTips: Record<Occasion, string> = {
    casual: 'Pair with simple jewelry and comfortable footwear for an effortless look.',
    wedding: 'Heavy gold jewelry and a statement blouse will complete the bridal look.',
    festive: 'Opt for statement earrings and a contrasting blouse for a festive vibe.',
    formal: 'Keep accessories minimal and choose a well-fitted blouse for a polished look.',
  };

  tips.push(skinTips[skinTone]);
  tips.push(bodyTips[bodyType]);
  tips.push(occasionTips[occasion]);

  return tips;
}

export function calculateSuitability(
  skinTone: SkinTone,
  bodyType: BodyType,
  occasion: Occasion,
  saree: SareeAttributes
): SuitabilityResult {
  const fullText = `${saree.name} ${saree.description}`;
  const colors = extractColors(fullText);
  const fabrics = extractFabric(fullText);
  const styles = extractStyle(fullText);

  const colorScore = getSkinToneColorScore(skinTone, colors);
  const bodyScore = getBodyTypeFabricScore(bodyType, fabrics, styles);
  const occasionScore = getOccasionScore(occasion, styles, fabrics);

  const weightedScore = Math.round(colorScore * 0.4 + bodyScore * 0.3 + occasionScore * 0.3);
  const scoreLabel = getScoreLabel(weightedScore);
  const recommendation = generateRecommendation(scoreLabel, skinTone, bodyType, occasion, colors, fabrics);
  const tips = generateTips(skinTone, bodyType, occasion);

  return {
    score: scoreLabel,
    scoreValue: weightedScore,
    recommendation,
    tips,
  };
}

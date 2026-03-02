import { useState, useRef } from 'react';
import { Upload, Sparkles, ChevronDown, Camera, RefreshCw } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Progress } from '@/components/ui/progress';
import { Product } from '@/backend';

interface VirtualTryOnProps {
  product?: Product;
  allSarees?: Product[];
  // Also accept these alternative prop names for flexibility
  sarees?: Product[];
  selectedSareeId?: bigint;
}

type SkinTone = 'fair' | 'wheatish' | 'dusky' | 'dark';
type BodyType = 'petite' | 'average' | 'tall' | 'plus';
type Occasion = 'wedding' | 'festival' | 'casual' | 'office' | 'party';

interface SuitabilityResult {
  score: number;
  label: string;
  tips: string[];
}

function computeScore(
  saree: Product,
  skinTone: SkinTone,
  bodyType: BodyType,
  occasion: Occasion
): SuitabilityResult {
  let score = 65;
  const tips: string[] = [];
  const desc = (saree.description + ' ' + saree.name).toLowerCase();

  if (skinTone === 'fair') {
    if (desc.includes('pastel') || desc.includes('light') || desc.includes('pink')) score += 10;
    tips.push('Pastel and light shades complement fair skin beautifully.');
  } else if (skinTone === 'wheatish') {
    if (desc.includes('gold') || desc.includes('yellow') || desc.includes('orange')) score += 10;
    tips.push('Warm tones like gold and orange enhance wheatish skin.');
  } else if (skinTone === 'dusky') {
    if (desc.includes('bright') || desc.includes('vibrant') || desc.includes('red')) score += 10;
    tips.push('Bright and vibrant colors look stunning on dusky skin.');
  } else if (skinTone === 'dark') {
    if (desc.includes('bright') || desc.includes('jewel') || desc.includes('royal')) score += 10;
    tips.push('Jewel tones and bright colors create a striking contrast.');
  }

  if (bodyType === 'petite') {
    if (desc.includes('light') || desc.includes('chiffon') || desc.includes('georgette')) score += 8;
    tips.push('Lightweight fabrics like chiffon drape elegantly on petite frames.');
  } else if (bodyType === 'tall') {
    if (desc.includes('silk') || desc.includes('heavy') || desc.includes('brocade')) score += 8;
    tips.push('Heavy silks and brocades look magnificent on tall frames.');
  } else if (bodyType === 'plus') {
    if (desc.includes('georgette') || desc.includes('crepe')) score += 8;
    tips.push('Georgette and crepe fabrics flow gracefully and are very flattering.');
  }

  if (occasion === 'wedding') {
    if (desc.includes('silk') || desc.includes('bridal')) score += 12;
    tips.push('Silk sarees are perfect for weddings — timeless and elegant.');
  } else if (occasion === 'casual') {
    if (desc.includes('cotton') || desc.includes('linen')) score += 12;
    tips.push('Cotton sarees are comfortable and perfect for everyday wear.');
  } else if (occasion === 'office') {
    if (desc.includes('cotton') || desc.includes('simple')) score += 10;
    tips.push('Simple, understated sarees work best for professional settings.');
  } else if (occasion === 'festival') {
    if (desc.includes('silk') || desc.includes('bright') || desc.includes('embroidered')) score += 10;
    tips.push('Embroidered and bright sarees are perfect for festive occasions.');
  } else if (occasion === 'party') {
    if (desc.includes('georgette') || desc.includes('net') || desc.includes('sequin')) score += 10;
    tips.push('Flowing, embellished sarees make you the star of any party!');
  }

  score = Math.min(100, Math.max(0, score));

  let label = 'Good Match';
  if (score >= 90) label = 'Perfect Match!';
  else if (score >= 75) label = 'Great Match';
  else if (score >= 60) label = 'Good Match';
  else if (score >= 45) label = 'Fair Match';
  else label = 'May Not Suit';

  if (tips.length === 0) {
    tips.push('Pair with traditional jewelry for a complete look.');
    tips.push('Choose a contrasting blouse to make the saree pop.');
  }

  return { score, label, tips };
}

export default function VirtualTryOn({ product, allSarees, sarees, selectedSareeId }: VirtualTryOnProps) {
  // Normalize props: support both naming conventions
  const sareeList = allSarees ?? sarees ?? [];
  const initialId = product
    ? product.id.toString()
    : selectedSareeId
    ? selectedSareeId.toString()
    : sareeList[0]?.id.toString() ?? '';

  const [userImage, setUserImage] = useState<string | null>(null);
  const [selectedId, setSelectedId] = useState<string>(initialId);
  const [skinTone, setSkinTone] = useState<SkinTone>('wheatish');
  const [bodyType, setBodyType] = useState<BodyType>('average');
  const [occasion, setOccasion] = useState<Occasion>('casual');
  const [result, setResult] = useState<SuitabilityResult | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const selectedSaree = product ?? sareeList.find((s) => s.id.toString() === selectedId);

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = (ev) => {
      setUserImage(ev.target?.result as string);
      setResult(null);
    };
    reader.readAsDataURL(file);
  };

  const handleCheck = () => {
    if (!selectedSaree) return;
    const res = computeScore(selectedSaree, skinTone, bodyType, occasion);
    setResult(res);
  };

  const handleReset = () => {
    setUserImage(null);
    setResult(null);
    if (fileInputRef.current) fileInputRef.current.value = '';
  };

  const scoreColor =
    result
      ? result.score >= 75
        ? 'text-teal-700'
        : result.score >= 50
        ? 'text-champagne-600'
        : 'text-destructive'
      : '';

  return (
    <div>
      <div className="flex items-center gap-2 mb-4">
        <Sparkles className="w-5 h-5 text-teal-600" />
        <h3 className="font-display text-lg text-teal-800">Virtual Try-On</h3>
      </div>
      <p className="font-sans text-sm text-muted-foreground mb-5">
        Upload your photo and select your preferences to see how this saree suits you.
      </p>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Left: Photo upload + saree preview */}
        <div className="space-y-4">
          {/* Saree selector (only when no product pre-selected) */}
          {!product && sareeList.length > 0 && (
            <div>
              <label className="block font-sans text-xs text-teal-700 uppercase tracking-wider mb-1.5">
                Select Saree
              </label>
              <div className="relative">
                <select
                  value={selectedId}
                  onChange={(e) => { setSelectedId(e.target.value); setResult(null); }}
                  className="w-full appearance-none text-sm border border-teal-200 rounded-md px-3 py-2 bg-white text-foreground focus:outline-none focus:ring-1 focus:ring-teal-400 pr-8"
                >
                  {sareeList.map((s) => (
                    <option key={s.id.toString()} value={s.id.toString()}>
                      {s.name}
                    </option>
                  ))}
                </select>
                <ChevronDown className="absolute right-2 top-1/2 -translate-y-1/2 w-4 h-4 text-teal-400 pointer-events-none" />
              </div>
            </div>
          )}

          {/* Side-by-side preview */}
          <div className="grid grid-cols-2 gap-3">
            {/* User photo */}
            <div>
              <p className="text-xs font-sans text-muted-foreground mb-1.5 text-center">Your Photo</p>
              <div
                className="aspect-[3/4] rounded-lg border-2 border-dashed border-teal-200 bg-teal-50/30 flex flex-col items-center justify-center cursor-pointer hover:border-teal-400 hover:bg-teal-50 transition-all overflow-hidden"
                onClick={() => fileInputRef.current?.click()}
              >
                {userImage ? (
                  <img src={userImage} alt="Your photo" className="w-full h-full object-cover rounded-lg" />
                ) : (
                  <div className="flex flex-col items-center gap-2 p-4 text-center">
                    <Camera className="w-8 h-8 text-teal-300" />
                    <p className="text-xs text-teal-400 font-sans">Click to upload</p>
                  </div>
                )}
              </div>
              <input
                ref={fileInputRef}
                type="file"
                accept="image/*"
                className="hidden"
                onChange={handleImageUpload}
              />
              {!userImage ? (
                <Button
                  variant="outline"
                  size="sm"
                  className="w-full mt-2 text-xs gap-1 border-teal-200 text-teal-700 hover:bg-teal-50"
                  onClick={() => fileInputRef.current?.click()}
                >
                  <Upload className="w-3 h-3" /> Upload Photo
                </Button>
              ) : (
                <Button
                  variant="ghost"
                  size="sm"
                  className="w-full mt-2 text-xs gap-1 text-muted-foreground"
                  onClick={handleReset}
                >
                  <RefreshCw className="w-3 h-3" /> Change Photo
                </Button>
              )}
            </div>

            {/* Saree image */}
            <div>
              <p className="text-xs font-sans text-muted-foreground mb-1.5 text-center">Selected Saree</p>
              <div className="aspect-[3/4] rounded-lg border border-teal-100 bg-sand-50 overflow-hidden">
                {selectedSaree?.imageUrl ? (
                  <img
                    src={selectedSaree.imageUrl}
                    alt={selectedSaree.name}
                    className="w-full h-full object-cover"
                  />
                ) : (
                  <div className="w-full h-full flex items-center justify-center">
                    <Sparkles className="w-8 h-8 text-teal-200" />
                  </div>
                )}
              </div>
              {selectedSaree && (
                <p className="text-xs text-center text-teal-600 font-sans mt-1.5 line-clamp-1">
                  {selectedSaree.name}
                </p>
              )}
            </div>
          </div>
        </div>

        {/* Right: Preferences + Result */}
        <div className="space-y-4">
          {/* Skin Tone */}
          <div>
            <label className="block font-sans text-xs text-teal-700 uppercase tracking-wider mb-1.5">Skin Tone</label>
            <div className="relative">
              <select
                value={skinTone}
                onChange={(e) => setSkinTone(e.target.value as SkinTone)}
                className="w-full appearance-none text-sm border border-teal-200 rounded-md px-3 py-2 bg-white text-foreground focus:outline-none focus:ring-1 focus:ring-teal-400 pr-8"
              >
                <option value="fair">Fair</option>
                <option value="wheatish">Wheatish</option>
                <option value="dusky">Dusky</option>
                <option value="dark">Dark</option>
              </select>
              <ChevronDown className="absolute right-2 top-1/2 -translate-y-1/2 w-4 h-4 text-teal-400 pointer-events-none" />
            </div>
          </div>

          {/* Body Type */}
          <div>
            <label className="block font-sans text-xs text-teal-700 uppercase tracking-wider mb-1.5">Body Type</label>
            <div className="relative">
              <select
                value={bodyType}
                onChange={(e) => setBodyType(e.target.value as BodyType)}
                className="w-full appearance-none text-sm border border-teal-200 rounded-md px-3 py-2 bg-white text-foreground focus:outline-none focus:ring-1 focus:ring-teal-400 pr-8"
              >
                <option value="petite">Petite</option>
                <option value="average">Average</option>
                <option value="tall">Tall</option>
                <option value="plus">Plus Size</option>
              </select>
              <ChevronDown className="absolute right-2 top-1/2 -translate-y-1/2 w-4 h-4 text-teal-400 pointer-events-none" />
            </div>
          </div>

          {/* Occasion */}
          <div>
            <label className="block font-sans text-xs text-teal-700 uppercase tracking-wider mb-1.5">Occasion</label>
            <div className="relative">
              <select
                value={occasion}
                onChange={(e) => setOccasion(e.target.value as Occasion)}
                className="w-full appearance-none text-sm border border-teal-200 rounded-md px-3 py-2 bg-white text-foreground focus:outline-none focus:ring-1 focus:ring-teal-400 pr-8"
              >
                <option value="casual">Casual</option>
                <option value="office">Office</option>
                <option value="festival">Festival</option>
                <option value="wedding">Wedding</option>
                <option value="party">Party</option>
              </select>
              <ChevronDown className="absolute right-2 top-1/2 -translate-y-1/2 w-4 h-4 text-teal-400 pointer-events-none" />
            </div>
          </div>

          <Button
            onClick={handleCheck}
            disabled={!selectedSaree}
            className="w-full bg-teal-700 hover:bg-teal-600 text-champagne-200 font-sans tracking-widest uppercase text-sm rounded-sm border-0 disabled:opacity-50"
          >
            <Sparkles className="w-4 h-4 mr-2" />
            Check Suitability
          </Button>

          {/* Result */}
          {result && (
            <div className="p-4 bg-teal-50 rounded-lg border border-teal-100">
              <div className="flex items-center justify-between mb-2">
                <span className="font-display text-teal-800 text-lg">{result.label}</span>
                <span className={`font-serif text-2xl font-semibold ${scoreColor}`}>{result.score}%</span>
              </div>
              <Progress
                value={result.score}
                className="h-2 bg-teal-100 [&>div]:bg-teal-600 mb-4"
              />
              {result.tips.length > 0 && (
                <div>
                  <p className="font-sans text-xs text-teal-600 uppercase tracking-wider mb-2">Style Tips</p>
                  <ul className="space-y-1.5">
                    {result.tips.map((tip, i) => (
                      <li key={i} className="flex items-start gap-2 text-sm font-sans text-teal-700">
                        <Sparkles className="w-3.5 h-3.5 text-champagne-500 mt-0.5 shrink-0" />
                        {tip}
                      </li>
                    ))}
                  </ul>
                </div>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

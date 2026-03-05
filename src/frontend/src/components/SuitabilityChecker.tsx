import type { Product } from "@/backend";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { ChevronDown, Sparkles } from "lucide-react";
import React, { memo, useState } from "react";

interface SuitabilityCheckerProps {
  product: Product;
}

type SkinTone = "fair" | "wheatish" | "dusky" | "dark";
type BodyType = "petite" | "average" | "tall" | "plus";
type Occasion = "wedding" | "festival" | "casual" | "office" | "party";

interface SuitabilityResult {
  score: number;
  label: string;
  tips: string[];
}

function calculateSuitability(
  product: Product,
  skinTone: SkinTone,
  bodyType: BodyType,
  occasion: Occasion,
): SuitabilityResult {
  // Deterministic but varied base score derived from product name hash
  const nameHash = product.name
    .split("")
    .reduce((acc, c) => acc + c.charCodeAt(0), 0);
  let score = 55 + (nameHash % 20); // base: 55–74
  const tips: string[] = [];
  const desc = product.description.toLowerCase();
  const name = product.name.toLowerCase();

  // Skin tone adjustments
  if (skinTone === "fair") {
    if (
      desc.includes("pastel") ||
      desc.includes("light") ||
      desc.includes("pink")
    )
      score += 10;
    if (desc.includes("dark") || desc.includes("black")) score -= 5;
    tips.push("Pastel and light shades complement fair skin beautifully.");
  } else if (skinTone === "wheatish") {
    if (
      desc.includes("gold") ||
      desc.includes("yellow") ||
      desc.includes("orange")
    )
      score += 10;
    tips.push("Warm tones like gold and orange enhance wheatish skin.");
  } else if (skinTone === "dusky") {
    if (
      desc.includes("bright") ||
      desc.includes("vibrant") ||
      desc.includes("red")
    )
      score += 10;
    tips.push("Bright and vibrant colors look stunning on dusky skin.");
  } else if (skinTone === "dark") {
    if (
      desc.includes("bright") ||
      desc.includes("jewel") ||
      desc.includes("royal")
    )
      score += 10;
    tips.push("Jewel tones and bright colors create a striking contrast.");
  }

  // Body type adjustments
  if (bodyType === "petite") {
    if (
      desc.includes("light") ||
      desc.includes("chiffon") ||
      desc.includes("georgette")
    )
      score += 8;
    tips.push(
      "Lightweight fabrics like chiffon drape elegantly on petite frames.",
    );
  } else if (bodyType === "tall") {
    if (
      desc.includes("silk") ||
      desc.includes("heavy") ||
      desc.includes("brocade")
    )
      score += 8;
    tips.push("Heavy silks and brocades look magnificent on tall frames.");
  } else if (bodyType === "plus") {
    if (desc.includes("georgette") || desc.includes("crepe")) score += 8;
    tips.push(
      "Georgette and crepe fabrics flow gracefully and are very flattering.",
    );
  }

  // Occasion adjustments
  if (occasion === "wedding") {
    if (
      name.includes("silk") ||
      desc.includes("silk") ||
      desc.includes("bridal")
    )
      score += 12;
    tips.push("Silk sarees are perfect for weddings — timeless and elegant.");
  } else if (occasion === "casual") {
    if (desc.includes("cotton") || desc.includes("linen")) score += 12;
    tips.push("Cotton sarees are comfortable and perfect for everyday wear.");
  } else if (occasion === "office") {
    if (
      desc.includes("cotton") ||
      desc.includes("linen") ||
      desc.includes("simple")
    )
      score += 10;
    tips.push(
      "Simple, understated sarees work best for professional settings.",
    );
  } else if (occasion === "festival") {
    if (
      desc.includes("silk") ||
      desc.includes("bright") ||
      desc.includes("embroidered")
    )
      score += 10;
    tips.push(
      "Embroidered and bright sarees are perfect for festive occasions.",
    );
  }

  score = Math.min(100, Math.max(0, score));

  let label = "Good Match";
  if (score >= 90) label = "Perfect Match!";
  else if (score >= 75) label = "Great Match";
  else if (score >= 60) label = "Good Match";
  else if (score >= 45) label = "Fair Match";
  else label = "May Not Suit";

  return { score, label, tips };
}

function SuitabilityChecker({ product }: SuitabilityCheckerProps) {
  const [skinTone, setSkinTone] = useState<SkinTone>("wheatish");
  const [bodyType, setBodyType] = useState<BodyType>("average");
  const [occasion, setOccasion] = useState<Occasion>("casual");
  const [result, setResult] = useState<SuitabilityResult | null>(null);

  const handleCheck = () => {
    const res = calculateSuitability(product, skinTone, bodyType, occasion);
    setResult(res);
  };

  const scoreColor = result
    ? result.score >= 75
      ? "text-teal-700"
      : result.score >= 50
        ? "text-champagne-600"
        : "text-destructive"
    : "";

  return (
    <div>
      <div className="flex items-center gap-2 mb-4">
        <Sparkles className="w-5 h-5 text-teal-600" />
        <h3 className="font-display text-lg text-teal-800">
          Suitability Checker
        </h3>
      </div>
      <p className="font-sans text-sm text-muted-foreground mb-5">
        Find out how well this saree suits your style and occasion.
      </p>

      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-5">
        {/* Skin Tone */}
        <div>
          <label
            htmlFor="skin-tone-select"
            className="block font-sans text-xs text-teal-700 uppercase tracking-wider mb-1.5"
          >
            Skin Tone
          </label>
          <div className="relative">
            <select
              id="skin-tone-select"
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
          <label
            htmlFor="body-type-select"
            className="block font-sans text-xs text-teal-700 uppercase tracking-wider mb-1.5"
          >
            Body Type
          </label>
          <div className="relative">
            <select
              id="body-type-select"
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
          <label
            htmlFor="occasion-select"
            className="block font-sans text-xs text-teal-700 uppercase tracking-wider mb-1.5"
          >
            Occasion
          </label>
          <div className="relative">
            <select
              id="occasion-select"
              value={occasion}
              onChange={(e) => setOccasion(e.target.value as Occasion)}
              className="w-full appearance-none text-sm border border-teal-200 rounded-md px-3 py-2 bg-white text-foreground focus:outline-none focus:ring-1 focus:ring-teal-400 pr-8"
            >
              <option value="casual">Casual</option>
              <option value="wedding">Wedding</option>
              <option value="festival">Festival</option>
              <option value="office">Office</option>
              <option value="party">Party</option>
            </select>
            <ChevronDown className="absolute right-2 top-1/2 -translate-y-1/2 w-4 h-4 text-teal-400 pointer-events-none" />
          </div>
        </div>
      </div>

      <Button
        onClick={handleCheck}
        className="bg-teal-700 hover:bg-teal-600 text-champagne-200 font-sans text-xs tracking-widest uppercase rounded-sm border-0 mb-5"
      >
        <Sparkles className="w-3.5 h-3.5 mr-1.5" />
        Check Suitability
      </Button>

      {result && (
        <div className="bg-teal-50 rounded-lg p-4 border border-teal-100">
          <div className="flex items-center justify-between mb-2">
            <span className={`font-display text-xl ${scoreColor}`}>
              {result.label}
            </span>
            <span className={`font-serif text-2xl font-bold ${scoreColor}`}>
              {result.score}%
            </span>
          </div>
          <Progress value={result.score} className="h-2 mb-4" />
          <ul className="space-y-1.5">
            {result.tips.map((tip) => (
              <li
                key={tip}
                className="flex items-start gap-2 text-sm font-sans text-teal-700"
              >
                <Sparkles className="w-3.5 h-3.5 mt-0.5 shrink-0 text-champagne-500" />
                {tip}
              </li>
            ))}
          </ul>
        </div>
      )}
    </div>
  );
}

export default memo(SuitabilityChecker);

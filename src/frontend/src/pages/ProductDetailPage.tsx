import { Category } from "@/backend";

/** Parse discount percentage from offerDetails string like "20% off" or "flat 15% off" */
function parseDiscountPercent(offerDetails?: string): number {
  if (!offerDetails) return 0;
  const match = offerDetails.match(/(\d+)\s*%/);
  return match ? Number(match[1]) : 0;
}

function getDiscountedPrice(
  price: bigint,
  offerDetails?: string,
): number | null {
  const pct = parseDiscountPercent(offerDetails);
  if (pct <= 0 || pct >= 100) return null;
  return Math.round(Number(price) * (1 - pct / 100));
}
import ProductCard from "@/components/ProductCard";
import SuitabilityChecker from "@/components/SuitabilityChecker";
import VirtualTryOn from "@/components/VirtualTryOn";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { Skeleton } from "@/components/ui/skeleton";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useCart } from "@/contexts/CartContext";
import { useGetProduct, useGetProductsByCategory } from "@/hooks/useQueries";
import { Link, useNavigate, useParams } from "@tanstack/react-router";
import {
  ArrowLeft,
  CheckCircle,
  ChevronRight,
  Lock,
  Minus,
  Package,
  RefreshCcw,
  ShoppingBag,
  Sparkles,
  Star,
  Tag,
  Truck,
} from "lucide-react";
import { useState } from "react";

function getCategoryLabel(category: Category): string {
  if (category === Category.jewelry) return "Jewelry";
  if (category === Category.handbag) return "Handbags";
  return "Sarees";
}

function getCategoryRoute(category: Category): string {
  if (category === Category.jewelry) return "/jewelry";
  if (category === Category.handbag) return "/handbags";
  return "/sarees";
}

function getCategoryTryOnLabel(category: Category): string {
  if (category === Category.jewelry) return "jewelry";
  if (category === Category.handbag) return "handbag";
  return "saree";
}

function getProductHighlights(description: string): string[] {
  // Split by ". " or ". " or ","
  const parts = description
    .split(/\.\s+|,\s+/)
    .map((s) => s.trim())
    .filter((s) => s.length > 8);
  // Return 2–4 highlights
  return parts.slice(0, 4);
}

// Deterministic color swatches based on product id
const SWATCH_PALETTES = [
  ["#8B0000", "#C0392B", "#E74C3C", "#FF8C69"],
  ["#006400", "#228B22", "#2ECC71", "#A8E6CF"],
  ["#00008B", "#1A5276", "#2980B9", "#AED6F1"],
  ["#4B0082", "#7D3C98", "#A569BD", "#D2B4DE"],
  ["#8B4513", "#C0813A", "#E59866", "#FAD7A0"],
  ["#2C3E50", "#566573", "#AEB6BF", "#D5DBDB"],
  ["#B7950B", "#D4AC0D", "#F1C40F", "#F9E79F"],
  ["#FF1493", "#C71585", "#E91E8C", "#FFB6C1"],
];

export default function ProductDetailPage() {
  const { id } = useParams({ from: "/product/$id" });
  const navigate = useNavigate();
  const { addToCart } = useCart();
  const [qty, setQty] = useState(1);
  const [selectedSwatch, setSelectedSwatch] = useState(0);

  const productId = BigInt(id);
  const { data: product, isLoading } = useGetProduct(productId);

  // Load related products — use saree as safe fallback while product loads
  const categoryForRelated = product?.category ?? Category.saree;
  const { data: relatedRaw } = useGetProductsByCategory(categoryForRelated);

  // Filter out current product, limit to 8
  const relatedProducts = (relatedRaw ?? [])
    .filter((p) => p.id.toString() !== id)
    .slice(0, 8);

  const handleAddToCart = () => {
    if (!product) return;
    for (let i = 0; i < qty; i++) {
      addToCart(product);
    }
  };

  /* ── Loading State ── */
  if (isLoading) {
    return (
      <main
        className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10"
        data-ocid="product.detail.page"
      >
        {/* Breadcrumb skeleton */}
        <div className="flex items-center gap-2 mb-6">
          <Skeleton className="h-4 w-12" />
          <Skeleton className="h-4 w-4" />
          <Skeleton className="h-4 w-20" />
          <Skeleton className="h-4 w-4" />
          <Skeleton className="h-4 w-40" />
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-10">
          <Skeleton className="aspect-[3/4] rounded-xl" />
          <div className="space-y-4">
            <Skeleton className="h-6 w-24 rounded-full" />
            <Skeleton className="h-10 w-3/4" />
            <Skeleton className="h-6 w-1/3" />
            <Skeleton className="h-8 w-1/4" />
            <Skeleton className="h-24 w-full" />
            <Skeleton className="h-12 w-full" />
          </div>
        </div>
      </main>
    );
  }

  /* ── Not Found ── */
  if (!product) {
    return (
      <main
        className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20 text-center"
        data-ocid="product.detail.page"
      >
        <Package className="w-16 h-16 text-teal-200 mx-auto mb-4" />
        <h2 className="font-serif text-2xl text-teal-800 mb-2">
          Product not found
        </h2>
        <Button
          onClick={() => navigate({ to: "/" })}
          className="bg-teal-700 hover:bg-teal-600 text-champagne-200 font-sans tracking-wider uppercase text-sm rounded-sm border-0 mt-4"
          data-ocid="product.secondary_button"
        >
          <ArrowLeft className="w-4 h-4 mr-2" /> Back to Home
        </Button>
      </main>
    );
  }

  const isSaree = product.category === Category.saree;
  const inStock = Number(product.stockQuantity) > 0;
  const maxQty = Math.min(Number(product.stockQuantity) || 10, 10);
  const starCount = Number(product.id) % 2 === 0 ? 4 : 5;
  const highlights = getProductHighlights(product.description);
  const categoryLabel = getCategoryLabel(product.category);
  const categoryRoute = getCategoryRoute(product.category);
  const tryOnLabel = getCategoryTryOnLabel(product.category);
  const swatches = SWATCH_PALETTES[Number(product.id) % SWATCH_PALETTES.length];

  return (
    <main className="bg-sand-50 min-h-screen" data-ocid="product.detail.page">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
        {/* ── Breadcrumb ── */}
        <nav
          className="flex items-center gap-1.5 text-xs font-sans text-muted-foreground mb-6"
          aria-label="Breadcrumb"
        >
          <Link
            to="/"
            className="hover:text-teal-700 transition-colors"
            data-ocid="product.breadcrumb.link"
          >
            Home
          </Link>
          <ChevronRight className="w-3 h-3 shrink-0" />
          <Link
            to={categoryRoute as "/"}
            className="hover:text-teal-700 transition-colors"
            data-ocid="product.breadcrumb.link"
          >
            {categoryLabel}
          </Link>
          <ChevronRight className="w-3 h-3 shrink-0" />
          <span className="text-foreground line-clamp-1 max-w-[200px]">
            {product.name}
          </span>
        </nav>

        {/* ── Main Product Card ── */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-10 bg-white rounded-2xl p-6 md:p-8 shadow-md border border-teal-50">
          {/* ── Left: Image ── */}
          <div className="relative">
            <div className="aspect-[3/4] rounded-xl overflow-hidden bg-sand-100 ring-1 ring-teal-100">
              {product.imageUrl ? (
                <img
                  src={product.imageUrl}
                  alt={product.name}
                  loading="eager"
                  fetchPriority="high"
                  decoding="sync"
                  style={{ imageRendering: "auto" }}
                  className="w-full h-full object-cover object-center"
                />
              ) : (
                <div className="w-full h-full flex items-center justify-center bg-teal-50">
                  <ShoppingBag className="w-20 h-20 text-teal-200" />
                </div>
              )}
            </div>
            {/* Image Badges */}
            <div className="absolute top-3 left-3 flex flex-col gap-1.5">
              {product.isNewArrival && (
                <Badge className="bg-teal-600 text-white font-sans text-xs tracking-wider rounded-sm shadow-sm">
                  <Star className="w-2.5 h-2.5 mr-1" /> New Arrival
                </Badge>
              )}
              {product.isOnOffer && (
                <Badge className="bg-champagne-500 text-teal-900 font-sans text-xs tracking-wider rounded-sm shadow-sm">
                  <Tag className="w-2.5 h-2.5 mr-1" /> On Sale
                </Badge>
              )}
            </div>
          </div>

          {/* ── Right: Details ── */}
          <div className="flex flex-col gap-4">
            {/* Category pill */}
            <div>
              <span className="inline-block bg-teal-50 text-teal-700 border border-teal-200 text-xs font-sans tracking-widest uppercase px-3 py-1 rounded-full">
                {categoryLabel}
              </span>
            </div>

            {/* Product Name */}
            <h1 className="font-serif text-3xl md:text-4xl text-teal-800 leading-tight">
              {product.name}
            </h1>

            {/* Star Rating */}
            <div className="flex items-center gap-2">
              <div className="flex items-center gap-0.5">
                {[1, 2, 3, 4, 5].map((n) => (
                  <Star
                    key={n}
                    className={`w-4 h-4 ${
                      n <= starCount
                        ? "text-amber-400 fill-amber-400"
                        : "text-gray-200 fill-gray-200"
                    }`}
                  />
                ))}
              </div>
              <span className="text-sm font-sans text-muted-foreground">
                ({128 + (Number(product.id) % 47)} reviews)
              </span>
            </div>

            {/* Price */}
            <div className="flex items-center gap-3 flex-wrap">
              {product.isOnOffer &&
              getDiscountedPrice(product.price, product.offerDetails) ? (
                <>
                  <span className="font-serif text-3xl font-bold text-teal-700">
                    ₹
                    {getDiscountedPrice(
                      product.price,
                      product.offerDetails,
                    )!.toLocaleString("en-IN")}
                  </span>
                  <span className="font-serif text-xl text-muted-foreground line-through">
                    ₹{Number(product.price).toLocaleString("en-IN")}
                  </span>
                  <span className="text-sm text-red-600 font-sans bg-red-50 px-2 py-0.5 rounded font-semibold">
                    {parseDiscountPercent(product.offerDetails)}% OFF
                  </span>
                </>
              ) : (
                <>
                  <span className="font-serif text-3xl font-bold text-teal-700">
                    ₹{Number(product.price).toLocaleString("en-IN")}
                  </span>
                  {product.isOnOffer && product.offerDetails && (
                    <span className="text-sm text-champagne-600 font-sans bg-champagne-100 px-2 py-0.5 rounded">
                      {product.offerDetails}
                    </span>
                  )}
                </>
              )}
            </div>

            {/* Color Swatches */}
            <div>
              <h3 className="font-sans text-xs uppercase tracking-widest text-teal-600 mb-2">
                Colour Options
              </h3>
              <div className="flex items-center gap-2">
                {swatches.map((color, idx) => (
                  <button
                    key={color}
                    type="button"
                    onClick={() => setSelectedSwatch(idx)}
                    title={`Color option ${idx + 1}`}
                    aria-label={`Select color ${idx + 1}`}
                    className={`w-7 h-7 rounded-full border-2 transition-all ${
                      selectedSwatch === idx
                        ? "border-teal-600 scale-110 shadow-md"
                        : "border-white shadow-sm hover:scale-105"
                    }`}
                    style={{ backgroundColor: color }}
                    data-ocid={"product.color.toggle"}
                  />
                ))}
                <span className="text-xs font-sans text-muted-foreground ml-1">
                  {
                    [
                      "Deep Red",
                      "Forest Green",
                      "Royal Blue",
                      "Violet",
                      "Mahogany",
                      "Charcoal",
                      "Golden",
                      "Rose Pink",
                    ][Number(product.id) % 8]
                  }{" "}
                  selected
                </span>
              </div>
            </div>

            <Separator className="bg-teal-50" />

            {/* Product Highlights */}
            {highlights.length > 0 && (
              <div>
                <h3 className="font-sans text-xs uppercase tracking-widest text-teal-600 mb-2">
                  Product Highlights
                </h3>
                <ul className="space-y-1.5">
                  {highlights.map((point) => (
                    <li
                      key={point}
                      className="flex items-start gap-2 text-sm font-sans text-foreground"
                    >
                      <CheckCircle className="w-4 h-4 text-teal-500 shrink-0 mt-0.5" />
                      <span>{point}</span>
                    </li>
                  ))}
                </ul>
              </div>
            )}

            {/* Stock */}
            <div className="flex items-center gap-2">
              {inStock ? (
                <>
                  <CheckCircle className="w-4 h-4 text-teal-600 shrink-0" />
                  <span className="text-sm font-sans text-teal-700">
                    In Stock ({Number(product.stockQuantity)} available)
                  </span>
                </>
              ) : (
                <>
                  <Package className="w-4 h-4 text-destructive shrink-0" />
                  <span className="text-sm font-sans text-destructive">
                    Out of Stock
                  </span>
                </>
              )}
            </div>

            {/* Quantity Selector */}
            {inStock && (
              <div className="flex items-center gap-3">
                <span className="text-sm font-sans text-muted-foreground">
                  Qty:
                </span>
                <div className="flex items-center border border-teal-200 rounded-md overflow-hidden">
                  <button
                    type="button"
                    onClick={() => setQty((prev) => Math.max(1, prev - 1))}
                    disabled={qty <= 1}
                    className="w-9 h-9 flex items-center justify-center text-teal-700 hover:bg-teal-50 disabled:opacity-40 disabled:cursor-not-allowed transition-colors"
                    aria-label="Decrease quantity"
                    data-ocid="product.toggle"
                  >
                    <Minus className="w-3.5 h-3.5" />
                  </button>
                  <span className="w-10 text-center text-sm font-sans font-semibold text-foreground border-x border-teal-200">
                    {qty}
                  </span>
                  <button
                    type="button"
                    onClick={() => setQty((prev) => Math.min(maxQty, prev + 1))}
                    disabled={qty >= maxQty}
                    className="w-9 h-9 flex items-center justify-center text-teal-700 hover:bg-teal-50 disabled:opacity-40 disabled:cursor-not-allowed transition-colors"
                    aria-label="Increase quantity"
                    data-ocid="product.toggle"
                  >
                    <span className="text-base leading-none">+</span>
                  </button>
                </div>
              </div>
            )}

            {/* Add to Cart */}
            <Button
              onClick={handleAddToCart}
              disabled={!inStock}
              className="w-full bg-teal-700 hover:bg-teal-600 text-champagne-200 font-sans tracking-widest uppercase rounded-sm border-0 py-6 text-sm disabled:opacity-50"
              data-ocid="product.add_button"
            >
              <ShoppingBag className="w-4 h-4 mr-2" />
              {inStock
                ? `Add to Cart${qty > 1 ? ` (${qty})` : ""}`
                : "Out of Stock"}
            </Button>

            {/* Free Delivery note */}
            <p className="text-xs text-muted-foreground font-sans text-center">
              Free shipping on orders above ₹2,999
            </p>

            {/* Trust badges */}
            <div className="grid grid-cols-3 gap-2 pt-1">
              {[
                { icon: CheckCircle, label: "100% Authentic" },
                { icon: RefreshCcw, label: "Easy Returns" },
                { icon: Lock, label: "Secure Payment" },
              ].map(({ icon: Icon, label }) => (
                <div
                  key={label}
                  className="flex flex-col items-center gap-1 py-2 bg-teal-50 rounded-lg border border-teal-100 text-center"
                >
                  <Icon className="w-4 h-4 text-teal-600" />
                  <span className="text-[10px] font-sans text-teal-700 leading-tight">
                    {label}
                  </span>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* ── Product Details Card ── */}
        <div className="mt-6 bg-white rounded-2xl p-6 border border-teal-50 shadow-sm">
          <h2 className="font-serif text-lg text-teal-800 mb-4">
            Product Details
          </h2>
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
            {[
              {
                label: "SKU",
                value: `DALI-${product.id}`,
              },
              {
                label: "Category",
                value: categoryLabel,
              },
              {
                label: "Availability",
                value: inStock ? "In Stock" : "Out of Stock",
              },
              {
                label: "Material",
                value:
                  product.description
                    .split(/[\s,]+/)
                    .find((w) =>
                      [
                        "silk",
                        "cotton",
                        "georgette",
                        "chiffon",
                        "brocade",
                        "crepe",
                        "linen",
                        "net",
                        "gold",
                        "silver",
                        "leather",
                        "fabric",
                      ].includes(w.toLowerCase()),
                    ) ?? "Premium Quality",
              },
            ].map(({ label, value }) => (
              <div key={label} className="space-y-0.5">
                <p className="text-[10px] font-sans uppercase tracking-widest text-muted-foreground">
                  {label}
                </p>
                <p className="text-sm font-sans font-medium text-foreground capitalize">
                  {value}
                </p>
              </div>
            ))}
          </div>
        </div>

        {/* ── Tabs: Suitability Check + Virtual Try-On ── */}
        <div className="mt-6">
          <Tabs defaultValue="suitability">
            <TabsList className="bg-teal-50 border border-teal-100 rounded-lg p-1">
              <TabsTrigger
                value="suitability"
                className="font-sans text-sm data-[state=active]:bg-teal-700 data-[state=active]:text-champagne-200 rounded"
                data-ocid="product.tryon.tab"
              >
                Suitability Check
              </TabsTrigger>
              <TabsTrigger
                value="tryon"
                className="font-sans text-sm data-[state=active]:bg-teal-700 data-[state=active]:text-champagne-200 rounded"
                data-ocid="product.tryon.tab"
              >
                Virtual Try-On
              </TabsTrigger>
            </TabsList>
            <TabsContent value="suitability" className="mt-4">
              <div className="bg-white rounded-xl p-6 border border-teal-50 shadow-sm">
                {isSaree ? (
                  <SuitabilityChecker product={product} />
                ) : (
                  <VirtualTryOn
                    product={product}
                    allProducts={relatedProducts}
                    categoryLabel={tryOnLabel}
                  />
                )}
              </div>
            </TabsContent>
            <TabsContent value="tryon" className="mt-4">
              <div className="bg-white rounded-xl p-6 border border-teal-50 shadow-sm">
                <VirtualTryOn
                  product={product}
                  allProducts={relatedProducts}
                  categoryLabel={tryOnLabel}
                />
              </div>
            </TabsContent>
          </Tabs>
        </div>

        {/* ── Related Products ── */}
        {relatedProducts.length > 0 && (
          <section className="mt-10">
            <div className="flex items-start justify-between mb-1">
              <div className="flex items-center gap-2">
                <Sparkles className="w-5 h-5 text-teal-600 shrink-0" />
                <h2 className="font-serif text-2xl text-teal-800">
                  You May Also Like
                </h2>
              </div>
              <Link
                to={categoryRoute as "/"}
                className="flex items-center gap-1 text-sm font-sans text-teal-600 hover:text-teal-800 transition-colors whitespace-nowrap"
                data-ocid="product.breadcrumb.link"
              >
                View All <ChevronRight className="w-4 h-4" />
              </Link>
            </div>
            <p className="font-sans text-sm text-muted-foreground mb-5 ml-7">
              More from {categoryLabel}
            </p>

            {/* Mobile: horizontally scrollable; Desktop: 4-col grid */}
            <div className="hidden lg:grid lg:grid-cols-4 gap-5">
              {relatedProducts.map((p, i) => (
                <div
                  key={p.id.toString()}
                  data-ocid={`product.related.item.${i + 1}`}
                >
                  <ProductCard product={p} />
                </div>
              ))}
            </div>

            {/* Mobile scroll */}
            <div className="flex lg:hidden gap-4 overflow-x-auto pb-3 -mx-1 px-1 snap-x snap-mandatory scrollbar-none">
              {relatedProducts.map((p, i) => (
                <div
                  key={p.id.toString()}
                  className="w-48 shrink-0 snap-start"
                  data-ocid={`product.related.item.${i + 1}`}
                >
                  <ProductCard product={p} />
                </div>
              ))}
            </div>

            <div className="mt-5 flex justify-center">
              <Link to={categoryRoute as "/"}>
                <Button
                  variant="outline"
                  className="border-teal-300 text-teal-700 hover:bg-teal-50 font-sans tracking-wider uppercase text-xs rounded-sm"
                  data-ocid="product.secondary_button"
                >
                  <Truck className="w-4 h-4 mr-2" />
                  View All {categoryLabel}
                </Button>
              </Link>
            </div>
          </section>
        )}
      </div>
    </main>
  );
}

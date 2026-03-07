import { Category } from "@/backend";
import ProductCard from "@/components/ProductCard";
import VirtualTryOn from "@/components/VirtualTryOn";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Skeleton } from "@/components/ui/skeleton";
import { useGetProductsByCategory } from "@/hooks/useQueries";
import { useNavigate } from "@tanstack/react-router";
import { ArrowRight, Search, SlidersHorizontal, Sparkles } from "lucide-react";
import { useState } from "react";
import sareeBannerImg from "/assets/generated/saree-category.dim_600x400.jpg";

const SUB_CATEGORIES = [
  "All",
  "Silk",
  "Cotton",
  "Embroidery",
  "Banarasi",
  "Georgette",
  "Chiffon",
  "Kanjivaram",
  "Casual",
];

export default function SareesPage() {
  const _navigate = useNavigate();
  const { data: sarees, isLoading } = useGetProductsByCategory(Category.saree);
  const [search, setSearch] = useState("");
  const [sortBy, setSortBy] = useState("default");
  const [maxPrice, setMaxPrice] = useState(50000);
  const [tryOnOpen, setTryOnOpen] = useState(false);
  const [subCategory, setSubCategory] = useState("All");

  const filtered = (sarees ?? [])
    .filter((p) => {
      const matchSearch =
        p.name.toLowerCase().includes(search.toLowerCase()) ||
        p.description.toLowerCase().includes(search.toLowerCase());
      const matchPrice = Number(p.price) <= maxPrice;
      const matchSub =
        subCategory === "All"
          ? true
          : `${p.name} ${p.description}`
              .toLowerCase()
              .includes(subCategory.toLowerCase());
      return matchSearch && matchPrice && matchSub;
    })
    .sort((a, b) => {
      if (sortBy === "price-asc") return Number(a.price) - Number(b.price);
      if (sortBy === "price-desc") return Number(b.price) - Number(a.price);
      if (sortBy === "name") return a.name.localeCompare(b.name);
      return 0;
    });

  return (
    <main>
      {/* Banner */}
      <section className="relative h-56 md:h-72 overflow-hidden">
        <img
          src={sareeBannerImg}
          alt="Sarees Collection"
          loading="lazy"
          className="w-full h-full object-cover"
        />
        <div className="absolute inset-0 bg-gradient-to-r from-teal-900/80 to-teal-900/30" />
        <div className="absolute inset-0 flex items-center">
          <div className="max-w-7xl mx-auto px-6 sm:px-10 lg:px-16 w-full">
            <p className="font-sans text-xs text-champagne-400 tracking-widest uppercase mb-2">
              Collections
            </p>
            <h1 className="font-serif text-4xl md:text-5xl text-champagne-100">
              Sarees
            </h1>
            <p className="font-sans text-teal-200 text-sm mt-2">
              Silk, Cotton, Banarasi & More
            </p>
          </div>
        </div>
      </section>

      {/* Virtual Try-On CTA */}
      <section className="bg-teal-50 border-b border-teal-100 py-4">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col sm:flex-row items-center justify-between gap-3">
          <div className="flex items-center gap-3">
            <Sparkles className="w-5 h-5 text-teal-600" />
            <div>
              <p className="font-display text-teal-800 text-base">
                Not sure which saree suits you?
              </p>
              <p className="font-sans text-xs text-teal-500">
                Try our AI-powered suitability checker
              </p>
            </div>
          </div>
          <Dialog open={tryOnOpen} onOpenChange={setTryOnOpen}>
            <DialogTrigger asChild>
              <Button className="bg-teal-700 hover:bg-teal-600 text-champagne-200 font-sans text-xs tracking-widest uppercase rounded-sm border-0 shrink-0">
                Virtual Try-On <ArrowRight className="w-3.5 h-3.5 ml-1.5" />
              </Button>
            </DialogTrigger>
            <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
              <DialogHeader>
                <DialogTitle className="font-serif text-teal-800">
                  Virtual Try-On
                </DialogTitle>
              </DialogHeader>
              <VirtualTryOn allSarees={sarees ?? []} />
            </DialogContent>
          </Dialog>
        </div>
      </section>

      {/* Filters */}
      <section className="bg-white border-b border-border sticky top-16 z-30">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          {/* Main filter bar */}
          <div className="flex flex-wrap gap-3 items-center py-3">
            {/* Search */}
            <div className="relative flex-1 min-w-[180px] max-w-xs">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-muted-foreground" />
              <input
                type="text"
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                placeholder="Search sarees..."
                className="w-full pl-8 pr-3 py-2 text-sm border border-border rounded bg-background text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-1 focus:ring-teal-400 focus:border-teal-400"
              />
            </div>

            {/* Sort */}
            <div className="flex items-center gap-2">
              <SlidersHorizontal className="w-3.5 h-3.5 text-muted-foreground" />
              <select
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value)}
                className="text-sm border border-border rounded px-3 py-2 bg-background text-foreground focus:outline-none focus:ring-1 focus:ring-teal-400"
              >
                <option value="default">Sort: Default</option>
                <option value="price-asc">Price: Low to High</option>
                <option value="price-desc">Price: High to Low</option>
                <option value="name">Name: A-Z</option>
              </select>
            </div>

            {/* Price filter */}
            <div className="flex items-center gap-2 text-sm font-sans text-muted-foreground">
              <span>Max: ₹{maxPrice.toLocaleString("en-IN")}</span>
              <input
                type="range"
                min={500}
                max={50000}
                step={500}
                value={maxPrice}
                onChange={(e) => setMaxPrice(Number(e.target.value))}
                className="w-24 accent-teal-600"
              />
            </div>

            <span className="text-xs text-muted-foreground font-sans ml-auto">
              {filtered.length} product{filtered.length !== 1 ? "s" : ""}
            </span>
          </div>

          {/* Sub-category pill row */}
          <div className="pb-3 overflow-x-auto flex gap-2 scrollbar-hide">
            {SUB_CATEGORIES.map((cat) => (
              <button
                key={cat}
                type="button"
                data-ocid="sarees.subcategory.tab"
                onClick={() => setSubCategory(cat)}
                className={`shrink-0 px-4 py-1.5 rounded-full text-xs font-sans font-medium border transition-all duration-150 whitespace-nowrap ${
                  subCategory === cat
                    ? "bg-teal-700 text-white border-teal-700 shadow-sm"
                    : "bg-white text-teal-700 border-teal-300 hover:border-teal-500 hover:bg-teal-50"
                }`}
              >
                {cat}
              </button>
            ))}
          </div>
        </div>
      </section>

      {/* Products */}
      <section className="py-10 bg-sand-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          {isLoading ? (
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
              {Array.from({ length: 8 }, (_, i) => i).map((i) => (
                <div key={i} className="space-y-2">
                  <Skeleton className="aspect-[3/4] rounded-lg" />
                  <Skeleton className="h-4 w-3/4" />
                  <Skeleton className="h-4 w-1/2" />
                </div>
              ))}
            </div>
          ) : filtered.length > 0 ? (
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
              {filtered.map((product) => (
                <ProductCard key={product.id.toString()} product={product} />
              ))}
            </div>
          ) : (
            <div className="text-center py-20">
              <Sparkles className="w-12 h-12 text-teal-200 mx-auto mb-4" />
              <p className="font-display text-xl text-teal-700 mb-2">
                No sarees found
              </p>
              <p className="font-sans text-sm text-muted-foreground">
                Try adjusting your search or filters
              </p>
            </div>
          )}
        </div>
      </section>
    </main>
  );
}

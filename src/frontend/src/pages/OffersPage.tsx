import ProductCard from "@/components/ProductCard";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { useGetOnOfferProducts } from "@/hooks/useQueries";
import { useNavigate } from "@tanstack/react-router";
import { ArrowRight, Sparkles, Tag } from "lucide-react";

export default function OffersPage() {
  const navigate = useNavigate();
  const { data: offerProducts, isLoading } = useGetOnOfferProducts();

  return (
    <main>
      {/* Banner */}
      <section className="relative bg-teal-800 py-16 overflow-hidden">
        <div className="absolute inset-0 opacity-10">
          <div className="absolute top-4 left-8 w-32 h-32 rounded-full bg-champagne-400" />
          <div className="absolute bottom-4 right-12 w-48 h-48 rounded-full bg-teal-400" />
          <div className="absolute top-1/2 left-1/3 w-20 h-20 rounded-full bg-champagne-300" />
        </div>
        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <div className="inline-flex items-center gap-2 bg-champagne-500/20 border border-champagne-400/40 rounded-full px-4 py-1.5 mb-4">
            <Tag className="w-3.5 h-3.5 text-champagne-400" />
            <span className="font-sans text-xs text-champagne-300 tracking-widest uppercase">
              Limited Time
            </span>
          </div>
          <h1 className="font-serif text-4xl md:text-5xl text-champagne-100 mb-3">
            Special Offers
          </h1>
          <p className="font-sans text-teal-300 text-base max-w-md mx-auto">
            Exclusive deals on our finest collections. Don't miss out!
          </p>
        </div>
      </section>

      {/* Products */}
      <section className="py-12 bg-sand-50">
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
          ) : offerProducts && offerProducts.length > 0 ? (
            <>
              <div className="flex items-center justify-between mb-6">
                <p className="font-sans text-sm text-muted-foreground">
                  {offerProducts.length} offer
                  {offerProducts.length !== 1 ? "s" : ""} available
                </p>
              </div>
              <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
                {offerProducts.map((product) => (
                  <ProductCard key={product.id.toString()} product={product} />
                ))}
              </div>
            </>
          ) : (
            <div className="text-center py-20">
              <Sparkles className="w-12 h-12 text-teal-200 mx-auto mb-4" />
              <p className="font-display text-xl text-teal-700 mb-2">
                No offers right now
              </p>
              <p className="font-sans text-sm text-muted-foreground mb-6">
                Check back soon for exclusive deals and discounts!
              </p>
              <Button
                onClick={() => navigate({ to: "/" })}
                className="bg-teal-700 hover:bg-teal-600 text-champagne-200 font-sans tracking-widest uppercase text-sm rounded-sm border-0"
              >
                Browse All Products <ArrowRight className="w-4 h-4 ml-2" />
              </Button>
            </div>
          )}
        </div>
      </section>
    </main>
  );
}

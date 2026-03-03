import { Category } from "@/backend";
import SuitabilityChecker from "@/components/SuitabilityChecker";
import VirtualTryOn from "@/components/VirtualTryOn";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useCart } from "@/contexts/CartContext";
import { useGetProduct, useGetProductsByCategory } from "@/hooks/useQueries";
import { useNavigate, useParams } from "@tanstack/react-router";
import {
  ArrowLeft,
  CheckCircle,
  Package,
  ShoppingBag,
  Star,
  Tag,
} from "lucide-react";

export default function ProductDetailPage() {
  const { id } = useParams({ from: "/product/$id" });
  const navigate = useNavigate();
  const { addToCart } = useCart();

  const productId = BigInt(id);
  const { data: product, isLoading } = useGetProduct(productId);
  const { data: sarees } = useGetProductsByCategory(Category.saree);

  if (isLoading) {
    return (
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-10">
          <Skeleton className="aspect-[3/4] rounded-lg" />
          <div className="space-y-4">
            <Skeleton className="h-8 w-3/4" />
            <Skeleton className="h-6 w-1/3" />
            <Skeleton className="h-24 w-full" />
            <Skeleton className="h-10 w-full" />
          </div>
        </div>
      </main>
    );
  }

  if (!product) {
    return (
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20 text-center">
        <Package className="w-16 h-16 text-teal-200 mx-auto mb-4" />
        <h2 className="font-serif text-2xl text-teal-800 mb-2">
          Product not found
        </h2>
        <Button
          onClick={() => navigate({ to: "/" })}
          className="bg-teal-700 hover:bg-teal-600 text-champagne-200 font-sans tracking-wider uppercase text-sm rounded-sm border-0 mt-4"
        >
          <ArrowLeft className="w-4 h-4 mr-2" /> Back to Home
        </Button>
      </main>
    );
  }

  const isSaree = product.category === Category.saree;
  const inStock = Number(product.stockQuantity) > 0;

  return (
    <main className="bg-sand-50 min-h-screen">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Back button */}
        <button
          type="button"
          onClick={() => navigate({ to: -1 as any })}
          className="flex items-center gap-1.5 text-sm text-teal-600 hover:text-teal-800 font-sans mb-6 transition-colors"
        >
          <ArrowLeft className="w-4 h-4" /> Back
        </button>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-10 bg-white rounded-xl p-6 shadow-sm border border-teal-50">
          {/* Image — eager load since it's the LCP element */}
          <div className="relative">
            <div className="aspect-[3/4] rounded-lg overflow-hidden bg-sand-100">
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
                <div className="w-full h-full flex items-center justify-center">
                  <ShoppingBag className="w-20 h-20 text-teal-200" />
                </div>
              )}
            </div>
            {/* Badges */}
            <div className="absolute top-3 left-3 flex flex-col gap-1.5">
              {product.isNewArrival && (
                <Badge className="bg-teal-600 text-white font-sans text-xs tracking-wider rounded-sm">
                  <Star className="w-2.5 h-2.5 mr-1" /> New Arrival
                </Badge>
              )}
              {product.isOnOffer && (
                <Badge className="bg-champagne-500 text-teal-900 font-sans text-xs tracking-wider rounded-sm">
                  <Tag className="w-2.5 h-2.5 mr-1" /> On Sale
                </Badge>
              )}
            </div>
          </div>

          {/* Details */}
          <div className="flex flex-col">
            <h1 className="font-serif text-3xl md:text-4xl text-teal-800 mb-2">
              {product.name}
            </h1>

            <div className="flex items-center gap-3 mb-4">
              <span className="font-serif text-3xl font-semibold text-teal-700">
                ₹{Number(product.price).toLocaleString("en-IN")}
              </span>
              {product.isOnOffer && product.offerDetails && (
                <span className="text-sm text-champagne-600 font-sans bg-champagne-100 px-2 py-0.5 rounded">
                  {product.offerDetails}
                </span>
              )}
            </div>

            <p className="font-sans text-muted-foreground leading-relaxed mb-6">
              {product.description}
            </p>

            {/* Stock */}
            <div className="flex items-center gap-2 mb-6">
              {inStock ? (
                <>
                  <CheckCircle className="w-4 h-4 text-teal-600" />
                  <span className="text-sm font-sans text-teal-700">
                    In Stock ({Number(product.stockQuantity)} available)
                  </span>
                </>
              ) : (
                <>
                  <Package className="w-4 h-4 text-destructive" />
                  <span className="text-sm font-sans text-destructive">
                    Out of Stock
                  </span>
                </>
              )}
            </div>

            <Button
              onClick={() => addToCart(product)}
              disabled={!inStock}
              className="w-full bg-teal-700 hover:bg-teal-600 text-champagne-200 font-sans tracking-widest uppercase rounded-sm border-0 py-6 text-sm disabled:opacity-50"
            >
              <ShoppingBag className="w-4 h-4 mr-2" />
              {inStock ? "Add to Cart" : "Out of Stock"}
            </Button>

            <p className="text-xs text-muted-foreground font-sans text-center mt-3">
              Free shipping on orders above ₹2,999
            </p>
          </div>
        </div>

        {/* Tabs for saree features */}
        {isSaree && (
          <div className="mt-8">
            <Tabs defaultValue="suitability">
              <TabsList className="bg-teal-50 border border-teal-100 rounded-lg p-1">
                <TabsTrigger
                  value="suitability"
                  className="font-sans text-sm data-[state=active]:bg-teal-700 data-[state=active]:text-champagne-200 rounded"
                >
                  Suitability Checker
                </TabsTrigger>
                <TabsTrigger
                  value="tryon"
                  className="font-sans text-sm data-[state=active]:bg-teal-700 data-[state=active]:text-champagne-200 rounded"
                >
                  Virtual Try-On
                </TabsTrigger>
              </TabsList>
              <TabsContent value="suitability" className="mt-4">
                <div className="bg-white rounded-xl p-6 border border-teal-50 shadow-sm">
                  <SuitabilityChecker product={product} />
                </div>
              </TabsContent>
              <TabsContent value="tryon" className="mt-4">
                <div className="bg-white rounded-xl p-6 border border-teal-50 shadow-sm">
                  <VirtualTryOn product={product} allSarees={sarees ?? []} />
                </div>
              </TabsContent>
            </Tabs>
          </div>
        )}
      </div>
    </main>
  );
}

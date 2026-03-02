import { useNavigate } from '@tanstack/react-router';
import { ArrowRight, Sparkles, Star, Tag } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import ProductCard from '@/components/ProductCard';
import { useGetNewArrivals, useGetOnOfferProducts } from '@/hooks/useQueries';
import { Skeleton } from '@/components/ui/skeleton';

export default function HomePage() {
  const navigate = useNavigate();
  const { data: newArrivals, isLoading: loadingNew } = useGetNewArrivals();
  const { data: offerProducts, isLoading: loadingOffers } = useGetOnOfferProducts();

  const categories = [
    {
      name: 'Sarees',
      path: '/sarees',
      image: '/assets/generated/saree-category.dim_600x400.png',
      description: 'Silk, Cotton & More',
    },
    {
      name: 'Jewelry',
      path: '/jewelry',
      image: '/assets/generated/jewelry-category.dim_600x400.png',
      description: 'Gold, Silver & Gems',
    },
    {
      name: 'Handbags',
      path: '/handbags',
      image: '/assets/generated/handbag-category.dim_600x400.png',
      description: 'Clutches & Totes',
    },
  ];

  return (
    <main>
      {/* Hero Banner */}
      <section className="relative h-[520px] md:h-[600px] overflow-hidden">
        <img
          src="/assets/generated/saree-hero-banner.dim_1400x600.png"
          alt="New Collection 2026"
          className="w-full h-full object-cover"
        />
        <div className="absolute inset-0 bg-gradient-to-r from-teal-900/80 via-teal-900/40 to-transparent" />
        <div className="absolute inset-0 flex items-center">
          <div className="max-w-7xl mx-auto px-6 sm:px-10 lg:px-16 w-full">
            <div className="max-w-lg">
              <Badge className="bg-champagne-500/20 text-champagne-300 border border-champagne-400/40 font-sans text-xs tracking-widest uppercase mb-4">
                New Collection 2026
              </Badge>
              <h1 className="font-serif text-4xl md:text-5xl lg:text-6xl text-champagne-100 leading-tight mb-4">
                Timeless<br />
                <span className="text-champagne-400 italic">Elegance</span>
              </h1>
              <p className="font-sans text-teal-200 text-base md:text-lg mb-8 leading-relaxed">
                Discover handpicked sarees, jewelry, and accessories crafted for the modern woman.
              </p>
              <div className="flex flex-wrap gap-3">
                <Button
                  onClick={() => navigate({ to: '/sarees' })}
                  className="bg-champagne-500 hover:bg-champagne-400 text-teal-900 font-sans tracking-widest uppercase text-sm rounded-sm border-0 px-6"
                >
                  Shop Sarees
                  <ArrowRight className="w-4 h-4 ml-2" />
                </Button>
                <Button
                  onClick={() => navigate({ to: '/offers' })}
                  variant="outline"
                  className="border-champagne-400/60 text-champagne-300 hover:bg-champagne-400/10 font-sans tracking-widest uppercase text-sm rounded-sm"
                >
                  View Offers
                </Button>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Categories */}
      <section className="py-16 bg-sand-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-10">
            <h2 className="font-serif text-3xl md:text-4xl text-teal-800 mb-2">Shop by Category</h2>
            <p className="font-sans text-muted-foreground text-sm tracking-wider">Explore our curated collections</p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {categories.map((cat) => (
              <button
                key={cat.path}
                onClick={() => navigate({ to: cat.path })}
                className="group relative overflow-hidden rounded-lg aspect-[4/3] shadow-md hover:shadow-xl transition-all duration-300"
              >
                <img
                  src={cat.image}
                  alt={cat.name}
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-teal-900/80 via-teal-900/20 to-transparent" />
                <div className="absolute bottom-0 left-0 right-0 p-5 text-left">
                  <h3 className="font-serif text-2xl text-champagne-200 mb-0.5">{cat.name}</h3>
                  <p className="font-sans text-xs text-teal-200 tracking-wider uppercase">{cat.description}</p>
                  <span className="inline-flex items-center gap-1 mt-2 text-xs text-champagne-400 font-sans group-hover:gap-2 transition-all">
                    Explore <ArrowRight className="w-3 h-3" />
                  </span>
                </div>
              </button>
            ))}
          </div>
        </div>
      </section>

      {/* New Arrivals */}
      <section className="py-16 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between mb-10">
            <div>
              <div className="flex items-center gap-2 mb-1">
                <Star className="w-4 h-4 text-champagne-500" />
                <span className="font-sans text-xs text-champagne-600 tracking-widest uppercase">Just In</span>
              </div>
              <h2 className="font-serif text-3xl md:text-4xl text-teal-800">New Arrivals</h2>
            </div>
            <Button
              variant="outline"
              onClick={() => navigate({ to: '/sarees' })}
              className="hidden sm:flex border-teal-200 text-teal-700 hover:bg-teal-50 font-sans text-xs tracking-wider uppercase rounded-sm"
            >
              View All <ArrowRight className="w-3.5 h-3.5 ml-1" />
            </Button>
          </div>

          {loadingNew ? (
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              {Array.from({ length: 4 }).map((_, i) => (
                <div key={i} className="space-y-2">
                  <Skeleton className="aspect-[3/4] rounded-lg" />
                  <Skeleton className="h-4 w-3/4" />
                  <Skeleton className="h-4 w-1/2" />
                </div>
              ))}
            </div>
          ) : newArrivals && newArrivals.length > 0 ? (
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              {newArrivals.slice(0, 4).map((product) => (
                <ProductCard key={product.id.toString()} product={product} />
              ))}
            </div>
          ) : (
            <div className="text-center py-12 text-muted-foreground font-sans">
              <Sparkles className="w-10 h-10 text-teal-200 mx-auto mb-3" />
              <p>New arrivals coming soon!</p>
            </div>
          )}
        </div>
      </section>

      {/* Offers Banner */}
      <section className="py-12 bg-teal-800">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <Tag className="w-8 h-8 text-champagne-400 mx-auto mb-3" />
          <h2 className="font-serif text-3xl md:text-4xl text-champagne-200 mb-3">Special Offers</h2>
          <p className="font-sans text-teal-300 text-sm mb-6 max-w-md mx-auto">
            Exclusive deals on our finest collections. Limited time only.
          </p>
          <Button
            onClick={() => navigate({ to: '/offers' })}
            className="bg-champagne-500 hover:bg-champagne-400 text-teal-900 font-sans tracking-widest uppercase text-sm rounded-sm border-0 px-8"
          >
            Shop Offers <ArrowRight className="w-4 h-4 ml-2" />
          </Button>
        </div>
      </section>

      {/* On Offer Products */}
      {offerProducts && offerProducts.length > 0 && (
        <section className="py-16 bg-sand-50">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="flex items-center justify-between mb-10">
              <div>
                <div className="flex items-center gap-2 mb-1">
                  <Tag className="w-4 h-4 text-champagne-500" />
                  <span className="font-sans text-xs text-champagne-600 tracking-widest uppercase">Limited Time</span>
                </div>
                <h2 className="font-serif text-3xl md:text-4xl text-teal-800">On Sale</h2>
              </div>
              <Button
                variant="outline"
                onClick={() => navigate({ to: '/offers' })}
                className="hidden sm:flex border-teal-200 text-teal-700 hover:bg-teal-50 font-sans text-xs tracking-wider uppercase rounded-sm"
              >
                View All <ArrowRight className="w-3.5 h-3.5 ml-1" />
              </Button>
            </div>
            {loadingOffers ? (
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                {Array.from({ length: 4 }).map((_, i) => (
                  <div key={i} className="space-y-2">
                    <Skeleton className="aspect-[3/4] rounded-lg" />
                    <Skeleton className="h-4 w-3/4" />
                    <Skeleton className="h-4 w-1/2" />
                  </div>
                ))}
              </div>
            ) : (
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                {offerProducts.slice(0, 4).map((product) => (
                  <ProductCard key={product.id.toString()} product={product} />
                ))}
              </div>
            )}
          </div>
        </section>
      )}

      {/* Virtual Try-On CTA */}
      <section className="py-16 bg-white">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <Sparkles className="w-10 h-10 text-teal-600 mx-auto mb-4" />
          <h2 className="font-serif text-3xl md:text-4xl text-teal-800 mb-3">Virtual Try-On</h2>
          <p className="font-sans text-muted-foreground text-base mb-6 max-w-lg mx-auto">
            Not sure which saree suits you? Use our AI-powered suitability checker to find your perfect match.
          </p>
          <Button
            onClick={() => navigate({ to: '/sarees' })}
            className="bg-teal-700 hover:bg-teal-600 text-champagne-200 font-sans tracking-widest uppercase text-sm rounded-sm border-0 px-8"
          >
            Try It Now <ArrowRight className="w-4 h-4 ml-2" />
          </Button>
        </div>
      </section>
    </main>
  );
}

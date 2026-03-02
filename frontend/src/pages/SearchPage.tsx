import { useSearch, useNavigate } from '@tanstack/react-router';
import { Search, ArrowLeft, Package } from 'lucide-react';
import { Button } from '@/components/ui/button';
import ProductCard from '@/components/ProductCard';
import { useSearchProducts } from '@/hooks/useQueries';
import { Skeleton } from '@/components/ui/skeleton';

export default function SearchPage() {
  const { q } = useSearch({ from: '/search' });
  const navigate = useNavigate();
  const { data: results, isLoading } = useSearchProducts(q ?? '');

  return (
    <main className="bg-sand-50 min-h-screen">
      {/* Header */}
      <section className="bg-teal-800 py-10">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <button
            onClick={() => navigate({ to: '/' })}
            className="flex items-center gap-1.5 text-sm text-teal-300 hover:text-champagne-300 font-sans mb-4 transition-colors"
          >
            <ArrowLeft className="w-4 h-4" /> Back to Home
          </button>
          <div className="flex items-center gap-3">
            <Search className="w-6 h-6 text-champagne-400" />
            <div>
              <h1 className="font-serif text-3xl text-champagne-100">Search Results</h1>
              {q && (
                <p className="font-sans text-sm text-teal-300 mt-0.5">
                  Results for "<span className="text-champagne-300">{q}</span>"
                </p>
              )}
            </div>
          </div>
        </div>
      </section>

      {/* Results */}
      <section className="py-10">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          {isLoading ? (
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
              {Array.from({ length: 8 }).map((_, i) => (
                <div key={i} className="space-y-2">
                  <Skeleton className="aspect-[3/4] rounded-lg" />
                  <Skeleton className="h-4 w-3/4" />
                  <Skeleton className="h-4 w-1/2" />
                </div>
              ))}
            </div>
          ) : results && results.length > 0 ? (
            <>
              <p className="font-sans text-sm text-muted-foreground mb-6">
                {results.length} result{results.length !== 1 ? 's' : ''} found
              </p>
              <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
                {results.map((product) => (
                  <ProductCard key={product.id.toString()} product={product} />
                ))}
              </div>
            </>
          ) : (
            <div className="text-center py-20">
              <Package className="w-12 h-12 text-teal-200 mx-auto mb-4" />
              <p className="font-display text-xl text-teal-700 mb-2">No results found</p>
              <p className="font-sans text-sm text-muted-foreground mb-6">
                {q ? `No products match "${q}"` : 'Enter a search term to find products'}
              </p>
              <Button
                onClick={() => navigate({ to: '/' })}
                className="bg-teal-700 hover:bg-teal-600 text-champagne-200 font-sans tracking-widest uppercase text-sm rounded-sm border-0"
              >
                Browse All Products
              </Button>
            </div>
          )}
        </div>
      </section>
    </main>
  );
}

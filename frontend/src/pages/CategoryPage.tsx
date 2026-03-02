import { useState } from 'react';
import { Search, SlidersHorizontal, Package } from 'lucide-react';
import ProductCard from '@/components/ProductCard';
import { Category } from '@/backend';
import { useGetProductsByCategory } from '@/hooks/useQueries';
import { Skeleton } from '@/components/ui/skeleton';

interface CategoryPageProps {
  title: string;
  subtitle?: string;
  description?: string;
  bannerImage: string;
  category: Category;
}

export default function CategoryPage({
  title,
  subtitle,
  description,
  bannerImage,
  category,
}: CategoryPageProps) {
  const { data: products, isLoading } = useGetProductsByCategory(category);
  const [search, setSearch] = useState('');
  const [sortBy, setSortBy] = useState('default');
  const [maxPrice, setMaxPrice] = useState(50000);

  const filtered = (products ?? [])
    .filter((p) => {
      const matchSearch =
        p.name.toLowerCase().includes(search.toLowerCase()) ||
        p.description.toLowerCase().includes(search.toLowerCase());
      const matchPrice = Number(p.price) <= maxPrice;
      return matchSearch && matchPrice;
    })
    .sort((a, b) => {
      if (sortBy === 'price-asc') return Number(a.price) - Number(b.price);
      if (sortBy === 'price-desc') return Number(b.price) - Number(a.price);
      if (sortBy === 'name') return a.name.localeCompare(b.name);
      return 0;
    });

  const bannerSubtitle = subtitle ?? description ?? '';

  return (
    <main>
      {/* Banner */}
      <section className="relative h-56 md:h-72 overflow-hidden">
        <img src={bannerImage} alt={title} className="w-full h-full object-cover" />
        <div className="absolute inset-0 bg-gradient-to-r from-teal-900/80 to-teal-900/30" />
        <div className="absolute inset-0 flex items-center">
          <div className="max-w-7xl mx-auto px-6 sm:px-10 lg:px-16 w-full">
            <p className="font-sans text-xs text-champagne-400 tracking-widest uppercase mb-2">Collections</p>
            <h1 className="font-serif text-4xl md:text-5xl text-champagne-100">{title}</h1>
            {bannerSubtitle && (
              <p className="font-sans text-teal-200 text-sm mt-2">{bannerSubtitle}</p>
            )}
          </div>
        </div>
      </section>

      {/* Filters */}
      <section className="bg-white border-b border-border py-4 sticky top-16 z-30">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-wrap gap-3 items-center">
            <div className="relative flex-1 min-w-[180px] max-w-xs">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-muted-foreground" />
              <input
                type="text"
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                placeholder={`Search ${title.toLowerCase()}...`}
                className="w-full pl-8 pr-3 py-2 text-sm border border-border rounded bg-background text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-1 focus:ring-teal-400 focus:border-teal-400"
              />
            </div>

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

            <div className="flex items-center gap-2 text-sm font-sans text-muted-foreground">
              <span>Max: ₹{maxPrice.toLocaleString('en-IN')}</span>
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
              {filtered.length} product{filtered.length !== 1 ? 's' : ''}
            </span>
          </div>
        </div>
      </section>

      {/* Products */}
      <section className="py-10 bg-sand-50">
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
          ) : filtered.length > 0 ? (
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
              {filtered.map((product) => (
                <ProductCard key={product.id.toString()} product={product} />
              ))}
            </div>
          ) : (
            <div className="text-center py-20">
              <Package className="w-12 h-12 text-teal-200 mx-auto mb-4" />
              <p className="font-display text-xl text-teal-700 mb-2">No products found</p>
              <p className="font-sans text-sm text-muted-foreground">Try adjusting your search or filters</p>
            </div>
          )}
        </div>
      </section>
    </main>
  );
}

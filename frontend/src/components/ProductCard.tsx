import { useNavigate } from '@tanstack/react-router';
import { ShoppingBag, Star, Tag } from 'lucide-react';
import { Product } from '@/backend';
import { useCart } from '@/contexts/CartContext';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';

interface ProductCardProps {
  product: Product;
}

export default function ProductCard({ product }: ProductCardProps) {
  const navigate = useNavigate();
  const { addToCart } = useCart();

  const handleAddToCart = (e: React.MouseEvent) => {
    e.stopPropagation();
    addToCart(product);
  };

  return (
    <div
      onClick={() => navigate({ to: '/product/$id', params: { id: product.id.toString() } })}
      className="group cursor-pointer bg-card border border-border rounded-lg overflow-hidden hover:shadow-xl transition-all duration-300 hover:-translate-y-1"
    >
      {/* Image */}
      <div className="relative aspect-[3/4] overflow-hidden bg-sand-100">
        {product.imageUrl ? (
          <img
            src={product.imageUrl}
            alt={product.name}
            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
          />
        ) : (
          <div className="w-full h-full flex items-center justify-center bg-teal-50">
            <ShoppingBag className="w-12 h-12 text-teal-200" />
          </div>
        )}

        {/* Badges */}
        <div className="absolute top-2 left-2 flex flex-col gap-1">
          {product.isNewArrival && (
            <Badge className="bg-teal-600 text-white text-xs px-2 py-0.5 rounded-sm font-sans tracking-wider">
              <Star className="w-2.5 h-2.5 mr-1" />
              New
            </Badge>
          )}
          {product.isOnOffer && (
            <Badge className="bg-champagne-500 text-teal-900 text-xs px-2 py-0.5 rounded-sm font-sans tracking-wider">
              <Tag className="w-2.5 h-2.5 mr-1" />
              Sale
            </Badge>
          )}
        </div>

        {/* Quick add overlay */}
        <div className="absolute inset-x-0 bottom-0 translate-y-full group-hover:translate-y-0 transition-transform duration-300">
          <Button
            onClick={handleAddToCart}
            className="w-full rounded-none bg-teal-700 hover:bg-teal-600 text-champagne-200 font-sans text-xs tracking-widest uppercase py-3 border-0"
          >
            <ShoppingBag className="w-3.5 h-3.5 mr-2" />
            Add to Cart
          </Button>
        </div>
      </div>

      {/* Info */}
      <div className="p-3">
        <h3 className="font-display text-base text-foreground group-hover:text-teal-700 transition-colors line-clamp-1">
          {product.name}
        </h3>
        <p className="text-xs text-muted-foreground font-sans mt-0.5 line-clamp-2">{product.description}</p>
        <div className="flex items-center justify-between mt-2">
          <span className="font-serif text-lg font-semibold text-teal-700">
            ₹{Number(product.price).toLocaleString('en-IN')}
          </span>
          {product.isOnOffer && product.offerDetails && (
            <span className="text-xs text-champagne-600 font-sans">{product.offerDetails}</span>
          )}
        </div>
        {Number(product.stockQuantity) === 0 && (
          <p className="text-xs text-destructive font-sans mt-1">Out of stock</p>
        )}
      </div>
    </div>
  );
}

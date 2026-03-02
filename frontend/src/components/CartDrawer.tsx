import { ShoppingBag, X, Plus, Minus, Trash2 } from 'lucide-react';
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetFooter,
} from '@/components/ui/sheet';
import { Button } from '@/components/ui/button';
import { Separator } from '@/components/ui/separator';
import { useCart } from '@/contexts/CartContext';

export default function CartDrawer() {
  const { items, isCartOpen, setIsCartOpen, updateQuantity, removeFromCart, subtotal } = useCart();

  return (
    <Sheet open={isCartOpen} onOpenChange={setIsCartOpen}>
      <SheetContent className="w-full sm:max-w-md flex flex-col bg-sand-50 border-l border-teal-100">
        <SheetHeader className="border-b border-teal-100 pb-4">
          <SheetTitle className="font-serif text-teal-800 flex items-center gap-2">
            <ShoppingBag className="w-5 h-5 text-champagne-500" />
            Your Cart
            {items.length > 0 && (
              <span className="text-sm font-sans text-muted-foreground">
                ({items.reduce((s, i) => s + i.quantity, 0)} items)
              </span>
            )}
          </SheetTitle>
        </SheetHeader>

        {/* Cart items */}
        <div className="flex-1 overflow-y-auto py-4 space-y-4">
          {items.length === 0 ? (
            <div className="flex flex-col items-center justify-center h-full text-center py-12">
              <ShoppingBag className="w-16 h-16 text-teal-200 mb-4" />
              <p className="font-display text-lg text-teal-700">Your cart is empty</p>
              <p className="text-sm text-muted-foreground font-sans mt-1">Add some beautiful pieces to get started</p>
            </div>
          ) : (
            items.map((item) => (
              <div key={item.product.id.toString()} className="flex gap-3 bg-white rounded-lg p-3 border border-teal-100 shadow-sm">
                {/* Image */}
                <div className="shrink-0 w-20 h-24 rounded overflow-hidden bg-sand-100">
                  {item.product.imageUrl ? (
                    <img
                      src={item.product.imageUrl}
                      alt={item.product.name}
                      className="w-full h-full object-cover"
                    />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center">
                      <ShoppingBag className="w-6 h-6 text-teal-200" />
                    </div>
                  )}
                </div>

                {/* Details */}
                <div className="flex-1 min-w-0">
                  <h4 className="font-display text-sm text-teal-800 line-clamp-2">{item.product.name}</h4>
                  <p className="font-serif text-base font-semibold text-teal-700 mt-1">
                    ₹{Number(item.product.price).toLocaleString('en-IN')}
                  </p>

                  <div className="flex items-center justify-between mt-2">
                    {/* Quantity */}
                    <div className="flex items-center gap-1 border border-teal-200 rounded">
                      <button
                        onClick={() => updateQuantity(item.product.id, item.quantity - 1)}
                        className="p-1 hover:bg-teal-50 text-teal-600 transition-colors"
                      >
                        <Minus className="w-3 h-3" />
                      </button>
                      <span className="px-2 text-sm font-sans text-teal-800 min-w-[1.5rem] text-center">
                        {item.quantity}
                      </span>
                      <button
                        onClick={() => updateQuantity(item.product.id, item.quantity + 1)}
                        className="p-1 hover:bg-teal-50 text-teal-600 transition-colors"
                      >
                        <Plus className="w-3 h-3" />
                      </button>
                    </div>

                    {/* Remove */}
                    <button
                      onClick={() => removeFromCart(item.product.id)}
                      className="p-1 text-teal-300 hover:text-destructive transition-colors"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              </div>
            ))
          )}
        </div>

        {/* Footer */}
        {items.length > 0 && (
          <SheetFooter className="border-t border-teal-100 pt-4 flex-col gap-3">
            <Separator className="bg-teal-100" />
            <div className="flex justify-between items-center w-full">
              <span className="font-display text-teal-700 text-lg">Subtotal</span>
              <span className="font-serif text-xl font-semibold text-teal-800">
                ₹{subtotal.toLocaleString('en-IN')}
              </span>
            </div>
            <p className="text-xs text-muted-foreground font-sans text-center">
              Shipping and taxes calculated at checkout
            </p>
            <Button className="w-full bg-teal-700 hover:bg-teal-600 text-champagne-200 font-sans tracking-widest uppercase rounded-sm border-0">
              Proceed to Checkout
            </Button>
            <Button
              variant="outline"
              onClick={() => setIsCartOpen(false)}
              className="w-full border-teal-200 text-teal-700 hover:bg-teal-50 font-sans tracking-wider uppercase rounded-sm text-xs"
            >
              Continue Shopping
            </Button>
          </SheetFooter>
        )}
      </SheetContent>
    </Sheet>
  );
}

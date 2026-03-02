import { useState } from 'react';
import { Plus, Trash2, Package, Loader2, ShieldCheck } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Checkbox } from '@/components/ui/checkbox';
import { Badge } from '@/components/ui/badge';
import { Skeleton } from '@/components/ui/skeleton';
import { useIsCallerAdmin, useGetAllProducts, useAddProduct, useDeleteProduct } from '@/hooks/useQueries';
import { Category, PartialProduct } from '@/backend';
import AccessDeniedScreen from '@/components/AccessDeniedScreen';

const defaultForm: PartialProduct = {
  name: '',
  category: Category.saree,
  price: BigInt(0),
  description: '',
  imageUrl: '',
  isNewArrival: false,
  isOnOffer: false,
  offerDetails: undefined,
  stockQuantity: BigInt(0),
};

export default function AdminPage() {
  const { data: isAdmin, isLoading: checkingAdmin } = useIsCallerAdmin();
  const { data: products, isLoading: loadingProducts } = useGetAllProducts();
  const addProduct = useAddProduct();
  const deleteProduct = useDeleteProduct();

  const [form, setForm] = useState<PartialProduct>(defaultForm);
  const [priceInput, setPriceInput] = useState('');
  const [stockInput, setStockInput] = useState('');

  if (checkingAdmin) {
    return (
      <main className="max-w-4xl mx-auto px-4 py-20 text-center">
        <Loader2 className="w-8 h-8 animate-spin text-teal-600 mx-auto" />
      </main>
    );
  }

  if (!isAdmin) {
    return <AccessDeniedScreen />;
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const product: PartialProduct = {
      ...form,
      price: BigInt(Math.round(parseFloat(priceInput) || 0)),
      stockQuantity: BigInt(Math.round(parseFloat(stockInput) || 0)),
    };
    await addProduct.mutateAsync(product);
    setForm(defaultForm);
    setPriceInput('');
    setStockInput('');
  };

  const handleDelete = async (id: bigint) => {
    if (confirm('Delete this product?')) {
      await deleteProduct.mutateAsync(id);
    }
  };

  const categoryLabel = (cat: Category) => {
    if (cat === Category.saree) return 'Saree';
    if (cat === Category.jewelry) return 'Jewelry';
    return 'Handbag';
  };

  return (
    <main className="bg-sand-50 min-h-screen py-10">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="flex items-center gap-3 mb-8">
          <ShieldCheck className="w-7 h-7 text-teal-600" />
          <div>
            <h1 className="font-serif text-3xl text-teal-800">Admin Dashboard</h1>
            <p className="font-sans text-sm text-muted-foreground">Manage your product catalogue</p>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-5 gap-8">
          {/* Add Product Form */}
          <div className="lg:col-span-2">
            <div className="bg-white rounded-xl border border-teal-100 shadow-sm p-6">
              <h2 className="font-display text-xl text-teal-800 mb-5 flex items-center gap-2">
                <Plus className="w-5 h-5 text-champagne-500" />
                Add New Product
              </h2>
              <form onSubmit={handleSubmit} className="space-y-4">
                <div>
                  <Label className="font-sans text-xs text-teal-700 uppercase tracking-wider">Product Name *</Label>
                  <Input
                    value={form.name}
                    onChange={(e) => setForm({ ...form, name: e.target.value })}
                    placeholder="e.g. Kanjivaram Silk Saree"
                    required
                    className="mt-1 border-teal-200 focus:ring-teal-400 focus:border-teal-400"
                  />
                </div>

                <div>
                  <Label className="font-sans text-xs text-teal-700 uppercase tracking-wider">Category *</Label>
                  <select
                    value={form.category as string}
                    onChange={(e) => setForm({ ...form, category: e.target.value as Category })}
                    className="mt-1 w-full text-sm border border-teal-200 rounded-md px-3 py-2 bg-white text-foreground focus:outline-none focus:ring-1 focus:ring-teal-400 focus:border-teal-400"
                  >
                    <option value={Category.saree}>Saree</option>
                    <option value={Category.jewelry}>Jewelry</option>
                    <option value={Category.handbag}>Handbag</option>
                  </select>
                </div>

                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <Label className="font-sans text-xs text-teal-700 uppercase tracking-wider">Price (₹) *</Label>
                    <Input
                      type="number"
                      value={priceInput}
                      onChange={(e) => setPriceInput(e.target.value)}
                      placeholder="0"
                      min="0"
                      required
                      className="mt-1 border-teal-200 focus:ring-teal-400 focus:border-teal-400"
                    />
                  </div>
                  <div>
                    <Label className="font-sans text-xs text-teal-700 uppercase tracking-wider">Stock *</Label>
                    <Input
                      type="number"
                      value={stockInput}
                      onChange={(e) => setStockInput(e.target.value)}
                      placeholder="0"
                      min="0"
                      required
                      className="mt-1 border-teal-200 focus:ring-teal-400 focus:border-teal-400"
                    />
                  </div>
                </div>

                <div>
                  <Label className="font-sans text-xs text-teal-700 uppercase tracking-wider">Description</Label>
                  <Textarea
                    value={form.description}
                    onChange={(e) => setForm({ ...form, description: e.target.value })}
                    placeholder="Describe the material, color, occasion..."
                    rows={3}
                    className="mt-1 border-teal-200 focus:ring-teal-400 focus:border-teal-400 resize-none"
                  />
                </div>

                <div>
                  <Label className="font-sans text-xs text-teal-700 uppercase tracking-wider">Image URL</Label>
                  <Input
                    value={form.imageUrl}
                    onChange={(e) => setForm({ ...form, imageUrl: e.target.value })}
                    placeholder="https://..."
                    className="mt-1 border-teal-200 focus:ring-teal-400 focus:border-teal-400"
                  />
                </div>

                <div className="flex gap-4">
                  <label className="flex items-center gap-2 cursor-pointer">
                    <Checkbox
                      checked={form.isNewArrival}
                      onCheckedChange={(v) => setForm({ ...form, isNewArrival: !!v })}
                      className="border-teal-300 data-[state=checked]:bg-teal-600 data-[state=checked]:border-teal-600"
                    />
                    <span className="text-sm font-sans text-teal-700">New Arrival</span>
                  </label>
                  <label className="flex items-center gap-2 cursor-pointer">
                    <Checkbox
                      checked={form.isOnOffer}
                      onCheckedChange={(v) => setForm({ ...form, isOnOffer: !!v })}
                      className="border-teal-300 data-[state=checked]:bg-teal-600 data-[state=checked]:border-teal-600"
                    />
                    <span className="text-sm font-sans text-teal-700">On Offer</span>
                  </label>
                </div>

                {form.isOnOffer && (
                  <div>
                    <Label className="font-sans text-xs text-teal-700 uppercase tracking-wider">Offer Details</Label>
                    <Input
                      value={form.offerDetails ?? ''}
                      onChange={(e) => setForm({ ...form, offerDetails: e.target.value || undefined })}
                      placeholder="e.g. 20% off, Buy 1 Get 1..."
                      className="mt-1 border-teal-200 focus:ring-teal-400 focus:border-teal-400"
                    />
                  </div>
                )}

                <Button
                  type="submit"
                  disabled={addProduct.isPending}
                  className="w-full bg-teal-700 hover:bg-teal-600 text-champagne-200 font-sans tracking-widest uppercase text-sm rounded-sm border-0"
                >
                  {addProduct.isPending ? (
                    <><Loader2 className="w-4 h-4 mr-2 animate-spin" /> Adding...</>
                  ) : (
                    <><Plus className="w-4 h-4 mr-2" /> Add Product</>
                  )}
                </Button>
              </form>
            </div>
          </div>

          {/* Products List */}
          <div className="lg:col-span-3">
            <div className="bg-white rounded-xl border border-teal-100 shadow-sm p-6">
              <h2 className="font-display text-xl text-teal-800 mb-5 flex items-center gap-2">
                <Package className="w-5 h-5 text-champagne-500" />
                All Products
                {products && (
                  <Badge className="bg-teal-100 text-teal-700 font-sans text-xs ml-1">
                    {products.length}
                  </Badge>
                )}
              </h2>

              {loadingProducts ? (
                <div className="space-y-3">
                  {Array.from({ length: 5 }).map((_, i) => (
                    <Skeleton key={i} className="h-16 rounded-lg" />
                  ))}
                </div>
              ) : products && products.length > 0 ? (
                <div className="space-y-2 max-h-[600px] overflow-y-auto pr-1">
                  {products.map((product) => (
                    <div
                      key={product.id.toString()}
                      className="flex items-center gap-3 p-3 rounded-lg border border-teal-50 hover:border-teal-200 hover:bg-teal-50/50 transition-colors"
                    >
                      {/* Image */}
                      <div className="shrink-0 w-12 h-14 rounded overflow-hidden bg-sand-100">
                        {product.imageUrl ? (
                          <img src={product.imageUrl} alt={product.name} className="w-full h-full object-cover" />
                        ) : (
                          <div className="w-full h-full flex items-center justify-center">
                            <Package className="w-5 h-5 text-teal-200" />
                          </div>
                        )}
                      </div>

                      {/* Info */}
                      <div className="flex-1 min-w-0">
                        <p className="font-display text-sm text-teal-800 truncate">{product.name}</p>
                        <div className="flex items-center gap-2 mt-0.5">
                          <span className="font-sans text-xs text-teal-600">
                            ₹{Number(product.price).toLocaleString('en-IN')}
                          </span>
                          <Badge variant="outline" className="text-xs font-sans border-teal-200 text-teal-600 py-0">
                            {categoryLabel(product.category)}
                          </Badge>
                          {product.isNewArrival && (
                            <Badge className="bg-teal-100 text-teal-700 text-xs font-sans py-0">New</Badge>
                          )}
                          {product.isOnOffer && (
                            <Badge className="bg-champagne-100 text-champagne-700 text-xs font-sans py-0">Sale</Badge>
                          )}
                        </div>
                      </div>

                      {/* Delete */}
                      <Button
                        variant="ghost"
                        size="icon"
                        onClick={() => handleDelete(product.id)}
                        disabled={deleteProduct.isPending}
                        className="shrink-0 text-teal-300 hover:text-destructive hover:bg-destructive/10 transition-colors"
                      >
                        {deleteProduct.isPending ? (
                          <Loader2 className="w-4 h-4 animate-spin" />
                        ) : (
                          <Trash2 className="w-4 h-4" />
                        )}
                      </Button>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="text-center py-12">
                  <Package className="w-12 h-12 text-teal-200 mx-auto mb-3" />
                  <p className="font-display text-teal-700">No products yet</p>
                  <p className="font-sans text-sm text-muted-foreground mt-1">Add your first product using the form</p>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </main>
  );
}

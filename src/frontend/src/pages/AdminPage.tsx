import { Category, type PartialProduct } from "@/backend";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Skeleton } from "@/components/ui/skeleton";
import { Textarea } from "@/components/ui/textarea";
import { useActor } from "@/hooks/useActor";
import {
  useAddProduct,
  useDeleteProduct,
  useGetAllProducts,
} from "@/hooks/useQueries";
import {
  Eye,
  EyeOff,
  ImagePlus,
  Loader2,
  Lock,
  Package,
  Plus,
  ShieldCheck,
  Trash2,
  Wifi,
  WifiOff,
} from "lucide-react";
import { useRef, useState } from "react";
import { toast } from "sonner";

// Simple local password for admin access — no blockchain auth required
const ADMIN_PASSWORD = "admin2024";

// Compress image aggressively: max 600px, JPEG 0.6 quality to stay well under ICP 1.5MB ingress limit
// Base64 encoded image must stay under ~1MB (raw bytes ~750KB)
async function compressImage(dataUrl: string): Promise<string> {
  return new Promise((resolve, reject) => {
    const img = new Image();
    img.onload = () => {
      const maxDim = 600;
      let { width, height } = img;
      if (width > maxDim || height > maxDim) {
        if (width > height) {
          height = Math.round((height * maxDim) / width);
          width = maxDim;
        } else {
          width = Math.round((width * maxDim) / height);
          height = maxDim;
        }
      }
      const canvas = document.createElement("canvas");
      canvas.width = width;
      canvas.height = height;
      const ctx = canvas.getContext("2d");
      if (!ctx) {
        reject(new Error("Canvas not available"));
        return;
      }
      ctx.drawImage(img, 0, 0, width, height);
      const result = canvas.toDataURL("image/jpeg", 0.6);
      // Safety check: if still > 900KB base64, compress more
      if (result.length > 900_000) {
        canvas.toBlob(
          (blob) => {
            if (!blob) {
              resolve(result);
              return;
            }
            const reader2 = new FileReader();
            reader2.onload = (e) => resolve(e.target?.result as string);
            reader2.readAsDataURL(blob);
          },
          "image/jpeg",
          0.4,
        );
      } else {
        resolve(result);
      }
    };
    img.onerror = () => reject(new Error("Failed to load image"));
    img.src = dataUrl;
  });
}

const defaultForm: PartialProduct = {
  name: "",
  category: Category.saree,
  price: BigInt(0),
  description: "",
  imageUrl: "",
  isNewArrival: false,
  isOnOffer: false,
  offerDetails: undefined,
  stockQuantity: BigInt(0),
};

function AdminLoginGate({ onUnlock }: { onUnlock: () => void }) {
  const [password, setPassword] = useState("");
  const [showPw, setShowPw] = useState(false);
  const [error, setError] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (password === ADMIN_PASSWORD) {
      onUnlock();
    } else {
      setError(true);
      setPassword("");
    }
  };

  return (
    <main className="min-h-screen bg-sand-50 flex items-center justify-center px-4">
      <div className="bg-white rounded-xl border border-teal-100 shadow-md p-8 w-full max-w-sm">
        <div className="flex flex-col items-center mb-6">
          <div className="w-14 h-14 rounded-full bg-teal-50 border-2 border-teal-100 flex items-center justify-center mb-3">
            <Lock className="w-7 h-7 text-teal-600" />
          </div>
          <h1 className="font-serif text-2xl text-teal-800">Admin Panel</h1>
          <p className="font-sans text-sm text-muted-foreground mt-1">
            Dali's Boutique — Owner Access
          </p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <Label className="font-sans text-xs text-teal-700 uppercase tracking-wider">
              Password
            </Label>
            <div className="relative mt-1">
              <Input
                type={showPw ? "text" : "password"}
                value={password}
                onChange={(e) => {
                  setPassword(e.target.value);
                  setError(false);
                }}
                placeholder="Enter admin password"
                required
                data-ocid="admin.input"
                className={`pr-10 border-teal-200 focus:ring-teal-400 focus:border-teal-400 ${error ? "border-red-400 focus:ring-red-400 focus:border-red-400" : ""}`}
              />
              <button
                type="button"
                onClick={() => setShowPw((v) => !v)}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-teal-400 hover:text-teal-600"
              >
                {showPw ? (
                  <EyeOff className="w-4 h-4" />
                ) : (
                  <Eye className="w-4 h-4" />
                )}
              </button>
            </div>
            {error && (
              <p
                data-ocid="admin.login.error_state"
                className="text-red-500 text-xs mt-1 font-sans"
              >
                Incorrect password. Please try again.
              </p>
            )}
          </div>

          <Button
            type="submit"
            data-ocid="admin.login.submit_button"
            className="w-full bg-teal-700 hover:bg-teal-600 text-champagne-200 font-sans tracking-widest uppercase text-sm rounded-sm border-0"
          >
            <Lock className="w-4 h-4 mr-2" /> Enter Admin Panel
          </Button>
        </form>

        <p className="text-center text-xs text-muted-foreground mt-4 font-sans">
          Owner access only
        </p>
      </div>
    </main>
  );
}

export default function AdminPage() {
  const [unlocked, setUnlocked] = useState(false);
  const { actor, isFetching: actorLoading } = useActor();
  const { data: products, isLoading: loadingProducts } = useGetAllProducts();
  const addProduct = useAddProduct();
  const deleteProduct = useDeleteProduct();
  const isConnected = !!actor && !actorLoading;

  const [form, setForm] = useState<PartialProduct>(defaultForm);
  const [priceInput, setPriceInput] = useState("");
  const [stockInput, setStockInput] = useState("");
  const [imagePreview, setImagePreview] = useState<string>("");
  const [uploadingImage, setUploadingImage] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  if (!unlocked) {
    return <AdminLoginGate onUnlock={() => setUnlocked(true)} />;
  }

  const handleImageFile = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    setUploadingImage(true);
    try {
      const reader = new FileReader();
      reader.onload = async (ev) => {
        try {
          const raw = ev.target?.result as string;
          const compressed = await compressImage(raw);
          setForm((prev) => ({ ...prev, imageUrl: compressed }));
          setImagePreview(compressed);
        } catch (err) {
          toast.error("Could not process image. Try a smaller photo.");
          console.error(err);
        } finally {
          setUploadingImage(false);
        }
      };
      reader.onerror = () => {
        toast.error("Failed to read image file.");
        setUploadingImage(false);
      };
      reader.readAsDataURL(file);
    } catch (_err) {
      toast.error("Image upload failed. Please try again.");
      setUploadingImage(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    // Wait for actor to be ready before submitting
    if (!isConnected) {
      toast.error(
        "Still connecting to the server. Please wait a moment and try again.",
      );
      return;
    }

    const finalImageUrl = imagePreview || form.imageUrl;
    const product: PartialProduct = {
      ...form,
      imageUrl: finalImageUrl,
      price: BigInt(Math.round(Number.parseFloat(priceInput) || 0)),
      stockQuantity: BigInt(Math.round(Number.parseFloat(stockInput) || 0)),
    };
    try {
      await addProduct.mutateAsync(product);
      toast.success(
        "Product added successfully! It will appear in the store shortly.",
      );
      setForm(defaultForm);
      setPriceInput("");
      setStockInput("");
      setImagePreview("");
      if (fileInputRef.current) fileInputRef.current.value = "";
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : String(err);
      if (
        msg.includes("size") ||
        msg.includes("large") ||
        msg.includes("limit")
      ) {
        toast.error(
          "Image is too large. Please use a smaller photo (under 1MB).",
        );
      } else if (
        msg.includes("Actor not available") ||
        msg.includes("connection") ||
        msg.includes("connect")
      ) {
        toast.error(
          "Connection not ready. Please wait a few seconds and try again.",
        );
      } else {
        toast.error(`Failed to add product: ${msg.slice(0, 100)}`);
      }
      console.error("addProduct error:", err);
    }
  };

  const handleDelete = async (id: bigint) => {
    if (confirm("Delete this product?")) {
      await deleteProduct.mutateAsync(id);
    }
  };

  const categoryLabel = (cat: Category) => {
    if (cat === Category.saree) return "Saree";
    if (cat === Category.jewelry) return "Jewelry";
    return "Handbag";
  };

  return (
    <main className="bg-sand-50 min-h-screen py-10">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="flex items-center gap-3 mb-8">
          <ShieldCheck className="w-7 h-7 text-teal-600" />
          <div>
            <h1 className="font-serif text-3xl text-teal-800">
              Admin Dashboard
            </h1>
            <p className="font-sans text-sm text-muted-foreground">
              Manage your product catalogue — Dali's Boutique
            </p>
          </div>
          {/* Connection status */}
          <div className="ml-auto flex items-center gap-3">
            <div
              data-ocid="admin.connection.status"
              className={`flex items-center gap-1.5 text-xs font-sans px-2.5 py-1 rounded-full border ${
                actorLoading
                  ? "bg-yellow-50 border-yellow-200 text-yellow-700"
                  : isConnected
                    ? "bg-teal-50 border-teal-200 text-teal-700"
                    : "bg-red-50 border-red-200 text-red-700"
              }`}
            >
              {actorLoading ? (
                <>
                  <Loader2 className="w-3 h-3 animate-spin" /> Connecting...
                </>
              ) : isConnected ? (
                <>
                  <Wifi className="w-3 h-3" /> Connected
                </>
              ) : (
                <>
                  <WifiOff className="w-3 h-3" /> Offline
                </>
              )}
            </div>
            <button
              type="button"
              onClick={() => setUnlocked(false)}
              className="text-xs font-sans text-teal-400 hover:text-teal-600 underline"
            >
              Lock
            </button>
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
                  <Label className="font-sans text-xs text-teal-700 uppercase tracking-wider">
                    Product Name *
                  </Label>
                  <Input
                    value={form.name}
                    onChange={(e) => setForm({ ...form, name: e.target.value })}
                    placeholder="e.g. Kanjivaram Silk Saree"
                    required
                    data-ocid="admin.product.name.input"
                    className="mt-1 border-teal-200 focus:ring-teal-400 focus:border-teal-400"
                  />
                </div>

                <div>
                  <Label className="font-sans text-xs text-teal-700 uppercase tracking-wider">
                    Category *
                  </Label>
                  <select
                    value={form.category as string}
                    onChange={(e) =>
                      setForm({ ...form, category: e.target.value as Category })
                    }
                    data-ocid="admin.product.category.select"
                    className="mt-1 w-full text-sm border border-teal-200 rounded-md px-3 py-2 bg-white text-foreground focus:outline-none focus:ring-1 focus:ring-teal-400 focus:border-teal-400"
                  >
                    <option value={Category.saree}>Saree</option>
                    <option value={Category.jewelry}>Jewelry</option>
                    <option value={Category.handbag}>Handbag</option>
                  </select>
                </div>

                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <Label className="font-sans text-xs text-teal-700 uppercase tracking-wider">
                      Price (₹) *
                    </Label>
                    <Input
                      type="number"
                      value={priceInput}
                      onChange={(e) => setPriceInput(e.target.value)}
                      placeholder="0"
                      min="0"
                      required
                      data-ocid="admin.product.price.input"
                      className="mt-1 border-teal-200 focus:ring-teal-400 focus:border-teal-400"
                    />
                  </div>
                  <div>
                    <Label className="font-sans text-xs text-teal-700 uppercase tracking-wider">
                      Stock *
                    </Label>
                    <Input
                      type="number"
                      value={stockInput}
                      onChange={(e) => setStockInput(e.target.value)}
                      placeholder="0"
                      min="0"
                      required
                      data-ocid="admin.product.stock.input"
                      className="mt-1 border-teal-200 focus:ring-teal-400 focus:border-teal-400"
                    />
                  </div>
                </div>

                <div>
                  <Label className="font-sans text-xs text-teal-700 uppercase tracking-wider">
                    Description
                  </Label>
                  <Textarea
                    value={form.description}
                    onChange={(e) =>
                      setForm({ ...form, description: e.target.value })
                    }
                    placeholder="Describe the material, color, occasion..."
                    rows={3}
                    data-ocid="admin.product.description.textarea"
                    className="mt-1 border-teal-200 focus:ring-teal-400 focus:border-teal-400 resize-none"
                  />
                </div>

                {/* Image Upload Section */}
                <div>
                  <Label className="font-sans text-xs text-teal-700 uppercase tracking-wider">
                    Product Image
                  </Label>

                  {/* File Upload Button */}
                  <div className="mt-1 space-y-2">
                    <input
                      ref={fileInputRef}
                      type="file"
                      accept="image/*"
                      onChange={handleImageFile}
                      className="hidden"
                      id="admin-image-file"
                    />
                    <label
                      htmlFor="admin-image-file"
                      data-ocid="admin.product.image.upload_button"
                      className="flex items-center justify-center gap-2 w-full cursor-pointer border-2 border-dashed border-teal-200 hover:border-teal-400 rounded-lg py-4 px-3 text-sm font-sans text-teal-600 hover:text-teal-800 hover:bg-teal-50/50 transition-all"
                    >
                      {uploadingImage ? (
                        <>
                          <Loader2 className="w-4 h-4 animate-spin" />
                          Loading image...
                        </>
                      ) : (
                        <>
                          <ImagePlus className="w-5 h-5" />
                          Upload photo from computer / phone
                        </>
                      )}
                    </label>

                    {/* Image Preview */}
                    {imagePreview && (
                      <div className="relative rounded-lg overflow-hidden border border-teal-100 aspect-[4/3] bg-sand-50">
                        <img
                          src={imagePreview}
                          alt="Preview"
                          className="w-full h-full object-cover object-center"
                          style={{ imageRendering: "auto" }}
                        />
                        <button
                          type="button"
                          onClick={() => {
                            setImagePreview("");
                            setForm((prev) => ({ ...prev, imageUrl: "" }));
                            if (fileInputRef.current)
                              fileInputRef.current.value = "";
                          }}
                          className="absolute top-2 right-2 bg-white/80 hover:bg-white rounded-full w-6 h-6 flex items-center justify-center text-teal-600 shadow text-xs font-bold"
                        >
                          ✕
                        </button>
                      </div>
                    )}

                    {/* OR paste URL */}
                    <div className="flex items-center gap-2">
                      <div className="flex-1 border-t border-teal-100" />
                      <span className="text-xs text-muted-foreground font-sans">
                        or paste image URL
                      </span>
                      <div className="flex-1 border-t border-teal-100" />
                    </div>
                    <Input
                      value={imagePreview ? "" : form.imageUrl}
                      onChange={(e) => {
                        setImagePreview("");
                        setForm((prev) => ({
                          ...prev,
                          imageUrl: e.target.value,
                        }));
                      }}
                      placeholder="https://..."
                      data-ocid="admin.product.imageurl.input"
                      className="border-teal-200 focus:ring-teal-400 focus:border-teal-400"
                      disabled={!!imagePreview}
                    />
                  </div>
                </div>

                <div className="flex gap-4">
                  <label
                    htmlFor="admin-new-arrival"
                    className="flex items-center gap-2 cursor-pointer"
                  >
                    <Checkbox
                      id="admin-new-arrival"
                      checked={form.isNewArrival}
                      onCheckedChange={(v) =>
                        setForm({ ...form, isNewArrival: !!v })
                      }
                      data-ocid="admin.product.newarrival.checkbox"
                      className="border-teal-300 data-[state=checked]:bg-teal-600 data-[state=checked]:border-teal-600"
                    />
                    <span className="text-sm font-sans text-teal-700">
                      New Arrival
                    </span>
                  </label>
                  <label
                    htmlFor="admin-on-offer"
                    className="flex items-center gap-2 cursor-pointer"
                  >
                    <Checkbox
                      id="admin-on-offer"
                      checked={form.isOnOffer}
                      onCheckedChange={(v) =>
                        setForm({ ...form, isOnOffer: !!v })
                      }
                      data-ocid="admin.product.onoffer.checkbox"
                      className="border-teal-300 data-[state=checked]:bg-teal-600 data-[state=checked]:border-teal-600"
                    />
                    <span className="text-sm font-sans text-teal-700">
                      On Offer
                    </span>
                  </label>
                </div>

                {form.isOnOffer && (
                  <div>
                    <Label className="font-sans text-xs text-teal-700 uppercase tracking-wider">
                      Offer Details
                    </Label>
                    <Input
                      value={form.offerDetails ?? ""}
                      onChange={(e) =>
                        setForm({
                          ...form,
                          offerDetails: e.target.value || undefined,
                        })
                      }
                      placeholder="e.g. 20% off, Buy 1 Get 1..."
                      data-ocid="admin.product.offerdetails.input"
                      className="mt-1 border-teal-200 focus:ring-teal-400 focus:border-teal-400"
                    />
                  </div>
                )}

                <Button
                  type="submit"
                  disabled={addProduct.isPending || !isConnected}
                  data-ocid="admin.product.submit_button"
                  className="w-full bg-teal-700 hover:bg-teal-600 text-champagne-200 font-sans tracking-widest uppercase text-sm rounded-sm border-0 disabled:opacity-60"
                >
                  {addProduct.isPending ? (
                    <>
                      <Loader2 className="w-4 h-4 mr-2 animate-spin" />{" "}
                      Adding...
                    </>
                  ) : actorLoading ? (
                    <>
                      <Loader2 className="w-4 h-4 mr-2 animate-spin" />{" "}
                      Connecting...
                    </>
                  ) : (
                    <>
                      <Plus className="w-4 h-4 mr-2" /> Add Product
                    </>
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
                  {Array.from({ length: 5 }, (_, i) => i).map((i) => (
                    <Skeleton key={i} className="h-16 rounded-lg" />
                  ))}
                </div>
              ) : products && products.length > 0 ? (
                <div
                  data-ocid="admin.products.list"
                  className="space-y-2 max-h-[600px] overflow-y-auto pr-1"
                >
                  {products.map((product, idx) => (
                    <div
                      key={product.id.toString()}
                      data-ocid={`admin.products.item.${idx + 1}`}
                      className="flex items-center gap-3 p-3 rounded-lg border border-teal-50 hover:border-teal-200 hover:bg-teal-50/50 transition-colors"
                    >
                      {/* Image */}
                      <div className="shrink-0 w-14 h-16 rounded overflow-hidden bg-sand-100 border border-teal-100">
                        {product.imageUrl ? (
                          <img
                            src={product.imageUrl}
                            alt={product.name}
                            loading="lazy"
                            decoding="async"
                            style={{ imageRendering: "auto" }}
                            className="w-full h-full object-cover object-center"
                          />
                        ) : (
                          <div className="w-full h-full flex items-center justify-center">
                            <Package className="w-5 h-5 text-teal-200" />
                          </div>
                        )}
                      </div>

                      {/* Info */}
                      <div className="flex-1 min-w-0">
                        <p className="font-display text-sm text-teal-800 truncate">
                          {product.name}
                        </p>
                        <div className="flex items-center gap-2 mt-0.5">
                          <span className="font-sans text-xs text-teal-600">
                            ₹{Number(product.price).toLocaleString("en-IN")}
                          </span>
                          <Badge
                            variant="outline"
                            className="text-xs font-sans border-teal-200 text-teal-600 py-0"
                          >
                            {categoryLabel(product.category)}
                          </Badge>
                          {product.isNewArrival && (
                            <Badge className="bg-teal-100 text-teal-700 text-xs font-sans py-0">
                              New
                            </Badge>
                          )}
                          {product.isOnOffer && (
                            <Badge className="bg-champagne-100 text-champagne-700 text-xs font-sans py-0">
                              Sale
                            </Badge>
                          )}
                        </div>
                      </div>

                      {/* Delete */}
                      <Button
                        variant="ghost"
                        size="icon"
                        onClick={() => handleDelete(product.id)}
                        disabled={deleteProduct.isPending}
                        data-ocid={`admin.products.delete_button.${idx + 1}`}
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
                <div
                  data-ocid="admin.products.empty_state"
                  className="text-center py-12"
                >
                  <Package className="w-12 h-12 text-teal-200 mx-auto mb-3" />
                  <p className="font-display text-teal-700">No products yet</p>
                  <p className="font-sans text-sm text-muted-foreground mt-1">
                    Add your first product using the form
                  </p>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </main>
  );
}

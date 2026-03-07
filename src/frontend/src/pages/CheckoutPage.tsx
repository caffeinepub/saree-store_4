import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Separator } from "@/components/ui/separator";
import { useCart } from "@/contexts/CartContext";
import { useNavigate } from "@tanstack/react-router";
import {
  CheckCircle,
  ChevronRight,
  CreditCard,
  Home,
  Lock,
  Package,
  ShoppingBag,
  Smartphone,
  Truck,
} from "lucide-react";
import { useState } from "react";

type Step = "address" | "payment" | "review" | "confirmed";

interface AddressForm {
  fullName: string;
  phone: string;
  email: string;
  addressLine1: string;
  addressLine2: string;
  city: string;
  state: string;
  pincode: string;
}

interface PaymentMethod {
  type: "upi" | "card" | "cod" | "netbanking";
  upiId?: string;
  cardNumber?: string;
  cardName?: string;
  cardExpiry?: string;
  cardCvv?: string;
}

const STATES = [
  "Andhra Pradesh",
  "Arunachal Pradesh",
  "Assam",
  "Bihar",
  "Chhattisgarh",
  "Goa",
  "Gujarat",
  "Haryana",
  "Himachal Pradesh",
  "Jharkhand",
  "Karnataka",
  "Kerala",
  "Madhya Pradesh",
  "Maharashtra",
  "Manipur",
  "Meghalaya",
  "Mizoram",
  "Nagaland",
  "Odisha",
  "Punjab",
  "Rajasthan",
  "Sikkim",
  "Tamil Nadu",
  "Telangana",
  "Tripura",
  "Uttar Pradesh",
  "Uttarakhand",
  "West Bengal",
  "Delhi",
  "Jammu & Kashmir",
];

export default function CheckoutPage() {
  const { items, subtotal, clearCart, setIsCartOpen } = useCart();
  const navigate = useNavigate();
  const [step, setStep] = useState<Step>("address");
  const [isPlacing, setIsPlacing] = useState(false);
  const [orderId] = useState(
    `DALI${Date.now().toString().slice(-8).toUpperCase()}`,
  );

  const [address, setAddress] = useState<AddressForm>({
    fullName: "",
    phone: "",
    email: "",
    addressLine1: "",
    addressLine2: "",
    city: "",
    state: "",
    pincode: "",
  });

  const [payment, setPayment] = useState<PaymentMethod>({ type: "upi" });

  const shipping = subtotal >= 2999 ? 0 : 99;
  const total = subtotal + shipping;

  const handleAddressSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setStep("payment");
  };

  const handlePaymentSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setStep("review");
  };

  const handlePlaceOrder = async () => {
    setIsPlacing(true);
    await new Promise((r) => setTimeout(r, 1800));
    clearCart();
    setIsCartOpen(false);
    setIsPlacing(false);
    setStep("confirmed");
  };

  const stepList: { id: Step; label: string }[] = [
    { id: "address", label: "Address" },
    { id: "payment", label: "Payment" },
    { id: "review", label: "Review" },
  ];

  const currentStepIndex = stepList.findIndex((s) => s.id === step);

  // ── Order Confirmed ──
  if (step === "confirmed") {
    return (
      <main
        className="min-h-screen bg-sand-50 flex items-center justify-center px-4"
        data-ocid="checkout.page"
      >
        <div className="bg-white rounded-2xl shadow-lg border border-teal-100 p-8 max-w-md w-full text-center">
          <div className="w-16 h-16 bg-teal-50 rounded-full flex items-center justify-center mx-auto mb-4">
            <CheckCircle className="w-9 h-9 text-teal-600" />
          </div>
          <h1 className="font-serif text-3xl text-teal-800 mb-2">
            Order Placed!
          </h1>
          <p className="font-sans text-muted-foreground text-sm mb-4">
            Thank you, {address.fullName}. Your order has been placed
            successfully.
          </p>
          <div className="bg-teal-50 rounded-xl p-4 mb-6 text-left space-y-2">
            <div className="flex justify-between text-sm font-sans">
              <span className="text-muted-foreground">Order ID</span>
              <span className="font-semibold text-teal-800">{orderId}</span>
            </div>
            <div className="flex justify-between text-sm font-sans">
              <span className="text-muted-foreground">Amount Paid</span>
              <span className="font-semibold text-teal-800">
                ₹{total.toLocaleString("en-IN")}
              </span>
            </div>
            <div className="flex justify-between text-sm font-sans">
              <span className="text-muted-foreground">Delivery to</span>
              <span className="font-semibold text-teal-800 text-right max-w-[60%]">
                {address.city}, {address.state}
              </span>
            </div>
            <div className="flex justify-between text-sm font-sans">
              <span className="text-muted-foreground">Est. Delivery</span>
              <span className="font-semibold text-teal-800">
                5-7 Business Days
              </span>
            </div>
          </div>
          <div className="flex items-center gap-2 text-xs font-sans text-muted-foreground justify-center mb-6">
            <Truck className="w-4 h-4 text-teal-500" />
            Tracking details will be sent to {address.email || address.phone}
          </div>
          <Button
            onClick={() => navigate({ to: "/" })}
            className="w-full bg-teal-700 hover:bg-teal-600 text-champagne-200 font-sans tracking-widest uppercase rounded-sm border-0"
            data-ocid="checkout.primary_button"
          >
            Continue Shopping
          </Button>
        </div>
      </main>
    );
  }

  return (
    <main
      className="min-h-screen bg-sand-50 py-8 px-4"
      data-ocid="checkout.page"
    >
      <div className="max-w-5xl mx-auto">
        {/* Breadcrumb */}
        <nav className="flex items-center gap-1.5 text-xs font-sans text-muted-foreground mb-6">
          <button
            type="button"
            onClick={() => navigate({ to: "/" })}
            className="hover:text-teal-700 transition-colors"
            data-ocid="checkout.breadcrumb.link"
          >
            Home
          </button>
          <ChevronRight className="w-3 h-3" />
          <button
            type="button"
            onClick={() => setIsCartOpen(true)}
            className="hover:text-teal-700 transition-colors"
            data-ocid="checkout.breadcrumb.link"
          >
            Cart
          </button>
          <ChevronRight className="w-3 h-3" />
          <span className="text-foreground font-medium">Checkout</span>
        </nav>

        {/* Progress Steps */}
        <div
          className="flex items-center justify-center gap-2 mb-8"
          data-ocid="checkout.steps.panel"
        >
          {stepList.map((s, i) => (
            <div key={s.id} className="flex items-center gap-2">
              <div
                className={`flex items-center gap-1.5 text-sm font-sans px-3 py-1.5 rounded-full transition-colors ${
                  i <= currentStepIndex
                    ? "bg-teal-700 text-champagne-200"
                    : "bg-white border border-teal-200 text-muted-foreground"
                }`}
              >
                <span className="font-semibold">{i + 1}</span>
                <span className="hidden sm:inline">{s.label}</span>
              </div>
              {i < stepList.length - 1 && (
                <ChevronRight
                  className={`w-4 h-4 ${
                    i < currentStepIndex ? "text-teal-500" : "text-teal-200"
                  }`}
                />
              )}
            </div>
          ))}
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* ── Left: Form ── */}
          <div className="lg:col-span-2">
            {/* STEP 1: ADDRESS */}
            {step === "address" && (
              <div className="bg-white rounded-2xl shadow-sm border border-teal-50 p-6">
                <div className="flex items-center gap-2 mb-5">
                  <Home className="w-5 h-5 text-teal-600" />
                  <h2 className="font-serif text-xl text-teal-800">
                    Delivery Address
                  </h2>
                </div>
                <form onSubmit={handleAddressSubmit} className="space-y-4">
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div>
                      <Label className="font-sans text-xs uppercase tracking-wider text-muted-foreground mb-1 block">
                        Full Name *
                      </Label>
                      <Input
                        required
                        placeholder="e.g. Priya Sharma"
                        value={address.fullName}
                        onChange={(e) =>
                          setAddress((p) => ({
                            ...p,
                            fullName: e.target.value,
                          }))
                        }
                        className="border-teal-200 focus:ring-teal-500"
                        data-ocid="checkout.fullname.input"
                      />
                    </div>
                    <div>
                      <Label className="font-sans text-xs uppercase tracking-wider text-muted-foreground mb-1 block">
                        Phone Number *
                      </Label>
                      <Input
                        required
                        type="tel"
                        placeholder="10-digit mobile number"
                        pattern="[0-9]{10}"
                        maxLength={10}
                        value={address.phone}
                        onChange={(e) =>
                          setAddress((p) => ({ ...p, phone: e.target.value }))
                        }
                        className="border-teal-200 focus:ring-teal-500"
                        data-ocid="checkout.phone.input"
                      />
                    </div>
                  </div>

                  <div>
                    <Label className="font-sans text-xs uppercase tracking-wider text-muted-foreground mb-1 block">
                      Email Address
                    </Label>
                    <Input
                      type="email"
                      placeholder="for order updates (optional)"
                      value={address.email}
                      onChange={(e) =>
                        setAddress((p) => ({ ...p, email: e.target.value }))
                      }
                      className="border-teal-200 focus:ring-teal-500"
                      data-ocid="checkout.email.input"
                    />
                  </div>

                  <div>
                    <Label className="font-sans text-xs uppercase tracking-wider text-muted-foreground mb-1 block">
                      Address Line 1 *
                    </Label>
                    <Input
                      required
                      placeholder="House / Flat No., Street, Area"
                      value={address.addressLine1}
                      onChange={(e) =>
                        setAddress((p) => ({
                          ...p,
                          addressLine1: e.target.value,
                        }))
                      }
                      className="border-teal-200 focus:ring-teal-500"
                      data-ocid="checkout.address1.input"
                    />
                  </div>

                  <div>
                    <Label className="font-sans text-xs uppercase tracking-wider text-muted-foreground mb-1 block">
                      Address Line 2
                    </Label>
                    <Input
                      placeholder="Landmark, Colony (optional)"
                      value={address.addressLine2}
                      onChange={(e) =>
                        setAddress((p) => ({
                          ...p,
                          addressLine2: e.target.value,
                        }))
                      }
                      className="border-teal-200 focus:ring-teal-500"
                      data-ocid="checkout.address2.input"
                    />
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                    <div>
                      <Label className="font-sans text-xs uppercase tracking-wider text-muted-foreground mb-1 block">
                        City *
                      </Label>
                      <Input
                        required
                        placeholder="City"
                        value={address.city}
                        onChange={(e) =>
                          setAddress((p) => ({ ...p, city: e.target.value }))
                        }
                        className="border-teal-200 focus:ring-teal-500"
                        data-ocid="checkout.city.input"
                      />
                    </div>
                    <div>
                      <Label className="font-sans text-xs uppercase tracking-wider text-muted-foreground mb-1 block">
                        State *
                      </Label>
                      <select
                        required
                        value={address.state}
                        onChange={(e) =>
                          setAddress((p) => ({ ...p, state: e.target.value }))
                        }
                        className="w-full h-10 px-3 rounded-md border border-teal-200 bg-background font-sans text-sm focus:outline-none focus:ring-2 focus:ring-teal-500"
                        data-ocid="checkout.state.select"
                      >
                        <option value="">Select</option>
                        {STATES.map((s) => (
                          <option key={s} value={s}>
                            {s}
                          </option>
                        ))}
                      </select>
                    </div>
                    <div>
                      <Label className="font-sans text-xs uppercase tracking-wider text-muted-foreground mb-1 block">
                        Pincode *
                      </Label>
                      <Input
                        required
                        placeholder="6-digit"
                        pattern="[0-9]{6}"
                        maxLength={6}
                        value={address.pincode}
                        onChange={(e) =>
                          setAddress((p) => ({
                            ...p,
                            pincode: e.target.value,
                          }))
                        }
                        className="border-teal-200 focus:ring-teal-500"
                        data-ocid="checkout.pincode.input"
                      />
                    </div>
                  </div>

                  <Button
                    type="submit"
                    className="w-full bg-teal-700 hover:bg-teal-600 text-champagne-200 font-sans tracking-widest uppercase rounded-sm border-0 py-5 mt-2"
                    data-ocid="checkout.address.submit_button"
                  >
                    Continue to Payment
                    <ChevronRight className="w-4 h-4 ml-2" />
                  </Button>
                </form>
              </div>
            )}

            {/* STEP 2: PAYMENT */}
            {step === "payment" && (
              <div className="bg-white rounded-2xl shadow-sm border border-teal-50 p-6">
                <div className="flex items-center gap-2 mb-5">
                  <Lock className="w-5 h-5 text-teal-600" />
                  <h2 className="font-serif text-xl text-teal-800">
                    Payment Method
                  </h2>
                  <span className="ml-auto text-xs font-sans text-teal-600 bg-teal-50 px-2 py-0.5 rounded">
                    100% Secure
                  </span>
                </div>

                <form onSubmit={handlePaymentSubmit} className="space-y-4">
                  {/* Payment Options */}
                  <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                    {(
                      [
                        { type: "upi", icon: Smartphone, label: "UPI" },
                        { type: "card", icon: CreditCard, label: "Card" },
                        {
                          type: "cod",
                          icon: Package,
                          label: "Cash on Delivery",
                        },
                        {
                          type: "netbanking",
                          icon: Home,
                          label: "Net Banking",
                        },
                      ] as const
                    ).map(({ type, icon: Icon, label }) => (
                      <button
                        key={type}
                        type="button"
                        onClick={() => setPayment({ type })}
                        className={`flex flex-col items-center justify-center gap-1.5 p-3 rounded-xl border-2 transition-all text-sm font-sans ${
                          payment.type === type
                            ? "border-teal-600 bg-teal-50 text-teal-800"
                            : "border-teal-100 bg-white text-muted-foreground hover:border-teal-300"
                        }`}
                        data-ocid={`checkout.${type}.toggle`}
                      >
                        <Icon className="w-5 h-5" />
                        <span className="text-xs text-center leading-tight">
                          {label}
                        </span>
                      </button>
                    ))}
                  </div>

                  {/* UPI */}
                  {payment.type === "upi" && (
                    <div>
                      <Label className="font-sans text-xs uppercase tracking-wider text-muted-foreground mb-1 block">
                        UPI ID *
                      </Label>
                      <Input
                        required
                        placeholder="yourname@upi or phone@paytm"
                        value={payment.upiId ?? ""}
                        onChange={(e) =>
                          setPayment((p) => ({ ...p, upiId: e.target.value }))
                        }
                        className="border-teal-200 focus:ring-teal-500"
                        data-ocid="checkout.upi.input"
                      />
                      <p className="text-xs text-muted-foreground mt-1">
                        Supports PhonePe, Google Pay, Paytm, BHIM
                      </p>
                    </div>
                  )}

                  {/* Card */}
                  {payment.type === "card" && (
                    <div className="space-y-3">
                      <div>
                        <Label className="font-sans text-xs uppercase tracking-wider text-muted-foreground mb-1 block">
                          Card Number *
                        </Label>
                        <Input
                          required
                          placeholder="1234 5678 9012 3456"
                          maxLength={19}
                          value={payment.cardNumber ?? ""}
                          onChange={(e) => {
                            const v = e.target.value
                              .replace(/\D/g, "")
                              .replace(/(\d{4})(?=\d)/g, "$1 ")
                              .slice(0, 19);
                            setPayment((p) => ({ ...p, cardNumber: v }));
                          }}
                          className="border-teal-200 focus:ring-teal-500"
                          data-ocid="checkout.card_number.input"
                        />
                      </div>
                      <div>
                        <Label className="font-sans text-xs uppercase tracking-wider text-muted-foreground mb-1 block">
                          Name on Card *
                        </Label>
                        <Input
                          required
                          placeholder="As printed on card"
                          value={payment.cardName ?? ""}
                          onChange={(e) =>
                            setPayment((p) => ({
                              ...p,
                              cardName: e.target.value,
                            }))
                          }
                          className="border-teal-200 focus:ring-teal-500"
                          data-ocid="checkout.card_name.input"
                        />
                      </div>
                      <div className="grid grid-cols-2 gap-3">
                        <div>
                          <Label className="font-sans text-xs uppercase tracking-wider text-muted-foreground mb-1 block">
                            Expiry (MM/YY) *
                          </Label>
                          <Input
                            required
                            placeholder="MM/YY"
                            maxLength={5}
                            value={payment.cardExpiry ?? ""}
                            onChange={(e) => {
                              const v = e.target.value
                                .replace(/\D/g, "")
                                .replace(/(\d{2})(?=\d)/, "$1/")
                                .slice(0, 5);
                              setPayment((p) => ({ ...p, cardExpiry: v }));
                            }}
                            className="border-teal-200 focus:ring-teal-500"
                            data-ocid="checkout.card_expiry.input"
                          />
                        </div>
                        <div>
                          <Label className="font-sans text-xs uppercase tracking-wider text-muted-foreground mb-1 block">
                            CVV *
                          </Label>
                          <Input
                            required
                            type="password"
                            placeholder="3 digits"
                            maxLength={3}
                            value={payment.cardCvv ?? ""}
                            onChange={(e) =>
                              setPayment((p) => ({
                                ...p,
                                cardCvv: e.target.value.replace(/\D/g, ""),
                              }))
                            }
                            className="border-teal-200 focus:ring-teal-500"
                            data-ocid="checkout.card_cvv.input"
                          />
                        </div>
                      </div>
                    </div>
                  )}

                  {/* COD */}
                  {payment.type === "cod" && (
                    <div className="bg-amber-50 border border-amber-200 rounded-xl p-4 flex items-start gap-3">
                      <Package className="w-5 h-5 text-amber-600 shrink-0 mt-0.5" />
                      <div>
                        <p className="text-sm font-sans font-semibold text-amber-800">
                          Pay ₹{total.toLocaleString("en-IN")} on delivery
                        </p>
                        <p className="text-xs text-amber-700 mt-0.5">
                          Keep exact change ready. Available across most pin
                          codes.
                        </p>
                      </div>
                    </div>
                  )}

                  {/* Net Banking */}
                  {payment.type === "netbanking" && (
                    <div className="grid grid-cols-3 gap-2">
                      {["SBI", "HDFC", "ICICI", "Axis", "Kotak", "Other"].map(
                        (bank) => (
                          <button
                            key={bank}
                            type="button"
                            className="py-2 px-3 text-sm font-sans border border-teal-200 rounded-lg hover:border-teal-500 hover:bg-teal-50 transition-colors"
                            data-ocid={"checkout.bank.toggle"}
                          >
                            {bank}
                          </button>
                        ),
                      )}
                    </div>
                  )}

                  <div className="flex gap-3 pt-2">
                    <Button
                      type="button"
                      variant="outline"
                      onClick={() => setStep("address")}
                      className="flex-1 border-teal-200 text-teal-700 hover:bg-teal-50 font-sans uppercase rounded-sm text-xs"
                      data-ocid="checkout.back.secondary_button"
                    >
                      Back
                    </Button>
                    <Button
                      type="submit"
                      className="flex-1 bg-teal-700 hover:bg-teal-600 text-champagne-200 font-sans tracking-widest uppercase rounded-sm border-0"
                      data-ocid="checkout.payment.submit_button"
                    >
                      Review Order
                      <ChevronRight className="w-4 h-4 ml-2" />
                    </Button>
                  </div>
                </form>
              </div>
            )}

            {/* STEP 3: REVIEW */}
            {step === "review" && (
              <div className="bg-white rounded-2xl shadow-sm border border-teal-50 p-6 space-y-5">
                <div className="flex items-center gap-2 mb-2">
                  <ShoppingBag className="w-5 h-5 text-teal-600" />
                  <h2 className="font-serif text-xl text-teal-800">
                    Review Your Order
                  </h2>
                </div>

                {/* Address Summary */}
                <div className="bg-teal-50 rounded-xl p-4">
                  <div className="flex justify-between items-start">
                    <div>
                      <p className="text-xs font-sans uppercase tracking-widest text-teal-600 mb-1">
                        Delivering to
                      </p>
                      <p className="text-sm font-sans font-semibold text-teal-800">
                        {address.fullName}
                      </p>
                      <p className="text-sm font-sans text-muted-foreground mt-0.5">
                        {address.addressLine1}
                        {address.addressLine2 && `, ${address.addressLine2}`}
                      </p>
                      <p className="text-sm font-sans text-muted-foreground">
                        {address.city}, {address.state} - {address.pincode}
                      </p>
                      <p className="text-sm font-sans text-muted-foreground">
                        {address.phone}
                      </p>
                    </div>
                    <button
                      type="button"
                      onClick={() => setStep("address")}
                      className="text-xs text-teal-600 hover:underline font-sans"
                      data-ocid="checkout.edit_address.secondary_button"
                    >
                      Edit
                    </button>
                  </div>
                </div>

                {/* Payment Summary */}
                <div className="bg-teal-50 rounded-xl p-4">
                  <div className="flex justify-between items-center">
                    <div>
                      <p className="text-xs font-sans uppercase tracking-widest text-teal-600 mb-1">
                        Payment
                      </p>
                      <p className="text-sm font-sans font-semibold text-teal-800 capitalize">
                        {payment.type === "upi"
                          ? `UPI — ${payment.upiId}`
                          : payment.type === "card"
                            ? `Card ending ****${(payment.cardNumber ?? "").replace(/\s/g, "").slice(-4)}`
                            : payment.type === "cod"
                              ? "Cash on Delivery"
                              : "Net Banking"}
                      </p>
                    </div>
                    <button
                      type="button"
                      onClick={() => setStep("payment")}
                      className="text-xs text-teal-600 hover:underline font-sans"
                      data-ocid="checkout.edit_payment.secondary_button"
                    >
                      Edit
                    </button>
                  </div>
                </div>

                {/* Items */}
                <div>
                  <p className="text-xs font-sans uppercase tracking-widest text-teal-600 mb-3">
                    Items ({items.reduce((s, i) => s + i.quantity, 0)})
                  </p>
                  <div className="space-y-3">
                    {items.map((item, idx) => (
                      <div
                        key={item.product.id.toString()}
                        className="flex gap-3 items-center"
                        data-ocid={`checkout.item.${idx + 1}`}
                      >
                        <div className="w-14 h-16 rounded overflow-hidden bg-sand-100 shrink-0">
                          {item.product.imageUrl ? (
                            <img
                              src={item.product.imageUrl}
                              alt={item.product.name}
                              className="w-full h-full object-cover"
                            />
                          ) : (
                            <div className="w-full h-full flex items-center justify-center">
                              <ShoppingBag className="w-5 h-5 text-teal-200" />
                            </div>
                          )}
                        </div>
                        <div className="flex-1 min-w-0">
                          <p className="text-sm font-sans font-medium text-teal-800 line-clamp-1">
                            {item.product.name}
                          </p>
                          <p className="text-xs text-muted-foreground">
                            Qty: {item.quantity}
                          </p>
                        </div>
                        <p className="text-sm font-serif font-semibold text-teal-700 shrink-0">
                          ₹
                          {(
                            Number(item.product.price) * item.quantity
                          ).toLocaleString("en-IN")}
                        </p>
                      </div>
                    ))}
                  </div>
                </div>

                <div className="flex gap-3 pt-2">
                  <Button
                    type="button"
                    variant="outline"
                    onClick={() => setStep("payment")}
                    className="flex-1 border-teal-200 text-teal-700 hover:bg-teal-50 font-sans uppercase rounded-sm text-xs"
                    data-ocid="checkout.back.secondary_button"
                  >
                    Back
                  </Button>
                  <Button
                    onClick={handlePlaceOrder}
                    disabled={isPlacing}
                    className="flex-2 flex-grow bg-amber-600 hover:bg-amber-500 text-white font-sans tracking-widest uppercase rounded-sm border-0 py-5 disabled:opacity-70"
                    data-ocid="checkout.place_order.primary_button"
                  >
                    {isPlacing ? (
                      <span className="flex items-center gap-2">
                        <span className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                        Placing Order...
                      </span>
                    ) : (
                      <>
                        <Lock className="w-4 h-4 mr-2" />
                        Place Order — ₹{total.toLocaleString("en-IN")}
                      </>
                    )}
                  </Button>
                </div>
              </div>
            )}
          </div>

          {/* ── Right: Order Summary ── */}
          <div className="lg:col-span-1">
            <div className="bg-white rounded-2xl shadow-sm border border-teal-50 p-5 sticky top-24">
              <h3 className="font-serif text-lg text-teal-800 mb-4">
                Order Summary
              </h3>

              {/* Item list */}
              <div className="space-y-3 mb-4">
                {items.map((item, idx) => (
                  <div
                    key={item.product.id.toString()}
                    className="flex items-center gap-2"
                    data-ocid={`checkout.summary.item.${idx + 1}`}
                  >
                    <div className="w-10 h-12 rounded overflow-hidden bg-sand-100 shrink-0">
                      {item.product.imageUrl ? (
                        <img
                          src={item.product.imageUrl}
                          alt={item.product.name}
                          className="w-full h-full object-cover"
                        />
                      ) : (
                        <div className="w-full h-full flex items-center justify-center">
                          <ShoppingBag className="w-4 h-4 text-teal-200" />
                        </div>
                      )}
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-xs font-sans text-foreground line-clamp-1">
                        {item.product.name}
                      </p>
                      <p className="text-[10px] text-muted-foreground">
                        Qty {item.quantity}
                      </p>
                    </div>
                    <p className="text-xs font-serif font-semibold text-teal-700 shrink-0">
                      ₹
                      {(
                        Number(item.product.price) * item.quantity
                      ).toLocaleString("en-IN")}
                    </p>
                  </div>
                ))}
              </div>

              <Separator className="bg-teal-100 mb-4" />

              <div className="space-y-2 text-sm font-sans">
                <div className="flex justify-between text-muted-foreground">
                  <span>Subtotal</span>
                  <span>₹{subtotal.toLocaleString("en-IN")}</span>
                </div>
                <div className="flex justify-between text-muted-foreground">
                  <span>Shipping</span>
                  <span
                    className={
                      shipping === 0 ? "text-teal-600 font-medium" : ""
                    }
                  >
                    {shipping === 0 ? "FREE" : `₹${shipping}`}
                  </span>
                </div>
                {shipping === 0 && (
                  <p className="text-[10px] text-teal-600">
                    Free shipping on orders above ₹2,999
                  </p>
                )}
                <Separator className="bg-teal-100" />
                <div className="flex justify-between font-semibold text-teal-800 text-base">
                  <span>Total</span>
                  <span>₹{total.toLocaleString("en-IN")}</span>
                </div>
              </div>

              {/* Trust */}
              <div className="mt-4 pt-4 border-t border-teal-50 flex items-center gap-2 text-xs text-muted-foreground">
                <Lock className="w-3.5 h-3.5 text-teal-500 shrink-0" />
                <span>Payments are secured with 256-bit SSL encryption</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </main>
  );
}

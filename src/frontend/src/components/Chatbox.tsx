import { Button } from "@/components/ui/button";
import { Bot, MessageCircle, Send, User, X } from "lucide-react";
import { useEffect, useRef, useState } from "react";

interface Message {
  id: string;
  text: string;
  sender: "user" | "bot";
  timestamp: Date;
}

const QUICK_REPLIES = [
  "Saree Collection",
  "Jewelry & Handbags",
  "Offers & Discounts",
  "Shipping Info",
  "Return Policy",
];

interface BotRule {
  keywords: string[];
  response: string;
}

const BOT_RULES: BotRule[] = [
  {
    keywords: [
      "hello",
      "hi",
      "hey",
      "namaste",
      "good morning",
      "good afternoon",
      "good evening",
      "greet",
    ],
    response:
      "Hello! Welcome to Dali's Boutique 🌿 I'm your personal shopping assistant. I can help you explore sarees, jewelry, handbags, offers, or answer any questions. What are you looking for today?",
  },
  {
    keywords: [
      "saree",
      "sari",
      "silk",
      "kanjivaram",
      "banarasi",
      "chanderi",
      "chiffon",
      "georgette",
      "cotton saree",
      "designer saree",
      "wedding saree",
      "bridal",
    ],
    response:
      "We carry a gorgeous range of sarees — Kanjivaram silk, Banarasi, Chanderi, Chiffon, Georgette, and Cotton varieties. Perfect for weddings, festivals, and daily wear. Visit our Sarees page to browse the full collection. Use the Virtual Try-On feature to see which style suits you best!",
  },
  {
    keywords: [
      "jewel",
      "necklace",
      "earring",
      "bangle",
      "bracelet",
      "ring",
      "chain",
      "gold",
      "silver",
      "pendant",
      "ornament",
      "accessory",
    ],
    response:
      "Our jewelry collection features traditional and contemporary designs — necklaces, earrings, bangles, and more. Jewelry starts from ₹800. Visit the Jewelry page to see all available pieces and use the Try-On feature to check suitability!",
  },
  {
    keywords: ["handbag", "bag", "purse", "clutch", "tote", "sling", "potli"],
    response:
      "We have elegant handbags and clutches to complement every outfit — potli bags, sling bags, totes, and embellished clutches. Handbags start from ₹1,200. Check out the Handbags page for the full collection!",
  },
  {
    keywords: [
      "try on",
      "virtual try",
      "suit",
      "suitable",
      "match",
      "looks good",
      "how will it look",
      "fitting",
      "check myself",
    ],
    response:
      "Our Virtual Try-On feature lets you upload your photo and check whether a saree, jewelry piece, or handbag is suitable for you! Just go to the Sarees, Jewelry, or Handbags page and click the 'Virtual Try-On' button. It gives you a suitability score and personalized tips.",
  },
  {
    keywords: [
      "price",
      "cost",
      "how much",
      "rate",
      "charges",
      "budget",
      "expensive",
      "cheap",
      "affordable",
      "worth",
    ],
    response:
      "Our pricing: Sarees range from ₹1,500 to ₹25,000 (depending on fabric and design). Jewelry starts from ₹800. Handbags from ₹1,200. We also have special offers and discounts — check the Offers page for the latest deals!",
  },
  {
    keywords: [
      "offer",
      "sale",
      "discount",
      "deal",
      "coupon",
      "promo",
      "festival offer",
      "special price",
      "clearance",
      "bargain",
    ],
    response:
      "Great news! We have ongoing offers and seasonal deals on selected sarees, jewelry, and handbags. Visit our Offers page to see all current discounts. Prices are clearly marked with savings shown on each item.",
  },
  {
    keywords: [
      "new arrival",
      "new collection",
      "latest",
      "new stock",
      "fresh",
      "just arrived",
      "new design",
    ],
    response:
      "Our New Arrivals section is updated regularly with the latest designs. Visit our website's New Arrivals section on the homepage to see what just came in — from festive sarees to trendy handbags!",
  },
  {
    keywords: [
      "ship",
      "deliver",
      "shipping",
      "delivery",
      "courier",
      "dispatch",
      "track",
      "tracking",
      "when will i get",
      "how long",
    ],
    response:
      "We offer free shipping on orders above ₹2,999. Standard delivery takes 3-5 business days across India. Express delivery (1-2 days) is available at extra charge. You'll receive a tracking number via email once your order ships.",
  },
  {
    keywords: [
      "return",
      "refund",
      "exchange",
      "cancel",
      "cancellation",
      "wrong item",
      "defective",
      "damaged",
      "replace",
    ],
    response:
      "We have a 7-day return/exchange policy for unworn items in original condition with tags intact. For defective or wrong items, we offer free returns. To initiate a return, contact us at dalisboutique@gmail.com or use the contact link in the footer.",
  },
  {
    keywords: [
      "payment",
      "pay",
      "upi",
      "card",
      "cash",
      "cod",
      "online payment",
      "credit card",
      "debit card",
      "net banking",
      "wallet",
    ],
    response:
      "We accept all major payment methods: UPI, Credit/Debit Cards, Net Banking, and popular digital wallets. For special orders, Cash on Delivery (COD) may also be available at checkout.",
  },
  {
    keywords: [
      "size",
      "measurement",
      "blouse",
      "petticoat",
      "how to wear",
      "drape",
      "length",
      "width",
    ],
    response:
      "All our sarees are standard 6.3 meters in length. Blouse piece is usually included. For custom blouse stitching, please mention your measurements at checkout. We can guide you on draping styles for different occasions too!",
  },
  {
    keywords: [
      "care",
      "wash",
      "dry clean",
      "maintain",
      "store",
      "preservation",
      "clean",
    ],
    response:
      "Silk sarees (Kanjivaram, Banarasi) should be dry cleaned only. Chiffon and Georgette can be gentle hand-washed in cold water. Store silk sarees wrapped in muslin cloth in a cool, dry place. Avoid direct sunlight to preserve the color and sheen.",
  },
  {
    keywords: [
      "material",
      "fabric",
      "quality",
      "pure",
      "original",
      "genuine",
      "authentic",
    ],
    response:
      "We source only authentic, high-quality fabrics. Our silk sarees are 100% pure — Kanjivaram is made from mulberry silk and our Banarasi sarees feature real zari work. All products go through quality checks before listing.",
  },
  {
    keywords: [
      "wedding",
      "festival",
      "occasion",
      "party",
      "function",
      "puja",
      "ceremony",
      "traditional",
      "ethnic",
    ],
    response:
      "For weddings, we recommend our Kanjivaram silk or Banarasi sarees — available in rich reds, greens, and golds. For festivals, Chanderi and Chiffon sarees are perfect. We also have special jewelry sets and clutches to complete your festive look!",
  },
  {
    keywords: [
      "contact",
      "phone",
      "email",
      "address",
      "reach",
      "support",
      "help desk",
      "customer service",
      "customer care",
    ],
    response:
      "You can reach us at dalisboutique@gmail.com or through the Contact link in the website footer. Our customer support team is available Monday to Saturday, 10 AM to 6 PM. We typically respond within 24 hours.",
  },
  {
    keywords: [
      "cart",
      "add to cart",
      "order",
      "buy",
      "purchase",
      "checkout",
      "how to buy",
      "how to order",
    ],
    response:
      "To purchase: browse any product, click 'Add to Cart', then proceed to checkout. You can review your cart anytime by clicking the cart icon in the top navigation. We'll confirm your order and share a tracking number once shipped.",
  },
  {
    keywords: [
      "help",
      "what can you do",
      "features",
      "guide",
      "how to use",
      "navigation",
    ],
    response:
      "I can help you with: 🛍 Saree, Jewelry & Handbag collections | 👗 Virtual Try-On feature | 💰 Pricing & Offers | 🚚 Shipping & Delivery | ↩ Returns & Exchanges | 🧵 Fabric care & sizing | 📞 Contact & Support. Just ask me anything!",
  },
];

function getBotResponse(message: string): string {
  const lower = message.toLowerCase();

  for (const rule of BOT_RULES) {
    if (rule.keywords.some((kw) => lower.includes(kw))) {
      return rule.response;
    }
  }

  // Fallback — try to give a helpful nudge
  return "Thank you for your message! I may not have the exact answer, but I can help with saree collections, jewelry, handbags, pricing, shipping, returns, and more. Try asking something like 'What sarees do you have?' or 'What are the offers?' 😊";
}

export default function Chatbox() {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState<Message[]>([
    {
      id: "1",
      text: "Welcome to Dali's Boutique! 🌿 How can I help you today?",
      sender: "bot",
      timestamp: new Date(),
    },
  ]);
  const [inputValue, setInputValue] = useState("");
  const [isTyping, setIsTyping] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }); // run after every render to keep scroll pinned to bottom

  const sendMessage = (text: string) => {
    if (!text.trim()) return;

    const userMessage: Message = {
      id: Date.now().toString(),
      text: text.trim(),
      sender: "user",
      timestamp: new Date(),
    };

    setMessages((prev) => [...prev, userMessage]);
    setInputValue("");
    setIsTyping(true);

    setTimeout(
      () => {
        const botMessage: Message = {
          id: (Date.now() + 1).toString(),
          text: getBotResponse(text),
          sender: "bot",
          timestamp: new Date(),
        };
        setMessages((prev) => [...prev, botMessage]);
        setIsTyping(false);
      },
      1000 + Math.random() * 500,
    );
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    sendMessage(inputValue);
  };

  return (
    <div className="fixed bottom-6 right-6 z-50">
      {/* Chat window */}
      {isOpen && (
        <div
          className="mb-4 w-80 bg-white rounded-xl shadow-2xl border border-teal-100 overflow-hidden flex flex-col"
          style={{ height: "420px" }}
        >
          {/* Header */}
          <div className="bg-teal-700 px-4 py-3 flex items-center justify-between">
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 rounded-full bg-champagne-400 flex items-center justify-center">
                <Bot className="w-4 h-4 text-teal-900" />
              </div>
              <div>
                <p className="text-sm font-sans font-semibold text-champagne-200">
                  Dali's Assistant
                </p>
                <p className="text-xs text-teal-300 font-sans">Online</p>
              </div>
            </div>
            <button
              type="button"
              onClick={() => setIsOpen(false)}
              className="text-teal-300 hover:text-champagne-300 transition-colors"
            >
              <X className="w-4 h-4" />
            </button>
          </div>

          {/* Messages */}
          <div className="flex-1 overflow-y-auto p-3 space-y-3 bg-sand-50">
            {messages.map((msg) => (
              <div
                key={msg.id}
                className={`flex gap-2 ${msg.sender === "user" ? "flex-row-reverse" : "flex-row"}`}
              >
                <div
                  className={`shrink-0 w-6 h-6 rounded-full flex items-center justify-center ${
                    msg.sender === "bot" ? "bg-teal-100" : "bg-champagne-200"
                  }`}
                >
                  {msg.sender === "bot" ? (
                    <Bot className="w-3 h-3 text-teal-700" />
                  ) : (
                    <User className="w-3 h-3 text-teal-700" />
                  )}
                </div>
                <div
                  className={`max-w-[75%] px-3 py-2 rounded-lg text-xs font-sans leading-relaxed ${
                    msg.sender === "bot"
                      ? "bg-white text-teal-800 border border-teal-100 rounded-tl-none"
                      : "bg-teal-700 text-champagne-100 rounded-tr-none"
                  }`}
                >
                  {msg.text}
                </div>
              </div>
            ))}

            {isTyping && (
              <div className="flex gap-2">
                <div className="shrink-0 w-6 h-6 rounded-full bg-teal-100 flex items-center justify-center">
                  <Bot className="w-3 h-3 text-teal-700" />
                </div>
                <div className="bg-white border border-teal-100 rounded-lg rounded-tl-none px-3 py-2">
                  <div className="flex gap-1">
                    <span
                      className="w-1.5 h-1.5 bg-teal-400 rounded-full animate-bounce"
                      style={{ animationDelay: "0ms" }}
                    />
                    <span
                      className="w-1.5 h-1.5 bg-teal-400 rounded-full animate-bounce"
                      style={{ animationDelay: "150ms" }}
                    />
                    <span
                      className="w-1.5 h-1.5 bg-teal-400 rounded-full animate-bounce"
                      style={{ animationDelay: "300ms" }}
                    />
                  </div>
                </div>
              </div>
            )}
            <div ref={messagesEndRef} />
          </div>

          {/* Quick replies */}
          <div className="px-3 py-2 bg-white border-t border-teal-50 flex gap-1.5 overflow-x-auto">
            {QUICK_REPLIES.map((reply) => (
              <button
                type="button"
                key={reply}
                onClick={() => sendMessage(reply)}
                className="shrink-0 text-xs px-2.5 py-1 rounded-full border border-teal-200 text-teal-700 hover:bg-teal-50 hover:border-teal-400 transition-colors font-sans whitespace-nowrap"
              >
                {reply}
              </button>
            ))}
          </div>

          {/* Input */}
          <form
            onSubmit={handleSubmit}
            className="px-3 py-2 bg-white border-t border-teal-100 flex gap-2"
          >
            <input
              type="text"
              value={inputValue}
              onChange={(e) => setInputValue(e.target.value)}
              placeholder="Type a message..."
              className="flex-1 text-xs px-3 py-2 border border-teal-200 rounded-full focus:outline-none focus:border-teal-500 focus:ring-1 focus:ring-teal-300 font-sans placeholder:text-teal-300 text-teal-800"
            />
            <Button
              type="submit"
              size="icon"
              disabled={!inputValue.trim()}
              className="w-8 h-8 rounded-full bg-teal-700 hover:bg-teal-600 border-0 shrink-0"
            >
              <Send className="w-3.5 h-3.5 text-champagne-200" />
            </Button>
          </form>
        </div>
      )}

      {/* Toggle button */}
      <button
        type="button"
        onClick={() => setIsOpen(!isOpen)}
        className="w-14 h-14 rounded-full bg-teal-700 hover:bg-teal-600 shadow-lg flex items-center justify-center transition-all hover:scale-105 active:scale-95"
      >
        {isOpen ? (
          <X className="w-6 h-6 text-champagne-200" />
        ) : (
          <MessageCircle className="w-6 h-6 text-champagne-200" />
        )}
      </button>
    </div>
  );
}

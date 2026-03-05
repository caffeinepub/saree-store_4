export interface ChatMessage {
  id: string;
  sender: "user" | "bot";
  text: string;
  timestamp: Date;
}

// Each entry: [keywords[], reply]
const botReplyList: [string[], string][] = [
  // Greetings
  [
    [
      "hello",
      "hi",
      "hey",
      "namaste",
      "hii",
      "helo",
      "good morning",
      "good evening",
      "good afternoon",
    ],
    "Namaste! Welcome to Dali's Boutique. I'm your personal shopping assistant. Ask me anything about our sarees, jewelry, handbags, shipping, offers, or how to place an order!",
  ],
  [
    ["how are you", "how r u", "how are u"],
    "I'm doing great, thank you for asking! How can I help you today? Looking for a beautiful saree, jewelry, or handbag?",
  ],
  [
    ["thank", "thanks", "thankyou", "thank you"],
    "You're welcome! Happy shopping at Dali's Boutique. Feel free to ask anything anytime!",
  ],
  [
    ["bye", "goodbye", "see you", "take care"],
    "Goodbye! Thank you for visiting Dali's Boutique. We hope to see you again soon!",
  ],

  // Products: Sarees
  [
    [
      "what saree",
      "which saree",
      "saree type",
      "types of saree",
      "kind of saree",
      "silk saree",
      "cotton saree",
      "kanjeevaram",
      "banarasi",
      "georgette",
      "chiffon",
      "kanjivaram",
    ],
    "We have a stunning collection of sarees including Kanjivaram Silk, Banarasi Silk, Georgette, Chiffon, Cotton, Crepe, and more! Each saree is handpicked for quality. Visit our Sarees page to browse all available styles.",
  ],
  [
    ["bridal saree", "wedding saree", "shaadi", "bridal"],
    "For brides, we recommend our Kanjivaram Silk or Banarasi Silk sarees — they're perfect for weddings! Check our Sarees page and filter by New Arrivals for the latest bridal collections.",
  ],
  [
    ["festival saree", "festival", "diwali", "navratri", "puja saree"],
    "For festivals, our Cotton and Georgette sarees are very popular! Lightweight, colorful, and elegant — perfect for Diwali, Navratri, and Puja occasions. Browse our Sarees collection for festival-ready picks.",
  ],
  [
    ["daily wear", "casual saree", "office saree", "work saree"],
    "For daily wear or office, we recommend lightweight Cotton or Chiffon sarees. They're comfortable, easy to drape, and look elegant. Check our Sarees page for everyday options.",
  ],

  // Products: Jewelry
  [
    [
      "jewelry",
      "jewellery",
      "necklace",
      "earring",
      "bracelet",
      "bangles",
      "ring",
      "gold jewelry",
      "silver jewelry",
    ],
    "Our Jewelry collection features traditional and contemporary designs — necklaces, earrings, bangles, bracelets, and more! Available in gold-tone and silver-tone finishes. Visit our Jewelry page to explore.",
  ],

  // Products: Handbags
  [
    ["handbag", "bag", "purse", "clutch", "tote", "sling bag"],
    "We carry a beautiful range of handbags including clutches, totes, and sling bags — perfect to pair with your saree! Visit our Handbags page to find your match.",
  ],

  // What do you sell / general
  [
    [
      "what do you sell",
      "what is available",
      "what can i buy",
      "products",
      "what you have",
      "catalogue",
      "catalog",
    ],
    "Dali's Boutique is a premium women's boutique! We sell: \n1. Sarees (Silk, Cotton, Georgette, Chiffon, Banarasi, Kanjivaram)\n2. Jewelry (Necklaces, Earrings, Bangles)\n3. Handbags (Clutches, Totes, Sling bags)\n\nWe also have special Offers and New Arrivals sections!",
  ],

  // New Arrivals / Offers
  [
    ["new arrival", "new saree", "latest", "new collection", "just arrived"],
    "Our New Arrivals section has the freshest sarees, jewelry, and handbags added to the boutique! Visit our homepage and look for the 'New Arrivals' section, or browse any category and filter by 'New Arrival'.",
  ],
  [
    [
      "offer",
      "discount",
      "sale",
      "deal",
      "coupon",
      "promo",
      "promotion",
      "reduction",
    ],
    "We have exciting offers and discounts running! Visit our Offers page from the top navigation to see all current deals. You can also filter products on the Sarees/Jewelry/Handbags pages by 'On Sale'.",
  ],

  // Virtual Try-On / Suitability
  [
    [
      "virtual try",
      "try on",
      "try saree",
      "try saree on",
      "suitability",
      "suitable",
      "which saree suits me",
      "will it suit",
      "which color suits",
      "how do i look",
    ],
    "We have a Virtual Try-On feature! Open any product page, then click the 'Virtual Try-On' tab. Upload a clear front-facing photo of yourself and click 'Generate My AI Look' — it will show you how the saree, jewelry, or handbag looks on you!",
  ],

  // Shipping
  [
    [
      "shipping",
      "delivery",
      "how long",
      "when will i receive",
      "dispatch",
      "courier",
      "express",
      "standard delivery",
    ],
    "We offer FREE shipping on orders above ₹2,999! Standard delivery takes 5-7 business days across India. Express delivery (2-3 days) is available for an additional charge. You'll receive tracking details after your order is placed.",
  ],

  // Returns / Refund
  [
    [
      "return",
      "refund",
      "exchange",
      "send back",
      "not satisfied",
      "wrong product",
    ],
    "We have a hassle-free 7-day return policy! If you're not happy with your purchase, contact us within 7 days of delivery. The saree must be unworn and in its original packaging. We'll process your refund or exchange quickly.",
  ],

  // Payment
  [
    [
      "payment",
      "how to pay",
      "pay online",
      "upi",
      "credit card",
      "debit card",
      "net banking",
      "emi",
      "cash on delivery",
      "cod",
      "paytm",
      "gpay",
      "phonepe",
    ],
    "We accept all major payment methods:\n- UPI (PhonePe, Google Pay, Paytm, BHIM)\n- Credit / Debit Cards (Visa, Mastercard, RuPay)\n- Net Banking (SBI, HDFC, ICICI, Axis, Kotak)\n- Cash on Delivery\n\nAll payments are secured with 256-bit SSL encryption. EMI available on orders above ₹5,000.",
  ],

  // Price
  [
    [
      "price",
      "cost",
      "how much",
      "expensive",
      "cheap",
      "affordable",
      "budget",
      "rate",
    ],
    "Our prices range from affordable Cotton sarees starting at ₹500 to exquisite Bridal Silk sarees. Jewelry pieces start from ₹300 and handbags from ₹800. Check individual product pages for exact pricing. We also run regular offers and discounts!",
  ],

  // Sizing / Saree length
  [
    [
      "size",
      "length",
      "how long is saree",
      "blouse",
      "blouse piece",
      "measurement",
      "drape",
      "petite",
      "plus size",
    ],
    "Our sarees are typically 5.5 meters long with a 0.8-meter blouse piece included. For petite frames, lightweight georgette or chiffon drapes beautifully. For plus sizes, flowy Kanjivaram or Banarasi styles work great. Use the Suitability Checker on any product page for personalized recommendations!",
  ],

  // Fabric / Material
  [
    [
      "fabric",
      "material",
      "silk",
      "cotton",
      "georgette",
      "chiffon",
      "brocade",
      "crepe",
      "linen",
      "net",
      "what is made of",
    ],
    "We carry a wide range of fabrics:\n- Kanjivaram & Banarasi Silk — for weddings and special occasions\n- Cotton — for daily wear and festivals\n- Georgette & Chiffon — lightweight, elegant, and easy to drape\n- Crepe — for office and semi-formal looks\n- Brocade & Net — for party and festive wear",
  ],

  // Care instructions
  [
    [
      "care",
      "wash",
      "clean",
      "dry clean",
      "how to maintain",
      "store saree",
      "maintain",
      "iron",
    ],
    "To care for your saree:\n- Silk sarees: Dry clean only, store in a muslin cloth\n- Cotton sarees: Hand wash in cold water with mild detergent\n- Embroidered sarees: Turn inside out before washing\n- Store away from direct sunlight and damp places\n- Use a cool iron on the reverse side",
  ],

  // Admin / Owner
  [
    [
      "admin",
      "owner",
      "add product",
      "upload saree",
      "upload product",
      "add saree",
      "how to add",
    ],
    "The owner can access the Admin Panel by going to your site URL with /#/admin at the end. Enter the admin password to log in and add sarees, jewelry, or handbags with photos, prices, and descriptions.",
  ],

  // Order / Cart
  [
    [
      "how to order",
      "how to buy",
      "how to purchase",
      "add to cart",
      "cart",
      "checkout",
      "buy",
      "order",
    ],
    "To place an order:\n1. Browse Sarees, Jewelry, or Handbags\n2. Click any product to open its page\n3. Select quantity and click 'Add to Cart'\n4. Click the cart icon and then 'Proceed to Checkout'\n5. Fill in your delivery address and payment details\n6. Click 'Place Order' — done!",
  ],

  // Contact
  [
    [
      "contact",
      "email",
      "phone number",
      "reach you",
      "support",
      "help",
      "customer care",
      "whatsapp",
    ],
    "For any queries or support, you can reach us through the chat here or visit the boutique directly. We're happy to help you find the perfect saree, jewelry, or handbag!",
  ],
];

const defaultReply =
  "I'm not sure about that, but I'd love to help! You can ask me about our sarees, jewelry, handbags, pricing, offers, shipping, returns, payment methods, virtual try-on, or how to place an order. What would you like to know?";

export function getBotReply(userMessage: string): string {
  const lower = userMessage.toLowerCase().trim();

  for (const [keywords, reply] of botReplyList) {
    if (keywords.some((kw) => lower.includes(kw))) {
      return reply;
    }
  }

  return defaultReply;
}

export function generateMessageId(): string {
  return `msg_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
}

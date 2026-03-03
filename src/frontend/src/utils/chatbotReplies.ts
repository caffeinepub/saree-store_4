export interface ChatMessage {
  id: string;
  sender: "user" | "bot";
  text: string;
  timestamp: Date;
}

const botReplies: Record<string, string> = {
  shipping:
    "We offer free shipping on orders above ₹2,000! Standard delivery takes 5-7 business days, and express delivery (2-3 days) is available for an additional charge. We ship across India and to select international destinations.",

  return:
    "We have a hassle-free 7-day return policy. If you're not satisfied with your purchase, you can return it within 7 days of delivery. The saree must be unworn and in its original packaging. Contact our support team to initiate a return.",

  offer:
    "We have exciting offers running right now! Check our Offers page for the latest deals and discounts. You can also sign up for our newsletter to get exclusive promo codes and early access to sales.",

  size: "Our sarees are typically 5.5 meters in length with a 0.8-meter blouse piece included. For petite frames, we recommend lightweight fabrics like chiffon or georgette. For plus sizes, flowy fabrics drape beautifully. Use our Suitability Checker on any saree page for personalized recommendations!",

  payment:
    "We accept all major payment methods including Credit/Debit Cards, UPI, Net Banking, and Cash on Delivery. All transactions are secured with 256-bit SSL encryption. EMI options are available on orders above ₹5,000.",

  hello:
    "Namaste! 🙏 Welcome to our saree boutique. I'm here to help you find the perfect saree. You can ask me about shipping, returns, offers, sizing, or payment options!",

  hi: "Namaste! 🙏 Welcome to our saree boutique. I'm here to help you find the perfect saree. You can ask me about shipping, returns, offers, sizing, or payment options!",

  namaste:
    "Namaste! 🙏 How can I assist you today? Feel free to ask about our sarees, shipping, returns, or any other queries!",

  price:
    "Our sarees are priced to suit every budget — from affordable cotton sarees starting at ₹500 to exquisite bridal silk sarees. Check our categories for detailed pricing. We also have special offers on selected items!",

  discount:
    "We regularly offer discounts on our collections! Visit our Offers page to see current deals. You can also get 10% off on your first order by signing up for our newsletter.",

  fabric:
    "We carry a wide range of fabrics including Banarasi Silk, Kanjivaram Silk, Chiffon, Georgette, Cotton, Crepe, and more. Each fabric has its own charm — silk for weddings, cotton for daily wear, and chiffon for a light, elegant look.",

  care: "To maintain the beauty of your saree: Dry clean silk sarees, hand wash cotton sarees in cold water, store in a cool dry place, and avoid direct sunlight. For embroidered sarees, turn them inside out before washing.",

  blouse:
    "Most of our sarees come with a matching blouse piece (0.8 meters). We also offer custom blouse stitching services. Please check the individual product description for blouse piece details.",
};

const defaultReply =
  "Thank you for your message! Our team will get back to you shortly. In the meantime, you can browse our collections or check our FAQ. You can also ask me about: shipping, returns, offers, sizing, payment, fabric, or care instructions.";

export function getBotReply(userMessage: string): string {
  const lower = userMessage.toLowerCase().trim();

  for (const [keyword, reply] of Object.entries(botReplies)) {
    if (lower.includes(keyword)) {
      return reply;
    }
  }

  return defaultReply;
}

export function generateMessageId(): string {
  return `msg_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
}

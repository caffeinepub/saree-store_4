import { useState, useRef, useEffect } from 'react';
import { MessageCircle, X, Send, Bot, User } from 'lucide-react';
import { Button } from '@/components/ui/button';

interface Message {
  id: string;
  text: string;
  sender: 'user' | 'bot';
  timestamp: Date;
}

const BOT_RESPONSES: Record<string, string> = {
  default: "Thank you for reaching out to Dali's Boutique! How can I assist you today?",
  saree: "We have a stunning collection of sarees including Kanjivaram silk, Banarasi, Chanderi, and more. Would you like to explore our saree collection?",
  price: "Our sarees range from ₹1,500 to ₹25,000. Jewelry starts at ₹800, and handbags from ₹1,200. We also have special offers available!",
  shipping: "We offer free shipping on orders above ₹2,999. Standard delivery takes 3-5 business days.",
  return: "We have a 7-day return policy for unworn items in original condition. Please contact us for return requests.",
  offer: "Check out our Offers page for the latest deals and discounts! We regularly update our sale collection.",
  hello: "Hello! Welcome to Dali's Boutique. I'm here to help you find the perfect piece. What are you looking for today?",
  help: "I can help you with product information, pricing, shipping details, and returns. What would you like to know?",
};

const QUICK_REPLIES = ['Saree Collection', 'Pricing', 'Shipping Info', 'Return Policy', 'Current Offers'];

function getBotResponse(message: string): string {
  const lower = message.toLowerCase();
  if (lower.includes('hello') || lower.includes('hi') || lower.includes('hey')) return BOT_RESPONSES.hello;
  if (lower.includes('saree') || lower.includes('silk')) return BOT_RESPONSES.saree;
  if (lower.includes('price') || lower.includes('cost') || lower.includes('how much')) return BOT_RESPONSES.price;
  if (lower.includes('ship') || lower.includes('deliver')) return BOT_RESPONSES.shipping;
  if (lower.includes('return') || lower.includes('refund')) return BOT_RESPONSES.return;
  if (lower.includes('offer') || lower.includes('sale') || lower.includes('discount')) return BOT_RESPONSES.offer;
  if (lower.includes('help')) return BOT_RESPONSES.help;
  return BOT_RESPONSES.default;
}

export default function Chatbox() {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState<Message[]>([
    {
      id: '1',
      text: "Welcome to Dali's Boutique! 🌿 How can I help you today?",
      sender: 'bot',
      timestamp: new Date(),
    },
  ]);
  const [inputValue, setInputValue] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages, isTyping]);

  const sendMessage = (text: string) => {
    if (!text.trim()) return;

    const userMessage: Message = {
      id: Date.now().toString(),
      text: text.trim(),
      sender: 'user',
      timestamp: new Date(),
    };

    setMessages((prev) => [...prev, userMessage]);
    setInputValue('');
    setIsTyping(true);

    setTimeout(() => {
      const botMessage: Message = {
        id: (Date.now() + 1).toString(),
        text: getBotResponse(text),
        sender: 'bot',
        timestamp: new Date(),
      };
      setMessages((prev) => [...prev, botMessage]);
      setIsTyping(false);
    }, 1000 + Math.random() * 500);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    sendMessage(inputValue);
  };

  return (
    <div className="fixed bottom-6 right-6 z-50">
      {/* Chat window */}
      {isOpen && (
        <div className="mb-4 w-80 bg-white rounded-xl shadow-2xl border border-teal-100 overflow-hidden flex flex-col"
          style={{ height: '420px' }}>
          {/* Header */}
          <div className="bg-teal-700 px-4 py-3 flex items-center justify-between">
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 rounded-full bg-champagne-400 flex items-center justify-center">
                <Bot className="w-4 h-4 text-teal-900" />
              </div>
              <div>
                <p className="text-sm font-sans font-semibold text-champagne-200">Dali's Assistant</p>
                <p className="text-xs text-teal-300 font-sans">Online</p>
              </div>
            </div>
            <button
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
                className={`flex gap-2 ${msg.sender === 'user' ? 'flex-row-reverse' : 'flex-row'}`}
              >
                <div className={`shrink-0 w-6 h-6 rounded-full flex items-center justify-center ${
                  msg.sender === 'bot' ? 'bg-teal-100' : 'bg-champagne-200'
                }`}>
                  {msg.sender === 'bot'
                    ? <Bot className="w-3 h-3 text-teal-700" />
                    : <User className="w-3 h-3 text-teal-700" />
                  }
                </div>
                <div className={`max-w-[75%] px-3 py-2 rounded-lg text-xs font-sans leading-relaxed ${
                  msg.sender === 'bot'
                    ? 'bg-white text-teal-800 border border-teal-100 rounded-tl-none'
                    : 'bg-teal-700 text-champagne-100 rounded-tr-none'
                }`}>
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
                    <span className="w-1.5 h-1.5 bg-teal-400 rounded-full animate-bounce" style={{ animationDelay: '0ms' }} />
                    <span className="w-1.5 h-1.5 bg-teal-400 rounded-full animate-bounce" style={{ animationDelay: '150ms' }} />
                    <span className="w-1.5 h-1.5 bg-teal-400 rounded-full animate-bounce" style={{ animationDelay: '300ms' }} />
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
                key={reply}
                onClick={() => sendMessage(reply)}
                className="shrink-0 text-xs px-2.5 py-1 rounded-full border border-teal-200 text-teal-700 hover:bg-teal-50 hover:border-teal-400 transition-colors font-sans whitespace-nowrap"
              >
                {reply}
              </button>
            ))}
          </div>

          {/* Input */}
          <form onSubmit={handleSubmit} className="px-3 py-2 bg-white border-t border-teal-100 flex gap-2">
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
        onClick={() => setIsOpen(!isOpen)}
        className="w-14 h-14 rounded-full bg-teal-700 hover:bg-teal-600 shadow-lg flex items-center justify-center transition-all hover:scale-105 active:scale-95"
      >
        {isOpen
          ? <X className="w-6 h-6 text-champagne-200" />
          : <MessageCircle className="w-6 h-6 text-champagne-200" />
        }
      </button>
    </div>
  );
}

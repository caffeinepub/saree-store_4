import { Button } from "@/components/ui/button";
import { useCart } from "@/contexts/CartContext";
import { useInternetIdentity } from "@/hooks/useInternetIdentity";
import { useQueryClient } from "@tanstack/react-query";
import { useLocation, useNavigate } from "@tanstack/react-router";
import { Menu, Search, ShoppingBag, Sparkles, X } from "lucide-react";
import { useState } from "react";

export default function Header() {
  const navigate = useNavigate();
  const location = useLocation();
  const { totalItems, setIsCartOpen } = useCart();
  const { login, clear, loginStatus, identity } = useInternetIdentity();
  const queryClient = useQueryClient();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");

  const isAuthenticated = !!identity;

  const navLinks = [
    { label: "Sarees", path: "/sarees" },
    { label: "Jewelry", path: "/jewelry" },
    { label: "Handbags", path: "/handbags" },
    { label: "Offers", path: "/offers" },
  ];

  const handleAuth = async () => {
    if (isAuthenticated) {
      await clear();
      queryClient.clear();
    } else {
      try {
        await login();
      } catch (error: any) {
        if (error.message === "User is already authenticated") {
          await clear();
          setTimeout(() => login(), 300);
        }
      }
    }
  };

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      navigate({ to: "/search", search: { q: searchQuery.trim() } });
      setSearchQuery("");
    }
  };

  const isActive = (path: string) => location.pathname === path;

  return (
    <header className="sticky top-0 z-50 bg-teal-800 shadow-lg">
      {/* Top announcement bar */}
      <div className="bg-teal-900 text-champagne-300 text-center py-1.5 text-xs tracking-widest uppercase font-sans">
        Free shipping on orders above ₹2,999 &nbsp;·&nbsp; New Collection 2026
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <button
            type="button"
            onClick={() => navigate({ to: "/" })}
            className="flex items-center gap-2 group"
          >
            <Sparkles className="w-5 h-5 text-champagne-400 group-hover:text-champagne-300 transition-colors" />
            <span className="font-serif text-xl font-semibold text-champagne-200 tracking-wide group-hover:text-champagne-100 transition-colors">
              Dali's Boutique
            </span>
          </button>

          {/* Desktop Nav */}
          <nav className="hidden md:flex items-center gap-1">
            {navLinks.map((link) => (
              <button
                type="button"
                key={link.path}
                onClick={() => navigate({ to: link.path })}
                className={`px-4 py-2 text-sm font-sans tracking-wider uppercase transition-all rounded-sm ${
                  isActive(link.path)
                    ? "text-champagne-300 border-b-2 border-champagne-400"
                    : "text-teal-100 hover:text-champagne-300"
                }`}
              >
                {link.label}
              </button>
            ))}
          </nav>

          {/* Right actions */}
          <div className="flex items-center gap-2">
            {/* Search */}
            <form
              onSubmit={handleSearch}
              className="hidden sm:flex items-center"
            >
              <div className="relative">
                <input
                  type="text"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  placeholder="Search..."
                  className="w-36 lg:w-48 pl-3 pr-8 py-1.5 text-sm bg-teal-700 border border-teal-600 rounded text-teal-100 placeholder:text-teal-400 focus:outline-none focus:border-champagne-400 focus:ring-1 focus:ring-champagne-400 transition-all"
                />
                <button
                  type="submit"
                  className="absolute right-2 top-1/2 -translate-y-1/2 text-teal-400 hover:text-champagne-300 transition-colors"
                >
                  <Search className="w-3.5 h-3.5" />
                </button>
              </div>
            </form>

            {/* Cart */}
            <button
              type="button"
              onClick={() => setIsCartOpen(true)}
              className="relative p-2 text-teal-100 hover:text-champagne-300 transition-colors"
              aria-label="Cart"
            >
              <ShoppingBag className="w-5 h-5" />
              {totalItems > 0 && (
                <span className="absolute -top-0.5 -right-0.5 bg-champagne-500 text-teal-900 text-xs font-bold rounded-full w-4 h-4 flex items-center justify-center">
                  {totalItems}
                </span>
              )}
            </button>

            {/* Auth */}
            <Button
              onClick={handleAuth}
              disabled={loginStatus === "logging-in"}
              size="sm"
              className="hidden sm:inline-flex bg-champagne-500 hover:bg-champagne-400 text-teal-900 font-sans text-xs tracking-wider uppercase border-0 rounded-sm"
            >
              {loginStatus === "logging-in"
                ? "Loading..."
                : isAuthenticated
                  ? "Logout"
                  : "Login"}
            </Button>

            {/* Mobile menu toggle */}
            <button
              type="button"
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="md:hidden p-2 text-teal-100 hover:text-champagne-300 transition-colors"
            >
              {mobileMenuOpen ? (
                <X className="w-5 h-5" />
              ) : (
                <Menu className="w-5 h-5" />
              )}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile menu */}
      {mobileMenuOpen && (
        <div className="md:hidden bg-teal-900 border-t border-teal-700 px-4 py-4 space-y-1">
          {/* Mobile search */}
          <form onSubmit={handleSearch} className="mb-3">
            <div className="relative">
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search products..."
                className="w-full pl-3 pr-8 py-2 text-sm bg-teal-800 border border-teal-600 rounded text-teal-100 placeholder:text-teal-400 focus:outline-none focus:border-champagne-400"
              />
              <button
                type="submit"
                className="absolute right-2 top-1/2 -translate-y-1/2 text-teal-400"
              >
                <Search className="w-4 h-4" />
              </button>
            </div>
          </form>

          {navLinks.map((link) => (
            <button
              type="button"
              key={link.path}
              onClick={() => {
                navigate({ to: link.path });
                setMobileMenuOpen(false);
              }}
              className={`block w-full text-left px-3 py-2 text-sm font-sans tracking-wider uppercase rounded transition-colors ${
                isActive(link.path)
                  ? "bg-teal-700 text-champagne-300"
                  : "text-teal-100 hover:bg-teal-800 hover:text-champagne-300"
              }`}
            >
              {link.label}
            </button>
          ))}
          <div className="pt-2">
            <Button
              onClick={handleAuth}
              disabled={loginStatus === "logging-in"}
              className="w-full bg-champagne-500 hover:bg-champagne-400 text-teal-900 font-sans text-xs tracking-wider uppercase border-0 rounded-sm"
            >
              {loginStatus === "logging-in"
                ? "Loading..."
                : isAuthenticated
                  ? "Logout"
                  : "Login"}
            </Button>
          </div>
        </div>
      )}
    </header>
  );
}

import { Toaster } from "@/components/ui/sonner";
import {
  Link,
  Outlet,
  RouterProvider,
  createHashHistory,
  createRootRoute,
  createRoute,
  createRouter,
} from "@tanstack/react-router";
import React, { Suspense, lazy } from "react";
import CartDrawer from "./components/CartDrawer";
import Chatbox from "./components/Chatbox";
import Footer from "./components/Footer";
import Header from "./components/Header";
import LoadingFallback from "./components/LoadingFallback";
import { CartProvider } from "./contexts/CartContext";

// Lazy-load all page components for code splitting
const HomePage = lazy(() => import("./pages/HomePage"));
const SareesPage = lazy(() => import("./pages/SareesPage"));
const JewelryPage = lazy(() => import("./pages/JewelryPage"));
const HandbagsPage = lazy(() => import("./pages/HandbagsPage"));
const OffersPage = lazy(() => import("./pages/OffersPage"));
const ProductDetailPage = lazy(() => import("./pages/ProductDetailPage"));
const AdminPage = lazy(() => import("./pages/AdminPage"));
const SearchPage = lazy(() => import("./pages/SearchPage"));
const CheckoutPage = lazy(() => import("./pages/CheckoutPage"));

// Layout component that wraps all pages
function Layout() {
  return (
    <CartProvider>
      <div className="min-h-screen flex flex-col bg-background">
        <Header />
        <div className="flex-1">
          <Suspense fallback={<LoadingFallback />}>
            <Outlet />
          </Suspense>
        </div>
        <Footer />
        <CartDrawer />
        <Chatbox />
        <Toaster richColors position="top-right" />
      </div>
    </CartProvider>
  );
}

// Root route with layout
const rootRoute = createRootRoute({
  component: Layout,
  notFoundComponent: () => (
    <div className="min-h-[60vh] flex flex-col items-center justify-center text-center px-4">
      <p className="font-cormorant text-6xl text-gold mb-4">404</p>
      <h1 className="font-display text-3xl font-bold text-foreground mb-3">
        Page Not Found
      </h1>
      <p className="font-body text-muted-foreground mb-8">
        The page you are looking for does not exist.
      </p>
      <Link to="/" className="btn-crimson px-6 py-3 rounded-sm font-body">
        Return to Home
      </Link>
    </div>
  ),
});

// Define all routes
const indexRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: "/",
  component: HomePage,
});

const sareesRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: "/sarees",
  component: SareesPage,
});

const jewelryRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: "/jewelry",
  component: JewelryPage,
});

const handbagsRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: "/handbags",
  component: HandbagsPage,
});

const offersRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: "/offers",
  component: OffersPage,
});

const productDetailRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: "/product/$id",
  component: ProductDetailPage,
});

const adminRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: "/admin",
  component: AdminPage,
});

const searchRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: "/search",
  component: SearchPage,
  validateSearch: (search: Record<string, unknown>) => ({
    q: (search.q as string) || "",
  }),
});

const checkoutRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: "/checkout",
  component: CheckoutPage,
});

// Build the route tree
const routeTree = rootRoute.addChildren([
  indexRoute,
  sareesRoute,
  jewelryRoute,
  handbagsRoute,
  offersRoute,
  productDetailRoute,
  adminRoute,
  searchRoute,
  checkoutRoute,
]);

// Create the router with hash history for ICP compatibility
const hashHistory = createHashHistory();
const router = createRouter({ routeTree, history: hashHistory });

// Register router for type safety
declare module "@tanstack/react-router" {
  interface Register {
    router: typeof router;
  }
}

export default function App() {
  return <RouterProvider router={router} />;
}

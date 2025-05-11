
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { CartProvider } from "@/contexts/CartContext";
import { AdminAuthProvider } from "@/contexts/AdminAuthContext";
import { StrictMode } from "react";

import Index from "./pages/Index";
import ProductsPage from "./pages/ProductsPage";
import ProductDetail from "./pages/ProductDetail";
import CartPage from "./pages/CartPage";
import CheckoutPage from "./pages/CheckoutPage";
import OrderConfirmation from "./pages/OrderConfirmation";
import OrderHistory from "./pages/OrderHistory";
import CRM from "./pages/CRM"; // Nova importação
import AdminSettings from "./pages/AdminSettings";
import AdminProducts from "./pages/AdminProducts";
import AdminDeliveryFees from "./pages/AdminDeliveryFees";
import AdminLogin from "./pages/AdminLogin";
import AdminProtectedRoute from "./components/AdminProtectedRoute";
import NotFound from "./pages/NotFound";

// Criar um cliente do React Query fora do componente para evitar recriações
const queryClient = new QueryClient();

const App = () => {
  return (
    <StrictMode>
      <QueryClientProvider client={queryClient}>
        <TooltipProvider>
          <AdminAuthProvider>
            <CartProvider>
              <Toaster />
              <Sonner />
              <BrowserRouter>
                <Routes>
                  <Route path="/" element={<Index />} />
                  <Route path="/products/:type" element={<ProductsPage />} />
                  <Route path="/product/:id" element={<ProductDetail />} />
                  <Route path="/cart" element={<CartPage />} />
                  <Route path="/checkout" element={<CheckoutPage />} />
                  <Route path="/order-confirmation" element={<OrderConfirmation />} />
                  <Route path="/order-history" element={<OrderHistory />} />
                  <Route path="/crm" element={
                    <AdminProtectedRoute>
                      <CRM />
                    </AdminProtectedRoute>
                  } /> {/* Nova rota protegida */}
                  <Route path="/admin/login" element={<AdminLogin />} />
                  <Route path="/admin/settings" element={
                    <AdminProtectedRoute>
                      <AdminSettings />
                    </AdminProtectedRoute>
                  } />
                  <Route path="/admin/products" element={
                    <AdminProtectedRoute>
                      <AdminProducts />
                    </AdminProtectedRoute>
                  } />
                  <Route path="/admin/delivery-fees" element={
                    <AdminProtectedRoute>
                      <AdminDeliveryFees />
                    </AdminProtectedRoute>
                  } />
                  <Route path="*" element={<NotFound />} />
                </Routes>
              </BrowserRouter>
            </CartProvider>
          </AdminAuthProvider>
        </TooltipProvider>
      </QueryClientProvider>
    </StrictMode>
  );
};

export default App;

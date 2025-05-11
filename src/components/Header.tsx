
import React, { useState } from 'react';
import { ShoppingCart, Settings, ChevronDown, Clock, BarChart } from 'lucide-react';
import { Link } from 'react-router-dom';
import { useCart } from '@/contexts/CartContext';
import { useAdminAuth } from '@/contexts/AdminAuthContext';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import AdminLogoutButton from '@/components/AdminLogoutButton';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';

const Header = () => {
  const { totalItems } = useCart();
  const { isAdminAuthenticated } = useAdminAuth();
  const [isAdminMenuOpen, setIsAdminMenuOpen] = useState(false);

  return (
    <header className="sticky top-0 z-50 w-full bg-white border-b shadow-sm">
      <div className="container flex items-center justify-between h-16 py-4">
        <Link to="/" className="flex items-center gap-2">
          <div className="relative">
            <div className="h-8 w-8 rounded-full bg-gradient-to-br from-water to-gas-dark animate-pulse-slow"></div>
            <div className="absolute inset-0 flex items-center justify-center text-white font-bold">
              W&G
            </div>
          </div>
          <span className="font-bold text-xl">Águas & Gás</span>
        </Link>
        
        <nav className="hidden md:flex items-center space-x-6">
          <Link to="/" className="text-sm font-medium hover:text-water transition-colors">
            Início
          </Link>
          <Link to="/products/water" className="text-sm font-medium hover:text-water transition-colors">
            Água
          </Link>
          <Link to="/products/gas" className="text-sm font-medium hover:text-water transition-colors">
            Gás
          </Link>
          <Link to="/order-history" className="text-sm font-medium hover:text-water transition-colors flex items-center gap-1">
            <Clock className="h-4 w-4" /> Meus Pedidos
          </Link>
          <Link to="/about" className="text-sm font-medium hover:text-water transition-colors">
            Sobre
          </Link>
          
          {/* Menu de Administração */}
          <DropdownMenu open={isAdminMenuOpen} onOpenChange={setIsAdminMenuOpen}>
            <DropdownMenuTrigger asChild>
              <button className="flex items-center text-sm font-medium hover:text-water transition-colors">
                Administração <ChevronDown className="ml-1 h-4 w-4" />
              </button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="w-56">
              <DropdownMenuItem asChild>
                <Link to={isAdminAuthenticated ? "/crm" : "/admin/login"} className="flex w-full cursor-pointer items-center gap-2">
                  <BarChart className="h-4 w-4" />
                  CRM
                </Link>
              </DropdownMenuItem>
              <DropdownMenuItem asChild>
                <Link to={isAdminAuthenticated ? "/admin/settings" : "/admin/login"} className="flex w-full cursor-pointer">
                  Configurações
                </Link>
              </DropdownMenuItem>
              <DropdownMenuItem asChild>
                <Link to={isAdminAuthenticated ? "/admin/products" : "/admin/login"} className="flex w-full cursor-pointer">
                  Gerenciar Produtos
                </Link>
              </DropdownMenuItem>
              <DropdownMenuItem asChild>
                <Link to={isAdminAuthenticated ? "/admin/delivery-fees" : "/admin/login"} className="flex w-full cursor-pointer">
                  Taxas de Entrega
                </Link>
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </nav>
        
        <div className="flex items-center space-x-4">
          {/* Botão de Logout Admin (apenas quando logado) */}
          {isAdminAuthenticated && (
            <AdminLogoutButton />
          )}
          
          {/* Menu de Administração Mobile */}
          <div className="md:hidden">
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="outline" size="icon">
                  <Settings className="h-5 w-5" />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end">
                <DropdownMenuItem asChild>
                  <Link to={isAdminAuthenticated ? "/crm" : "/admin/login"} className="flex w-full cursor-pointer items-center gap-2">
                    <BarChart className="h-4 w-4" />
                    CRM
                  </Link>
                </DropdownMenuItem>
                <DropdownMenuItem asChild>
                  <Link to={isAdminAuthenticated ? "/admin/settings" : "/admin/login"} className="flex w-full cursor-pointer">
                    Configurações
                  </Link>
                </DropdownMenuItem>
                <DropdownMenuItem asChild>
                  <Link to={isAdminAuthenticated ? "/admin/products" : "/admin/login"} className="flex w-full cursor-pointer">
                    Gerenciar Produtos
                  </Link>
                </DropdownMenuItem>
                <DropdownMenuItem asChild>
                  <Link to={isAdminAuthenticated ? "/admin/delivery-fees" : "/admin/login"} className="flex w-full cursor-pointer">
                    Taxas de Entrega
                  </Link>
                </DropdownMenuItem>
                <DropdownMenuItem asChild>
                  <Link to="/order-history" className="flex w-full cursor-pointer">
                    Histórico de Pedidos
                  </Link>
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
          
          <Link to="/cart">
            <Button variant="outline" size="icon" className="relative">
              <ShoppingCart className="h-5 w-5" />
              {totalItems > 0 && (
                <Badge className="absolute -top-2 -right-2 px-1.5 py-0.5 min-w-[1.25rem] min-h-[1.25rem] flex items-center justify-center bg-water text-white">
                  {totalItems}
                </Badge>
              )}
            </Button>
          </Link>
        </div>
      </div>
    </header>
  );
};

export default Header;

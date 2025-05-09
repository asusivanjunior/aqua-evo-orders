
import React from 'react';
import { ShoppingCart } from 'lucide-react';
import { Link } from 'react-router-dom';
import { useCart } from '@/contexts/CartContext';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';

const Header = () => {
  const { totalItems } = useCart();

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
          <Link to="/about" className="text-sm font-medium hover:text-water transition-colors">
            Sobre
          </Link>
        </nav>
        
        <div className="flex items-center space-x-4">
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

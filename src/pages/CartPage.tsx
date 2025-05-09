
import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useCart } from '@/contexts/CartContext';
import Header from '@/components/Header';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Trash2, ShoppingCart, ArrowRight, Plus, Minus } from 'lucide-react';

const CartPage = () => {
  const { items, removeFromCart, updateQuantity, totalPrice } = useCart();
  const navigate = useNavigate();
  
  if (items.length === 0) {
    return (
      <div className="min-h-screen flex flex-col">
        <Header />
        <div className="flex-grow container mx-auto px-4 py-12 flex flex-col items-center justify-center">
          <div className="text-center">
            <ShoppingCart className="h-16 w-16 mx-auto text-gray-400 mb-4" />
            <h1 className="text-2xl font-bold mb-4">Seu carrinho está vazio</h1>
            <p className="text-gray-600 mb-8">Adicione produtos ao carrinho para continuar.</p>
            <Button asChild className="bg-water hover:bg-water-dark">
              <Link to="/">Continuar Comprando</Link>
            </Button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex flex-col">
      <Header />
      
      <div className="container mx-auto px-4 py-8 flex-grow">
        <h1 className="text-2xl font-bold mb-6">Seu Carrinho</h1>
        
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          <div className="col-span-2">
            {items.map((item, index) => {
              const { product, selectedSize, quantity } = item;
              const itemPrice = (product.price + selectedSize.additionalPrice) * quantity;
              const bgColor = product.type === 'water' ? 'bg-water-light' : 'bg-gas-light';
              
              return (
                <Card key={`${product.id}-${selectedSize.id}`} className="mb-4">
                  <CardContent className="p-4">
                    <div className="flex flex-col sm:flex-row items-start gap-4">
                      <div className={`${bgColor} rounded-lg p-3 flex-shrink-0 w-24 h-24 flex items-center justify-center`}>
                        <img
                          src={product.image || `/placeholder.svg`} 
                          alt={product.name}
                          className="object-contain max-h-full max-w-full"
                          onError={(e) => {
                            (e.target as HTMLImageElement).src = '/placeholder.svg';
                          }}
                        />
                      </div>
                      
                      <div className="flex-grow">
                        <div className="flex justify-between">
                          <h3 className="font-semibold">{product.name}</h3>
                          <p className="font-bold">R$ {itemPrice.toFixed(2)}</p>
                        </div>
                        <p className="text-sm text-gray-600">{selectedSize.name}</p>
                        
                        <div className="flex justify-between items-center mt-4">
                          <div className="flex items-center">
                            <Button
                              variant="outline"
                              size="icon"
                              className="h-8 w-8"
                              onClick={() => updateQuantity(index, quantity - 1)}
                              disabled={quantity <= 1}
                            >
                              <Minus className="h-3 w-3" />
                            </Button>
                            <span className="mx-3">{quantity}</span>
                            <Button
                              variant="outline"
                              size="icon"
                              className="h-8 w-8"
                              onClick={() => updateQuantity(index, quantity + 1)}
                            >
                              <Plus className="h-3 w-3" />
                            </Button>
                          </div>
                          
                          <Button
                            variant="ghost"
                            size="sm"
                            className="text-red-500 hover:text-red-700 hover:bg-red-50"
                            onClick={() => removeFromCart(index)}
                          >
                            <Trash2 className="h-4 w-4 mr-1" />
                            Remover
                          </Button>
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              );
            })}
            
            <div className="mt-8">
              <Button asChild variant="outline" className="gap-2">
                <Link to="/">
                  <ShoppingCart className="h-4 w-4" />
                  Continuar Comprando
                </Link>
              </Button>
            </div>
          </div>
          
          <div>
            <Card>
              <CardContent className="p-6">
                <h2 className="text-xl font-bold mb-6">Resumo do Pedido</h2>
                
                <div className="space-y-4 mb-6">
                  <div className="flex justify-between">
                    <span className="text-gray-600">Subtotal</span>
                    <span>R$ {totalPrice.toFixed(2)}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">Frete</span>
                    <span>Grátis</span>
                  </div>
                  <div className="border-t pt-4 flex justify-between font-bold">
                    <span>Total</span>
                    <span>R$ {totalPrice.toFixed(2)}</span>
                  </div>
                </div>
                
                <Button 
                  className="w-full bg-water hover:bg-water-dark gap-2"
                  onClick={() => navigate('/checkout')}
                >
                  Finalizar Pedido
                  <ArrowRight className="h-4 w-4" />
                </Button>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
      
      <footer className="bg-gray-100 py-8">
        <div className="container mx-auto px-4 text-center text-gray-500 text-sm">
          <p>© {new Date().getFullYear()} Águas & Gás Delivery. Todos os direitos reservados.</p>
        </div>
      </footer>
    </div>
  );
};

export default CartPage;

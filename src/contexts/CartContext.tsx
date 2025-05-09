
import React, { createContext, useContext, useState, ReactNode } from 'react';
import { CartItem, Product, ProductSize } from '@/types';
import { useToast } from '@/components/ui/use-toast';

type CartContextType = {
  items: CartItem[];
  addToCart: (product: Product, selectedSize: ProductSize, quantity: number) => void;
  removeFromCart: (itemIndex: number) => void;
  updateQuantity: (itemIndex: number, quantity: number) => void;
  clearCart: () => void;
  totalItems: number;
  totalPrice: number;
};

const CartContext = createContext<CartContextType | undefined>(undefined);

export const CartProvider = ({ children }: { children: ReactNode }) => {
  const [items, setItems] = useState<CartItem[]>([]);
  const { toast } = useToast();

  const addToCart = (product: Product, selectedSize: ProductSize, quantity: number) => {
    const existingItemIndex = items.findIndex(
      item => item.product.id === product.id && item.selectedSize.id === selectedSize.id
    );

    if (existingItemIndex >= 0) {
      const updatedItems = [...items];
      updatedItems[existingItemIndex].quantity += quantity;
      setItems(updatedItems);
    } else {
      setItems([...items, { product, selectedSize, quantity }]);
    }
    
    toast({
      title: "Produto adicionado",
      description: `${quantity}x ${product.name} (${selectedSize.name}) adicionado ao carrinho.`,
    });
  };

  const removeFromCart = (itemIndex: number) => {
    const newItems = [...items];
    newItems.splice(itemIndex, 1);
    setItems(newItems);
    
    toast({
      title: "Produto removido",
      description: "Item removido do carrinho.",
    });
  };

  const updateQuantity = (itemIndex: number, quantity: number) => {
    if (quantity < 1) return;
    
    const newItems = [...items];
    newItems[itemIndex].quantity = quantity;
    setItems(newItems);
  };

  const clearCart = () => {
    setItems([]);
  };

  const totalItems = items.reduce((sum, item) => sum + item.quantity, 0);

  const totalPrice = items.reduce(
    (sum, item) => 
      sum + (item.product.price + item.selectedSize.additionalPrice) * item.quantity, 
    0
  );

  return (
    <CartContext.Provider
      value={{
        items,
        addToCart,
        removeFromCart,
        updateQuantity,
        clearCart,
        totalItems,
        totalPrice,
      }}
    >
      {children}
    </CartContext.Provider>
  );
};

export const useCart = (): CartContextType => {
  const context = useContext(CartContext);
  if (context === undefined) {
    throw new Error('useCart must be used within a CartProvider');
  }
  return context;
};

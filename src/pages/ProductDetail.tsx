
import React, { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { getProductById } from '@/data/products';
import { Product, ProductSize } from '@/types';
import { useCart } from '@/contexts/CartContext';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import Header from '@/components/Header';
import { ArrowLeft, Minus, Plus, ShoppingCart } from 'lucide-react';

const ProductDetail = () => {
  const { id } = useParams<{ id: string }>();
  const [product, setProduct] = useState<Product | null>(null);
  const [selectedSize, setSelectedSize] = useState<ProductSize | null>(null);
  const [quantity, setQuantity] = useState(1);
  const { addToCart } = useCart();
  
  useEffect(() => {
    if (id) {
      const foundProduct = getProductById(id);
      if (foundProduct) {
        setProduct(foundProduct);
        setSelectedSize(foundProduct.sizes[0]); // Default to first size
      }
    }
  }, [id]);

  if (!product || !selectedSize) {
    return (
      <div className="min-h-screen flex flex-col">
        <Header />
        <div className="container mx-auto px-4 py-12 flex-grow flex items-center justify-center">
          <p className="text-lg text-gray-600">Carregando produto...</p>
        </div>
      </div>
    );
  }

  const totalPrice = (product.price + selectedSize.additionalPrice) * quantity;
  const bgColor = product.type === 'water' ? 'bg-water-light' : 'bg-gas-light';
  const buttonColor = product.type === 'water' ? 'bg-water hover:bg-water-dark' : 'bg-gas hover:bg-gas-dark';
  const textColor = product.type === 'water' ? 'text-water-dark' : 'text-gas-dark';

  const decrementQuantity = () => {
    if (quantity > 1) setQuantity(quantity - 1);
  };

  const incrementQuantity = () => {
    setQuantity(quantity + 1);
  };

  const handleAddToCart = () => {
    if (product && selectedSize) {
      addToCart(product, selectedSize, quantity);
    }
  };

  return (
    <div className="min-h-screen flex flex-col">
      <Header />
      
      <div className="container mx-auto px-4 py-8">
        <Link to={`/products/${product.type}`} className="inline-flex items-center text-sm text-gray-600 hover:text-water mb-6">
          <ArrowLeft className="h-4 w-4 mr-1" />
          Voltar para {product.type === 'water' ? 'Água Mineral' : 'Gás de Cozinha'}
        </Link>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          <div className={`${bgColor} rounded-lg p-8 flex items-center justify-center`}>
            <div className="relative h-64 w-64">
              <img
                src={product.image || `/placeholder.svg`} 
                alt={product.name}
                className="object-contain h-full w-full"
                onError={(e) => {
                  (e.target as HTMLImageElement).src = '/placeholder.svg';
                }}
              />
            </div>
          </div>
          
          <div>
            <h1 className="text-3xl font-bold mb-2">{product.name}</h1>
            <p className={`${textColor} text-xl font-semibold mb-4`}>
              R$ {totalPrice.toFixed(2)}
            </p>
            <p className="text-gray-600 mb-6">{product.description}</p>
            
            <div className="mb-6">
              <h3 className="font-medium mb-3">Tamanho</h3>
              <RadioGroup 
                value={selectedSize.id} 
                onValueChange={(value) => {
                  const size = product.sizes.find(s => s.id === value);
                  if (size) setSelectedSize(size);
                }}
                className="grid grid-cols-1 sm:grid-cols-2 gap-3"
              >
                {product.sizes.map((size) => (
                  <div key={size.id} className="flex items-center space-x-2">
                    <RadioGroupItem value={size.id} id={size.id} />
                    <Label htmlFor={size.id} className="flex justify-between w-full">
                      <span>{size.name}</span>
                      <span className={selectedSize.id === size.id ? textColor : 'text-gray-500'}>
                        {size.additionalPrice >= 0 
                          ? `+R$ ${size.additionalPrice.toFixed(2)}` 
                          : `-R$ ${Math.abs(size.additionalPrice).toFixed(2)}`}
                      </span>
                    </Label>
                  </div>
                ))}
              </RadioGroup>
            </div>
            
            <div className="mb-8">
              <h3 className="font-medium mb-3">Quantidade</h3>
              <div className="flex items-center">
                <Button
                  variant="outline"
                  size="icon"
                  onClick={decrementQuantity}
                  disabled={quantity <= 1}
                >
                  <Minus className="h-4 w-4" />
                </Button>
                <Input
                  type="number"
                  min="1"
                  value={quantity}
                  onChange={(e) => setQuantity(parseInt(e.target.value) || 1)}
                  className="w-16 mx-2 text-center"
                />
                <Button variant="outline" size="icon" onClick={incrementQuantity}>
                  <Plus className="h-4 w-4" />
                </Button>
              </div>
            </div>
            
            <Button 
              onClick={handleAddToCart} 
              className={`w-full ${buttonColor} text-white`}
            >
              <ShoppingCart className="h-5 w-5 mr-2" />
              Adicionar ao Carrinho
            </Button>
          </div>
        </div>
      </div>
      
      <footer className="bg-gray-100 py-8 mt-auto">
        <div className="container mx-auto px-4 text-center text-gray-500 text-sm">
          <p>© {new Date().getFullYear()} Águas & Gás Delivery. Todos os direitos reservados.</p>
        </div>
      </footer>
    </div>
  );
};

export default ProductDetail;

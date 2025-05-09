
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Card, CardContent, CardFooter } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Product } from '@/types';

interface ProductCardProps {
  product: Product;
}

const ProductCard: React.FC<ProductCardProps> = ({ product }) => {
  const navigate = useState();
  const { id, name, price, image, type } = product;
  
  const bgColor = type === 'water' ? 'bg-water-light' : 'bg-gas-light';
  const borderColor = type === 'water' ? 'border-water' : 'border-gas';
  const textColor = type === 'water' ? 'text-water-dark' : 'text-gas-dark';

  return (
    <Card className={`overflow-hidden transition-all hover:shadow-lg ${borderColor} border`}>
      <div className={`${bgColor} p-4 flex items-center justify-center h-48`}>
        <div className="relative h-40 w-40">
          <div className="absolute inset-0 flex items-center justify-center">
            <img
              src={image || `/placeholder.svg`} 
              alt={name}
              className="object-contain h-full w-full"
              onError={(e) => {
                (e.target as HTMLImageElement).src = '/placeholder.svg';
              }}
            />
          </div>
        </div>
      </div>
      
      <CardContent className="p-4">
        <h3 className="font-semibold text-lg truncate">{name}</h3>
        <p className={`mt-1 font-semibold text-lg ${textColor}`}>
          A partir de R$ {price.toFixed(2)}
        </p>
      </CardContent>
      
      <CardFooter className="p-4 pt-0">
        <Button 
          className="w-full" 
          onClick={() => navigate(`/product/${id}`)}
          variant="outline"
        >
          Ver opções
        </Button>
      </CardFooter>
    </Card>
  );
};

export default ProductCard;

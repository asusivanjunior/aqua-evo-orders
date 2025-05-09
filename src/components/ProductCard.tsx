
import React from "react";
import { Link } from "react-router-dom";
import { Product } from "@/types";
import { Card, CardContent, CardFooter } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { ShoppingCart } from "lucide-react";

interface ProductCardProps {
  product: Product;
}

const ProductCard: React.FC<ProductCardProps> = ({ product }) => {
  return (
    <Card className="overflow-hidden transition-all duration-300 hover:shadow-lg">
      <div className="aspect-square overflow-hidden">
        <img
          src={product.image}
          alt={product.name}
          className="w-full h-full object-cover transition-transform duration-300 hover:scale-105"
        />
      </div>
      <CardContent className="p-4">
        <h3 className="text-lg font-semibold">{product.name}</h3>
        <p className="text-sm text-gray-500 mb-2">
          {product.type === "water" ? "Água" : "Gás"}
        </p>
        <p className="text-lg font-bold text-water">
          R$ {product.price.toFixed(2)}
        </p>
        <p className="text-sm line-clamp-2 text-gray-600 mt-2">
          {product.description}
        </p>
      </CardContent>
      <CardFooter className="p-4 pt-0 flex justify-between">
        <Link
          to={`/product/${product.id}`}
          className="text-water hover:underline text-sm"
        >
          Ver detalhes
        </Link>
        <Button
          variant="ghost"
          size="icon"
          className="text-water hover:text-water-dark hover:bg-blue-50"
          asChild
        >
          <Link to={`/product/${product.id}`}>
            <ShoppingCart size={18} />
          </Link>
        </Button>
      </CardFooter>
    </Card>
  );
};

export default ProductCard;


import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import Header from '@/components/Header';
import ProductCard from '@/components/ProductCard';
import { getProductsByType } from '@/data/products';
import { Product } from '@/types';
import { Droplets, Flame } from 'lucide-react';

const ProductsPage = () => {
  const { type } = useParams<{ type: string }>();
  const [products, setProducts] = useState<Product[]>([]);
  
  useEffect(() => {
    if (type === 'water' || type === 'gas') {
      setProducts(getProductsByType(type));
    }
  }, [type]);

  const pageTitle = type === 'water' ? 'Água Mineral' : 'Gás de Cozinha';
  const pageIcon = type === 'water' ? <Droplets className="h-6 w-6" /> : <Flame className="h-6 w-6" />;
  const bgColor = type === 'water' ? 'bg-water' : 'bg-gas';

  return (
    <div className="min-h-screen flex flex-col">
      <Header />
      
      <section className={`py-12 ${bgColor} text-white`}>
        <div className="container mx-auto px-4">
          <div className="flex items-center gap-3">
            {pageIcon}
            <h1 className="text-3xl font-bold">{pageTitle}</h1>
          </div>
        </div>
      </section>
      
      <section className="py-12 flex-grow">
        <div className="container mx-auto px-4">
          {products.length > 0 ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
              {products.map((product) => (
                <ProductCard key={product.id} product={product} />
              ))}
            </div>
          ) : (
            <div className="text-center py-12">
              <p className="text-lg text-gray-600">Nenhum produto encontrado.</p>
            </div>
          )}
        </div>
      </section>
      
      <footer className="bg-gray-100 py-8">
        <div className="container mx-auto px-4 text-center text-gray-500 text-sm">
          <p>© {new Date().getFullYear()} Águas & Gás Delivery. Todos os direitos reservados.</p>
        </div>
      </footer>
    </div>
  );
};

export default ProductsPage;

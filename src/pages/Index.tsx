import React from 'react';
import { Link } from 'react-router-dom';
import { Droplets, Flame, ArrowRight, ShoppingBag, Clock, ThumbsUp, Settings } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import Header from '@/components/Header';
import { products } from '@/data/products';
import ProductCard from '@/components/ProductCard';

const Index = () => {
  const waterProducts = products.filter(product => product.type === 'water').slice(0, 2);
  const gasProducts = products.filter(product => product.type === 'gas').slice(0, 2);

  return (
    <div className="min-h-screen flex flex-col">
      <Header />
      
      {/* Hero Section */}
      <section className="relative py-20 bg-gradient-to-br from-water to-water-dark text-white">
        <div className="container mx-auto px-4 relative z-10">
          <div className="max-w-3xl">
            <h1 className="text-4xl md:text-5xl font-bold mb-6">
              Entrega de Água e Gás direto na sua casa
            </h1>
            <p className="text-lg mb-8 text-white/90">
              Receba água mineral refrescante e gás de cozinha com rapidez e segurança. Faça seu pedido em poucos cliques.
            </p>
            <div className="flex flex-wrap gap-4">
              <Button asChild size="lg" className="bg-white text-water-dark hover:bg-white/90">
                <Link to="/products/water">
                  <Droplets className="mr-2 h-5 w-5" />
                  Comprar Água
                </Link>
              </Button>
              <Button asChild size="lg" variant="outline" className="bg-transparent border-white text-white hover:bg-white/10">
                <Link to="/products/gas">
                  <Flame className="mr-2 h-5 w-5" />
                  Comprar Gás
                </Link>
              </Button>
            </div>
            
            {/* Botão de Administração */}
            <div className="mt-4">
              <Button asChild variant="ghost" size="sm" className="text-white/80 hover:text-white hover:bg-white/10">
                <Link to="/admin/settings">
                  <Settings className="mr-2 h-4 w-4" />
                  Área Administrativa
                </Link>
              </Button>
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-20 bg-slate-50">
        <div className="container mx-auto px-4">
          <h2 className="text-3xl font-bold text-center mb-12">Como funciona</h2>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <Card>
              <CardContent className="pt-6">
                <div className="rounded-full bg-water/10 p-3 w-12 h-12 flex items-center justify-center mb-4">
                  <ShoppingBag className="h-6 w-6 text-water" />
                </div>
                <h3 className="text-xl font-semibold mb-2">Escolha seu produto</h3>
                <p className="text-gray-600">
                  Selecione entre nossa variedade de água mineral e botijões de gás nos diversos tamanhos disponíveis.
                </p>
              </CardContent>
            </Card>
            
            <Card>
              <CardContent className="pt-6">
                <div className="rounded-full bg-water/10 p-3 w-12 h-12 flex items-center justify-center mb-4">
                  <Clock className="h-6 w-6 text-water" />
                </div>
                <h3 className="text-xl font-semibold mb-2">Entrega rápida</h3>
                <p className="text-gray-600">
                  Receba seu pedido no mesmo dia, com nossa entrega expressa para toda a cidade.
                </p>
              </CardContent>
            </Card>
            
            <Card>
              <CardContent className="pt-6">
                <div className="rounded-full bg-water/10 p-3 w-12 h-12 flex items-center justify-center mb-4">
                  <ThumbsUp className="h-6 w-6 text-water" />
                </div>
                <h3 className="text-xl font-semibold mb-2">Qualidade garantida</h3>
                <p className="text-gray-600">
                  Trabalhamos apenas com as melhores marcas do mercado, garantindo sua segurança e satisfação.
                </p>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* Products Showcase */}
      <section className="py-20">
        <div className="container mx-auto px-4">
          <div className="mb-16">
            <h2 className="text-3xl font-bold mb-8">Água Mineral</h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
              {waterProducts.map((product) => (
                <ProductCard key={product.id} product={product} />
              ))}
              <div className="flex items-center justify-center">
                <Button asChild variant="ghost" className="w-full h-full">
                  <Link to="/products/water" className="flex flex-col items-center justify-center gap-4 p-8">
                    <ArrowRight className="h-12 w-12 text-water" />
                    <span className="text-lg font-medium">Ver todos</span>
                  </Link>
                </Button>
              </div>
            </div>
          </div>
          
          <div>
            <h2 className="text-3xl font-bold mb-8">Gás de Cozinha</h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
              {gasProducts.map((product) => (
                <ProductCard key={product.id} product={product} />
              ))}
              <div className="flex items-center justify-center">
                <Button asChild variant="ghost" className="w-full h-full">
                  <Link to="/products/gas" className="flex flex-col items-center justify-center gap-4 p-8">
                    <ArrowRight className="h-12 w-12 text-gas" />
                    <span className="text-lg font-medium">Ver todos</span>
                  </Link>
                </Button>
              </div>
            </div>
          </div>
        </div>
      </section>
      
      {/* CTA Section */}
      <section className="py-20 bg-slate-900 text-white">
        <div className="container mx-auto px-4 text-center">
          <h2 className="text-3xl font-bold mb-6">Pronto para fazer seu pedido?</h2>
          <p className="text-lg mb-8 max-w-2xl mx-auto text-gray-300">
            Entregamos água e gás de qualidade diretamente na sua porta com rapidez e segurança.
          </p>
          <Button asChild size="lg" className="bg-water hover:bg-water-dark">
            <Link to="/products/water">Fazer Pedido Agora</Link>
          </Button>
        </div>
      </section>
      
      {/* Footer */}
      <footer className="bg-gray-100 py-12">
        <div className="container mx-auto px-4">
          <div className="flex flex-col md:flex-row justify-between">
            <div className="mb-8 md:mb-0">
              <h3 className="text-lg font-bold mb-4">Águas & Gás</h3>
              <p className="text-gray-600 max-w-xs">
                Entrega de água mineral e gás de cozinha com qualidade e rapidez.
              </p>
            </div>
            
            <div className="grid grid-cols-2 md:grid-cols-3 gap-8">
              <div>
                <h4 className="font-semibold mb-3">Produtos</h4>
                <ul className="space-y-2">
                  <li><Link to="/products/water" className="text-gray-600 hover:text-water">Água Mineral</Link></li>
                  <li><Link to="/products/gas" className="text-gray-600 hover:text-water">Gás de Cozinha</Link></li>
                </ul>
              </div>
              
              <div>
                <h4 className="font-semibold mb-3">Empresa</h4>
                <ul className="space-y-2">
                  <li><Link to="/about" className="text-gray-600 hover:text-water">Sobre Nós</Link></li>
                  <li><Link to="/contact" className="text-gray-600 hover:text-water">Contato</Link></li>
                </ul>
              </div>
              
              <div>
                <h4 className="font-semibold mb-3">Contato</h4>
                <ul className="space-y-2 text-gray-600">
                  <li>(XX) XXXXX-XXXX</li>
                  <li>contato@aguasegasdelivery.com</li>
                </ul>
              </div>
            </div>
          </div>
          
          <div className="border-t border-gray-200 mt-12 pt-8 text-center text-gray-500 text-sm">
            <p>© {new Date().getFullYear()} Águas & Gás Delivery. Todos os direitos reservados.</p>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default Index;

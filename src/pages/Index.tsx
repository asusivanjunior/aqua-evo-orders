import React from 'react';
import { Link } from 'react-router-dom';
import { Droplets, Flame, ArrowRight, ShoppingBag, Clock, ThumbsUp, Settings } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import Header from '@/components/Header';
import { useAdminAuth } from '@/contexts/AdminAuthContext';

const Index = () => {
  const { isAdminAuthenticated } = useAdminAuth();

  return (
    <div className="flex flex-col min-h-screen">
      <Header />
      
      {/* Hero Section */}
      <section className="relative py-16 md:py-24 bg-gradient-to-br from-water to-water-dark text-white overflow-hidden">
        <div className="absolute inset-0 bg-[url('/water-gas.png')] bg-cover bg-center opacity-20"></div>
        
        <div className="container mx-auto px-4 relative z-10">
          <div className="max-w-3xl">
            <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold mb-6">
              Água e Gás direto na sua casa
            </h1>
            <p className="text-lg md:text-xl opacity-90 mb-8">
              Entrega rápida, segura e com os melhores preços do mercado.
              Faça seu pedido online e receba em minutos.
            </p>
            <div className="flex flex-wrap gap-4">
              <Button asChild size="lg" className="bg-white text-water hover:bg-gray-100">
                <Link to="/products/water">
                  <Droplets className="mr-2 h-4 w-4" />
                  Pedir Água
                </Link>
              </Button>
              <Button asChild size="lg" className="bg-gas text-white hover:bg-gas-dark">
                <Link to="/products/gas">
                  <Flame className="mr-2 h-4 w-4" />
                  Pedir Gás
                </Link>
              </Button>
            </div>
            
            {/* Botão de Administração */}
            <div className="mt-4">
              <Button asChild variant="ghost" size="sm" className="text-white/80 hover:text-white hover:bg-white/10">
                <Link to={isAdminAuthenticated ? "/admin/settings" : "/admin/login"}>
                  <Settings className="mr-2 h-4 w-4" />
                  Área Administrativa
                </Link>
              </Button>
            </div>
          </div>
        </div>
      </section>
      
      {/* Nossos Benefícios */}
      <section className="py-12 md:py-16">
        <div className="container mx-auto px-4">
          <h2 className="text-3xl font-bold text-center mb-8">Nossos Benefícios</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {/* Entrega Rápida */}
            <Card className="shadow-md">
              <CardContent className="p-6 flex flex-col items-center text-center">
                <Clock className="h-10 w-10 text-water mb-4" />
                <h3 className="text-xl font-semibold mb-2">Entrega Rápida</h3>
                <p className="text-gray-600">Receba seu pedido em tempo recorde, sem sair de casa.</p>
              </CardContent>
            </Card>
            
            {/* Produtos de Qualidade */}
            <Card className="shadow-md">
              <CardContent className="p-6 flex flex-col items-center text-center">
                <ThumbsUp className="h-10 w-10 text-water mb-4" />
                <h3 className="text-xl font-semibold mb-2">Produtos de Qualidade</h3>
                <p className="text-gray-600">Trabalhamos apenas com marcas de confiança e produtos certificados.</p>
              </CardContent>
            </Card>
            
            {/* Compra Facilitada */}
            <Card className="shadow-md">
              <CardContent className="p-6 flex flex-col items-center text-center">
                <ShoppingBag className="h-10 w-10 text-water mb-4" />
                <h3 className="text-xl font-semibold mb-2">Compra Facilitada</h3>
                <p className="text-gray-600">Peça online de forma rápida e segura, com diversas opções de pagamento.</p>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>
      
      {/* Features Section */}
      <section className="py-12 md:py-16 bg-gray-50">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 items-center">
            {/* Feature Image */}
            <div>
              <img 
                src="/feature-agua-gas.png"
                alt="Água e Gás"
                className="rounded-lg shadow-lg"
              />
            </div>
            
            {/* Feature Description */}
            <div>
              <h2 className="text-3xl font-bold mb-4">
                A melhor solução para sua casa
              </h2>
              <p className="text-gray-700 text-lg mb-6">
                Comodidade, segurança e economia em um só lugar.
                Tenha água e gás de qualidade sempre à disposição,
                com a facilidade que você merece.
              </p>
              <ul className="space-y-2">
                <li className="flex items-center gap-2">
                  <ArrowRight className="text-water h-5 w-5" />
                  Entrega programada
                </li>
                <li className="flex items-center gap-2">
                  <ArrowRight className="text-water h-5 w-5" />
                  Pagamento facilitado
                </li>
                <li className="flex items-center gap-2">
                  <ArrowRight className="text-water h-5 w-5" />
                  Atendimento personalizado
                </li>
              </ul>
            </div>
          </div>
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

export default Index;

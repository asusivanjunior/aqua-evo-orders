
import React from 'react';
import { Link } from 'react-router-dom';
import { CheckCircle } from 'lucide-react';
import Header from '@/components/Header';
import { Button } from '@/components/ui/button';

const OrderConfirmation = () => {
  return (
    <div className="min-h-screen flex flex-col">
      <Header />
      
      <div className="flex-grow container mx-auto px-4 py-16 flex flex-col items-center justify-center">
        <div className="text-center max-w-md">
          <div className="mx-auto rounded-full bg-green-100 p-3 w-16 h-16 flex items-center justify-center mb-6">
            <CheckCircle className="h-8 w-8 text-green-600" />
          </div>
          
          <h1 className="text-2xl font-bold mb-4">Pedido Confirmado!</h1>
          
          <p className="text-gray-600 mb-8">
            Recebemos seu pedido com sucesso. Em breve entraremos em contato para confirmar os detalhes da entrega.
          </p>
          
          <Button asChild className="bg-water hover:bg-water-dark">
            <Link to="/">Voltar para Início</Link>
          </Button>
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

export default OrderConfirmation;

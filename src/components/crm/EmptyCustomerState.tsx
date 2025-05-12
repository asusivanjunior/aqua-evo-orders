
import React from 'react';
import { User } from 'lucide-react';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';

interface EmptyCustomerStateProps {
  onAddCustomer: () => void;
}

const EmptyCustomerState = ({ onAddCustomer }: EmptyCustomerStateProps) => {
  return (
    <Card>
      <CardContent className="flex flex-col items-center justify-center p-12">
        <div className="bg-gray-100 rounded-full p-6 mb-4">
          <User className="h-12 w-12 text-gray-400" />
        </div>
        <h2 className="text-xl font-medium mb-2">Nenhum cliente encontrado</h2>
        <p className="text-gray-500 mb-6 text-center">
          Você ainda não tem nenhum cliente registrado. Adicione seu primeiro cliente ou faça pedidos para gerar clientes automaticamente.
        </p>
        <Button onClick={onAddCustomer}>Adicionar Cliente</Button>
      </CardContent>
    </Card>
  );
};

export default EmptyCustomerState;

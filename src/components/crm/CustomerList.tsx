
import React from 'react';
import { Customer } from '@/types';
import { Card, CardContent } from '@/components/ui/card';
import { 
  Table, 
  TableBody, 
  TableCell, 
  TableHead, 
  TableHeader, 
  TableRow 
} from '@/components/ui/table';
import { Button } from '@/components/ui/button';

interface CustomerListProps {
  customers: Customer[];
  onViewCustomer: (customer: Customer) => void;
}

const CustomerList = ({ customers, onViewCustomer }: CustomerListProps) => {
  return (
    <Card className="mb-6">
      <CardContent className="p-0">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Nome</TableHead>
              <TableHead>Telefone</TableHead>
              <TableHead className="hidden md:table-cell">Endereço</TableHead>
              <TableHead className="hidden lg:table-cell">Total de Pedidos</TableHead>
              <TableHead className="hidden lg:table-cell">Último Pedido</TableHead>
              <TableHead className="text-right">Ações</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {customers.map((customer) => (
              <TableRow key={customer.id}>
                <TableCell className="font-medium">{customer.name}</TableCell>
                <TableCell>{customer.phone}</TableCell>
                <TableCell className="hidden md:table-cell">{customer.address}</TableCell>
                <TableCell className="hidden lg:table-cell">{customer.totalOrders}</TableCell>
                <TableCell className="hidden lg:table-cell">{customer.lastOrderDate || 'N/A'}</TableCell>
                <TableCell className="text-right">
                  <Button variant="outline" size="sm" onClick={() => onViewCustomer(customer)}>
                    Ver Detalhes
                  </Button>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </CardContent>
    </Card>
  );
};

export default CustomerList;

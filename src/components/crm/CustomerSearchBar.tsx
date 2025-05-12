
import React from 'react';
import { Search, UserPlus } from 'lucide-react';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';

interface CustomerSearchBarProps {
  searchTerm: string;
  onSearchChange: (term: string) => void;
  onAddCustomer: () => void;
}

const CustomerSearchBar = ({ searchTerm, onSearchChange, onAddCustomer }: CustomerSearchBarProps) => {
  return (
    <div className="flex flex-col sm:flex-row gap-4 sm:items-center w-full sm:w-auto">
      <div className="relative w-full sm:w-64">
        <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
        <Input
          placeholder="Buscar clientes..."
          value={searchTerm}
          onChange={(e) => onSearchChange(e.target.value)}
          className="pl-9"
        />
      </div>
      
      <Button onClick={onAddCustomer} className="whitespace-nowrap flex gap-2 items-center">
        <UserPlus className="h-4 w-4" />
        Adicionar Cliente
      </Button>
    </div>
  );
};

export default CustomerSearchBar;

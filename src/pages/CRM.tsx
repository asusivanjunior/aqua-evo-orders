
import React, { useState } from 'react';
import Header from '@/components/Header';
import { useCustomers } from '@/hooks/useCustomers';
import CustomerList from '@/components/crm/CustomerList';
import CustomerDetails from '@/components/crm/CustomerDetails';
import AddCustomerDialog from '@/components/crm/AddCustomerDialog';
import EmptyCustomerState from '@/components/crm/EmptyCustomerState';
import CustomerSearchBar from '@/components/crm/CustomerSearchBar';

const CRM = () => {
  const {
    customers,
    filteredCustomers,
    searchTerm,
    setSearchTerm,
    selectedCustomer,
    setSelectedCustomer,
    handleAddCustomer,
    handleUpdateCustomer
  } = useCustomers();
  
  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false);

  // Visualizar detalhes do cliente
  const handleViewCustomer = (customer) => {
    setSelectedCustomer(customer);
  };

  return (
    <div className="min-h-screen flex flex-col">
      <Header />
      
      <div className="flex-grow container mx-auto px-4 py-8">
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-8 gap-4">
          <div>
            <h1 className="text-3xl font-bold">Gerenciamento de Clientes</h1>
            <p className="text-gray-500 mt-1">Visualize e gerencie seus clientes</p>
          </div>
          
          <CustomerSearchBar 
            searchTerm={searchTerm}
            onSearchChange={setSearchTerm}
            onAddCustomer={() => setIsAddDialogOpen(true)}
          />
        </div>
        
        {customers.length === 0 ? (
          <EmptyCustomerState onAddCustomer={() => setIsAddDialogOpen(true)} />
        ) : (
          <>
            <CustomerList 
              customers={filteredCustomers}
              onViewCustomer={handleViewCustomer}
            />
            
            <CustomerDetails 
              customer={selectedCustomer}
              open={!!selectedCustomer}
              onOpenChange={(open) => !open && setSelectedCustomer(null)}
              onUpdateCustomer={handleUpdateCustomer}
            />
          </>
        )}
        
        <AddCustomerDialog 
          open={isAddDialogOpen}
          onOpenChange={setIsAddDialogOpen}
          onAddCustomer={handleAddCustomer}
        />
      </div>
      
      <footer className="bg-gray-100 py-8">
        <div className="container mx-auto px-4 text-center text-gray-500 text-sm">
          <p>© {new Date().getFullYear()} Águas & Gás Delivery. Todos os direitos reservados.</p>
        </div>
      </footer>
    </div>
  );
};

export default CRM;

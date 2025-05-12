
import { useState, useEffect } from 'react';
import { Customer, Order } from '@/types';
import { toast } from '@/components/ui/use-toast';

export const useCustomers = () => {
  const [customers, setCustomers] = useState<Customer[]>([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCustomer, setSelectedCustomer] = useState<Customer | null>(null);

  // Carregar clientes do localStorage
  useEffect(() => {
    const loadCustomers = () => {
      try {
        // Carregar clientes do localStorage
        const savedCustomers = localStorage.getItem('customers');
        if (savedCustomers) {
          setCustomers(JSON.parse(savedCustomers));
        } else {
          // Verificar se há pedidos no histórico para extrair clientes
          const savedOrders = localStorage.getItem('orderHistory');
          if (savedOrders) {
            const orders: Order[] = JSON.parse(savedOrders);
            const extractedCustomers: Customer[] = extractCustomersFromOrders(orders);
            setCustomers(extractedCustomers);
            // Salvar os clientes extraídos
            localStorage.setItem('customers', JSON.stringify(extractedCustomers));
          }
        }
      } catch (error) {
        console.error('Erro ao carregar clientes:', error);
        toast({
          title: "Erro",
          description: "Não foi possível carregar os clientes"
        });
      }
    };

    loadCustomers();
  }, []);

  // Extrair clientes únicos do histórico de pedidos
  const extractCustomersFromOrders = (orders: Order[]): Customer[] => {
    const customerMap = new Map<string, { customer: Partial<Customer>; orderDates: string[] }>();
    
    orders.forEach(order => {
      if (!order.phone) return; // Ignorar pedidos sem telefone
      
      // Usar o telefone como identificador único
      const key = order.phone;
      const existingData = customerMap.get(key);
      
      const orderDate = order.orderDate || new Date().toLocaleDateString('pt-BR');
      
      if (existingData) {
        // Cliente já existe, apenas atualizar os dados
        existingData.orderDates.push(orderDate);
        // Sempre manter os dados mais recentes
        existingData.customer = {
          ...existingData.customer,
          name: order.customerName,
          address: order.address,
          neighborhood: order.neighborhood
        };
      } else {
        // Novo cliente
        customerMap.set(key, {
          customer: {
            name: order.customerName,
            phone: order.phone,
            address: order.address,
            neighborhood: order.neighborhood
          },
          orderDates: [orderDate]
        });
      }
    });
    
    // Converter o Map para um array de Customer
    return Array.from(customerMap.entries()).map(([phone, data]) => ({
      id: generateId(),
      name: data.customer.name || 'Cliente sem nome',
      phone,
      email: '',
      address: data.customer.address || '',
      neighborhood: data.customer.neighborhood,
      totalOrders: data.orderDates.length,
      lastOrderDate: data.orderDates.sort().pop(), // Pega a data mais recente
      notes: '',
      createdAt: new Date().toISOString()
    }));
  };

  // Gerar ID único
  const generateId = () => {
    return Math.random().toString(36).substring(2, 11);
  };

  // Filtrar clientes com base no termo de pesquisa
  const filteredCustomers = customers.filter(customer =>
    customer.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    customer.phone.includes(searchTerm) ||
    (customer.email && customer.email.toLowerCase().includes(searchTerm.toLowerCase())) ||
    customer.address.toLowerCase().includes(searchTerm.toLowerCase())
  );

  // Adicionar um novo cliente
  const handleAddCustomer = (data: Omit<Customer, 'id' | 'totalOrders' | 'createdAt'>) => {
    try {
      const newCustomer: Customer = {
        id: generateId(),
        ...data,
        totalOrders: 0,
        createdAt: new Date().toISOString()
      };
      
      const updatedCustomers = [...customers, newCustomer];
      setCustomers(updatedCustomers);
      localStorage.setItem('customers', JSON.stringify(updatedCustomers));
      
      toast({
        title: "Cliente adicionado",
        description: `${newCustomer.name} foi adicionado com sucesso.`
      });
      
      return true;
    } catch (error) {
      console.error('Erro ao adicionar cliente:', error);
      toast({
        title: "Erro",
        description: "Não foi possível adicionar o cliente"
      });
      return false;
    }
  };

  // Atualizar cliente
  const handleUpdateCustomer = (data: Partial<Customer>) => {
    if (!selectedCustomer) return false;
    
    try {
      const updatedCustomers = customers.map(c => 
        c.id === selectedCustomer.id ? { ...c, ...data } : c
      );
      
      setCustomers(updatedCustomers);
      localStorage.setItem('customers', JSON.stringify(updatedCustomers));
      
      toast({
        title: "Cliente atualizado",
        description: `As informações de ${data.name || selectedCustomer.name} foram atualizadas.`
      });
      
      return true;
    } catch (error) {
      console.error('Erro ao atualizar cliente:', error);
      toast({
        title: "Erro",
        description: "Não foi possível atualizar o cliente"
      });
      return false;
    }
  };

  return {
    customers,
    filteredCustomers,
    searchTerm,
    setSearchTerm,
    selectedCustomer,
    setSelectedCustomer,
    handleAddCustomer,
    handleUpdateCustomer
  };
};

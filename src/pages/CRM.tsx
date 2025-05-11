
import React, { useState, useEffect } from 'react';
import { useForm } from 'react-hook-form';
import Header from '@/components/Header';
import { 
  Table, 
  TableBody, 
  TableCell, 
  TableHead, 
  TableHeader, 
  TableRow 
} from '@/components/ui/table';
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog';
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Button } from '@/components/ui/button';
import { toast } from '@/components/ui/sonner';
import { type Customer, type Order } from '@/types';
import { User, UserPlus, Search, Phone, Mail, MapPin, Calendar, MessageSquare } from 'lucide-react';

const CRM = () => {
  const [customers, setCustomers] = useState<Customer[]>([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false);
  const [selectedCustomer, setSelectedCustomer] = useState<Customer | null>(null);
  const form = useForm<Omit<Customer, 'id' | 'totalOrders' | 'createdAt'>>();

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
          title: 'Erro',
          description: 'Não foi possível carregar os clientes',
          variant: 'destructive',
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
      
      setIsAddDialogOpen(false);
      form.reset();
      
      toast({
        title: 'Cliente adicionado',
        description: `${newCustomer.name} foi adicionado com sucesso.`,
      });
    } catch (error) {
      console.error('Erro ao adicionar cliente:', error);
      toast({
        title: 'Erro',
        description: 'Não foi possível adicionar o cliente',
        variant: 'destructive',
      });
    }
  };

  // Visualizar detalhes do cliente
  const handleViewCustomer = (customer: Customer) => {
    setSelectedCustomer(customer);
  };

  // Atualizar cliente
  const handleUpdateCustomer = (data: Partial<Customer>) => {
    if (!selectedCustomer) return;
    
    try {
      const updatedCustomers = customers.map(c => 
        c.id === selectedCustomer.id ? { ...c, ...data } : c
      );
      
      setCustomers(updatedCustomers);
      localStorage.setItem('customers', JSON.stringify(updatedCustomers));
      
      setSelectedCustomer(null);
      
      toast({
        title: 'Cliente atualizado',
        description: `As informações de ${data.name || selectedCustomer.name} foram atualizadas.`
      });
    } catch (error) {
      console.error('Erro ao atualizar cliente:', error);
      toast({
        title: 'Erro',
        description: 'Não foi possível atualizar o cliente',
        variant: 'destructive',
      });
    }
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
          
          <div className="flex flex-col sm:flex-row gap-4 sm:items-center w-full sm:w-auto">
            <div className="relative w-full sm:w-64">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
              <Input
                placeholder="Buscar clientes..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-9"
              />
            </div>
            
            <Dialog open={isAddDialogOpen} onOpenChange={setIsAddDialogOpen}>
              <DialogTrigger asChild>
                <Button className="whitespace-nowrap flex gap-2 items-center">
                  <UserPlus className="h-4 w-4" />
                  Adicionar Cliente
                </Button>
              </DialogTrigger>
              <DialogContent className="sm:max-w-[425px]">
                <DialogHeader>
                  <DialogTitle>Adicionar Novo Cliente</DialogTitle>
                  <DialogDescription>
                    Preencha os dados do cliente para adicioná-lo ao sistema.
                  </DialogDescription>
                </DialogHeader>
                
                <Form {...form}>
                  <form onSubmit={form.handleSubmit(handleAddCustomer)} className="space-y-4 pt-4">
                    <FormField
                      control={form.control}
                      name="name"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Nome</FormLabel>
                          <FormControl>
                            <Input placeholder="Nome completo" {...field} required />
                          </FormControl>
                        </FormItem>
                      )}
                    />
                    
                    <FormField
                      control={form.control}
                      name="phone"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Telefone</FormLabel>
                          <FormControl>
                            <Input placeholder="(00) 00000-0000" {...field} required />
                          </FormControl>
                        </FormItem>
                      )}
                    />
                    
                    <FormField
                      control={form.control}
                      name="email"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Email</FormLabel>
                          <FormControl>
                            <Input type="email" placeholder="email@exemplo.com" {...field} />
                          </FormControl>
                        </FormItem>
                      )}
                    />
                    
                    <FormField
                      control={form.control}
                      name="address"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Endereço</FormLabel>
                          <FormControl>
                            <Input placeholder="Endereço completo" {...field} required />
                          </FormControl>
                        </FormItem>
                      )}
                    />
                    
                    <FormField
                      control={form.control}
                      name="neighborhood"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Bairro</FormLabel>
                          <FormControl>
                            <Input placeholder="Bairro" {...field} />
                          </FormControl>
                        </FormItem>
                      )}
                    />
                    
                    <FormField
                      control={form.control}
                      name="notes"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Observações</FormLabel>
                          <FormControl>
                            <Textarea placeholder="Observações sobre o cliente" {...field} />
                          </FormControl>
                        </FormItem>
                      )}
                    />
                    
                    <DialogFooter>
                      <Button type="submit">Adicionar Cliente</Button>
                    </DialogFooter>
                  </form>
                </Form>
              </DialogContent>
            </Dialog>
          </div>
        </div>
        
        {customers.length === 0 ? (
          <Card>
            <CardContent className="flex flex-col items-center justify-center p-12">
              <div className="bg-gray-100 rounded-full p-6 mb-4">
                <User className="h-12 w-12 text-gray-400" />
              </div>
              <h2 className="text-xl font-medium mb-2">Nenhum cliente encontrado</h2>
              <p className="text-gray-500 mb-6 text-center">
                Você ainda não tem nenhum cliente registrado. Adicione seu primeiro cliente ou faça pedidos para gerar clientes automaticamente.
              </p>
              <Button onClick={() => setIsAddDialogOpen(true)}>Adicionar Cliente</Button>
            </CardContent>
          </Card>
        ) : (
          <>
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
                    {filteredCustomers.map((customer) => (
                      <TableRow key={customer.id}>
                        <TableCell className="font-medium">{customer.name}</TableCell>
                        <TableCell>{customer.phone}</TableCell>
                        <TableCell className="hidden md:table-cell">{customer.address}</TableCell>
                        <TableCell className="hidden lg:table-cell">{customer.totalOrders}</TableCell>
                        <TableCell className="hidden lg:table-cell">{customer.lastOrderDate || 'N/A'}</TableCell>
                        <TableCell className="text-right">
                          <Button variant="outline" size="sm" onClick={() => handleViewCustomer(customer)}>
                            Ver Detalhes
                          </Button>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </CardContent>
            </Card>
            
            {/* Diálogo para visualizar/editar cliente */}
            {selectedCustomer && (
              <Dialog open={!!selectedCustomer} onOpenChange={(open) => !open && setSelectedCustomer(null)}>
                <DialogContent className="sm:max-w-[600px]">
                  <DialogHeader>
                    <DialogTitle>Detalhes do Cliente</DialogTitle>
                  </DialogHeader>
                  
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6 py-4">
                    <div className="space-y-4">
                      <div>
                        <h3 className="font-semibold flex items-center gap-2"><User className="h-4 w-4" /> Informações Pessoais</h3>
                        <div className="mt-2 space-y-2">
                          <p><span className="font-medium">Nome:</span> {selectedCustomer.name}</p>
                          <p className="flex items-center gap-2">
                            <Phone className="h-4 w-4 text-gray-500" /> {selectedCustomer.phone}
                          </p>
                          {selectedCustomer.email && (
                            <p className="flex items-center gap-2">
                              <Mail className="h-4 w-4 text-gray-500" /> {selectedCustomer.email}
                            </p>
                          )}
                        </div>
                      </div>
                      
                      <div>
                        <h3 className="font-semibold flex items-center gap-2"><MapPin className="h-4 w-4" /> Endereço</h3>
                        <div className="mt-2">
                          <p>{selectedCustomer.address}</p>
                          {selectedCustomer.neighborhood && <p>{selectedCustomer.neighborhood}</p>}
                        </div>
                      </div>
                    </div>
                    
                    <div className="space-y-4">
                      <div>
                        <h3 className="font-semibold flex items-center gap-2"><Calendar className="h-4 w-4" /> Histórico</h3>
                        <div className="mt-2 space-y-2">
                          <p><span className="font-medium">Total de pedidos:</span> {selectedCustomer.totalOrders}</p>
                          <p><span className="font-medium">Último pedido:</span> {selectedCustomer.lastOrderDate || 'N/A'}</p>
                          <p><span className="font-medium">Cliente desde:</span> {new Date(selectedCustomer.createdAt).toLocaleDateString('pt-BR')}</p>
                        </div>
                      </div>
                      
                      <div>
                        <h3 className="font-semibold flex items-center gap-2"><MessageSquare className="h-4 w-4" /> Observações</h3>
                        <div className="mt-2">
                          <Form {...form}>
                            <form 
                              onSubmit={(e) => {
                                e.preventDefault();
                                handleUpdateCustomer({ notes: form.getValues('notes') });
                              }}
                            >
                              <FormField
                                control={form.control}
                                name="notes"
                                defaultValue={selectedCustomer.notes}
                                render={({ field }) => (
                                  <FormItem>
                                    <FormControl>
                                      <Textarea
                                        placeholder="Adicione observações sobre este cliente..."
                                        {...field}
                                        className="h-[100px]"
                                      />
                                    </FormControl>
                                  </FormItem>
                                )}
                              />
                              <Button type="submit" size="sm" className="mt-2">Salvar Observações</Button>
                            </form>
                          </Form>
                        </div>
                      </div>
                    </div>
                  </div>
                  
                  <DialogFooter>
                    <Button variant="outline" onClick={() => setSelectedCustomer(null)}>Fechar</Button>
                  </DialogFooter>
                </DialogContent>
              </Dialog>
            )}
          </>
        )}
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

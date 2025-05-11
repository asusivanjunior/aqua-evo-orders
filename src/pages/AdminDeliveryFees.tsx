
import React, { useState, useEffect } from 'react';
import { z } from 'zod';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import Header from '@/components/Header';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { useToast } from '@/hooks/use-toast';
import { TruckIcon, Plus, Trash2 } from 'lucide-react';
import { Alert, AlertTitle, AlertDescription } from '@/components/ui/alert';
import { DeliveryFee } from '@/types';
import { getDeliveryFees, addDeliveryFee, removeDeliveryFee } from '@/services/evolutionApiService';

const deliveryFeeSchema = z.object({
  neighborhood: z.string().min(2, { message: 'Nome do bairro é obrigatório' }),
  fee: z.coerce.number().min(0, { message: 'A taxa deve ser um valor positivo' }),
});

type DeliveryFeeFormValues = z.infer<typeof deliveryFeeSchema>;

const AdminDeliveryFees = () => {
  const { toast } = useToast();
  const [deliveryFees, setDeliveryFees] = useState<DeliveryFee[]>([]);
  const [isAdding, setIsAdding] = useState(false);

  // Configure the form with default values
  const form = useForm<DeliveryFeeFormValues>({
    resolver: zodResolver(deliveryFeeSchema),
    defaultValues: {
      neighborhood: '',
      fee: 0,
    },
  });

  // Carregar taxas de entrega ao iniciar e manter a interface atualizada
  useEffect(() => {
    loadDeliveryFees();
  }, []);

  const loadDeliveryFees = () => {
    const fees = getDeliveryFees();
    console.log("Taxas de entrega carregadas (admin):", fees);
    setDeliveryFees(fees);
  };

  const onSubmit = (data: DeliveryFeeFormValues) => {
    try {
      setIsAdding(true);
      const newFee: DeliveryFee = {
        id: Date.now().toString(), // ID simples baseado no timestamp atual
        neighborhood: data.neighborhood,
        fee: data.fee,
      };
      
      console.log("Adicionando nova taxa:", newFee);
      addDeliveryFee(newFee);
      loadDeliveryFees(); // Atualiza a lista após adicionar
      
      form.reset({
        neighborhood: '',
        fee: 0,
      });
      
      toast({
        title: "Taxa de entrega salva",
        description: `Taxa para o bairro ${data.neighborhood} foi salva com sucesso.`,
      });
    } catch (error) {
      console.error("Erro ao adicionar taxa:", error);
      toast({
        title: "Erro ao salvar taxa",
        description: "Ocorreu um erro ao salvar a taxa de entrega.",
        variant: "destructive",
      });
    } finally {
      setIsAdding(false);
    }
  };

  const handleDelete = (id: string, neighborhood: string) => {
    try {
      console.log("Removendo taxa de ID:", id);
      removeDeliveryFee(id);
      loadDeliveryFees(); // Atualiza a lista após remover
      
      toast({
        title: "Taxa de entrega removida",
        description: `Taxa para o bairro ${neighborhood} foi removida com sucesso.`,
      });
    } catch (error) {
      console.error("Erro ao remover taxa:", error);
      toast({
        title: "Erro ao remover taxa",
        description: "Ocorreu um erro ao remover a taxa de entrega.",
        variant: "destructive",
      });
    }
  };

  return (
    <div className="min-h-screen flex flex-col">
      <Header />
      
      <div className="container mx-auto px-4 py-8 flex-grow">
        <div className="flex items-center gap-2 mb-6">
          <TruckIcon size={24} />
          <h1 className="text-2xl font-bold">Configuração de Taxas de Entrega</h1>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          <div className="md:col-span-2">
            <Card>
              <CardContent className="p-6">
                <h2 className="text-xl font-semibold mb-4">Lista de Taxas de Entrega</h2>
                
                {deliveryFees.length === 0 ? (
                  <Alert className="mb-6">
                    <AlertTitle>Nenhuma taxa cadastrada</AlertTitle>
                    <AlertDescription>
                      Adicione taxas de entrega para os bairros que você atende.
                    </AlertDescription>
                  </Alert>
                ) : (
                  <div className="overflow-x-auto">
                    <table className="min-w-full divide-y divide-gray-200">
                      <thead className="bg-gray-50">
                        <tr>
                          <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                            Bairro
                          </th>
                          <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                            Taxa
                          </th>
                          <th scope="col" className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                            Ações
                          </th>
                        </tr>
                      </thead>
                      <tbody className="bg-white divide-y divide-gray-200">
                        {deliveryFees.map((fee) => (
                          <tr key={fee.id}>
                            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                              {fee.neighborhood}
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                              {fee.fee === 0 ? (
                                <span className="font-medium text-green-600">Grátis</span>
                              ) : (
                                `R$ ${fee.fee.toFixed(2)}`
                              )}
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                              <Button 
                                variant="ghost" 
                                size="sm" 
                                className="text-red-600 hover:text-red-800 hover:bg-red-50"
                                onClick={() => handleDelete(fee.id, fee.neighborhood)}
                              >
                                <Trash2 className="h-4 w-4 mr-1" />
                                Remover
                              </Button>
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                )}
              </CardContent>
            </Card>
          </div>
          
          <div>
            <Card>
              <CardContent className="p-6">
                <h2 className="text-xl font-semibold mb-4">Adicionar Taxa de Entrega</h2>
                
                <Form {...form}>
                  <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
                    <FormField
                      control={form.control}
                      name="neighborhood"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Nome do Bairro</FormLabel>
                          <FormControl>
                            <Input placeholder="Ex: Centro" {...field} />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    
                    <FormField
                      control={form.control}
                      name="fee"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Taxa de Entrega (R$)</FormLabel>
                          <FormControl>
                            <Input 
                              type="number" 
                              placeholder="0.00" 
                              step="0.01" 
                              min="0"
                              {...field} 
                            />
                          </FormControl>
                          <FormMessage />
                          <p className="text-sm text-gray-500">Use 0 para entrega gratuita</p>
                        </FormItem>
                      )}
                    />
                    
                    <Button
                      type="submit"
                      className="w-full bg-water hover:bg-water-dark"
                      disabled={isAdding}
                    >
                      <Plus className="h-4 w-4 mr-2" />
                      {isAdding ? "Adicionando..." : "Adicionar Taxa"}
                    </Button>
                  </form>
                </Form>
              </CardContent>
            </Card>
          </div>
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

export default AdminDeliveryFees;

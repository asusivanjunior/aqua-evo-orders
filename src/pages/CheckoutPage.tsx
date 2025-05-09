
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import { z } from 'zod';
import { zodResolver } from '@hookform/resolvers/zod';
import { useCart } from '@/contexts/CartContext';
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
import { Textarea } from '@/components/ui/textarea';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { useToast } from '@/components/ui/use-toast';
import { sendOrderToWhatsApp } from '@/services/evolutionApiService';
import { Alert, AlertTitle, AlertDescription } from '@/components/ui/alert';
import { AlertCircle, Settings } from 'lucide-react';
import { Link } from 'react-router-dom';

const formSchema = z.object({
  name: z.string().min(3, { message: 'Nome é obrigatório' }),
  phone: z
    .string()
    .min(10, { message: 'Telefone deve ter pelo menos 10 dígitos' }),
  address: z.string().min(5, { message: 'Endereço é obrigatório' }),
  paymentMethod: z.enum(['cash', 'card', 'pix'], {
    required_error: 'Selecione uma forma de pagamento',
  }),
  observations: z.string().optional(),
});

type FormValues = z.infer<typeof formSchema>;

const CheckoutPage = () => {
  const { items, totalPrice, clearCart } = useCart();
  const [isLoading, setIsLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const navigate = useNavigate();
  const { toast } = useToast();

  // Configure the form with default values and validation
  const form = useForm<FormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      name: '',
      phone: '',
      address: '',
      paymentMethod: 'cash',
      observations: '',
    },
  });

  const onSubmit = async (data: FormValues) => {
    if (items.length === 0) {
      toast({
        title: "Carrinho vazio",
        description: "Adicione produtos ao carrinho antes de finalizar o pedido.",
        variant: "destructive",
      });
      navigate('/');
      return;
    }

    setIsLoading(true);
    setErrorMessage(null);
    
    // Create the order object
    const order = {
      items,
      customerName: data.name,
      phone: data.phone,
      address: data.address,
      paymentMethod: data.paymentMethod,
      observations: data.observations,
      total: totalPrice,
    };
    
    try {
      console.log("Iniciando processamento do pedido:", order);
      // Send the order to WhatsApp
      await sendOrderToWhatsApp(order);
      
      // Clear the cart and show success message
      clearCart();
      toast({
        title: "Pedido realizado com sucesso!",
        description: "Recebemos seu pedido e entraremos em contato em breve.",
      });
      navigate('/order-confirmation');
    } catch (error: any) {
      console.error('Erro ao processar pedido:', error);
      
      // Mensagem de erro mais específica
      const errorMsg = error?.message || "Ocorreu um erro ao processar seu pedido. Verifique as configurações da API ou tente novamente mais tarde.";
      setErrorMessage(errorMsg);
      
      toast({
        title: "Erro ao processar pedido",
        description: "Ocorreu um erro ao processar seu pedido. Por favor, verifique as configurações da API.",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  if (items.length === 0) {
    navigate('/');
    return null;
  }

  return (
    <div className="min-h-screen flex flex-col">
      <Header />
      
      <div className="container mx-auto px-4 py-8 flex-grow">
        <h1 className="text-2xl font-bold mb-6">Finalizar Pedido</h1>
        
        {errorMessage && (
          <Alert variant="destructive" className="mb-6">
            <AlertCircle className="h-4 w-4" />
            <AlertTitle>Erro ao processar pedido</AlertTitle>
            <AlertDescription>
              {errorMessage}
              <div className="mt-2">
                <Link to="/admin/settings" className="flex items-center text-sm font-medium underline">
                  <Settings className="h-4 w-4 mr-1" /> 
                  Verificar configurações da API
                </Link>
              </div>
            </AlertDescription>
          </Alert>
        )}
        
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          <div className="col-span-2">
            <Card>
              <CardContent className="p-6">
                <Form {...form}>
                  <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
                    <h2 className="text-lg font-semibold mb-4">Dados para Entrega</h2>
                    
                    <FormField
                      control={form.control}
                      name="name"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Nome completo</FormLabel>
                          <FormControl>
                            <Input placeholder="Seu nome" {...field} />
                          </FormControl>
                          <FormMessage />
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
                            <Input placeholder="(00) 00000-0000" {...field} />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    
                    <FormField
                      control={form.control}
                      name="address"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Endereço completo</FormLabel>
                          <FormControl>
                            <Input placeholder="Rua, número, bairro, complemento" {...field} />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    
                    <FormField
                      control={form.control}
                      name="paymentMethod"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Forma de Pagamento</FormLabel>
                          <FormControl>
                            <RadioGroup
                              onValueChange={field.onChange}
                              value={field.value}
                              className="grid grid-cols-3 gap-4"
                            >
                              <div>
                                <RadioGroupItem value="cash" id="cash" className="peer sr-only" />
                                <FormLabel
                                  htmlFor="cash"
                                  className="flex flex-col items-center justify-between rounded-md border-2 border-muted p-4 hover:bg-muted peer-data-[state=checked]:border-water"
                                >
                                  <span>Dinheiro</span>
                                </FormLabel>
                              </div>
                              
                              <div>
                                <RadioGroupItem value="card" id="card" className="peer sr-only" />
                                <FormLabel
                                  htmlFor="card"
                                  className="flex flex-col items-center justify-between rounded-md border-2 border-muted p-4 hover:bg-muted peer-data-[state=checked]:border-water"
                                >
                                  <span>Cartão</span>
                                </FormLabel>
                              </div>
                              
                              <div>
                                <RadioGroupItem value="pix" id="pix" className="peer sr-only" />
                                <FormLabel
                                  htmlFor="pix"
                                  className="flex flex-col items-center justify-between rounded-md border-2 border-muted p-4 hover:bg-muted peer-data-[state=checked]:border-water"
                                >
                                  <span>PIX</span>
                                </FormLabel>
                              </div>
                            </RadioGroup>
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    
                    <FormField
                      control={form.control}
                      name="observations"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Observações (opcional)</FormLabel>
                          <FormControl>
                            <Textarea
                              placeholder="Alguma observação sobre seu pedido?"
                              {...field}
                            />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    
                    <Button
                      type="submit"
                      className="w-full bg-water hover:bg-water-dark"
                      disabled={isLoading}
                    >
                      {isLoading ? "Processando..." : "Confirmar Pedido"}
                    </Button>
                  </form>
                </Form>
              </CardContent>
            </Card>
          </div>
          
          <div>
            <Card>
              <CardContent className="p-6">
                <h2 className="text-lg font-semibold mb-4">Resumo do Pedido</h2>
                
                <div className="space-y-4">
                  {items.map((item, index) => {
                    const { product, selectedSize, quantity } = item;
                    const itemPrice = (product.price + selectedSize.additionalPrice) * quantity;
                    
                    return (
                      <div key={index} className="flex justify-between">
                        <span className="text-gray-600">
                          {quantity}x {product.name} ({selectedSize.name})
                        </span>
                        <span>R$ {itemPrice.toFixed(2)}</span>
                      </div>
                    );
                  })}
                  
                  <div className="border-t pt-4 flex justify-between font-bold">
                    <span>Total</span>
                    <span>R$ {totalPrice.toFixed(2)}</span>
                  </div>
                </div>
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

export default CheckoutPage;

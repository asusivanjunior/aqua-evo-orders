import React, { useState, useEffect } from 'react';
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
import { useToast } from '@/hooks/use-toast';
import { Alert, AlertTitle, AlertDescription } from '@/components/ui/alert';
import { AlertCircle } from 'lucide-react';
import { getDeliveryFees, getDeliveryFeeByNeighborhood, sendOrderToWhatsApp } from '@/services/evolutionApiService';
import { DeliveryFee } from '@/types';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { format } from "date-fns";

const formSchema = z.object({
  name: z.string().min(3, { message: 'Nome é obrigatório' }),
  phone: z
    .string()
    .min(10, { message: 'Telefone deve ter pelo menos 10 dígitos' }),
  address: z.string().min(5, { message: 'Endereço é obrigatório' }),
  neighborhood: z.string().min(1, { message: 'Selecione um bairro' }),
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
  const [deliveryFees, setDeliveryFees] = useState<DeliveryFee[]>([]);
  const [selectedDeliveryFee, setSelectedDeliveryFee] = useState<number | null>(null);
  const navigate = useNavigate();
  const { toast } = useToast();

  useEffect(() => {
    // Carregar taxas de entrega
    const fees = getDeliveryFees();
    console.log("Taxas de entrega carregadas:", fees);
    setDeliveryFees(fees);
  }, []);

  // Configure the form with default values and validation
  const form = useForm<FormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      name: '',
      phone: '',
      address: '',
      neighborhood: '',
      paymentMethod: 'cash',
      observations: '',
    },
  });

  // Atualizar a taxa de entrega quando o bairro for alterado
  const onNeighborhoodChange = (neighborhood: string) => {
    console.log("Bairro selecionado:", neighborhood);
    const fee = getDeliveryFeeByNeighborhood(neighborhood);
    console.log("Taxa de entrega encontrada:", fee);
    setSelectedDeliveryFee(fee);
  };

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
    
    // Criar o objeto do pedido com data/hora atual
    const now = new Date();
    const formattedDate = format(now, "dd/MM/yyyy");
    const formattedTime = format(now, "HH:mm");
    
    // Create the order object
    const order = {
      items,
      customerName: data.name,
      phone: data.phone,
      address: data.address,
      neighborhood: data.neighborhood,
      paymentMethod: data.paymentMethod,
      observations: data.observations,
      total: totalPrice,
      deliveryFee: selectedDeliveryFee !== null ? selectedDeliveryFee : undefined,
      orderDate: formattedDate,
      orderTime: formattedTime
    };
    
    try {
      console.log("Iniciando processamento do pedido:", order);
      // Enviar o pedido para o WhatsApp
      await sendOrderToWhatsApp(order);
      
      // Limpar o carrinho e mostrar mensagem de sucesso
      clearCart();
      toast({
        title: "Pedido realizado com sucesso!",
        description: "Seu pedido foi enviado para o WhatsApp do estabelecimento.",
      });
      navigate('/order-confirmation');
    } catch (error: any) {
      console.error('Erro ao processar pedido:', error);
      
      const errorMsg = error?.message || "Ocorreu um erro ao processar seu pedido. Por favor, tente novamente mais tarde.";
      setErrorMessage(errorMsg);
      
      toast({
        title: "Erro ao processar pedido",
        description: errorMsg,
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

  // Calcular o total com a taxa de entrega
  const totalWithDelivery = totalPrice + (selectedDeliveryFee ?? 0);

  console.log("Rendering checkout page with delivery fees:", deliveryFees);

  return (
    <div className="min-h-screen flex flex-col">
      <Header />
      
      <div className="container mx-auto px-4 py-8 flex-grow">
        <h1 className="text-2xl font-bold mb-6">Finalizar Pedido</h1>
        
        {errorMessage && (
          <Alert variant="destructive" className="mb-6">
            <AlertCircle className="h-4 w-4" />
            <AlertTitle>Erro ao processar pedido</AlertTitle>
            <AlertDescription>{errorMessage}</AlertDescription>
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
                            <Input placeholder="Rua, número, complemento" {...field} />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    
                    <FormField
                      control={form.control}
                      name="neighborhood"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Bairro</FormLabel>
                          <Select 
                            onValueChange={(value) => {
                              field.onChange(value);
                              onNeighborhoodChange(value);
                            }}
                            defaultValue={field.value}
                          >
                            <FormControl>
                              <SelectTrigger>
                                <SelectValue placeholder="Selecione o bairro" />
                              </SelectTrigger>
                            </FormControl>
                            <SelectContent>
                              {deliveryFees.length === 0 ? (
                                <SelectItem value="nenhum">Nenhum bairro cadastrado</SelectItem>
                              ) : (
                                deliveryFees.map((fee) => (
                                  <SelectItem key={fee.id} value={fee.neighborhood}>
                                    {fee.neighborhood} {fee.fee === 0 ? '(Entrega Grátis)' : `- R$ ${fee.fee.toFixed(2)}`}
                                  </SelectItem>
                                ))
                              )}
                            </SelectContent>
                          </Select>
                          <FormMessage />
                          {deliveryFees.length === 0 && (
                            <p className="text-sm text-amber-600 mt-1">
                              Nenhum bairro cadastrado. Entre em contato com o estabelecimento.
                            </p>
                          )}
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
                      disabled={isLoading || deliveryFees.length === 0}
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
                <p className="text-sm text-gray-500 mb-4">
                  {format(new Date(), "dd/MM/yyyy")} às {format(new Date(), "HH:mm")}
                </p>
                
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
                  
                  {/* Subtotal */}
                  <div className="flex justify-between pt-2 border-t">
                    <span className="text-gray-600">Subtotal</span>
                    <span>R$ {totalPrice.toFixed(2)}</span>
                  </div>
                  
                  {/* Taxa de Entrega */}
                  <div className="flex justify-between">
                    <span className="text-gray-600">Taxa de Entrega</span>
                    <span>
                      {selectedDeliveryFee === null ? (
                        "Selecione o bairro"
                      ) : selectedDeliveryFee === 0 ? (
                        <span className="text-green-600 font-semibold">Grátis</span>
                      ) : (
                        `R$ ${selectedDeliveryFee.toFixed(2)}`
                      )}
                    </span>
                  </div>
                  
                  {/* Total */}
                  <div className="border-t pt-4 flex justify-between font-bold">
                    <span>Total</span>
                    <span>
                      {selectedDeliveryFee === null ? (
                        `R$ ${totalPrice.toFixed(2)}`
                      ) : (
                        `R$ ${totalWithDelivery.toFixed(2)}`
                      )}
                    </span>
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

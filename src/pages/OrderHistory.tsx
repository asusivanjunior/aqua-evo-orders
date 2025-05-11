
import React, { useState, useEffect } from 'react';
import Header from '@/components/Header';
import { Order } from '@/types';
import { 
  Card, 
  CardContent, 
  CardDescription, 
  CardFooter, 
  CardHeader, 
  CardTitle 
} from '@/components/ui/card';
import { 
  Table, 
  TableBody, 
  TableCaption, 
  TableCell, 
  TableHead, 
  TableHeader, 
  TableRow 
} from '@/components/ui/table';
import { Button } from '@/components/ui/button';
import { formatCurrency } from '@/lib/utils';
import { ShoppingBag, Clock } from 'lucide-react';
import { Link } from 'react-router-dom';

const OrderHistory = () => {
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(true);

  // Simular carregamento do histórico de pedidos
  useEffect(() => {
    // Em um ambiente real, isso seria uma requisição a uma API/banco de dados
    const loadOrders = () => {
      // Buscar do localStorage como exemplo
      const savedOrders = localStorage.getItem('orderHistory');
      if (savedOrders) {
        setOrders(JSON.parse(savedOrders));
      }
      setLoading(false);
    };

    // Simulando tempo de carregamento
    const timer = setTimeout(() => {
      loadOrders();
    }, 800);

    return () => clearTimeout(timer);
  }, []);

  return (
    <div className="min-h-screen flex flex-col">
      <Header />
      
      <div className="flex-grow container mx-auto px-4 py-8">
        <div className="mb-8">
          <h1 className="text-3xl font-bold">Histórico de Pedidos</h1>
          <p className="text-gray-500 mt-2">Veja todos os seus pedidos anteriores</p>
        </div>
        
        {loading ? (
          <div className="flex flex-col items-center justify-center p-12">
            <div className="w-16 h-16 border-4 border-gray-200 border-t-water rounded-full animate-spin mb-4"></div>
            <p className="text-gray-500">Carregando seus pedidos...</p>
          </div>
        ) : orders.length > 0 ? (
          <div className="space-y-6">
            {orders.map((order, index) => (
              <Card key={index} className="overflow-hidden transition-all hover:shadow-md">
                <CardHeader className="bg-gray-50">
                  <div className="flex justify-between items-center">
                    <div>
                      <CardTitle className="text-lg">Pedido #{index + 1}</CardTitle>
                      <CardDescription className="flex items-center gap-1 mt-1">
                        <Clock className="h-4 w-4" /> 
                        {order.orderDate} às {order.orderTime}
                      </CardDescription>
                    </div>
                    <div className="text-right">
                      <span className="font-semibold text-lg">{formatCurrency(order.total)}</span>
                      <p className="text-sm text-muted-foreground">Total do pedido</p>
                    </div>
                  </div>
                </CardHeader>
                
                <CardContent className="p-6">
                  <div className="space-y-4">
                    <div>
                      <h3 className="font-medium mb-2">Itens do Pedido</h3>
                      <Table>
                        <TableHeader>
                          <TableRow>
                            <TableHead>Produto</TableHead>
                            <TableHead>Tamanho</TableHead>
                            <TableHead>Qtd</TableHead>
                            <TableHead className="text-right">Preço</TableHead>
                          </TableRow>
                        </TableHeader>
                        <TableBody>
                          {order.items.map((item, itemIndex) => (
                            <TableRow key={itemIndex}>
                              <TableCell>{item.product.name}</TableCell>
                              <TableCell>{item.selectedSize.name}</TableCell>
                              <TableCell>{item.quantity}</TableCell>
                              <TableCell className="text-right">{formatCurrency(
                                (item.product.price + item.selectedSize.additionalPrice) * item.quantity
                              )}</TableCell>
                            </TableRow>
                          ))}
                        </TableBody>
                      </Table>
                    </div>
                    
                    <div className="grid md:grid-cols-2 gap-6">
                      <div>
                        <h3 className="font-medium mb-2">Dados de Entrega</h3>
                        <p className="text-gray-700">{order.customerName}</p>
                        <p className="text-gray-700">{order.phone}</p>
                        <p className="text-gray-700">{order.address}</p>
                        {order.neighborhood && (
                          <p className="text-gray-700">{order.neighborhood}</p>
                        )}
                      </div>
                      
                      <div>
                        <h3 className="font-medium mb-2">Detalhes do Pagamento</h3>
                        <p className="text-gray-700">
                          Forma de pagamento: {
                            order.paymentMethod === 'cash' ? 'Dinheiro' : 
                            order.paymentMethod === 'card' ? 'Cartão' : 
                            'PIX'
                          }
                        </p>
                        {order.deliveryFee !== undefined && (
                          <p className="text-gray-700">Taxa de entrega: {formatCurrency(order.deliveryFee)}</p>
                        )}
                        {order.observations && (
                          <div className="mt-2">
                            <h3 className="font-medium mb-1">Observações</h3>
                            <p className="text-gray-700">{order.observations}</p>
                          </div>
                        )}
                      </div>
                    </div>
                  </div>
                </CardContent>
                
                <CardFooter className="bg-gray-50 flex justify-between">
                  <Button variant="outline" asChild>
                    <Link to={`/product/${order.items[0].product.id}`}>
                      Pedir novamente
                    </Link>
                  </Button>
                </CardFooter>
              </Card>
            ))}
          </div>
        ) : (
          <div className="flex flex-col items-center justify-center bg-gray-50 rounded-lg p-12">
            <div className="bg-gray-100 rounded-full p-6 mb-4">
              <ShoppingBag className="h-12 w-12 text-gray-400" />
            </div>
            <h2 className="text-xl font-medium mb-2">Nenhum pedido encontrado</h2>
            <p className="text-gray-500 mb-6 text-center">
              Você ainda não fez nenhum pedido. Que tal começar agora?
            </p>
            <Button asChild>
              <Link to="/">Fazer um pedido</Link>
            </Button>
          </div>
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

export default OrderHistory;

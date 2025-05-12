
import React from 'react';
import { useForm } from 'react-hook-form';
import { Customer } from '@/types';
import { User, Phone, Mail, MapPin, Calendar, MessageSquare } from 'lucide-react';
import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import {
  Form,
  FormControl,
  FormField,
  FormItem,
} from '@/components/ui/form';
import { Textarea } from '@/components/ui/textarea';
import { Button } from '@/components/ui/button';

interface CustomerDetailsProps {
  customer: Customer | null;
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onUpdateCustomer: (data: Partial<Customer>) => void;
}

const CustomerDetails = ({ customer, open, onOpenChange, onUpdateCustomer }: CustomerDetailsProps) => {
  const form = useForm<{ notes: string }>();

  if (!customer) return null;

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[600px]">
        <DialogHeader>
          <DialogTitle>Detalhes do Cliente</DialogTitle>
        </DialogHeader>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 py-4">
          <div className="space-y-4">
            <div>
              <h3 className="font-semibold flex items-center gap-2"><User className="h-4 w-4" /> Informações Pessoais</h3>
              <div className="mt-2 space-y-2">
                <p><span className="font-medium">Nome:</span> {customer.name}</p>
                <p className="flex items-center gap-2">
                  <Phone className="h-4 w-4 text-gray-500" /> {customer.phone}
                </p>
                {customer.email && (
                  <p className="flex items-center gap-2">
                    <Mail className="h-4 w-4 text-gray-500" /> {customer.email}
                  </p>
                )}
              </div>
            </div>
            
            <div>
              <h3 className="font-semibold flex items-center gap-2"><MapPin className="h-4 w-4" /> Endereço</h3>
              <div className="mt-2">
                <p>{customer.address}</p>
                {customer.neighborhood && <p>{customer.neighborhood}</p>}
              </div>
            </div>
          </div>
          
          <div className="space-y-4">
            <div>
              <h3 className="font-semibold flex items-center gap-2"><Calendar className="h-4 w-4" /> Histórico</h3>
              <div className="mt-2 space-y-2">
                <p><span className="font-medium">Total de pedidos:</span> {customer.totalOrders}</p>
                <p><span className="font-medium">Último pedido:</span> {customer.lastOrderDate || 'N/A'}</p>
                <p><span className="font-medium">Cliente desde:</span> {new Date(customer.createdAt).toLocaleDateString('pt-BR')}</p>
              </div>
            </div>
            
            <div>
              <h3 className="font-semibold flex items-center gap-2"><MessageSquare className="h-4 w-4" /> Observações</h3>
              <div className="mt-2">
                <Form {...form}>
                  <form 
                    onSubmit={(e) => {
                      e.preventDefault();
                      onUpdateCustomer({ notes: form.getValues('notes') });
                    }}
                  >
                    <FormField
                      control={form.control}
                      name="notes"
                      defaultValue={customer.notes}
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
          <Button variant="outline" onClick={() => onOpenChange(false)}>Fechar</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default CustomerDetails;

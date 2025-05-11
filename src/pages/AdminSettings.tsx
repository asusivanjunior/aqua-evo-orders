
import React, { useState } from 'react';
import { z } from 'zod';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { Link } from 'react-router-dom';
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
import { Settings, TruckIcon } from 'lucide-react';
import { getBusinessWhatsAppNumber, saveBusinessWhatsAppNumber } from '@/services/evolutionApiService';

const whatsappSchema = z.object({
  whatsappNumber: z.string().min(10, { message: 'Número do WhatsApp deve ter pelo menos 10 dígitos' }),
});

type SettingsFormValues = z.infer<typeof whatsappSchema>;

const AdminSettings = () => {
  const { toast } = useToast();
  const [isSaving, setIsSaving] = useState(false);

  // Obter o número de WhatsApp das configurações
  const getStoredSettings = (): SettingsFormValues => {
    const whatsappNumber = getBusinessWhatsAppNumber();
    
    return {
      whatsappNumber: whatsappNumber || '+5511914860970',
    };
  };

  // Configurar o formulário com valores padrão
  const form = useForm<SettingsFormValues>({
    resolver: zodResolver(whatsappSchema),
    defaultValues: getStoredSettings(),
  });

  // Salvar configurações
  const saveSettings = (data: SettingsFormValues) => {
    setIsSaving(true);
    try {
      // Salvar número de WhatsApp do estabelecimento
      saveBusinessWhatsAppNumber(data.whatsappNumber);
      
      toast({
        title: "Configurações salvas",
        description: "O número de WhatsApp foi salvo com sucesso.",
      });
    } catch (error) {
      console.error('Erro ao salvar configurações:', error);
      toast({
        title: "Erro ao salvar configurações",
        description: "Ocorreu um erro ao salvar as configurações.",
        variant: "destructive",
      });
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <div className="min-h-screen flex flex-col">
      <Header />
      
      <div className="container mx-auto px-4 py-8 flex-grow">
        <div className="flex items-center gap-2 mb-6">
          <Settings size={24} />
          <h1 className="text-2xl font-bold">Configurações do Sistema</h1>
        </div>
        
        {/* Navegação de Administração */}
        <div className="mb-6 flex flex-wrap gap-4">
          <Button variant="outline" asChild>
            <Link to="/admin/products">
              Gerenciar Produtos
            </Link>
          </Button>
          <Button variant="outline" asChild className="flex items-center gap-2">
            <Link to="/admin/delivery-fees">
              <TruckIcon className="h-4 w-4" />
              Gerenciar Taxas de Entrega
            </Link>
          </Button>
        </div>
        
        <Card>
          <CardContent className="p-6">
            <Form {...form}>
              <form onSubmit={form.handleSubmit(saveSettings)} className="space-y-6">
                <h2 className="text-xl font-semibold mb-4">Configuração de WhatsApp</h2>
                
                <FormField
                  control={form.control}
                  name="whatsappNumber"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Número de WhatsApp para Recebimento de Pedidos</FormLabel>
                      <FormControl>
                        <Input 
                          placeholder="+5511914860970" 
                          {...field} 
                          className="font-mono"
                        />
                      </FormControl>
                      <FormMessage />
                      <p className="text-sm text-gray-500 mt-1">
                        Insira o número com código do país e DDD (Ex: +5511912345678)
                      </p>
                    </FormItem>
                  )}
                />
                
                <Button
                  type="submit"
                  className="bg-water hover:bg-water-dark w-full"
                  disabled={isSaving}
                >
                  {isSaving ? "Salvando..." : "Salvar Configurações"}
                </Button>
              </form>
            </Form>
          </CardContent>
        </Card>
      </div>
      
      <footer className="bg-gray-100 py-8">
        <div className="container mx-auto px-4 text-center text-gray-500 text-sm">
          <p>© {new Date().getFullYear()} Águas & Gás Delivery. Todos os direitos reservados.</p>
        </div>
      </footer>
    </div>
  );
};

export default AdminSettings;


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
import { Settings, CheckCircle2, XCircle } from 'lucide-react';
import { Alert, AlertTitle, AlertDescription } from '@/components/ui/alert';
import { testEvolutionApiConnection } from '@/services/evolutionApiService';

const settingsSchema = z.object({
  apiUrl: z.string().url({ message: 'URL inválida' }),
  instanceName: z.string().min(1, { message: 'Nome da instância é obrigatório' }),
  apiKey: z.string().min(5, { message: 'API Key precisa ter pelo menos 5 caracteres' }),
  businessPhone: z.string().min(10, { message: 'Telefone deve ter pelo menos 10 dígitos' }),
});

type SettingsFormValues = z.infer<typeof settingsSchema>;

const AdminSettings = () => {
  const { toast } = useToast();
  const [isSaving, setIsSaving] = useState(false);
  const [isTesting, setIsTesting] = useState(false);
  const [testResult, setTestResult] = useState<{ success: boolean; message: string } | null>(null);

  // Get stored settings from localStorage
  const getStoredSettings = (): SettingsFormValues => {
    const storedSettings = localStorage.getItem('evolutionApiSettings');
    if (storedSettings) {
      return JSON.parse(storedSettings);
    }
    return {
      apiUrl: 'https://your-evolution-api-url.com',
      instanceName: 'your-instance-name',
      apiKey: 'your-api-key',
      businessPhone: '5511999999999',
    };
  };

  // Configure the form with default values
  const form = useForm<SettingsFormValues>({
    resolver: zodResolver(settingsSchema),
    defaultValues: getStoredSettings(),
  });

  // Save settings to localStorage
  const saveSettings = (data: SettingsFormValues) => {
    setIsSaving(true);
    try {
      localStorage.setItem('evolutionApiSettings', JSON.stringify(data));
      toast({
        title: "Configurações salvas",
        description: "As configurações da Evolution API foram salvas com sucesso.",
      });
      setTestResult(null); // Reset test result after saving new settings
    } catch (error) {
      console.error('Error saving settings:', error);
      toast({
        title: "Erro ao salvar configurações",
        description: "Ocorreu um erro ao salvar as configurações.",
        variant: "destructive",
      });
    } finally {
      setIsSaving(false);
    }
  };

  // Test connection to Evolution API
  const testConnection = async () => {
    setIsTesting(true);
    setTestResult(null);
    
    try {
      const formValues = form.getValues();
      const result = await testEvolutionApiConnection(formValues);
      setTestResult({ 
        success: true, 
        message: "Conexão com a Evolution API estabelecida com sucesso!"
      });
    } catch (error) {
      console.error('Error testing connection:', error);
      setTestResult({ 
        success: false, 
        message: `Falha na conexão: ${error instanceof Error ? error.message : 'Erro desconhecido'}`
      });
    } finally {
      setIsTesting(false);
    }
  };

  return (
    <div className="min-h-screen flex flex-col">
      <Header />
      
      <div className="container mx-auto px-4 py-8 flex-grow">
        <div className="flex items-center gap-2 mb-6">
          <Settings size={24} />
          <h1 className="text-2xl font-bold">Configurações da API</h1>
        </div>
        
        {testResult && (
          <Alert 
            variant={testResult.success ? "default" : "destructive"}
            className={`mb-6 ${testResult.success ? 'bg-green-50 border-green-200' : ''}`}
          >
            {testResult.success ? (
              <CheckCircle2 className="h-4 w-4 text-green-600" />
            ) : (
              <XCircle className="h-4 w-4" />
            )}
            <AlertTitle className={testResult.success ? 'text-green-600' : ''}>
              {testResult.success ? 'Teste de conexão bem-sucedido' : 'Erro no teste de conexão'}
            </AlertTitle>
            <AlertDescription>{testResult.message}</AlertDescription>
          </Alert>
        )}
        
        <Card>
          <CardContent className="p-6">
            <Form {...form}>
              <form onSubmit={form.handleSubmit(saveSettings)} className="space-y-6">
                <FormField
                  control={form.control}
                  name="apiUrl"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>URL da Evolution API</FormLabel>
                      <FormControl>
                        <Input placeholder="https://sua-evolution-api.com" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                
                <FormField
                  control={form.control}
                  name="instanceName"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Nome da Instância</FormLabel>
                      <FormControl>
                        <Input placeholder="nome-da-instancia" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                
                <FormField
                  control={form.control}
                  name="apiKey"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>API Key</FormLabel>
                      <FormControl>
                        <Input type="password" placeholder="Sua API Key" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                
                <FormField
                  control={form.control}
                  name="businessPhone"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Telefone de Recebimento</FormLabel>
                      <FormControl>
                        <Input placeholder="5511999999999" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                
                <div className="flex flex-col gap-4 sm:flex-row">
                  <Button
                    type="submit"
                    className="bg-water hover:bg-water-dark w-full sm:w-1/2"
                    disabled={isSaving}
                  >
                    {isSaving ? "Salvando..." : "Salvar Configurações"}
                  </Button>
                  
                  <Button 
                    type="button"
                    variant="outline"
                    className="w-full sm:w-1/2"
                    onClick={testConnection}
                    disabled={isTesting}
                  >
                    {isTesting ? "Testando conexão..." : "Testar Conexão"}
                  </Button>
                </div>
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

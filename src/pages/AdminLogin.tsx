
import React, { useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { useAdminAuth } from '@/contexts/AdminAuthContext';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { useToast } from '@/hooks/use-toast';
import { Settings, Lock } from 'lucide-react';
import Header from '@/components/Header';

const AdminLogin = () => {
  const [password, setPassword] = useState('');
  const { adminLogin } = useAdminAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const { toast } = useToast();
  const [isSubmitting, setIsSubmitting] = useState(false);
  
  // Capturar o redirecionamento pretendido ou ir para a página de configurações
  const from = location.state?.from?.pathname || "/admin/settings";

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    
    const isSuccess = adminLogin(password);
    
    if (isSuccess) {
      toast({
        title: "Login bem-sucedido",
        description: "Você está agora na área administrativa.",
      });
      navigate(from, { replace: true });
    } else {
      toast({
        title: "Erro de autenticação",
        description: "Senha incorreta. Tente novamente.",
        variant: "destructive",
      });
      setPassword('');
    }
    
    setIsSubmitting(false);
  };

  return (
    <div className="min-h-screen flex flex-col">
      <Header />
      
      <div className="container mx-auto px-4 py-16 flex-grow flex items-center justify-center">
        <Card className="w-full max-w-md">
          <CardHeader className="space-y-1 flex flex-col items-center">
            <div className="bg-slate-100 p-3 rounded-full">
              <Lock size={24} className="text-water" />
            </div>
            <CardTitle className="text-2xl text-center mt-4">Área Administrativa</CardTitle>
            <p className="text-sm text-center text-muted-foreground">
              Digite a senha para acessar a área administrativa
            </p>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="space-y-2">
                <Input
                  type="password"
                  placeholder="Digite a senha de administrador"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                  className="w-full"
                  autoFocus
                />
              </div>
              <Button 
                type="submit" 
                className="w-full bg-water hover:bg-water-dark"
                disabled={isSubmitting}
              >
                {isSubmitting ? "Autenticando..." : "Entrar"}
              </Button>
              <p className="text-xs text-center text-muted-foreground mt-4">
                A senha padrão é "admin123"
              </p>
            </form>
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

export default AdminLogin;

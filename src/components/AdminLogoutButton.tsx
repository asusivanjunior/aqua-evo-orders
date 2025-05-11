
import React from 'react';
import { useNavigate } from 'react-router-dom';
import { useAdminAuth } from '@/contexts/AdminAuthContext';
import { Button } from '@/components/ui/button';
import { LogOut } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

const AdminLogoutButton = () => {
  const { adminLogout, isAdminAuthenticated } = useAdminAuth();
  const navigate = useNavigate();
  const { toast } = useToast();

  if (!isAdminAuthenticated) return null;

  const handleLogout = () => {
    adminLogout();
    toast({
      title: "Logout realizado",
      description: "Você saiu da área administrativa.",
    });
    navigate('/');
  };

  return (
    <Button 
      variant="outline" 
      size="sm" 
      onClick={handleLogout}
      className="text-red-600 border-red-200 hover:bg-red-50 hover:text-red-700"
    >
      <LogOut className="h-4 w-4 mr-1" />
      Sair
    </Button>
  );
};

export default AdminLogoutButton;

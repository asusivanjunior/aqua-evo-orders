
import { EvolutionAPIMessage, EvolutionAPIResponse, Order } from "@/types";

// Função para formatar o pedido para envio via WhatsApp
export const formatOrderForWhatsApp = (order: Order): string => {
  let message = "*NOVO PEDIDO*\n\n";
  
  message += `*Cliente:* ${order.customerName}\n`;
  message += `*Telefone:* ${order.phone}\n`;
  message += `*Endereço:* ${order.address}\n`;
  message += `*Forma de Pagamento:* ${getPaymentMethodText(order.paymentMethod)}\n\n`;
  
  message += "*Itens do Pedido:*\n";
  order.items.forEach((item, index) => {
    message += `${index + 1}. ${item.quantity}x ${item.product.name} - ${item.selectedSize.name}\n`;
  });
  
  if (order.observations) {
    message += `\n*Observações:* ${order.observations}\n`;
  }
  
  message += `\n*Total:* R$ ${order.total.toFixed(2)}`;
  
  return message;
};

const getPaymentMethodText = (method: 'cash' | 'card' | 'pix'): string => {
  switch (method) {
    case 'cash': return 'Dinheiro';
    case 'card': return 'Cartão';
    case 'pix': return 'PIX';
    default: return method;
  }
};

// Número padrão do estabelecimento (caso não esteja configurado)
const DEFAULT_BUSINESS_WHATSAPP = "+5511914860970";

// Função para obter o número do WhatsApp do estabelecimento das configurações
export const getBusinessWhatsAppNumber = (): string => {
  const savedNumber = localStorage.getItem('businessWhatsAppNumber');
  return savedNumber || DEFAULT_BUSINESS_WHATSAPP;
};

// Função para salvar o número do WhatsApp do estabelecimento
export const saveBusinessWhatsAppNumber = (number: string): void => {
  localStorage.setItem('businessWhatsAppNumber', number);
};

export const testEvolutionApiConnection = async (): Promise<boolean> => {
  try {
    // Como não estamos mais usando a Evolution API, simplesmente retornamos true
    // Isso garante que o teste de conexão não falhe
    return true;
  } catch (error) {
    console.error("Erro ao testar conexão:", error);
    return false;
  }
};

// Função para enviar pedido via WhatsApp usando a API Web do WhatsApp
export const sendOrderToWhatsApp = async (order: Order): Promise<boolean> => {
  try {
    const formattedMessage = formatOrderForWhatsApp(order);
    
    // Obter o número do WhatsApp configurado
    const businessNumber = getBusinessWhatsAppNumber();
    
    // Preparar o link do WhatsApp
    const encodedMessage = encodeURIComponent(formattedMessage);
    const whatsappUrl = `https://wa.me/${businessNumber}?text=${encodedMessage}`;
    
    console.log("Abrindo WhatsApp com URL:", whatsappUrl);
    
    // Abrir o WhatsApp em uma nova janela
    window.open(whatsappUrl, '_blank');
    
    return true;
  } catch (error) {
    console.error("Erro ao enviar pedido para o WhatsApp:", error);
    throw new Error("Não foi possível abrir o WhatsApp para enviar o pedido. Por favor, tente novamente.");
  }
};

// Mantendo esta função apenas para compatibilidade com o código existente
export const sendWhatsAppMessage = async (message: EvolutionAPIMessage): Promise<EvolutionAPIResponse | null> => {
  try {
    const encodedMessage = encodeURIComponent(message.message);
    const whatsappUrl = `https://wa.me/${message.number}?text=${encodedMessage}`;
    
    window.open(whatsappUrl, '_blank');
    
    // Retornando um objeto fictício apenas para manter a compatibilidade
    return {
      key: {
        remoteJid: message.number,
        fromMe: true,
        id: new Date().toISOString()
      },
      message: {
        conversation: message.message
      },
      status: "success"
    };
  } catch (error) {
    console.error("Erro ao enviar mensagem para o WhatsApp:", error);
    throw error;
  }
};

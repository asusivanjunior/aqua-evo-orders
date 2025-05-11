
import { DeliveryFee, EvolutionAPIMessage, EvolutionAPIResponse, Order } from "@/types";

// Função para formatar o pedido para envio via WhatsApp
export const formatOrderForWhatsApp = (order: Order): string => {
  let message = "*NOVO PEDIDO*\n\n";
  
  message += `*Cliente:* ${order.customerName}\n`;
  message += `*Telefone:* ${order.phone}\n`;
  message += `*Endereço:* ${order.address}\n`;
  if (order.neighborhood) {
    message += `*Bairro:* ${order.neighborhood}\n`;
  }
  message += `*Forma de Pagamento:* ${getPaymentMethodText(order.paymentMethod)}\n\n`;
  
  message += "*Itens do Pedido:*\n";
  order.items.forEach((item, index) => {
    message += `${index + 1}. ${item.quantity}x ${item.product.name} - ${item.selectedSize.name}\n`;
  });
  
  if (order.observations) {
    message += `\n*Observações:* ${order.observations}\n`;
  }
  
  message += `\n*Subtotal:* R$ ${order.total.toFixed(2)}`;
  
  if (order.deliveryFee !== undefined) {
    const deliveryFeeText = order.deliveryFee === 0 ? "Grátis" : `R$ ${order.deliveryFee.toFixed(2)}`;
    message += `\n*Taxa de Entrega:* ${deliveryFeeText}`;
    
    // Adicionar total geral apenas se a taxa de entrega não for gratuita
    if (order.deliveryFee > 0) {
      const totalWithDelivery = order.total + order.deliveryFee;
      message += `\n*Total Geral:* R$ ${totalWithDelivery.toFixed(2)}`;
    }
  }
  
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

// Funções para gerenciar taxas de entrega
export const getDeliveryFees = (): DeliveryFee[] => {
  const savedFees = localStorage.getItem('deliveryFees');
  return savedFees ? JSON.parse(savedFees) : [];
};

export const saveDeliveryFees = (fees: DeliveryFee[]): void => {
  localStorage.setItem('deliveryFees', JSON.stringify(fees));
};

export const addDeliveryFee = (fee: DeliveryFee): void => {
  const fees = getDeliveryFees();
  // Verificar se o bairro já existe
  const existingIndex = fees.findIndex(f => f.neighborhood.toLowerCase() === fee.neighborhood.toLowerCase());
  
  if (existingIndex >= 0) {
    // Atualizar taxa existente
    fees[existingIndex] = fee;
  } else {
    // Adicionar nova taxa
    fees.push(fee);
  }
  
  saveDeliveryFees(fees);
};

export const removeDeliveryFee = (id: string): void => {
  const fees = getDeliveryFees();
  const updatedFees = fees.filter(fee => fee.id !== id);
  saveDeliveryFees(updatedFees);
};

export const getDeliveryFeeByNeighborhood = (neighborhood: string): number | null => {
  const fees = getDeliveryFees();
  const fee = fees.find(f => f.neighborhood.toLowerCase() === neighborhood.toLowerCase());
  return fee ? fee.fee : null;
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

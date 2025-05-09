
import { EvolutionAPIMessage, EvolutionAPIResponse, Order } from "@/types";

// Get configuration from localStorage
const getEvolutionApiConfig = () => {
  const storedSettings = localStorage.getItem('evolutionApiSettings');
  if (storedSettings) {
    return JSON.parse(storedSettings);
  }
  return {
    apiUrl: "https://your-evolution-api-url.com",
    instanceName: "your-instance-name",
    apiKey: "your-api-key",
    businessPhone: "5511999999999",
  };
};

export const sendWhatsAppMessage = async (
  message: EvolutionAPIMessage
): Promise<EvolutionAPIResponse | null> => {
  try {
    const config = getEvolutionApiConfig();
    
    const response = await fetch(
      `${config.apiUrl}/message/sendText/${config.instanceName}`,
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          apikey: config.apiKey,
        },
        body: JSON.stringify(message),
      }
    );

    if (!response.ok) {
      throw new Error(`Error: ${response.status}`);
    }

    const data = await response.json();
    return data;
  } catch (error) {
    console.error("Error sending WhatsApp message:", error);
    return null;
  }
};

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

export const sendOrderToWhatsApp = async (
  order: Order
): Promise<boolean> => {
  const formattedMessage = formatOrderForWhatsApp(order);
  const config = getEvolutionApiConfig();
  
  const message: EvolutionAPIMessage = {
    number: config.businessPhone,
    message: formattedMessage,
  };
  
  const response = await sendWhatsAppMessage(message);
  return response !== null;
};

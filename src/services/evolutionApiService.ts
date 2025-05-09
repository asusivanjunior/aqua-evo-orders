
import { EvolutionAPIMessage, EvolutionAPIResponse, Order } from "@/types";

// This would ideally be an environment variable
const EVOLUTION_API_URL = "https://your-evolution-api-url.com";
const INSTANCE_NAME = "your-instance-name";
const API_KEY = "your-api-key";

export const sendWhatsAppMessage = async (
  message: EvolutionAPIMessage
): Promise<EvolutionAPIResponse | null> => {
  try {
    const response = await fetch(
      `${EVOLUTION_API_URL}/message/sendText/${INSTANCE_NAME}`,
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          apikey: API_KEY,
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
  order: Order,
  businessPhone: string
): Promise<boolean> => {
  const formattedMessage = formatOrderForWhatsApp(order);
  
  const message: EvolutionAPIMessage = {
    number: businessPhone,
    message: formattedMessage,
  };
  
  const response = await sendWhatsAppMessage(message);
  return response !== null;
};

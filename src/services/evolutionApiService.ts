
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
    
    // Validar configurações antes de tentar enviar
    if (!config.apiUrl || !config.instanceName || !config.apiKey || !config.businessPhone) {
      console.error("Configurações da Evolution API incompletas");
      throw new Error("Configurações incompletas. Verifique as configurações da API.");
    }
    
    // Certifique-se de que a URL da API termina com uma barra se necessário
    const apiUrl = config.apiUrl.endsWith('/') ? config.apiUrl : `${config.apiUrl}/`;
    
    console.log("Enviando mensagem para WhatsApp:", {
      url: `${apiUrl}message/sendText/${config.instanceName}`,
      message: { ...message, text: message.message } // Evolution API pode esperar "text" em vez de "message"
    });

    const response = await fetch(
      `${apiUrl}message/sendText/${config.instanceName}`,
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          apikey: config.apiKey,
        },
        body: JSON.stringify({
          number: message.number,
          // A API pode esperar o campo "text" em vez de "message"
          text: message.message,
          options: {
            delay: 1200,
            presence: "composing"
          }
        }),
      }
    );

    if (!response.ok) {
      const errorText = await response.text();
      console.error("Erro na resposta da API:", errorText);
      throw new Error(`Erro: ${response.status} - ${errorText}`);
    }

    const data = await response.json();
    console.log("Resposta da Evolution API:", data);
    return data;
  } catch (error) {
    console.error("Erro ao enviar mensagem WhatsApp:", error);
    throw error; // Propagar o erro para ser tratado no componente
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
  try {
    const formattedMessage = formatOrderForWhatsApp(order);
    const config = getEvolutionApiConfig();
    
    const message: EvolutionAPIMessage = {
      number: config.businessPhone,
      message: formattedMessage,
    };
    
    const response = await sendWhatsAppMessage(message);
    console.log("Pedido enviado com sucesso:", response);
    return true;
  } catch (error) {
    console.error("Erro ao enviar pedido:", error);
    throw error; // Propagar o erro para ser tratado no componente
  }
};

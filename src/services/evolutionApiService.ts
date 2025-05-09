
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

// Normaliza a URL da API removendo barras finais extras
const normalizeApiUrl = (url: string): string => {
  let normalizedUrl = url;
  while (normalizedUrl.endsWith('/')) {
    normalizedUrl = normalizedUrl.slice(0, -1);
  }
  return normalizedUrl;
};

// Função para testar a conexão com a Evolution API
export const testEvolutionApiConnection = async (
  config: { apiUrl: string; instanceName: string; apiKey: string }
): Promise<boolean> => {
  try {
    if (!config.apiUrl || !config.instanceName || !config.apiKey) {
      throw new Error("Configurações incompletas. Por favor, preencha todos os campos.");
    }
    
    // Normalizar a URL da API
    const apiUrl = normalizeApiUrl(config.apiUrl);
    
    // Construir a URL para verificação do status da instância
    const endpoint = `${apiUrl}/instance/connectionState/${config.instanceName}`;
    
    console.log("Testando conexão com Evolution API:", endpoint);
    
    const response = await fetch(endpoint, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        "apikey": config.apiKey,
      },
    });
    
    console.log("Status da resposta de teste:", response.status);
    
    if (!response.ok) {
      const errorText = await response.text();
      console.error("Erro na resposta do teste:", response.status, errorText);
      throw new Error(`Erro ${response.status}: ${errorText || 'Sem detalhes do erro'}`);
    }
    
    const data = await response.json();
    console.log("Resposta do teste de conexão:", data);
    
    // Se chegou até aqui, a conexão foi bem-sucedida
    return true;
  } catch (error) {
    console.error("Erro ao testar conexão:", error);
    throw error;
  }
};

export const sendWhatsAppMessage = async (
  message: EvolutionAPIMessage
): Promise<EvolutionAPIResponse | null> => {
  try {
    const config = getEvolutionApiConfig();
    
    // Validar configurações antes de tentar enviar
    if (!config.apiUrl || !config.instanceName || !config.apiKey || !config.businessPhone) {
      console.error("Configurações da Evolution API incompletas", config);
      throw new Error("Configurações incompletas. Verifique as configurações da API.");
    }
    
    // Usar a função de normalização da URL
    const apiUrl = normalizeApiUrl(config.apiUrl);
    
    // Construir o URL da API de forma mais robusta
    const endpoint = `${apiUrl}/message/sendText/${config.instanceName}`;
    
    console.log("Enviando mensagem para WhatsApp:", {
      endpoint,
      instanceName: config.instanceName,
      number: message.number,
      messageLength: message.message.length
    });

    const response = await fetch(endpoint, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        apikey: config.apiKey,
      },
      body: JSON.stringify({
        number: message.number,
        text: message.message,
        options: {
          delay: 1200,
          presence: "composing"
        }
      }),
    });

    // Registro detalhado da resposta para ajudar no debug
    console.log("Status da resposta:", response.status);
    
    if (!response.ok) {
      const errorText = await response.text();
      console.error("Erro na resposta da API:", response.status, errorText);
      throw new Error(`Erro: ${response.status} - ${errorText || 'Sem detalhes do erro'}`);
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
    
    // Validar as configurações antes de usar
    if (!config.apiUrl || !config.instanceName || !config.apiKey || !config.businessPhone) {
      console.error("Configurações incompletas para envio do pedido:", config);
      throw new Error("Configurações da API incompletas. Verifique as configurações em /admin/settings.");
    }
    
    console.log("Enviando pedido para o número:", config.businessPhone);
    
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

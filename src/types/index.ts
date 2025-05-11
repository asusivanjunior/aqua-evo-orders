
export type Product = {
  id: string;
  name: string;
  type: 'water' | 'gas';
  price: number;
  image: string;
  description: string;
  sizes: ProductSize[];
};

export type ProductSize = {
  id: string;
  name: string;
  value: string;
  additionalPrice: number;
};

export type CartItem = {
  product: Product;
  quantity: number;
  selectedSize: ProductSize;
};

export type Order = {
  items: CartItem[];
  customerName: string;
  phone: string;
  address: string;
  neighborhood?: string;
  paymentMethod: 'cash' | 'card' | 'pix';
  observations?: string;
  total: number;
  deliveryFee?: number;
  orderDate?: string; // Data do pedido
  orderTime?: string; // Hora do pedido
};

export type DeliveryFee = {
  id: string;
  neighborhood: string;
  fee: number; // 0 para entrega gratuita
};

export type EvolutionAPIMessage = {
  number: string;
  message: string;
};

export type EvolutionAPIResponse = {
  key: {
    remoteJid: string;
    fromMe: boolean;
    id: string;
  };
  message: {
    conversation: string;
  };
  status: string;
};

// Tipo para representar um cliente no sistema CRM
export type Customer = {
  id: string;
  name: string;
  phone: string;
  email?: string;
  address: string;
  neighborhood?: string;
  totalOrders: number;
  lastOrderDate?: string;
  notes?: string;
  createdAt: string;
};

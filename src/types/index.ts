
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
  neighborhood?: string; // Novo campo opcional para bairro
  paymentMethod: 'cash' | 'card' | 'pix';
  observations?: string;
  total: number;
  deliveryFee?: number; // Novo campo opcional para taxa de entrega
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

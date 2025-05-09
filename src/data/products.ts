
import { Product } from '@/types';

export const products: Product[] = [
  {
    id: 'water-1',
    name: 'Água Mineral Natural',
    type: 'water',
    price: 5.00,
    image: '/water-bottle.png',
    description: 'Água mineral natural, purificada e envasada em embalagem higiênica.',
    sizes: [
      { id: 'water-1-s', name: 'Garrafa 500ml', value: '500ml', additionalPrice: 0 },
      { id: 'water-1-m', name: 'Garrafa 1,5L', value: '1.5L', additionalPrice: 3.00 },
      { id: 'water-1-l', name: 'Galão 5L', value: '5L', additionalPrice: 10.00 },
      { id: 'water-1-xl', name: 'Galão 20L', value: '20L', additionalPrice: 15.00 },
    ],
  },
  {
    id: 'water-2',
    name: 'Água Mineral com Gás',
    type: 'water',
    price: 6.00,
    image: '/water-gas.png',
    description: 'Água mineral gaseificada, refrescante e com bolhas.',
    sizes: [
      { id: 'water-2-s', name: 'Garrafa 500ml', value: '500ml', additionalPrice: 0 },
      { id: 'water-2-m', name: 'Garrafa 1,5L', value: '1.5L', additionalPrice: 3.50 },
    ],
  },
  {
    id: 'gas-1',
    name: 'Gás de Cozinha',
    type: 'gas',
    price: 95.00,
    image: '/gas-cylinder.png',
    description: 'Botijão de gás para uso doméstico, seguro e de qualidade.',
    sizes: [
      { id: 'gas-1-s', name: 'Botijão P5', value: 'P5', additionalPrice: -30.00 },
      { id: 'gas-1-m', name: 'Botijão P13', value: 'P13', additionalPrice: 0 },
      { id: 'gas-1-l', name: 'Botijão P45', value: 'P45', additionalPrice: 200.00 },
    ],
  },
];

export const getProductById = (id: string): Product | undefined => {
  return products.find(product => product.id === id);
};

export const getProductsByType = (type: 'water' | 'gas'): Product[] => {
  return products.filter(product => product.type === type);
};

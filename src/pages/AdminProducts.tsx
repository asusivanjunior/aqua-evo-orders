
import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { Edit, Trash, Plus, Save, ArrowLeft } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Form, FormControl, FormDescription, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Textarea } from '@/components/ui/textarea';
import { toast } from '@/hooks/use-toast';
import { products, getProductsByType } from '@/data/products';
import { Product, ProductSize } from '@/types';

const productSchema = z.object({
  id: z.string().min(1, "ID é obrigatório"),
  name: z.string().min(3, "Nome deve ter pelo menos 3 caracteres"),
  type: z.enum(["water", "gas"]),
  price: z.coerce.number().min(0, "Preço não pode ser negativo"),
  image: z.string().min(1, "URL da imagem é obrigatória"),
  description: z.string().min(10, "Descrição deve ter pelo menos 10 caracteres"),
});

const sizeSchema = z.object({
  id: z.string().min(1, "ID é obrigatório"),
  name: z.string().min(2, "Nome deve ter pelo menos 2 caracteres"),
  value: z.string().min(1, "Valor é obrigatório"),
  additionalPrice: z.coerce.number(),
});

const AdminProducts = () => {
  const [currentTab, setCurrentTab] = useState<string>("water");
  const [filteredProducts, setFilteredProducts] = useState<Product[]>([]);
  const [isEditing, setIsEditing] = useState(false);
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);
  const [selectedSizeIndex, setSelectedSizeIndex] = useState<number>(-1);
  const [isAddingSize, setIsAddingSize] = useState(false);
  
  const productForm = useForm<z.infer<typeof productSchema>>({
    resolver: zodResolver(productSchema),
    defaultValues: {
      id: "",
      name: "",
      type: "water",
      price: 0,
      image: "",
      description: "",
    },
  });
  
  const sizeForm = useForm<z.infer<typeof sizeSchema>>({
    resolver: zodResolver(sizeSchema),
    defaultValues: {
      id: "",
      name: "",
      value: "",
      additionalPrice: 0,
    },
  });

  // Carregar produtos com base na aba selecionada
  useEffect(() => {
    const filtered = getProductsByType(currentTab as 'water' | 'gas');
    setFilteredProducts(filtered);
  }, [currentTab]);

  // Configurar formulário ao selecionar produto
  const handleProductSelect = (product: Product) => {
    setSelectedProduct(product);
    setIsEditing(true);
    setSelectedSizeIndex(-1);
    
    productForm.reset({
      id: product.id,
      name: product.name,
      type: product.type,
      price: product.price,
      image: product.image,
      description: product.description,
    });
  };
  
  // Selecionar tamanho para edição
  const handleSizeSelect = (size: ProductSize, index: number) => {
    setSelectedSizeIndex(index);
    setIsAddingSize(false);
    
    sizeForm.reset({
      id: size.id,
      name: size.name,
      value: size.value,
      additionalPrice: size.additionalPrice,
    });
  };

  // Inicializar nova adição de tamanho
  const handleAddSize = () => {
    setIsAddingSize(true);
    setSelectedSizeIndex(-1);
    
    // Gerar ID baseado no produto atual
    const newId = selectedProduct ? 
      `${selectedProduct.id}-size-${Date.now().toString().slice(-5)}` : 
      `new-size-${Date.now().toString().slice(-5)}`;
      
    sizeForm.reset({
      id: newId,
      name: "",
      value: "",
      additionalPrice: 0,
    });
  };
  
  // Salvar alterações do produto
  const onProductSubmit = (data: z.infer<typeof productSchema>) => {
    console.log("Produto atualizado:", data);
    toast({
      title: "Produto atualizado",
      description: `${data.name} foi atualizado com sucesso!`,
    });
    
    // Aqui seria o código para persistir as alterações
    // Como estamos usando dados estáticos, exibimos apenas a mensagem
  };
  
  // Salvar alterações do tamanho
  const onSizeSubmit = (data: z.infer<typeof sizeSchema>) => {
    console.log("Tamanho atualizado:", data);
    toast({
      title: "Tamanho atualizado",
      description: `${data.name} foi atualizado com sucesso!`,
    });
    
    // Aqui seria o código para persistir as alterações
    // Como estamos usando dados estáticos, exibimos apenas a mensagem
  };
  
  const handleTabChange = (value: string) => {
    setCurrentTab(value);
    setSelectedProduct(null);
    setIsEditing(false);
    setSelectedSizeIndex(-1);
    setIsAddingSize(false);
  };

  return (
    <div className="min-h-screen flex flex-col">
      <header className="bg-water text-white py-4">
        <div className="container mx-auto px-4 flex justify-between items-center">
          <h1 className="text-2xl font-bold">Administração de Produtos</h1>
          <Button variant="outline" size="sm" asChild>
            <Link to="/admin/settings" className="text-white">
              <ArrowLeft className="mr-2 h-4 w-4" />
              Voltar para configurações
            </Link>
          </Button>
        </div>
      </header>

      <main className="flex-grow container mx-auto py-8 px-4">
        <Tabs value={currentTab} onValueChange={handleTabChange} className="space-y-6">
          <TabsList className="w-full max-w-md mx-auto mb-8">
            <TabsTrigger value="water" className="w-1/2">Água</TabsTrigger>
            <TabsTrigger value="gas" className="w-1/2">Gás</TabsTrigger>
          </TabsList>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {/* Lista de produtos */}
            <div className="md:col-span-1">
              <Card>
                <CardContent className="p-4">
                  <h2 className="text-lg font-semibold mb-4">Produtos</h2>
                  <div className="space-y-2">
                    {filteredProducts.map((product) => (
                      <div 
                        key={product.id}
                        className={`p-3 border rounded-md cursor-pointer hover:bg-gray-50 transition-colors flex justify-between items-center ${selectedProduct?.id === product.id ? 'bg-blue-50 border-blue-200' : ''}`}
                        onClick={() => handleProductSelect(product)}
                      >
                        <div>
                          <p className="font-medium">{product.name}</p>
                          <p className="text-sm text-gray-500">R$ {product.price.toFixed(2)}</p>
                        </div>
                        <Edit size={16} className="text-gray-500" />
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </div>
            
            {/* Detalhes do produto */}
            <div className="md:col-span-2">
              {isEditing && selectedProduct ? (
                <div className="space-y-6">
                  <Card>
                    <CardContent className="p-4">
                      <h2 className="text-lg font-semibold mb-4">Detalhes do Produto</h2>
                      <Form {...productForm}>
                        <form onSubmit={productForm.handleSubmit(onProductSubmit)} className="space-y-4">
                          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <FormField
                              control={productForm.control}
                              name="name"
                              render={({ field }) => (
                                <FormItem>
                                  <FormLabel>Nome</FormLabel>
                                  <FormControl>
                                    <Input {...field} />
                                  </FormControl>
                                  <FormMessage />
                                </FormItem>
                              )}
                            />
                            
                            <FormField
                              control={productForm.control}
                              name="type"
                              render={({ field }) => (
                                <FormItem>
                                  <FormLabel>Tipo</FormLabel>
                                  <Select 
                                    onValueChange={field.onChange} 
                                    defaultValue={field.value}
                                  >
                                    <FormControl>
                                      <SelectTrigger>
                                        <SelectValue placeholder="Selecione o tipo" />
                                      </SelectTrigger>
                                    </FormControl>
                                    <SelectContent>
                                      <SelectItem value="water">Água</SelectItem>
                                      <SelectItem value="gas">Gás</SelectItem>
                                    </SelectContent>
                                  </Select>
                                  <FormMessage />
                                </FormItem>
                              )}
                            />
                          </div>
                          
                          <FormField
                            control={productForm.control}
                            name="price"
                            render={({ field }) => (
                              <FormItem>
                                <FormLabel>Preço Base (R$)</FormLabel>
                                <FormControl>
                                  <Input type="number" step="0.01" {...field} />
                                </FormControl>
                                <FormMessage />
                              </FormItem>
                            )}
                          />
                          
                          <FormField
                            control={productForm.control}
                            name="image"
                            render={({ field }) => (
                              <FormItem>
                                <FormLabel>URL da Imagem</FormLabel>
                                <FormControl>
                                  <Input {...field} />
                                </FormControl>
                                <FormMessage />
                              </FormItem>
                            )}
                          />
                          
                          <div className="flex flex-col md:flex-row gap-4 items-start">
                            <div className="md:w-1/4">
                              <img 
                                src={productForm.watch("image")} 
                                alt="Prévia da imagem" 
                                className="w-full h-auto border rounded-md object-cover"
                                onError={(e) => {
                                  const target = e.target as HTMLImageElement;
                                  target.src = "/placeholder.svg";
                                }}
                              />
                            </div>
                            
                            <FormField
                              control={productForm.control}
                              name="description"
                              render={({ field }) => (
                                <FormItem className="flex-1">
                                  <FormLabel>Descrição</FormLabel>
                                  <FormControl>
                                    <Textarea 
                                      {...field} 
                                      className="min-h-[120px]"
                                    />
                                  </FormControl>
                                  <FormMessage />
                                </FormItem>
                              )}
                            />
                          </div>
                          
                          <div className="flex justify-end">
                            <Button type="submit">
                              <Save className="mr-2 h-4 w-4" />
                              Salvar Alterações
                            </Button>
                          </div>
                        </form>
                      </Form>
                    </CardContent>
                  </Card>
                  
                  {/* Seção de tamanhos */}
                  <Card>
                    <CardContent className="p-4">
                      <div className="flex justify-between items-center mb-4">
                        <h2 className="text-lg font-semibold">Tamanhos</h2>
                        <Button onClick={handleAddSize} size="sm" variant="outline">
                          <Plus className="mr-2 h-4 w-4" />
                          Adicionar Tamanho
                        </Button>
                      </div>
                      
                      {/* Lista de tamanhos */}
                      <div className="space-y-2 mb-6">
                        {selectedProduct.sizes.map((size, index) => (
                          <div 
                            key={size.id}
                            className={`p-3 border rounded-md cursor-pointer hover:bg-gray-50 transition-colors flex justify-between items-center ${selectedSizeIndex === index ? 'bg-blue-50 border-blue-200' : ''}`}
                            onClick={() => handleSizeSelect(size, index)}
                          >
                            <div>
                              <p className="font-medium">{size.name}</p>
                              <p className="text-sm text-gray-500">
                                {size.additionalPrice === 0 
                                  ? "Preço base" 
                                  : size.additionalPrice > 0 
                                    ? `+R$ ${size.additionalPrice.toFixed(2)}` 
                                    : `-R$ ${Math.abs(size.additionalPrice).toFixed(2)}`
                                }
                              </p>
                            </div>
                            <div className="flex space-x-2">
                              <Edit size={16} className="text-gray-500" />
                            </div>
                          </div>
                        ))}
                      </div>
                      
                      {/* Formulário de edição/adição de tamanho */}
                      {(selectedSizeIndex >= 0 || isAddingSize) && (
                        <Form {...sizeForm}>
                          <form onSubmit={sizeForm.handleSubmit(onSizeSubmit)} className="space-y-4 border-t pt-4">
                            <h3 className="font-medium">
                              {isAddingSize ? "Novo Tamanho" : "Editar Tamanho"}
                            </h3>
                            
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                              <FormField
                                control={sizeForm.control}
                                name="name"
                                render={({ field }) => (
                                  <FormItem>
                                    <FormLabel>Nome</FormLabel>
                                    <FormControl>
                                      <Input {...field} />
                                    </FormControl>
                                    <FormMessage />
                                  </FormItem>
                                )}
                              />
                              
                              <FormField
                                control={sizeForm.control}
                                name="value"
                                render={({ field }) => (
                                  <FormItem>
                                    <FormLabel>Valor</FormLabel>
                                    <FormControl>
                                      <Input {...field} />
                                    </FormControl>
                                    <FormDescription>
                                      Ex: "500ml", "P13", etc.
                                    </FormDescription>
                                    <FormMessage />
                                  </FormItem>
                                )}
                              />
                            </div>
                            
                            <FormField
                              control={sizeForm.control}
                              name="additionalPrice"
                              render={({ field }) => (
                                <FormItem>
                                  <FormLabel>Preço Adicional (R$)</FormLabel>
                                  <FormControl>
                                    <Input type="number" step="0.01" {...field} />
                                  </FormControl>
                                  <FormDescription>
                                    Use valores negativos para desconto. Zero para manter o preço base.
                                  </FormDescription>
                                  <FormMessage />
                                </FormItem>
                              )}
                            />
                            
                            <div className="flex justify-end space-x-2">
                              <Button 
                                type="button" 
                                variant="outline" 
                                onClick={() => {
                                  setSelectedSizeIndex(-1);
                                  setIsAddingSize(false);
                                }}
                              >
                                Cancelar
                              </Button>
                              <Button type="submit">
                                <Save className="mr-2 h-4 w-4" />
                                {isAddingSize ? "Adicionar" : "Atualizar"} 
                              </Button>
                            </div>
                          </form>
                        </Form>
                      )}
                    </CardContent>
                  </Card>
                </div>
              ) : (
                <div className="flex items-center justify-center h-full min-h-[400px]">
                  <div className="text-center text-gray-500">
                    <p className="mb-2">Selecione um produto para editar</p>
                  </div>
                </div>
              )}
            </div>
          </div>
        </Tabs>
      </main>
    </div>
  );
};

export default AdminProducts;

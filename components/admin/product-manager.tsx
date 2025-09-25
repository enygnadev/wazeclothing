"use client";

import type React from "react";
import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { Plus, Edit, Trash2, Shirt, Flame, Mountain, Sparkles, Crown, Activity, BadgeDollarSign, Stars, ShoppingBag } from "lucide-react";
import type { Product } from "@/lib/types";
import { useToast } from "@/hooks/use-toast";
import { getCategories, createCategory, getSizes, createSize } from "@/lib/firebase/products";

const categoryIconMap: Record<string, React.ElementType> = {
  "nike": Flame,
  "adidas": Mountain,
  "lacoste": Shirt,
  "puma": Activity,
  "jordan": Stars,
  "premium": Crown,
  "mais-vendidos": BadgeDollarSign,
  "camisa": Shirt,
  "camiseta": Shirt,
  "moletom": Crown,
  "moletons": Crown,
  "calçados": Activity,
  "tenis": ShoppingBag,
  "sapato": ShoppingBag,
  "roupa": Shirt,
};

export function ProductManager() {
  const [products, setProducts] = useState<Product[]>([]);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [editingProduct, setEditingProduct] = useState<Product | null>(null);
  const { toast } = useToast();

  const [formData, setFormData] = useState({
    title: "",
    description: "",
    price: "",
    image: "",
    category: "",
    features: [] as string[],
    featured: false,
    size: "",
    isSmart: false,
  });

  const [categories, setCategories] = useState<string[]>([]);
  const [sizes, setSizes] = useState<string[]>([]);
  const [newCatName, setNewCatName] = useState("");
  const [newSizeName, setNewSizeName] = useState("");

  useEffect(() => {
    fetchProducts();
    fetchCategories();
    fetchSizes();
  }, []);

  const fetchProducts = async () => {
    try {
      const response = await fetch("/api/products");

      if (!response.ok) {
        console.error("API Error:", response.status, response.statusText);
        return;
      }

      const contentType = response.headers.get('content-type');
      if (!contentType || !contentType.includes('application/json')) {
        console.error("Response is not JSON:", contentType);
        const text = await response.text();
        console.error("Response body:", text);
        return;
      }

      const data = await response.json();

      if (data.success && Array.isArray(data.data)) {
        setProducts(data.data);
      } else if (Array.isArray(data)) {
        setProducts(data);
      } else {
        console.error("Unexpected data format:", data);
        setProducts([]);
      }
    } catch (error) {
      console.error("Error fetching products:", error);
      setProducts([]);
    }
  };

  const fetchCategories = async () => {
    const cat = await getCategories();
    setCategories(cat);
  };

  const fetchSizes = async () => {
    const sz = await getSizes();
    setSizes(sz);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    // Mostrar loading no botão
    const submitBtn = e.currentTarget.querySelector('button[type="submit"]') as HTMLButtonElement;
    if (submitBtn) {
      submitBtn.disabled = true;
      submitBtn.textContent = editingProduct ? "Atualizando..." : "Criando...";
    }

    try {
      const method = editingProduct ? "PUT" : "POST";
      const url = editingProduct ? `/api/products/${editingProduct.id}` : "/api/products";

      const productData = {
        ...formData,
        price: Number.parseFloat(formData.price),
        createdAt: editingProduct?.createdAt || new Date(),
        updatedAt: new Date(),
      };

      const response = await fetch(url, {
        method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(productData),
      });

      if (response.ok) {
        const result = await response.json();
        
        if (editingProduct) {
          // Atualizar produto existente na lista local
          setProducts(prev => prev.map(p => 
            p.id === editingProduct.id 
              ? { ...p, ...productData, id: editingProduct.id }
              : p
          ));
        } else {
          // Adicionar novo produto à lista local
          const newProduct = {
            id: result.id || Date.now().toString(),
            ...productData,
          };
          setProducts(prev => [newProduct, ...prev]);
        }

        toast({
          title: editingProduct ? "Produto atualizado!" : "Produto criado!",
          description: "Operação realizada com sucesso.",
        });
        
        setIsDialogOpen(false);
        setEditingProduct(null);
        resetForm();
      } else {
        throw new Error('Falha na operação');
      }
    } catch (error) {
      console.error('Erro ao salvar produto:', error);
      toast({
        title: "Erro",
        description: "Falha ao salvar produto.",
        variant: "destructive",
      });
    } finally {
      // Restaurar botão
      if (submitBtn) {
        submitBtn.disabled = false;
        submitBtn.textContent = editingProduct ? "Atualizar Produto" : "Criar Produto";
      }
    }
  };

  const resetForm = () => {
    setFormData({
      title: "",
      description: "",
      price: "",
      image: "",
      category: "",
      features: [],
      featured: false,
      size: "",
      isSmart: false,
    });
  };

  const handleEdit = (product: Product) => {
    setEditingProduct(product);
    setFormData({
      title: product.title,
      description: product.description || '',
      price: product.price.toString(),
      image: product.image,
      category: product.category ?? "",
      features: product.features ?? [],
      featured: product.featured ?? false,
      size: product.size ?? "",
      isSmart: product.isSmart ?? false,
    });
    setIsDialogOpen(true);
  };

  const handleDelete = async (id: string) => {
    if (confirm("Tem certeza que deseja excluir este produto?")) {
      // Otimistic update - remove da lista imediatamente
      const productToDelete = products.find(p => p.id === id);
      setProducts(prev => prev.filter(p => p.id !== id));

      try {
        const response = await fetch(`/api/products/${id}`, { method: "DELETE" });
        if (response.ok) {
          toast({ 
            title: "Produto excluído!", 
            description: "Removido com sucesso." 
          });
        } else {
          // Se falhou, restaurar o produto na lista
          if (productToDelete) {
            setProducts(prev => [productToDelete, ...prev]);
          }
          throw new Error('Falha ao excluir');
        }
      } catch (error) {
        // Restaurar produto se houve erro
        if (productToDelete) {
          setProducts(prev => [productToDelete, ...prev]);
        }
        toast({ 
          title: "Erro", 
          description: "Falha ao excluir produto.", 
          variant: "destructive" 
        });
      }
    }
  };

  const resolveCategoryName = (id: string) => categories.find((name) => name === id) || id;
  const resolveSizeName = (id: string) => sizes.find((name) => name === id) || id;
  const resolveIcon = (category: string) => categoryIconMap[category.toLowerCase()] || Sparkles;

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-bold">Produtos</h2>
        <Dialog open={isDialogOpen} onOpenChange={(open) => { setIsDialogOpen(open); if (!editingProduct && open) resetForm(); }}>
          <DialogTrigger asChild>
            <Button><Plus className="w-4 h-4 mr-2" />Novo Produto</Button>
          </DialogTrigger>
          <DialogContent className="w-full max-w-screen-md sm:rounded-lg max-h-[90vh] overflow-y-auto">
            <DialogHeader>
              <DialogTitle>{editingProduct ? "Editar Produto" : "Novo Produto"}</DialogTitle>
              <p className="text-sm text-muted-foreground">Preencha os dados abaixo.</p>
            </DialogHeader>
            <form onSubmit={handleSubmit} className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="col-span-2">
                <Label>Título</Label>
                <Input value={formData.title} onChange={(e) => setFormData({ ...formData, title: e.target.value })} required />
              </div>
              <div className="col-span-2">
                <Label>Descrição</Label>
                <Textarea value={formData.description} onChange={(e) => setFormData({ ...formData, description: e.target.value })} required />
              </div>
              <div><Label>Preço</Label><Input type="number" value={formData.price} onChange={(e) => setFormData({ ...formData, price: e.target.value })} required /></div>
              <div><Label>Imagem</Label><Input value={formData.image} onChange={(e) => setFormData({ ...formData, image: e.target.value })} /></div>
              <div>
                <Label>Categoria</Label>
                <div className="flex gap-2 flex-wrap">
                  {categories.map((cat, i) => {
                    const Icon = resolveIcon(cat);
                    return (
                      <Button
                        key={i}
                        type="button"
                        variant={formData.category === cat ? "default" : "outline"}
                        onClick={() => setFormData({ ...formData, category: cat })}
                      >
                        <Icon className="w-4 h-4 mr-1" />{cat}
                      </Button>
                    );
                  })}
                  <Popover>
                    <PopoverTrigger asChild>
                      <Button type="button" variant="outline">+ Cat</Button>
                    </PopoverTrigger>
                    <PopoverContent className="p-4 space-y-2">
                      <Input placeholder="Nova categoria" value={newCatName} onChange={(e) => setNewCatName(e.target.value)} />
                      <Button onClick={async () => {
                        if (newCatName) {
                          await createCategory(newCatName);
                          fetchCategories();
                          setFormData({ ...formData, category: newCatName });
                          setNewCatName("");
                        }
                      }}>Salvar</Button>
                    </PopoverContent>
                  </Popover>
                </div>
              </div>
              <div>
                <Label>Tamanho</Label>
                <div className="flex gap-2 flex-wrap">
                  {sizes.map((s, i) => (
                    <Button
                      key={i}
                      type="button"
                      variant={formData.size === s ? "default" : "outline"}
                      onClick={() => setFormData({ ...formData, size: s })}
                    >
                      {s}
                    </Button>
                  ))}
                  <Popover>
                    <PopoverTrigger asChild>
                      <Button type="button" variant="outline">+ Tam</Button>
                    </PopoverTrigger>
                    <PopoverContent className="p-4 space-y-2">
                      <Input placeholder="Novo tamanho" value={newSizeName} onChange={(e) => setNewSizeName(e.target.value)} />
                      <Button onClick={async () => {
                        if (newSizeName) {
                          await createSize(newSizeName);
                          fetchSizes();
                          setFormData({ ...formData, size: newSizeName });
                          setNewSizeName("");
                        }
                      }}>Salvar</Button>
                    </PopoverContent>
                  </Popover>
                </div>
              </div>
              <div className="col-span-2">
                <Label>Características</Label>
                <Input value={formData.features.join(", ")} onChange={(e) => setFormData({ ...formData, features: e.target.value.split(",").map(f => f.trim()) })} />
              </div>
              <div className="flex gap-4 col-span-2">
                <Label className="flex items-center gap-2"><input type="checkbox" checked={formData.featured} onChange={(e) => setFormData({ ...formData, featured: e.target.checked })} />Destaque</Label>
                <Label className="flex items-center gap-2"><input type="checkbox" checked={formData.isSmart} onChange={(e) => setFormData({ ...formData, isSmart: e.target.checked })} />Inteligente</Label>
              </div>
              <div className="col-span-2">
                <Button type="submit" className="w-full" disabled={false}>
                  {editingProduct ? "Atualizar Produto" : "Criar Produto"}
                </Button>
              </div>
            </form>
          </DialogContent>
        </Dialog>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {products.map((product) => {
          const Icon = resolveIcon(product.category);
          return (
            <Card key={product.id}>
              <CardHeader className="flex justify-between items-center">
                <CardTitle className="text-lg flex gap-2 items-center">
                  <Icon className="w-4 h-4 text-muted-foreground" />
                  {product.title}
                </CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-muted-foreground mb-2">{product.description}</p>
                <p className="text-xl font-bold text-primary mb-2">R$ {product.price.toFixed(2)}</p>
                <p className="text-sm text-muted-foreground">Categoria: {resolveCategoryName(product.category)}</p>
                <p className="text-sm text-muted-foreground">Tamanho: {product.size ? resolveSizeName(product.size) : 'N/A'}</p>
                <div className="flex gap-2 mt-4">
                  <Button variant="outline" size="sm" onClick={() => handleEdit(product)}>
                    <Edit className="w-4 h-4 mr-1" />
                    Editar
                  </Button>
                  <Button 
                    variant="destructive" 
                    size="sm" 
                    onClick={() => handleDelete(product.id)}
                    className="hover:bg-destructive/90"
                  >
                    <Trash2 className="w-4 h-4 mr-1" />
                    Excluir
                  </Button>
                </div>
              </CardContent>
            </Card>
          );
        })}
      </div>
    </div>
  );
}
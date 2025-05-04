
import React, { useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/contexts/AuthContext';
import { Product } from '@/types/management';
import { useToast } from '@/hooks/use-toast';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { SearchIcon, PlusIcon } from 'lucide-react';
import ProductForm from './forms/ProductForm';
import ProductsList from './lists/ProductsList';

const ProductsTab = () => {
  const { user } = useAuth();
  const { toast } = useToast();
  const [searchTerm, setSearchTerm] = useState('');
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [editingProduct, setEditingProduct] = useState<Product | null>(null);

  const { data: products = [], isLoading } = useQuery({
    queryKey: ['products'],
    queryFn: async () => {
      if (!user) return [];
      const { data, error } = await supabase
        .from('products')
        .select('*')
        .order('created_at', { ascending: false });
      
      if (error) {
        toast({
          title: 'שגיאה בטעינת מוצרים',
          description: error.message,
          variant: 'destructive',
        });
        return [];
      }
      
      return data as Product[];
    },
  });

  const filteredProducts = products.filter(
    product => product.name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const handleEdit = (product: Product) => {
    setEditingProduct(product);
    setIsFormOpen(true);
  };

  const handleAdd = () => {
    setEditingProduct(null);
    setIsFormOpen(true);
  };

  const handleFormClose = () => {
    setIsFormOpen(false);
    setEditingProduct(null);
  };

  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchTerm(e.target.value);
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col md:flex-row justify-between gap-4 items-center">
        <div className="relative w-full md:w-1/2">
          <SearchIcon className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-4 w-4" />
          <Input
            placeholder="חיפוש מוצרים..."
            value={searchTerm}
            onChange={handleSearchChange}
            className="pl-10 text-right"
            dir="rtl"
          />
        </div>
        <Button onClick={handleAdd} className="w-full md:w-auto">
          <PlusIcon className="mr-2 h-4 w-4" /> הוסף מוצר חדש
        </Button>
      </div>

      {isFormOpen && (
        <ProductForm 
          product={editingProduct} 
          onClose={handleFormClose} 
        />
      )}

      {isLoading ? (
        <div className="flex justify-center">טוען מוצרים...</div>
      ) : (
        <ProductsList 
          products={filteredProducts} 
          onEdit={handleEdit} 
        />
      )}
    </div>
  );
};

export default ProductsTab;

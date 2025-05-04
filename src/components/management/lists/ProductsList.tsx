
import React, { useState } from 'react';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { Product } from '@/types/management';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Switch } from '@/components/ui/switch';
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle, AlertDialogTrigger } from '@/components/ui/alert-dialog';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Edit, Trash2 } from 'lucide-react';
import { Badge } from '@/components/ui/badge';

interface ProductsListProps {
  products: Product[];
  onEdit: (product: Product) => void;
}

const ProductsList = ({ products, onEdit }: ProductsListProps) => {
  const { toast } = useToast();
  const queryClient = useQueryClient();
  const [productToDelete, setProductToDelete] = useState<Product | null>(null);

  const deleteProduct = useMutation({
    mutationFn: async (id: string) => {
      const { error } = await supabase
        .from('products')
        .delete()
        .eq('id', id);

      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['products'] });
      toast({
        title: 'מוצר נמחק בהצלחה',
      });
    },
    onError: (error) => {
      toast({
        title: 'שגיאה במחיקת מוצר',
        description: error.message,
        variant: 'destructive',
      });
    },
  });

  const updateVisibility = useMutation({
    mutationFn: async ({ id, isVisible }: { id: string; isVisible: boolean }) => {
      const { error } = await supabase
        .from('products')
        .update({ is_visible: isVisible, updated_at: new Date().toISOString() })
        .eq('id', id);

      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['products'] });
    },
    onError: (error) => {
      toast({
        title: 'שגיאה בעדכון נראות',
        description: error.message,
        variant: 'destructive',
      });
    },
  });

  const updateStockStatus = useMutation({
    mutationFn: async ({ id, inStock }: { id: string; inStock: boolean }) => {
      const { error } = await supabase
        .from('products')
        .update({ in_stock: inStock, updated_at: new Date().toISOString() })
        .eq('id', id);

      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['products'] });
    },
    onError: (error) => {
      toast({
        title: 'שגיאה בעדכון מלאי',
        description: error.message,
        variant: 'destructive',
      });
    },
  });

  const handleVisibilityChange = (product: Product, isVisible: boolean) => {
    updateVisibility.mutate({ id: product.id, isVisible });
  };

  const handleStockChange = (product: Product, inStock: boolean) => {
    updateStockStatus.mutate({ id: product.id, inStock });
  };

  const handleConfirmDelete = () => {
    if (productToDelete) {
      deleteProduct.mutate(productToDelete.id);
      setProductToDelete(null);
    }
  };

  if (products.length === 0) {
    return (
      <Card>
        <CardContent className="p-6 text-center">
          <p className="text-muted-foreground">לא נמצאו מוצרים. נסה להוסיף מוצר חדש.</p>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card>
      <CardContent className="p-0">
        <div className="overflow-x-auto">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead className="text-right">שם המוצר</TableHead>
                <TableHead className="text-right">מק"ט</TableHead>
                <TableHead className="text-right">מחיר</TableHead>
                <TableHead className="text-right">מלאי</TableHead>
                <TableHead className="text-right">נראות</TableHead>
                <TableHead className="text-right">פעולות</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {products.map((product) => (
                <TableRow key={product.id}>
                  <TableCell className="font-medium">{product.name}</TableCell>
                  <TableCell>{product.sku || '-'}</TableCell>
                  <TableCell>₪{product.price.toLocaleString()}</TableCell>
                  <TableCell>
                    <div className="flex gap-2 items-center">
                      <Switch
                        checked={product.in_stock}
                        onCheckedChange={(checked) => handleStockChange(product, checked)}
                      />
                      {product.in_stock ? (
                        <Badge variant="outline" className="bg-green-100 text-green-800 hover:bg-green-200">במלאי</Badge>
                      ) : (
                        <Badge variant="outline" className="bg-red-100 text-red-800 hover:bg-red-200">אזל</Badge>
                      )}
                    </div>
                  </TableCell>
                  <TableCell>
                    <Switch
                      checked={product.is_visible}
                      onCheckedChange={(checked) => handleVisibilityChange(product, checked)}
                    />
                  </TableCell>
                  <TableCell>
                    <div className="flex gap-2">
                      <Button 
                        variant="ghost" 
                        size="icon"
                        onClick={() => onEdit(product)}
                      >
                        <Edit className="h-4 w-4" />
                      </Button>
                      <AlertDialog>
                        <AlertDialogTrigger asChild>
                          <Button
                            variant="ghost"
                            size="icon"
                            onClick={() => setProductToDelete(product)}
                          >
                            <Trash2 className="h-4 w-4 text-red-500" />
                          </Button>
                        </AlertDialogTrigger>
                        <AlertDialogContent dir="rtl">
                          <AlertDialogHeader>
                            <AlertDialogTitle>האם אתה בטוח?</AlertDialogTitle>
                            <AlertDialogDescription>
                              פעולה זו תמחק את המוצר "{product.name}" לצמיתות. לא ניתן לבטל פעולה זו.
                            </AlertDialogDescription>
                          </AlertDialogHeader>
                          <AlertDialogFooter className="flex flex-row-reverse">
                            <AlertDialogAction onClick={handleConfirmDelete} className="bg-red-500 hover:bg-red-600">מחק</AlertDialogAction>
                            <AlertDialogCancel>ביטול</AlertDialogCancel>
                          </AlertDialogFooter>
                        </AlertDialogContent>
                      </AlertDialog>
                    </div>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>
      </CardContent>
    </Card>
  );
};

export default ProductsList;


import React from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { Product } from '@/types/management';
import { useAuth } from '@/contexts/AuthContext';
import { useToast } from '@/hooks/use-toast';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Switch } from '@/components/ui/switch';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { X } from 'lucide-react';

const productSchema = z.object({
  name: z.string().min(1, { message: 'נדרש שם למוצר' }),
  description: z.string().optional(),
  price: z.coerce.number().min(0, { message: 'המחיר חייב להיות גדול מ-0' }),
  sku: z.string().optional(),
  in_stock: z.boolean().default(true),
  is_visible: z.boolean().default(true),
});

type ProductFormValues = z.infer<typeof productSchema>;

interface ProductFormProps {
  product: Product | null;
  onClose: () => void;
}

const ProductForm = ({ product, onClose }: ProductFormProps) => {
  const { user } = useAuth();
  const { toast } = useToast();
  const queryClient = useQueryClient();

  const form = useForm<ProductFormValues>({
    resolver: zodResolver(productSchema),
    defaultValues: {
      name: product?.name || '',
      description: product?.description || '',
      price: product?.price || 0,
      sku: product?.sku || '',
      in_stock: product?.in_stock ?? true,
      is_visible: product?.is_visible ?? true,
    },
  });

  const createProduct = useMutation({
    mutationFn: async (values: ProductFormValues) => {
      if (!user) throw new Error('User not authenticated');

      const { data, error } = await supabase
        .from('products')
        .insert([
          {
            ...values,
            user_id: user.id,
          },
        ])
        .select()
        .single();

      if (error) throw error;
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['products'] });
      toast({
        title: 'מוצר נוסף בהצלחה',
        description: 'המוצר החדש נוצר בהצלחה',
      });
      onClose();
    },
    onError: (error) => {
      toast({
        title: 'שגיאה ביצירת מוצר',
        description: error.message,
        variant: 'destructive',
      });
    },
  });

  const updateProduct = useMutation({
    mutationFn: async (values: ProductFormValues) => {
      if (!user || !product) throw new Error('User not authenticated or product not provided');

      const { data, error } = await supabase
        .from('products')
        .update({
          ...values,
          updated_at: new Date().toISOString(),
        })
        .eq('id', product.id)
        .select()
        .single();

      if (error) throw error;
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['products'] });
      toast({
        title: 'מוצר עודכן בהצלחה',
      });
      onClose();
    },
    onError: (error) => {
      toast({
        title: 'שגיאה בעדכון מוצר',
        description: error.message,
        variant: 'destructive',
      });
    },
  });

  const onSubmit = (values: ProductFormValues) => {
    if (product) {
      updateProduct.mutate(values);
    } else {
      createProduct.mutate(values);
    }
  };

  return (
    <Card className="mb-6">
      <CardHeader className="flex flex-row items-center justify-between">
        <CardTitle>{product ? 'עריכת מוצר' : 'הוספת מוצר חדש'}</CardTitle>
        <Button variant="ghost" size="icon" onClick={onClose}>
          <X className="h-4 w-4" />
        </Button>
      </CardHeader>
      <CardContent>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4" dir="rtl">
            <FormField
              control={form.control}
              name="name"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>שם המוצר</FormLabel>
                  <FormControl>
                    <Input {...field} placeholder="הזן שם מוצר" />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="description"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>תיאור</FormLabel>
                  <FormControl>
                    <Textarea 
                      {...field} 
                      placeholder="תיאור המוצר (אופציונלי)" 
                      value={field.value || ''}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <FormField
                control={form.control}
                name="price"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>מחיר (₪)</FormLabel>
                    <FormControl>
                      <Input {...field} type="number" min="0" step="1" />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="sku"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>מק"ט (אופציונלי)</FormLabel>
                    <FormControl>
                      <Input {...field} placeholder="מק"ט" value={field.value || ''} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <FormField
                control={form.control}
                name="in_stock"
                render={({ field }) => (
                  <FormItem className="flex flex-row items-center justify-between rounded-lg border p-4">
                    <div className="space-y-0.5">
                      <FormLabel className="text-base">במלאי</FormLabel>
                      <div className="text-sm text-muted-foreground">
                        האם המוצר קיים כרגע במלאי
                      </div>
                    </div>
                    <FormControl>
                      <Switch
                        checked={field.value}
                        onCheckedChange={field.onChange}
                      />
                    </FormControl>
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="is_visible"
                render={({ field }) => (
                  <FormItem className="flex flex-row items-center justify-between rounded-lg border p-4">
                    <div className="space-y-0.5">
                      <FormLabel className="text-base">הצג ללקוחות</FormLabel>
                      <div className="text-sm text-muted-foreground">
                        האם המוצר יהיה גלוי ללקוחות באפליקציה
                      </div>
                    </div>
                    <FormControl>
                      <Switch
                        checked={field.value}
                        onCheckedChange={field.onChange}
                      />
                    </FormControl>
                  </FormItem>
                )}
              />
            </div>
            
            <div className="flex justify-end pt-4">
              <Button 
                type="submit"
                disabled={createProduct.isPending || updateProduct.isPending}
              >
                {product ? 'עדכן מוצר' : 'צור מוצר'}
              </Button>
            </div>
          </form>
        </Form>
      </CardContent>
    </Card>
  );
};

export default ProductForm;

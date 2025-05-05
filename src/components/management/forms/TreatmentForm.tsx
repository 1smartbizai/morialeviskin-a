
import React from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { Treatment } from '@/types/management';
import { useAuth } from '@/contexts/AuthContext';
import { useToast } from '@/hooks/use-toast';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Switch } from '@/components/ui/switch';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { X } from 'lucide-react';

const treatmentSchema = z.object({
  name: z.string().min(1, { message: 'נדרש שם לטיפול' }),
  description: z.string().optional(),
  price: z.coerce.number().min(0, { message: 'המחיר חייב להיות גדול מ-0' }),
  duration: z.coerce.number().min(1, { message: 'המשך חייב להיות לפחות 1 דקה' }),
  is_visible: z.boolean().default(true),
});

type TreatmentFormValues = z.infer<typeof treatmentSchema>;

interface TreatmentFormProps {
  treatment: Treatment | null;
  onClose: () => void;
}

const TreatmentForm = ({ treatment, onClose }: TreatmentFormProps) => {
  const { user } = useAuth();
  const { toast } = useToast();
  const queryClient = useQueryClient();

  const form = useForm<TreatmentFormValues>({
    resolver: zodResolver(treatmentSchema),
    defaultValues: {
      name: treatment?.name || '',
      description: treatment?.description || '',
      price: treatment?.price || 0,
      duration: treatment?.duration || 30,
      is_visible: treatment?.is_visible ?? true,
    },
  });

  const createTreatment = useMutation({
    mutationFn: async (values: TreatmentFormValues) => {
      if (!user) throw new Error('User not authenticated');

      // Ensure all required fields are present
      const treatmentData = {
        ...values,
        name: values.name, // Explicitly include required fields
        price: values.price, 
        duration: values.duration,
        user_id: user.id,
      };

      const { data, error } = await supabase
        .from('treatments')
        .insert(treatmentData)
        .select()
        .single();

      if (error) throw error;
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['treatments'] });
      toast({
        title: 'טיפול נוסף בהצלחה',
        description: 'הטיפול החדש נוצר בהצלחה',
      });
      onClose();
    },
    onError: (error) => {
      toast({
        title: 'שגיאה ביצירת טיפול',
        description: error.message,
        variant: 'destructive',
      });
    },
  });

  const updateTreatment = useMutation({
    mutationFn: async (values: TreatmentFormValues) => {
      if (!user || !treatment) throw new Error('User not authenticated or treatment not provided');

      const { data, error } = await supabase
        .from('treatments')
        .update({
          ...values,
          updated_at: new Date().toISOString(),
        })
        .eq('id', treatment.id)
        .select()
        .single();

      if (error) throw error;
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['treatments'] });
      toast({
        title: 'טיפול עודכן בהצלחה',
        description: 'הטיפול עודכן בהצלחה',
      });
      onClose();
    },
    onError: (error) => {
      toast({
        title: 'שגיאה בעדכון טיפול',
        description: error.message,
        variant: 'destructive',
      });
    },
  });

  const onSubmit = (values: TreatmentFormValues) => {
    if (treatment) {
      updateTreatment.mutate(values);
    } else {
      createTreatment.mutate(values);
    }
  };

  return (
    <Card className="mb-6">
      <CardHeader className="flex flex-row items-center justify-between">
        <CardTitle>{treatment ? 'עריכת טיפול' : 'הוספת טיפול חדש'}</CardTitle>
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
                  <FormLabel>שם הטיפול</FormLabel>
                  <FormControl>
                    <Input {...field} placeholder="הזן שם טיפול" />
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
                      placeholder="תיאור הטיפול (אופציונלי)" 
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
                name="duration"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>משך (בדקות)</FormLabel>
                    <FormControl>
                      <Input {...field} type="number" min="1" step="1" />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>

            <FormField
              control={form.control}
              name="is_visible"
              render={({ field }) => (
                <FormItem className="flex flex-row items-center justify-between rounded-lg border p-4">
                  <div className="space-y-0.5">
                    <FormLabel className="text-base">הצג ללקוחות</FormLabel>
                    <div className="text-sm text-muted-foreground">
                      האם הטיפול יהיה גלוי ללקוחות באפליקציה
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
            
            <div className="flex justify-end pt-4">
              <Button 
                type="submit"
                disabled={createTreatment.isPending || updateTreatment.isPending}
              >
                {treatment ? 'עדכן טיפול' : 'צור טיפול'}
              </Button>
            </div>
          </form>
        </Form>
      </CardContent>
    </Card>
  );
};

export default TreatmentForm;

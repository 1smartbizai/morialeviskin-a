import React, { useEffect, useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { Treatment, TreatmentPlan, TreatmentPlanTreatment } from '@/types/management';
import { useAuth } from '@/contexts/AuthContext';
import { useToast } from '@/hooks/use-toast';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Switch } from '@/components/ui/switch';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Check, ChevronsUpDown, Grip, Plus, Trash2, X } from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import { Command, CommandEmpty, CommandGroup, CommandInput, CommandItem } from '@/components/ui/command';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { cn } from '@/lib/utils';

const treatmentPlanSchema = z.object({
  name: z.string().min(1, { message: 'נדרש שם למסלול טיפול' }),
  description: z.string().optional(),
  price: z.coerce.number().nullable(),
  is_visible: z.boolean().default(true),
});

type TreatmentPlanFormValues = z.infer<typeof treatmentPlanSchema>;

interface TreatmentPlanFormProps {
  treatmentPlan: TreatmentPlan | null;
  onClose: () => void;
}

const TreatmentPlanForm = ({ treatmentPlan, onClose }: TreatmentPlanFormProps) => {
  const { user } = useAuth();
  const { toast } = useToast();
  const queryClient = useQueryClient();
  const [selectedTreatments, setSelectedTreatments] = useState<TreatmentPlanTreatment[]>([]);
  const [open, setOpen] = useState(false);
  
  const form = useForm<TreatmentPlanFormValues>({
    resolver: zodResolver(treatmentPlanSchema),
    defaultValues: {
      name: treatmentPlan?.name || '',
      description: treatmentPlan?.description || '',
      price: treatmentPlan?.price || null,
      is_visible: treatmentPlan?.is_visible ?? true,
    },
  });

  // Fetch available treatments
  const { data: treatments = [] } = useQuery({
    queryKey: ['treatments'],
    queryFn: async () => {
      if (!user) return [];
      const { data, error } = await supabase
        .from('treatments')
        .select('*')
        .order('name');
      
      if (error) throw error;
      return data as Treatment[];
    },
  });

  // Fetch currently assigned treatments if editing
  const { data: assignedTreatments = [] } = useQuery({
    queryKey: ['treatmentPlanTreatments', treatmentPlan?.id],
    queryFn: async () => {
      if (!user || !treatmentPlan) return [];
      const { data, error } = await supabase
        .from('treatment_plan_treatments')
        .select(`
          id,
          treatment_id,
          display_order,
          treatment:treatments(*)
        `)
        .eq('treatment_plan_id', treatmentPlan.id)
        .order('display_order');
      
      if (error) throw error;
      // Cast the data to make TypeScript happy - it has the correct shape but needs treatment_plan_id property
      return data.map(item => ({
        ...item,
        treatment_plan_id: treatmentPlan.id,
        created_at: item.created_at || new Date().toISOString()
      })) as TreatmentPlanTreatment[];
    },
    enabled: !!treatmentPlan?.id,
  });

  // Set selected treatments when assigned treatments are loaded
  useEffect(() => {
    if (assignedTreatments && assignedTreatments.length > 0) {
      setSelectedTreatments(assignedTreatments);
    }
  }, [assignedTreatments]);

  const createTreatmentPlan = useMutation({
    mutationFn: async (values: TreatmentPlanFormValues) => {
      if (!user) throw new Error('User not authenticated');

      // Insert treatment plan with required fields
      const treatmentPlanData = {
        ...values,
        name: values.name, // Ensure name is present (required by the schema)
        user_id: user.id,
      };

      const { data, error } = await supabase
        .from('treatment_plans')
        .insert(treatmentPlanData)
        .select()
        .single();

      if (error) throw error;

      // Insert treatment associations
      if (selectedTreatments.length > 0) {
        const treatmentAssociations = selectedTreatments.map((treatment, index) => ({
          treatment_plan_id: data.id,
          treatment_id: treatment.treatment_id,
          display_order: index + 1,
        }));

        const { error: associationError } = await supabase
          .from('treatment_plan_treatments')
          .insert(treatmentAssociations);

        if (associationError) throw associationError;
      }

      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['treatmentPlans'] });
      toast({
        title: 'מסלול טיפול נוסף בהצלחה',
      });
      onClose();
    },
    onError: (error) => {
      toast({
        title: 'שגיאה ביצירת מסלול טיפול',
        description: error.message,
        variant: 'destructive',
      });
    },
  });

  const updateTreatmentPlan = useMutation({
    mutationFn: async (values: TreatmentPlanFormValues) => {
      if (!user || !treatmentPlan) throw new Error('User not authenticated or treatment plan not provided');

      // Update treatment plan
      const { data, error } = await supabase
        .from('treatment_plans')
        .update({
          ...values,
          updated_at: new Date().toISOString(),
        })
        .eq('id', treatmentPlan.id)
        .select()
        .single();

      if (error) throw error;

      // Delete existing associations
      const { error: deleteError } = await supabase
        .from('treatment_plan_treatments')
        .delete()
        .eq('treatment_plan_id', treatmentPlan.id);

      if (deleteError) throw deleteError;

      // Insert updated treatment associations
      if (selectedTreatments.length > 0) {
        const treatmentAssociations = selectedTreatments.map((treatment, index) => ({
          treatment_plan_id: treatmentPlan.id,
          treatment_id: treatment.treatment_id,
          display_order: index + 1,
        }));

        const { error: associationError } = await supabase
          .from('treatment_plan_treatments')
          .insert(treatmentAssociations);

        if (associationError) throw associationError;
      }

      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['treatmentPlans'] });
      queryClient.invalidateQueries({ queryKey: ['treatmentPlanTreatments'] });
      toast({
        title: 'מסלול טיפול עודכן בהצלחה',
      });
      onClose();
    },
    onError: (error) => {
      toast({
        title: 'שגיאה בעדכון מסלול טיפול',
        description: error.message,
        variant: 'destructive',
      });
    },
  });

  const onSubmit = (values: TreatmentPlanFormValues) => {
    if (treatmentPlan) {
      updateTreatmentPlan.mutate(values);
    } else {
      createTreatmentPlan.mutate(values);
    }
  };

  const addTreatmentToSelected = (treatment: Treatment) => {
    const newTreatment: TreatmentPlanTreatment = {
      id: `temp-${Date.now()}`,
      treatment_id: treatment.id,
      treatment_plan_id: treatmentPlan?.id || '',
      display_order: selectedTreatments.length + 1,
      created_at: new Date().toISOString(),
      treatment,
    };
    
    setSelectedTreatments([...selectedTreatments, newTreatment]);
    setOpen(false);
  };

  const removeTreatment = (index: number) => {
    const updatedTreatments = [...selectedTreatments];
    updatedTreatments.splice(index, 1);
    setSelectedTreatments(updatedTreatments);
  };

  const moveUp = (index: number) => {
    if (index === 0) return;
    const updatedTreatments = [...selectedTreatments];
    [updatedTreatments[index - 1], updatedTreatments[index]] = [updatedTreatments[index], updatedTreatments[index - 1]];
    setSelectedTreatments(updatedTreatments);
  };

  const moveDown = (index: number) => {
    if (index === selectedTreatments.length - 1) return;
    const updatedTreatments = [...selectedTreatments];
    [updatedTreatments[index], updatedTreatments[index + 1]] = [updatedTreatments[index + 1], updatedTreatments[index]];
    setSelectedTreatments(updatedTreatments);
  };

  return (
    <Card className="mb-6">
      <CardHeader className="flex flex-row items-center justify-between">
        <CardTitle>{treatmentPlan ? 'עריכת מסלול טיפול' : 'הוספת מסלול טיפול חדש'}</CardTitle>
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
                  <FormLabel>שם המסלול</FormLabel>
                  <FormControl>
                    <Input {...field} placeholder="הזן שם למסלול טיפול" />
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
                      placeholder="תיאור המסלול (אופציונלי)" 
                      value={field.value || ''}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="price"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>מחיר כולל למסלול (₪) (אופציונלי)</FormLabel>
                  <FormControl>
                    <Input 
                      {...field} 
                      type="number" 
                      min="0" 
                      step="1" 
                      value={field.value === null ? '' : field.value}
                      onChange={(e) => {
                        const value = e.target.value === '' ? null : Number(e.target.value);
                        field.onChange(value);
                      }}
                      placeholder="השאר ריק לסיכום אוטומטי" 
                    />
                  </FormControl>
                  <FormMessage />
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
                      האם המסלול יהיה גלוי ללקוחות באפליקציה
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

            <div className="border rounded-lg p-4">
              <div className="flex justify-between items-center mb-4">
                <h3 className="text-lg font-medium">טיפולים במסלול</h3>
                <Popover open={open} onOpenChange={setOpen}>
                  <PopoverTrigger asChild>
                    <Button variant="outline" className="justify-between">
                      <Plus className="mr-2 h-4 w-4" />
                      הוסף טיפול
                      <ChevronsUpDown className="ml-2 h-4 w-4 opacity-50" />
                    </Button>
                  </PopoverTrigger>
                  <PopoverContent className="w-[300px] p-0" align="end">
                    <Command>
                      <CommandInput placeholder="חפש טיפול..." />
                      <CommandEmpty>לא נמצאו טיפולים</CommandEmpty>
                      <CommandGroup>
                        <ScrollArea className="h-[200px]">
                          {treatments
                            .filter(t => !selectedTreatments.find(st => st.treatment_id === t.id))
                            .map((treatment) => (
                              <CommandItem
                                key={treatment.id}
                                onSelect={() => addTreatmentToSelected(treatment)}
                                className="text-sm"
                              >
                                {treatment.name}
                                <Check className="ml-auto h-4 w-4 opacity-0" />
                              </CommandItem>
                            ))}
                        </ScrollArea>
                      </CommandGroup>
                    </Command>
                  </PopoverContent>
                </Popover>
              </div>

              <div className="space-y-2">
                {selectedTreatments.length === 0 ? (
                  <div className="text-center py-4 text-muted-foreground">
                    טרם נוספו טיפולים למסלול זה
                  </div>
                ) : (
                  selectedTreatments.map((item, index) => (
                    <div key={item.id} className="flex items-center justify-between border rounded-md p-2">
                      <div className="flex items-center gap-2">
                        <span className="flex h-6 w-6 items-center justify-center rounded-full bg-muted text-sm">
                          {index + 1}
                        </span>
                        <span>{item.treatment?.name}</span>
                        <Badge variant="outline">₪{item.treatment?.price}</Badge>
                      </div>
                      <div className="flex gap-1">
                        <Button
                          variant="ghost" 
                          size="icon"
                          onClick={() => moveUp(index)}
                          disabled={index === 0}
                        >
                          <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="m18 15-6-6-6 6"/></svg>
                        </Button>
                        <Button
                          variant="ghost" 
                          size="icon"
                          onClick={() => moveDown(index)}
                          disabled={index === selectedTreatments.length - 1}
                        >
                          <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="m6 9 6 6 6-6"/></svg>
                        </Button>
                        <Button
                          variant="ghost" 
                          size="icon" 
                          onClick={() => removeTreatment(index)}
                        >
                          <Trash2 className="h-4 w-4 text-red-500" />
                        </Button>
                      </div>
                    </div>
                  ))
                )}
              </div>

              {selectedTreatments.length > 0 && (
                <div className="mt-4 pt-4 border-t flex justify-between items-center">
                  <span className="text-sm text-muted-foreground">סה"כ מחיר הטיפולים:</span>
                  <span className="font-medium">₪{
                    selectedTreatments.reduce((sum, item) => sum + (item.treatment?.price || 0), 0).toLocaleString()
                  }</span>
                </div>
              )}
            </div>
            
            <div className="flex justify-end pt-4">
              <Button 
                type="submit"
                disabled={createTreatmentPlan.isPending || updateTreatmentPlan.isPending}
              >
                {treatmentPlan ? 'עדכן מסלול' : 'צור מסלול'}
              </Button>
            </div>
          </form>
        </Form>
      </CardContent>
    </Card>
  );
};

export default TreatmentPlanForm;

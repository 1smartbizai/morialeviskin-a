import React, { useState } from 'react';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { TreatmentPlan, TreatmentPlanTreatment } from '@/types/management';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Switch } from '@/components/ui/switch';
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle, AlertDialogTrigger } from '@/components/ui/alert-dialog';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Badge } from '@/components/ui/badge';
import { ChevronDown, ChevronUp, Edit, Plus, Trash2 } from 'lucide-react';
import { 
  Collapsible, 
  CollapsibleContent, 
  CollapsibleTrigger 
} from '@/components/ui/collapsible';

interface TreatmentPlansListProps {
  treatmentPlans: TreatmentPlan[];
  onEdit: (treatmentPlan: TreatmentPlan) => void;
}

const TreatmentPlansList = ({ treatmentPlans, onEdit }: TreatmentPlansListProps) => {
  const { toast } = useToast();
  const queryClient = useQueryClient();
  const [planToDelete, setPlanToDelete] = useState<TreatmentPlan | null>(null);
  const [openItems, setOpenItems] = useState<string[]>([]);

  const toggleItem = (id: string) => {
    setOpenItems(prev => 
      prev.includes(id) 
        ? prev.filter(item => item !== id) 
        : [...prev, id]
    );
  };

  const deletePlan = useMutation({
    mutationFn: async (id: string) => {
      const { error } = await supabase
        .from('treatment_plans')
        .delete()
        .eq('id', id);

      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['treatmentPlans'] });
      toast({
        title: 'מסלול טיפול נמחק בהצלחה',
      });
    },
    onError: (error) => {
      toast({
        title: 'שגיאה במחיקת מסלול טיפול',
        description: error.message,
        variant: 'destructive',
      });
    },
  });

  const updateVisibility = useMutation({
    mutationFn: async ({ id, isVisible }: { id: string; isVisible: boolean }) => {
      const { error } = await supabase
        .from('treatment_plans')
        .update({ is_visible: isVisible, updated_at: new Date().toISOString() })
        .eq('id', id);

      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['treatmentPlans'] });
    },
    onError: (error) => {
      toast({
        title: 'שגיאה בעדכון נראות',
        description: error.message,
        variant: 'destructive',
      });
    },
  });

  const handleVisibilityChange = (plan: TreatmentPlan, isVisible: boolean) => {
    updateVisibility.mutate({ id: plan.id, isVisible });
  };

  const handleConfirmDelete = () => {
    if (planToDelete) {
      deletePlan.mutate(planToDelete.id);
      setPlanToDelete(null);
    }
  };

  // Function to fetch treatments in each treatment plan
  const usePlanTreatments = (planId: string) => {
    return useQuery({
      queryKey: ['treatmentPlanTreatments', planId],
      queryFn: async () => {
        const { data, error } = await supabase
          .from('treatment_plan_treatments')
          .select(`
            id,
            treatment_id,
            display_order,
            treatment:treatments(*)
          `)
          .eq('treatment_plan_id', planId)
          .order('display_order');
        
        if (error) throw error;
        // Convert to TreatmentPlanTreatment type with necessary properties
        return data.map(item => ({
          ...item,
          treatment_plan_id: planId,
          created_at: item.created_at || new Date().toISOString()
        })) as TreatmentPlanTreatment[];
      },
    });
  };

  if (treatmentPlans.length === 0) {
    return (
      <Card>
        <CardContent className="p-6 text-center">
          <p className="text-muted-foreground">לא נמצאו מסלולי טיפול. נסה להוסיף מסלול טיפול חדש.</p>
        </CardContent>
      </Card>
    );
  }

  return (
    <div className="space-y-4">
      {treatmentPlans.map((plan) => {
        const { data: treatments = [], isLoading } = usePlanTreatments(plan.id);
        const isOpen = openItems.includes(plan.id);

        return (
          <Collapsible
            key={plan.id}
            open={isOpen}
            onOpenChange={() => toggleItem(plan.id)}
            className="border rounded-md shadow-sm"
          >
            <div className="px-4 py-3 flex items-center justify-between bg-background">
              <div className="flex items-center gap-4">
                <CollapsibleTrigger asChild>
                  <Button variant="ghost" size="icon">
                    {isOpen ? <ChevronUp className="h-4 w-4" /> : <ChevronDown className="h-4 w-4" />}
                  </Button>
                </CollapsibleTrigger>
                <div>
                  <h3 className="font-medium text-base">{plan.name}</h3>
                  <p className="text-sm text-muted-foreground">
                    {plan.price !== null 
                      ? `₪${plan.price.toLocaleString()}` 
                      : 'מחיר לפי טיפולים בודדים'}
                  </p>
                </div>
                {plan.is_visible ? (
                  <Badge variant="outline" className="bg-green-100 text-green-800 hover:bg-green-200">פעיל</Badge>
                ) : (
                  <Badge variant="outline" className="bg-gray-100 text-gray-800 hover:bg-gray-200">מוסתר</Badge>
                )}
              </div>
              <div className="flex items-center gap-2">
                <Switch
                  checked={plan.is_visible}
                  onCheckedChange={(checked) => handleVisibilityChange(plan, checked)}
                />
                <Button
                  variant="ghost" 
                  size="icon"
                  onClick={() => onEdit(plan)}
                >
                  <Edit className="h-4 w-4" />
                </Button>
                <AlertDialog>
                  <AlertDialogTrigger asChild>
                    <Button
                      variant="ghost"
                      size="icon"
                      onClick={() => setPlanToDelete(plan)}
                    >
                      <Trash2 className="h-4 w-4 text-red-500" />
                    </Button>
                  </AlertDialogTrigger>
                  <AlertDialogContent dir="rtl">
                    <AlertDialogHeader>
                      <AlertDialogTitle>האם אתה בטוח?</AlertDialogTitle>
                      <AlertDialogDescription>
                        פעולה זו תמחק את מסלול הטיפול "{plan.name}" לצמיתות. לא ניתן לבטל פעולה זו.
                      </AlertDialogDescription>
                    </AlertDialogHeader>
                    <AlertDialogFooter className="flex flex-row-reverse">
                      <AlertDialogAction onClick={handleConfirmDelete} className="bg-red-500 hover:bg-red-600">מחק</AlertDialogAction>
                      <AlertDialogCancel>ביטול</AlertDialogCancel>
                    </AlertDialogFooter>
                  </AlertDialogContent>
                </AlertDialog>
              </div>
            </div>
            
            <CollapsibleContent>
              <div className="border-t p-4">
                {plan.description && (
                  <div className="mb-4">
                    <h4 className="text-sm font-medium mb-1">תיאור:</h4>
                    <p className="text-sm text-muted-foreground">{plan.description}</p>
                  </div>
                )}
                
                <h4 className="text-sm font-medium mb-2">טיפולים במסלול:</h4>
                {isLoading ? (
                  <p className="text-sm text-center py-2">טוען טיפולים...</p>
                ) : treatments.length === 0 ? (
                  <p className="text-sm text-center py-2 text-muted-foreground">לא נמצאו טיפולים במסלול זה</p>
                ) : (
                  <div className="space-y-2">
                    {treatments.map((item, index) => (
                      <div key={item.id} className="flex items-center justify-between border rounded-md p-2">
                        <div className="flex items-center gap-2">
                          <span className="flex h-6 w-6 items-center justify-center rounded-full bg-muted text-sm">
                            {index + 1}
                          </span>
                          <span>{item.treatment?.name}</span>
                        </div>
                        <Badge variant="outline">₪{item.treatment?.price}</Badge>
                      </div>
                    ))}
                    
                    <div className="mt-4 pt-2 border-t flex justify-between items-center">
                      <span className="text-sm font-medium">סה"כ מחיר הטיפולים:</span>
                      <span className="font-medium">₪{
                        treatments.reduce((sum, item) => sum + (item.treatment?.price || 0), 0).toLocaleString()
                      }</span>
                    </div>
                    
                    {plan.price !== null && (
                      <div className="flex justify-between items-center pt-1">
                        <span className="text-sm font-medium">מחיר מסלול מוגדר:</span>
                        <span className="font-medium">₪{plan.price.toLocaleString()}</span>
                      </div>
                    )}
                    
                    {plan.price !== null && (
                      <div className="flex justify-between items-center pt-1">
                        <span className="text-sm font-medium">חיסכון:</span>
                        <span className={`font-medium ${(treatments.reduce((sum, item) => sum + (item.treatment?.price || 0), 0) - plan.price) > 0 ? 'text-green-600' : 'text-red-600'}`}>
                          ₪{(treatments.reduce((sum, item) => sum + (item.treatment?.price || 0), 0) - plan.price).toLocaleString()}
                        </span>
                      </div>
                    )}
                  </div>
                )}
              </div>
            </CollapsibleContent>
          </Collapsible>
        );
      })}
    </div>
  );
};

export default TreatmentPlansList;

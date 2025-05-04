
import React, { useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/contexts/AuthContext';
import { TreatmentPlan } from '@/types/management';
import { useToast } from '@/hooks/use-toast';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { SearchIcon, PlusIcon } from 'lucide-react';
import TreatmentPlanForm from './forms/TreatmentPlanForm';
import TreatmentPlansList from './lists/TreatmentPlansList';

const TreatmentPlansTab = () => {
  const { user } = useAuth();
  const { toast } = useToast();
  const [searchTerm, setSearchTerm] = useState('');
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [editingPlan, setEditingPlan] = useState<TreatmentPlan | null>(null);

  const { data: treatmentPlans = [], isLoading } = useQuery({
    queryKey: ['treatmentPlans'],
    queryFn: async () => {
      if (!user) return [];
      const { data, error } = await supabase
        .from('treatment_plans')
        .select('*')
        .order('created_at', { ascending: false });
      
      if (error) {
        toast({
          title: 'שגיאה בטעינת מסלולי טיפול',
          description: error.message,
          variant: 'destructive',
        });
        return [];
      }
      
      return data as TreatmentPlan[];
    },
  });

  const filteredPlans = treatmentPlans.filter(
    plan => plan.name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const handleEdit = (plan: TreatmentPlan) => {
    setEditingPlan(plan);
    setIsFormOpen(true);
  };

  const handleAdd = () => {
    setEditingPlan(null);
    setIsFormOpen(true);
  };

  const handleFormClose = () => {
    setIsFormOpen(false);
    setEditingPlan(null);
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
            placeholder="חיפוש מסלולי טיפול..."
            value={searchTerm}
            onChange={handleSearchChange}
            className="pl-10 text-right"
            dir="rtl"
          />
        </div>
        <Button onClick={handleAdd} className="w-full md:w-auto">
          <PlusIcon className="mr-2 h-4 w-4" /> הוסף מסלול טיפול חדש
        </Button>
      </div>

      {isFormOpen && (
        <TreatmentPlanForm 
          treatmentPlan={editingPlan} 
          onClose={handleFormClose} 
        />
      )}

      {isLoading ? (
        <div className="flex justify-center">טוען מסלולי טיפול...</div>
      ) : (
        <TreatmentPlansList 
          treatmentPlans={filteredPlans} 
          onEdit={handleEdit} 
        />
      )}
    </div>
  );
};

export default TreatmentPlansTab;

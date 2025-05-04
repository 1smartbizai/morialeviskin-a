
import React, { useState, useEffect } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/contexts/AuthContext';
import { Treatment } from '@/types/management';
import { useToast } from '@/hooks/use-toast';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { SearchIcon, PlusIcon, EditIcon, TrashIcon } from 'lucide-react';
import TreatmentForm from './forms/TreatmentForm';
import TreatmentsList from './lists/TreatmentsList';

const TreatmentsTab = () => {
  const { user } = useAuth();
  const { toast } = useToast();
  const queryClient = useQueryClient();
  const [searchTerm, setSearchTerm] = useState('');
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [editingTreatment, setEditingTreatment] = useState<Treatment | null>(null);

  const { data: treatments = [], isLoading } = useQuery({
    queryKey: ['treatments'],
    queryFn: async () => {
      if (!user) return [];
      const { data, error } = await supabase
        .from('treatments')
        .select('*')
        .order('created_at', { ascending: false });
      
      if (error) {
        toast({
          title: 'שגיאה בטעינת טיפולים',
          description: error.message,
          variant: 'destructive',
        });
        return [];
      }
      
      return data as Treatment[];
    },
  });

  const filteredTreatments = treatments.filter(
    treatment => treatment.name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const handleEdit = (treatment: Treatment) => {
    setEditingTreatment(treatment);
    setIsFormOpen(true);
  };

  const handleAdd = () => {
    setEditingTreatment(null);
    setIsFormOpen(true);
  };

  const handleFormClose = () => {
    setIsFormOpen(false);
    setEditingTreatment(null);
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
            placeholder="חיפוש טיפולים..."
            value={searchTerm}
            onChange={handleSearchChange}
            className="pl-10 text-right"
            dir="rtl"
          />
        </div>
        <Button onClick={handleAdd} className="w-full md:w-auto">
          <PlusIcon className="mr-2 h-4 w-4" /> הוסף טיפול חדש
        </Button>
      </div>

      {isFormOpen && (
        <TreatmentForm 
          treatment={editingTreatment}
          onClose={handleFormClose}
        />
      )}

      {isLoading ? (
        <div className="flex justify-center">טוען טיפולים...</div>
      ) : (
        <TreatmentsList 
          treatments={filteredTreatments} 
          onEdit={handleEdit} 
        />
      )}
    </div>
  );
};

export default TreatmentsTab;

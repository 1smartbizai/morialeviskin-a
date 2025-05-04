
import React, { useState } from 'react';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { Treatment } from '@/types/management';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Switch } from '@/components/ui/switch';
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle, AlertDialogTrigger } from '@/components/ui/alert-dialog';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Edit, Trash2 } from 'lucide-react';
import { Badge } from '@/components/ui/badge';

interface TreatmentsListProps {
  treatments: Treatment[];
  onEdit: (treatment: Treatment) => void;
}

const TreatmentsList = ({ treatments, onEdit }: TreatmentsListProps) => {
  const { toast } = useToast();
  const queryClient = useQueryClient();
  const [treatmentToDelete, setTreatmentToDelete] = useState<Treatment | null>(null);

  const deleteTreatment = useMutation({
    mutationFn: async (id: string) => {
      const { error } = await supabase
        .from('treatments')
        .delete()
        .eq('id', id);

      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['treatments'] });
      toast({
        title: 'טיפול נמחק בהצלחה',
      });
    },
    onError: (error) => {
      toast({
        title: 'שגיאה במחיקת טיפול',
        description: error.message,
        variant: 'destructive',
      });
    },
  });

  const updateVisibility = useMutation({
    mutationFn: async ({ id, isVisible }: { id: string; isVisible: boolean }) => {
      const { error } = await supabase
        .from('treatments')
        .update({ is_visible: isVisible, updated_at: new Date().toISOString() })
        .eq('id', id);

      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['treatments'] });
    },
    onError: (error) => {
      toast({
        title: 'שגיאה בעדכון נראות',
        description: error.message,
        variant: 'destructive',
      });
    },
  });

  const handleVisibilityChange = (treatment: Treatment, isVisible: boolean) => {
    updateVisibility.mutate({ id: treatment.id, isVisible });
  };

  const handleConfirmDelete = () => {
    if (treatmentToDelete) {
      deleteTreatment.mutate(treatmentToDelete.id);
      setTreatmentToDelete(null);
    }
  };

  if (treatments.length === 0) {
    return (
      <Card>
        <CardContent className="p-6 text-center">
          <p className="text-muted-foreground">לא נמצאו טיפולים. נסה להוסיף טיפול חדש.</p>
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
                <TableHead className="text-right">שם הטיפול</TableHead>
                <TableHead className="text-right">מחיר</TableHead>
                <TableHead className="text-right">משך</TableHead>
                <TableHead className="text-right">סטטוס</TableHead>
                <TableHead className="text-right">נראות</TableHead>
                <TableHead className="text-right">פעולות</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {treatments.map((treatment) => (
                <TableRow key={treatment.id}>
                  <TableCell className="font-medium">{treatment.name}</TableCell>
                  <TableCell>₪{treatment.price.toLocaleString()}</TableCell>
                  <TableCell>{treatment.duration} דקות</TableCell>
                  <TableCell>
                    {treatment.is_visible ? (
                      <Badge variant="outline" className="bg-green-100 text-green-800 hover:bg-green-200">פעיל</Badge>
                    ) : (
                      <Badge variant="outline" className="bg-gray-100 text-gray-800 hover:bg-gray-200">מוסתר</Badge>
                    )}
                  </TableCell>
                  <TableCell>
                    <Switch
                      checked={treatment.is_visible}
                      onCheckedChange={(checked) => handleVisibilityChange(treatment, checked)}
                    />
                  </TableCell>
                  <TableCell>
                    <div className="flex gap-2">
                      <Button 
                        variant="ghost" 
                        size="icon"
                        onClick={() => onEdit(treatment)}
                      >
                        <Edit className="h-4 w-4" />
                      </Button>
                      <AlertDialog>
                        <AlertDialogTrigger asChild>
                          <Button
                            variant="ghost"
                            size="icon"
                            onClick={() => setTreatmentToDelete(treatment)}
                          >
                            <Trash2 className="h-4 w-4 text-red-500" />
                          </Button>
                        </AlertDialogTrigger>
                        <AlertDialogContent dir="rtl">
                          <AlertDialogHeader>
                            <AlertDialogTitle>האם אתה בטוח?</AlertDialogTitle>
                            <AlertDialogDescription>
                              פעולה זו תמחק את הטיפול "{treatment.name}" לצמיתות. לא ניתן לבטל פעולה זו.
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

export default TreatmentsList;

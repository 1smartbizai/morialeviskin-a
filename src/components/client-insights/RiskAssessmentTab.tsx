
import { useState } from "react";
import { useRiskAssessments } from "@/hooks/useRiskAssessments";
import { RiskAssessment, RiskAssessmentFormValues } from "@/types/client-management";
import { RiskAssessmentItem } from "./RiskAssessmentItem";
import { RiskAssessmentForm } from "./RiskAssessmentForm";
import { Button } from "@/components/ui/button";
import { Plus } from "lucide-react";
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetTrigger } from "@/components/ui/sheet";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Skeleton } from "@/components/ui/skeleton";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { AlertTriangle, Search } from "lucide-react";
import { AutomatedActionForm } from "./AutomatedActionForm";
import { Input } from "@/components/ui/input";

interface RiskAssessmentTabProps {
  clientId?: string;
}

export const RiskAssessmentTab: React.FC<RiskAssessmentTabProps> = ({ clientId }) => {
  const { 
    assessments, 
    isLoading, 
    error, 
    createAssessment, 
    updateAssessment,
    markActionTaken 
  } = useRiskAssessments(clientId);
  
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [editingAssessment, setEditingAssessment] = useState<RiskAssessment | undefined>();
  const [actionAssessment, setActionAssessment] = useState<RiskAssessment | undefined>();
  const [searchTerm, setSearchTerm] = useState("");
  
  const handleSubmit = (values: RiskAssessmentFormValues) => {
    if (editingAssessment) {
      updateAssessment({ id: editingAssessment.id, values });
      setEditingAssessment(undefined);
    } else {
      createAssessment(values);
      setIsFormOpen(false);
    }
  };
  
  const handleEdit = (assessment: RiskAssessment) => {
    setEditingAssessment(assessment);
  };
  
  const handleCreateAction = (assessment: RiskAssessment) => {
    setActionAssessment(assessment);
  };
  
  const filteredAssessments = assessments?.filter(assessment => {
    if (!searchTerm) return true;
    
    const clientName = `${assessment.client?.first_name} ${assessment.client?.last_name}`.toLowerCase();
    const searchLower = searchTerm.toLowerCase();
    
    return (
      clientName.includes(searchLower) ||
      assessment.client?.phone.includes(searchLower) ||
      assessment.reasons.some(reason => reason.toLowerCase().includes(searchLower)) ||
      assessment.suggested_actions.some(action => action.toLowerCase().includes(searchLower))
    );
  });
  
  const renderForm = () => (
    <RiskAssessmentForm
      clientId={clientId}
      initialData={editingAssessment}
      onSubmit={handleSubmit}
      onCancel={() => {
        setEditingAssessment(undefined);
        setIsFormOpen(false);
      }}
    />
  );
  
  if (isLoading) {
    return (
      <div className="space-y-4">
        <div className="flex justify-between items-center">
          <h2 className="text-xl font-bold">At-Risk Clients</h2>
          <Button disabled><Plus className="mr-2 h-4 w-4" /> Add Assessment</Button>
        </div>
        {[1, 2, 3].map((i) => (
          <div key={i} className="space-y-2">
            <Skeleton className="h-8 w-3/4" />
            <Skeleton className="h-20 w-full" />
            <div className="flex gap-2">
              <Skeleton className="h-6 w-16" />
              <Skeleton className="h-6 w-20" />
            </div>
          </div>
        ))}
      </div>
    );
  }
  
  if (error) {
    return (
      <Alert variant="destructive">
        <AlertTriangle className="h-4 w-4" />
        <AlertTitle>Error</AlertTitle>
        <AlertDescription>
          Failed to load risk assessments. Please try again later.
        </AlertDescription>
      </Alert>
    );
  }
  
  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h2 className="text-xl font-bold">At-Risk Clients</h2>
        <Sheet open={isFormOpen} onOpenChange={setIsFormOpen}>
          <SheetTrigger asChild>
            <Button>
              <Plus className="mr-2 h-4 w-4" /> Add Assessment
            </Button>
          </SheetTrigger>
          <SheetContent className="sm:max-w-md w-[90vw]">
            <SheetHeader>
              <SheetTitle>New Risk Assessment</SheetTitle>
            </SheetHeader>
            {renderForm()}
          </SheetContent>
        </Sheet>
      </div>
      
      {!clientId && (
        <div className="relative">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="Search at-risk clients..."
            className="pl-10"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
      )}
      
      {filteredAssessments && filteredAssessments.length > 0 ? (
        <div className="space-y-4">
          {filteredAssessments.map((assessment) => (
            <RiskAssessmentItem
              key={assessment.id}
              assessment={assessment}
              onEdit={handleEdit}
              onCreateAction={handleCreateAction}
              onMarkActionTaken={markActionTaken}
            />
          ))}
        </div>
      ) : (
        <div className="text-center py-10 border rounded-md bg-muted/20">
          <p className="text-muted-foreground">No risk assessments recorded yet.</p>
          {!clientId && (
            <p className="text-sm text-muted-foreground mt-2">
              Add a new assessment to identify and track at-risk clients.
            </p>
          )}
        </div>
      )}
      
      {/* Edit dialog */}
      <Dialog open={!!editingAssessment} onOpenChange={(open) => !open && setEditingAssessment(undefined)}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle>Edit Risk Assessment</DialogTitle>
          </DialogHeader>
          {editingAssessment && renderForm()}
        </DialogContent>
      </Dialog>
      
      {/* Create action dialog */}
      <Dialog open={!!actionAssessment} onOpenChange={(open) => !open && setActionAssessment(undefined)}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle>Create Automated Action</DialogTitle>
          </DialogHeader>
          {actionAssessment && (
            <AutomatedActionForm
              clientId={actionAssessment.client_id}
              sourceId={actionAssessment.id}
              sourceType="risk_assessment"
              initialContent={`Scheduled action for client with risk score ${actionAssessment.risk_score}/10`}
              onCancel={() => setActionAssessment(undefined)}
            />
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
};

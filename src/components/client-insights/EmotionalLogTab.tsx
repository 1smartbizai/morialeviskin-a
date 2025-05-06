
import { useState } from "react";
import { useEmotionalLogs } from "@/hooks/useEmotionalLogs";
import { EmotionalLog, EmotionalLogFormValues } from "@/types/client-management";
import { EmotionalLogItem } from "./EmotionalLogItem";
import { EmotionalLogForm } from "./EmotionalLogForm";
import { Button } from "@/components/ui/button";
import { Plus } from "lucide-react";
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetTrigger } from "@/components/ui/sheet";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Skeleton } from "@/components/ui/skeleton";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { AlertTriangle } from "lucide-react";
import { AutomatedActionForm } from "./AutomatedActionForm";

interface EmotionalLogTabProps {
  clientId?: string;
}

export const EmotionalLogTab: React.FC<EmotionalLogTabProps> = ({ clientId }) => {
  const { logs, isLoading, error, createLog, updateLog, deleteLog } = useEmotionalLogs(clientId);
  
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [editingLog, setEditingLog] = useState<EmotionalLog | undefined>();
  const [actionLog, setActionLog] = useState<EmotionalLog | undefined>();
  
  const handleSubmit = (values: EmotionalLogFormValues) => {
    if (editingLog) {
      updateLog({ id: editingLog.id, values });
      setEditingLog(undefined);
    } else {
      createLog(values);
      setIsFormOpen(false);
    }
  };
  
  const handleEdit = (log: EmotionalLog) => {
    setEditingLog(log);
  };
  
  const handleDelete = (id: string) => {
    if (confirm("Are you sure you want to delete this log?")) {
      deleteLog(id);
    }
  };
  
  const handleCreateAction = (log: EmotionalLog) => {
    setActionLog(log);
  };
  
  const renderForm = () => (
    <EmotionalLogForm
      clientId={clientId}
      initialData={editingLog}
      onSubmit={handleSubmit}
      onCancel={() => {
        setEditingLog(undefined);
        setIsFormOpen(false);
      }}
    />
  );
  
  if (isLoading) {
    return (
      <div className="space-y-4">
        <div className="flex justify-between items-center">
          <h2 className="text-xl font-bold">Emotional Log</h2>
          <Button disabled><Plus className="mr-2 h-4 w-4" /> Add Log</Button>
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
          Failed to load emotional logs. Please try again later.
        </AlertDescription>
      </Alert>
    );
  }
  
  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h2 className="text-xl font-bold">Emotional Log</h2>
        <Sheet open={isFormOpen} onOpenChange={setIsFormOpen}>
          <SheetTrigger asChild>
            <Button>
              <Plus className="mr-2 h-4 w-4" /> Add Log
            </Button>
          </SheetTrigger>
          <SheetContent className="sm:max-w-md w-[90vw]">
            <SheetHeader>
              <SheetTitle>New Emotional Log</SheetTitle>
            </SheetHeader>
            {renderForm()}
          </SheetContent>
        </Sheet>
      </div>
      
      {/* Quick add form for when client is already selected */}
      {clientId && (
        <div className="mb-6">
          <EmotionalLogForm
            clientId={clientId}
            onSubmit={handleSubmit}
          />
        </div>
      )}
      
      {logs && logs.length > 0 ? (
        <div className="space-y-4">
          {logs.map((log) => (
            <EmotionalLogItem
              key={log.id}
              log={log}
              onEdit={handleEdit}
              onDelete={handleDelete}
              onCreateAction={handleCreateAction}
            />
          ))}
        </div>
      ) : (
        <div className="text-center py-10 border rounded-md bg-muted/20">
          <p className="text-muted-foreground">No emotional logs recorded yet.</p>
          {!clientId && (
            <p className="text-sm text-muted-foreground mt-2">
              Add a new log to track meaningful client interactions.
            </p>
          )}
        </div>
      )}
      
      {/* Edit dialog */}
      <Dialog open={!!editingLog} onOpenChange={(open) => !open && setEditingLog(undefined)}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle>Edit Emotional Log</DialogTitle>
          </DialogHeader>
          {editingLog && renderForm()}
        </DialogContent>
      </Dialog>
      
      {/* Create action dialog */}
      <Dialog open={!!actionLog} onOpenChange={(open) => !open && setActionLog(undefined)}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle>Create Automated Action</DialogTitle>
          </DialogHeader>
          {actionLog && (
            <AutomatedActionForm
              clientId={actionLog.client_id}
              sourceId={actionLog.id}
              sourceType="emotional_log"
              initialContent={`Follow up on: ${actionLog.content.substring(0, 50)}${actionLog.content.length > 50 ? '...' : ''}`}
              onCancel={() => setActionLog(undefined)}
            />
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
};

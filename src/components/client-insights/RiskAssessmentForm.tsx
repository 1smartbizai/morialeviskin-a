
import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { 
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage
} from "@/components/ui/form";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { RiskAssessment, RiskAssessmentFormValues } from "@/types/client-management";
import { 
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { X } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Slider } from "@/components/ui/slider";

const formSchema = z.object({
  client_id: z.string().min(1, "Client is required"),
  risk_score: z.number().min(1).max(10),
  reasons: z.array(z.string()).min(1, "At least one reason is required"),
  suggested_actions: z.array(z.string()).min(1, "At least one suggested action is required"),
  status: z.enum(["active", "monitoring", "resolved"]).optional(),
});

interface RiskAssessmentFormProps {
  clientId?: string;
  initialData?: RiskAssessment;
  onSubmit: (values: RiskAssessmentFormValues) => void;
  onCancel?: () => void;
}

export const RiskAssessmentForm: React.FC<RiskAssessmentFormProps> = ({
  clientId,
  initialData,
  onSubmit,
  onCancel,
}) => {
  const [reasonInput, setReasonInput] = useState('');
  const [actionInput, setActionInput] = useState('');
  
  const form = useForm<RiskAssessmentFormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      client_id: clientId || initialData?.client_id || "",
      risk_score: initialData?.risk_score || 5,
      reasons: initialData?.reasons || [],
      suggested_actions: initialData?.suggested_actions || [],
      status: initialData?.status as "active" | "monitoring" | "resolved" || "active",
    },
  });
  
  // Handle adding a reason
  const addReason = () => {
    if (reasonInput.trim()) {
      const currentReasons = form.getValues("reasons") || [];
      if (!currentReasons.includes(reasonInput.trim())) {
        form.setValue("reasons", [...currentReasons, reasonInput.trim()]);
      }
      setReasonInput('');
    }
  };
  
  // Handle removing a reason
  const removeReason = (reason: string) => {
    const currentReasons = form.getValues("reasons") || [];
    form.setValue("reasons", currentReasons.filter(r => r !== reason));
  };
  
  // Handle adding an action
  const addAction = () => {
    if (actionInput.trim()) {
      const currentActions = form.getValues("suggested_actions") || [];
      if (!currentActions.includes(actionInput.trim())) {
        form.setValue("suggested_actions", [...currentActions, actionInput.trim()]);
      }
      setActionInput('');
    }
  };
  
  // Handle removing an action
  const removeAction = (action: string) => {
    const currentActions = form.getValues("suggested_actions") || [];
    form.setValue("suggested_actions", currentActions.filter(a => a !== action));
  };
  
  // Handle key press for inputs
  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>, addFn: () => void) => {
    if (e.key === 'Enter') {
      e.preventDefault();
      addFn();
    }
  };

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
        <FormField
          control={form.control}
          name="risk_score"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Risk Score (1-10)</FormLabel>
              <FormControl>
                <div className="space-y-2">
                  <Slider
                    min={1}
                    max={10}
                    step={1}
                    value={[field.value]}
                    onValueChange={(value) => field.onChange(value[0])}
                    className="py-4"
                  />
                  <div className="flex justify-between text-xs text-muted-foreground">
                    <span>Low Risk</span>
                    <span>High Risk</span>
                  </div>
                  <div className="text-center text-xl font-bold">
                    {field.value}/10
                  </div>
                </div>
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        
        <FormField
          control={form.control}
          name="status"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Status</FormLabel>
              <Select 
                onValueChange={field.onChange} 
                defaultValue={field.value}
              >
                <FormControl>
                  <SelectTrigger>
                    <SelectValue placeholder="Select status" />
                  </SelectTrigger>
                </FormControl>
                <SelectContent>
                  <SelectItem value="active">Active</SelectItem>
                  <SelectItem value="monitoring">Monitoring</SelectItem>
                  <SelectItem value="resolved">Resolved</SelectItem>
                </SelectContent>
              </Select>
              <FormMessage />
            </FormItem>
          )}
        />
        
        {/* Reasons Section */}
        <div>
          <FormLabel>Risk Reasons</FormLabel>
          <div className="flex items-center">
            <Input
              value={reasonInput}
              onChange={(e) => setReasonInput(e.target.value)}
              onKeyDown={(e) => handleKeyDown(e, addReason)}
              placeholder="Add risk reasons"
              className="flex-1"
            />
            <Button 
              type="button" 
              variant="secondary" 
              onClick={addReason}
              className="mr-2"
            >
              Add
            </Button>
          </div>
          
          <div className="flex flex-wrap gap-1 mt-2">
            {form.watch("reasons")?.map((reason) => (
              <Badge key={reason} variant="secondary" className="text-xs flex items-center gap-1">
                {reason}
                <X className="h-3 w-3 ml-1 cursor-pointer" onClick={() => removeReason(reason)} />
              </Badge>
            ))}
          </div>
          {form.formState.errors.reasons && (
            <p className="text-sm font-medium text-destructive">{form.formState.errors.reasons.message}</p>
          )}
        </div>
        
        {/* Suggested Actions Section */}
        <div>
          <FormLabel>Suggested Actions</FormLabel>
          <div className="flex items-center">
            <Input
              value={actionInput}
              onChange={(e) => setActionInput(e.target.value)}
              onKeyDown={(e) => handleKeyDown(e, addAction)}
              placeholder="Add suggested actions"
              className="flex-1"
            />
            <Button 
              type="button" 
              variant="secondary" 
              onClick={addAction}
              className="mr-2"
            >
              Add
            </Button>
          </div>
          
          <div className="flex flex-wrap gap-1 mt-2">
            {form.watch("suggested_actions")?.map((action) => (
              <Badge key={action} variant="secondary" className="text-xs flex items-center gap-1">
                {action}
                <X className="h-3 w-3 ml-1 cursor-pointer" onClick={() => removeAction(action)} />
              </Badge>
            ))}
          </div>
          {form.formState.errors.suggested_actions && (
            <p className="text-sm font-medium text-destructive">{form.formState.errors.suggested_actions.message}</p>
          )}
        </div>
        
        <div className="flex justify-end gap-2 pt-2">
          {onCancel && (
            <Button type="button" variant="outline" onClick={onCancel}>
              Cancel
            </Button>
          )}
          <Button type="submit">
            {initialData ? 'Update' : 'Save'} Assessment
          </Button>
        </div>
      </form>
    </Form>
  );
};

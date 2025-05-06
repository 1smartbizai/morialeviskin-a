
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
import { Textarea } from "@/components/ui/textarea";
import { AutomatedActionFormValues } from "@/types/client-management";
import { 
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useAutomatedActions } from "@/hooks/useAutomatedActions";
import { Calendar } from "@/components/ui/calendar";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { CalendarIcon } from "lucide-react";
import { format } from "date-fns";
import { cn } from "@/lib/utils";

const formSchema = z.object({
  client_id: z.string().min(1, "Client is required"),
  source_type: z.enum(["emotional_log", "risk_assessment"]),
  source_id: z.string().min(1, "Source is required"),
  action_type: z.enum(["message", "reminder", "task", "email"]),
  content: z.string().min(1, "Content is required"),
  scheduled_for: z.date().optional(),
});

interface AutomatedActionFormProps {
  clientId: string;
  sourceId: string;
  sourceType: "emotional_log" | "risk_assessment";
  initialContent?: string;
  onSuccess?: () => void;
  onCancel?: () => void;
}

export const AutomatedActionForm: React.FC<AutomatedActionFormProps> = ({
  clientId,
  sourceId,
  sourceType,
  initialContent = "",
  onSuccess,
  onCancel,
}) => {
  const { createAction } = useAutomatedActions();
  
  const form = useForm<AutomatedActionFormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      client_id: clientId,
      source_type: sourceType,
      source_id: sourceId,
      action_type: "reminder",
      content: initialContent,
    },
  });
  
  const handleSubmit = (values: AutomatedActionFormValues) => {
    createAction(values);
    onSuccess?.();
    onCancel?.();
  };

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(handleSubmit)} className="space-y-4">
        <FormField
          control={form.control}
          name="action_type"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Action Type</FormLabel>
              <Select 
                onValueChange={field.onChange} 
                defaultValue={field.value}
              >
                <FormControl>
                  <SelectTrigger>
                    <SelectValue placeholder="Select action type" />
                  </SelectTrigger>
                </FormControl>
                <SelectContent>
                  <SelectItem value="message">Message</SelectItem>
                  <SelectItem value="reminder">Reminder</SelectItem>
                  <SelectItem value="task">Task</SelectItem>
                  <SelectItem value="email">Email</SelectItem>
                </SelectContent>
              </Select>
              <FormMessage />
            </FormItem>
          )}
        />
        
        <FormField
          control={form.control}
          name="content"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Content</FormLabel>
              <FormControl>
                <Textarea 
                  placeholder="Action content..." 
                  className="h-24"
                  {...field}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        
        <FormField
          control={form.control}
          name="scheduled_for"
          render={({ field }) => (
            <FormItem className="flex flex-col">
              <FormLabel>Schedule For</FormLabel>
              <Popover>
                <PopoverTrigger asChild>
                  <FormControl>
                    <Button
                      variant={"outline"}
                      className={cn(
                        "w-full pl-3 text-left font-normal",
                        !field.value && "text-muted-foreground"
                      )}
                    >
                      {field.value ? (
                        format(field.value, "PPP")
                      ) : (
                        <span>Pick a date</span>
                      )}
                      <CalendarIcon className="ml-auto h-4 w-4 opacity-50" />
                    </Button>
                  </FormControl>
                </PopoverTrigger>
                <PopoverContent className="w-auto p-0 pointer-events-auto">
                  <Calendar
                    mode="single"
                    selected={field.value}
                    onSelect={field.onChange}
                    disabled={(date) => {
                      // Fix: Use a proper type for the date comparison instead of string
                      return date < new Date();
                    }}
                    initialFocus
                    className="p-3"
                  />
                </PopoverContent>
              </Popover>
              <FormMessage />
            </FormItem>
          )}
        />
        
        <div className="flex justify-end gap-2 pt-2">
          {onCancel && (
            <Button type="button" variant="outline" onClick={onCancel}>
              Cancel
            </Button>
          )}
          <Button type="submit">
            Create Action
          </Button>
        </div>
      </form>
    </Form>
  );
};

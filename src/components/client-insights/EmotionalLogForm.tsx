
import { useState, useEffect } from "react";
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
import { Input } from "@/components/ui/input";
import { EmotionalLog, EmotionalLogFormValues } from "@/types/client-management";
import { 
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { X } from "lucide-react";
import { Badge } from "@/components/ui/badge";

const formSchema = z.object({
  client_id: z.string().min(1, "Client is required"),
  content: z.string().min(1, "Content is required").max(1000, "Content cannot exceed 1000 characters"),
  tags: z.array(z.string()).optional(),
  sentiment: z.enum(["positive", "neutral", "negative"]).optional(),
});

interface EmotionalLogFormProps {
  clientId?: string;
  initialData?: EmotionalLog;
  onSubmit: (values: EmotionalLogFormValues) => void;
  onCancel?: () => void;
}

export const EmotionalLogForm: React.FC<EmotionalLogFormProps> = ({
  clientId,
  initialData,
  onSubmit,
  onCancel,
}) => {
  const [tagInput, setTagInput] = useState('');
  
  const form = useForm<EmotionalLogFormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      client_id: clientId || initialData?.client_id || "",
      content: initialData?.content || "",
      tags: initialData?.tags || [],
      sentiment: initialData?.sentiment as "positive" | "neutral" | "negative" | undefined,
    },
  });
  
  useEffect(() => {
    if (clientId) {
      form.setValue("client_id", clientId);
    }
  }, [clientId, form]);
  
  const addTag = () => {
    if (tagInput.trim()) {
      const currentTags = form.getValues("tags") || [];
      if (!currentTags.includes(tagInput.trim())) {
        form.setValue("tags", [...currentTags, tagInput.trim()]);
      }
      setTagInput('');
    }
  };
  
  const removeTag = (tag: string) => {
    const currentTags = form.getValues("tags") || [];
    form.setValue("tags", currentTags.filter(t => t !== tag));
  };
  
  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter' || e.key === ',') {
      e.preventDefault();
      addTag();
    }
  };

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
        <FormField
          control={form.control}
          name="content"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Log Content</FormLabel>
              <FormControl>
                <Textarea 
                  placeholder="Enter meaningful client interaction or observation..." 
                  className="h-32"
                  {...field}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        
        <FormField
          control={form.control}
          name="sentiment"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Sentiment</FormLabel>
              <Select 
                onValueChange={field.onChange} 
                defaultValue={field.value}
              >
                <FormControl>
                  <SelectTrigger>
                    <SelectValue placeholder="Select sentiment" />
                  </SelectTrigger>
                </FormControl>
                <SelectContent>
                  <SelectItem value="positive">Positive</SelectItem>
                  <SelectItem value="neutral">Neutral</SelectItem>
                  <SelectItem value="negative">Negative</SelectItem>
                </SelectContent>
              </Select>
              <FormMessage />
            </FormItem>
          )}
        />
        
        <div>
          <FormLabel>Tags</FormLabel>
          <div className="flex items-center">
            <Input
              value={tagInput}
              onChange={(e) => setTagInput(e.target.value)}
              onKeyDown={handleKeyDown}
              placeholder="Add tags (press Enter)"
              className="flex-1"
            />
            <Button 
              type="button" 
              variant="secondary" 
              onClick={addTag}
              className="mr-2"
            >
              Add
            </Button>
          </div>
          
          <div className="flex flex-wrap gap-1 mt-2">
            {form.watch("tags")?.map((tag) => (
              <Badge key={tag} variant="secondary" className="text-xs flex items-center gap-1">
                {tag}
                <X className="h-3 w-3 ml-1 cursor-pointer" onClick={() => removeTag(tag)} />
              </Badge>
            ))}
          </div>
        </div>
        
        <div className="flex justify-end gap-2 pt-2">
          {onCancel && (
            <Button type="button" variant="outline" onClick={onCancel}>
              Cancel
            </Button>
          )}
          <Button type="submit">
            {initialData ? 'Update' : 'Save'} Log
          </Button>
        </div>
      </form>
    </Form>
  );
};

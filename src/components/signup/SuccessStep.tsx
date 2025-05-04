
import { Card, CardContent } from "@/components/ui/card";
import { CheckCircle } from "lucide-react";

interface SuccessStepProps {
  businessName: string;
}

const SuccessStep = ({ businessName }: SuccessStepProps) => {
  return (
    <div className="text-center py-6">
      <div className="flex justify-center mb-6">
        <div className="rounded-full bg-green-100 p-3">
          <CheckCircle className="h-12 w-12 text-green-600" />
        </div>
      </div>
      
      <h3 className="text-2xl font-bold mb-2">
        Your business is ready!
      </h3>
      
      <p className="text-muted-foreground mb-8 max-w-md mx-auto">
        <span className="font-medium text-foreground">{businessName}</span> has been successfully set up on Bellevo. You're now ready to manage your beauty business like a pro.
      </p>
      
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3 mb-8">
        <Card>
          <CardContent className="pt-6">
            <h4 className="font-medium mb-2">Add Your Services</h4>
            <p className="text-sm text-muted-foreground">Define your services and pricing</p>
          </CardContent>
        </Card>
        
        <Card>
          <CardContent className="pt-6">
            <h4 className="font-medium mb-2">Import Clients</h4>
            <p className="text-sm text-muted-foreground">Add your existing client database</p>
          </CardContent>
        </Card>
        
        <Card>
          <CardContent className="pt-6">
            <h4 className="font-medium mb-2">Set Up Availability</h4>
            <p className="text-sm text-muted-foreground">Configure your scheduling preferences</p>
          </CardContent>
        </Card>
      </div>
      
      <p className="text-sm text-muted-foreground">
        Click "Go to Dashboard" to start managing your business
      </p>
    </div>
  );
};

export default SuccessStep;

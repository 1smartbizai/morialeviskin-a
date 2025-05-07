
import React from 'react';

interface BusinessInfoCardProps {
  businessDomain: string;
  businessId: string;
}

const BusinessInfoCard = ({ businessDomain, businessId }: BusinessInfoCardProps) => {
  return (
    <div className="bg-muted/30 rounded-lg p-6 mb-8 max-w-md mx-auto">
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <span className="text-muted-foreground">כתובת האפליקציה:</span>
          <code className="bg-background px-2 py-1 rounded text-primary">{businessDomain}</code>
        </div>
        
        <div className="flex items-center justify-between">
          <span className="text-muted-foreground">מזהה עסק:</span>
          <code className="bg-background px-2 py-1 rounded">{businessId}</code>
        </div>
      </div>
    </div>
  );
};

export default BusinessInfoCard;

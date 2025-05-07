
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Card, CardContent } from "@/components/ui/card";
import { SkinProductSuggestion, SkinTreatmentSuggestion } from "@/types/skincare";
import { Link } from "react-router-dom";

interface SuggestionsProps {
  productSuggestions: SkinProductSuggestion[];
  treatmentSuggestions: SkinTreatmentSuggestion[];
  className?: string;
}

export default function Suggestions({ 
  productSuggestions, 
  treatmentSuggestions,
  className 
}: SuggestionsProps) {
  return (
    <Card className={className}>
      <CardContent className="p-0">
        <Tabs defaultValue="treatments" className="w-full">
          <TabsList className="w-full grid grid-cols-2">
            <TabsTrigger value="treatments">טיפולים מומלצים</TabsTrigger>
            <TabsTrigger value="products">מוצרים מומלצים</TabsTrigger>
          </TabsList>
          
          <TabsContent value="treatments" className="p-4">
            {treatmentSuggestions.length === 0 ? (
              <p className="text-muted-foreground text-center py-8">
                אין כרגע טיפולים מומלצים.
                <br />
                ענה/י על יותר שאלות כדי לקבל המלצות מותאמות אישית.
              </p>
            ) : (
              <div className="space-y-4">
                {treatmentSuggestions.map(treatment => (
                  <div key={treatment.id} className="border rounded-lg p-4">
                    <h4 className="font-medium">{treatment.name}</h4>
                    <p className="text-sm text-muted-foreground mt-1">{treatment.description}</p>
                    <p className="text-primary text-sm mt-2">המלצה: {treatment.reason}</p>
                    <Link 
                      to="/client/treatments"
                      className="text-sm text-primary hover:text-primary/80 font-medium mt-2 block"
                    >
                      צפייה בכל הטיפולים
                    </Link>
                  </div>
                ))}
              </div>
            )}
          </TabsContent>
          
          <TabsContent value="products" className="p-4">
            {productSuggestions.length === 0 ? (
              <p className="text-muted-foreground text-center py-8">
                אין כרגע מוצרים מומלצים.
                <br />
                ענה/י על יותר שאלות כדי לקבל המלצות מותאמות אישית.
              </p>
            ) : (
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {productSuggestions.map(product => (
                  <div key={product.id} className="border rounded-lg p-4">
                    {product.imageUrl && (
                      <div className="h-32 bg-muted/20 rounded mb-3">
                        <img 
                          src={product.imageUrl} 
                          alt={product.name}
                          className="h-full w-full object-cover rounded" 
                        />
                      </div>
                    )}
                    <h4 className="font-medium">{product.name}</h4>
                    <p className="text-sm text-muted-foreground mt-1">{product.description}</p>
                    <p className="text-primary text-sm mt-2">המלצה: {product.reason}</p>
                  </div>
                ))}
              </div>
            )}
          </TabsContent>
        </Tabs>
      </CardContent>
    </Card>
  );
}

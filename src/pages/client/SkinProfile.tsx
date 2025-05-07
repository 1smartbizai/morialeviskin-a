
import { useState } from "react";
import ClientLayout from "@/components/layouts/ClientLayout";
import CurrentQuestion from "@/components/skincare/CurrentQuestion";
import ProfileAttributes from "@/components/skincare/ProfileAttributes";
import Suggestions from "@/components/skincare/Suggestions";
import { Button } from "@/components/ui/button";
import { useSkinProfile } from "@/hooks/useSkinProfile";
import { Skeleton } from "@/components/ui/skeleton";

export default function SkinProfile() {
  const {
    isLoading,
    skinProfile,
    currentQuestion,
    productSuggestions,
    treatmentSuggestions,
    submitAnswer,
    refreshProfile
  } = useSkinProfile();
  
  const handleSubmitAnswer = async (answer: string) => {
    await submitAnswer(answer);
  };
  
  return (
    <ClientLayout>
      <div className="space-y-6 pb-10" dir="rtl">
        <div>
          <h2 className="text-2xl font-bold text-beauty-dark">פרופיל העור שלי</h2>
          <p className="text-muted-foreground">עקבי אחרי התפתחות העור שלך וקבלי המלצות אישיות</p>
        </div>
        
        {isLoading ? (
          <LoadingSkeleton />
        ) : (
          <>
            {/* Current Question */}
            {currentQuestion && (
              <div className="bg-beauty-accent/10 p-5 rounded-lg">
                <h3 className="text-lg mb-3 font-medium">השאלה היומית</h3>
                <CurrentQuestion 
                  question={currentQuestion}
                  onSubmit={handleSubmitAnswer}
                />
              </div>
            )}
            
            {/* Profile Attributes */}
            <ProfileAttributes 
              attributes={skinProfile?.attributes || []}
              className="mb-6"
            />
            
            {/* Recommendations */}
            <div className="mt-8">
              <h3 className="text-lg mb-3 font-medium">המלצות עבורך</h3>
              <Suggestions 
                productSuggestions={productSuggestions}
                treatmentSuggestions={treatmentSuggestions}
              />
            </div>
            
            {/* Refresh Button */}
            <div className="flex justify-center mt-8">
              <Button 
                onClick={refreshProfile}
                variant="outline"
                className="mx-auto"
              >
                רענן פרופיל
              </Button>
            </div>
          </>
        )}
      </div>
    </ClientLayout>
  );
}

function LoadingSkeleton() {
  return (
    <div className="space-y-6">
      <div className="bg-beauty-accent/10 p-5 rounded-lg">
        <Skeleton className="h-6 w-40 mb-3" />
        <Skeleton className="h-[200px] w-full rounded-lg" />
      </div>
      
      <div>
        <Skeleton className="h-6 w-40 mb-3" />
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <Skeleton className="h-[160px] w-full rounded-lg" />
          <Skeleton className="h-[160px] w-full rounded-lg" />
        </div>
      </div>
      
      <div>
        <Skeleton className="h-6 w-40 mb-3" />
        <Skeleton className="h-[240px] w-full rounded-lg" />
      </div>
    </div>
  );
}

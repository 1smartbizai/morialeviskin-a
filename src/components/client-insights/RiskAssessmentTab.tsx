import { useState } from "react";
import { useRiskAssessments } from "@/hooks/useRiskAssessments";
import AutomatedActionForm from "./AutomatedActionForm";
import { RiskAssessmentForm } from "./RiskAssessmentForm";
import { RiskAssessmentItem } from "./RiskAssessmentItem";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { CheckCircle, PlusCircle } from "lucide-react";
import { RiskScoreBadge } from "./RiskScoreBadge";

export const RiskAssessmentTab = ({ clientId }: { clientId?: string }) => {
  const [showForm, setShowForm] = useState(false);
  const [showActionForm, setShowActionForm] = useState(false);
  const { assessments, isLoading, createAssessment } = useRiskAssessments(clientId);

  const handleAddAssessment = async (data: any) => {
    await createAssessment(data);
    setShowForm(false);
  };

  const handleAddActionSuccess = () => {
    setShowActionForm(false);
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h3 className="text-xl font-semibold">הערכת סיכונים</h3>
        <div className="space-x-2 space-x-reverse flex">
          <Button
            variant="outline"
            onClick={() => {
              setShowForm(!showForm);
              setShowActionForm(false);
            }}
          >
            {showForm ? <CheckCircle className="ml-2 h-4 w-4" /> : <PlusCircle className="ml-2 h-4 w-4" />}
            {showForm ? "סגור טופס" : "הוסף הערכה"}
          </Button>
          <Button
            variant="default"
            onClick={() => {
              setShowActionForm(!showActionForm);
              setShowForm(false);
            }}
          >
            {showActionForm ? <CheckCircle className="ml-2 h-4 w-4" /> : <PlusCircle className="ml-2 h-4 w-4" />}
            {showActionForm ? "סגור טופס" : "צור פעולה אוטומטית"}
          </Button>
        </div>
      </div>

      <Tabs defaultValue="list" dir="rtl">
        <TabsList className="grid grid-cols-2 mb-4">
          <TabsTrigger value="list">רשימה</TabsTrigger>
          <TabsTrigger value="insights">תובנות</TabsTrigger>
        </TabsList>

        <TabsContent value="list" className="space-y-4">
          {showForm && (
            <Card className="mb-4">
              <CardHeader>
                <CardTitle>הוסף הערכת סיכונים חדשה</CardTitle>
                <CardDescription>הערכת הסיכונים מאפשרת מעקב אחר מצב הלקוח</CardDescription>
              </CardHeader>
              <CardContent>
                <RiskAssessmentForm onSubmit={handleAddAssessment} clientId={clientId} />
              </CardContent>
            </Card>
          )}

          {showActionForm && clientId && (
            <AutomatedActionForm clientId={clientId} onSuccess={handleAddActionSuccess} />
          )}

          <div className="space-y-4">
            {isLoading ? (
              <p>טוען...</p>
            ) : assessments && assessments.length > 0 ? (
              assessments.map((assessment) => <RiskAssessmentItem key={assessment.id} assessment={assessment} />)
            ) : (
              <Card>
                <CardContent className="py-8">
                  <p className="text-center text-muted-foreground">אין הערכות סיכונים לתצוגה.</p>
                </CardContent>
              </Card>
            )}
          </div>
        </TabsContent>

        <TabsContent value="insights">
          <Card>
            <CardContent className="py-6">
              <p className="text-center text-muted-foreground">התובנות יופיעו כאן כאשר יש מספיק נתונים.</p>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
};

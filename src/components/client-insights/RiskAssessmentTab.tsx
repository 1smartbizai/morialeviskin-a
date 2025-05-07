
import { useState } from "react";
import { useRiskAssessments } from "@/hooks/useRiskAssessments";
import RiskAssessmentForm from "./RiskAssessmentForm";
import RiskAssessmentItem from "./RiskAssessmentItem";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { AlertTriangle, CheckCircle, PlusCircle } from "lucide-react";
import AutomatedActionForm from "./AutomatedActionForm";

export const RiskAssessmentTab = ({ clientId }: { clientId?: string }) => {
  const [showForm, setShowForm] = useState(false);
  const [showActionForm, setShowActionForm] = useState(false);
  const { assessments, isLoading, addAssessment } = useRiskAssessments(clientId);

  const handleAddAssessment = async (data: any) => {
    await addAssessment(data);
    setShowForm(false);
  };

  const handleAddActionSuccess = () => {
    setShowActionForm(false);
  };

  const highRiskAssessments = assessments?.filter(assessment => assessment.risk_score >= 7) || [];

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h3 className="text-xl font-semibold">הערכת סיכון</h3>
        <div className="space-x-2 space-x-reverse flex">
          <Button 
            variant="outline" 
            onClick={() => {
              setShowForm(!showForm);
              setShowActionForm(false);
            }}
          >
            {showForm ? <CheckCircle className="ml-2 h-4 w-4" /> : <PlusCircle className="ml-2 h-4 w-4" />}
            {showForm ? "סגור טופס" : "הערכת סיכון חדשה"}
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

      <Tabs defaultValue="all" dir="rtl">
        <TabsList className="grid grid-cols-3 mb-4">
          <TabsTrigger value="all">כל ההערכות</TabsTrigger>
          <TabsTrigger value="high-risk" className="relative">
            בסיכון גבוה
            {highRiskAssessments.length > 0 && (
              <span className="absolute -top-1 -right-1 flex h-4 w-4 items-center justify-center rounded-full bg-red-500 text-[10px] text-white">
                {highRiskAssessments.length}
              </span>
            )}
          </TabsTrigger>
          <TabsTrigger value="actions">פעולות</TabsTrigger>
        </TabsList>
        
        <TabsContent value="all" className="space-y-4">
          {showForm && (
            <Card className="mb-4">
              <CardHeader>
                <CardTitle>הערכת סיכון חדשה</CardTitle>
                <CardDescription>הערך את סיכון הנטישה של הלקוח</CardDescription>
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
                  <p className="text-center text-muted-foreground">אין הערכות סיכון לתצוגה.</p>
                </CardContent>
              </Card>
            )}
          </div>
        </TabsContent>
        
        <TabsContent value="high-risk">
          <div className="space-y-4">
            {highRiskAssessments.length > 0 ? (
              highRiskAssessments.map((assessment) => <RiskAssessmentItem key={assessment.id} assessment={assessment} />)
            ) : (
              <Card>
                <CardContent className="py-8 flex flex-col items-center justify-center">
                  <AlertTriangle className="text-yellow-500 h-12 w-12 mb-4" />
                  <p className="text-center text-muted-foreground">אין לקוחות בסיכון גבוה כרגע.</p>
                </CardContent>
              </Card>
            )}
          </div>
        </TabsContent>
        
        <TabsContent value="actions">
          <Card>
            <CardContent className="py-8">
              <p className="text-center text-muted-foreground">פעולות שננקטו יוצגו כאן.</p>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
};

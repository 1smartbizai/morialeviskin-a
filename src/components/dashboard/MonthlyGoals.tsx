
import { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Progress } from "@/components/ui/progress";
import { Target, TrendingUp, Edit2, Check, X } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/contexts/AuthContext";
import { useToast } from "@/hooks/use-toast";

interface MonthlyGoal {
  id: string;
  revenue_goal: number;
  new_clients_goal: number;
  current_revenue: number;
  current_new_clients: number;
  month_year: string;
}

const MonthlyGoals = () => {
  const { user } = useAuth();
  const { toast } = useToast();
  const [goals, setGoals] = useState<MonthlyGoal | null>(null);
  const [editing, setEditing] = useState(false);
  const [editValues, setEditValues] = useState({
    revenue_goal: 0,
    new_clients_goal: 0
  });
  const [loading, setLoading] = useState(true);

  const currentMonth = new Date().toISOString().slice(0, 7); // YYYY-MM format

  useEffect(() => {
    fetchGoals();
  }, [user]);

  const fetchGoals = async () => {
    if (!user) return;

    try {
      const { data, error } = await supabase
        .from('monthly_goals')
        .select('*')
        .eq('user_id', user.id)
        .eq('month_year', currentMonth)
        .maybeSingle();

      if (error) throw error;

      if (data) {
        setGoals(data);
        setEditValues({
          revenue_goal: data.revenue_goal,
          new_clients_goal: data.new_clients_goal
        });
      } else {
        // יצירת יעדים ראשוניים
        const newGoals = {
          user_id: user.id,
          month_year: currentMonth,
          revenue_goal: 10000,
          new_clients_goal: 10,
          current_revenue: 0,
          current_new_clients: 0
        };

        const { data: created, error: createError } = await supabase
          .from('monthly_goals')
          .insert(newGoals)
          .select()
          .single();

        if (createError) throw createError;
        setGoals(created);
        setEditValues({
          revenue_goal: created.revenue_goal,
          new_clients_goal: created.new_clients_goal
        });
      }
    } catch (error) {
      console.error('Error fetching goals:', error);
      toast({
        title: "שגיאה בטעינת יעדים",
        description: "לא הצלחנו לטעון את היעדים החודשיים",
        variant: "destructive"
      });
    } finally {
      setLoading(false);
    }
  };

  const saveGoals = async () => {
    if (!user || !goals) return;

    try {
      const { error } = await supabase
        .from('monthly_goals')
        .update({
          revenue_goal: editValues.revenue_goal,
          new_clients_goal: editValues.new_clients_goal,
          updated_at: new Date().toISOString()
        })
        .eq('id', goals.id);

      if (error) throw error;

      setGoals({
        ...goals,
        revenue_goal: editValues.revenue_goal,
        new_clients_goal: editValues.new_clients_goal
      });

      setEditing(false);
      toast({
        title: "יעדים עודכנו בהצלחה",
        description: "היעדים החודשיים שלך נשמרו"
      });
    } catch (error) {
      console.error('Error saving goals:', error);
      toast({
        title: "שגיאה בשמירת יעדים",
        description: "לא הצלחנו לשמור את היעדים",
        variant: "destructive"
      });
    }
  };

  const getMonthName = (monthYear: string) => {
    const [year, month] = monthYear.split('-');
    const monthNames = [
      'ינואר', 'פברואר', 'מרץ', 'אפריל', 'מאי', 'יוני',
      'יולי', 'אוגוסט', 'ספטמבר', 'אוקטובר', 'נובמבר', 'דצמבר'
    ];
    return `${monthNames[parseInt(month) - 1]} ${year}`;
  };

  if (loading) {
    return (
      <Card className="animate-fade-in">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Target className="h-5 w-5 text-beauty-primary" />
            יעדים חודשיים
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <div className="h-4 bg-gray-200 rounded animate-pulse"></div>
            <div className="h-4 bg-gray-200 rounded animate-pulse"></div>
          </div>
        </CardContent>
      </Card>
    );
  }

  if (!goals) return null;

  const revenueProgress = goals.revenue_goal > 0 ? (goals.current_revenue / goals.revenue_goal) * 100 : 0;
  const clientsProgress = goals.new_clients_goal > 0 ? (goals.current_new_clients / goals.new_clients_goal) * 100 : 0;

  return (
    <Card className="animate-fade-in hover:shadow-md transition-all duration-300">
      <CardHeader className="pb-3">
        <div className="flex items-center justify-between">
          <CardTitle className="flex items-center gap-2 text-beauty-dark">
            <Target className="h-5 w-5 text-beauty-primary" />
            יעדים ל{getMonthName(currentMonth)}
          </CardTitle>
          {!editing ? (
            <Button 
              variant="ghost" 
              size="sm"
              onClick={() => setEditing(true)}
              className="hover:bg-beauty-accent"
            >
              <Edit2 className="h-4 w-4" />
            </Button>
          ) : (
            <div className="flex gap-1">
              <Button 
                variant="ghost" 
                size="sm"
                onClick={saveGoals}
                className="hover:bg-green-100 text-green-600"
              >
                <Check className="h-4 w-4" />
              </Button>
              <Button 
                variant="ghost" 
                size="sm"
                onClick={() => {
                  setEditing(false);
                  setEditValues({
                    revenue_goal: goals.revenue_goal,
                    new_clients_goal: goals.new_clients_goal
                  });
                }}
                className="hover:bg-red-100 text-red-600"
              >
                <X className="h-4 w-4" />
              </Button>
            </div>
          )}
        </div>
      </CardHeader>
      <CardContent className="space-y-6">
        {/* יעד הכנסות */}
        <div className="space-y-3">
          <div className="flex items-center justify-between">
            <span className="font-medium text-beauty-dark">הכנסות חודשיות</span>
            <div className="flex items-center gap-2">
              {editing ? (
                <div className="flex items-center gap-1">
                  <span className="text-sm">₪</span>
                  <Input
                    type="number"
                    value={editValues.revenue_goal}
                    onChange={(e) => setEditValues(prev => ({
                      ...prev,
                      revenue_goal: parseInt(e.target.value) || 0
                    }))}
                    className="w-24 h-8 text-sm"
                  />
                </div>
              ) : (
                <span className="text-sm text-muted-foreground">
                  ₪{goals.current_revenue.toLocaleString()} / ₪{goals.revenue_goal.toLocaleString()}
                </span>
              )}
            </div>
          </div>
          <Progress 
            value={revenueProgress} 
            className="h-2"
            style={{
              background: 'linear-gradient(to right, #f0f0f0, #e0e0e0)'
            }}
          />
          <div className="flex items-center justify-between text-xs text-muted-foreground">
            <span>{revenueProgress.toFixed(1)}% הושלם</span>
            {revenueProgress >= 100 ? (
              <span className="text-green-600 flex items-center gap-1">
                <TrendingUp className="h-3 w-3" />
                יעד הושג!
              </span>
            ) : (
              <span>נותרו ₪{(goals.revenue_goal - goals.current_revenue).toLocaleString()}</span>
            )}
          </div>
        </div>

        {/* יעד לקוחות חדשים */}
        <div className="space-y-3">
          <div className="flex items-center justify-between">
            <span className="font-medium text-beauty-dark">לקוחות חדשים</span>
            <div className="flex items-center gap-2">
              {editing ? (
                <Input
                  type="number"
                  value={editValues.new_clients_goal}
                  onChange={(e) => setEditValues(prev => ({
                    ...prev,
                    new_clients_goal: parseInt(e.target.value) || 0
                  }))}
                  className="w-24 h-8 text-sm"
                />
              ) : (
                <span className="text-sm text-muted-foreground">
                  {goals.current_new_clients} / {goals.new_clients_goal} לקוחות
                </span>
              )}
            </div>
          </div>
          <Progress 
            value={clientsProgress} 
            className="h-2"
          />
          <div className="flex items-center justify-between text-xs text-muted-foreground">
            <span>{clientsProgress.toFixed(1)}% הושלם</span>
            {clientsProgress >= 100 ? (
              <span className="text-green-600 flex items-center gap-1">
                <TrendingUp className="h-3 w-3" />
                יעד הושג!
              </span>
            ) : (
              <span>נותרו {goals.new_clients_goal - goals.current_new_clients} לקוחות</span>
            )}
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default MonthlyGoals;

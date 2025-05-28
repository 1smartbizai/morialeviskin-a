
import { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import { 
  Calculator, 
  TrendingUp, 
  TrendingDown,
  DollarSign,
  BarChart3,
  Download,
  RefreshCw
} from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/contexts/AuthContext";
import { useToast } from "@/hooks/use-toast";

interface Treatment {
  id: string;
  name: string;
  price: number;
  duration: number;
}

interface ProfitabilityData {
  treatment_id: string;
  treatment_name: string;
  total_revenue: number;
  total_costs: number;
  profit_margin: number;
  session_count: number;
  avg_cost_per_session: number;
}

const ProfitabilityCalculator = () => {
  const { user } = useAuth();
  const { toast } = useToast();
  const [treatments, setTreatments] = useState<Treatment[]>([]);
  const [selectedTreatment, setSelectedTreatment] = useState<string>("");
  const [calculationData, setCalculationData] = useState({
    monthly_costs: 0,
    hourly_rate: 0,
    material_costs: 0,
    overhead_percentage: 15
  });
  const [results, setResults] = useState<any>(null);
  const [loading, setLoading] = useState(false);
  const [profitabilityData, setProfitabilityData] = useState<ProfitabilityData[]>([]);

  useEffect(() => {
    if (user) {
      fetchTreatments();
      fetchProfitabilityData();
    }
  }, [user]);

  const fetchTreatments = async () => {
    if (!user) return;

    try {
      const { data, error } = await supabase
        .from('treatments')
        .select('*')
        .eq('user_id', user.id)
        .eq('is_visible', true);

      if (error) throw error;
      setTreatments(data || []);
    } catch (error) {
      console.error('Error fetching treatments:', error);
    }
  };

  const fetchProfitabilityData = async () => {
    if (!user) return;

    try {
      // נחשב רווחיות על בסיס תורים שהושלמו בחודש האחרון
      const lastMonth = new Date();
      lastMonth.setMonth(lastMonth.getMonth() - 1);

      const { data: appointments, error } = await supabase
        .from('appointments')
        .select('treatment_name, treatment_id')
        .eq('business_owner_id', user.id)
        .eq('status', 'completed')
        .gte('appointment_date', lastMonth.toISOString());

      if (error) throw error;

      // קיבוץ לפי טיפול וחישוב רווחיות
      const treatmentStats = treatments.reduce((acc, treatment) => {
        const treatmentAppointments = appointments?.filter(a => a.treatment_id === treatment.id) || [];
        const sessionCount = treatmentAppointments.length;
        const totalRevenue = sessionCount * treatment.price;
        const estimatedCosts = sessionCount * (calculationData.material_costs + (treatment.duration / 60) * calculationData.hourly_rate);
        const profitMargin = totalRevenue > 0 ? ((totalRevenue - estimatedCosts) / totalRevenue) * 100 : 0;

        return [
          ...acc,
          {
            treatment_id: treatment.id,
            treatment_name: treatment.name,
            total_revenue: totalRevenue,
            total_costs: estimatedCosts,
            profit_margin: profitMargin,
            session_count: sessionCount,
            avg_cost_per_session: sessionCount > 0 ? estimatedCosts / sessionCount : 0
          }
        ];
      }, [] as ProfitabilityData[]);

      setProfitabilityData(treatmentStats);
    } catch (error) {
      console.error('Error calculating profitability:', error);
    }
  };

  const calculateProfitability = () => {
    if (!selectedTreatment) {
      toast({
        title: "נא לבחור טיפול",
        description: "בחר טיפול כדי לחשב רווחיות",
        variant: "destructive"
      });
      return;
    }

    setLoading(true);

    try {
      const treatment = treatments.find(t => t.id === selectedTreatment);
      if (!treatment) return;

      // חישובי רווחיות
      const sessionDurationHours = treatment.duration / 60;
      const laborCost = sessionDurationHours * calculationData.hourly_rate;
      const totalDirectCosts = laborCost + calculationData.material_costs;
      const overheadCosts = totalDirectCosts * (calculationData.overhead_percentage / 100);
      const totalCosts = totalDirectCosts + overheadCosts;
      
      const profit = treatment.price - totalCosts;
      const profitMargin = (profit / treatment.price) * 100;
      const hourlyProfit = profit / sessionDurationHours;

      // חישוב נקודת איזון
      const monthlyFixedCosts = calculationData.monthly_costs;
      const breakEvenSessions = monthlyFixedCosts / profit;

      setResults({
        treatment_name: treatment.name,
        price: treatment.price,
        total_costs: totalCosts,
        profit: profit,
        profit_margin: profitMargin,
        hourly_profit: hourlyProfit,
        labor_cost: laborCost,
        material_cost: calculationData.material_costs,
        overhead_cost: overheadCosts,
        break_even_sessions: Math.ceil(breakEvenSessions),
        recommended_price: totalCosts * 1.5 // המלצה לרווח של 50%
      });

      toast({
        title: "חישוב הושלם בהצלחה",
        description: `רווחיות עבור ${treatment.name}: ${profitMargin.toFixed(1)}%`
      });

    } catch (error) {
      console.error('Error calculating profitability:', error);
      toast({
        title: "שגיאה בחישוב",
        description: "לא הצלחנו לחשב את הרווחיות",
        variant: "destructive"
      });
    } finally {
      setLoading(false);
    }
  };

  const exportResults = () => {
    if (!results) return;

    const reportData = {
      treatment: results.treatment_name,
      date: new Date().toLocaleDateString('he-IL'),
      price: results.price,
      costs: {
        labor: results.labor_cost,
        materials: results.material_cost,
        overhead: results.overhead_cost,
        total: results.total_costs
      },
      profit: {
        amount: results.profit,
        margin: results.profit_margin,
        hourly: results.hourly_profit
      },
      recommendations: {
        break_even_sessions: results.break_even_sessions,
        recommended_price: results.recommended_price
      }
    };

    const dataStr = JSON.stringify(reportData, null, 2);
    const dataBlob = new Blob([dataStr], { type: 'application/json' });
    
    const url = URL.createObjectURL(dataBlob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `profitability-report-${results.treatment_name}-${new Date().toISOString().split('T')[0]}.json`;
    link.click();
    
    URL.revokeObjectURL(url);
    
    toast({
      title: "דוח יוצא בהצלחה",
      description: "הדוח הורד למחשב שלך"
    });
  };

  return (
    <Card className="animate-fade-in hover:shadow-md transition-all duration-300">
      <CardHeader className="pb-3">
        <CardTitle className="flex items-center gap-2 text-beauty-dark">
          <Calculator className="h-5 w-5 text-beauty-primary" />
          מחשבון רווחיות
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-6">
        {/* הגדרות בסיסיות */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="space-y-2">
            <Label htmlFor="treatment">טיפול לחישוב</Label>
            <Select value={selectedTreatment} onValueChange={setSelectedTreatment}>
              <SelectTrigger>
                <SelectValue placeholder="בחר טיפול" />
              </SelectTrigger>
              <SelectContent>
                {treatments.map(treatment => (
                  <SelectItem key={treatment.id} value={treatment.id}>
                    {treatment.name} - ₪{treatment.price}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-2">
            <Label htmlFor="hourly_rate">עלות שעה (₪)</Label>
            <Input
              id="hourly_rate"
              type="number"
              value={calculationData.hourly_rate}
              onChange={(e) => setCalculationData(prev => ({
                ...prev,
                hourly_rate: parseFloat(e.target.value) || 0
              }))}
              placeholder="150"
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="material_costs">עלות חומרים לטיפול (₪)</Label>
            <Input
              id="material_costs"
              type="number"
              value={calculationData.material_costs}
              onChange={(e) => setCalculationData(prev => ({
                ...prev,
                material_costs: parseFloat(e.target.value) || 0
              }))}
              placeholder="20"
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="overhead">עלויות תקורה (%)</Label>
            <Input
              id="overhead"
              type="number"
              value={calculationData.overhead_percentage}
              onChange={(e) => setCalculationData(prev => ({
                ...prev,
                overhead_percentage: parseFloat(e.target.value) || 0
              }))}
              placeholder="15"
            />
          </div>
        </div>

        {/* כפתור חישוב */}
        <Button 
          onClick={calculateProfitability}
          disabled={loading || !selectedTreatment}
          className="w-full bg-beauty-primary hover:bg-beauty-primary/90"
        >
          {loading ? (
            <RefreshCw className="h-4 w-4 mr-2 animate-spin" />
          ) : (
            <Calculator className="h-4 w-4 mr-2" />
          )}
          חשב רווחיות
        </Button>

        {/* תוצאות */}
        {results && (
          <div className="space-y-4 p-4 bg-beauty-accent rounded-lg animate-fade-in">
            <div className="flex items-center justify-between">
              <h3 className="font-medium text-beauty-dark">תוצאות עבור {results.treatment_name}</h3>
              <Button variant="ghost" size="sm" onClick={exportResults}>
                <Download className="h-4 w-4" />
              </Button>
            </div>

            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              <div className="text-center">
                <div className="text-2xl font-bold text-beauty-primary">
                  ₪{results.profit.toFixed(0)}
                </div>
                <div className="text-xs text-muted-foreground">רווח נקי</div>
              </div>

              <div className="text-center">
                <div className={`text-2xl font-bold ${
                  results.profit_margin > 30 ? 'text-green-600' : 
                  results.profit_margin > 15 ? 'text-yellow-600' : 'text-red-600'
                }`}>
                  {results.profit_margin.toFixed(1)}%
                </div>
                <div className="text-xs text-muted-foreground">רווחיות</div>
              </div>

              <div className="text-center">
                <div className="text-2xl font-bold text-beauty-dark">
                  ₪{results.hourly_profit.toFixed(0)}
                </div>
                <div className="text-xs text-muted-foreground">רווח לשעה</div>
              </div>

              <div className="text-center">
                <div className="text-2xl font-bold text-beauty-dark">
                  {results.break_even_sessions}
                </div>
                <div className="text-xs text-muted-foreground">טיפולים לאיזון</div>
              </div>
            </div>

            {/* פירוט עלויות */}
            <div className="space-y-2">
              <h4 className="font-medium text-sm">פירוט עלויות:</h4>
              <div className="grid grid-cols-2 gap-2 text-sm">
                <div className="flex justify-between">
                  <span>עבודה:</span>
                  <span>₪{results.labor_cost.toFixed(0)}</span>
                </div>
                <div className="flex justify-between">
                  <span>חומרים:</span>
                  <span>₪{results.material_cost.toFixed(0)}</span>
                </div>
                <div className="flex justify-between">
                  <span>תקורה:</span>
                  <span>₪{results.overhead_cost.toFixed(0)}</span>
                </div>
                <div className="flex justify-between font-medium">
                  <span>סה"כ עלויות:</span>
                  <span>₪{results.total_costs.toFixed(0)}</span>
                </div>
              </div>
            </div>

            {/* המלצות */}
            {results.profit_margin < 20 && (
              <div className="p-3 bg-yellow-50 rounded-lg border border-yellow-200">
                <div className="flex items-start gap-2">
                  <TrendingUp className="h-4 w-4 text-yellow-600 mt-0.5" />
                  <div className="text-sm">
                    <p className="font-medium text-yellow-800">המלצה לשיפור רווחיות:</p>
                    <p className="text-yellow-700">
                      שקול להעלות את המחיר ל-₪{results.recommended_price.toFixed(0)} 
                      או לחפש דרכים להפחית עלויות
                    </p>
                  </div>
                </div>
              </div>
            )}
          </div>
        )}

        {/* סיכום רווחיות כללי */}
        {profitabilityData.length > 0 && (
          <div className="space-y-3">
            <h3 className="font-medium text-beauty-dark">סיכום רווחיות חודשי</h3>
            <div className="space-y-2">
              {profitabilityData.slice(0, 3).map((item) => (
                <div key={item.treatment_id} className="flex items-center justify-between p-2 bg-gray-50 rounded">
                  <span className="text-sm font-medium">{item.treatment_name}</span>
                  <div className="flex items-center gap-2">
                    <Badge 
                      variant={item.profit_margin > 30 ? "default" : item.profit_margin > 15 ? "secondary" : "destructive"}
                      className="text-xs"
                    >
                      {item.profit_margin.toFixed(1)}%
                    </Badge>
                    {item.profit_margin > 30 ? (
                      <TrendingUp className="h-3 w-3 text-green-500" />
                    ) : (
                      <TrendingDown className="h-3 w-3 text-red-500" />
                    )}
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  );
};

export default ProfitabilityCalculator;


import { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle, CardDescription, CardFooter } from "@/components/ui/card";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { CheckCircle, CreditCard } from "lucide-react";
import { SignupData } from "@/contexts/SignupContext";

interface PaymentStepProps {
  data: Partial<SignupData>;
  updateData: (data: Partial<SignupData>) => void;
}

interface PlanOption {
  id: string;
  name: string;
  price: number;
  features: string[];
  recommended?: boolean;
}

const plans: PlanOption[] = [
  {
    id: "starter",
    name: "Starter",
    price: 99,
    features: [
      "Up to 50 clients",
      "Basic appointment scheduling",
      "Client database",
      "Payment tracking",
    ],
  },
  {
    id: "professional",
    name: "Professional",
    price: 199,
    features: [
      "Up to 200 clients",
      "Advanced appointment scheduling",
      "Client database with detailed profiles",
      "Payment tracking and invoicing",
      "Marketing tools",
      "SMS notifications",
    ],
    recommended: true,
  },
  {
    id: "premium",
    name: "Premium",
    price: 299,
    features: [
      "Unlimited clients",
      "Full appointment system",
      "Comprehensive client profiles",
      "Complete financial management",
      "Advanced marketing campaigns",
      "Multi-staff support",
      "Custom branding",
      "Priority support",
    ],
  },
];

const PaymentStep = ({ data, updateData }: PaymentStepProps) => {
  const [selectedPlan, setSelectedPlan] = useState<string>(data?.subscriptionLevel || "professional");
  const [paymentInfo, setPaymentInfo] = useState({
    cardNumber: "",
    cardExpiry: "",
    cardCvv: "",
  });

  // Make sure the selected plan is synced with the context
  useEffect(() => {
    if (data?.subscriptionLevel && data.subscriptionLevel !== selectedPlan) {
      setSelectedPlan(data.subscriptionLevel);
    } else if (!data?.subscriptionLevel && selectedPlan) {
      updateData({ subscriptionLevel: selectedPlan });
    }
  }, [data?.subscriptionLevel]);

  const handlePlanChange = (planId: string) => {
    setSelectedPlan(planId);
    updateData({ subscriptionLevel: planId });
  };

  // Simulated payment processing here
  // In a real implementation, you would integrate with Tranzila's API

  return (
    <div className="space-y-6">
      <h3 className="text-lg font-medium">Choose a Subscription Plan</h3>
      
      <RadioGroup 
        value={selectedPlan} 
        onValueChange={handlePlanChange} 
        className="grid grid-cols-1 gap-4 md:grid-cols-3"
      >
        {plans.map((plan) => (
          <div key={plan.id} className="relative">
            <RadioGroupItem
              value={plan.id}
              id={plan.id}
              className="peer sr-only"
            />
            <Label
              htmlFor={plan.id}
              className={`flex flex-col h-full p-4 border rounded-lg cursor-pointer ${
                selectedPlan === plan.id
                  ? "border-primary bg-primary/5"
                  : "border-muted bg-background"
              } ${
                plan.recommended ? "ring-2 ring-primary" : ""
              }`}
            >
              {plan.recommended && (
                <span className="absolute -top-2 left-1/2 transform -translate-x-1/2 px-2 py-0.5 bg-primary text-primary-foreground text-xs font-medium rounded-full">
                  Recommended
                </span>
              )}
              <div className="mb-4 mt-2">
                <div className="text-lg font-semibold">{plan.name}</div>
                <div className="text-2xl font-bold mt-1">₪{plan.price}<span className="text-sm text-muted-foreground font-normal">/month</span></div>
              </div>
              <ul className="space-y-2 text-sm flex-grow">
                {plan.features.map((feature, i) => (
                  <li key={i} className="flex items-start">
                    <CheckCircle className="h-4 w-4 mr-2 mt-0.5 text-primary" />
                    <span>{feature}</span>
                  </li>
                ))}
              </ul>
            </Label>
          </div>
        ))}
      </RadioGroup>

      <div className="mt-8">
        <Card className="border-primary/50">
          <CardHeader>
            <div className="flex items-center justify-between">
              <div>
                <CardTitle className="text-lg">Payment Information</CardTitle>
                <CardDescription>Enter your payment details</CardDescription>
              </div>
              <CreditCard className="h-5 w-5 text-muted-foreground" />
            </div>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="grid gap-2">
                <Label htmlFor="cardNumber">Card Number</Label>
                <input
                  id="cardNumber"
                  placeholder="4580 1234 5678 9012"
                  className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground"
                  value="4580 •••• •••• ••••" // Simulated card number
                  readOnly
                />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div className="grid gap-2">
                  <Label htmlFor="expiry">Expiry Date</Label>
                  <input
                    id="expiry"
                    placeholder="MM/YY"
                    className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground"
                    value="12/25" // Simulated expiry
                    readOnly
                  />
                </div>
                <div className="grid gap-2">
                  <Label htmlFor="cvc">CVC</Label>
                  <input
                    id="cvc"
                    placeholder="CVC"
                    className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground"
                    value="•••" // Simulated CVC
                    readOnly
                  />
                </div>
              </div>
            </div>
          </CardContent>
          <CardFooter>
            <p className="text-sm text-muted-foreground">
              <span className="font-medium text-foreground">Secure Payment:</span> Your payment information is processed securely. We don't store your card details.
            </p>
          </CardFooter>
        </Card>
      </div>

      <div className="bg-muted/30 p-4 rounded-lg mt-4">
        <p className="text-sm text-muted-foreground">
          By proceeding, you agree to our Terms of Service and acknowledge that your subscription will be activated immediately. You can cancel anytime from your account settings.
        </p>
      </div>
    </div>
  );
};

export default PaymentStep;

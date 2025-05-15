
import { useState } from "react";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Label } from "@/components/ui/label";
import { CheckCircle } from "lucide-react";
import { formatCurrency } from "@/utils/formatters";
import { PlanOption } from "./types";

interface PlanOptionsProps {
  plans: PlanOption[];
  selectedPlan: string;
  onPlanChange: (planId: string) => void;
}

const PlanOptions = ({ plans, selectedPlan, onPlanChange }: PlanOptionsProps) => {
  return (
    <RadioGroup 
      value={selectedPlan} 
      onValueChange={onPlanChange} 
      className="grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-4"
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
              <span className="absolute -top-2 right-1/2 transform translate-x-1/2 px-2 py-0.5 bg-primary text-primary-foreground text-xs font-medium rounded-full">
                מומלץ
              </span>
            )}
            {plan.isFree && (
              <span className="absolute -top-2 right-1/2 transform translate-x-1/2 px-2 py-0.5 bg-green-500 text-white text-xs font-medium rounded-full">
                ללא תשלום
              </span>
            )}
            <div className="mb-4 mt-2">
              <div className="text-lg font-semibold">{plan.name}</div>
              <div className="text-2xl font-bold mt-1">
                {plan.price === 0 ? 'חינם' : `${formatCurrency(plan.price / 100)}`}
                {plan.price > 0 && <span className="text-sm text-muted-foreground font-normal">/חודש</span>}
                {plan.trialDays && <span className="text-sm text-muted-foreground font-normal"> ל-{plan.trialDays} יום</span>}
              </div>
            </div>
            <ul className="space-y-2 text-sm flex-grow pr-1">
              {plan.features.map((feature, i) => (
                <li key={i} className="flex items-start">
                  <CheckCircle className="h-4 w-4 ml-2 mt-0.5 text-primary flex-shrink-0" />
                  <span>{feature}</span>
                </li>
              ))}
            </ul>
          </Label>
        </div>
      ))}
    </RadioGroup>
  );
};

export default PlanOptions;


import React, { ReactNode } from "react";

interface SignupLayoutProps {
  children: ReactNode;
}

const SignupLayout = ({ children }: SignupLayoutProps) => {
  return (
    <div className="min-h-screen bg-background flex flex-col items-center justify-center p-4" dir="rtl">
      <div className="w-full max-w-3xl">
        <div className="mb-8 text-center">
          <h1 className="text-3xl font-bold tracking-tight">Bellevo</h1>
          <p className="text-muted-foreground mt-2">הפלטפורמה שמעצימה את העסק שלך</p>
        </div>
        {children}
      </div>
    </div>
  );
};

export default SignupLayout;


interface LegalDisclaimerProps {
  isPaidPlan: boolean;
}

const LegalDisclaimer = ({ isPaidPlan }: LegalDisclaimerProps) => {
  return (
    <div className="bg-muted/30 p-4 rounded-lg mt-4">
      <p className="text-sm text-muted-foreground">
        בהמשך, את מסכימה לתנאי השימוש שלנו ומאשרת כי המנוי שלך יופעל מיד. 
        {!isPaidPlan
          ? " בסיום 30 ימים תתבקשי לבחור תכנית בתשלום להמשך שימוש במערכת." 
          : " תוכלי לבטל בכל עת מהגדרות החשבון שלך."}
      </p>
    </div>
  );
};

export default LegalDisclaimer;

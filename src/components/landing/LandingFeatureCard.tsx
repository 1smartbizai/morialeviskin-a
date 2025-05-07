
import React from 'react';
import { LucideIcon } from 'lucide-react';

interface LandingFeatureCardProps {
  icon: LucideIcon;
  title: string;
  description: string;
}

const LandingFeatureCard: React.FC<LandingFeatureCardProps> = ({ icon: Icon, title, description }) => {
  return (
    <div className="smartbiz-card p-6 flex flex-col items-center text-center group hover:border-smartbiz-primary/20 transition-all duration-300">
      <div className="p-3 rounded-full bg-smartbiz-primary/10 mb-4 group-hover:bg-smartbiz-primary/20 transition-all">
        <Icon className="h-8 w-8 text-smartbiz-primary" />
      </div>
      <h3 className="text-xl font-bold mb-2">{title}</h3>
      <p className="text-smartbiz-muted">{description}</p>
    </div>
  );
};

export default LandingFeatureCard;

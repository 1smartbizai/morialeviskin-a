
import React from 'react';
import { 
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger
} from '@/components/ui/accordion';

interface FaqItem {
  question: string;
  answer: string;
}

interface LandingFaqProps {
  faqs: FaqItem[];
}

const LandingFaq: React.FC<LandingFaqProps> = ({ faqs }) => {
  return (
    <div className="w-full max-w-3xl mx-auto">
      <Accordion type="single" collapsible className="w-full">
        {faqs.map((faq, index) => (
          <AccordionItem key={index} value={`faq-${index}`} className="border-b border-gray-200">
            <AccordionTrigger className="text-right font-bold py-4">
              {faq.question}
            </AccordionTrigger>
            <AccordionContent className="text-smartbiz-muted">
              {faq.answer}
            </AccordionContent>
          </AccordionItem>
        ))}
      </Accordion>
    </div>
  );
};

export default LandingFaq;

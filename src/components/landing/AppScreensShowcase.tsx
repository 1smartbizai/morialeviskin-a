
import React from 'react';
import { 
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious
} from '@/components/ui/carousel';

interface AppScreen {
  image: string;
  title: string;
}

interface AppScreensShowcaseProps {
  screens: AppScreen[];
}

const AppScreensShowcase: React.FC<AppScreensShowcaseProps> = ({ screens }) => {
  return (
    <div className="w-full relative py-12">
      <Carousel
        opts={{
          align: 'center',
          loop: true,
        }}
        className="w-full"
      >
        <CarouselContent className="-mr-4">
          {screens.map((screen, index) => (
            <CarouselItem key={index} className="pr-4 md:basis-1/2 lg:basis-1/3">
              <div className="phone-mockup w-full h-[600px] mx-auto">
                <div className="phone-notch"></div>
                <div className="relative w-full h-full overflow-hidden">
                  <img 
                    src={screen.image} 
                    alt={screen.title}
                    className="w-full h-full object-cover object-top"
                  />
                </div>
              </div>
              <div className="text-center mt-4 font-semibold">{screen.title}</div>
            </CarouselItem>
          ))}
        </CarouselContent>
        <div className="hidden md:flex">
          <CarouselPrevious className="absolute -left-16 top-1/2" />
          <CarouselNext className="absolute -right-16 top-1/2" />
        </div>
      </Carousel>
    </div>
  );
};

export default AppScreensShowcase;

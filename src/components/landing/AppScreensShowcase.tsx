
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
              <div className="phone-mockup w-full h-[600px] mx-auto relative">
                <div className="absolute inset-0 flex flex-col rounded-[36px] overflow-hidden border-8 border-gray-800 bg-gray-800 shadow-xl">
                  {/* Phone notch */}
                  <div className="h-6 w-full bg-gray-800 relative flex justify-center">
                    <div className="absolute top-1 w-24 h-4 bg-black rounded-full"></div>
                  </div>
                  
                  {/* Screen content */}
                  <div className="flex-1 w-full overflow-hidden">
                    <img 
                      src={screen.image} 
                      alt={screen.title}
                      className="w-full h-full object-cover object-top"
                    />
                  </div>
                  
                  {/* Bottom bar */}
                  <div className="h-1 w-full bg-gray-800 flex justify-center">
                    <div className="w-24 h-1 bg-gray-600 rounded-t-lg"></div>
                  </div>
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

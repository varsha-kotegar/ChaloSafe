import React, { useState, useEffect } from 'react';
import { Button } from './ui/button';
import { Card, CardContent } from './ui/card';
import { MapPin, Shield, Brain, Smartphone, ArrowLeft, ArrowRight } from 'lucide-react';
import { Language } from '../App';

interface OnboardingCarouselProps {
  onComplete: () => void;
  language: Language;
}

const slides = [
  {
    icon: MapPin,
    title: 'Geo-Fencing Alerts',
    description: 'Get warned when entering unsafe or restricted areas. Stay informed about your surroundings.',
    color: 'text-red-500',
    bgColor: 'bg-red-50',
  },
  {
    icon: Shield,
    title: 'Digital ID Security',
    description: 'Blockchain-secured identity verification ensures your safety and authenticity while traveling.',
    color: 'text-blue-500',
    bgColor: 'bg-blue-50',
  },
  {
    icon: Brain,
    title: 'AI-Based Risk Monitoring',
    description: 'Advanced AI detects suspicious or distress behavior and alerts authorities automatically.',
    color: 'text-purple-500',
    bgColor: 'bg-purple-50',
  },
  {
    icon: Smartphone,
    title: 'IoT Safety Devices',
    description: 'Smart safety bands and compact tags provide 24/7 protection and emergency assistance.',
    color: 'text-green-500',
    bgColor: 'bg-green-50',
  },
];

export function OnboardingCarousel({ onComplete, language }: OnboardingCarouselProps) {
  const [currentSlide, setCurrentSlide] = useState(0);

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentSlide((prev) => {
        if (prev === slides.length - 1) {
          return prev; // Stop auto-advance on last slide
        }
        return prev + 1;
      });
    }, 5000);

    return () => clearInterval(timer);
  }, []);

  const nextSlide = () => {
    if (currentSlide < slides.length - 1) {
      setCurrentSlide(currentSlide + 1);
    }
  };

  const skipToEnd = () => {
    onComplete();
  };

  const slide = slides[currentSlide];
  const IconComponent = slide.icon;

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-green-50 flex items-center justify-center p-4">
      <Card className="w-full max-w-md mx-auto">
        <CardContent className="p-8">
          <div className={`mb-8 flex justify-center ${slide.bgColor} p-6 rounded-full w-24 h-24 mx-auto`}>
            <IconComponent className={`w-12 h-12 ${slide.color}`} />
          </div>
          
          <h2 className="mb-4 text-center text-gray-800">
            {slide.title}
          </h2>
          
          <p className="text-gray-600 mb-8 text-center leading-relaxed">
            {slide.description}
          </p>
          
          <div className="flex justify-center mb-6">
            <div className="flex space-x-2">
              {slides.map((_, index) => (
                <div
                  key={index}
                  className={`w-2 h-2 rounded-full ${
                    index === currentSlide ? 'bg-blue-500' : 'bg-gray-300'
                  }`}
                />
              ))}
            </div>
          </div>
          
          <div className="flex space-x-3">
            <Button 
              variant="outline" 
              onClick={skipToEnd}
              className="flex-1"
            >
              Skip
            </Button>
            
            {currentSlide < slides.length - 1 ? (
              <Button 
                onClick={nextSlide}
                className="flex-1 bg-blue-600 hover:bg-blue-700"
              >
                Next
              </Button>
            ) : (
              <Button 
                onClick={onComplete}
                className="flex-1 bg-green-600 hover:bg-green-700"
              >
                Get Started
              </Button>
            )}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
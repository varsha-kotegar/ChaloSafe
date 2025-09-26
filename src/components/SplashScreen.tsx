import React, { useEffect } from 'react';
import { Shield, MapPin } from 'lucide-react';
import { ImageWithFallback } from './figma/ImageWithFallback';

interface SplashScreenProps {
  onComplete: () => void;
}

export function SplashScreen({ onComplete }: SplashScreenProps) {
  useEffect(() => {
    const timer = setTimeout(() => {
      onComplete();
    }, 3000); // 3 seconds

    return () => clearTimeout(timer);
  }, [onComplete]);

  return (
    <div className="min-h-screen bg-gradient-to-br from-green-600 to-blue-600 flex items-center justify-center p-4">
      <div className="text-center text-white">
        <div className="mb-8 flex justify-center">
          <div className="relative">
            <div className="w-24 h-24 bg-white/20 rounded-full flex items-center justify-center backdrop-blur-sm">
              <Shield className="w-12 h-12 text-white" />
              <MapPin className="w-6 h-6 text-white absolute -bottom-1 -right-1" />
            </div>
          </div>
        </div>
        
        <h1 className="mb-4">
          ChaloSafe
        </h1>
        
        <p className="text-white/90">
          Your Safety Companion
        </p>
        
        <div className="mt-8">
          <div className="w-8 h-8 border-2 border-white/30 border-t-white rounded-full animate-spin mx-auto"></div>
        </div>
      </div>
    </div>
  );
}
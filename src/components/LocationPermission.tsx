import React from 'react';
import { MapPin, Shield } from 'lucide-react';
import { Button } from './ui/button';
import { Card, CardContent } from './ui/card';
import { Language } from '../App';
import { getTranslation } from '../utils/translations';

interface LocationPermissionProps {
  selectedLanguage: Language;
  onPermissionGranted: () => void;
  onSkip: () => void;
}

export function LocationPermission({ selectedLanguage, onPermissionGranted, onSkip }: LocationPermissionProps) {
  const handleAllowLocation = async () => {
    try {
      // In a real app, this would request actual location permissions
      if (navigator.geolocation) {
        navigator.geolocation.getCurrentPosition(
          () => {
            // Permission granted successfully
            onPermissionGranted();
          },
          () => {
            // Permission denied or error, but for demo we'll still proceed
            onPermissionGranted();
          },
          { timeout: 5000 }
        );
      } else {
        // Geolocation not supported, but for demo we'll still proceed
        onPermissionGranted();
      }
    } catch {
      // For demo purposes, we'll always grant permission
      onPermissionGranted();
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-green-50 flex items-center justify-center p-4">
      <Card className="w-full max-w-sm mx-auto">
        <CardContent className="p-8 text-center">
          <div className="mb-6 flex justify-center">
            <div className="relative">
              <Shield className="w-16 h-16 text-green-600" />
              <MapPin className="w-8 h-8 text-blue-600 absolute -bottom-1 -right-1" />
            </div>
          </div>
          
          <h2 className="mb-4 text-gray-800">
            {getTranslation('locationPermissionTitle', selectedLanguage)}
          </h2>
          
          <p className="text-gray-600 mb-8 leading-relaxed">
            {getTranslation('locationPermissionMessage', selectedLanguage)}
          </p>
          
          <div className="space-y-3">
            <Button 
              onClick={handleAllowLocation}
              className="w-full bg-green-600 hover:bg-green-700"
            >
              {getTranslation('allowLocation', selectedLanguage)}
            </Button>
            
            <Button 
              variant="outline"
              onClick={onSkip}
              className="w-full"
            >
              {getTranslation('deny', selectedLanguage)}
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
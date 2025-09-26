import React, { useState } from 'react';
import { Button } from './ui/button';
import { Card, CardContent, CardHeader, CardTitle } from './ui/card';
import { Language } from '../App';
import { getTranslation } from '../utils/translations';

interface LanguageSelectionProps {
  onLanguageSelect: (language: Language) => void;
}

const languages = [
  { code: 'en' as Language, name: 'English', native: 'English' },
  { code: 'hi' as Language, name: 'Hindi', native: 'हिंदी' },
  { code: 'kn' as Language, name: 'Kannada', native: 'ಕನ್ನಡ' },
  { code: 'ta' as Language, name: 'Tamil', native: 'தமிழ்' },
  { code: 'te' as Language, name: 'Telugu', native: 'తెలుగు' },
  { code: 'ml' as Language, name: 'Malayalam', native: 'മലയാളം' },
  { code: 'bn' as Language, name: 'Bengali', native: 'বাংলা' },
  { code: 'mr' as Language, name: 'Marathi', native: 'मराठी' },
  { code: 'gu' as Language, name: 'Gujarati', native: 'ગુજરાતી' },
  { code: 'pa' as Language, name: 'Punjabi', native: 'ਪੰਜਾਬੀ' },
  { code: 'or' as Language, name: 'Odia', native: 'ଓଡ଼ିଆ' },
];

export function LanguageSelection({ onLanguageSelect }: LanguageSelectionProps) {
  const [previewLanguage, setPreviewLanguage] = useState<Language>('en');
  
  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-green-50 flex items-center justify-center p-4">
      <Card className="w-full max-w-md mx-auto">
        <CardHeader className="text-center">
          <CardTitle>{getTranslation('selectLanguage', previewLanguage)}</CardTitle>
          <p className="text-gray-600">Choose your preferred language</p>
        </CardHeader>
        
        <CardContent>
          <div className="grid grid-cols-1 gap-3 max-h-96 overflow-y-auto">
            {languages.map((language) => (
              <Button
                key={language.code}
                variant="outline"
                className="justify-start h-14 text-left hover:bg-blue-50"
                onMouseEnter={() => setPreviewLanguage(language.code)}
                onClick={() => onLanguageSelect(language.code)}
              >
                <div className="flex flex-col items-start">
                  <span className="font-medium">{language.name}</span>
                  <span className="text-sm text-gray-500">{language.native}</span>
                </div>
              </Button>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
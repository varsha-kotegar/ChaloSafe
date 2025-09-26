import React from 'react';
import { Button } from './ui/button';
import { Card, CardContent, CardHeader, CardTitle } from './ui/card';
import { UserRole, Language } from '../App';
import { Luggage, CreditCard } from 'lucide-react';
import { getTranslation } from '../utils/translations';

interface RoleSelectionProps {
  onRoleSelect: (role: UserRole) => void;
  language: Language;
}

export function RoleSelection({ onRoleSelect, language }: RoleSelectionProps) {
  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-green-50 flex items-center justify-center p-4">
      <Card className="w-full max-w-md mx-auto">
        <CardHeader className="text-center">
          <CardTitle>{getTranslation('whoAreYou', language)}</CardTitle>
          <p className="text-gray-600">Select your role to continue</p>
        </CardHeader>
        
        <CardContent className="space-y-4">
          <Button
            variant="outline"
            className="w-full h-20 text-left flex items-center justify-start space-x-4 hover:bg-blue-50 hover:border-blue-300"
            onClick={() => onRoleSelect('traveller')}
          >
            <div className="bg-blue-100 p-3 rounded-lg">
              <Luggage className="w-8 h-8 text-blue-600" />
            </div>
            <div>
              <div className="font-medium">{getTranslation('traveller', language)}</div>
              <div className="text-sm text-gray-500">Tourist visiting places</div>
            </div>
          </Button>
          

          <Button
            variant="outline"
            className="w-full h-20 text-left flex items-center justify-start space-x-4 hover:bg-purple-50 hover:border-purple-300"
            onClick={() => onRoleSelect('idgenerator')}
          >
            <div className="bg-purple-100 p-3 rounded-lg">
              <CreditCard className="w-8 h-8 text-purple-600" />
            </div>
            <div>
              <div className="font-medium">ID Generator</div>
              <div className="text-sm text-gray-500">Create digital IDs for travellers</div>
            </div>
          </Button>
        </CardContent>
      </Card>
    </div>
  );
}
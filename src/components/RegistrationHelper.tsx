import React from 'react';
import { Alert, AlertDescription } from './ui/alert';
import { CheckCircle, Info } from 'lucide-react';

interface RegistrationHelperProps {
  suggestedEmail?: string;
  currentStep?: string;
}

export function RegistrationHelper({ suggestedEmail, currentStep }: RegistrationHelperProps) {
  if (!suggestedEmail) return null;

  const getStepMessage = () => {
    switch (currentStep) {
      case 'personal':
        return 'We\'ll create your ChaloSafe account with the email address you provided.';
      case 'verification':
        return 'Your identity verification helps secure your Digital ID.';
      case 'trip':
        return 'Trip details help us provide personalized safety recommendations.';
      case 'digital-id':
        return 'Almost done! Your Digital ID will be linked to your email address.';
      default:
        return 'Creating your personalized ChaloSafe account.';
    }
  };

  return (
    <Alert className="mb-4">
      <CheckCircle className="w-4 h-4" />
      <AlertDescription>
        <div className="space-y-1">
          <p className="font-medium">Creating account for: {suggestedEmail}</p>
          <p className="text-sm text-gray-600">{getStepMessage()}</p>
        </div>
      </AlertDescription>
    </Alert>
  );
}
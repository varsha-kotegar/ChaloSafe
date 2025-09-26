import React, { useState } from 'react';
import { SplashScreen } from './components/SplashScreen';
import { LocationPermission } from './components/LocationPermission';
import { LanguageSelection } from './components/LanguageSelection';
import { OnboardingCarousel } from './components/OnboardingCarousel';
import { RoleSelection } from './components/RoleSelection';
import { TravellerLogin } from './components/traveller/TravellerLogin';
import { TravellerDashboard } from './components/traveller/TravellerDashboard';
import { IDGeneratorLogin } from './components/idgenerator/IDGeneratorLogin';
import { IDGeneratorDashboard } from './components/idgenerator/IDGeneratorDashboard';
import { DigitalIdRegistration } from './components/traveller/DigitalIdRegistration';

export type AppStep = 
  | 'splash'
  | 'location-permission'
  | 'language-selection'
  | 'onboarding'
  | 'role-selection'
  | 'traveller-login'
  | 'traveller-register'
  | 'traveller-dashboard'
  | 'idgenerator-login'
  | 'idgenerator-dashboard'
  | 'digital-id-registration';

export type UserRole = 'traveller' | 'idgenerator' | null;

export type Language = 'en' | 'hi' | 'kn' | 'ta' | 'te' | 'ml' | 'bn' | 'mr' | 'gu' | 'pa' | 'or';

export type User = {
  id: string;
  name: string;
  role: UserRole;
  digitalId?: string;
  firstName?: string;
  lastName?: string;
  nationality?: string;
  age?: string;
  phone?: string;
  tripDuration?: string;
  itinerary?: string;
  startDate?: string;
  emergencyName?: string;
  emergencyPhone?: string;
};

export default function App() {
  const [currentStep, setCurrentStep] = useState<AppStep>('splash');
  const [selectedLanguage, setSelectedLanguage] = useState<Language>('en');
  const [selectedRole, setSelectedRole] = useState<UserRole>(null);
  const [currentUser, setCurrentUser] = useState<User | null>(null);

  const handleStepChange = (step: AppStep) => {
    setCurrentStep(step);
  };

  const handleLanguageSelect = (language: Language) => {
    setSelectedLanguage(language);
    setCurrentStep('onboarding');
  };

  const handleRoleSelect = (role: UserRole) => {
    setSelectedRole(role);
    if (role === 'traveller') {
      setCurrentStep('traveller-login');
    } else if (role === 'idgenerator') {
      setCurrentStep('idgenerator-login');
    }
  };

  const handleLogin = (user: User) => {
    setCurrentUser(user);
    if (user.role === 'traveller') {
      setCurrentStep('traveller-dashboard');
    } else if (user.role === 'idgenerator') {
      setCurrentStep('idgenerator-dashboard');
    }
  };

  const handleLogout = () => {
    setCurrentUser(null);
    setSelectedRole(null);
    setCurrentStep('splash');
  };

  const renderCurrentStep = () => {
    switch (currentStep) {
      case 'splash':
        return (
          <SplashScreen 
            onComplete={() => setCurrentStep('location-permission')}
          />
        );

      case 'location-permission':
        return (
          <LocationPermission 
            selectedLanguage={selectedLanguage}
            onPermissionGranted={() => setCurrentStep('language-selection')}
            onSkip={() => setCurrentStep('language-selection')}
          />
        );

      case 'language-selection':
        return (
          <LanguageSelection 
            selectedLanguage={selectedLanguage}
            onLanguageSelect={handleLanguageSelect}
          />
        );

      case 'onboarding':
        return (
          <OnboardingCarousel 
            selectedLanguage={selectedLanguage}
            onComplete={() => setCurrentStep('role-selection')}
          />
        );

      case 'role-selection':
        return (
          <RoleSelection 
            selectedLanguage={selectedLanguage}
            onRoleSelect={handleRoleSelect}
          />
        );

      case 'traveller-login':
        return (
          <TravellerLogin 
            selectedLanguage={selectedLanguage}
            onLogin={handleLogin}
            onRegister={() => setCurrentStep('traveller-register')}
            onBack={() => setCurrentStep('role-selection')}
          />
        );

      case 'traveller-register':
        return (
          <DigitalIdRegistration 
            selectedLanguage={selectedLanguage}
            onComplete={(user) => {
              setCurrentUser(user);
              setCurrentStep('traveller-dashboard');
            }}
            onBack={() => setCurrentStep('traveller-login')}
          />
        );

      case 'traveller-dashboard':
        return (
          <TravellerDashboard 
            selectedLanguage={selectedLanguage}
            user={currentUser}
            onLogout={handleLogout}
            onStepChange={handleStepChange}
          />
        );

      case 'idgenerator-login':
        return (
          <IDGeneratorLogin 
            selectedLanguage={selectedLanguage}
            onLogin={handleLogin}
            onBack={() => setCurrentStep('role-selection')}
          />
        );

      case 'idgenerator-dashboard':
        return (
          <IDGeneratorDashboard 
            selectedLanguage={selectedLanguage}
            user={currentUser}
            onLogout={handleLogout}
          />
        );

      case 'digital-id-registration':
        return (
          <DigitalIdRegistration 
            selectedLanguage={selectedLanguage}
            onComplete={(user) => {
              setCurrentUser(user);
              setCurrentStep('traveller-dashboard');
            }}
            onBack={() => setCurrentStep('traveller-dashboard')}
          />
        );

      default:
        return (
          <div className="min-h-screen flex items-center justify-center">
            <div className="text-center">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mx-auto mb-4"></div>
              <p>Loading ChaloSafe...</p>
            </div>
          </div>
        );
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {renderCurrentStep()}
    </div>
  );
}
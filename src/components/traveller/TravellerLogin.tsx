import React, { useState } from 'react';
import { Button } from '../ui/button';
import { Input } from '../ui/input';
import { Label } from '../ui/label';
import { Card, CardContent, CardHeader, CardTitle } from '../ui/card';
import { Language, User } from '../../App';
import { Eye, EyeOff, Loader2, ArrowLeft } from 'lucide-react';
import { getTranslation } from '../../utils/translations';
import { mockAuth } from '../../utils/mockAuth';

interface TravellerLoginProps {
  selectedLanguage: Language;
  onLogin: (user: any) => void;
  onRegister: () => void;
  onBack: () => void;
}

export function TravellerLogin({ selectedLanguage, onLogin, onRegister, onBack }: TravellerLoginProps) {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email || !password) return;
    
    setIsLoading(true);
    try {
      const { profile } = await mockAuth.signIn(email, password);
      const user: User = {
        id: profile.id,
        name: `${profile.firstName} ${profile.lastName}`,
        role: profile.role,
        digitalId: profile.digitalId,
        firstName: profile.firstName,
        lastName: profile.lastName,
        nationality: profile.nationality,
        age: profile.age,
        phone: profile.phone,
        tripDuration: profile.tripDuration,
        itinerary: profile.itinerary,
        startDate: profile.startDate,
        emergencyName: profile.emergencyName,
        emergencyPhone: profile.emergencyPhone
      };
      onLogin(user);
    } catch (error) {
      alert(`Login failed: ${error instanceof Error ? error.message : 'Unknown error'}`);
    } finally {
      setIsLoading(false);
    }
  };

  const handleForgotPassword = () => {
    // In a real app, this would send OTP to registered email/phone
    alert('Password reset functionality will be implemented. Please contact support.');
  };



  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-green-50 flex items-center justify-center p-4">
      <Card className="w-full max-w-md mx-auto">
        <CardHeader className="text-center">
          <div className="flex items-center justify-between mb-2">
            <Button variant="ghost" size="sm" onClick={onBack}>
              <ArrowLeft className="w-4 h-4 mr-2" />
              Back
            </Button>
            <div></div>
          </div>
          <CardTitle>{getTranslation('travellerLogin', selectedLanguage)}</CardTitle>
          <p className="text-gray-600">{getTranslation('welcomeBack', selectedLanguage)}</p>
        </CardHeader>
        
        <CardContent>
          <form onSubmit={handleLogin} className="space-y-4">
            <div>
              <Label htmlFor="email">Email</Label>
              <Input
                id="email"
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="Enter your email"
                required
                disabled={isLoading}
              />
            </div>
            
            <div>
              <Label htmlFor="password">{getTranslation('password', selectedLanguage)}</Label>
              <div className="relative">
                <Input
                  id="password"
                  type={showPassword ? 'text' : 'password'}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder={`${getTranslation('enterYour', selectedLanguage)} ${getTranslation('password', selectedLanguage).toLowerCase()}`}
                  required
                  disabled={isLoading}
                  className="pr-10"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-1/2 transform -translate-y-1/2"
                  disabled={isLoading}
                >
                  {showPassword ? (
                    <EyeOff className="w-4 h-4 text-gray-500" />
                  ) : (
                    <Eye className="w-4 h-4 text-gray-500" />
                  )}
                </button>
              </div>
            </div>
            
            <div className="text-right">
              <button
                type="button"
                onClick={handleForgotPassword}
                className="text-sm text-blue-600 hover:underline"
                disabled={isLoading}
              >
                {getTranslation('forgotPassword', selectedLanguage)}
              </button>
            </div>
            
            <Button
              type="submit"
              className="w-full bg-blue-600 hover:bg-blue-700"
              disabled={isLoading || !email || !password}
            >
              {isLoading ? (
                <>
                  <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                  Loading...
                </>
              ) : (
                getTranslation('login', selectedLanguage)
              )}
            </Button>
          </form>
          
          <div className="mt-4 text-center">
            <p className="text-sm text-gray-600">
              Don't have an account?{' '}
              <button
                onClick={onRegister}
                className="text-blue-600 hover:underline"
                disabled={isLoading}
              >
                Register here
              </button>
            </p>
          </div>

          <div className="mt-4 space-y-2">
            <div className="p-3 bg-blue-50 border border-blue-200 rounded-md">
              <p className="text-sm text-blue-700">
                <strong>Demo Traveller Accounts:</strong><br />
                <span className="text-xs">Click to copy credentials</span>
              </p>
              <div className="mt-2 space-y-1">
                <div 
                  className="cursor-pointer hover:bg-blue-100 p-1 rounded text-xs"
                  onClick={() => {
                    setEmail('traveller@chalosafe.com');
                    setPassword('ChaloSafe123!');
                  }}
                >
                  📧 traveller@chalosafe.com | 🔑 ChaloSafe123!
                </div>
                <div 
                  className="cursor-pointer hover:bg-blue-100 p-1 rounded text-xs"
                  onClick={() => {
                    setEmail('test@test.com');
                    setPassword('test');
                  }}
                >
                  📧 test@test.com | 🔑 test
                </div>
                <div 
                  className="cursor-pointer hover:bg-blue-100 p-1 rounded text-xs"
                  onClick={() => {
                    setEmail('demo@traveller.com');
                    setPassword('password123');
                  }}
                >
                  📧 demo@traveller.com | 🔑 password123
                </div>
              </div>
            </div>
            
            <div className="p-3 bg-green-50 border border-green-200 rounded-md">
              <p className="text-sm text-green-700">
                <strong>Note:</strong> Use the demo account above to access the app
              </p>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
import React, { useState } from 'react';
import { Button } from '../ui/button';
import { Input } from '../ui/input';
import { Card, CardContent, CardHeader, CardTitle } from '../ui/card';
import { Label } from '../ui/label';
import { Language, User } from '../../App';
import { getTranslation } from '../../utils/translations';
import { CreditCard, Eye, EyeOff, ArrowLeft } from 'lucide-react';
import { mockAuth } from '../../utils/mockAuth';

interface IDGeneratorLoginProps {
  selectedLanguage: Language;
  onLogin: (user: any) => void;
  onBack: () => void;
}

export function IDGeneratorLogin({ selectedLanguage, onLogin, onBack }: IDGeneratorLoginProps) {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
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
        lastName: profile.lastName
      };
      onLogin(user);
    } catch (error) {
      alert(`Login failed: ${error instanceof Error ? error.message : 'Unknown error'}`);
    } finally {
      setIsLoading(false);
    }
  };

  const handleDemoLogin = () => {
    setEmail('idgenerator@chalosafe.com');
    setPassword('ChaloSafe123!');
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-50 to-blue-50 flex items-center justify-center p-4">
      <Card className="w-full max-w-md mx-auto">
        <CardHeader className="text-center">
          <div className="flex items-center justify-between mb-2">
            <Button variant="ghost" size="sm" onClick={onBack}>
              <ArrowLeft className="w-4 h-4 mr-2" />
              Back
            </Button>
            <div></div>
          </div>
          <div className="bg-purple-100 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
            <CreditCard className="w-8 h-8 text-purple-600" />
          </div>
          <CardTitle>ID Generator Login</CardTitle>
          <p className="text-gray-600">Sign in to create digital IDs for travellers</p>
        </CardHeader>
        
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="email">{getTranslation('email', selectedLanguage)}</Label>
              <Input
                id="email"
                type="email"
                placeholder="Enter your email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
              />
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="password">{getTranslation('password', selectedLanguage)}</Label>
              <div className="relative">
                <Input
                  id="password"
                  type={showPassword ? 'text' : 'password'}
                  placeholder="Enter your password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                />
                <Button
                  type="button"
                  variant="ghost"
                  size="sm"
                  className="absolute right-0 top-0 h-full px-3 py-2 hover:bg-transparent"
                  onClick={() => setShowPassword(!showPassword)}
                >
                  {showPassword ? (
                    <EyeOff className="h-4 w-4" />
                  ) : (
                    <Eye className="h-4 w-4" />
                  )}
                </Button>
              </div>
            </div>
            
            <Button 
              type="submit" 
              className="w-full bg-purple-600 hover:bg-purple-700"
              disabled={isLoading}
            >
              {isLoading ? 'Signing in...' : getTranslation('signIn', selectedLanguage)}
            </Button>
          </form>
          
          <div className="mt-6 pt-4 border-t">
            <div className="p-3 bg-purple-50 border border-purple-200 rounded-md">
              <p className="text-sm text-purple-700">
                <strong>Demo ID Generator Accounts:</strong><br />
                <span className="text-xs">Click to use credentials</span>
              </p>
              <div className="mt-2 space-y-1">
                <div 
                  className="cursor-pointer hover:bg-purple-100 p-1 rounded text-xs"
                  onClick={() => {
                    setEmail('idgenerator@chalosafe.com');
                    setPassword('ChaloSafe123!');
                  }}
                >
                  🆔 idgenerator@chalosafe.com | 🔑 ChaloSafe123!
                </div>
                <div 
                  className="cursor-pointer hover:bg-purple-100 p-1 rounded text-xs"
                  onClick={() => {
                    setEmail('idgen@test.com');
                    setPassword('test');
                  }}
                >
                  🆔 idgen@test.com | 🔑 test
                </div>
              </div>
              <span className="text-xs mt-1 block opacity-75">
                ✓ Create digital IDs • ✓ QR generation • ✓ Multi-language
              </span>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
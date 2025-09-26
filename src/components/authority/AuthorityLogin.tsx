import React, { useState } from 'react';
import { Button } from '../ui/button';
import { Input } from '../ui/input';
import { Label } from '../ui/label';
import { Card, CardContent, CardHeader, CardTitle } from '../ui/card';
import { Language } from '../../App';
import { Shield, Eye, EyeOff, Loader2 } from 'lucide-react';

interface AuthorityLoginProps {
  onLogin: (email: string, password: string) => void;
  language: Language;
}

export function AuthorityLogin({ onLogin, language }: AuthorityLoginProps) {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email || !password) return;
    
    setIsLoading(true);
    try {
      await onLogin(email, password);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-green-50 to-blue-50 flex items-center justify-center p-4">
      <Card className="w-full max-w-md mx-auto">
        <CardHeader className="text-center">
          <div className="mb-4 flex justify-center">
            <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center">
              <Shield className="w-8 h-8 text-green-600" />
            </div>
          </div>
          <CardTitle>Authority Login</CardTitle>
          <p className="text-gray-600">Police & Tourism Official Access</p>
        </CardHeader>
        
        <CardContent>
          <form onSubmit={handleLogin} className="space-y-4">
            <div>
              <Label htmlFor="email">Official Email</Label>
              <Input
                id="email"
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="Enter your official email"
                required
                disabled={isLoading}
              />
            </div>
            
            <div>
              <Label htmlFor="password">Password</Label>
              <div className="relative">
                <Input
                  id="password"
                  type={showPassword ? 'text' : 'password'}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="Enter your password"
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
            
            <Button
              type="submit"
              className="w-full bg-green-600 hover:bg-green-700"
              disabled={isLoading || !email || !password}
            >
              {isLoading ? (
                <>
                  <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                  Loading...
                </>
              ) : (
                'Login to Dashboard'
              )}
            </Button>
          </form>
          
          <div className="mt-6 text-center">
            <p className="text-xs text-gray-500">
              Official access only. Unauthorized access is prohibited.
            </p>
          </div>

          <div className="mt-4 p-3 bg-green-50 border border-green-200 rounded-md">
            <p className="text-sm text-green-700">
              <strong>Demo Authority Accounts:</strong><br />
              <span className="text-xs">Click to use credentials</span>
            </p>
            <div className="mt-2 space-y-1">
              <div 
                className="cursor-pointer hover:bg-green-100 p-1 rounded text-xs"
                onClick={() => {
                  setEmail('authority@chalosafe.com');
                  setPassword('ChaloSafe123!');
                }}
              >
                🚨 authority@chalosafe.com | 🔑 ChaloSafe123!
              </div>
              <div 
                className="cursor-pointer hover:bg-green-100 p-1 rounded text-xs"
                onClick={() => {
                  setEmail('authority@test.com');
                  setPassword('test');
                }}
              >
                🚨 authority@test.com | 🔑 test
              </div>
              <div 
                className="cursor-pointer hover:bg-green-100 p-1 rounded text-xs"
                onClick={() => {
                  setEmail('authority@demo.com');
                  setPassword('authority123');
                }}
              >
                🚨 authority@demo.com | 🔑 authority123
              </div>
            </div>
            <span className="text-xs mt-1 block opacity-75">
              ✓ Works offline • ✓ Authority dashboard • ✓ SOS management
            </span>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
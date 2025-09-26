import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from './ui/card';
import { Badge } from './ui/badge';
import { User, Mail, Key } from 'lucide-react';

const demoAccounts = [
  {
    email: 'traveller@chalosafe.com',
    password: 'ChaloSafe123!',
    role: 'Traveller',
    description: 'Main demo traveller account'
  },
  {
    email: 'idgenerator@chalosafe.com',
    password: 'ChaloSafe123!',
    role: 'ID Generator',
    description: 'Main demo ID generator account'
  },
  {
    email: 'test@test.com',
    password: 'test',
    role: 'Traveller',
    description: 'Simple test account'
  },
  {
    email: 'idgen@test.com',
    password: 'test',
    role: 'ID Generator',
    description: 'Simple test ID generator'
  }
];

interface DemoAccountsHelperProps {
  onAccountSelect?: (email: string, password: string) => void;
  filterRole?: string;
}

export function DemoAccountsHelper({ onAccountSelect, filterRole }: DemoAccountsHelperProps) {
  const filteredAccounts = filterRole 
    ? demoAccounts.filter(account => account.role.toLowerCase() === filterRole.toLowerCase())
    : demoAccounts;

  const handleCopyCredentials = (email: string, password: string) => {
    navigator.clipboard.writeText(`Email: ${email}\nPassword: ${password}`);
  };

  return (
    <Card className="w-full max-w-2xl mx-auto">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <User className="w-5 h-5" />
          Demo Accounts {filterRole && `- ${filterRole}`}
        </CardTitle>
        <p className="text-sm text-gray-600">
          Use these demo accounts to test the application
        </p>
      </CardHeader>
      <CardContent className="space-y-3">
        {filteredAccounts.map((account, index) => (
          <div
            key={index}
            className="p-4 border rounded-lg hover:bg-gray-50 transition-colors cursor-pointer"
            onClick={() => {
              if (onAccountSelect) {
                onAccountSelect(account.email, account.password);
              } else {
                handleCopyCredentials(account.email, account.password);
              }
            }}
          >
            <div className="flex items-center justify-between mb-2">
              <div className="flex items-center gap-2">
                <Badge variant="outline">{account.role}</Badge>
                <span className="text-sm text-gray-500">{account.description}</span>
              </div>
            </div>
            <div className="space-y-1">
              <div className="flex items-center gap-2 text-sm">
                <Mail className="w-4 h-4 text-gray-400" />
                <code className="bg-gray-100 px-2 py-1 rounded text-xs">
                  {account.email}
                </code>
              </div>
              <div className="flex items-center gap-2 text-sm">
                <Key className="w-4 h-4 text-gray-400" />
                <code className="bg-gray-100 px-2 py-1 rounded text-xs">
                  {account.password}
                </code>
              </div>
            </div>
            <p className="text-xs text-gray-500 mt-2">
              {onAccountSelect ? 'Click to use this account' : 'Click to copy credentials'}
            </p>
          </div>
        ))}
      </CardContent>
    </Card>
  );
}
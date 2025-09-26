import { User, UserRole } from '../App';

export interface SafetyAlert {
  id: string;
  message: string;
  level: 'low' | 'moderate' | 'high';
  timestamp: string;
  acknowledged: boolean;
  type: 'weather' | 'security' | 'system' | 'emergency';
  recommendations?: string[];
  location?: {
    latitude: number;
    longitude: number;
  };
}





export interface RegistrationData {
  firstName: string;
  lastName: string;
  nationality: string;
  age: string;
  phone: string;
  tripDuration: string;
  itinerary: string;
  startDate: string;
  emergencyName: string;
  emergencyPhone: string;
  email: string;
  password: string;
  role: UserRole;
  aadhaarNumber?: string;
  aadhaarDetails?: any;
}

export interface AuthProfile {
  id: string;
  firstName: string;
  lastName: string;
  role: UserRole;
  digitalId?: string;
  nationality?: string;
  age?: string;
  phone?: string;
  tripDuration?: string;
  itinerary?: string;
  startDate?: string;
  emergencyName?: string;
  emergencyPhone?: string;
  email?: string;
}

class MockAuthService {
  private storageKey = 'chalosafe_user';
  private usersKey = 'chalosafe_users';

  // Mock users for demo
  private defaultUsers = [
    {
      id: 'demo-traveller-main',
      email: 'traveller@chalosafe.com',
      password: 'ChaloSafe123!',
      firstName: 'Demo',
      lastName: 'Traveller',
      role: 'traveller' as UserRole,
      digitalId: 'CHS-TR-001',
      nationality: 'Indian',
      age: '25',
      phone: '+91 9876543210',
      tripDuration: '7 days',
      itinerary: 'Delhi -> Goa -> Mumbai',
      startDate: '2024-01-15',
      emergencyName: 'John Doe',
      emergencyPhone: '+91 9876543211'
    },

    {
      id: 'demo-traveller-1',
      email: 'demo@traveller.com',
      password: 'password123',
      firstName: 'Test',
      lastName: 'Traveller',
      role: 'traveller' as UserRole,
      digitalId: 'CHS-TR-002',
      nationality: 'Indian',
      age: '25',
      phone: '+91 9876543210',
      tripDuration: '7 days',
      itinerary: 'Delhi -> Goa -> Mumbai',
      startDate: '2024-01-15',
      emergencyName: 'John Doe',
      emergencyPhone: '+91 9876543211'
    },

    // Additional demo accounts
    {
      id: 'demo-traveller-2',
      email: 'traveller@demo.com',
      password: 'demo123',
      firstName: 'Test',
      lastName: 'User',
      role: 'traveller' as UserRole,
      digitalId: 'CHS-TR-003',
      nationality: 'Indian',
      age: '30',
      phone: '+91 9876543212',
      tripDuration: '5 days',
      itinerary: 'Mumbai -> Bangalore -> Chennai',
      startDate: '2024-02-01',
      emergencyName: 'Jane Doe',
      emergencyPhone: '+91 9876543213'
    },
    {
      id: 'demo-idgenerator-main',
      email: 'idgenerator@chalosafe.com',
      password: 'ChaloSafe123!',
      firstName: 'Demo',
      lastName: 'ID Generator',
      role: 'idgenerator' as UserRole,
      digitalId: 'CHS-IDG-001'
    },
    // Additional easy-to-remember demo accounts
    {
      id: 'test-traveller',
      email: 'test@test.com',
      password: 'test',
      firstName: 'Test',
      lastName: 'Traveller',
      role: 'traveller' as UserRole,
      digitalId: 'CHS-TR-TEST',
      nationality: 'Indian',
      age: '28',
      phone: '+91 9999999999',
      tripDuration: '3 days',
      itinerary: 'Delhi -> Agra -> Delhi',
      startDate: '2024-12-01',
      emergencyName: 'Test Contact',
      emergencyPhone: '+91 8888888888'
    },

    {
      id: 'test-idgen',
      email: 'idgen@test.com',
      password: 'test',
      firstName: 'Test',
      lastName: 'Generator',
      role: 'idgenerator' as UserRole,
      digitalId: 'CHS-IDG-TEST'
    }
  ];

  constructor() {
    // Only initialize if no users exist to preserve manually created accounts
    const existingUsers = this.getStoredUsers();
    if (existingUsers.length === 0) {
      localStorage.setItem(this.usersKey, JSON.stringify(this.defaultUsers));
    } else {
      // Ensure demo users are always available by merging with existing users
      const userEmails = new Set(existingUsers.map(u => u.email));
      const newDemoUsers = this.defaultUsers.filter(user => !userEmails.has(user.email));
      if (newDemoUsers.length > 0) {
        const allUsers = [...existingUsers, ...newDemoUsers];
        localStorage.setItem(this.usersKey, JSON.stringify(allUsers));
      }
    }
  }

  private getStoredUsers(): any[] {
    try {
      const users = localStorage.getItem(this.usersKey);
      return users ? JSON.parse(users) : [];
    } catch {
      return [];
    }
  }

  private saveUser(user: any) {
    const users = this.getStoredUsers();
    const existingIndex = users.findIndex(u => u.id === user.id);
    
    if (existingIndex >= 0) {
      users[existingIndex] = user;
    } else {
      users.push(user);
    }
    
    localStorage.setItem(this.usersKey, JSON.stringify(users));
  }

  isAuthenticated(): boolean {
    return localStorage.getItem(this.storageKey) !== null;
  }

  getCurrentProfile(): AuthProfile | null {
    try {
      const user = localStorage.getItem(this.storageKey);
      return user ? JSON.parse(user) : null;
    } catch {
      return null;
    }
  }

  async signIn(email: string, password: string): Promise<{ profile: AuthProfile }> {
    const users = this.getStoredUsers();
    console.log('Available users:', users.map(u => ({ email: u.email, role: u.role })));
    console.log('Attempting login with:', { email, passwordLength: password.length });
    
    const user = users.find(u => u.email === email && u.password === password);
    
    if (!user) {
      // Check if email exists with wrong password
      const emailExists = users.find(u => u.email === email);
      if (emailExists) {
        throw new Error('Invalid password');
      } else {
        throw new Error('Account not found or invalid credentials');
      }
    }

    const profile: AuthProfile = {
      id: user.id,
      firstName: user.firstName,
      lastName: user.lastName,
      role: user.role,
      digitalId: user.digitalId,
      nationality: user.nationality,
      age: user.age,
      phone: user.phone,
      tripDuration: user.tripDuration,
      itinerary: user.itinerary,
      startDate: user.startDate,
      emergencyName: user.emergencyName,
      emergencyPhone: user.emergencyPhone,
      email: user.email
    };

    localStorage.setItem(this.storageKey, JSON.stringify(profile));
    return { profile };
  }

  async signUp(data: RegistrationData): Promise<{ 
    user: { id: string; digitalId: string }; 
    aadhaarVerification?: { isValid: boolean } 
  }> {
    const users = this.getStoredUsers();
    const existingUser = users.find(u => u.email === data.email);
    
    if (existingUser) {
      throw new Error('User with this email already exists');
    }

    const newUser = {
      id: `user-${Date.now()}`,
      email: data.email,
      password: data.password,
      firstName: data.firstName,
      lastName: data.lastName,
      role: data.role,
      digitalId: `CHS-${data.role.toUpperCase()}-${Date.now()}`,
      nationality: data.nationality,
      age: data.age,
      phone: data.phone,
      tripDuration: data.tripDuration,
      itinerary: data.itinerary,
      startDate: data.startDate,
      emergencyName: data.emergencyName,
      emergencyPhone: data.emergencyPhone
    };

    this.saveUser(newUser);

    const profile: AuthProfile = {
      id: newUser.id,
      firstName: newUser.firstName,
      lastName: newUser.lastName,
      role: newUser.role,
      digitalId: newUser.digitalId,
      nationality: newUser.nationality,
      age: newUser.age,
      phone: newUser.phone,
      tripDuration: newUser.tripDuration,
      itinerary: newUser.itinerary,
      startDate: newUser.startDate,
      emergencyName: newUser.emergencyName,
      emergencyPhone: newUser.emergencyPhone,
      email: newUser.email
    };

    localStorage.setItem(this.storageKey, JSON.stringify(profile));

    return {
      user: {
        id: newUser.id,
        digitalId: newUser.digitalId
      },
      aadhaarVerification: data.aadhaarNumber ? { isValid: true } : undefined
    };
  }

  async googleLogin(googleToken: string, role: UserRole): Promise<{ user: { id: string; digitalId: string } }> {
    // Mock Google login - in real implementation this would verify the token
    const userData = {
      id: `google-${Date.now()}`,
      digitalId: `CHS-${role.toUpperCase()}-${Date.now()}`,
      role: role
    };

    // For demo purposes, create a mock profile
    const profile: AuthProfile = {
      id: userData.id,
      firstName: 'Google',
      lastName: 'User',
      role: userData.role,
      digitalId: userData.digitalId,
      email: 'google.user@example.com'
    };

    localStorage.setItem(this.storageKey, JSON.stringify(profile));

    return {
      user: userData
    };
  }

  async signOut(): Promise<void> {
    localStorage.removeItem(this.storageKey);
  }

  startLocationTracking(interval: number = 30000): number {
    // Mock location tracking with optimized performance
    const trackingInterval = setInterval(() => {
      if (navigator.geolocation) {
        navigator.geolocation.getCurrentPosition(
          (position) => {
            try {
              const locationData = {
                latitude: position.coords.latitude,
                longitude: position.coords.longitude,
                timestamp: new Date().toISOString()
              };
              
              // Store location data locally with error handling
              const locationsStr = localStorage.getItem('chalosafe_locations');
              const locations = locationsStr ? JSON.parse(locationsStr) : [];
              locations.push(locationData);
              
              // Keep only last 50 locations to prevent storage bloat
              if (locations.length > 50) {
                locations.splice(0, locations.length - 50);
              }
              
              localStorage.setItem('chalosafe_locations', JSON.stringify(locations));
            } catch (error) {
              console.warn('Failed to store location data:', error);
            }
          },
          (error) => {
            console.warn('Location tracking error:', error);
          },
          {
            timeout: 10000, // Add timeout to prevent hanging
            maximumAge: 300000, // Use cached position if available
            enableHighAccuracy: false // Use less accurate but faster positioning
          }
        );
      }
    }, interval);

    return trackingInterval;
  }

  async getSafetyInsights(): Promise<{ safetyScore: number; recommendations: string[] }> {
    // Mock safety insights
    return {
      safetyScore: Math.floor(Math.random() * 30) + 70, // Random score between 70-100
      recommendations: [
        'Share your location with trusted contacts',
        'Stay in well-populated areas',
        'Keep emergency contacts updated',
        'Avoid traveling alone at night',
        'Keep your phone charged',
        'Register with local authorities'
      ]
    };
  }

  async getUserAlerts(): Promise<SafetyAlert[]> {
    // Mock safety alerts
    const mockAlerts: SafetyAlert[] = [
      {
        id: 'alert-1',
        message: 'Weather advisory: Heavy rain expected in your area',
        level: 'moderate',
        timestamp: new Date(Date.now() - 2 * 60 * 60 * 1000).toISOString(),
        acknowledged: false,
        type: 'weather'
      },
      {
        id: 'alert-2',
        message: 'Safety advisory: Avoid downtown area due to protests',
        level: 'high',
        timestamp: new Date(Date.now() - 6 * 60 * 60 * 1000).toISOString(),
        acknowledged: false,
        type: 'security'
      },
      {
        id: 'alert-3',
        message: 'Your safety score has improved to 85%',
        level: 'low',
        timestamp: new Date(Date.now() - 24 * 60 * 60 * 1000).toISOString(),
        acknowledged: true,
        type: 'system'
      }
    ];
    
    return mockAlerts;
  }

  async acknowledgeAlert(alertId: string): Promise<void> {
    // Mock alert acknowledgment
    const alerts = JSON.parse(localStorage.getItem('chalosafe_alerts') || '[]');
    const updatedAlerts = alerts.map((alert: any) => 
      alert.id === alertId ? { ...alert, acknowledged: true } : alert
    );
    localStorage.setItem('chalosafe_alerts', JSON.stringify(updatedAlerts));
  }

  async getCurrentLocation(): Promise<{ latitude: number; longitude: number }> {
    return new Promise((resolve, reject) => {
      // Add timeout to prevent hanging
      const timeoutId = setTimeout(() => {
        resolve({
          latitude: 28.6139, // Delhi coordinates as fallback
          longitude: 77.2090
        });
      }, 5000);

      if (navigator.geolocation) {
        navigator.geolocation.getCurrentPosition(
          (position) => {
            clearTimeout(timeoutId);
            resolve({
              latitude: position.coords.latitude,
              longitude: position.coords.longitude
            });
          },
          (error) => {
            clearTimeout(timeoutId);
            // Return mock location if geolocation fails
            resolve({
              latitude: 28.6139, // Delhi coordinates as fallback
              longitude: 77.2090
            });
          },
          {
            timeout: 4000,
            maximumAge: 300000,
            enableHighAccuracy: false
          }
        );
      } else {
        clearTimeout(timeoutId);
        // Return mock location if geolocation not supported
        resolve({
          latitude: 28.6139,
          longitude: 77.2090
        });
      }
    });
  }

  async sendEmergencyAlert(alertData: {
    latitude: number;
    longitude: number;
    message: string;
    type: string;
    severity: string;
  }): Promise<void> {
    // Mock emergency alert
    const emergencyAlert = {
      id: `emergency-${Date.now()}`,
      ...alertData,
      timestamp: new Date().toISOString(),
      status: 'sent'
    };
    
    const alerts = JSON.parse(localStorage.getItem('chalosafe_emergency_alerts') || '[]');
    alerts.push(emergencyAlert);
    localStorage.setItem('chalosafe_emergency_alerts', JSON.stringify(alerts));
    
    console.log('Emergency alert sent:', emergencyAlert);
  }









  // Debug utility to list all available accounts
  listAvailableAccounts(): Array<{email: string, role: string}> {
    const users = this.getStoredUsers();
    return users.map(user => ({
      email: user.email,
      role: user.role
    }));
  }

  // Force reset to demo accounts (for testing)
  resetToDemoAccounts(): void {
    localStorage.setItem(this.usersKey, JSON.stringify(this.defaultUsers));
    console.log('Reset to demo accounts. Available accounts:', this.listAvailableAccounts());
  }
}

export const mockAuth = new MockAuthService();
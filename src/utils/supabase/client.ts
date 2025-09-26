import { createClient } from '@supabase/supabase-js';
import { projectId, publicAnonKey } from './info';

// Create Supabase client
export const supabase = createClient(
  `https://${projectId}.supabase.co`,
  publicAnonKey
);

// API Base URL
const API_BASE_URL = `https://${projectId}.supabase.co/functions/v1/make-server-abf68645`;

// User registration data interface
export interface UserRegistrationData {
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
  role?: 'traveller' | 'authority';
  aadhaarNumber?: string;
  aadhaarDetails?: {
    dateOfBirth?: string;
    gender?: string;
    address?: string;
  };
}

// Aadhaar verification interface
export interface AadhaarVerificationData {
  aadhaarNumber: string;
  personalDetails: {
    name: string;
    dateOfBirth?: string;
    gender?: string;
    address?: string;
  };
}

// Safety alert interface
export interface SafetyAlert {
  id: string;
  userId: string;
  type: string;
  alertLevel: 'safe' | 'moderate' | 'high';
  location: LocationData;
  message: string;
  recommendations?: string[];
  timestamp: string;
  acknowledged: boolean;
}

// Authority notification interface
export interface AuthorityNotification {
  id: string;
  authorityId: string;
  sosId?: string;
  type: string;
  title: string;
  message: string;
  location?: LocationData;
  userProfile?: any;
  timestamp: string;
  isRead: boolean;
  priority?: string;
}

// Location data interface
export interface LocationData {
  latitude: number;
  longitude: number;
  timestamp?: string;
  accuracy?: number;
}

// Safety zone interface
export interface SafetyZone {
  id: string;
  name: string;
  type: 'safe' | 'danger' | 'caution';
  coordinates: {
    latitude: number;
    longitude: number;
  };
  radius: number;
  description?: string;
  createdBy: string;
  createdAt: string;
  isActive: boolean;
}

// Emergency data interface
export interface EmergencyData {
  latitude: number;
  longitude: number;
  message?: string;
  type?: string;
  severity?: 'low' | 'moderate' | 'high' | 'critical';
}

class ChaloSafeAPI {
  private getAuthHeader(): string {
    const session = localStorage.getItem('chalosafe_session');
    if (session) {
      const parsed = JSON.parse(session);
      return `Bearer ${parsed.access_token}`;
    }
    return `Bearer ${publicAnonKey}`;
  }

  private async makeRequest(endpoint: string, options: RequestInit = {}) {
    const url = `${API_BASE_URL}${endpoint}`;
    const headers = {
      'Content-Type': 'application/json',
      'Authorization': this.getAuthHeader(),
      ...options.headers,
    };

    try {
      const response = await fetch(url, {
        ...options,
        headers,
      });

      // Handle empty responses
      const responseText = await response.text();
      let data;
      
      if (responseText) {
        try {
          data = JSON.parse(responseText);
        } catch (parseError) {
          console.error('JSON Parse Error:', parseError, 'Response:', responseText);
          throw new Error(`Invalid JSON response: ${responseText.substring(0, 100)}`);
        }
      } else {
        data = {};
      }

      if (!response.ok) {
        console.error(`API Error: ${endpoint}`, data);
        throw new Error(data.error || `HTTP ${response.status}: ${response.statusText}`);
      }

      return data;
    } catch (error) {
      if (error instanceof TypeError && error.message.includes('fetch')) {
        throw new Error('Network error - please check your internet connection');
      }
      throw error;
    }
  }

  // Authentication methods
  async signUp(userData: UserRegistrationData) {
    try {
      const response = await this.makeRequest('/signup', {
        method: 'POST',
        body: JSON.stringify(userData),
      });
      
      console.log('User registered successfully:', response);
      return response;
    } catch (error) {
      console.error('Registration error:', error);
      throw error;
    }
  }

  async signIn(email: string, password: string) {
    try {
      // Demo user credentials - bypass API for demo
      if (email === 'traveller@chalosafe.com' && password === 'ChaloSafe123!') {
        const mockUser = {
          id: 'demo_user_1',
          email: email,
          firstName: 'Demo',
          lastName: 'Traveller',
          role: 'traveller',
          digitalId: 'DT-DEMO123',
          nationality: 'Indian',
          age: '28',
          phone: '+91-9876543210',
          tripDuration: '7 days',
          itinerary: 'Bangalore, Mysore, Coorg',
          startDate: '2025-01-01',
          emergencyName: 'Emergency Contact',
          emergencyPhone: '+91-9876543211'
        };

        const mockSession = {
          access_token: `demo_${mockUser.id}`,
          refresh_token: 'demo_refresh',
          expires_in: 3600,
          token_type: 'bearer'
        };

        localStorage.setItem('chalosafe_session', JSON.stringify(mockSession));
        localStorage.setItem('chalosafe_user', JSON.stringify(mockUser));
        localStorage.setItem('chalosafe_profile', JSON.stringify(mockUser));

        console.log('Login successful (demo mode):', mockUser);
        return {
          user: mockUser,
          profile: mockUser,
          session: mockSession
        };
      }

      // Authority demo credentials
      if (email === 'authority@chalosafe.com' && password === 'ChaloSafe123!') {
        const mockUser = {
          id: 'demo_authority_1',
          email: email,
          firstName: 'Demo',
          lastName: 'Authority',
          role: 'authority',
          badge: 'AUTH-DEMO123',
          department: 'Tourist Safety'
        };

        const mockSession = {
          access_token: `demo_${mockUser.id}`,
          refresh_token: 'demo_refresh',
          expires_in: 3600,
          token_type: 'bearer'
        };

        localStorage.setItem('chalosafe_session', JSON.stringify(mockSession));
        localStorage.setItem('chalosafe_user', JSON.stringify(mockUser));
        localStorage.setItem('chalosafe_profile', JSON.stringify(mockUser));

        console.log('Authority login successful (demo mode):', mockUser);
        return {
          user: mockUser,
          profile: mockUser,
          session: mockSession
        };
      }

      // Real API call for other credentials
      const response = await this.makeRequest('/login', {
        method: 'POST',
        body: JSON.stringify({ email, password }),
      });

      // Store session data
      if (response.session) {
        localStorage.setItem('chalosafe_session', JSON.stringify(response.session));
        localStorage.setItem('chalosafe_user', JSON.stringify(response.user));
        localStorage.setItem('chalosafe_profile', JSON.stringify(response.profile));
      }

      console.log('Login successful:', response);
      return response;
    } catch (error) {
      console.error('Login error:', error);
      
      // If it's a demo credential but API failed, provide helpful message
      if (email === 'traveller@chalosafe.com' || email === 'authority@chalosafe.com') {
        throw new Error('Demo login failed - using offline mode');
      }
      
      throw error;
    }
  }

  async signOut() {
    try {
      await supabase.auth.signOut();
      localStorage.removeItem('chalosafe_session');
      localStorage.removeItem('chalosafe_user');
      localStorage.removeItem('chalosafe_profile');
      console.log('Logout successful');
    } catch (error) {
      console.error('Logout error:', error);
      throw error;
    }
  }

  // Profile methods
  async getProfile() {
    try {
      const response = await this.makeRequest('/profile');
      return response.profile;
    } catch (error) {
      console.error('Profile fetch error:', error);
      throw error;
    }
  }

  async updateProfile(profileData: Partial<UserRegistrationData>) {
    try {
      const response = await this.makeRequest('/profile', {
        method: 'PUT',
        body: JSON.stringify(profileData),
      });
      
      // Update local storage
      localStorage.setItem('chalosafe_profile', JSON.stringify(response.profile));
      
      console.log('Profile updated successfully:', response);
      return response;
    } catch (error) {
      console.error('Profile update error:', error);
      throw error;
    }
  }

  // Location methods
  async updateLocation(locationData: LocationData) {
    try {
      const response = await this.makeRequest('/location', {
        method: 'POST',
        body: JSON.stringify(locationData),
      });
      
      console.log('Location updated:', response);
      return response;
    } catch (error) {
      console.error('Location update error:', error);
      throw error;
    }
  }

  // Safety methods
  async getSafetyZones() {
    try {
      const response = await this.makeRequest('/safety-zones');
      return response.safetyZones;
    } catch (error) {
      console.error('Safety zones fetch error:', error);
      throw error;
    }
  }

  async createSafetyZone(zoneData: Omit<SafetyZone, 'id' | 'createdBy' | 'createdAt'>) {
    try {
      const response = await this.makeRequest('/safety-zones', {
        method: 'POST',
        body: JSON.stringify(zoneData),
      });
      
      console.log('Safety zone created:', response);
      return response;
    } catch (error) {
      console.error('Safety zone creation error:', error);
      throw error;
    }
  }

  // Emergency methods
  async sendEmergencyAlert(emergencyData: EmergencyData) {
    try {
      const response = await this.makeRequest('/emergency', {
        method: 'POST',
        body: JSON.stringify(emergencyData),
      });
      
      console.log('Emergency alert sent:', response);
      return response;
    } catch (error) {
      console.error('Emergency alert error:', error);
      throw error;
    }
  }

  async getEmergencyContacts() {
    try {
      const response = await this.makeRequest('/emergency-contacts');
      return response.emergencyContacts;
    } catch (error) {
      console.error('Emergency contacts fetch error:', error);
      throw error;
    }
  }

  // Recommendations methods
  async getRecommendations(category?: string, latitude?: number, longitude?: number) {
    try {
      const params = new URLSearchParams();
      if (category) params.append('category', category);
      if (latitude) params.append('latitude', latitude.toString());
      if (longitude) params.append('longitude', longitude.toString());
      
      const queryString = params.toString();
      const endpoint = `/recommendations${queryString ? `?${queryString}` : ''}`;
      
      const response = await this.makeRequest(endpoint);
      return response.recommendations;
    } catch (error) {
      console.error('Recommendations fetch error:', error);
      throw error;
    }
  }

  // Utility methods
  getCurrentUser() {
    const userStr = localStorage.getItem('chalosafe_user');
    return userStr ? JSON.parse(userStr) : null;
  }

  getCurrentProfile() {
    const profileStr = localStorage.getItem('chalosafe_profile');
    return profileStr ? JSON.parse(profileStr) : null;
  }

  isAuthenticated() {
    return !!localStorage.getItem('chalosafe_session');
  }

  // Location utilities
  async getCurrentLocation(): Promise<LocationData> {
    return new Promise((resolve, reject) => {
      if (!navigator.geolocation) {
        reject(new Error('Geolocation is not supported by this browser'));
        return;
      }

      navigator.geolocation.getCurrentPosition(
        (position) => {
          resolve({
            latitude: position.coords.latitude,
            longitude: position.coords.longitude,
            accuracy: position.coords.accuracy,
            timestamp: new Date().toISOString(),
          });
        },
        (error) => {
          console.error('Geolocation error:', error);
          reject(error);
        },
        {
          enableHighAccuracy: true,
          timeout: 10000,
          maximumAge: 300000, // 5 minutes
        }
      );
    });
  }

  // Start location tracking
  startLocationTracking(intervalMs: number = 30000) {
    return setInterval(async () => {
      try {
        if (this.isAuthenticated()) {
          const location = await this.getCurrentLocation();
          await this.updateLocation(location);
        }
      } catch (error) {
        console.error('Location tracking error:', error);
      }
    }, intervalMs);
  }

  // Google OAuth Login
  async googleLogin(googleToken: string, role: 'traveller' | 'authority' = 'traveller') {
    try {
      // For demo purposes, create a mock user when backend is not available
      if (googleToken.includes('demo') || googleToken.includes('google_token_')) {
        const mockUser = {
          id: `google_user_${Date.now()}`,
          email: 'demo.user@gmail.com',
          name: 'Demo Google User',
          firstName: 'Demo',
          lastName: 'User',
          role: role,
          digitalId: `GT-${Math.random().toString(36).substr(2, 8).toUpperCase()}`
        };

        const mockSession = {
          access_token: `google_${mockUser.id}`,
          refresh_token: 'google_refresh',
          expires_in: 3600,
          token_type: 'bearer'
        };

        localStorage.setItem('chalosafe_session', JSON.stringify(mockSession));
        localStorage.setItem('chalosafe_user', JSON.stringify(mockUser));
        localStorage.setItem('chalosafe_profile', JSON.stringify(mockUser));

        console.log('Google login successful (demo mode):', mockUser);
        return {
          user: mockUser,
          profile: mockUser,
          session: mockSession
        };
      }

      // Real API call for production
      const response = await this.makeRequest('/google-login', {
        method: 'POST',
        body: JSON.stringify({ googleToken, role }),
      });

      // Store session data if successful
      if (response.user) {
        const session = response.session || {
          access_token: `google_${response.user.id}`,
          refresh_token: 'google_refresh',
          expires_in: 3600,
          token_type: 'bearer'
        };

        localStorage.setItem('chalosafe_session', JSON.stringify(session));
        localStorage.setItem('chalosafe_user', JSON.stringify(response.user));
        localStorage.setItem('chalosafe_profile', JSON.stringify(response.profile || response.user));
      }

      console.log('Google login successful:', response);
      return response;
    } catch (error) {
      console.error('Google login error:', error);
      throw error;
    }
  }

  // Aadhaar Verification
  async verifyAadhaar(verificationData: AadhaarVerificationData) {
    try {
      const response = await this.makeRequest('/verify-aadhaar', {
        method: 'POST',
        body: JSON.stringify(verificationData),
      });

      console.log('Aadhaar verification result:', response);
      return response;
    } catch (error) {
      console.error('Aadhaar verification error:', error);
      throw error;
    }
  }

  // Get User Alerts and Notifications
  async getUserAlerts() {
    try {
      const response = await this.makeRequest('/user/alerts');
      return response.alerts || [];
    } catch (error) {
      console.error('User alerts fetch error:', error);
      return []; // Return empty array instead of throwing
    }
  }

  // Acknowledge Safety Alert
  async acknowledgeAlert(alertId: string) {
    try {
      const response = await this.makeRequest(`/user/alerts/${alertId}/acknowledge`, {
        method: 'PUT',
      });

      console.log('Alert acknowledged:', response);
      return response;
    } catch (error) {
      console.error('Alert acknowledge error:', error);
      throw error;
    }
  }

  // Authority Methods (Simplified)
  
  // Get Authority Notifications (Mock for demo)
  async getAuthorityNotifications() {
    try {
      // Return mock notifications for demo
      return [
        {
          id: 'notif-1',
          title: 'Emergency SOS Alert',
          message: 'Emergency SOS from John Doe (DT-12345)',
          timestamp: new Date().toISOString(),
          isRead: false,
          priority: 'high'
        }
      ];
    } catch (error) {
      console.error('Authority notifications fetch error:', error);
      return [];
    }
  }

  // Mark Authority Notification as Read (Mock)
  async markNotificationAsRead(notificationId: string) {
    try {
      console.log('Notification marked as read:', notificationId);
      return { message: 'Notification marked as read' };
    } catch (error) {
      console.error('Mark notification read error:', error);
      throw error;
    }
  }

  // Get Active SOS Alerts (Mock for demo)
  async getSOSAlerts() {
    try {
      // Return mock SOS alerts for demo
      return [
        {
          id: 'sos-1',
          userProfile: {
            firstName: 'John',
            lastName: 'Doe',
            digitalId: 'DT-12345',
            phone: '+91-9876543210'
          },
          location: {
            latitude: 12.9716,
            longitude: 77.5946
          },
          message: 'Emergency SOS activated',
          status: 'active',
          timestamp: new Date().toISOString(),
          priority: 'high'
        }
      ];
    } catch (error) {
      console.error('SOS alerts fetch error:', error);
      return [];
    }
  }

  // Respond to SOS Alert (Mock)
  async respondToSOS(sosId: string, responseData: { 
    response?: string; 
    estimatedArrival?: string; 
    status?: string 
  }) {
    try {
      console.log('SOS response sent:', sosId, responseData);
      return { 
        message: 'Response sent successfully',
        sosId,
        responseData
      };
    } catch (error) {
      console.error('SOS response error:', error);
      throw error;
    }
  }

  // Enhanced Emergency with Real-time Authority Notification
  async sendEnhancedEmergencyAlert(emergencyData: EmergencyData & { 
    autoLocation?: boolean;
    contactEmergencyServices?: boolean;
  }) {
    try {
      let locationData = emergencyData;

      // Auto-get location if requested
      if (emergencyData.autoLocation) {
        try {
          const currentLocation = await this.getCurrentLocation();
          locationData = {
            ...emergencyData,
            latitude: currentLocation.latitude,
            longitude: currentLocation.longitude
          };
        } catch (locationError) {
          console.warn('Could not get current location for emergency:', locationError);
        }
      }

      const response = await this.makeRequest('/emergency', {
        method: 'POST',
        body: JSON.stringify(locationData),
      });

      console.log('Enhanced emergency alert sent:', response);
      return response;
    } catch (error) {
      console.error('Enhanced emergency alert error:', error);
      throw error;
    }
  }

  // Send regular emergency alert
  async sendEmergencyAlert(emergencyData: EmergencyData) {
    return this.sendEnhancedEmergencyAlert(emergencyData);
  }

  // Get User's Safety Score and AI Insights
  async getSafetyInsights() {
    try {
      const profile = await this.getProfile();
      const alerts = await this.getUserAlerts();
      
      return {
        safetyScore: profile.safetyScore || 100,
        recentAlerts: alerts.filter((alert: any) => {
          const alertTime = new Date(alert.timestamp);
          const dayAgo = new Date(Date.now() - 24 * 60 * 60 * 1000);
          return alertTime > dayAgo;
        }),
        recommendations: this.generateSafetyRecommendations(profile.safetyScore || 100)
      };
    } catch (error) {
      console.error('Safety insights error:', error);
      throw error;
    }
  }

  // Generate Safety Recommendations
  private generateSafetyRecommendations(safetyScore: number): string[] {
    const recommendations = [];
    
    if (safetyScore < 30) {
      recommendations.push('Your safety score is critically low. Consider traveling in groups.');
      recommendations.push('Avoid isolated areas and stay in well-populated locations.');
      recommendations.push('Keep emergency contacts updated and check in regularly.');
    } else if (safetyScore < 60) {
      recommendations.push('Your safety score needs improvement. Be more cautious with location choices.');
      recommendations.push('Share your location with trusted contacts more frequently.');
      recommendations.push('Consider using guided tours in unfamiliar areas.');
    } else if (safetyScore < 80) {
      recommendations.push('Good safety practices! Continue staying aware of your surroundings.');
      recommendations.push('Keep your emergency information up to date.');
    } else {
      recommendations.push('Excellent safety score! You\'re following great safety practices.');
      recommendations.push('Consider helping other travelers with safety tips.');
    }
    
    return recommendations;
  }
}

// Export singleton instance
export const chalosafe = new ChaloSafeAPI();

// Export types
export type { 
  UserRegistrationData, 
  LocationData, 
  SafetyZone, 
  EmergencyData, 
  AadhaarVerificationData, 
  SafetyAlert, 
  AuthorityNotification 
};
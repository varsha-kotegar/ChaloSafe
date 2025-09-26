import { Hono } from "npm:hono";
import { cors } from "npm:hono/cors";
import { logger } from "npm:hono/logger";
import { createClient } from "npm:@supabase/supabase-js";
import * as kv from "./kv_store.tsx";

const app = new Hono();

// Initialize Supabase client for admin operations
const supabase = createClient(
  Deno.env.get('SUPABASE_URL')!,
  Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!
);

// Initialize Supabase client for auth operations
const supabaseAuth = createClient(
  Deno.env.get('SUPABASE_URL')!,
  Deno.env.get('SUPABASE_ANON_KEY')!
);

// Enable logger
app.use('*', logger(console.log));

// Enable CORS for all routes and methods
app.use(
  "/*",
  cors({
    origin: "*",
    allowHeaders: ["Content-Type", "Authorization"],
    allowMethods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
    exposeHeaders: ["Content-Length"],
    maxAge: 600,
  }),
);

// Helper function to verify user authentication
async function verifyAuth(authHeader: string | null) {
  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    return null;
  }
  
  const token = authHeader.split(' ')[1];
  const { data: { user }, error } = await supabase.auth.getUser(token);
  
  if (error || !user) {
    console.log('Auth verification failed:', error);
    return null;
  }
  
  return user;
}

// Helper function to calculate distance between two coordinates
function calculateDistance(lat1: number, lon1: number, lat2: number, lon2: number): number {
  const R = 6371e3; // Earth's radius in meters
  const φ1 = lat1 * Math.PI/180;
  const φ2 = lat2 * Math.PI/180;
  const Δφ = (lat2-lat1) * Math.PI/180;
  const Δλ = (lon1-lon2) * Math.PI/180;

  const a = Math.sin(Δφ/2) * Math.sin(Δφ/2) +
          Math.cos(φ1) * Math.cos(φ2) *
          Math.sin(Δλ/2) * Math.sin(Δλ/2);
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1-a));

  return R * c;
}

// Mock Aadhaar verification service
async function verifyAadhaar(aadhaarNumber: string, personalDetails: any) {
  try {
    console.log('Verifying Aadhaar:', aadhaarNumber);
    
    if (aadhaarNumber.length === 12 && /^\d+$/.test(aadhaarNumber)) {
      return {
        isValid: true,
        details: {
          name: personalDetails.name,
          dateOfBirth: personalDetails.dateOfBirth,
          gender: personalDetails.gender,
          address: personalDetails.address,
          verificationId: `VERIFY_${Date.now()}`
        }
      };
    } else {
      return {
        isValid: false,
        error: 'Invalid Aadhaar number format'
      };
    }
  } catch (error) {
    console.error('Aadhaar verification error:', error);
    return {
      isValid: false,
      error: 'Verification service unavailable'
    };
  }
}

// AI Safety Analysis
async function analyzeLocationForSafety(locationData: any, userProfile: any) {
  try {
    console.log('Analyzing location safety:', locationData);
    
    const alerts = [];
    const recommendations = [];
    
    // Check for late night activity
    const currentHour = new Date().getHours();
    if (currentHour >= 22 || currentHour <= 5) {
      alerts.push('Late night activity detected');
      recommendations.push('Stay in well-lit areas');
      recommendations.push('Share location with emergency contacts');
    }
    
    // Determine alert level
    let alertLevel = 'safe';
    if (alerts.length >= 2) {
      alertLevel = 'high';
    } else if (alerts.length === 1) {
      alertLevel = 'moderate';
    }
    
    return {
      alertLevel,
      message: alerts.length > 0 ? alerts.join(', ') : 'Area appears safe',
      recommendations: recommendations.length > 0 ? recommendations : ['Continue normal activities', 'Stay aware of surroundings']
    };
  } catch (error) {
    console.error('AI safety analysis error:', error);
    return {
      alertLevel: 'unknown',
      message: 'Unable to analyze current location safety'
    };
  }
}

// Health check endpoint
app.get("/make-server-abf68645/health", (c) => {
  return c.json({ status: "ok" });
});

// User Registration
app.post("/make-server-abf68645/signup", async (c) => {
  try {
    const body = await c.req.json();
    const { 
      firstName, 
      lastName, 
      nationality, 
      age, 
      phone, 
      tripDuration, 
      itinerary, 
      startDate, 
      emergencyName, 
      emergencyPhone,
      email,
      password,
      role = 'traveller',
      aadhaarNumber,
      aadhaarDetails 
    } = body;

    // Validate required fields
    if (!firstName || !lastName || !email || !password) {
      return c.json({ error: 'Missing required fields' }, 400);
    }

    let aadhaarVerificationResult = null;
    
    // Perform Aadhaar verification if provided
    if (aadhaarNumber && role === 'traveller') {
      aadhaarVerificationResult = await verifyAadhaar(aadhaarNumber, {
        name: `${firstName} ${lastName}`,
        dateOfBirth: aadhaarDetails?.dateOfBirth,
        gender: aadhaarDetails?.gender,
        address: aadhaarDetails?.address
      });

      if (!aadhaarVerificationResult.isValid) {
        return c.json({ 
          error: 'Aadhaar verification failed: ' + aadhaarVerificationResult.error,
          verificationRequired: true 
        }, 400);
      }
    }

    // Create user account
    const { data, error } = await supabase.auth.admin.createUser({
      email,
      password,
      user_metadata: { 
        firstName,
        lastName,
        role,
        nationality,
        age,
        phone,
        aadhaarVerified: !!aadhaarVerificationResult?.isValid
      },
      email_confirm: true
    });

    if (error) {
      console.log('User creation error:', error);
      return c.json({ error: 'Failed to create user account: ' + error.message }, 400);
    }

    // Generate unique Digital ID
    const digitalId = role === 'traveller' 
      ? `DT-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`
      : `DA-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;

    // Store user profile data
    const userProfile = {
      id: data.user.id,
      email,
      firstName,
      lastName,
      nationality,
      age,
      phone,
      tripDuration,
      itinerary,
      startDate,
      emergencyName,
      emergencyPhone,
      digitalId,
      role,
      aadhaarNumber: aadhaarNumber || null,
      aadhaarVerified: aadhaarVerificationResult?.isValid || false,
      aadhaarVerificationId: aadhaarVerificationResult?.details?.verificationId || null,
      createdAt: new Date().toISOString(),
      lastLogin: new Date().toISOString(),
      isActive: true,
      safetyScore: 100,
      locationConsent: true
    };

    await kv.set(`user:${data.user.id}`, userProfile);
    await kv.set(`digitalId:${digitalId}`, data.user.id);

    return c.json({ 
      message: 'User registered successfully',
      user: {
        id: data.user.id,
        email,
        digitalId,
        role,
        aadhaarVerified: aadhaarVerificationResult?.isValid || false
      },
      aadhaarVerification: aadhaarVerificationResult
    });

  } catch (error) {
    console.log('Registration error:', error);
    return c.json({ error: 'Internal server error during registration' }, 500);
  }
});

// Google OAuth Login
app.post("/make-server-abf68645/google-login", async (c) => {
  try {
    const body = await c.req.json();
    const { googleToken, role = 'traveller' } = body;

    if (!googleToken) {
      return c.json({ error: 'Google token is required' }, 400);
    }

    // Mock Google verification for demo
    const mockGoogleUser = {
      email: `demo.user@gmail.com`,
      name: 'Google Demo User',
      picture: 'https://via.placeholder.com/100',
      verified: true
    };

    // Check if user exists
    let existingProfile = null;
    const allUsers = await kv.getByPrefix('user:');
    
    for (const user of allUsers) {
      if (user && user.email === mockGoogleUser.email) {
        existingProfile = user;
        break;
      }
    }

    let userProfile;
    
    if (existingProfile) {
      existingProfile.lastLogin = new Date().toISOString();
      await kv.set(`user:${existingProfile.id}`, existingProfile);
      userProfile = existingProfile;
    } else {
      // Create new user with Google info
      const { data, error } = await supabase.auth.admin.createUser({
        email: mockGoogleUser.email,
        user_metadata: { 
          firstName: mockGoogleUser.name.split(' ')[0],
          lastName: mockGoogleUser.name.split(' ').slice(1).join(' ') || '',
          role,
          googleAuth: true
        },
        email_confirm: true
      });

      if (error) {
        return c.json({ error: 'Failed to create user account' }, 400);
      }

      const digitalId = role === 'traveller' 
        ? `DT-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`
        : `DA-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;

      userProfile = {
        id: data.user.id,
        email: mockGoogleUser.email,
        firstName: mockGoogleUser.name.split(' ')[0],
        lastName: mockGoogleUser.name.split(' ').slice(1).join(' ') || '',
        digitalId,
        role,
        googleAuth: true,
        profilePicture: mockGoogleUser.picture,
        createdAt: new Date().toISOString(),
        lastLogin: new Date().toISOString(),
        isActive: true,
        safetyScore: 100
      };

      await kv.set(`user:${data.user.id}`, userProfile);
      await kv.set(`digitalId:${digitalId}`, data.user.id);
    }

    return c.json({
      message: 'Google login successful',
      user: {
        id: userProfile.id,
        email: userProfile.email,
        role: userProfile.role,
        digitalId: userProfile.digitalId
      },
      profile: userProfile,
      isNewUser: !existingProfile
    });

  } catch (error) {
    console.log('Google login error:', error);
    return c.json({ error: 'Internal server error during Google login' }, 500);
  }
});

// User Login
app.post("/make-server-abf68645/login", async (c) => {
  try {
    const body = await c.req.json();
    const { email, password } = body;

    if (!email || !password) {
      return c.json({ error: 'Email and password are required' }, 400);
    }

    const { data, error } = await supabaseAuth.auth.signInWithPassword({
      email,
      password
    });

    if (error) {
      console.log('Login error:', error);
      return c.json({ error: 'Invalid credentials' }, 401);
    }

    // Get user profile from KV store
    const userProfile = await kv.get(`user:${data.user.id}`);

    return c.json({
      message: 'Login successful',
      user: data.user,
      profile: userProfile,
      session: data.session
    });

  } catch (error) {
    console.log('Login server error:', error);
    return c.json({ error: 'Internal server error during login' }, 500);
  }
});

// Get User Profile
app.get("/make-server-abf68645/profile", async (c) => {
  try {
    const user = await verifyAuth(c.req.header('Authorization'));
    if (!user) {
      return c.json({ error: 'Unauthorized' }, 401);
    }

    const profile = await kv.get(`user:${user.id}`);
    if (!profile) {
      return c.json({ error: 'Profile not found' }, 404);
    }

    return c.json({ profile });

  } catch (error) {
    console.log('Profile fetch error:', error);
    return c.json({ error: 'Internal server error while fetching profile' }, 500);
  }
});

// Location Update with AI Safety Analysis
app.post("/make-server-abf68645/location", async (c) => {
  try {
    const user = await verifyAuth(c.req.header('Authorization'));
    if (!user) {
      return c.json({ error: 'Unauthorized' }, 401);
    }

    const body = await c.req.json();
    const { latitude, longitude, timestamp } = body;

    if (!latitude || !longitude) {
      return c.json({ error: 'Latitude and longitude are required' }, 400);
    }

    const locationData = {
      userId: user.id,
      latitude: parseFloat(latitude),
      longitude: parseFloat(longitude),
      timestamp: timestamp || new Date().toISOString(),
      accuracy: body.accuracy || null
    };

    // Get user profile for AI analysis
    const userProfile = await kv.get(`user:${user.id}`);

    // Store current location
    await kv.set(`location:current:${user.id}`, locationData);
    
    // Store in location history
    const historyKey = `location:history:${user.id}:${Date.now()}`;
    await kv.set(historyKey, locationData);

    // AI Safety Analysis
    const aiSafetyAnalysis = await analyzeLocationForSafety(locationData, userProfile);

    // Update user's safety score
    if (userProfile) {
      let scoreAdjustment = 0;
      
      switch (aiSafetyAnalysis.alertLevel) {
        case 'high':
          scoreAdjustment = -5;
          break;
        case 'moderate':
          scoreAdjustment = -2;
          break;
        case 'safe':
          scoreAdjustment = 1;
          break;
      }
      
      userProfile.safetyScore = Math.max(0, Math.min(100, userProfile.safetyScore + scoreAdjustment));
      userProfile.lastLocationUpdate = new Date().toISOString();
      await kv.set(`user:${user.id}`, userProfile);
    }

    // Create safety alert if needed
    if (aiSafetyAnalysis.alertLevel === 'high' || aiSafetyAnalysis.alertLevel === 'moderate') {
      const alertId = `alert-${Date.now()}-${Math.random().toString(36).substr(2, 6)}`;
      const safetyAlert = {
        id: alertId,
        userId: user.id,
        type: 'ai_safety_alert',
        alertLevel: aiSafetyAnalysis.alertLevel,
        location: locationData,
        message: aiSafetyAnalysis.message,
        recommendations: aiSafetyAnalysis.recommendations,
        timestamp: new Date().toISOString(),
        acknowledged: false
      };
      
      await kv.set(`alert:${alertId}`, safetyAlert);
      await kv.set(`alert:user:${user.id}:${alertId}`, safetyAlert);
    }

    return c.json({ 
      message: 'Location updated successfully',
      location: locationData,
      aiSafetyAnalysis: aiSafetyAnalysis,
      safetyScore: userProfile?.safetyScore || 100
    });

  } catch (error) {
    console.log('Location update error:', error);
    return c.json({ error: 'Internal server error while updating location' }, 500);
  }
});

// Emergency SOS
app.post("/make-server-abf68645/emergency", async (c) => {
  try {
    const user = await verifyAuth(c.req.header('Authorization'));
    if (!user) {
      return c.json({ error: 'Unauthorized' }, 401);
    }

    const body = await c.req.json();
    const { latitude, longitude, message, type = 'emergency', severity = 'high' } = body;

    if (!latitude || !longitude) {
      return c.json({ error: 'Location coordinates are required for emergency SOS' }, 400);
    }

    const profile = await kv.get(`user:${user.id}`);
    
    const emergencyData = {
      id: `emergency-${Date.now()}`,
      userId: user.id,
      userProfile: profile,
      latitude: parseFloat(latitude),
      longitude: parseFloat(longitude),
      message: message || 'Emergency SOS activated',
      type,
      severity,
      timestamp: new Date().toISOString(),
      status: 'active'
    };

    // Store emergency data
    await kv.set(`emergency:${emergencyData.id}`, emergencyData);
    await kv.set(`emergency:active:${user.id}`, emergencyData);

    console.log('EMERGENCY ALERT:', emergencyData);

    return c.json({ 
      message: 'Emergency SOS sent successfully',
      emergency: emergencyData,
      status: 'dispatched'
    });

  } catch (error) {
    console.log('Emergency alert error:', error);
    return c.json({ error: 'Internal server error while sending emergency alert' }, 500);
  }
});

// Get User Alerts
app.get("/make-server-abf68645/user/alerts", async (c) => {
  try {
    const user = await verifyAuth(c.req.header('Authorization'));
    if (!user) {
      return c.json({ error: 'Unauthorized' }, 401);
    }

    const safetyAlerts = await kv.getByPrefix(`alert:user:${user.id}:`);
    
    const allAlerts = safetyAlerts.sort(
      (a, b) => new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime()
    );

    return c.json({ 
      alerts: allAlerts,
      unreadCount: allAlerts.filter(a => !a.acknowledged).length
    });

  } catch (error) {
    console.log('User alerts fetch error:', error);
    return c.json({ error: 'Internal server error while fetching alerts' }, 500);
  }
});

// Acknowledge Alert
app.put("/make-server-abf68645/user/alerts/:alertId/acknowledge", async (c) => {
  try {
    const user = await verifyAuth(c.req.header('Authorization'));
    if (!user) {
      return c.json({ error: 'Unauthorized' }, 401);
    }

    const alertId = c.req.param('alertId');
    const alert = await kv.get(`alert:${alertId}`);
    
    if (!alert || alert.userId !== user.id) {
      return c.json({ error: 'Alert not found' }, 404);
    }

    alert.acknowledged = true;
    alert.acknowledgedAt = new Date().toISOString();
    
    await kv.set(`alert:${alertId}`, alert);
    await kv.set(`alert:user:${user.id}:${alertId}`, alert);

    return c.json({ 
      message: 'Alert acknowledged',
      alert 
    });

  } catch (error) {
    console.log('Alert acknowledge error:', error);
    return c.json({ error: 'Internal server error while acknowledging alert' }, 500);
  }
});

// Aadhaar Verification Endpoint
app.post("/make-server-abf68645/verify-aadhaar", async (c) => {
  try {
    const user = await verifyAuth(c.req.header('Authorization'));
    if (!user) {
      return c.json({ error: 'Unauthorized' }, 401);
    }

    const body = await c.req.json();
    const { aadhaarNumber, personalDetails } = body;

    if (!aadhaarNumber) {
      return c.json({ error: 'Aadhaar number is required' }, 400);
    }

    const verificationResult = await verifyAadhaar(aadhaarNumber, personalDetails);
    
    if (verificationResult.isValid) {
      const profile = await kv.get(`user:${user.id}`);
      if (profile) {
        profile.aadhaarNumber = aadhaarNumber;
        profile.aadhaarVerified = true;
        profile.aadhaarVerificationId = verificationResult.details.verificationId;
        profile.aadhaarVerifiedAt = new Date().toISOString();
        
        await kv.set(`user:${user.id}`, profile);
      }
    }

    return c.json({ 
      message: verificationResult.isValid ? 'Aadhaar verified successfully' : 'Aadhaar verification failed',
      verification: verificationResult
    });

  } catch (error) {
    console.log('Aadhaar verification error:', error);
    return c.json({ error: 'Internal server error during Aadhaar verification' }, 500);
  }
});

// Get Travel Recommendations
app.get("/make-server-abf68645/recommendations", async (c) => {
  try {
    const user = await verifyAuth(c.req.header('Authorization'));
    if (!user) {
      return c.json({ error: 'Unauthorized' }, 401);
    }

    const category = c.req.query('category') || 'all';
    const recommendations = getRecommendationsByCategory(category);

    return c.json({ 
      recommendations,
      category,
      total: recommendations.length
    });

  } catch (error) {
    console.log('Recommendations fetch error:', error);
    return c.json({ error: 'Internal server error while fetching recommendations' }, 500);
  }
});

// Helper function for travel recommendations
function getRecommendationsByCategory(category: string) {
  const recommendations = {
    adventures: [
      { id: 1, name: 'Mountain Trekking', rating: 4.5, safety: 'moderate' },
      { id: 2, name: 'River Rafting', rating: 4.2, safety: 'guided' },
      { id: 3, name: 'Rock Climbing', rating: 4.7, safety: 'expert' }
    ],
    temples: [
      { id: 4, name: 'Ancient Temple Complex', rating: 4.8, safety: 'safe' },
      { id: 5, name: 'Hilltop Temple', rating: 4.6, safety: 'safe' },
      { id: 6, name: 'Sacred Grove Temple', rating: 4.4, safety: 'safe' }
    ],
    waterparks: [
      { id: 7, name: 'AquaWorld', rating: 4.3, safety: 'safe' },
      { id: 8, name: 'Water Kingdom', rating: 4.1, safety: 'safe' },
      { id: 9, name: 'Splash Zone', rating: 4.5, safety: 'safe' }
    ],
    beaches: [
      { id: 10, name: 'Golden Beach', rating: 4.6, safety: 'patrolled' },
      { id: 11, name: 'Sunset Cove', rating: 4.4, safety: 'moderate' },
      { id: 12, name: 'Crystal Bay', rating: 4.8, safety: 'safe' }
    ],
    zoos: [
      { id: 13, name: 'National Zoo', rating: 4.5, safety: 'safe' },
      { id: 14, name: 'Wildlife Sanctuary', rating: 4.7, safety: 'guided' },
      { id: 15, name: 'Safari Park', rating: 4.3, safety: 'safe' }
    ],
    hiking: [
      { id: 16, name: 'Forest Trail', rating: 4.4, safety: 'moderate' },
      { id: 17, name: 'Valley Path', rating: 4.6, safety: 'easy' },
      { id: 18, name: 'Summit Route', rating: 4.8, safety: 'challenging' }
    ]
  };

  return recommendations[category as keyof typeof recommendations] || [];
}

// Default handler
app.all("*", (c) => {
  return c.json({ error: "Not found" }, 404);
});

export default app;
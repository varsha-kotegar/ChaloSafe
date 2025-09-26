# Google OAuth Setup for ChaloSafe

## Current Status
✅ Google Identity Services integration is complete  
✅ Demo mode is working (using mock credentials)  
❌ Real Google OAuth credentials need to be configured  

## Quick Setup Guide

### 1. Get Google OAuth Credentials

1. Go to [Google Cloud Console](https://console.cloud.google.com/)
2. Create a new project or select existing one
3. Enable **Google Identity Services API**
4. Go to **Credentials** → **Create Credentials** → **OAuth 2.0 Client IDs**
5. Configure authorized domains:
   - For localhost: `http://localhost:3000`
   - For production: your actual domain
6. Copy the Client ID

### 2. Configure Environment Variables

Create a `.env` file in your project root:

```bash
REACT_APP_GOOGLE_CLIENT_ID=your_actual_client_id_here.apps.googleusercontent.com
```

### 3. Update GoogleIdentityProvider.tsx (if needed)

The current implementation already reads from environment variables:

```typescript
const GOOGLE_CLIENT_ID = process.env.REACT_APP_GOOGLE_CLIENT_ID || "YOUR_GOOGLE_CLIENT_ID_HERE";
```

### 4. Test the Integration

1. Start your development server
2. Go to Traveller Login
3. Click "Sign in with Gmail"
4. You should see the real Google sign-in popup

## Demo Mode Features

Currently working in demo mode with these features:
- ✅ Mock Google user authentication
- ✅ Automatic account creation
- ✅ Integration with existing ChaloSafe flow
- ✅ Demo user data generation
- ✅ Proper error handling
- ✅ Loading states

## Security Notes

- Never commit real OAuth credentials to version control
- Use environment variables for credentials
- Test with localhost first, then configure production domains
- The demo mode is safe for development and testing

## Integration Flow

1. User clicks "Sign in with Gmail"
2. Google Identity Services loads (real or demo mode)
3. User authenticates with Google (or uses demo data)
4. Google JWT token is decoded
5. User data is extracted and sent to Supabase backend
6. ChaloSafe session is created
7. User is redirected to dashboard or registration completion

## Troubleshooting

### Common Issues:
- **"Google Sign-In not ready"**: Wait for Google Identity Services to load
- **Invalid client ID**: Check your environment variable
- **Domain not authorized**: Add your domain to Google OAuth settings

### Demo Mode Issues:
- Demo mode creates mock user data
- Demo mode works without real Google credentials
- Demo mode shows information banners to users
import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '../ui/card';
import { Button } from '../ui/button';
import { Badge } from '../ui/badge';
import { Alert, AlertDescription } from '../ui/alert';
import { Language } from '../../App';
import { 
  Brain, 
  AlertTriangle, 
  Shield, 
  MapPin, 
  Clock, 
  Zap,
  X,
  CheckCircle,
  Lightbulb,
  Navigation,
  Thermometer,
  Cloud,
  User,
  Activity
} from 'lucide-react';
import { toast } from 'sonner@2.0.3';

interface AISafetyAlertProps {
  language: Language;
  currentLocation?: {
    latitude: number;
    longitude: number;
  };
}

interface AIAlert {
  id: string;
  type: 'danger' | 'caution' | 'info' | 'weather' | 'crowd' | 'route';
  severity: 'low' | 'medium' | 'high' | 'critical';
  title: string;
  message: string;
  recommendation: string;
  timestamp: Date;
  location?: {
    latitude: number;
    longitude: number;
    address: string;
  };
  dismissed: boolean;
  aiConfidence: number;
  source: 'pattern_analysis' | 'real_time_data' | 'crowd_reports' | 'weather_ai';
}

export function AISafetyAlert({ language, currentLocation }: AISafetyAlertProps) {
  const [alerts, setAlerts] = useState<AIAlert[]>([]);
  const [isAnalyzing, setIsAnalyzing] = useState(false);

  useEffect(() => {
    generateAIAlerts();
    const interval = setInterval(generateAIAlerts, 30000); // Update every 30 seconds
    return () => clearInterval(interval);
  }, [currentLocation]);

  const generateAIAlerts = async () => {
    setIsAnalyzing(true);
    
    // Simulate AI analysis delay
    await new Promise(resolve => setTimeout(resolve, 1500));
    
    const mockAlerts: AIAlert[] = [
      {
        id: 'ai-001',
        type: 'danger',
        severity: 'high',
        title: 'High Crime Area Detected',
        message: 'AI analysis shows increased security incidents in your current area based on pattern recognition.',
        recommendation: 'Consider moving to a well-lit, populated area or contact local authorities.',
        timestamp: new Date(),
        location: {
          latitude: currentLocation?.latitude || 12.9716,
          longitude: currentLocation?.longitude || 77.5946,
          address: 'MG Road, Bangalore'
        },
        dismissed: false,
        aiConfidence: 0.87,
        source: 'pattern_analysis'
      },
      {
        id: 'ai-002',
        type: 'weather',
        severity: 'medium',
        title: 'Sudden Weather Change',
        message: 'AI weather prediction indicates potential heavy rainfall in next 2 hours.',
        recommendation: 'Seek indoor shelter and avoid outdoor activities.',
        timestamp: new Date(Date.now() - 5 * 60 * 1000), // 5 minutes ago
        dismissed: false,
        aiConfidence: 0.92,
        source: 'weather_ai'
      },
      {
        id: 'ai-003',
        type: 'crowd',
        severity: 'medium',
        title: 'Crowd Density Alert',
        message: 'AI crowd analysis detects unusual crowd buildup ahead on your route.',
        recommendation: 'Use alternative route or wait for crowd to disperse.',
        timestamp: new Date(Date.now() - 12 * 60 * 1000), // 12 minutes ago
        location: {
          latitude: 12.9758,
          longitude: 77.6088,
          address: 'Commercial Street, Bangalore'
        },
        dismissed: false,
        aiConfidence: 0.79,
        source: 'crowd_reports'
      },
      {
        id: 'ai-004',
        type: 'route',
        severity: 'low',
        title: 'Optimal Route Suggestion',
        message: 'AI route optimization found a safer path to your destination.',
        recommendation: 'Take the suggested route via Park Street for better safety.',
        timestamp: new Date(Date.now() - 20 * 60 * 1000), // 20 minutes ago
        dismissed: false,
        aiConfidence: 0.84,
        source: 'real_time_data'
      }
    ];

    setAlerts(prev => {
      const existingIds = prev.map(alert => alert.id);
      const newAlerts = mockAlerts.filter(alert => !existingIds.includes(alert.id));
      return [...prev, ...newAlerts];
    });
    
    setIsAnalyzing(false);
  };

  const dismissAlert = (alertId: string) => {
    setAlerts(prev => prev.map(alert => 
      alert.id === alertId ? { ...alert, dismissed: true } : alert
    ));
    toast.success('Alert dismissed');
  };

  const getAlertIcon = (type: string) => {
    switch (type) {
      case 'danger':
        return <AlertTriangle className="w-5 h-5 text-red-500" />;
      case 'weather':
        return <Cloud className="w-5 h-5 text-blue-500" />;
      case 'crowd':
        return <User className="w-5 h-5 text-orange-500" />;
      case 'route':
        return <Navigation className="w-5 h-5 text-green-500" />;
      default:
        return <Lightbulb className="w-5 h-5 text-yellow-500" />;
    }
  };

  const getSeverityColor = (severity: string) => {
    switch (severity) {
      case 'critical':
        return 'border-red-500 bg-red-50';
      case 'high':
        return 'border-orange-500 bg-orange-50';
      case 'medium':
        return 'border-yellow-500 bg-yellow-50';
      default:
        return 'border-blue-500 bg-blue-50';
    }
  };

  const getSeverityBadge = (severity: string) => {
    switch (severity) {
      case 'critical':
        return <Badge className="bg-red-600 text-white">Critical</Badge>;
      case 'high':
        return <Badge className="bg-orange-600 text-white">High</Badge>;
      case 'medium':
        return <Badge className="bg-yellow-600 text-white">Medium</Badge>;
      default:
        return <Badge className="bg-blue-600 text-white">Low</Badge>;
    }
  };

  const activeAlerts = alerts.filter(alert => !alert.dismissed);

  return (
    <div className="space-y-4">
      {/* AI Analysis Header */}
      <Card>
        <CardHeader className="pb-3">
          <CardTitle className="flex items-center space-x-2">
            <Brain className="w-5 h-5 text-purple-600" />
            <span>AI Safety Intelligence</span>
            {isAnalyzing && (
              <div className="flex items-center space-x-2 ml-auto">
                <Activity className="w-4 h-4 text-purple-600 animate-pulse" />
                <span className="text-sm text-gray-600">Analyzing...</span>
              </div>
            )}
          </CardTitle>
        </CardHeader>
        <CardContent className="pt-0">
          <div className="grid grid-cols-3 gap-4 text-center">
            <div className="space-y-1">
              <div className="text-2xl font-bold text-green-600">
                {activeAlerts.filter(a => a.severity === 'low').length}
              </div>
              <div className="text-xs text-gray-600">Safe Areas</div>
            </div>
            <div className="space-y-1">
              <div className="text-2xl font-bold text-yellow-600">
                {activeAlerts.filter(a => ['medium', 'high'].includes(a.severity)).length}
              </div>
              <div className="text-xs text-gray-600">Caution Zones</div>
            </div>
            <div className="space-y-1">
              <div className="text-2xl font-bold text-red-600">
                {activeAlerts.filter(a => a.severity === 'critical').length}
              </div>
              <div className="text-xs text-gray-600">Danger Zones</div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Active Alerts */}
      {activeAlerts.length > 0 ? (
        <div className="space-y-3">
          {activeAlerts.map((alert) => (
            <Card key={alert.id} className={`border-l-4 ${getSeverityColor(alert.severity)}`}>
              <CardContent className="p-4">
                <div className="flex items-start justify-between">
                  <div className="flex items-start space-x-3 flex-1">
                    {getAlertIcon(alert.type)}
                    <div className="flex-1">
                      <div className="flex items-center space-x-2 mb-2">
                        {getSeverityBadge(alert.severity)}
                        <Badge variant="outline" className="text-xs">
                          AI Confidence: {Math.round(alert.aiConfidence * 100)}%
                        </Badge>
                      </div>
                      
                      <h4 className="font-medium text-gray-900">{alert.title}</h4>
                      <p className="text-sm text-gray-600 mt-1">{alert.message}</p>
                      
                      <Alert className="mt-3 bg-blue-50 border-blue-200">
                        <Lightbulb className="w-4 h-4" />
                        <AlertDescription className="text-sm">
                          <strong>AI Recommendation:</strong> {alert.recommendation}
                        </AlertDescription>
                      </Alert>
                      
                      <div className="flex items-center space-x-4 mt-3 text-xs text-gray-500">
                        <div className="flex items-center space-x-1">
                          <Clock className="w-3 h-3" />
                          <span>{alert.timestamp.toLocaleTimeString()}</span>
                        </div>
                        {alert.location && (
                          <div className="flex items-center space-x-1">
                            <MapPin className="w-3 h-3" />
                            <span>{alert.location.address}</span>
                          </div>
                        )}
                        <div className="flex items-center space-x-1">
                          <Zap className="w-3 h-3" />
                          <span className="capitalize">{alert.source.replace('_', ' ')}</span>
                        </div>
                      </div>
                    </div>
                  </div>
                  
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => dismissAlert(alert.id)}
                    className="ml-2"
                  >
                    <X className="w-4 h-4" />
                  </Button>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      ) : (
        <Card>
          <CardContent className="text-center py-8">
            <CheckCircle className="w-12 h-12 mx-auto mb-4 text-green-500" />
            <h3 className="font-medium text-gray-900">All Clear!</h3>
            <p className="text-sm text-gray-600 mt-1">
              AI analysis shows no immediate safety concerns in your area.
            </p>
          </CardContent>
        </Card>
      )}

      {/* AI Insights */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center space-x-2">
            <Brain className="w-5 h-5 text-purple-600" />
            <span>Today's AI Insights</span>
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            <div className="flex items-center space-x-3 p-3 bg-green-50 rounded-lg">
              <Shield className="w-4 h-4 text-green-600" />
              <div className="text-sm">
                <span className="font-medium">Safety Pattern:</span> Your routes today have been 94% safe compared to city average.
              </div>
            </div>
            <div className="flex items-center space-x-3 p-3 bg-blue-50 rounded-lg">
              <Thermometer className="w-4 h-4 text-blue-600" />
              <div className="text-sm">
                <span className="font-medium">Weather AI:</span> Optimal travel conditions for next 4 hours.
              </div>
            </div>
            <div className="flex items-center space-x-3 p-3 bg-purple-50 rounded-lg">
              <Activity className="w-4 h-4 text-purple-600" />
              <div className="text-sm">
                <span className="font-medium">Behavioral Analysis:</span> You're following 98% of safety recommendations.
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
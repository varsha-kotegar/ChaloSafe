import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '../ui/card';
import { Button } from '../ui/button';
import { Badge } from '../ui/badge';
import { Switch } from '../ui/switch';
import { Language } from '../../App';
import { 
  Map, 
  Navigation, 
  Shield, 
  AlertTriangle, 
  MapPin, 
  Layers,
  ZoomIn,
  ZoomOut,
  Compass,
  Route,
  Eye,
  EyeOff,
  Settings,
  Radio,
  Target,
  Crosshair,
  Bell,
  CheckCircle,
  X,
  Mountain
} from 'lucide-react';
import { ImageWithFallback } from '../figma/ImageWithFallback';
import { toast } from 'sonner@2.0.3';
// Placeholder for satellite map image

interface GoogleStyleMapProps {
  language: Language;
  currentLocation?: {
    latitude: number;
    longitude: number;
  };
}

interface SafetyZone {
  id: string;
  type: 'safe' | 'caution' | 'danger' | 'geofence';
  name: string;
  description: string;
  alertLevel: 'low' | 'medium' | 'high';
  color: string;
  area: string;
  boundary: { x: number; y: number }[];
}

interface GeofenceAlert {
  id: string;
  type: 'entering' | 'exiting';
  zoneName: string;
  zoneType: 'safe' | 'caution' | 'danger';
  timestamp: Date;
  acknowledged: boolean;
}

export function GoogleStyleMap({ language, currentLocation }: GoogleStyleMapProps) {
  const [mapView, setMapView] = useState<'satellite' | 'terrain' | 'hybrid'>('satellite');
  const [zoomLevel, setZoomLevel] = useState(12);
  const [showZones, setShowZones] = useState(true);
  const [showTraffic, setShowTraffic] = useState(false);
  const [showGeofences, setShowGeofences] = useState(true);
  const [geofenceAlerts, setGeofenceAlerts] = useState<GeofenceAlert[]>([]);
  const [selectedZone, setSelectedZone] = useState<SafetyZone | null>(null);
  const [userPosition, setUserPosition] = useState({ x: 320, y: 240 }); // Center of map

  // Define zones based on the Delhi map image with color-coded areas
  const safetyZones: SafetyZone[] = [
    {
      id: 'zone-1',
      type: 'safe',
      name: 'Central Delhi',
      description: 'High security zone with tourist police',
      alertLevel: 'low',
      color: '#22c55e',
      area: 'India Gate - Connaught Place',
      boundary: [
        { x: 280, y: 200 },
        { x: 360, y: 200 },
        { x: 360, y: 280 },
        { x: 280, y: 280 }
      ]
    },
    {
      id: 'zone-2',
      type: 'caution',
      name: 'Old Delhi',
      description: 'Crowded markets and narrow streets',
      alertLevel: 'medium',
      color: '#eab308',
      area: 'Chandni Chowk - Red Fort',
      boundary: [
        { x: 240, y: 140 },
        { x: 320, y: 140 },
        { x: 320, y: 200 },
        { x: 240, y: 200 }
      ]
    },
    {
      id: 'zone-3',
      type: 'danger',
      name: 'Industrial Area',
      description: 'Construction zones and heavy traffic',
      alertLevel: 'high',
      color: '#ef4444',
      area: 'Mayapuri - Naraina',
      boundary: [
        { x: 160, y: 260 },
        { x: 240, y: 260 },
        { x: 240, y: 320 },
        { x: 160, y: 320 }
      ]
    },
    {
      id: 'zone-4',
      type: 'safe',
      name: 'Diplomatic Enclave',
      description: 'High security diplomatic area',
      alertLevel: 'low',
      color: '#06d6a0',
      area: 'Chanakyapuri',
      boundary: [
        { x: 200, y: 300 },
        { x: 280, y: 300 },
        { x: 280, y: 360 },
        { x: 200, y: 360 }
      ]
    },
    {
      id: 'zone-5',
      type: 'geofence',
      name: 'Airport Perimeter',
      description: 'Restricted airspace zone',
      alertLevel: 'low',
      color: '#8b5cf6',
      area: 'IGI Airport',
      boundary: [
        { x: 100, y: 200 },
        { x: 160, y: 200 },
        { x: 160, y: 260 },
        { x: 100, y: 260 }
      ]
    },
    {
      id: 'zone-6',
      type: 'caution',
      name: 'Border Checkpoint',
      description: 'State border verification required',
      alertLevel: 'medium',
      color: '#f59e0b',
      area: 'Gurgaon Border',
      boundary: [
        { x: 360, y: 300 },
        { x: 420, y: 300 },
        { x: 420, y: 360 },
        { x: 360, y: 360 }
      ]
    }
  ];

  useEffect(() => {
    // Simulate location updates and geofence monitoring
    const interval = setInterval(() => {
      // Simulate slight position changes
      setUserPosition(prev => ({
        x: prev.x + (Math.random() - 0.5) * 10,
        y: prev.y + (Math.random() - 0.5) * 10
      }));
      
      // Check for geofence violations
      checkGeofences();
    }, 8000);

    return () => clearInterval(interval);
  }, []);

  const checkGeofences = () => {
    safetyZones.forEach(zone => {
      const isInside = isPointInPolygon(userPosition, zone.boundary);
      const wasInside = geofenceAlerts.some(alert => 
        alert.zoneName === zone.name && alert.type === 'entering' && !alert.acknowledged
      );
      
      if (isInside && !wasInside && zone.type !== 'safe') {
        const newAlert: GeofenceAlert = {
          id: `alert-${Date.now()}`,
          type: 'entering',
          zoneName: zone.name,
          zoneType: zone.type as 'safe' | 'caution' | 'danger',
          timestamp: new Date(),
          acknowledged: false
        };
        
        setGeofenceAlerts(prev => [newAlert, ...prev]);
        
        if (zone.type === 'danger') {
          toast.error(`⚠️ Entering dangerous area: ${zone.name}`);
        } else if (zone.type === 'caution') {
          toast.info(`⚠️ Caution: Entering ${zone.name}`);
        }
      }
    });
  };

  const isPointInPolygon = (point: { x: number; y: number }, polygon: { x: number; y: number }[]) => {
    let inside = false;
    for (let i = 0, j = polygon.length - 1; i < polygon.length; j = i++) {
      if (((polygon[i].y > point.y) !== (polygon[j].y > point.y)) &&
          (point.x < (polygon[j].x - polygon[i].x) * (point.y - polygon[i].y) / (polygon[j].y - polygon[i].y) + polygon[i].x)) {
        inside = !inside;
      }
    }
    return inside;
  };

  const acknowledgeAlert = (alertId: string) => {
    setGeofenceAlerts(prev => prev.map(alert => 
      alert.id === alertId ? { ...alert, acknowledged: true } : alert
    ));
  };

  const unacknowledgedAlerts = geofenceAlerts.filter(alert => !alert.acknowledged);

  return (
    <div className="space-y-4">
      {/* Geofence Alerts */}
      {unacknowledgedAlerts.length > 0 && (
        <Card className="border-orange-200 bg-orange-50">
          <CardHeader className="pb-3">
            <CardTitle className="flex items-center space-x-2 text-orange-700">
              <Bell className="w-5 h-5" />
              <span>Location Alerts</span>
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-2">
              {unacknowledgedAlerts.slice(0, 3).map((alert) => (
                <div key={alert.id} className="flex items-center justify-between p-2 bg-white rounded border">
                  <div className="flex items-center space-x-2">
                    <AlertTriangle className={`w-4 h-4 ${
                      alert.zoneType === 'danger' ? 'text-red-500' : 
                      alert.zoneType === 'caution' ? 'text-yellow-500' : 'text-blue-500'
                    }`} />
                    <div>
                      <div className="text-sm font-medium">
                        {alert.type === 'entering' ? 'Entering' : 'Exiting'} {alert.zoneName}
                      </div>
                      <div className="text-xs text-gray-600">
                        {alert.timestamp.toLocaleTimeString()}
                      </div>
                    </div>
                  </div>
                  <Button
                    size="sm"
                    variant="outline"
                    onClick={() => acknowledgeAlert(alert.id)}
                  >
                    <CheckCircle className="w-3 h-3 mr-1" />
                    OK
                  </Button>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      )}

      {/* Google Style Map */}
      <Card>
        <CardHeader className="pb-3">
          <div className="flex items-center justify-between">
            <CardTitle className="flex items-center space-x-2">
              <MapPin className="w-5 h-5" />
              <span>Location Map</span>
            </CardTitle>
          </div>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {/* Map Display - Using the provided Delhi satellite image */}
            <div className="relative h-96 bg-gray-200 rounded-lg overflow-hidden border-2 border-gray-300">
              {/* Base satellite map */}
              <div className="absolute inset-0">
                <ImageWithFallback
                  src="https://images.unsplash.com/photo-1562709692-b453e8938f5e?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxkZWxoaSUyMGluZGlhJTIwY2l0eSUyMGFlcmlhbCUyMHNhdGVsbGl0ZXxlbnwxfHx8fDE3NTg4NzgxNDN8MA&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral"
                  alt="Delhi Satellite Map View"
                  className="w-full h-full object-cover"
                />
                {/* Overlay for better contrast */}
                <div className="absolute inset-0 bg-black/10"></div>
              </div>
              
              {/* Color-coded zone overlays */}
              {showZones && (
                <div className="absolute inset-0">
                  <svg className="w-full h-full">
                    {safetyZones.map((zone) => {
                      const points = zone.boundary.map(p => `${p.x},${p.y}`).join(' ');
                      return (
                        <g key={zone.id}>
                          <polygon
                            points={points}
                            fill={`${zone.color}30`}
                            stroke={zone.color}
                            strokeWidth="3"
                            strokeDasharray={zone.type === 'geofence' ? '8,4' : 'none'}
                            className="cursor-pointer transition-all hover:fill-opacity-50"
                            onClick={() => setSelectedZone(zone)}
                          />
                        </g>
                      );
                    })}
                  </svg>
                </div>
              )}

              {/* User location indicator with profile image */}
              <div 
                className="absolute z-20 transform -translate-x-1/2 -translate-y-1/2"
                style={{ left: userPosition.x, top: userPosition.y }}
              >
                <div className="relative">
                  {/* User profile image */}
                  <div className="w-12 h-12 rounded-full border-4 border-white shadow-lg overflow-hidden bg-blue-500">
                    <ImageWithFallback
                      src="https://images.unsplash.com/photo-1621154130729-ea1bc513eea6?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHx1c2VyJTIwcHJvZmlsZSUyMGF2YXRhciUyMHRyYXZlbGxlciUyMHRvdXJpc3R8ZW58MXx8fHwxNzU4ODc4MTM2fDA&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral"
                      alt="User Profile"
                      className="w-full h-full object-cover"
                    />
                  </div>
                  {/* Status indicator */}
                  <div className="absolute -bottom-1 -right-1 w-4 h-4 bg-green-500 rounded-full border-2 border-white"></div>
                  {/* Pulsing animation */}
                  <div className="absolute top-0 left-0 w-12 h-12 bg-blue-500/20 rounded-full animate-ping"></div>
                  {/* Location label */}
                  <div className="absolute -bottom-10 left-1/2 transform -translate-x-1/2 bg-black/80 text-white px-3 py-1 rounded-full text-xs whitespace-nowrap">
                    📍 You are here
                  </div>
                </div>
              </div>

              {/* Zone center markers */}
              {showZones && safetyZones.map((zone) => {
                const centerX = zone.boundary.reduce((sum, p) => sum + p.x, 0) / zone.boundary.length;
                const centerY = zone.boundary.reduce((sum, p) => sum + p.y, 0) / zone.boundary.length;
                
                return (
                  <div
                    key={`marker-${zone.id}`}
                    className="absolute z-10 cursor-pointer transform -translate-x-1/2 -translate-y-1/2"
                    style={{ left: centerX, top: centerY }}
                    onClick={() => setSelectedZone(zone)}
                  >
                    <div className={`w-8 h-8 rounded-full border-2 shadow-lg flex items-center justify-center transition-all hover:scale-110 ${
                      zone.type === 'safe' ? 'bg-green-100 border-green-500' :
                      zone.type === 'caution' ? 'bg-yellow-100 border-yellow-500' :
                      zone.type === 'danger' ? 'bg-red-100 border-red-500' :
                      'bg-purple-100 border-purple-500'
                    }`}>
                      {zone.type === 'safe' && <Shield className="w-4 h-4 text-green-600" />}
                      {zone.type === 'caution' && <AlertTriangle className="w-4 h-4 text-yellow-600" />}
                      {zone.type === 'danger' && <X className="w-4 h-4 text-red-600" />}
                      {zone.type === 'geofence' && <Radio className="w-4 h-4 text-purple-600" />}
                    </div>
                  </div>
                );
              })}




              {/* Google Maps-style controls */}
              <div className="absolute top-4 right-4 z-30 space-y-2">
                {/* Zoom controls */}
                <div className="bg-white rounded-lg shadow-lg border overflow-hidden">
                  <Button
                    size="sm"
                    variant="ghost"
                    className="w-10 h-10 rounded-none border-b"
                    onClick={() => setZoomLevel(prev => Math.min(prev + 1, 20))}
                  >
                    <ZoomIn className="w-4 h-4" />
                  </Button>
                  <Button
                    size="sm"
                    variant="ghost"
                    className="w-10 h-10 rounded-none"
                    onClick={() => setZoomLevel(prev => Math.max(prev - 1, 1))}
                  >
                    <ZoomOut className="w-4 h-4" />
                  </Button>
                </div>
                
                {/* Map type switcher */}
                <div className="bg-white rounded-lg shadow-lg border overflow-hidden">
                  <Button
                    size="sm"
                    variant="ghost"
                    className="w-10 h-10 rounded-none"
                    onClick={() => setMapView(prev => 
                      prev === 'satellite' ? 'terrain' : 
                      prev === 'terrain' ? 'hybrid' : 'satellite'
                    )}
                    title="Change map view"
                  >
                    <Layers className="w-4 h-4" />
                  </Button>
                </div>

                {/* Current location button */}
                <div className="bg-white rounded-lg shadow-lg border overflow-hidden">
                  <Button
                    size="sm"
                    variant="ghost"
                    className="w-10 h-10 rounded-none"
                    onClick={() => {
                      setUserPosition({ x: 320, y: 240 });
                      toast.success("Centered on your location");
                    }}
                    title="Center on location"
                  >
                    <Target className="w-4 h-4" />
                  </Button>
                </div>
              </div>

              {/* Map view indicator */}
              <div className="absolute top-4 left-4 z-30">
                <div className="bg-black/80 text-white px-3 py-1 rounded-full text-xs font-medium">
                  {mapView.charAt(0).toUpperCase() + mapView.slice(1)} View
                </div>
              </div>

              {/* Google Maps-style compass */}
              <div className="absolute bottom-4 right-4 z-30">
                <div className="bg-white rounded-full shadow-lg border p-2">
                  <Compass className="w-6 h-6 text-gray-600" />
                </div>
              </div>

              {/* Traffic/layers toggle */}
              {showTraffic && (
                <div className="absolute inset-0 z-15">
                  <svg className="w-full h-full">
                    {/* Simulated traffic lines */}
                    <line x1="200" y1="180" x2="400" y2="200" stroke="#ff6b6b" strokeWidth="4" opacity="0.7" />
                    <line x1="150" y1="250" x2="350" y2="280" stroke="#feca57" strokeWidth="3" opacity="0.7" />
                    <line x1="250" y1="300" x2="380" y2="320" stroke="#48cab2" strokeWidth="2" opacity="0.7" />
                  </svg>
                </div>
              )}
            </div>

            {/* Map controls panel */}
            <div className="mt-4 flex items-center justify-end">
              <Button size="sm" variant="outline">
                <Route className="w-4 h-4 mr-2" />
                Directions
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Location Status */}
      <Card>
        <CardContent className="p-4">
          <div className="flex items-center space-x-3">
            <div className="w-3 h-3 bg-blue-500 rounded-full animate-pulse"></div>
            <div>
              <p className="font-medium">Current Location</p>
              <p className="text-sm text-gray-600">
                Position: ({userPosition.x}, {userPosition.y})
              </p>
              <p className="text-sm text-gray-600">New Delhi, India</p>
              <div className="flex items-center space-x-2 mt-2">
                <Badge className="bg-green-100 text-green-800 text-xs">
                  GPS Active
                </Badge>
                <Badge variant="outline" className="text-xs">
                  Zoom: {zoomLevel}x
                </Badge>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Selected Zone Details */}
      {selectedZone && (
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center justify-between">
              <span>Zone Information</span>
              <Button
                size="sm"
                variant="ghost"
                onClick={() => setSelectedZone(null)}
              >
                <X className="w-4 h-4" />
              </Button>
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              <div>
                <h4 className="font-medium">{selectedZone.name}</h4>
                <p className="text-sm text-gray-600">{selectedZone.description}</p>
                <p className="text-sm text-gray-500">{selectedZone.area}</p>
              </div>
              <div className="grid grid-cols-2 gap-4 text-sm">
                <div>
                  <span className="text-gray-600">Type:</span>
                  <Badge className={`ml-2 ${
                    selectedZone.type === 'safe' ? 'bg-green-100 text-green-800' :
                    selectedZone.type === 'caution' ? 'bg-yellow-100 text-yellow-800' :
                    selectedZone.type === 'danger' ? 'bg-red-100 text-red-800' :
                    'bg-purple-100 text-purple-800'
                  }`}>
                    {selectedZone.type.charAt(0).toUpperCase() + selectedZone.type.slice(1)}
                  </Badge>
                </div>
                <div>
                  <span className="text-gray-600">Alert Level:</span>
                  <Badge variant="outline" className="ml-2">
                    {selectedZone.alertLevel.charAt(0).toUpperCase() + selectedZone.alertLevel.slice(1)}
                  </Badge>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      )}


    </div>
  );
}
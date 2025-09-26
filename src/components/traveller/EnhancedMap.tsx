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
  X
} from 'lucide-react';
import { ImageWithFallback } from '../figma/ImageWithFallback';
import { toast } from 'sonner@2.0.3';

interface EnhancedMapProps {
  language: Language;
  currentLocation?: {
    latitude: number;
    longitude: number;
  };
}

interface SafetyZone {
  id: string;
  type: 'safe' | 'caution' | 'danger' | 'geofence';
  center: { lat: number; lng: number };
  radius: number;
  color: string;
  name: string;
  description: string;
  alertLevel: 'low' | 'medium' | 'high';
  boundary?: { lat: number; lng: number }[];
}

interface GeofenceAlert {
  id: string;
  type: 'entering' | 'exiting';
  zoneName: string;
  zoneType: 'safe' | 'caution' | 'danger';
  timestamp: Date;
  acknowledged: boolean;
}

export function EnhancedMap({ language, currentLocation }: EnhancedMapProps) {
  const [mapView, setMapView] = useState<'satellite' | 'terrain' | 'hybrid'>('satellite');
  const [zoomLevel, setZoomLevel] = useState(15);
  const [showZones, setShowZones] = useState(true);
  const [showTraffic, setShowTraffic] = useState(false);
  const [showGeofences, setShowGeofences] = useState(true);
  const [geofenceAlerts, setGeofenceAlerts] = useState<GeofenceAlert[]>([]);
  const [selectedZone, setSelectedZone] = useState<SafetyZone | null>(null);

  const safetyZones: SafetyZone[] = [
    {
      id: 'zone-1',
      type: 'safe',
      center: { lat: 28.6139, lng: 77.2090 },
      radius: 1500,
      color: '#22c55e',
      name: 'Central Delhi Safe Zone',
      description: 'High security tourist area with police stations',
      alertLevel: 'low',
      boundary: [
        { lat: 28.6200, lng: 77.2000 },
        { lat: 28.6200, lng: 77.2180 },
        { lat: 28.6080, lng: 77.2180 },
        { lat: 28.6080, lng: 77.2000 },
        { lat: 28.6200, lng: 77.2000 }
      ]
    },
    {
      id: 'zone-2',
      type: 'caution',
      center: { lat: 28.6304, lng: 77.2177 },
      radius: 1200,
      color: '#eab308',
      name: 'Old Delhi Market Area',
      description: 'Crowded markets - watch belongings',
      alertLevel: 'medium',
      boundary: [
        { lat: 28.6380, lng: 77.2100 },
        { lat: 28.6380, lng: 77.2250 },
        { lat: 28.6220, lng: 77.2250 },
        { lat: 28.6220, lng: 77.2100 },
        { lat: 28.6380, lng: 77.2100 }
      ]
    },
    {
      id: 'zone-3',
      type: 'danger',
      center: { lat: 28.5962, lng: 77.2410 },
      radius: 800,
      color: '#ef4444',
      name: 'Construction Zone',
      description: 'Active construction - restricted access',
      alertLevel: 'high',
      boundary: [
        { lat: 28.6020, lng: 77.2350 },
        { lat: 28.6020, lng: 77.2470 },
        { lat: 28.5900, lng: 77.2470 },
        { lat: 28.5900, lng: 77.2350 },
        { lat: 28.6020, lng: 77.2350 }
      ]
    },
    {
      id: 'zone-4',
      type: 'safe',
      center: { lat: 28.6128, lng: 77.2295 },
      radius: 1000,
      color: '#06d6a0',
      name: 'India Gate Area',
      description: 'Well-patrolled tourist destination',
      alertLevel: 'low',
      boundary: [
        { lat: 28.6180, lng: 77.2200 },
        { lat: 28.6180, lng: 77.2390 },
        { lat: 28.6070, lng: 77.2390 },
        { lat: 28.6070, lng: 77.2200 },
        { lat: 28.6180, lng: 77.2200 }
      ]
    },
    {
      id: 'zone-5',
      type: 'geofence',
      center: { lat: 28.6692, lng: 77.4538 },
      radius: 2000,
      color: '#8b5cf6',
      name: 'Airport Security Zone',
      description: 'High security airport perimeter',
      alertLevel: 'low',
      boundary: [
        { lat: 28.6800, lng: 77.4400 },
        { lat: 28.6800, lng: 77.4700 },
        { lat: 28.6580, lng: 77.4700 },
        { lat: 28.6580, lng: 77.4400 },
        { lat: 28.6800, lng: 77.4400 }
      ]
    },
    {
      id: 'zone-6',
      type: 'caution',
      center: { lat: 28.5245, lng: 77.1855 },
      radius: 1500,
      color: '#f59e0b',
      name: 'Gurgaon Border Area',
      description: 'Interstate boundary - verify documentation',
      alertLevel: 'medium',
      boundary: [
        { lat: 28.5350, lng: 77.1750 },
        { lat: 28.5350, lng: 77.1960 },
        { lat: 28.5140, lng: 77.1960 },
        { lat: 28.5140, lng: 77.1750 },
        { lat: 28.5350, lng: 77.1750 }
      ]
    }
  ];

  const [userLocation, setUserLocation] = useState(
    currentLocation || { latitude: 28.6139, longitude: 77.2090 }
  );

  useEffect(() => {
    // Simulate location updates and geofence monitoring
    const interval = setInterval(() => {
      // Simulate slight location changes
      setUserLocation(prev => ({
        latitude: prev.latitude + (Math.random() - 0.5) * 0.001,
        longitude: prev.longitude + (Math.random() - 0.5) * 0.001
      }));
      
      // Check for geofence violations
      checkGeofences();
    }, 5000);

    return () => clearInterval(interval);
  }, []);

  const checkGeofences = () => {
    safetyZones.forEach(zone => {
      const distance = calculateDistance(
        userLocation.latitude,
        userLocation.longitude,
        zone.center.lat,
        zone.center.lng
      );
      
      const isInside = distance <= zone.radius;
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

  const calculateDistance = (lat1: number, lon1: number, lat2: number, lon2: number) => {
    const R = 6371000; // Earth's radius in meters
    const dLat = (lat2 - lat1) * Math.PI / 180;
    const dLon = (lon2 - lon1) * Math.PI / 180;
    const a = Math.sin(dLat/2) * Math.sin(dLat/2) +
      Math.cos(lat1 * Math.PI / 180) * Math.cos(lat2 * Math.PI / 180) * 
      Math.sin(dLon/2) * Math.sin(dLon/2);
    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1-a));
    return R * c;
  };

  const acknowledgeAlert = (alertId: string) => {
    setGeofenceAlerts(prev => prev.map(alert => 
      alert.id === alertId ? { ...alert, acknowledged: true } : alert
    ));
  };

  const getMapTiles = () => {
    const lat = userLocation.latitude;
    const lng = userLocation.longitude;
    const zoom = Math.min(Math.max(zoomLevel, 1), 18);
    
    // Convert lat/lng to tile coordinates
    const getTileCoordinates = (lat: number, lng: number, zoom: number) => {
      const n = Math.pow(2, zoom);
      const x = Math.floor(((lng + 180) / 360) * n);
      const y = Math.floor(((1 - Math.asinh(Math.tan(lat * Math.PI / 180)) / Math.PI) / 2) * n);
      return { x, y, z: zoom };
    };

    const { x, y, z } = getTileCoordinates(lat, lng, zoom);
    
    switch (mapView) {
      case 'satellite':
        // Using Google-style satellite tiles
        return `https://mt1.google.com/vt/lyrs=s&x=${x}&y=${y}&z=${z}`;
      case 'terrain':
        // Using terrain view
        return `https://mt1.google.com/vt/lyrs=p&x=${x}&y=${y}&z=${z}`;
      case 'hybrid':
        // Using satellite with roads and labels overlay
        return `https://mt1.google.com/vt/lyrs=y&x=${x}&y=${y}&z=${z}`;
      default:
        return `https://mt1.google.com/vt/lyrs=s&x=${x}&y=${y}&z=${z}`;
    }
  };

  const renderMapTiles = () => {
    const lat = userLocation.latitude;
    const lng = userLocation.longitude;
    const zoom = Math.min(Math.max(zoomLevel, 1), 18);
    
    // Calculate tile coordinates for a 3x3 grid around center
    const getTileCoordinates = (lat: number, lng: number, zoom: number) => {
      const n = Math.pow(2, zoom);
      const x = Math.floor(((lng + 180) / 360) * n);
      const y = Math.floor(((1 - Math.asinh(Math.tan(lat * Math.PI / 180)) / Math.PI) / 2) * n);
      return { x, y, z: zoom };
    };

    const centerTile = getTileCoordinates(lat, lng, zoom);
    const tiles = [];

    // Create a 3x3 grid of tiles for better coverage
    for (let dx = -1; dx <= 1; dx++) {
      for (let dy = -1; dy <= 1; dy++) {
        const tileX = centerTile.x + dx;
        const tileY = centerTile.y + dy;
        
        let tileUrl = '';
        switch (mapView) {
          case 'satellite':
            tileUrl = `https://mt1.google.com/vt/lyrs=s&x=${tileX}&y=${tileY}&z=${zoom}`;
            break;
          case 'terrain':
            tileUrl = `https://mt1.google.com/vt/lyrs=p&x=${tileX}&y=${tileY}&z=${zoom}`;
            break;
          case 'hybrid':
            tileUrl = `https://mt1.google.com/vt/lyrs=y&x=${tileX}&y=${tileY}&z=${zoom}`;
            break;
          default:
            tileUrl = `https://mt1.google.com/vt/lyrs=s&x=${tileX}&y=${tileY}&z=${zoom}`;
        }

        tiles.push(
          <div
            key={`${tileX}-${tileY}`}
            className="absolute"
            style={{
              left: `${(dx + 1) * 256 - 128}px`,
              top: `${(dy + 1) * 256 - 128}px`,
              width: '256px',
              height: '256px',
            }}
          >
            <ImageWithFallback
              src={tileUrl}
              alt={`Map tile ${tileX},${tileY}`}
              className="w-full h-full object-cover"
            />
          </div>
        );
      }
    }

    return tiles;
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
              <span>Geofence Alerts</span>
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

      {/* Map View Controls */}
      <Card>
        <CardHeader className="pb-3">
          <div className="flex items-center justify-between">
            <CardTitle className="flex items-center space-x-2">
              <Map className="w-5 h-5" />
              <span>Enhanced Map View</span>
            </CardTitle>
            <div className="flex items-center space-x-2">
              <Button
                variant={mapView === 'satellite' ? 'default' : 'outline'}
                size="sm"
                onClick={() => setMapView('satellite')}
              >
                Satellite
              </Button>
              <Button
                variant={mapView === 'terrain' ? 'default' : 'outline'}
                size="sm"
                onClick={() => setMapView('terrain')}
              >
                Terrain
              </Button>
              <Button
                variant={mapView === 'hybrid' ? 'default' : 'outline'}
                size="sm"
                onClick={() => setMapView('hybrid')}
              >
                Hybrid
              </Button>
            </div>
          </div>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {/* Map Display */}
            <div className="relative h-96 bg-gray-200 rounded-lg overflow-hidden">
              {/* Real Map Tiles */}
              <div className="absolute inset-0 flex items-center justify-center">
                <div className="relative w-full h-full">
                  {renderMapTiles()}
                </div>
              </div>
              
              {/* Hybrid mode overlay (labels) */}
              {mapView === 'hybrid' && (
                <div className="absolute inset-0 pointer-events-none">
                  <div className="relative w-full h-full opacity-80">
                    {/* Add street labels overlay for hybrid mode */}
                    <div className="absolute inset-0 bg-black/10"></div>
                  </div>
                </div>
              )}

              {/* Map Overlays */}
              <div className="absolute inset-0">
                {/* Safety Zones - rendered as boundary polygons */}
                {showZones && safetyZones.map((zone) => {
                  if (!zone.boundary) return null;
                  
                  // Convert boundary coordinates to pixel positions
                  const pixelsPerDegree = Math.pow(2, zoomLevel) * 256 / 360;
                  const boundaryPoints = zone.boundary.map(point => {
                    const latDiff = point.lat - userLocation.latitude;
                    const lngDiff = point.lng - userLocation.longitude;
                    const xOffset = lngDiff * pixelsPerDegree * Math.cos(userLocation.latitude * Math.PI / 180);
                    const yOffset = -latDiff * pixelsPerDegree;
                    return `${192 + xOffset},${192 + yOffset}`;
                  }).join(' ');
                  
                  // Calculate center position for icon
                  const centerLatDiff = zone.center.lat - userLocation.latitude;
                  const centerLngDiff = zone.center.lng - userLocation.longitude;
                  const centerXOffset = centerLngDiff * pixelsPerDegree * Math.cos(userLocation.latitude * Math.PI / 180);
                  const centerYOffset = -centerLatDiff * pixelsPerDegree;
                  
                  return (
                    <div key={zone.id} className="absolute inset-0 pointer-events-none">
                      {/* SVG overlay for polygon boundaries */}
                      <svg
                        className="absolute inset-0 w-full h-full pointer-events-none"
                        style={{ overflow: 'visible' }}
                      >
                        <polygon
                          points={boundaryPoints}
                          fill={`${zone.color}20`}
                          stroke={zone.color}
                          strokeWidth="3"
                          strokeDasharray={zone.type === 'geofence' ? '10,5' : 'none'}
                          className="drop-shadow-sm"
                        />
                      </svg>
                      
                      {/* Zone center marker with icon */}
                      <div
                        className="absolute pointer-events-auto cursor-pointer z-10"
                        style={{
                          left: `calc(50% + ${centerXOffset}px)`,
                          top: `calc(50% + ${centerYOffset}px)`,
                          transform: 'translate(-50%, -50%)',
                        }}
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
                        
                        {/* Zone label */}
                        <div className="absolute top-10 left-1/2 transform -translate-x-1/2 bg-white/95 px-2 py-1 rounded shadow-md text-xs font-medium whitespace-nowrap pointer-events-none">
                          {zone.name}
                        </div>
                      </div>
                    </div>
                  );
                })}

                {/* Current Location - Always centered */}
                <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 z-10">
                  <div className="relative">
                    <div className="w-6 h-6 bg-blue-500 rounded-full border-2 border-white shadow-lg flex items-center justify-center">
                      <div className="w-2 h-2 bg-white rounded-full"></div>
                    </div>
                    <div className="absolute top-0 left-0 w-6 h-6 bg-blue-500/30 rounded-full animate-ping"></div>
                    <div className="absolute -bottom-8 left-1/2 transform -translate-x-1/2 bg-white px-2 py-1 rounded text-xs shadow-md whitespace-nowrap">
                      You are here
                    </div>
                  </div>
                </div>

                {/* Map Controls */}
                <div className="absolute top-4 right-4 space-y-2 z-10">
                  <Button
                    size="sm"
                    variant="outline"
                    className="bg-white shadow-md"
                    onClick={() => setZoomLevel(prev => Math.min(prev + 1, 18))}
                  >
                    <ZoomIn className="w-4 h-4" />
                  </Button>
                  <Button
                    size="sm"
                    variant="outline"
                    className="bg-white shadow-md"
                    onClick={() => setZoomLevel(prev => Math.max(prev - 1, 8))}
                  >
                    <ZoomOut className="w-4 h-4" />
                  </Button>
                  <Button
                    size="sm"
                    variant="outline"
                    className="bg-white shadow-md"
                    onClick={() => setUserLocation({ latitude: 28.6139, longitude: 77.2090 })}
                    title="Reset to Delhi center"
                  >
                    <Compass className="w-4 h-4" />
                  </Button>
                </div>

                {/* Navigation Controls */}
                <div className="absolute bottom-4 right-4 bg-white rounded-lg p-2 shadow-lg z-10">
                  <Button 
                    size="sm" 
                    variant="ghost"
                    onClick={() => toast.info('Navigation feature coming soon!')}
                  >
                    <Navigation className="w-4 h-4" />
                  </Button>
                </div>

                {/* Legend */}
                <div className="absolute top-4 left-4 bg-white/95 rounded-lg p-3 space-y-2 max-w-48 shadow-md z-10">
                  <div className="text-xs font-medium">Safety Zones</div>
                  <div className="space-y-1">
                    <div className="flex items-center space-x-2">
                      <div className="w-3 h-3 bg-green-500 rounded-full"></div>
                      <span className="text-xs">Safe Zone</span>
                    </div>
                    <div className="flex items-center space-x-2">
                      <div className="w-3 h-3 bg-yellow-500 rounded-full"></div>
                      <span className="text-xs">Caution Zone</span>
                    </div>
                    <div className="flex items-center space-x-2">
                      <div className="w-3 h-3 bg-red-500 rounded-full"></div>
                      <span className="text-xs">Danger Zone</span>
                    </div>
                    <div className="flex items-center space-x-2">
                      <div className="w-3 h-3 bg-purple-500 rounded-full"></div>
                      <span className="text-xs">Geofence</span>
                    </div>
                  </div>
                  <div className="border-t pt-2 mt-2">
                    <div className="text-xs font-medium">Map Info</div>
                    <div className="text-xs text-gray-600">
                      Zoom: {zoomLevel}x
                    </div>
                    <div className="text-xs text-gray-600">
                      View: {mapView.charAt(0).toUpperCase() + mapView.slice(1)}
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Map Options */}
            <div className="grid grid-cols-2 gap-4">
              <div className="flex items-center justify-between">
                <label className="text-sm font-medium">Safety Zones</label>
                <Switch
                  checked={showZones}
                  onCheckedChange={setShowZones}
                />
              </div>
              <div className="flex items-center justify-between">
                <label className="text-sm font-medium">Traffic</label>
                <Switch
                  checked={showTraffic}
                  onCheckedChange={setShowTraffic}
                />
              </div>
              <div className="flex items-center justify-between">
                <label className="text-sm font-medium">Geofences</label>
                <Switch
                  checked={showGeofences}
                  onCheckedChange={setShowGeofences}
                />
              </div>
              <div className="flex items-center justify-between">
                <label className="text-sm font-medium">3D View</label>
                <Switch />
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Location Details */}
      <Card>
        <CardContent className="p-4">
          <div className="flex items-center space-x-3">
            <div className="w-3 h-3 bg-blue-500 rounded-full animate-pulse"></div>
            <div>
              <p className="font-medium">Current Location</p>
              <p className="text-sm text-gray-600">
                Lat: {userLocation.latitude.toFixed(4)}, Lng: {userLocation.longitude.toFixed(4)}
              </p>
              <p className="text-sm text-gray-600">New Delhi, India</p>
              <div className="flex items-center space-x-2 mt-2">
                <Badge className="bg-green-100 text-green-800 text-xs">
                  Safe Zone
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
              <span>Zone Details</span>
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
                  <span className="text-gray-600">Radius:</span>
                  <span className="ml-2">{selectedZone.radius}m</span>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Quick Actions */}
      <div className="grid grid-cols-3 gap-3">
        <Button variant="outline" size="sm">
          <Route className="w-4 h-4 mr-2" />
          Navigate
        </Button>
        <Button variant="outline" size="sm">
          <Target className="w-4 h-4 mr-2" />
          Center
        </Button>
        <Button variant="outline" size="sm">
          <Settings className="w-4 h-4 mr-2" />
          Settings
        </Button>
      </div>
    </div>
  );
}
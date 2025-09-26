import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '../ui/card';
import { Button } from '../ui/button';
import { Badge } from '../ui/badge';
import { Language } from '../../App';
import { 
  Map, 
  Navigation, 
  Shield, 
  AlertTriangle, 
  MapPin, 
  ZoomIn,
  ZoomOut,
  Compass,
  Users,
  Radio,
  Target,
  X,
  Satellite,
  Eye,
  Phone
} from 'lucide-react';
import { ImageWithFallback } from '../figma/ImageWithFallback';
import { toast } from 'sonner@2.0.3';
import exampleImage from 'figma:asset/9b2a2195764e4a12f8f3a5d979d3e3fb17a9d987.png';

interface AuthorityMapViewProps {
  language: Language;
}

interface Tourist {
  id: string;
  name: string;
  digitalId: string;
  location: string;
  status: 'safe' | 'caution' | 'danger';
  lastSeen: string;
  group?: string[];
  emergencyContact: string;
  tripInfo: string;
  position: { x: number; y: number };
}

interface SafetyZone {
  id: string;
  type: 'safe' | 'caution' | 'danger' | 'geofence';
  name: string;
  description: string;
  color: string;
  boundary: { x: number; y: number }[];
}

export function AuthorityMapView({ language }: AuthorityMapViewProps) {
  const [zoomLevel, setZoomLevel] = useState(12);
  const [selectedTourist, setSelectedTourist] = useState<Tourist | null>(null);
  const [trackingMode, setTrackingMode] = useState(false);

  // Mock tourist data with positions on the map
  const mockTourists: Tourist[] = [
    {
      id: 'T001',
      name: 'Arjun Sharma',
      digitalId: 'DID-2024-001',
      location: 'India Gate Area',
      status: 'safe',
      lastSeen: '2 min ago',
      emergencyContact: '+91-9876543210',
      tripInfo: 'Solo traveller, 3-day Delhi tour',
      position: { x: 320, y: 280 }
    },
    {
      id: 'T002',
      name: 'Sarah Johnson',
      digitalId: 'DID-2024-002',
      location: 'Old Delhi',
      status: 'caution',
      lastSeen: '5 min ago',
      group: ['T003'],
      emergencyContact: '+1-555-0123',
      tripInfo: 'Tourist group, cultural heritage tour',
      position: { x: 280, y: 170 }
    },
    {
      id: 'T003',
      name: 'Mike Chen',
      digitalId: 'DID-2024-003',
      location: 'Old Delhi',
      status: 'caution',
      lastSeen: '5 min ago',
      group: ['T002'],
      emergencyContact: '+1-555-0124',
      tripInfo: 'Tourist group, cultural heritage tour',
      position: { x: 285, y: 175 }
    },
    {
      id: 'T004',
      name: 'Priya Patel',
      digitalId: 'DID-2024-004',
      location: 'Industrial Area',
      status: 'danger',
      lastSeen: '30 min ago',
      emergencyContact: '+91-9876543211',
      tripInfo: 'Business traveller',
      position: { x: 200, y: 290 }
    }
  ];

  const safetyZones: SafetyZone[] = [
    {
      id: 'zone-1',
      type: 'safe',
      name: 'Central Delhi',
      description: 'High security tourist area',
      color: '#22c55e',
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
      description: 'Crowded market area',
      color: '#eab308',
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
      description: 'Restricted construction zone',
      color: '#ef4444',
      boundary: [
        { x: 160, y: 260 },
        { x: 240, y: 260 },
        { x: 240, y: 320 },
        { x: 160, y: 320 }
      ]
    }
  ];

  const handleTrackTourist = (tourist: Tourist) => {
    setSelectedTourist(tourist);
    setTrackingMode(true);
    toast.info(`Now tracking ${tourist.name}`);
  };

  const handleCallTourist = (contact: string) => {
    toast.info(`Calling ${contact}...`);
  };

  const getTouristStatusColor = (status: string) => {
    switch (status) {
      case 'safe': return 'bg-green-100 text-green-800';
      case 'caution': return 'bg-yellow-100 text-yellow-800';
      case 'danger': return 'bg-red-100 text-red-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  return (
    <div className="space-y-4">
      {/* Authority Control Panel */}
      <Card>
        <CardHeader className="pb-3">
          <div className="flex items-center justify-between">
            <CardTitle className="flex items-center space-x-2">
              <Satellite className="w-5 h-5" />
              <span>Authority Command Center</span>
            </CardTitle>
            <div className="flex items-center space-x-2">
              <Badge className="bg-blue-100 text-blue-800">
                <Users className="w-3 h-3 mr-1" />
                {mockTourists.length} Tourists
              </Badge>
              <Button
                variant={trackingMode ? 'default' : 'outline'}
                size="sm"
                onClick={() => setTrackingMode(!trackingMode)}
              >
                <Eye className="w-4 h-4 mr-1" />
                Live Tracking
              </Button>
            </div>
          </div>
        </CardHeader>
        <CardContent>
          {/* Real-time Map with Tourist Tracking */}
          <div className="relative h-96 bg-gray-200 rounded-lg overflow-hidden border-2 border-gray-300">
            {/* Base satellite map */}
            <div className="absolute inset-0">
              <ImageWithFallback
                src={exampleImage}
                alt="Delhi Authority Map"
                className="w-full h-full object-cover"
              />
            </div>
            
            {/* Safety zone overlays */}
            <div className="absolute inset-0">
              <svg className="w-full h-full">
                {safetyZones.map((zone) => {
                  const points = zone.boundary.map(p => `${p.x},${p.y}`).join(' ');
                  return (
                    <g key={zone.id}>
                      <polygon
                        points={points}
                        fill={`${zone.color}20`}
                        stroke={zone.color}
                        strokeWidth="2"
                        strokeDasharray={zone.type === 'danger' ? '5,3' : 'none'}
                        className="cursor-pointer"
                      />
                      {/* Zone label */}
                      <text
                        x={zone.boundary.reduce((sum, p) => sum + p.x, 0) / zone.boundary.length}
                        y={zone.boundary.reduce((sum, p) => sum + p.y, 0) / zone.boundary.length - 10}
                        textAnchor="middle"
                        className="fill-gray-800 text-xs font-medium drop-shadow-sm pointer-events-none"
                      >
                        {zone.name}
                      </text>
                    </g>
                  );
                })}
              </svg>
            </div>

            {/* Tourist location markers */}
            {mockTourists.map((tourist) => (
              <div
                key={tourist.id}
                className="absolute z-20 cursor-pointer transform -translate-x-1/2 -translate-y-1/2"
                style={{ left: tourist.position.x, top: tourist.position.y }}
                onClick={() => handleTrackTourist(tourist)}
              >
                <div className="relative">
                  <div className={`w-8 h-8 rounded-full border-3 border-white shadow-lg flex items-center justify-center transition-all hover:scale-110 ${
                    tourist.status === 'safe' ? 'bg-green-500' :
                    tourist.status === 'caution' ? 'bg-yellow-500' :
                    'bg-red-500'
                  }`}>
                    <Users className="w-4 h-4 text-white" />
                  </div>
                  
                  {/* Tracking pulse animation for selected tourist */}
                  {selectedTourist?.id === tourist.id && trackingMode && (
                    <div className="absolute top-0 left-0 w-8 h-8 bg-blue-500/30 rounded-full animate-ping"></div>
                  )}
                  
                  {/* Tourist info tooltip */}
                  <div className="absolute -top-12 left-1/2 transform -translate-x-1/2 bg-black/80 text-white px-2 py-1 rounded text-xs whitespace-nowrap opacity-0 hover:opacity-100 transition-opacity pointer-events-none">
                    {tourist.name}
                    <div className="text-xs text-gray-300">{tourist.status.toUpperCase()}</div>
                  </div>
                  
                  {/* Status indicator */}
                  <div className={`absolute -bottom-1 -right-1 w-3 h-3 rounded-full border border-white ${
                    tourist.status === 'safe' ? 'bg-green-400' :
                    tourist.status === 'caution' ? 'bg-yellow-400' :
                    'bg-red-400'
                  }`}></div>
                </div>
              </div>
            ))}

            {/* Map Controls */}
            <div className="absolute top-4 right-4 space-y-2 z-30">
              <Button
                size="sm"
                variant="outline"
                className="bg-white/90 shadow-lg"
                onClick={() => setZoomLevel(prev => Math.min(prev + 1, 18))}
              >
                <ZoomIn className="w-4 h-4" />
              </Button>
              <Button
                size="sm"
                variant="outline"
                className="bg-white/90 shadow-lg"
                onClick={() => setZoomLevel(prev => Math.max(prev - 1, 8))}
              >
                <ZoomOut className="w-4 h-4" />
              </Button>
              <Button
                size="sm"
                variant="outline"
                className="bg-white/90 shadow-lg"
                title="Center map"
              >
                <Compass className="w-4 h-4" />
              </Button>
            </div>

            {/* Authority Actions Panel */}
            <div className="absolute bottom-4 right-4 bg-white/95 rounded-lg p-3 shadow-lg z-30">
              <div className="text-xs font-medium mb-2">Quick Actions</div>
              <div className="space-y-1">
                <Button size="sm" variant="ghost" className="w-full justify-start">
                  <Radio className="w-3 h-3 mr-2" />
                  Broadcast Alert
                </Button>
                <Button size="sm" variant="ghost" className="w-full justify-start">
                  <Target className="w-3 h-3 mr-2" />
                  Dispatch Unit
                </Button>
              </div>
            </div>

            {/* Legend */}
            <div className="absolute top-4 left-4 bg-white/95 rounded-lg p-3 space-y-2 max-w-48 shadow-lg z-30">
              <div className="text-xs font-medium">Status Legend</div>
              <div className="space-y-1">
                <div className="flex items-center space-x-2">
                  <div className="w-3 h-3 bg-green-500 rounded-full"></div>
                  <span className="text-xs">Safe ({mockTourists.filter(t => t.status === 'safe').length})</span>
                </div>
                <div className="flex items-center space-x-2">
                  <div className="w-3 h-3 bg-yellow-500 rounded-full"></div>
                  <span className="text-xs">Caution ({mockTourists.filter(t => t.status === 'caution').length})</span>
                </div>
                <div className="flex items-center space-x-2">
                  <div className="w-3 h-3 bg-red-500 rounded-full"></div>
                  <span className="text-xs">Danger ({mockTourists.filter(t => t.status === 'danger').length})</span>
                </div>
              </div>
              <div className="border-t pt-2 mt-2">
                <div className="text-xs font-medium">Map Info</div>
                <div className="text-xs text-gray-600">
                  Zoom: {zoomLevel}x
                </div>
                <div className="text-xs text-gray-600">
                  Real-time Monitoring
                </div>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Tourist Status Panel */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {/* Safe Tourists */}
        <Card className="border-green-200">
          <CardHeader className="pb-3">
            <CardTitle className="flex items-center space-x-2 text-green-700">
              <Shield className="w-4 h-4" />
              <span>Safe Zone</span>
              <Badge className="bg-green-100 text-green-800">
                {mockTourists.filter(t => t.status === 'safe').length}
              </Badge>
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-2">
              {mockTourists.filter(t => t.status === 'safe').map((tourist) => (
                <div key={tourist.id} className="flex items-center justify-between p-2 bg-green-50 rounded">
                  <div>
                    <div className="text-sm font-medium">{tourist.name}</div>
                    <div className="text-xs text-gray-600">{tourist.location}</div>
                  </div>
                  <Button
                    size="sm"
                    variant="outline"
                    onClick={() => handleTrackTourist(tourist)}
                  >
                    <MapPin className="w-3 h-3" />
                  </Button>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Caution Tourists */}
        <Card className="border-yellow-200">
          <CardHeader className="pb-3">
            <CardTitle className="flex items-center space-x-2 text-yellow-700">
              <AlertTriangle className="w-4 h-4" />
              <span>Caution Zone</span>
              <Badge className="bg-yellow-100 text-yellow-800">
                {mockTourists.filter(t => t.status === 'caution').length}
              </Badge>
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-2">
              {mockTourists.filter(t => t.status === 'caution').map((tourist) => (
                <div key={tourist.id} className="flex items-center justify-between p-2 bg-yellow-50 rounded">
                  <div>
                    <div className="text-sm font-medium">{tourist.name}</div>
                    <div className="text-xs text-gray-600">{tourist.location}</div>
                  </div>
                  <div className="flex space-x-1">
                    <Button
                      size="sm"
                      variant="outline"
                      onClick={() => handleTrackTourist(tourist)}
                    >
                      <MapPin className="w-3 h-3" />
                    </Button>
                    <Button
                      size="sm"
                      variant="outline"
                      onClick={() => handleCallTourist(tourist.emergencyContact)}
                    >
                      <Phone className="w-3 h-3" />
                    </Button>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Danger Tourists */}
        <Card className="border-red-200">
          <CardHeader className="pb-3">
            <CardTitle className="flex items-center space-x-2 text-red-700">
              <X className="w-4 h-4" />
              <span>Danger Zone</span>
              <Badge className="bg-red-100 text-red-800">
                {mockTourists.filter(t => t.status === 'danger').length}
              </Badge>
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-2">
              {mockTourists.filter(t => t.status === 'danger').map((tourist) => (
                <div key={tourist.id} className="flex items-center justify-between p-2 bg-red-50 rounded">
                  <div>
                    <div className="text-sm font-medium">{tourist.name}</div>
                    <div className="text-xs text-gray-600">{tourist.location}</div>
                    <div className="text-xs text-red-600 font-medium">Last seen: {tourist.lastSeen}</div>
                  </div>
                  <div className="flex flex-col space-y-1">
                    <Button
                      size="sm"
                      className="bg-red-600 hover:bg-red-700 text-xs"
                      onClick={() => toast.info('Dispatch unit sent!')}
                    >
                      Dispatch
                    </Button>
                    <Button
                      size="sm"
                      variant="outline"
                      onClick={() => handleCallTourist(tourist.emergencyContact)}
                    >
                      <Phone className="w-3 h-3" />
                    </Button>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Selected Tourist Details */}
      {selectedTourist && (
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center justify-between">
              <span>Tourist Details - {selectedTourist.name}</span>
              <Button
                size="sm"
                variant="ghost"
                onClick={() => setSelectedTourist(null)}
              >
                <X className="w-4 h-4" />
              </Button>
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <h4 className="font-medium mb-2">Personal Information</h4>
                <div className="space-y-1 text-sm">
                  <div><span className="text-gray-600">Digital ID:</span> {selectedTourist.digitalId}</div>
                  <div><span className="text-gray-600">Location:</span> {selectedTourist.location}</div>
                  <div><span className="text-gray-600">Emergency Contact:</span> {selectedTourist.emergencyContact}</div>
                  <div><span className="text-gray-600">Trip Info:</span> {selectedTourist.tripInfo}</div>
                </div>
              </div>
              <div>
                <h4 className="font-medium mb-2">Status & Actions</h4>
                <div className="space-y-2">
                  <Badge className={getTouristStatusColor(selectedTourist.status)}>
                    {selectedTourist.status.toUpperCase()}
                  </Badge>
                  <div className="text-sm text-gray-600">Last seen: {selectedTourist.lastSeen}</div>
                  <div className="flex space-x-2 mt-3">
                    <Button size="sm" onClick={() => handleCallTourist(selectedTourist.emergencyContact)}>
                      <Phone className="w-3 h-3 mr-1" />
                      Call
                    </Button>
                    <Button size="sm" variant="outline">
                      <Radio className="w-3 h-3 mr-1" />
                      Message
                    </Button>
                  </div>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
}
import React, { useState, useRef, useEffect } from 'react';
import { Button } from '../ui/button';
import { Badge } from '../ui/badge';
import { Card, CardContent } from '../ui/card';
import {
  X,
  ZoomIn,
  ZoomOut,
  RotateCcw,
  MapPin,
  Navigation,
  Phone,
  AlertTriangle,
  Users,
  Eye,
  Crosshair,
} from 'lucide-react';
import { ImageWithFallback } from '../figma/ImageWithFallback';

interface TouristLocation {
  id: string;
  name: string;
  digitalId: string;
  latitude: number;
  longitude: number;
  status: 'safe' | 'caution' | 'danger';
  lastSeen: string;
  location: string;
  emergencyContact: string;
  tripInfo: string;
}

interface InteractiveMapViewProps {
  tourists: TouristLocation[];
  onClose: () => void;
  trackingTourist?: TouristLocation | null;
  onCallTourist: (phone: string) => void;
}

export function InteractiveMapView({ 
  tourists, 
  onClose, 
  trackingTourist,
  onCallTourist 
}: InteractiveMapViewProps) {
  const [zoom, setZoom] = useState(1);
  const [center, setCenter] = useState({ x: 50, y: 50 });
  const [isDragging, setIsDragging] = useState(false);
  const [dragStart, setDragStart] = useState({ x: 0, y: 0 });
  const [selectedTourist, setSelectedTourist] = useState<TouristLocation | null>(trackingTourist || null);
  const mapRef = useRef<HTMLDivElement>(null);

  const handleZoom = (direction: 'in' | 'out' | 'reset') => {
    if (direction === 'in') {
      setZoom(prev => Math.min(prev + 0.3, 4));
    } else if (direction === 'out') {
      setZoom(prev => Math.max(prev - 0.3, 0.3));
    } else {
      setZoom(1);
      setCenter({ x: 50, y: 50 });
    }
  };

  const handleMouseDown = (e: React.MouseEvent) => {
    setIsDragging(true);
    setDragStart({ x: e.clientX, y: e.clientY });
  };

  const handleMouseMove = (e: React.MouseEvent) => {
    if (!isDragging) return;
    
    const deltaX = (e.clientX - dragStart.x) / zoom;
    const deltaY = (e.clientY - dragStart.y) / zoom;
    
    setCenter(prev => ({
      x: Math.max(10, Math.min(90, prev.x - deltaX * 0.1)),
      y: Math.max(10, Math.min(90, prev.y - deltaY * 0.1))
    }));
    
    setDragStart({ x: e.clientX, y: e.clientY });
  };

  const handleMouseUp = () => {
    setIsDragging(false);
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'safe': return 'bg-green-500';
      case 'caution': return 'bg-yellow-500';
      case 'danger': return 'bg-red-500';
      default: return 'bg-gray-500';
    }
  };

  const getTouristPositions = () => {
    // Generate semi-realistic positions based on tourist data
    return tourists.map((tourist, index) => {
      const basePositions = [
        { top: 25, left: 30 },
        { top: 40, left: 65 },
        { top: 60, left: 25 },
        { top: 70, left: 80 },
        { top: 35, left: 50 },
        { top: 55, left: 75 },
        { top: 45, left: 20 },
        { top: 65, left: 55 },
        { top: 30, left: 75 },
        { top: 50, left: 40 },
        { top: 75, left: 30 },
        { top: 25, left: 60 },
        { top: 80, left: 70 },
        { top: 15, left: 45 },
        { top: 85, left: 50 },
        { top: 20, left: 80 },
        { top: 90, left: 25 },
        { top: 10, left: 35 },
        { top: 95, left: 60 },
        { top: 5, left: 70 },
      ];
      
      const position = basePositions[index % basePositions.length];
      return {
        ...tourist,
        position: {
          top: position.top + (Math.random() - 0.5) * 5,
          left: position.left + (Math.random() - 0.5) * 5
        }
      };
    });
  };

  const touristPositions = getTouristPositions();
  const safeTourists = tourists.filter(t => t.status === 'safe').length;
  const cautionTourists = tourists.filter(t => t.status === 'caution').length;
  const dangerTourists = tourists.filter(t => t.status === 'danger').length;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center p-4">
      <div className="w-full h-full max-w-7xl max-h-[95vh] bg-white rounded-lg shadow-xl overflow-hidden">
        <div 
          className="h-full relative cursor-grab active:cursor-grabbing"
          onMouseDown={handleMouseDown}
          onMouseMove={handleMouseMove}
          onMouseUp={handleMouseUp}
          onMouseLeave={handleMouseUp}
          ref={mapRef}
        >
          {/* Map Container */}
          <div 
            className="w-full h-full overflow-hidden relative transition-transform duration-300 ease-out"
            style={{
              transform: `scale(${zoom}) translate(${(center.x - 50) * 2}px, ${(center.y - 50) * 2}px)`,
              transformOrigin: 'center center'
            }}
          >
            <ImageWithFallback
              src="https://images.unsplash.com/photo-1625428354222-ce52b4227b26?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxzYXRlbGxpdGUlMjB2aWV3JTIwY2l0eSUyMGFlcmlhbHxlbnwxfHx8fDE3NTg4MjczODh8MA&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral"
              alt="Real Location Satellite View"
              className="w-full h-full object-cover"
              style={{ userSelect: 'none', pointerEvents: 'none' }}
            />
            
            {/* Grid Overlay */}
            <div className="absolute inset-0 opacity-20">
              <svg width="100%" height="100%" className="absolute inset-0">
                <defs>
                  <pattern id="grid" width="40" height="40" patternUnits="userSpaceOnUse">
                    <path d="M 40 0 L 0 0 0 40" fill="none" stroke="#000" strokeWidth="0.5"/>
                  </pattern>
                </defs>
                <rect width="100%" height="100%" fill="url(#grid)" />
              </svg>
            </div>

            {/* Tourist Markers */}
            {touristPositions.map((tourist) => (
              <div
                key={tourist.id}
                className="absolute cursor-pointer transform -translate-x-1/2 -translate-y-1/2 z-10"
                style={{
                  top: `${tourist.position.top}%`,
                  left: `${tourist.position.left}%`
                }}
                onClick={(e) => {
                  e.stopPropagation();
                  setSelectedTourist(tourist);
                }}
              >
                <div className="relative group">
                  {/* Marker */}
                  <div className={`w-6 h-6 rounded-full border-3 border-white shadow-lg ${getStatusColor(tourist.status)} ${
                    tourist.status === 'danger' ? 'animate-pulse' : ''
                  } ${selectedTourist?.id === tourist.id ? 'ring-4 ring-blue-400' : ''}`}>
                    <div className="w-full h-full rounded-full bg-white bg-opacity-30"></div>
                  </div>
                  
                  {/* Pulse Animation for Danger */}
                  {tourist.status === 'danger' && (
                    <div className="absolute inset-0 w-6 h-6 rounded-full bg-red-500 animate-ping opacity-30"></div>
                  )}
                  
                  {/* Quick Tooltip */}
                  <div className="absolute bottom-8 left-1/2 transform -translate-x-1/2 bg-black bg-opacity-80 text-white text-xs rounded px-2 py-1 opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap z-20">
                    {tourist.name} • {tourist.status}
                  </div>
                </div>
              </div>
            ))}
          </div>

          {/* Map Controls */}
          <div className="absolute top-4 right-4 flex flex-col space-y-2 z-30">
            <Button
              variant="outline"
              size="sm"
              onClick={() => handleZoom('in')}
              className="bg-white hover:bg-gray-50 shadow-md"
              disabled={zoom >= 4}
            >
              <ZoomIn className="w-4 h-4" />
            </Button>
            <Button
              variant="outline"
              size="sm"
              onClick={() => handleZoom('out')}
              className="bg-white hover:bg-gray-50 shadow-md"
              disabled={zoom <= 0.3}
            >
              <ZoomOut className="w-4 h-4" />
            </Button>
            <Button
              variant="outline"
              size="sm"
              onClick={() => handleZoom('reset')}
              className="bg-white hover:bg-gray-50 shadow-md"
            >
              <RotateCcw className="w-4 h-4" />
            </Button>
          </div>

          {/* Header */}
          <div className="absolute top-4 left-4 right-20 z-30">
            <div className="flex items-start justify-between">
              <div className="space-y-2">
                <Badge className="bg-blue-600 text-white shadow-md">
                  <MapPin className="w-4 h-4 mr-1" />
                  Live Tourist Tracking
                </Badge>
                <div className="flex flex-wrap gap-2">
                  <Badge className="bg-green-100 text-green-800 shadow-sm">
                    🟢 Safe ({safeTourists})
                  </Badge>
                  <Badge className="bg-yellow-100 text-yellow-800 shadow-sm">
                    ⚠️ Caution ({cautionTourists})
                  </Badge>
                  <Badge className="bg-red-100 text-red-800 shadow-sm">
                    🚨 Danger ({dangerTourists})
                  </Badge>
                </div>
              </div>

              <Button
                variant="outline"
                size="sm"
                onClick={onClose}
                className="bg-white shadow-md"
              >
                <X className="w-4 h-4 mr-2" />
                Close Map
              </Button>
            </div>
          </div>

          {/* Tourist Details Panel */}
          {selectedTourist && (
            <div className="absolute bottom-4 left-4 max-w-sm z-30">
              <Card className="shadow-lg">
                <CardContent className="p-4">
                  <div className="flex items-center justify-between mb-3">
                    <h4 className="font-medium text-lg">{selectedTourist.name}</h4>
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => setSelectedTourist(null)}
                    >
                      <X className="w-4 h-4" />
                    </Button>
                  </div>
                  
                  <div className="space-y-2 text-sm">
                    <div className="flex items-center space-x-2">
                      <Badge className={`${
                        selectedTourist.status === 'safe' ? 'bg-green-100 text-green-800' :
                        selectedTourist.status === 'caution' ? 'bg-yellow-100 text-yellow-800' :
                        'bg-red-100 text-red-800'
                      }`}>
                        {selectedTourist.status.toUpperCase()}
                      </Badge>
                    </div>
                    
                    <div className="space-y-1">
                      <p><span className="font-medium">Digital ID:</span> {selectedTourist.digitalId}</p>
                      <p><span className="font-medium">Location:</span> {selectedTourist.location}</p>
                      <p><span className="font-medium">Last Seen:</span> {selectedTourist.lastSeen}</p>
                      <p><span className="font-medium">Trip:</span> {selectedTourist.tripInfo}</p>
                    </div>
                  </div>
                  
                  <div className="flex space-x-2 mt-4">
                    <Button size="sm" variant="outline" className="flex-1">
                      <Navigation className="w-3 h-3 mr-1" />
                      Navigate
                    </Button>
                    <Button 
                      size="sm" 
                      variant="outline" 
                      className="flex-1"
                      onClick={() => onCallTourist(selectedTourist.emergencyContact)}
                    >
                      <Phone className="w-3 h-3 mr-1" />
                      Call
                    </Button>
                  </div>
                </CardContent>
              </Card>
            </div>
          )}

          {/* Map Legend */}
          <div className="absolute bottom-4 right-4 z-30">
            <Card className="shadow-lg">
              <CardContent className="p-3">
                <h5 className="font-medium text-sm mb-2">Map Legend</h5>
                <div className="space-y-1 text-xs">
                  <div className="flex items-center space-x-2">
                    <div className="w-3 h-3 rounded-full bg-green-500"></div>
                    <span>Safe Zone</span>
                  </div>
                  <div className="flex items-center space-x-2">
                    <div className="w-3 h-3 rounded-full bg-yellow-500"></div>
                    <span>Caution Zone</span>
                  </div>
                  <div className="flex items-center space-x-2">
                    <div className="w-3 h-3 rounded-full bg-red-500 animate-pulse"></div>
                    <span>Danger Zone</span>
                  </div>
                </div>
                <div className="mt-2 pt-2 border-t text-xs text-gray-600">
                  Zoom: {Math.round(zoom * 100)}%
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Zoom Level Indicator */}
          <div className="absolute top-1/2 right-4 transform -translate-y-1/2 z-20">
            <div className="bg-black bg-opacity-50 text-white text-xs px-2 py-1 rounded">
              {Math.round(zoom * 100)}%
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
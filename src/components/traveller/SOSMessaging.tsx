import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '../ui/card';
import { Button } from '../ui/button';
import { Badge } from '../ui/badge';
import { Input } from '../ui/input';
import { Textarea } from '../ui/textarea';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '../ui/dialog';
import { Language, User } from '../../App';
import { 
  AlertTriangle, 
  Phone, 
  MessageSquare, 
  MapPin, 
  Clock, 
  Send,
  Mic,
  Camera,
  Shield,
  Users,
  Smartphone,
  Radio,
  CheckCircle,
  X,
  Volume2,
  Heart,
  Zap
} from 'lucide-react';
import { toast } from 'sonner@2.0.3';

interface SOSMessagingProps {
  language: Language;
  user: User | null;
  currentLocation?: {
    latitude: number;
    longitude: number;
  };
}

interface SOSMessage {
  id: string;
  type: 'emergency' | 'assistance' | 'medical' | 'security';
  message: string;
  timestamp: Date;
  location: {
    latitude: number;
    longitude: number;
    address: string;
  };
  status: 'sent' | 'acknowledged' | 'responding' | 'resolved';
  recipients: string[];
  priority: 'low' | 'medium' | 'high' | 'critical';
  response?: string;
}

interface EmergencyContact {
  id: string;
  name: string;
  phone: string;
  relation: string;
  isPrimary: boolean;
}

export function SOSMessaging({ language, user, currentLocation }: SOSMessagingProps) {
  const [isSOSActive, setIsSOSActive] = useState(false);
  const [sosMessages, setSOSMessages] = useState<SOSMessage[]>([]);
  const [customMessage, setCustomMessage] = useState('');
  const [selectedType, setSelectedType] = useState<'emergency' | 'assistance' | 'medical' | 'security'>('emergency');
  const [emergencyContacts] = useState<EmergencyContact[]>([
    {
      id: '1',
      name: user?.emergencyName || 'Emergency Contact',
      phone: user?.emergencyPhone || '+91 9876543210',
      relation: 'Primary Contact',
      isPrimary: true
    },
    {
      id: '2',
      name: 'Police Emergency',
      phone: '100',
      relation: 'Police',
      isPrimary: false
    },
    {
      id: '3',
      name: 'Ambulance Service',
      phone: '108',
      relation: 'Ambulance',
      isPrimary: false
    },
    {
      id: '4',
      name: 'Fire Department',
      phone: '101',
      relation: 'Fire',
      isPrimary: false
    },
    {
      id: '5',
      name: 'Tourist Helpline',
      phone: '1363',
      relation: 'Support',
      isPrimary: false
    }
  ]);

  const sosTypes = [
    {
      id: 'emergency',
      name: 'Emergency',
      icon: AlertTriangle,
      color: 'bg-red-600',
      description: 'Immediate danger or life-threatening situation'
    },
    {
      id: 'medical',
      name: 'Medical',
      icon: Heart,
      color: 'bg-pink-600',
      description: 'Medical assistance or health emergency'
    },
    {
      id: 'security',
      name: 'Security',
      icon: Shield,
      color: 'bg-orange-600',
      description: 'Security threat or suspicious activity'
    },
    {
      id: 'assistance',
      name: 'Assistance',
      icon: Users,
      color: 'bg-blue-600',
      description: 'General help or support needed'
    }
  ];

  const quickMessages = [
    "I need immediate help!",
    "I'm in danger, please send help",
    "Medical emergency - need ambulance",
    "I'm lost and need assistance",
    "Suspicious activity around me",
    "I don't feel safe here"
  ];

  const sendSOS = async (message: string, type: typeof selectedType) => {
    const newSOS: SOSMessage = {
      id: `sos-${Date.now()}`,
      type,
      message,
      timestamp: new Date(),
      location: {
        latitude: currentLocation?.latitude || 12.9716,
        longitude: currentLocation?.longitude || 77.5946,
        address: 'Current Location - Bangalore, Karnataka'
      },
      status: 'sent',
      recipients: emergencyContacts.map(contact => contact.name),
      priority: type === 'emergency' ? 'critical' : type === 'medical' ? 'high' : 'medium'
    };

    setSOSMessages(prev => [newSOS, ...prev]);
    setIsSOSActive(true);

    // Simulate response after 2-5 seconds
    setTimeout(() => {
      setSOSMessages(prev => prev.map(msg => 
        msg.id === newSOS.id 
          ? { ...msg, status: 'acknowledged', response: 'Help is on the way! ETA: 10-15 minutes.' }
          : msg
      ));
      toast.success('SOS acknowledged! Help is on the way.');
    }, Math.random() * 3000 + 2000);

    toast.success(`${type.toUpperCase()} SOS sent to all emergency contacts!`);
  };

  const sendQuickSOS = () => {
    sendSOS("EMERGENCY! I need immediate help at my current location.", 'emergency');
  };

  const sendCustomSOS = () => {
    if (customMessage.trim()) {
      sendSOS(customMessage, selectedType);
      setCustomMessage('');
    }
  };

  const cancelSOS = () => {
    setIsSOSActive(false);
    setSOSMessages(prev => prev.map(msg => ({ ...msg, status: 'resolved' })));
    toast.info('SOS cancelled - situation resolved');
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'sent':
        return 'text-blue-600';
      case 'acknowledged':
        return 'text-yellow-600';
      case 'responding':
        return 'text-orange-600';
      case 'resolved':
        return 'text-green-600';
      default:
        return 'text-gray-600';
    }
  };

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'sent':
        return <Badge className="bg-blue-600 text-white">Sent</Badge>;
      case 'acknowledged':
        return <Badge className="bg-yellow-600 text-white">Acknowledged</Badge>;
      case 'responding':
        return <Badge className="bg-orange-600 text-white">Responding</Badge>;
      case 'resolved':
        return <Badge className="bg-green-600 text-white">Resolved</Badge>;
      default:
        return <Badge variant="outline">Unknown</Badge>;
    }
  };

  const recentMessages = sosMessages.slice(0, 3);

  return (
    <div className="space-y-6">
      {/* Quick Emergency SOS */}
      <Card className={`border-2 ${isSOSActive ? 'border-red-500 bg-red-50' : 'border-red-200'}`}>
        <CardContent className="pt-6">
          <div className="text-center space-y-4">
            <div className="relative">
              <Button
                onClick={sendQuickSOS}
                className={`w-24 h-24 rounded-full text-white shadow-xl transform transition-all duration-200 ${
                  isSOSActive 
                    ? 'bg-red-700 scale-110 animate-pulse' 
                    : 'bg-red-600 hover:bg-red-700 hover:scale-105'
                }`}
                disabled={isSOSActive}
              >
                <div className="text-center">
                  <AlertTriangle className="w-8 h-8 mx-auto" />
                  <p className="text-xs mt-1 font-bold">SOS</p>
                </div>
              </Button>
              {isSOSActive && (
                <div className="absolute -top-2 -right-2">
                  <div className="w-6 h-6 bg-red-500 rounded-full flex items-center justify-center">
                    <span className="text-white text-xs">!</span>
                  </div>
                </div>
              )}
            </div>
            
            <div>
              <h3 className="font-semibold text-red-700">Emergency SOS</h3>
              <p className="text-sm text-gray-600">
                Press and hold for 3 seconds to send emergency alert
              </p>
            </div>

            {isSOSActive && (
              <div className="space-y-2">
                <div className="flex items-center justify-center space-x-2 text-red-600">
                  <Zap className="w-4 h-4 animate-pulse" />
                  <span className="text-sm font-medium">SOS ACTIVE</span>
                </div>
                <Button
                  onClick={cancelSOS}
                  variant="outline"
                  size="sm"
                  className="border-red-300 text-red-600 hover:bg-red-50"
                >
                  Cancel SOS
                </Button>
              </div>
            )}
          </div>
        </CardContent>
      </Card>

      {/* SOS Types */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center space-x-2">
            <MessageSquare className="w-5 h-5" />
            <span>Send Specific SOS</span>
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-2 gap-3 mb-4">
            {sosTypes.map((type) => {
              const IconComponent = type.icon;
              return (
                <Dialog key={type.id}>
                  <DialogTrigger asChild>
                    <Button
                      variant="outline"
                      className="h-auto p-4 text-left"
                      onClick={() => setSelectedType(type.id as any)}
                    >
                      <div className="flex items-center space-x-3">
                        <div className={`w-8 h-8 rounded-full ${type.color} flex items-center justify-center`}>
                          <IconComponent className="w-4 h-4 text-white" />
                        </div>
                        <div>
                          <div className="font-medium">{type.name}</div>
                          <div className="text-xs text-gray-500">{type.description}</div>
                        </div>
                      </div>
                    </Button>
                  </DialogTrigger>
                  <DialogContent>
                    <DialogHeader>
                      <DialogTitle>Send {type.name} SOS</DialogTitle>
                    </DialogHeader>
                    <div className="space-y-4">
                      <div>
                        <label className="text-sm font-medium">Quick Messages</label>
                        <div className="grid grid-cols-1 gap-2 mt-2">
                          {quickMessages.slice(0, 3).map((msg, index) => (
                            <Button
                              key={index}
                              variant="outline"
                              size="sm"
                              onClick={() => sendSOS(msg, type.id as any)}
                              className="text-left justify-start"
                            >
                              {msg}
                            </Button>
                          ))}
                        </div>
                      </div>
                      
                      <div>
                        <label className="text-sm font-medium">Custom Message</label>
                        <Textarea
                          value={customMessage}
                          onChange={(e) => setCustomMessage(e.target.value)}
                          placeholder="Describe your situation..."
                          className="mt-2"
                        />
                        <Button
                          onClick={sendCustomSOS}
                          className="w-full mt-2"
                          disabled={!customMessage.trim()}
                        >
                          <Send className="w-4 h-4 mr-2" />
                          Send {type.name} SOS
                        </Button>
                      </div>
                    </div>
                  </DialogContent>
                </Dialog>
              );
            })}
          </div>
        </CardContent>
      </Card>

      {/* Recent SOS Messages */}
      {recentMessages.length > 0 && (
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center space-x-2">
              <Clock className="w-5 h-5" />
              <span>Recent SOS Messages</span>
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {recentMessages.map((message) => (
                <div key={message.id} className="border rounded-lg p-3">
                  <div className="flex items-start justify-between mb-2">
                    <div className="flex items-center space-x-2">
                      {getStatusBadge(message.status)}
                      <Badge variant="outline" className="capitalize">
                        {message.type}
                      </Badge>
                    </div>
                    <span className="text-xs text-gray-500">
                      {message.timestamp.toLocaleTimeString()}
                    </span>
                  </div>
                  
                  <p className="text-sm text-gray-700 mb-2">{message.message}</p>
                  
                  {message.response && (
                    <div className="bg-green-50 border border-green-200 rounded p-2 mt-2">
                      <div className="flex items-center space-x-2 mb-1">
                        <CheckCircle className="w-4 h-4 text-green-600" />
                        <span className="text-xs font-medium text-green-700">Response</span>
                      </div>
                      <p className="text-xs text-green-700">{message.response}</p>
                    </div>
                  )}
                  
                  <div className="flex items-center space-x-4 mt-2 text-xs text-gray-500">
                    <div className="flex items-center space-x-1">
                      <MapPin className="w-3 h-3" />
                      <span>{message.location.address}</span>
                    </div>
                    <div className="flex items-center space-x-1">
                      <Users className="w-3 h-3" />
                      <span>{message.recipients.length} contacts</span>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      )}

      {/* Emergency Contacts */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center space-x-2">
            <Phone className="w-5 h-5" />
            <span>Emergency Contacts</span>
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-2">
            {emergencyContacts.map((contact) => (
              <div key={contact.id} className="flex items-center justify-between p-2 border rounded">
                <div>
                  <div className="font-medium">{contact.name}</div>
                  <div className="text-sm text-gray-600">{contact.phone} • {contact.relation}</div>
                </div>
                {contact.isPrimary && (
                  <Badge variant="outline" className="text-blue-600 border-blue-600">
                    Primary
                  </Badge>
                )}
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Feature Overview */}
      <Card>
        <CardHeader>
          <CardTitle>SOS Features</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-2 gap-4 text-sm">
            <div className="space-y-2">
              <div className="flex items-center space-x-2">
                <Smartphone className="w-4 h-4 text-blue-500" />
                <span>Instant location sharing</span>
              </div>
              <div className="flex items-center space-x-2">
                <Radio className="w-4 h-4 text-green-500" />
                <span>Multiple contact alerts</span>
              </div>
              <div className="flex items-center space-x-2">
                <Volume2 className="w-4 h-4 text-purple-500" />
                <span>Audio recording</span>
              </div>
            </div>
            <div className="space-y-2">
              <div className="flex items-center space-x-2">
                <Camera className="w-4 h-4 text-orange-500" />
                <span>Photo evidence</span>
              </div>
              <div className="flex items-center space-x-2">
                <Shield className="w-4 h-4 text-red-500" />
                <span>Authority integration</span>
              </div>
              <div className="flex items-center space-x-2">
                <CheckCircle className="w-4 h-4 text-green-500" />
                <span>Response tracking</span>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
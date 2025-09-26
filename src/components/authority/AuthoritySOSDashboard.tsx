import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '../ui/card';
import { Button } from '../ui/button';
import { Badge } from '../ui/badge';
import { Input } from '../ui/input';
import { Label } from '../ui/label';
import { Textarea } from '../ui/textarea';
import { ScrollArea } from '../ui/scroll-area';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '../ui/dialog';
import { Alert, AlertDescription } from '../ui/alert';
import { Language } from '../../App';
import { 
  AlertTriangle,
  MapPin,
  Clock,
  User,
  Phone,
  MessageSquare,
  Send,
  CheckCircle,
  Loader2,
  RefreshCw,
  Bell,
  Navigation
} from 'lucide-react';
import { mockAuth, AuthorityNotification, SOSAlert } from '../../utils/mockAuth';
import { toast } from 'sonner@2.0.3';


interface AuthoritySOSDashboardProps {
  language: Language;
}

export function AuthoritySOSDashboard({ language }: AuthoritySOSDashboardProps) {
  const [sosAlerts, setSosAlerts] = useState<SOSAlert[]>([]);
  const [notifications, setNotifications] = useState<AuthorityNotification[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [selectedAlert, setSelectedAlert] = useState<any>(null);
  const [responseData, setResponseData] = useState({
    response: '',
    estimatedArrival: '',
    status: 'responding'
  });

  useEffect(() => {
    loadDashboardData();
    // Set up auto-refresh every 30 seconds
    const interval = setInterval(loadDashboardData, 30000);
    return () => clearInterval(interval);
  }, []); // loadDashboardData is defined in the component, so it's safe to omit

  const loadDashboardData = async () => {
    try {
      setIsLoading(true);
      
      // Load active SOS alerts
      const alerts = await mockAuth.getSOSAlerts();
      setSosAlerts(alerts);
      
      // Load notifications
      const notifs = await mockAuth.getAuthorityNotifications();
      setNotifications(notifs);
      
    } catch (error) {
      console.error('Error loading dashboard data:', error);
      toast.error('Failed to load dashboard data');
    } finally {
      setIsLoading(false);
    }
  };

  const refreshDashboard = async () => {
    setIsRefreshing(true);
    await loadDashboardData();
    setIsRefreshing(false);
    toast.success('Dashboard refreshed');
  };

  const respondToSOS = async (sosId: string) => {
    try {
      await mockAuth.respondToSOS(sosId, responseData);
      
      // Update local state
      setSosAlerts(prev => prev.map(alert => 
        alert.id === sosId ? { ...alert, status: responseData.status, respondingAuthority: 'current' } : alert
      ));
      
      // Reset form
      setResponseData({
        response: '',
        estimatedArrival: '',
        status: 'responding'
      });
      
      setSelectedAlert(null);
      toast.success('Response sent to emergency caller!');
    } catch (error) {
      console.error('Error responding to SOS:', error);
      toast.error('Failed to send response');
    }
  };

  const markNotificationAsRead = async (notificationId: string) => {
    try {
      // Simulate marking notification as read
      setNotifications(prev => prev.map(notif => 
        notif.id === notificationId ? { ...notif, isRead: true } : notif
      ));
    } catch (error) {
      console.error('Error marking notification as read:', error);
    }
  };

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case 'high':
        return 'text-red-600 border-red-200 bg-red-50';
      case 'moderate':
        return 'text-yellow-600 border-yellow-200 bg-yellow-50';
      default:
        return 'text-blue-600 border-blue-200 bg-blue-50';
    }
  };

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'active':
        return <Badge variant="destructive">ACTIVE</Badge>;
      case 'responding':
        return <Badge variant="secondary">RESPONDING</Badge>;
      case 'resolved':
        return <Badge variant="default">RESOLVED</Badge>;
      default:
        return <Badge variant="outline">{status}</Badge>;
    }
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-64">
        <Loader2 className="w-8 h-8 animate-spin" />
      </div>
    );
  }

  return (
    <div className="space-y-6 p-4">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-xl font-semibold">Authority Dashboard</h2>
          <p className="text-gray-600">Monitor and respond to emergency situations</p>
        </div>
        <Button
          variant="outline"
          onClick={refreshDashboard}
          disabled={isRefreshing}
        >
          <RefreshCw className={`w-4 h-4 mr-2 ${isRefreshing ? 'animate-spin' : ''}`} />
          Refresh
        </Button>
      </div>

      {/* Stats Overview */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <Card>
          <CardContent className="pt-6">
            <div className="text-center">
              <div className="text-2xl font-bold text-red-600">
                {sosAlerts.filter(alert => alert.status === 'active').length}
              </div>
              <div className="text-sm text-gray-600">Active SOS Alerts</div>
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardContent className="pt-6">
            <div className="text-center">
              <div className="text-2xl font-bold text-yellow-600">
                {sosAlerts.filter(alert => alert.status === 'responding').length}
              </div>
              <div className="text-sm text-gray-600">Being Handled</div>
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardContent className="pt-6">
            <div className="text-center">
              <div className="text-2xl font-bold text-blue-600">
                {notifications.filter(notif => !notif.isRead).length}
              </div>
              <div className="text-sm text-gray-600">Unread Notifications</div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Active SOS Alerts */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center space-x-2">
            <AlertTriangle className="w-5 h-5 text-red-500" />
            <span>Emergency SOS Alerts</span>
            {sosAlerts.filter(alert => alert.status === 'active').length > 0 && (
              <Badge variant="destructive" className="ml-auto">
                {sosAlerts.filter(alert => alert.status === 'active').length} Active
              </Badge>
            )}
          </CardTitle>
        </CardHeader>
        <CardContent>
          {sosAlerts.length === 0 ? (
            <div className="text-center py-8 text-gray-500">
              <CheckCircle className="w-12 h-12 mx-auto mb-4 text-green-500" />
              <p>No active emergency alerts</p>
              <p className="text-sm">All clear in your area</p>
            </div>
          ) : (
            <ScrollArea className="h-96">
              <div className="space-y-4">
                {sosAlerts.map((alert) => (
                  <div
                    key={alert.id}
                    className={`p-4 rounded-lg border ${getPriorityColor(alert.priority || 'high')}`}
                  >
                    <div className="flex items-start justify-between">
                      <div className="flex-1">
                        <div className="flex items-center space-x-2 mb-2">
                          {getStatusBadge(alert.status)}
                          <Badge variant="outline">
                            {alert.type || 'Emergency'}
                          </Badge>
                          <Badge variant="outline" className="bg-red-100 text-red-700">
                            SOS #{alert.id.split('-')[1]}
                          </Badge>
                        </div>
                        
                        <div className="space-y-2">
                          <div className="flex items-center space-x-2">
                            <User className="w-4 h-4" />
                            <span className="font-medium">
                              {alert.userProfile?.firstName} {alert.userProfile?.lastName}
                            </span>
                            <span className="text-sm text-gray-600">
                              ({alert.userProfile?.digitalId})
                            </span>
                          </div>
                          
                          <div className="flex items-center space-x-2">
                            <Phone className="w-4 h-4" />
                            <span>{alert.userProfile?.phone}</span>
                          </div>
                          
                          <div className="flex items-center space-x-2">
                            <MapPin className="w-4 h-4" />
                            <span className="text-sm">
                              {alert.location.latitude.toFixed(6)}, {alert.location.longitude.toFixed(6)}
                            </span>
                            <Button
                              variant="link"
                              size="sm"
                              className="p-0 h-auto text-blue-600"
                              onClick={() => {
                                const url = `https://maps.google.com/maps?q=${alert.location.latitude},${alert.location.longitude}`;
                                window.open(url, '_blank');
                              }}
                            >
                              <Navigation className="w-3 h-3 mr-1" />
                              View on Map
                            </Button>
                          </div>
                          
                          <div className="flex items-center space-x-2">
                            <Clock className="w-4 h-4" />
                            <span className="text-sm">
                              {new Date(alert.timestamp).toLocaleString()}
                            </span>
                          </div>
                          
                          {alert.message && (
                            <div className="bg-white p-2 rounded border-l-4 border-red-500">
                              <p className="text-sm">{alert.message}</p>
                            </div>
                          )}
                        </div>
                      </div>
                      
                      <div className="ml-4">
                        {alert.status === 'active' && (
                          <Dialog>
                            <DialogTrigger asChild>
                              <Button 
                                className="bg-blue-600 hover:bg-blue-700"
                                onClick={() => setSelectedAlert(alert)}
                              >
                                <Send className="w-4 h-4 mr-2" />
                                Respond
                              </Button>
                            </DialogTrigger>
                            <DialogContent className="max-w-md">
                              <DialogHeader>
                                <DialogTitle>Respond to Emergency</DialogTitle>
                              </DialogHeader>
                              <div className="space-y-4">
                                <div>
                                  <Label htmlFor="response">Response Message</Label>
                                  <Textarea
                                    id="response"
                                    value={responseData.response}
                                    onChange={(e) => setResponseData(prev => ({ ...prev, response: e.target.value }))}
                                    placeholder="Enter your response message to the caller..."
                                    rows={3}
                                  />
                                </div>
                                
                                <div>
                                  <Label htmlFor="eta">Estimated Arrival (optional)</Label>
                                  <Input
                                    id="eta"
                                    value={responseData.estimatedArrival}
                                    onChange={(e) => setResponseData(prev => ({ ...prev, estimatedArrival: e.target.value }))}
                                    placeholder="e.g., 15 minutes, 2:30 PM"
                                  />
                                </div>
                                
                                <Button
                                  onClick={() => respondToSOS(alert.id)}
                                  className="w-full"
                                  disabled={!responseData.response.trim()}
                                >
                                  <Send className="w-4 h-4 mr-2" />
                                  Send Response
                                </Button>
                              </div>
                            </DialogContent>
                          </Dialog>
                        )}
                        
                        {alert.status === 'responding' && (
                          <Badge variant="secondary">You're responding</Badge>
                        )}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </ScrollArea>
          )}
        </CardContent>
      </Card>

      {/* Notifications */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center space-x-2">
            <Bell className="w-5 h-5" />
            <span>Recent Notifications</span>
            {notifications.filter(notif => !notif.isRead).length > 0 && (
              <Badge variant="secondary">
                {notifications.filter(notif => !notif.isRead).length} New
              </Badge>
            )}
          </CardTitle>
        </CardHeader>
        <CardContent>
          {notifications.length === 0 ? (
            <div className="text-center py-4 text-gray-500">
              <p>No recent notifications</p>
            </div>
          ) : (
            <ScrollArea className="h-64">
              <div className="space-y-3">
                {notifications.slice(0, 10).map((notification) => (
                  <div
                    key={notification.id}
                    className={`p-3 rounded-lg border cursor-pointer transition-colors ${
                      notification.isRead 
                        ? 'bg-gray-50 border-gray-200' 
                        : 'bg-blue-50 border-blue-200 hover:bg-blue-100'
                    }`}
                    onClick={() => !notification.isRead && markNotificationAsRead(notification.id)}
                  >
                    <div className="flex items-start justify-between">
                      <div className="flex-1">
                        <div className="flex items-center space-x-2 mb-1">
                          <span className="font-medium text-sm">{notification.title}</span>
                          {!notification.isRead && (
                            <div className="w-2 h-2 bg-blue-500 rounded-full"></div>
                          )}
                        </div>
                        <p className="text-sm text-gray-600">{notification.message}</p>
                        <div className="flex items-center space-x-2 mt-1">
                          <Clock className="w-3 h-3 text-gray-400" />
                          <span className="text-xs text-gray-500">
                            {new Date(notification.timestamp).toLocaleString()}
                          </span>
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </ScrollArea>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
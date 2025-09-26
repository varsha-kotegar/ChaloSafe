import React, { useState, useEffect } from "react";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "../ui/card";
import { Button } from "../ui/button";
import { Badge } from "../ui/badge";
import { Progress } from "../ui/progress";
import { Alert, AlertDescription } from "../ui/alert";
import { ScrollArea } from "../ui/scroll-area";
import { Language } from "../../App";
import {
  Shield,
  AlertTriangle,
  CheckCircle,
  MapPin,
  Clock,
  Brain,
  Phone,
  MessageSquare,
  Loader2,
  RefreshCw,
  ShoppingBag,
  Watch,
  Smartphone,
  Wifi,
  Heart,
  Activity,
  Battery,
  ArrowLeft,
} from "lucide-react";
import { mockAuth, SafetyAlert } from "../../utils/mockAuth";
import { toast } from "sonner@2.0.3";
import { ImageWithFallback } from "../figma/ImageWithFallback";

interface SafetyDashboardProps {
  language: Language;
}

type SafetyView = "dashboard" | "bookings" | "device-details";

interface SafetyDevice {
  id: string;
  name: string;
  price: string;
  features: string[];
  image: string;
  icon: React.ComponentType<{ className?: string }>;
  description: string;
  batteryLife: string;
  connectivity: string;
  waterResistant: boolean;
}

export function SafetyDashboard({
  language,
}: SafetyDashboardProps) {
  const [safetyScore, setSafetyScore] = useState(100);
  const [alerts, setAlerts] = useState<SafetyAlert[]>([]);
  const [recommendations, setRecommendations] = useState<
    string[]
  >([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [currentView, setCurrentView] =
    useState<SafetyView>("dashboard");
  const [selectedDevice, setSelectedDevice] =
    useState<SafetyDevice | null>(null);

  const safetyDevices: SafetyDevice[] = [
    {
      id: "smart-band",
      name: "Smart Safety Band",
      price: "₹2,499",
      description:
        "Advanced wearable safety device with real-time monitoring and emergency features.",
      features: [
        "Heart rate monitoring",
        "Manual SOS button",
        "Fall detection",
        "GPS tracking",
        "Emergency contacts sync",
        "Rechargeable battery"
      ],
      image:
        "https://images.unsplash.com/photo-1544117519-31a4b719223d?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxzbWFydCUyMHdhdGNofGVufDB8fHx8MTczNTE0NzI5Mnww&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral",
      icon: Watch,
      batteryLife: "Rechargeable battery",
      connectivity: "Satellite",
      waterResistant: true,
    },
    {
      id: "smart-tag",
      name: "Ultra Compact Smart Tag",
      price: "₹899",
      description:
        "Smallest tracking device with powerful safety features in a compact design.",
      features: [
        "SOS button",
        "GPS tracking",
        "Rechargeable battery",
        "Waterproof",
        "Satellite",
      ],
      image:
        "https://assets.mofoprod.net/network/images/Samsung_Galaxy_SmartTag_2.original_b5Cm9QS.jpg",
      icon: Smartphone,
      batteryLife: "Rechargeable Battery",
      connectivity: "Satellite",
      waterResistant: true,
    },   
  ];

  useEffect(() => {
    loadSafetyData();
  }, []);

  const loadSafetyData = async () => {
    try {
      setIsLoading(true);

      // Try to load safety insights
      try {
        const insights = await mockAuth.getSafetyInsights();
        setSafetyScore(insights.safetyScore);
        setRecommendations(insights.recommendations);
      } catch (insightsError) {
        console.warn(
          "Safety insights not available:",
          insightsError,
        );
        // Set fallback data
        setSafetyScore(85);
        setRecommendations([
          "Share your location with trusted contacts",
          "Stay in well-populated areas",
          "Keep emergency contacts updated",
        ]);
      }

      // Try to load user alerts
      try {
        const userAlerts = await mockAuth.getUserAlerts();
        setAlerts(userAlerts.slice(0, 10)); // Show latest 10 alerts
      } catch (alertsError) {
        console.warn("User alerts not available:", alertsError);
        setAlerts([]); // Set empty alerts
      }
    } catch (error) {
      console.error("Error loading safety data:", error);
      // Set fallback data
      setSafetyScore(85);
      setRecommendations([
        "Share your location with trusted contacts",
        "Stay in well-populated areas",
        "Keep emergency contacts updated",
      ]);
      setAlerts([]);
    } finally {
      setIsLoading(false);
    }
  };

  const refreshSafetyData = async () => {
    setIsRefreshing(true);
    await loadSafetyData();
    setIsRefreshing(false);
    toast.success("Safety data refreshed");
  };

  const acknowledgeAlert = async (alertId: string) => {
    try {
      await mockAuth.acknowledgeAlert(alertId);
      setAlerts((prev) =>
        prev.map((alert) =>
          alert.id === alertId
            ? { ...alert, acknowledged: true }
            : alert,
        ),
      );
      toast.success("Alert acknowledged");
    } catch (error) {
      console.error("Error acknowledging alert:", error);
      toast.error("Failed to acknowledge alert");
    }
  };

  const sendEmergencySOS = async () => {
    try {
      const location = await mockAuth.getCurrentLocation();
      await mockAuth.sendEmergencyAlert({
        latitude: location.latitude,
        longitude: location.longitude,
        message: "Emergency SOS from Safety Dashboard",
        type: "emergency",
        severity: "high",
      });
      toast.success("Emergency SOS sent successfully!");
    } catch (error) {
      console.error("Emergency SOS error:", error);
      toast.error("Failed to send emergency SOS");
    }
  };

  const getSafetyScoreColor = (score: number) => {
    if (score >= 80) return "text-green-600";
    if (score >= 60) return "text-yellow-600";
    return "text-red-600";
  };

  const getSafetyScoreStatus = (score: number) => {
    if (score >= 80) return "Excellent";
    if (score >= 60) return "Good";
    if (score >= 40) return "Moderate";
    return "Needs Attention";
  };

  const getAlertIcon = (level: string) => {
    switch (level) {
      case "high":
        return (
          <AlertTriangle className="w-4 h-4 text-red-500" />
        );
      case "moderate":
        return (
          <AlertTriangle className="w-4 h-4 text-yellow-500" />
        );
      default:
        return (
          <CheckCircle className="w-4 h-4 text-green-500" />
        );
    }
  };

  const getAlertBadgeVariant = (
    level: string,
  ): "default" | "secondary" | "destructive" => {
    switch (level) {
      case "high":
        return "destructive";
      case "moderate":
        return "secondary";
      default:
        return "default";
    }
  };

  const handleBookDevice = (device: SafetyDevice) => {
    toast.success(
      `Safety device "${device.name}" has been added to your booking!`,
    );
    setCurrentView("dashboard");
  };

  const handleViewDeviceDetails = (device: SafetyDevice) => {
    setSelectedDevice(device);
    setCurrentView("device-details");
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-64">
        <Loader2 className="w-8 h-8 animate-spin" />
      </div>
    );
  }

  const renderSafetyBookings = () => (
    <div className="space-y-6 p-4">
      {/* Header */}
      <div className="flex items-center justify-between">
        <Button
          variant="outline"
          size="sm"
          onClick={() => setCurrentView("dashboard")}
          className="flex items-center space-x-2"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>Back to Safety</span>
        </Button>
        <h2 className="text-xl font-semibold">
          Choose Your Safety Device
        </h2>
        <div className="w-20"></div>{" "}
        {/* Spacer for centering */}
      </div>

      {/* Device Cards */}
      <div className="space-y-4">
        {safetyDevices.map((device) => {
          const IconComponent = device.icon;
          return (
            <Card
              key={device.id}
              className="hover:shadow-md transition-shadow"
            >
              <CardContent className="p-4">
                <div className="flex space-x-4">
                  <ImageWithFallback
                    src={device.image}
                    alt={device.name}
                    className="w-20 h-20 object-cover rounded-lg"
                  />
                  <div className="flex-1">
                    <div className="flex items-center space-x-2 mb-2">
                      <IconComponent className="w-5 h-5 text-blue-600" />
                      <h3 className="font-medium">
                        {device.name}
                      </h3>
                      <Badge
                        variant="outline"
                        className="text-green-600 border-green-600"
                      >
                        {device.price}
                      </Badge>
                    </div>

                    <p className="text-sm text-gray-600 mb-3">
                      {device.description}
                    </p>

                    <div className="grid grid-cols-2 gap-2 mb-3">
                      {device.features
                        .slice(0, 4)
                        .map((feature, index) => (
                          <div
                            key={index}
                            className="flex items-center space-x-1 text-xs"
                          >
                            <CheckCircle className="w-3 h-3 text-green-500" />
                            <span>{feature}</span>
                          </div>
                        ))}
                    </div>

                    <div className="flex space-x-2">
                      <Button
                        size="sm"
                        onClick={() =>
                          handleViewDeviceDetails(device)
                        }
                        variant="outline"
                      >
                        View Details
                      </Button>
                      <Button
                        size="sm"
                        onClick={() => handleBookDevice(device)}
                        className="bg-blue-600 hover:bg-blue-700"
                      >
                        <ShoppingBag className="w-3 h-3 mr-1" />
                        Book Now
                      </Button>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          );
        })}
      </div>

      {/* Benefits Section */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center space-x-2">
            <Shield className="w-5 h-5 text-green-600" />
            <span>Why Choose Safety Devices?</span>
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
            <div className="space-y-2">
              <div className="flex items-center space-x-2">
                <CheckCircle className="w-4 h-4 text-green-500" />
                <span>24/7 Emergency monitoring</span>
              </div>
              <div className="flex items-center space-x-2">
                <CheckCircle className="w-4 h-4 text-green-500" />
                <span>Instant location sharing</span>
              </div>
              <div className="flex items-center space-x-2">
                <CheckCircle className="w-4 h-4 text-green-500" />
                <span>Family & authority alerts</span>
              </div>
            </div>
            <div className="space-y-2">
              <div className="flex items-center space-x-2">
                <CheckCircle className="w-4 h-4 text-green-500" />
                <span>Health vitals tracking</span>
              </div>
              <div className="flex items-center space-x-2">
                <CheckCircle className="w-4 h-4 text-green-500" />
                <span>Long battery life</span>
              </div>
              <div className="flex items-center space-x-2">
                <CheckCircle className="w-4 h-4 text-green-500" />
                <span>Water resistant design</span>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );

  const renderDeviceDetails = () => {
    if (!selectedDevice) return null;

    const IconComponent = selectedDevice.icon;

    return (
      <div className="space-y-6 p-4">
        {/* Header */}
        <div className="flex items-center justify-between">
          <Button
            variant="outline"
            size="sm"
            onClick={() => setCurrentView("bookings")}
            className="flex items-center space-x-2"
          >
            <ArrowLeft className="w-4 h-4" />
            <span>Back to Devices</span>
          </Button>
          <h2 className="text-xl font-semibold">
            {selectedDevice.name}
          </h2>
          <div className="w-24"></div>
        </div>

        {/* Device Image and Info */}
        <Card>
          <CardContent className="p-6">
            <div className="text-center space-y-4">
              <ImageWithFallback
                src={selectedDevice.image}
                alt={selectedDevice.name}
                className="w-40 h-40 object-cover rounded-lg mx-auto"
              />
              <div>
                <div className="flex items-center justify-center space-x-2 mb-2">
                  <IconComponent className="w-6 h-6 text-blue-600" />
                  <h3 className="text-xl font-semibold">
                    {selectedDevice.name}
                  </h3>
                </div>
                <p className="text-2xl font-bold text-green-600">
                  {selectedDevice.price}
                </p>
                <p className="text-gray-600 mt-2">
                  {selectedDevice.description}
                </p>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Technical Specifications */}
        <Card>
          <CardHeader>
            <CardTitle>Technical Specifications</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="text-center p-3 bg-blue-50 rounded-lg">
                <Battery className="w-6 h-6 text-blue-600 mx-auto mb-2" />
                <p className="font-medium">Battery Life</p>
                <p className="text-sm text-gray-600">
                  {selectedDevice.batteryLife}
                </p>
              </div>
              <div className="text-center p-3 bg-green-50 rounded-lg">
                <Wifi className="w-6 h-6 text-green-600 mx-auto mb-2" />
                <p className="font-medium">Connectivity</p>
                <p className="text-sm text-gray-600">
                  {selectedDevice.connectivity}
                </p>
              </div>
              <div className="text-center p-3 bg-cyan-50 rounded-lg">
                <Shield className="w-6 h-6 text-cyan-600 mx-auto mb-2" />
                <p className="font-medium">Water Resistant</p>
                <p className="text-sm text-gray-600">
                  {selectedDevice.waterResistant ? "Yes" : "No"}
                </p>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* All Features */}
        <Card>
          <CardHeader>
            <CardTitle>Complete Feature List</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
              {selectedDevice.features.map((feature, index) => (
                <div
                  key={index}
                  className="flex items-center space-x-2"
                >
                  <CheckCircle className="w-4 h-4 text-green-500" />
                  <span className="text-sm">{feature}</span>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Action Buttons */}
        <div className="flex space-x-4">
          <Button
            className="flex-1 bg-blue-600 hover:bg-blue-700"
            onClick={() => handleBookDevice(selectedDevice)}
          >
            <ShoppingBag className="w-4 h-4 mr-2" />
            Book This Device - {selectedDevice.price}
          </Button>
        </div>
      </div>
    );
  };

  const renderMainDashboard = () => (
    <div className="space-y-6 p-4">
      {/* Header with refresh and safety bookings */}
      <div className="flex items-center justify-between">
        <h2 className="text-xl font-semibold">
          Safety Dashboard
        </h2>
        <div className="flex space-x-2">
          <Button
            variant="outline"
            size="sm"
            onClick={() => setCurrentView("bookings")}
            className="flex items-center space-x-2"
          >
            <ShoppingBag className="w-4 h-4" />
            <span>Safety Bookings</span>
          </Button>
          <Button
            variant="outline"
            size="sm"
            onClick={refreshSafetyData}
            disabled={isRefreshing}
          >
            <RefreshCw
              className={`w-4 h-4 mr-2 ${isRefreshing ? "animate-spin" : ""}`}
            />
            Refresh
          </Button>
        </div>
      </div>

      {/* Safety Score Card */}
      <Card>
        <CardHeader className="pb-3">
          <div className="flex items-center justify-between">
            <CardTitle className="text-lg">
              Safety Score
            </CardTitle>
            <Shield
              className={`w-6 h-6 ${getSafetyScoreColor(safetyScore)}`}
            />
          </div>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <div className="text-center">
              <div
                className={`text-3xl font-bold ${getSafetyScoreColor(safetyScore)}`}
              >
                {safetyScore}%
              </div>
              <div className="text-sm text-gray-600">
                {getSafetyScoreStatus(safetyScore)}
              </div>
            </div>
            <Progress value={safetyScore} className="h-2" />
            <div className="text-sm text-gray-600 text-center">
              Your safety score is based on location patterns,
              travel history, and AI analysis
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Emergency SOS Button */}
      {/* <Card className="border-red-200">
        <CardContent className="pt-6">
          <div className="text-center space-y-4">
            <h3 className="font-semibold text-red-700">
              Emergency SOS
            </h3>
            <p className="text-sm text-gray-600">
              Press this button if you're in immediate danger.
              It will alert nearby authorities with your
              location.
            </p>
            <Button
              onClick={sendEmergencySOS}
              className="w-full bg-red-600 hover:bg-red-700"
              size="lg"
            >
              <Phone className="w-4 h-4 mr-2" />
              Send Emergency SOS
            </Button>
          </div>
        </CardContent>
      </Card> */}

      {/* AI Safety Recommendations */}
      {/* <Card>
        <CardHeader>
          <CardTitle className="flex items-center space-x-2">
            <Brain className="w-5 h-5" />
            <span>AI Safety Recommendations</span>
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            {recommendations.map((recommendation, index) => (
              <div
                key={index}
                className="flex items-start space-x-3 p-3 bg-blue-50 rounded-lg"
              >
                <CheckCircle className="w-4 h-4 text-blue-600 mt-0.5 flex-shrink-0" />
                <span className="text-sm text-blue-800">
                  {recommendation}
                </span>
              </div>
            ))}
          </div>
        </CardContent>
      </Card> */}

      {/* Recent Safety Alerts */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center space-x-2">
            <AlertTriangle className="w-5 h-5" />
            <span>Recent Safety Alerts</span>
          </CardTitle>
        </CardHeader>
        <CardContent>
          {alerts.length === 0 ? (
            <div className="text-center py-8 text-gray-500">
              <CheckCircle className="w-12 h-12 mx-auto mb-4 text-green-500" />
              <p>No recent safety alerts</p>
              <p className="text-sm">
                You're following good safety practices!
              </p>
            </div>
          ) : (
            <ScrollArea className="h-64">
              <div className="space-y-3">
                {alerts.map((alert) => (
                  <div
                    key={alert.id}
                    className={`p-4 rounded-lg border ${
                      alert.acknowledged
                        ? "bg-gray-50 opacity-75"
                        : "bg-white"
                    }`}
                  >
                    <div className="flex items-start justify-between">
                      <div className="flex items-start space-x-3">
                        {getAlertIcon(alert.level)}
                        <div className="flex-1">
                          <div className="flex items-center space-x-2 mb-1">
                            <Badge
                              variant={getAlertBadgeVariant(
                                alert.level,
                              )}
                            >
                              {alert.level.toUpperCase()}
                            </Badge>
                            <Badge variant="outline">
                              {alert.type}
                            </Badge>
                          </div>
                          <p className="text-sm font-medium">
                            {alert.message}
                          </p>
                          {alert.recommendations &&
                            alert.recommendations.length >
                              0 && (
                              <div className="mt-2 space-y-1">
                                {alert.recommendations
                                  .slice(0, 2)
                                  .map((rec, index) => (
                                    <p
                                      key={index}
                                      className="text-xs text-gray-600"
                                    >
                                      • {rec}
                                    </p>
                                  ))}
                              </div>
                            )}
                          <div className="flex items-center space-x-4 mt-2 text-xs text-gray-500">
                            <div className="flex items-center space-x-1">
                              <Clock className="w-3 h-3" />
                              <span>
                                {new Date(
                                  alert.timestamp,
                                ).toLocaleString()}
                              </span>
                            </div>
                            {alert.location && (
                              <div className="flex items-center space-x-1">
                                <MapPin className="w-3 h-3" />
                                <span>
                                  {alert.location.latitude.toFixed(
                                    4,
                                  )}
                                  ,{" "}
                                  {alert.location.longitude.toFixed(
                                    4,
                                  )}
                                </span>
                              </div>
                            )}
                          </div>
                        </div>
                      </div>
                      {!alert.acknowledged && (
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() =>
                            acknowledgeAlert(alert.id)
                          }
                        >
                          <MessageSquare className="w-3 h-3 mr-1" />
                          OK
                        </Button>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            </ScrollArea>
          )}
        </CardContent>
      </Card>

      {/* Quick Safety Tips */}
      <Card>
        <CardHeader>
          <CardTitle>Quick Safety Tips</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
            <div className="space-y-2">
              <div className="flex items-center space-x-2">
                <CheckCircle className="w-4 h-4 text-green-500" />
                <span>
                  Share location with trusted contacts
                </span>
              </div>
              <div className="flex items-center space-x-2">
                <CheckCircle className="w-4 h-4 text-green-500" />
                <span>Stay in well-populated areas</span>
              </div>
              <div className="flex items-center space-x-2">
                <CheckCircle className="w-4 h-4 text-green-500" />
                <span>Keep emergency contacts updated</span>
              </div>
            </div>
            <div className="space-y-2">
              <div className="flex items-center space-x-2">
                <CheckCircle className="w-4 h-4 text-green-500" />
                <span>Trust your instincts</span>
              </div>
              <div className="flex items-center space-x-2">
                <CheckCircle className="w-4 h-4 text-green-500" />
                <span>Check in regularly with family</span>
              </div>
              <div className="flex items-center space-x-2">
                <CheckCircle className="w-4 h-4 text-green-500" />
                <span>Be aware of surroundings</span>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );

  // Main render logic
  if (currentView === "bookings") {
    return renderSafetyBookings();
  }

  if (currentView === "device-details") {
    return renderDeviceDetails();
  }

  return renderMainDashboard();
}
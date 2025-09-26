import React, { useState } from "react";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "../ui/card";
import { Button } from "../ui/button";
import { Input } from "../ui/input";
import { Badge } from "../ui/badge";
import { Language, User } from "../../App";
import {
  Search,
  Map,
  Shield,
  AlertTriangle,
  QrCode,
  User as UserIcon,
  Mountain,
  Church,
  Waves,
  Trees,
  Camera,
  MapPin,
  Phone,
  Zap,
  Download,
  ArrowLeft,
  Heart,
  Activity,
  Wifi,
  Battery,
  Smartphone,
  Watch,
  Navigation,
  Bell,
  CloudRain,
  Construction,
  Car,
  CheckCircle,
  X,
  MessageCircle,
  Bot,
} from "lucide-react";
import { ImageWithFallback } from "../figma/ImageWithFallback";
import { getTranslation } from "../../utils/translations";
import { SafetyDashboard } from "./SafetyDashboard";
import { GoogleStyleMap } from "./GoogleStyleMap";
import { AIChatbot } from "./AIChatbot";
import { SOSMessaging } from "./SOSMessaging";
import { toast } from "sonner@2.0.3";

interface TravellerDashboardProps {
  user: User | null;
  selectedLanguage: Language;
  onLogout: () => void;
  onStepChange?: (step: any) => void;
}

type DashboardTab = "explore" | "map" | "safety" | "profile";

export function TravellerDashboard({
  user,
  selectedLanguage,
  onLogout,
  onStepChange,
}: TravellerDashboardProps) {
  const [activeTab, setActiveTab] =
    useState<DashboardTab>("explore");
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedCategory, setSelectedCategory] = useState<
    string | null
  >(null);
  const [showNotifications, setShowNotifications] =
    useState(false);
  const [showScanner, setShowScanner] = useState(false);
  const [showChatbot, setShowChatbot] = useState(false);

  const categories = [
    {
      id: "adventures",
      name: getTranslation("adventures", selectedLanguage),
      icon: Mountain,
      color: "text-orange-600",
      bgColor: "bg-orange-100",
    },
    {
      id: "temples",
      name: getTranslation("temples", selectedLanguage),
      icon: Church,
      color: "text-purple-600",
      bgColor: "bg-purple-100",
    },
    {
      id: "waterparks",
      name: getTranslation("waterparks", selectedLanguage),
      icon: Waves,
      color: "text-blue-600",
      bgColor: "bg-blue-100",
    },
    {
      id: "beaches",
      name: getTranslation("beaches", selectedLanguage),
      icon: Waves,
      color: "text-cyan-600",
      bgColor: "bg-cyan-100",
    },
    {
      id: "zoos",
      name: getTranslation("zoos", selectedLanguage),
      icon: Trees,
      color: "text-green-600",
      bgColor: "bg-green-100",
    },
    {
      id: "hiking",
      name: getTranslation("hiking", selectedLanguage),
      icon: Mountain,
      color: "text-red-600",
      bgColor: "bg-red-100",
    },
  ];

  const destinations = {
    adventures: [
      {
        name: "Mountain Trekking",
        description:
          "Challenging trails with breathtaking views",
        image:
          "https://images.unsplash.com/photo-1615472767332-e5615c7e617a?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxhZHZlbnR1cmUlMjBtb3VudGFpbiUyMHRyZWtraW5nJTIwaGlraW5nfGVufDF8fHx8MTc1ODgwNDQwMHww&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral",
        rating: 4.8,
        difficulty: "Hard",
        duration: "6-8 hours",
      },
      {
        name: "Rock Climbing",
        description: "Adventure sports for thrill seekers",
        image:
          "https://images.unsplash.com/photo-1634248302461-df0f954e7b76?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxyb2NrJTIwY2xpbWJpbmclMjBhZHZlbnR1cmUlMjBzcG9ydHN8ZW58MXx8fHwxNzU4ODA0NDI0fDA&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral",
        rating: 4.6,
        difficulty: "Medium",
        duration: "3-4 hours",
      },
      {
        name: "White Water Rafting",
        description: "Exciting river adventures",
        image:
          "https://images.unsplash.com/photo-1709205658762-cb42bc58620f?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHx3YXRlciUyMHBhcmslMjBmYW1pbHklMjBmdW4lMjBzbGlkZXN8ZW58MXx8fHwxNzU4ODA0NDE4fDA&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral",
        rating: 4.7,
        difficulty: "Medium",
        duration: "2-3 hours",
      },
    ],
    temples: [
      {
        name: "Golden Temple",
        description:
          "Sacred Sikh shrine with golden architecture",
        image:
          "https://images.unsplash.com/photo-1621377099913-ac1ec4848e52?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxnb2xkZW4lMjB0ZW1wbGUlMjBwdW5qYWIlMjBzaWtofGVufDF8fHx8MTc1ODgwNDQwNXww&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral",
        rating: 4.9,
        timings: "24/7 Open",
        entry: "Free",
      },
      {
        name: "Meenakshi Temple",
        description: "Ancient temple with intricate sculptures",
        image:
          "https://images.unsplash.com/photo-1582650625119-3a31f8fa2699?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHxpbmRpYW4lMjB0ZW1wbGUlMjBhcmNoaXRlY3R1cmV8ZW58MXx8fHwxNzU4NzgwMzQ5fDA&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral",
        rating: 4.7,
        timings: "5AM - 10PM",
        entry: "₹10",
      },
      {
        name: "Kovil Temple",
        description: "Modern architectural marvel in Delhi",
        image:
          "https://images.unsplash.com/photo-1632988531525-5dd04e0b4473?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHxyZWxpZ2lvdXMlMjB0ZW1wbGUlMjBpbmRpYXxlbnwxfHx8fDE3NTg3ODAzNDl8MA&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral",
        rating: 4.5,
        timings: "6AM - 8PM",
        entry: "Free",
      },
    ],
    waterparks: [
      {
        name: "Aqua Adventure",
        description: "Thrilling water slides and pools",
        image:
          "https://images.unsplash.com/photo-1709205658762-cb42bc58620f?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHx3YXRlciUyMHBhcmslMjBmYW1pbHklMjBmdW4lMjBzbGlkZXN8ZW58MXx8fHwxNzU4ODA0NDE4fDA&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral",
        rating: 4.4,
        price: "₹800",
        age: "All Ages",
      },
      {
        name: "Splash Zone",
        description: "Family-friendly water park",
        image:
          "https://images.unsplash.com/photo-1594736797933-d0f06ba5c2a0?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHx3YXRlciUyMHBhcmslMjBmYW1pbHl8ZW58MXx8fHwxNzU4Nzg0OTM1fDA&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral",
        rating: 4.2,
        price: "₹600",
        age: "Family",
      },
    ],
    beaches: [
      {
        name: "Goa Beach",
        description:
          "Beautiful sandy beaches with clear waters",
        image:
          "https://images.unsplash.com/photo-1590393532495-bdcdf6984e57?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHxnb2ElMjBiZWFjaCUyMHN1bnNldCUyMGluZGlhfGVufDF8fHx8MTc1ODc4MDM0OXww&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral",
        rating: 4.8,
        activities: "Swimming, Surfing",
        bestTime: "Oct - Feb",
      },
      {
        name: "Marina Beach",
        description:
          "Longest beach in India, perfect for evening walks",
        image:
          "https://images.unsplash.com/photo-1506905925346-21bda4d32df4?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHxiZWFjaCUyMHN1bnNldCUyMGluZGlhfGVufDF8fHx8MTc1ODc4NDkzNXww&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral",
        rating: 4.3,
        activities: "Walking, Photography",
        bestTime: "Evening",
      },
      {
        name: "Kovalam Beach",
        description: "Pristine beaches in Kerala",
        image:
          "https://images.unsplash.com/photo-1517824359345-fd5bb4c12b9a?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHxrZXJhbGElMjBiZWFjaHxlbnwxfHx8fDE3NTg3ODQ5MzV8MA&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral",
        rating: 4.6,
        activities: "Ayurveda, Backwaters",
        bestTime: "Nov - Mar",
      },
    ],
    zoos: [
      {
        name: "Delhi Zoo",
        description:
          "National Zoological Park with diverse wildlife",
        image:
          "https://images.unsplash.com/photo-1549366021-9f761d040fff?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHx6b28lMjBhbmltYWxzJTIwd2lsZGxpZmV8ZW58MXx8fHwxNzU4Nzg0OTM1fDA&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral",
        rating: 4.1,
        entry: "₹80",
        timings: "9AM - 4:30PM",
      },
      {
        name: "Mysore Zoo",
        description: "One of the oldest zoos in India",
        image:
          "https://images.unsplash.com/photo-1516642499105-492ff3ac6b46?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHx6b28lMjBhbmltYWxzJTIwd2lsZGxpZmV8ZW58MXx8fHwxNzU4Nzg0OTM1fDA&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral",
        rating: 4.3,
        entry: "₹70",
        timings: "8:30AM - 5:30PM",
      },
    ],
    hiking: [
      {
        name: "Western Ghats Trek",
        description: "Scenic mountain trails through forests",
        image:
          "https://images.unsplash.com/photo-1615472767332-e5615c7e617a?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxhZHZlbnR1cmUlMjBtb3VudGFpbiUyMHRyZWtraW5nJTIwaGlraW5nfGVufDF8fHx8MTc1ODgwNDQwMHww&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral",
        rating: 4.7,
        difficulty: "Moderate",
        duration: "4-5 hours",
      },
      {
        name: "Valley of Flowers",
        description: "Beautiful alpine flowers and meadows",
        image:
          "https://images.unsplash.com/photo-1506905925346-21bda4d32df4?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHxiZWFjaCUyMHN1bnNldCUyMGluZGlhfGVufDF8fHx8MTc1ODc4NDkzNXww&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral",
        rating: 4.9,
        difficulty: "Easy",
        duration: "2-3 hours",
      },
    ],
  };

  const notifications = [
    {
      id: "weather-1",
      type: "weather",
      title: "Heavy Rain Alert",
      message:
        "Heavy rainfall expected in your area from 3 PM to 6 PM today. Plan indoor activities.",
      time: "2 hours ago",
      severity: "medium",
      icon: CloudRain,
      color: "text-blue-600",
    },
    {
      id: "traffic-1",
      type: "traffic",
      title: "Road Block on MG Road",
      message:
        "Construction work causing traffic delays. Estimated delay: 30 minutes. Use alternate route.",
      time: "45 minutes ago",
      severity: "high",
      icon: Construction,
      color: "text-orange-600",
    },
    {
      id: "weather-2",
      type: "weather",
      title: "Air Quality Alert",
      message:
        "Air quality is poor due to pollution. Avoid outdoor activities if you have respiratory issues.",
      time: "1 hour ago",
      severity: "medium",
      icon: CloudRain,
      color: "text-yellow-600",
    },
    {
      id: "traffic-2",
      type: "traffic",
      title: "Traffic Congestion",
      message:
        "Heavy traffic on Outer Ring Road due to festival celebrations. Allow extra travel time.",
      time: "3 hours ago",
      severity: "low",
      icon: Car,
      color: "text-green-600",
    },
  ];

  const safetyDevices = [
    {
      name: "Smart Safety Band",
      features: [
        "Heart rate monitoring",
        "Manual SOS button",
        "Fall detection",
        "GPS tracking",
      ],
      image:
        "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcRn7kTZcE2_hW5J2XIOwd9s9fgjBZwVnb-00A&s",
      icon: Watch,
    },
    {
      name: "Ultra Compact Smart Tag",
      features: [
        "Location tracking",
        "SOS button",
        "Compact design",
        "7-day battery",
      ],
      image:
        "https://m.media-amazon.com/images/I/51cP3SGpuDL._UF894%2C1000_QL80_.jpg",
      icon: Smartphone,
    },
    {
      name: "Satellite Communicator",
      features: [
        "Two-way messaging",
        "Global coverage",
        "Weather updates",
        "Emergency contacts",
      ],
      image:
        "https://www.acrartex.com/wp-content/uploads/2021/06/ACR-Bivy-Front-Left-Angle-Tilt.png",
      icon: Wifi,
    },
  ];

  const handleScanner = () => {
    setShowScanner(true);
    toast.success(
      "Digital ID Scanner activated! Scan any QR code to verify identity.",
    );

    // Simulate scanner functionality
    setTimeout(() => {
      toast.success(
        "QR Code scanned successfully! Digital ID verified ✓",
      );
      setShowScanner(false);
    }, 3000);
  };

  const handleEmergency = async () => {
    try {
      // Get current location and send SOS
      // Simulate emergency alert functionality
      const location = {
        latitude: 12.9716,
        longitude: 77.5946,
      }; // Mock location

      toast.success(
        "🚨 SOS ACTIVATED! Emergency alert sent successfully!",
      );
    } catch (error) {
      console.error("Emergency SOS error:", error);
      // Fallback alert
      alert(
        "🚨 SOS ACTIVATED! Emergency alert sent to:\n• Nearest police unit\n• Family contacts\n• Current GPS location shared",
      );
    }
  };

  const renderExploreTab = () => {
    if (selectedCategory) {
      const categoryDestinations =
        destinations[
          selectedCategory as keyof typeof destinations
        ] || [];

      return (
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <Button
              variant="outline"
              size="sm"
              onClick={() => setSelectedCategory(null)}
              className="flex items-center space-x-2"
            >
              <ArrowLeft className="w-4 h-4" />
              <span>{getTranslation("back", selectedLanguage)}</span>
            </Button>
            <h3 className="capitalize font-medium">
              {selectedCategory}
            </h3>
            <div className="w-16"></div>{" "}
            {/* Spacer for centering */}
          </div>

          <div className="space-y-4">
            {categoryDestinations.map((destination, index) => (
              <Card key={index}>
                <CardContent className="p-4">
                  <div className="flex space-x-4">
                    <ImageWithFallback
                      src={destination.image}
                      alt={destination.name}
                      className="w-20 h-20 object-cover rounded-lg"
                    />
                    <div className="flex-1">
                      <h4 className="font-medium">
                        {destination.name}
                      </h4>
                      <p className="text-sm text-gray-600 mt-1">
                        {destination.description}
                      </p>
                      <Button size="sm" className="mt-2">
                        <MapPin className="w-3 h-3 mr-1" />
                        {getTranslation("navigate", selectedLanguage)}
                      </Button>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      );
    }

    return (
      <div className="space-y-4">
        <div className="relative">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
          <Input
            placeholder={getTranslation(
              "searchDestinations",
              selectedLanguage,
            )}
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="pl-10"
          />
        </div>

        <div className="grid grid-cols-2 gap-4">
          {categories.map((category) => {
            const IconComponent = category.icon;
            return (
              <Card
                key={category.id}
                className="cursor-pointer hover:shadow-md transition-shadow"
                onClick={() => setSelectedCategory(category.id)}
              >
                <CardContent className="p-4 text-center">
                  <div
                    className={`w-12 h-12 ${category.bgColor} rounded-full flex items-center justify-center mx-auto mb-2`}
                  >
                    <IconComponent
                      className={`w-6 h-6 ${category.color}`}
                    />
                  </div>
                  <p className="text-sm font-medium">
                    {category.name}
                  </p>
                </CardContent>
              </Card>
            );
          })}
        </div>
      </div>
    );
  };

  const renderMapTab = () => (
    <GoogleStyleMap
      language={selectedLanguage}
      currentLocation={{ latitude: 28.6139, longitude: 77.209 }}
    />
  );

  const renderSafetyTab = () => (
    <div className="space-y-4">
      {/* SOS Messaging Component */}
      <SOSMessaging 
        language={selectedLanguage} 
        user={user}
        currentLocation={{ latitude: 28.6139, longitude: 77.209 }}
      />

      {/* AI Safety Alert Component */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center space-x-2">
            <Zap className="w-5 h-5 text-purple-600" />
            <span> Safety Intelligence</span>
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-3 gap-4 text-center mb-4">
            <div className="space-y-1">
              <div className="text-2xl font-bold text-green-600">
                4
              </div>
              <div className="text-xs text-gray-600">
                Safe Areas
              </div>
            </div>
            <div className="space-y-1">
              <div className="text-2xl font-bold text-yellow-600">
                2
              </div>
              <div className="text-xs text-gray-600">
                Caution Zones
              </div>
            </div>
            <div className="space-y-1">
              <div className="text-2xl font-bold text-red-600">
                1
              </div>
              <div className="text-xs text-gray-600">
                Danger Zones
              </div>
            </div>
          </div>

          {/* Recent AI Alert */}
          <div className="border-l-4 border-yellow-500 bg-yellow-50 p-3 rounded">
            <div className="flex items-center space-x-2 mb-2">
              <Badge className="bg-yellow-600 text-white text-xs">
                Medium
              </Badge>
            </div>
            <h4 className="font-medium text-gray-900">
              Crowd Density Alert
            </h4>
            <p className="text-sm text-gray-600 mt-1">
              crowd analysis detects unusual crowd buildup ahead
              on your route.
            </p>
            <div className="bg-blue-50 border border-blue-200 rounded p-2 mt-2">
              <p className="text-sm text-blue-800">
                <strong>Recommendation:</strong> Use alternative
                route or wait for crowd to disperse.
              </p>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Safety Dashboard */}
      <SafetyDashboard language={selectedLanguage} />
    </div>
  );

  const renderProfileTab = () => (
    <div className="space-y-4">
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center space-x-2">
            <QrCode className="w-5 h-5" />
            <span>
              {getTranslation("digitalTouristId", selectedLanguage)}
            </span>
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="text-center space-y-4">
            <div className="w-32 h-32 bg-gradient-to-br from-blue-100 to-green-100 rounded-lg flex items-center justify-center mx-auto border-2 border-dashed border-gray-300">
              <QrCode className="w-16 h-16 text-gray-600" />
            </div>
            <div>
              <p className="font-medium">{user?.name}</p>
              <p className="text-sm text-gray-600">
                Digital ID: {user?.digitalId}
              </p>
              <p className="text-sm text-gray-600">
                {getTranslation("validUntil", selectedLanguage)}:{" "}
                {new Date(
                  Date.now() + 30 * 24 * 60 * 60 * 1000,
                ).toLocaleDateString()}
              </p>
            </div>
            <div className="flex space-x-2">
              <Button variant="outline" size="sm">
                <Download className="w-4 h-4 mr-2" />
                {getTranslation("download", selectedLanguage)}
              </Button>
              <Button variant="outline" size="sm">
                {getTranslation("share", selectedLanguage)}
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>
            {getTranslation("personalInformation", selectedLanguage)}
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-3">
          <div className="grid grid-cols-2 gap-4">
            <div>
              <p className="text-sm text-gray-600">
                {getTranslation("firstName", selectedLanguage)}
              </p>
              <p className="font-medium">
                {user?.firstName || "John"}
              </p>
            </div>
            <div>
              <p className="text-sm text-gray-600">
                {getTranslation("lastName", selectedLanguage)}
              </p>
              <p className="font-medium">
                {user?.lastName || "Doe"}
              </p>
            </div>
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <p className="text-sm text-gray-600">
                {getTranslation("nationality", selectedLanguage)}
              </p>
              <p className="font-medium">
                {user?.nationality || "Indian"}
              </p>
            </div>
            <div>
              <p className="text-sm text-gray-600">
                {getTranslation("age", selectedLanguage)}
              </p>
              <p className="font-medium">{user?.age || "28"}</p>
            </div>
          </div>
          <div>
            <p className="text-sm text-gray-600">
              {getTranslation("phoneNumber", selectedLanguage)}
            </p>
            <p className="font-medium">
              {user?.phone || "+91 9876543210"}
            </p>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>
            {getTranslation("tripInformation", selectedLanguage)}
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-3">
          <div>
            <p className="text-sm text-gray-600">
              {getTranslation("tripDuration", selectedLanguage)}
            </p>
            <p className="font-medium">
              {user?.tripDuration || "7 days"}
            </p>
          </div>
          <div>
            <p className="text-sm text-gray-600">
              {getTranslation("startDate", selectedLanguage)}
            </p>
            <p className="font-medium">
              {user?.startDate ||
                new Date().toLocaleDateString()}
            </p>
          </div>
          <div>
            <p className="text-sm text-gray-600">
              {getTranslation("itinerary", selectedLanguage)}
            </p>
            <p className="font-medium">
              {user?.itinerary ||
                "Exploring South India - Bangalore, Mysore, and Coorg"}
            </p>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>
            {getTranslation("emergencyContact", selectedLanguage)}
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-3">
          <div>
            <p className="text-sm text-gray-600">
              {getTranslation("emergencyContactName", selectedLanguage)}
            </p>
            <p className="font-medium">
              {user?.emergencyName || "Jane Doe"}
            </p>
          </div>
          <div>
            <p className="text-sm text-gray-600">
              {getTranslation(
                "emergencyContactPhone",
                selectedLanguage,
              )}
            </p>
            <p className="font-medium">
              {user?.emergencyPhone || "+91 9876543211"}
            </p>
          </div>
        </CardContent>
      </Card>

      <Card
        className="cursor-pointer hover:shadow-md transition-shadow"
        onClick={handleScanner}
      >
        <CardContent className="p-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <Camera
                className={`w-5 h-5 ${showScanner ? "text-green-500" : "text-blue-500"}`}
              />
              <span>
                Scan {getTranslation("digitalId", selectedLanguage)}
              </span>
            </div>
            <QrCode
              className={`w-5 h-5 ${showScanner ? "text-green-500 animate-pulse" : "text-gray-400"}`}
            />
          </div>
          {showScanner && (
            <div className="mt-2 text-center">
              <div className="inline-flex items-center space-x-2 text-green-600">
                <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
                <span className="text-sm">
                  Scanner Active - Point camera at QR code
                </span>
              </div>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white shadow-sm p-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <div className="w-10 h-10 bg-blue-100 rounded-full flex items-center justify-center">
              <UserIcon className="w-5 h-5 text-blue-600" />
            </div>
            <div>
              <p className="font-medium">
                {getTranslation("welcome", selectedLanguage)},{" "}
                {user?.name?.split(" ")[0] ||
                  getTranslation("traveller", selectedLanguage)}
              </p>
              <p className="text-sm text-gray-600">
                {getTranslation("staySafeJourney", selectedLanguage)}
              </p>
            </div>
          </div>
          <div className="flex items-center space-x-2">
            <Button
              variant="outline"
              size="sm"
              onClick={() => setShowNotifications(true)}
              className="relative"
            >
              <Bell className="w-4 h-4" />
              {notifications.filter(
                (n) => n.severity === "high",
              ).length > 0 && (
                <div className="absolute -top-1 -right-1 w-3 h-3 bg-red-500 rounded-full flex items-center justify-center">
                  <span className="text-white text-xs">!</span>
                </div>
              )}
            </Button>
            <Button
              variant="outline"
              size="sm"
              onClick={() => setShowChatbot(true)}
              className="relative bg-gradient-to-r from-blue-50 to-purple-50 border-blue-200 hover:from-blue-100 hover:to-purple-100"
              title="AI Safety Assistant"
            >
              <Bot className="w-4 h-4 text-blue-600" />
              <div className="absolute -top-1 -right-1 w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
            </Button>
            <QrCode className="w-6 h-6 text-gray-400" />
            <Button
              variant="outline"
              size="sm"
              onClick={onLogout}
              className="text-xs"
            >
              Logout
            </Button>
          </div>
        </div>
      </div>

      {/* Content */}
      <div className="p-4 pb-24">
        {activeTab === "explore" && renderExploreTab()}
        {activeTab === "map" && renderMapTab()}
        {activeTab === "safety" && renderSafetyTab()}
        {activeTab === "profile" && renderProfileTab()}
      </div>



      {/* Floating AI Chatbot Button */}
      <div className="fixed bottom-20 right-4">
        <Button
          onClick={() => setShowChatbot(true)}
          className="w-16 h-16 rounded-full bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 shadow-lg border-2 border-white"
          title="AI Safety Assistant"
        >
          <div className="text-center">
            <Bot className="w-6 h-6 mx-auto text-white" />
            <p className="text-xs mt-1 text-white">AI</p>
          </div>
          <div className="absolute -top-1 -right-1 w-3 h-3 bg-green-400 rounded-full animate-pulse border border-white"></div>
        </Button>
      </div>

      {/* Notifications Modal */}
      {showNotifications && (
        <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-lg max-w-md w-full max-h-96 overflow-hidden">
            <div className="flex items-center justify-between p-4 border-b">
              <div className="flex items-center space-x-2">
                <Bell className="w-5 h-5" />
                <h3 className="font-medium">Notifications</h3>
              </div>
              <Button
                size="sm"
                variant="ghost"
                onClick={() => setShowNotifications(false)}
              >
                <X className="w-4 h-4" />
              </Button>
            </div>
            <div className="overflow-y-auto max-h-80">
              <div className="p-4 space-y-3">
                {notifications.map((notification) => {
                  const IconComponent = notification.icon;
                  return (
                    <div
                      key={notification.id}
                      className={`p-3 border rounded-lg ${
                        notification.severity === "high"
                          ? "border-red-200 bg-red-50"
                          : notification.severity === "medium"
                            ? "border-yellow-200 bg-yellow-50"
                            : "border-gray-200 bg-gray-50"
                      }`}
                    >
                      <div className="flex items-start space-x-3">
                        <IconComponent
                          className={`w-5 h-5 mt-0.5 ${notification.color}`}
                        />
                        <div className="flex-1">
                          <div className="flex items-center justify-between">
                            <h4 className="font-medium text-sm">
                              {notification.title}
                            </h4>
                            <span className="text-xs text-gray-500">
                              {notification.time}
                            </span>
                          </div>
                          <p className="text-sm text-gray-600 mt-1">
                            {notification.message}
                          </p>
                          <div className="flex items-center space-x-2 mt-2">
                            <Badge
                              className={`text-xs ${
                                notification.severity === "high"
                                  ? "bg-red-600 text-white"
                                  : notification.severity ===
                                      "medium"
                                    ? "bg-yellow-600 text-white"
                                    : "bg-gray-600 text-white"
                              }`}
                            >
                              {notification.severity
                                .charAt(0)
                                .toUpperCase() +
                                notification.severity.slice(1)}
                            </Badge>
                            <Badge
                              variant="outline"
                              className="text-xs capitalize"
                            >
                              {notification.type}
                            </Badge>
                          </div>
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
            <div className="p-4 border-t bg-gray-50">
              <Button
                onClick={() => setShowNotifications(false)}
                className="w-full"
                size="sm"
              >
                <CheckCircle className="w-4 h-4 mr-2" />
                Mark All as Read
              </Button>
            </div>
          </div>
        </div>
      )}

      {/* AI Chatbot */}
      <AIChatbot
        language={selectedLanguage}
        isOpen={showChatbot}
        onClose={() => setShowChatbot(false)}
        userLocation={{ latitude: 28.6139, longitude: 77.209 }}
      />

      {/* Bottom Navigation */}
      <div className="fixed bottom-0 left-0 right-0 bg-white border-t border-gray-200">
        <div className="grid grid-cols-4">
          {[
            {
              id: "explore",
              icon: Search,
              label: getTranslation("explore", selectedLanguage),
            },
            {
              id: "map",
              icon: Map,
              label: getTranslation("map", selectedLanguage),
            },
            {
              id: "safety",
              icon: Shield,
              label: getTranslation("safety", selectedLanguage),
            },
            {
              id: "profile",
              icon: UserIcon,
              label: getTranslation("profile", selectedLanguage),
            },
          ].map((tab) => {
            const IconComponent = tab.icon;
            const isActive = activeTab === tab.id;

            return (
              <button
                key={tab.id}
                onClick={() =>
                  setActiveTab(tab.id as DashboardTab)
                }
                className={`p-4 text-center ${
                  isActive ? "text-blue-600" : "text-gray-400"
                }`}
              >
                <IconComponent className="w-5 h-5 mx-auto mb-1" />
                <p className="text-xs">{tab.label}</p>
              </button>
            );
          })}
        </div>
      </div>
    </div>
  );
}
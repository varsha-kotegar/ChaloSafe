import React, { useState, useMemo } from "react";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "../ui/card";
import { Button } from "../ui/button";
import { Badge } from "../ui/badge";
import { Input } from "../ui/input";
import { Language } from "../../App";
import {
  Users,
  Shield,
  AlertTriangle,
  FileText,
  Map,
  Phone,
  MapPin,
  Clock,
  CheckCircle2,
  XCircle,
  Navigation,
  LogOut,
  X,
  Search,
  ZoomIn,
  ZoomOut,
  RotateCcw,
  Eye,
} from "lucide-react";
import { ImageWithFallback } from "../figma/ImageWithFallback";
import { AuthorityMapView } from "./AuthorityMapView";
import { InteractiveMapView } from "./InteractiveMapView";

interface AuthorityDashboardProps {
  language: Language;
  onLogout: () => void;
}

type AuthorityTab =
  | "travellers"
  | "map"
  | "risk"
  | "alerts"
  | "fir";

interface Tourist {
  id: string;
  name: string;
  digitalId: string;
  location: string;
  status: "safe" | "caution" | "danger";
  lastSeen: string;
  group?: string[];
  emergencyContact: string;
  tripInfo: string;
}

export function AuthorityDashboard({
  language,
  onLogout,
}: AuthorityDashboardProps) {
  const [activeTab, setActiveTab] =
    useState<AuthorityTab>("travellers");
  const [showMapView, setShowMapView] = useState(false);
  const [trackingTourist, setTrackingTourist] =
    useState<Tourist | null>(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [showSearchResults, setShowSearchResults] = useState(false);
  const [mapZoom, setMapZoom] = useState(1);
  const [mapCenter, setMapCenter] = useState({ x: 50, y: 50 });

  const mockTourists: Tourist[] = [
    {
      id: "T001",
      name: "Arjun Sharma",
      digitalId: "DID_1703123456",
      location: "Goa Beach Resort",
      status: "safe",
      lastSeen: "2 minutes ago",
      group: ["DID_1703123457", "DID_1703123458"],
      emergencyContact: "+91 9876543210",
      tripInfo: "7 days beach vacation",
    },
    {
      id: "T002",
      name: "Priya Reddy",
      digitalId: "DID_1703123459",
      location: "Himalayan Trek Route",
      status: "caution",
      lastSeen: "15 minutes ago",
      emergencyContact: "+91 9876543211",
      tripInfo: "10 days mountain trekking",
    },
    {
      id: "T003",
      name: "Vikram Singh",
      digitalId: "DID_1703123460",
      location: "Restricted Forest Area",
      status: "danger",
      lastSeen: "30 minutes ago",
      emergencyContact: "+91 9876543212",
      tripInfo: "5 days wildlife exploration",
    },
    {
      id: "T004",
      name: "Neha Gupta",
      digitalId: "DID_1703123461",
      location: "Kerala Backwaters",
      status: "safe",
      lastSeen: "5 minutes ago",
      group: ["DID_1703123462"],
      emergencyContact: "+91 9876543213",
      tripInfo: "4 days houseboat trip",
    },
    {
      id: "T005",
      name: "Rohan Mehta",
      digitalId: "DID_1703123463",
      location: "Desert Safari, Rajasthan",
      status: "caution",
      lastSeen: "20 minutes ago",
      group: [],
      emergencyContact: "+91 9876543214",
      tripInfo: "3 days desert adventure",
    },
    {
      id: "T006",
      name: "Sanya Kapoor",
      digitalId: "DID_1703123464",
      location: "Andaman Islands",
      status: "safe",
      lastSeen: "10 minutes ago",
      group: ["DID_1703123465", "DID_1703123466"],
      emergencyContact: "+91 9876543215",
      tripInfo: "6 days snorkeling and beach activities",
    },
    {
      id: "T007",
      name: "Aditya Rao",
      digitalId: "DID_1703123467",
      location: "Darjeeling Tea Gardens",
      status: "safe",
      lastSeen: "8 minutes ago",
      group: [],
      emergencyContact: "+91 9876543216",
      tripInfo: "5 days hill station tour",
    },
    {
      id: "T008",
      name: "Isha Sharma",
      digitalId: "DID_1703123468",
      location: "Sundarbans National Park",
      status: "danger",
      lastSeen: "40 minutes ago",
      group: [],
      emergencyContact: "+91 9876543217",
      tripInfo: "4 days wildlife safari",
    },
    {
      id: "T009",
      name: "Karan Verma",
      digitalId: "DID_1703123469",
      location: "Rishikesh River Rafting",
      status: "caution",
      lastSeen: "12 minutes ago",
      group: ["DID_1703123470"],
      emergencyContact: "+91 9876543218",
      tripInfo: "3 days adventure sports",
    },
    {
      id: "T010",
      name: "Mira Joshi",
      digitalId: "DID_1703123471",
      location: "Coorg Coffee Plantation",
      status: "safe",
      lastSeen: "3 minutes ago",
      group: [],
      emergencyContact: "+91 9876543219",
      tripInfo: "2 days plantation tour",
    },
    {
      id: "T011",
      name: "Ananya Singh",
      digitalId: "DID_1703123472",
      location: "Goa Water Park",
      status: "safe",
      lastSeen: "4 minutes ago",
      group: ["DID_1703123473"],
      emergencyContact: "+91 9876543220",
      tripInfo: "2 days family vacation",
    },
    {
      id: "T012",
      name: "Dev Malhotra",
      digitalId: "DID_1703123473",
      location: "Ranthambore National Park",
      status: "danger",
      lastSeen: "35 minutes ago",
      group: [],
      emergencyContact: "+91 9876543221",
      tripInfo: "3 days wildlife safari",
    },
    {
      id: "T013",
      name: "Pooja Nair",
      digitalId: "DID_1703123474",
      location: "Mysore Palace",
      status: "safe",
      lastSeen: "6 minutes ago",
      group: [],
      emergencyContact: "+91 9876543222",
      tripInfo: "1 day sightseeing",
    },
    {
      id: "T014",
      name: "Rajat Khanna",
      digitalId: "DID_1703123475",
      location: "Leh-Ladakh Road Trip",
      status: "caution",
      lastSeen: "25 minutes ago",
      group: ["DID_1703123476"],
      emergencyContact: "+91 9876543223",
      tripInfo: "7 days high-altitude adventure",
    },
    {
      id: "T015",
      name: "Sneha Pillai",
      digitalId: "DID_1703123476",
      location: "Coastal Kerala Trek",
      status: "safe",
      lastSeen: "7 minutes ago",
      group: ["DID_1703123475"],
      emergencyContact: "+91 9876543224",
      tripInfo: "5 days trekking",
    },
    {
      id: "T016",
      name: "Arjun Kapoor",
      digitalId: "DID_1703123477",
      location: "Hampi Ruins",
      status: "safe",
      lastSeen: "9 minutes ago",
      group: [],
      emergencyContact: "+91 9876543225",
      tripInfo: "3 days historical tour",
    },
    {
      id: "T017",
      name: "Tanya Bhatia",
      digitalId: "DID_1703123478",
      location: "Sikkim Monasteries",
      status: "caution",
      lastSeen: "18 minutes ago",
      group: [],
      emergencyContact: "+91 9876543226",
      tripInfo: "4 days cultural tour",
    },
    {
      id: "T018",
      name: "Vivek Joshi",
      digitalId: "DID_1703123479",
      location: "Kaziranga National Park",
      status: "danger",
      lastSeen: "50 minutes ago",
      group: [],
      emergencyContact: "+91 9876543227",
      tripInfo: "2 days wildlife safari",
    },
    {
      id: "T019",
      name: "Riya Sharma",
      digitalId: "DID_1703123480",
      location: "Manali Ski Resort",
      status: "safe",
      lastSeen: "5 minutes ago",
      group: ["DID_1703123481"],
      emergencyContact: "+91 9876543228",
      tripInfo: "4 days skiing vacation",
    },
    {
      id: "T020",
      name: "Kabir Singh",
      digitalId: "DID_1703123481",
      location: "Manali Ski Resort",
      status: "safe",
      lastSeen: "5 minutes ago",
      group: ["DID_1703123480"],
      emergencyContact: "+91 9876543229",
      tripInfo: "4 days skiing vacation",
    },
  ];

  // Search functionality
  const filteredTourists = useMemo(() => {
    if (!searchTerm.trim()) return mockTourists;
    
    return mockTourists.filter(tourist => 
      tourist.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      tourist.digitalId.toLowerCase().includes(searchTerm.toLowerCase()) ||
      tourist.location.toLowerCase().includes(searchTerm.toLowerCase()) ||
      tourist.status.toLowerCase().includes(searchTerm.toLowerCase()) ||
      tourist.tripInfo.toLowerCase().includes(searchTerm.toLowerCase())
    );
  }, [searchTerm]);

  const handleSearch = () => {
    if (searchTerm.trim()) {
      setShowSearchResults(true);
    }
  };

  const handleMapZoom = (direction: 'in' | 'out' | 'reset') => {
    if (direction === 'in') {
      setMapZoom(prev => Math.min(prev + 0.2, 3));
    } else if (direction === 'out') {
      setMapZoom(prev => Math.max(prev - 0.2, 0.5));
    } else {
      setMapZoom(1);
      setMapCenter({ x: 50, y: 50 });
    }
  };

  const activeSosAlerts = [
    {
      id: "SOS001",
      tourist: "Meera Joshi",
      digitalId: "DID_1703123461",
      location: "Lat: 15.3173, Lng: 75.7139",
      emergencyType: "Medical Emergency",
      timeAgo: "5 minutes ago",
      status: "active",
      emergencyContact: "+91 9876543213",
    },
    {
      id: "SOS002",
      tourist: "Raj Patel",
      digitalId: "DID_1703123462",
      location: "Lat: 19.0760, Lng: 72.8777",
      emergencyType: "Safety Threat",
      timeAgo: "12 minutes ago",
      status: "assigned",
      emergencyContact: "+91 9876543214",
    },
  ];

  const getStatusColor = (status: string) => {
    switch (status) {
      case "safe":
        return "bg-green-100 text-green-800";
      case "caution":
        return "bg-yellow-100 text-yellow-800";
      case "danger":
        return "bg-red-100 text-red-800";
      default:
        return "bg-gray-100 text-gray-800";
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case "safe":
        return <CheckCircle2 className="w-4 h-4" />;
      case "caution":
        return <AlertTriangle className="w-4 h-4" />;
      case "danger":
        return <XCircle className="w-4 h-4" />;
      default:
        return <Shield className="w-4 h-4" />;
    }
  };

  const handleAcceptSos = (alertId: string) => {
    alert(
      `SOS case ${alertId} accepted. Officer dispatched to location.`,
    );
  };

  const handleCallTourist = (phone: string) => {
    alert(`Calling ${phone}...`);
  };

  const handleTrackTourist = (tourist: Tourist) => {
    setTrackingTourist(tourist);
    setShowMapView(true);
  };

  const getTravellerLocations = () => {
    return mockTourists.map((tourist) => ({
      id: tourist.id,
      name: tourist.name,
      digitalId: tourist.digitalId,
      latitude: 28.6139 + (Math.random() - 0.5) * 0.1, // Mock coordinates around Delhi
      longitude: 77.209 + (Math.random() - 0.5) * 0.1,
      status: tourist.status,
      lastSeen: tourist.lastSeen,
      location: tourist.location,
    }));
  };

  const getTravellersInDanger = () => {
    return mockTourists.filter(
      (tourist) =>
        tourist.status === "danger" ||
        tourist.status === "caution",
    );
  };

  const renderTravellersTab = () => (
    <div className="space-y-4">
      <div className="grid grid-cols-3 gap-4 mb-6">
        <Card>
          <CardContent className="p-4 text-center">
            <div className="text-2xl font-bold text-green-600">
              {
                mockTourists.filter((t) => t.status === "safe")
                  .length
              }
            </div>
            <div className="text-sm text-gray-600">Safe</div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4 text-center">
            <div className="text-2xl font-bold text-yellow-600">
              {
                mockTourists.filter(
                  (t) => t.status === "caution",
                ).length
              }
            </div>
            <div className="text-sm text-gray-600">Caution</div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4 text-center">
            <div className="text-2xl font-bold text-red-600">
              {
                mockTourists.filter(
                  (t) => t.status === "danger",
                ).length
              }
            </div>
            <div className="text-sm text-gray-600">At Risk</div>
          </CardContent>
        </Card>
      </div>
      <div className="mb-4">
        <div className="flex space-x-2">
          <Input
            type="text"
            placeholder="Search by name, ID, location or status..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            onKeyPress={(e) => e.key === 'Enter' && handleSearch()}
            className="flex-1"
          />
          <Button
            onClick={handleSearch}
            disabled={!searchTerm.trim()}
            size="sm"
            className="px-4"
          >
            <Search className="w-4 h-4 mr-1" />
            Search
          </Button>
        </div>
      </div>


      {/* Search Results Header */}
      {showSearchResults && searchTerm && (
        <div className="mb-4 p-3 bg-blue-50 border border-blue-200 rounded-lg">
          <div className="flex items-center justify-between">
            <div>
              <h4 className="font-medium text-blue-800">
                Search Results for "{searchTerm}"
              </h4>
              <p className="text-sm text-blue-600">
                Found {filteredTourists.length} traveller(s)
              </p>
            </div>
            <Button
              variant="outline"
              size="sm"
              onClick={() => {
                setShowSearchResults(false);
                setSearchTerm("");
              }}
            >
              <X className="w-4 h-4 mr-1" />
              Clear
            </Button>
          </div>
        </div>
      )}

      {(showSearchResults ? filteredTourists : mockTourists).map((tourist) => (
        <Card key={tourist.id}>
          <CardContent className="p-4">
            <div className="flex items-start justify-between">
              <div className="flex-1">
                <div className="flex items-center space-x-2 mb-2">
                  <h4 className="font-medium">
                    {tourist.name}
                  </h4>
                  <Badge
                    className={getStatusColor(tourist.status)}
                  >
                    {getStatusIcon(tourist.status)}
                    <span className="ml-1 capitalize">
                      {tourist.status}
                    </span>
                  </Badge>
                </div>

                <div className="space-y-1 text-sm text-gray-600">
                  <p>
                    <strong>Digital ID:</strong>{" "}
                    {tourist.digitalId}
                  </p>
                  <p>
                    <strong>Location:</strong>{" "}
                    {tourist.location}
                  </p>
                  <p>
                    <strong>Last Seen:</strong>{" "}
                    {tourist.lastSeen}
                  </p>
                  <p>
                    <strong>Trip:</strong> {tourist.tripInfo}
                  </p>
                  {tourist.group && (
                    <p>
                      <strong>Group Members:</strong>{" "}
                      {tourist.group.length} others
                    </p>
                  )}
                </div>
              </div>

              <div className="space-y-2">
                <Button
                  size="sm"
                  variant="outline"
                  onClick={() => handleTrackTourist(tourist)}
                >
                  <MapPin className="w-3 h-3 mr-1" />
                  Track
                </Button>
                <Button
                  size="sm"
                  variant="outline"
                  onClick={() =>
                    handleCallTourist(tourist.emergencyContact)
                  }
                >
                  <Phone className="w-3 h-3 mr-1" />
                  Call
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>
      ))}
    </div>
  );

  // const renderSafeTab = () => (
  //   <div className="space-y-4">
  //     <Card>
  //       <CardHeader>
  //         <CardTitle className="flex items-center space-x-2">
  //           <CheckCircle2 className="w-5 h-5 text-green-600" />
  //           <span>Safe Travellers</span>
  //         </CardTitle>
  //       </CardHeader>
  //       <CardContent>
  //         <p className="text-gray-600 mb-4">Tourists currently in safe zones</p>
  //         {mockTourists.filter(t => t.status === 'safe').map((tourist) => (
  //           <div key={tourist.id} className="flex items-center justify-between py-2 border-b last:border-b-0">
  //             <div>
  //               <p className="font-medium">{tourist.name}</p>
  //               <p className="text-sm text-gray-600">{tourist.location}</p>
  //             </div>
  //             <Badge className="bg-green-100 text-green-800">Safe</Badge>
  //           </div>
  //         ))}
  //       </CardContent>
  //     </Card>
  //   </div>
  // );

  const renderRiskTab = () => (
    <div className="space-y-4">
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center space-x-2">
            <AlertTriangle className="w-5 h-5 text-red-600" />
            <span>Risk Travellers</span>
          </CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-gray-600 mb-4">
            Tourists flagged by AI monitoring
          </p>
          {mockTourists
            .filter((t) => t.status !== "safe")
            .map((tourist) => (
              <div
                key={tourist.id}
                className="p-3 border rounded-lg mb-3"
              >
                <div className="flex items-start justify-between">
                  <div>
                    <p className="font-medium">
                      {tourist.name}
                    </p>
                    <p className="text-sm text-gray-600">
                      {tourist.location}
                    </p>
                    <div className="mt-2">
                      <Badge
                        className={getStatusColor(
                          tourist.status,
                        )}
                      >
                        {tourist.status === "caution"
                          ? "Entered Caution Zone"
                          : "In Restricted Area - No Movement 30min"}
                      </Badge>
                    </div>
                  </div>
                  <div className="space-y-1">
                    <Button size="sm" className="w-full">
                      Dispatch Help
                    </Button>
                    <Button
                      size="sm"
                      variant="outline"
                      className="w-full"
                    >
                      <Phone className="w-3 h-3 mr-1" />
                      Call
                    </Button>
                  </div>
                </div>
              </div>
            ))}
        </CardContent>
      </Card>
    </div>
  );

  const renderAlertsTab = () => (
    <div className="space-y-4">
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center space-x-2">
            <AlertTriangle className="w-5 h-5 text-red-600" />
            <span>Active SOS Alerts</span>
          </CardTitle>
        </CardHeader>
        <CardContent>
          {activeSosAlerts.map((alert) => (
            <div
              key={alert.id}
              className="p-4 border-l-4 border-red-500 bg-red-50 rounded-lg mb-4"
            >
              <div className="flex items-start justify-between">
                <div className="flex-1">
                  <div className="flex items-center space-x-2 mb-2">
                    <h4 className="font-medium text-red-800">
                      {alert.tourist}
                    </h4>
                    <Badge
                      className={
                        alert.status === "active"
                          ? "bg-red-100 text-red-800"
                          : "bg-blue-100 text-blue-800"
                      }
                    >
                      {alert.status === "active"
                        ? "URGENT"
                        : "ASSIGNED"}
                    </Badge>
                  </div>

                  <div className="space-y-1 text-sm">
                    <p>
                      <strong>Emergency Type:</strong>{" "}
                      {alert.emergencyType}
                    </p>
                    <p>
                      <strong>Location:</strong>{" "}
                      {alert.location}
                    </p>
                    <p>
                      <strong>Digital ID:</strong>{" "}
                      {alert.digitalId}
                    </p>
                    <p>
                      <strong>Time:</strong> {alert.timeAgo}
                    </p>
                    <p>
                      <strong>Emergency Contact:</strong>{" "}
                      {alert.emergencyContact}
                    </p>
                  </div>
                </div>

                <div className="space-y-2 ml-4">
                  {alert.status === "active" && (
                    <Button
                      size="sm"
                      className="bg-red-600 hover:bg-red-700"
                      onClick={() => handleAcceptSos(alert.id)}
                    >
                      Accept Case
                    </Button>
                  )}
                  <Button size="sm" variant="outline">
                    <Navigation className="w-3 h-3 mr-1" />
                    Navigate
                  </Button>
                  <Button
                    size="sm"
                    variant="outline"
                    onClick={() =>
                      handleCallTourist(alert.emergencyContact)
                    }
                  >
                    <Phone className="w-3 h-3 mr-1" />
                    Call
                  </Button>
                </div>
              </div>
            </div>
          ))}
        </CardContent>
      </Card>
    </div>
  );

  const renderFirTab = () => (
    <div className="space-y-4">
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center space-x-2">
            <FileText className="w-5 h-5 text-blue-600" />
            <span>E-FIR Management</span>
          </CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-gray-600 mb-4">
            Auto-generated FIR forms for SOS cases
          </p>

          {activeSosAlerts.map((alert) => (
            <div
              key={alert.id}
              className="p-4 border rounded-lg mb-4"
            >
              <div className="flex items-start justify-between">
                <div className="flex-1">
                  <h4 className="font-medium mb-2">
                    FIR for {alert.tourist}
                  </h4>
                  <div className="space-y-1 text-sm text-gray-600">
                    <p>
                      <strong>Case ID:</strong> FIR_{alert.id}_
                      {new Date().getFullYear()}
                    </p>
                    <p>
                      <strong>Tourist Details:</strong>{" "}
                      {alert.tourist} ({alert.digitalId})
                    </p>
                    <p>
                      <strong>Incident Time:</strong>{" "}
                      {new Date().toLocaleString()}
                    </p>
                    <p>
                      <strong>Location:</strong>{" "}
                      {alert.location}
                    </p>
                    <p>
                      <strong>Emergency Type:</strong>{" "}
                      {alert.emergencyType}
                    </p>
                    <p>
                      <strong>Status:</strong> Under
                      Investigation
                    </p>
                  </div>
                </div>

                <div className="space-y-2">
                  <Button size="sm" variant="outline">
                    Review FIR
                  </Button>
                  <Button size="sm">Submit FIR</Button>
                </div>
              </div>
            </div>
          ))}
        </CardContent>
      </Card>
    </div>
  );

  const renderMapView = () => {
    const travellerLocations = getTravellerLocations();
    const dangersInMap = getTravellersInDanger();

    return (
      <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center p-4">
        <div className="w-full h-full max-w-6xl max-h-[90vh] bg-white rounded-lg shadow-xl overflow-hidden">
          <div className="h-full relative">
            <div 
              className="w-full h-full overflow-hidden relative"
              style={{
                transform: `scale(${mapZoom})`,
                transformOrigin: `${mapCenter.x}% ${mapCenter.y}%`,
                transition: 'transform 0.3s ease'
              }}
            >
              <ImageWithFallback
                src="https://images.unsplash.com/photo-1625428354222-ce52b4227b26?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxzYXRlbGxpdGUlMjB2aWV3JTIwY2l0eSUyMGFlcmlhbHxlbnwxfHx8fDE3NTg4MjczODh8MA&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral"
                alt="Real Location Satellite View"
                className="w-full h-full object-cover"
              />
            </div>

            {/* Map Controls */}
            <div className="absolute top-4 right-20 flex flex-col space-y-2 z-20">
              <Button
                variant="outline"
                size="sm"
                onClick={() => handleMapZoom('in')}
                className="bg-white hover:bg-gray-50"
                disabled={mapZoom >= 3}
              >
                <ZoomIn className="w-4 h-4" />
              </Button>
              <Button
                variant="outline"
                size="sm"
                onClick={() => handleMapZoom('out')}
                className="bg-white hover:bg-gray-50"
                disabled={mapZoom <= 0.5}
              >
                <ZoomOut className="w-4 h-4" />
              </Button>
              <Button
                variant="outline"
                size="sm"
                onClick={() => handleMapZoom('reset')}
                className="bg-white hover:bg-gray-50"
              >
                <RotateCcw className="w-4 h-4" />
              </Button>
            </div>

            {/* Map overlays */}
            <div className="absolute inset-0">
              {/* Header */}
              <div className="absolute top-4 left-4 right-32 flex justify-between items-start">
                <div className="space-y-2">
                  <Badge className="bg-blue-600 text-white">
                    👮 Authority View
                  </Badge>
                  <div className="space-y-1">
                    {/* <Badge className="bg-green-100 text-green-800">
                      🟢 Safe (
                      {
                        mockTourists.filter(
                          (t) => t.status === "safe",
                        ).length
                      }
                      )
                    </Badge> */}
                    <Badge className="bg-yellow-100 text-yellow-800">
                      ⚠️ Caution (
                      {
                        mockTourists.filter(
                          (t) => t.status === "caution",
                        ).length
                      }
                      )
                    </Badge>
                    <Badge className="bg-red-100 text-red-800">
                      🚨 Danger (
                      {
                        mockTourists.filter(
                          (t) => t.status === "danger",
                        ).length
                      }
                      )
                    </Badge>
                  </div>
                </div>

                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => setShowMapView(false)}
                  className="bg-white"
                >
                  <X className="w-4 h-4 mr-2" />
                  Close Map
                </Button>
              </div>

              {/* Traveller locations */}
              {travellerLocations.map((traveller, index) => {
                const positions = [
                  { top: "25%", left: "30%" },
                  { top: "40%", right: "35%" },
                  { top: "60%", left: "25%" },
                  { top: "70%", right: "20%" },
                  { top: "35%", left: "50%" },
                ];
                const position =
                  positions[index % positions.length];

                return (
                  <div
                    key={traveller.id}
                    className="absolute"
                    style={position}
                  >
                    <div className="relative group">
                      <div
                        className={`w-4 h-4 rounded-full border-2 border-white shadow-lg ${
                          traveller.status === "safe"
                            ? "bg-green-500"
                            : traveller.status === "caution"
                              ? "bg-yellow-500"
                              : "bg-red-500 animate-pulse"
                        }`}
                      ></div>

                      {/* Tooltip */}
                      <div className="absolute bottom-6 left-1/2 transform -translate-x-1/2 bg-white rounded-lg shadow-lg p-3 min-w-48 opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none z-10">
                        <h4 className="font-medium text-sm">
                          {traveller.name}
                        </h4>
                        <p className="text-xs text-gray-600">
                          {traveller.digitalId}
                        </p>
                        <p className="text-xs text-gray-600">
                          {traveller.location}
                        </p>
                        <p className="text-xs text-gray-600">
                          Last seen: {traveller.lastSeen}
                        </p>
                        <Badge
                          className={`mt-1 text-xs ${
                            traveller.status === "safe"
                              ? "bg-green-100 text-green-800"
                              : traveller.status === "caution"
                                ? "bg-yellow-100 text-yellow-800"
                                : "bg-red-100 text-red-800"
                          }`}
                        >
                          {traveller.status
                            .charAt(0)
                            .toUpperCase() +
                            traveller.status.slice(1)}
                        </Badge>
                      </div>
                    </div>
                  </div>
                );
              })}

              {/* Tracking focus for specific tourist */}
              {trackingTourist && (
                <div className="absolute bottom-4 left-4 bg-white rounded-lg p-4 shadow-lg max-w-sm">
                  <h4 className="font-medium mb-2">
                    Tracking: {trackingTourist.name}
                  </h4>
                  <div className="space-y-1 text-sm text-gray-600">
                    <p>
                      <strong>Digital ID:</strong>{" "}
                      {trackingTourist.digitalId}
                    </p>
                    <p>
                      <strong>Location:</strong>{" "}
                      {trackingTourist.location}
                    </p>
                    <p>
                      <strong>Status:</strong>
                      <Badge
                        className={`ml-2 ${getStatusColor(trackingTourist.status)}`}
                      >
                        {trackingTourist.status}
                      </Badge>
                    </p>
                    <p>
                      <strong>Last Seen:</strong>{" "}
                      {trackingTourist.lastSeen}
                    </p>
                  </div>
                  <div className="flex space-x-2 mt-3">
                    <Button size="sm" variant="outline">
                      <Navigation className="w-3 h-3 mr-1" />
                      Navigate
                    </Button>
                    <Button
                      size="sm"
                      variant="outline"
                      onClick={() =>
                        handleCallTourist(
                          trackingTourist.emergencyContact,
                        )
                      }
                    >
                      <Phone className="w-3 h-3 mr-1" />
                      Call
                    </Button>
                  </div>
                </div>
              )}

              {/* Danger zone summary */}
              {dangersInMap.length > 0 && (
                <div className="absolute bottom-4 right-4 bg-red-50 border border-red-200 rounded-lg p-4 shadow-lg max-w-sm">
                  <h4 className="font-medium text-red-800 mb-2 flex items-center">
                    <AlertTriangle className="w-4 h-4 mr-2" />
                    Travellers in Danger Zones
                  </h4>
                  <div className="space-y-2">
                    {dangersInMap.map((tourist) => (
                      <div
                        key={tourist.id}
                        className="flex items-center justify-between text-sm"
                      >
                        <span className="text-red-700">
                          {tourist.name}
                        </span>
                        <Badge
                          className={getStatusColor(
                            tourist.status,
                          )}
                        >
                          {tourist.status}
                        </Badge>
                      </div>
                    ))}
                  </div>
                  <Button
                    size="sm"
                    className="w-full mt-3 bg-red-600 hover:bg-red-700 text-white"
                    onClick={() => {
                      setShowMapView(false);
                      setActiveTab("risk");
                    }}
                  >
                    View Risk Dashboard
                  </Button>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    );
  };

  const renderSearchResults = () => (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <div>
          <h3 className="text-lg font-medium">Search Results</h3>
          <p className="text-sm text-gray-600">
            Found {filteredTourists.length} result(s) for "{searchTerm}"
          </p>
        </div>
        <Button
          variant="outline"
          size="sm"
          onClick={() => {
            setShowSearchResults(false);
            setSearchTerm("");
          }}
        >
          <X className="w-4 h-4 mr-1" />
          Close Search
        </Button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {filteredTourists.map((tourist) => (
          <Card key={tourist.id} className="hover:shadow-md transition-shadow">
            <CardContent className="p-4">
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <h4 className="font-medium">{tourist.name}</h4>
                  <Badge className={getStatusColor(tourist.status)}>
                    {getStatusIcon(tourist.status)}
                    <span className="ml-1 capitalize">{tourist.status}</span>
                  </Badge>
                </div>

                <div className="space-y-2 text-sm">
                  <div className="flex items-center space-x-2">
                    <MapPin className="w-4 h-4 text-gray-400" />
                    <span className="text-gray-600">{tourist.location}</span>
                  </div>
                  <div className="flex items-center space-x-2">
                    <Eye className="w-4 h-4 text-gray-400" />
                    <span className="text-gray-600">Last seen: {tourist.lastSeen}</span>
                  </div>
                  <div className="text-gray-600">
                    <span className="font-medium">Digital ID:</span> {tourist.digitalId}
                  </div>
                  <div className="text-gray-600">
                    <span className="font-medium">Trip:</span> {tourist.tripInfo}
                  </div>
                  {tourist.group && tourist.group.length > 0 && (
                    <div className="text-gray-600">
                      <span className="font-medium">Group:</span> {tourist.group.length} members
                    </div>
                  )}
                </div>

                <div className="flex space-x-2 pt-2">
                  <Button
                    size="sm"
                    variant="outline"
                    onClick={() => handleTrackTourist(tourist)}
                    className="flex-1"
                  >
                    <MapPin className="w-3 h-3 mr-1" />
                    Track
                  </Button>
                  <Button
                    size="sm"
                    variant="outline"
                    onClick={() => handleCallTourist(tourist.emergencyContact)}
                    className="flex-1"
                  >
                    <Phone className="w-3 h-3 mr-1" />
                    Call
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {filteredTourists.length === 0 && (
        <div className="text-center py-8">
          <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
            <Search className="w-8 h-8 text-gray-400" />
          </div>
          <h4 className="font-medium text-gray-900 mb-2">No results found</h4>
          <p className="text-gray-600">
            Try adjusting your search terms or browse all travellers in the "All" tab.
          </p>
        </div>
      )}
    </div>
  );

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white shadow-sm p-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <div className="w-10 h-10 bg-green-100 rounded-full flex items-center justify-center">
              <Shield className="w-5 h-5 text-green-600" />
            </div>
            <div>
              <p className="font-medium">Authority Dashboard</p>
              <p className="text-sm text-gray-600">
                Police & Tourism Control
              </p>
            </div>
          </div>
          <div className="flex items-center space-x-2">
            <div className="flex items-center space-x-2">
              <Input
                type="text"
                placeholder="Quick search tourists..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                onKeyPress={(e) => e.key === 'Enter' && handleSearch()}
                className="w-48"
              />
              <Button
                onClick={handleSearch}
                disabled={!searchTerm.trim()}
                size="sm"
              >
                <Search className="w-4 h-4" />
              </Button>
            </div>
            <Button
              variant="outline"
              size="sm"
              onClick={() => setShowMapView(true)}
            >
              <Map className="w-4 h-4 mr-2" />
              Map View
            </Button>
            <Button
              variant="outline"
              size="sm"
              onClick={onLogout}
              className="text-red-600 hover:text-red-700 hover:border-red-300"
            >
              <LogOut className="w-4 h-4 mr-2" />
              Logout
            </Button>
          </div>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="p-4">
        <div className="grid grid-cols-2 gap-4 mb-6">
          <Card>
            <CardContent className="p-4 text-center">
              <div className="text-2xl font-bold text-blue-600">
                {mockTourists.length}
              </div>
              <div className="text-sm text-gray-600">
                Total Tourists
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-4 text-center">
              <div className="text-2xl font-bold text-red-600">
                {activeSosAlerts.length}
              </div>
              <div className="text-sm text-gray-600">
                Active Alerts
              </div>
            </CardContent>
          </Card>
        </div>
      </div>

      {/* Content */}
      <div className="px-4 pb-24">
        {showSearchResults && searchTerm ? (
          renderSearchResults()
        ) : (
          <>
            {activeTab === "travellers" && renderTravellersTab()}
            {activeTab === "risk" && renderRiskTab()}
            {activeTab === "alerts" && renderAlertsTab()}
            {activeTab === "fir" && renderFirTab()}
          </>
        )}
      </div>

      {/* Bottom Navigation */}
      <div className="fixed bottom-0 left-0 right-0 bg-white border-t border-gray-200">
        <div className="grid grid-cols-4">
          {[
            { id: "travellers", icon: Users, label: "All" },
            { id: "risk", icon: AlertTriangle, label: "Risk" },
            { id: "alerts", icon: AlertTriangle, label: "SOS" },
            { id: "fir", icon: FileText, label: "FIR" },
          ].map((tab) => {
            const IconComponent = tab.icon;
            const isActive = activeTab === tab.id;

            return (
              <button
                key={tab.id}
                onClick={() =>
                  setActiveTab(tab.id as AuthorityTab)
                }
                className={`p-3 text-center ${
                  isActive ? "text-green-600" : "text-gray-400"
                }`}
              >
                <IconComponent className="w-5 h-5 mx-auto mb-1" />
                <p className="text-xs">{tab.label}</p>
              </button>
            );
          })}
        </div>
      </div>

      {/* Map View Modal */}
      {showMapView && (
        <InteractiveMapView
          tourists={getTravellerLocations()}
          onClose={() => setShowMapView(false)}
          trackingTourist={trackingTourist}
          onCallTourist={handleCallTourist}
        />
      )}
    </div>
  );
}
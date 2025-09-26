import React, { useState, useEffect } from 'react';
import { Button } from '../ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '../ui/card';
import { Badge } from '../ui/badge';
import { User, Language } from '../../App';
import { getTranslation } from '../../utils/translations';
import { getIdGeneratorTranslation } from '../../utils/idGeneratorTranslations';
import { CreditCard, Plus, LogOut, Users, Calendar, MapPin, Phone } from 'lucide-react';
import { DigitalIdRegistration } from '../traveller/DigitalIdRegistration';
import { mockAuth } from '../../utils/mockAuth';
import { toast } from 'sonner@2.0.3';

interface IDGeneratorDashboardProps {
  user: User | null;
  selectedLanguage: Language;
  onLogout: () => void;
}

interface CreatedDigitalId {
  id: string;
  digitalId: string;
  firstName: string;
  lastName: string;
  nationality: string;
  age: string;
  phone: string;
  tripType: 'solo' | 'group';
  tripDuration: string;
  itinerary: string;
  startDate: string;
  emergencyName: string;
  emergencyPhone: string;
  qrCode: string;
  createdAt: string;
  validUntil: string;
}

export function IDGeneratorDashboard({ user, selectedLanguage, onLogout }: IDGeneratorDashboardProps) {
  const [showCreateForm, setShowCreateForm] = useState(false);
  const [createdIds, setCreatedIds] = useState<CreatedDigitalId[]>([]);

  useEffect(() => {
    // Load created IDs from local storage
    const storedIds = localStorage.getItem('chalosafe_created_ids');
    if (storedIds) {
      setCreatedIds(JSON.parse(storedIds));
    }
  }, []);

  const handleCreateNewId = async (userData: User & { email?: string, tripType?: 'solo' | 'group' }, aadhaarNumber?: string, aadhaarDetails?: any) => {
    try {
      // Create new digital ID
      const newId: CreatedDigitalId = {
        id: `id-${Date.now()}`,
        digitalId: `CHS-TR-${Date.now()}`,
        firstName: userData.firstName!,
        lastName: userData.lastName!,
        nationality: userData.nationality!,
        age: userData.age!,
        phone: userData.phone!,
        tripType: userData.tripType || 'solo',
        tripDuration: userData.tripDuration!,
        itinerary: userData.itinerary!,
        startDate: userData.startDate!,
        emergencyName: userData.emergencyName!,
        emergencyPhone: userData.emergencyPhone!,
        qrCode: `data:image/svg+xml;base64,${btoa(`<svg xmlns="http://www.w3.org/2000/svg" width="200" height="200" viewBox="0 0 200 200"><rect width="200" height="200" fill="white"/><rect x="20" y="20" width="20" height="20" fill="black"/><rect x="60" y="20" width="20" height="20" fill="black"/><rect x="100" y="20" width="20" height="20" fill="black"/><text x="100" y="150" text-anchor="middle" font-size="12">${userData.digitalId || newId.digitalId}</text></svg>`)}`,
        createdAt: new Date().toISOString(),
        validUntil: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString() // 30 days validity
      };

      const updatedIds = [...createdIds, newId];
      setCreatedIds(updatedIds);
      localStorage.setItem('chalosafe_created_ids', JSON.stringify(updatedIds));

      setShowCreateForm(false);
      toast.success(`Digital ID created successfully for ${userData.firstName} ${userData.lastName}!`);
    } catch (error) {
      console.error('Failed to create digital ID:', error);
      toast.error('Failed to create digital ID. Please try again.');
    }
  };

  const handleDownloadQR = (id: CreatedDigitalId) => {
    // Create a download link for the QR code
    const link = document.createElement('a');
    link.href = id.qrCode;
    link.download = `chalosafe-qr-${id.digitalId}.svg`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    toast.success('QR Code downloaded successfully!');
  };

  const handleShareId = (id: CreatedDigitalId) => {
    const shareText = `ChaloSafe Digital ID: ${id.digitalId}\\nName: ${id.firstName} ${id.lastName}\\nValid until: ${new Date(id.validUntil).toLocaleDateString()}`;
    
    if (navigator.share) {
      navigator.share({
        title: 'ChaloSafe Digital ID',
        text: shareText,
      });
    } else {
      navigator.clipboard.writeText(shareText);
      toast.success('ID information copied to clipboard!');
    }
  };

  if (showCreateForm) {
    return (
      <div className="min-h-screen bg-gray-50">
        <div className="bg-white border-b px-4 py-3 flex items-center justify-between">
          <h1 className="text-lg font-medium">{getIdGeneratorTranslation('createNewDigitalId', selectedLanguage)}</h1>
          <Button
            variant="outline"
            onClick={() => setShowCreateForm(false)}
          >
            {getIdGeneratorTranslation('backToDashboard', selectedLanguage)}
          </Button>
        </div>
        <DigitalIdRegistration
          onComplete={handleCreateNewId}
          selectedLanguage={selectedLanguage}
          suggestedEmail=""
          isIDGenerator={true}
        />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white border-b px-4 py-3">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <div className="bg-purple-100 p-2 rounded-lg">
              <CreditCard className="w-6 h-6 text-purple-600" />
            </div>
            <div>
              <h1 className="font-medium">{getIdGeneratorTranslation('idGeneratorDashboard', selectedLanguage)}</h1>
              <p className="text-sm text-gray-600">{getIdGeneratorTranslation('welcome', selectedLanguage)}, {user?.name}</p>
            </div>
          </div>
          <div className="flex items-center space-x-2">
            <Button
              onClick={() => setShowCreateForm(true)}
              className="bg-purple-600 hover:bg-purple-700"
            >
              <Plus className="w-4 h-4 mr-2" />
              {getIdGeneratorTranslation('newIdCreate', selectedLanguage)}
            </Button>
            <Button
              variant="outline"
              onClick={onLogout}
            >
              <LogOut className="w-4 h-4 mr-2" />
              {getIdGeneratorTranslation('logout', selectedLanguage)}
            </Button>
          </div>
        </div>
      </div>

      {/* Stats */}
      <div className="p-4">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
          <Card>
            <CardContent className="p-4">
              <div className="flex items-center space-x-2">
                <Users className="w-5 h-5 text-blue-600" />
                <div>
                  <p className="text-sm text-gray-600">{getIdGeneratorTranslation('totalIdsCreated', selectedLanguage)}</p>
                  <p className="text-2xl font-medium">{createdIds.length}</p>
                </div>
              </div>
            </CardContent>
          </Card>
          
          <Card>
            <CardContent className="p-4">
              <div className="flex items-center space-x-2">
                <Calendar className="w-5 h-5 text-green-600" />
                <div>
                  <p className="text-sm text-gray-600">{getIdGeneratorTranslation('activeIds', selectedLanguage)}</p>
                  <p className="text-2xl font-medium">
                    {createdIds.filter(id => new Date(id.validUntil) > new Date()).length}
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>
          
          <Card>
            <CardContent className="p-4">
              <div className="flex items-center space-x-2">
                <MapPin className="w-5 h-5 text-purple-600" />
                <div>
                  <p className="text-sm text-gray-600">{getIdGeneratorTranslation('countriesCovered', selectedLanguage)}</p>
                  <p className="text-2xl font-medium">
                    {new Set(createdIds.map(id => id.nationality)).size}
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Created IDs List */}
        <div className="space-y-4">
          <h2 className="text-lg font-medium">{getIdGeneratorTranslation('createdDigitalIds', selectedLanguage)}</h2>
          
          {createdIds.length === 0 ? (
            <Card>
              <CardContent className="p-8 text-center">
                <CreditCard className="w-12 h-12 text-gray-400 mx-auto mb-4" />
                <p className="text-gray-600 mb-4">{getIdGeneratorTranslation('noDigitalIds', selectedLanguage)}</p>
                <Button
                  onClick={() => setShowCreateForm(true)}
                  className="bg-purple-600 hover:bg-purple-700"
                >
                  <Plus className="w-4 h-4 mr-2" />
                  {getIdGeneratorTranslation('createFirstId', selectedLanguage)}
                </Button>
              </CardContent>
            </Card>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {createdIds.map((id) => (
                <Card key={id.id} className="hover:shadow-md transition-shadow">
                  <CardHeader className="pb-3">
                    <div className="flex items-center justify-between">
                      <CardTitle className="text-base">{id.firstName} {id.lastName}</CardTitle>
                      <Badge variant={new Date(id.validUntil) > new Date() ? "default" : "destructive"}>
                        {new Date(id.validUntil) > new Date() ? getIdGeneratorTranslation('active', selectedLanguage) : getIdGeneratorTranslation('expired', selectedLanguage)}
                      </Badge>
                    </div>
                    <p className="text-sm text-gray-600 font-mono">{id.digitalId}</p>
                  </CardHeader>
                  
                  <CardContent className="space-y-3">
                    <div className="space-y-2 text-sm">
                      <div className="flex items-center space-x-2">
                        <MapPin className="w-4 h-4 text-gray-400" />
                        <span>{id.nationality}</span>
                      </div>
                      <div className="flex items-center space-x-2">
                        <Calendar className="w-4 h-4 text-gray-400" />
                        <span>{id.tripDuration} • {id.tripType}</span>
                      </div>
                      <div className="flex items-center space-x-2">
                        <Phone className="w-4 h-4 text-gray-400" />
                        <span>{id.phone}</span>
                      </div>
                    </div>
                    
                    <div className="text-xs text-gray-500">
                      <p>{getIdGeneratorTranslation('created', selectedLanguage)}: {new Date(id.createdAt).toLocaleDateString()}</p>
                      <p>{getIdGeneratorTranslation('validUntil', selectedLanguage)}: {new Date(id.validUntil).toLocaleDateString()}</p>
                    </div>
                    
                    <div className="flex space-x-2 pt-2">
                      <Button
                        size="sm"
                        variant="outline"
                        onClick={() => handleDownloadQR(id)}
                        className="flex-1"
                      >
                        {getIdGeneratorTranslation('downloadQr', selectedLanguage)}
                      </Button>
                      <Button
                        size="sm"
                        variant="outline"
                        onClick={() => handleShareId(id)}
                        className="flex-1"
                      >
                        {getIdGeneratorTranslation('share', selectedLanguage)}
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
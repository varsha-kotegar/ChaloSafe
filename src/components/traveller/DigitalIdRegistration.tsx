import React, { useState } from 'react';
import { Button } from '../ui/button';
import { Input } from '../ui/input';
import { Label } from '../ui/label';
import { Card, CardContent, CardHeader, CardTitle } from '../ui/card';
import { Badge } from '../ui/badge';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '../ui/select';
import { Textarea } from '../ui/textarea';
import { RadioGroup, RadioGroupItem } from '../ui/radio-group';
import { ScrollArea } from '../ui/scroll-area';
import { RegistrationHelper } from '../RegistrationHelper';

import { Language, User } from '../../App';
import { QrCode, Download, Share2, ArrowLeft, ArrowRight, Search, Loader2, Shield, CheckCircle, AlertCircle } from 'lucide-react';
import { getTranslation, nationalities } from '../../utils/translations';
import { toast } from 'sonner@2.0.3';

interface DigitalIdRegistrationProps {
  onComplete: (user: User & { tripType?: 'solo' | 'group' }, aadhaarNumber?: string, aadhaarDetails?: any) => void;
  language: Language;
  suggestedEmail?: string;
  isIDGenerator?: boolean;
}

type RegistrationStep = 'personal' | 'verification' | 'trip' | 'digital-id';

export function DigitalIdRegistration({ onComplete, language, suggestedEmail = '', isIDGenerator = false }: DigitalIdRegistrationProps) {
  const [currentStep, setCurrentStep] = useState<RegistrationStep>('personal');
  const [nationalitySearch, setNationalitySearch] = useState('');
  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    email: suggestedEmail,
    nationality: '',
    age: '',
    phone: '',
    idType: '' as 'aadhaar' | 'passport' | '',
    idNumber: '',
    otp: '',
    dateOfBirth: '',
    gender: '' as 'male' | 'female' | 'other' | '',
    address: '',
    tripDuration: '',
    itinerary: '',
    startDate: '',
    tripType: '' as 'solo' | 'group' | '',
    groupMembers: '',
    emergencyName: '',
    emergencyPhone: '',
  });

  const [isOtpSent, setIsOtpSent] = useState(false);
  const [isVerified, setIsVerified] = useState(false);
  const [isVerifying, setIsVerifying] = useState(false);
  const [verificationResult, setVerificationResult] = useState<any>(null);

  const handleInputChange = (field: string, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  const handleSendOtp = () => {
    if (formData.idNumber) {
      setIsOtpSent(true);
      // In a real app, this would send OTP to the phone/email linked to the ID
      toast.success('OTP sent to your registered phone/email');
    }
  };

  const handleVerifyAadhaar = async () => {
    if (!formData.idNumber || formData.idType !== 'aadhaar') {
      toast.error('Please enter a valid Aadhaar number');
      return;
    }

    if (formData.idNumber.length !== 12) {
      toast.error('Aadhaar number must be 12 digits');
      return;
    }

    setIsVerifying(true);
    try {
      // Simulate verification process
      await new Promise(resolve => setTimeout(resolve, 2000));
      
      // Mock successful verification
      setVerificationResult({
        verification: {
          isValid: true,
          details: {
            name: `${formData.firstName} ${formData.lastName}`,
            dateOfBirth: formData.dateOfBirth,
            gender: formData.gender,
            address: formData.address
          }
        }
      });
      
      setIsVerified(true);
      toast.success('Aadhaar verification successful!');
    } catch (error) {
      console.error('Aadhaar verification error:', error);
      toast.error('Verification service is temporarily unavailable');
    } finally {
      setIsVerifying(false);
    }
  };

  const handleVerifyOtp = () => {
    if (formData.otp) {
      setIsVerified(true);
      toast.success('Verification successful!');
    }
  };

  const handleNext = () => {
    switch (currentStep) {
      case 'personal':
        setCurrentStep('verification');
        break;
      case 'verification':
        if (isVerified) {
          setCurrentStep('trip');
        }
        break;
      case 'trip':
        setCurrentStep('digital-id');
        break;
    }
  };

  const handleBack = () => {
    switch (currentStep) {
      case 'verification':
        setCurrentStep('personal');
        break;
      case 'trip':
        setCurrentStep('verification');
        break;
      case 'digital-id':
        setCurrentStep('trip');
        break;
    }
  };

  const handleComplete = () => {
    const user: User & { email: string } = {
      id: `USER_${Date.now()}`,
      name: `${formData.firstName} ${formData.lastName}`,
      role: 'traveller',
      digitalId: `DID_${Date.now()}`,
      firstName: formData.firstName,
      lastName: formData.lastName,
      email: formData.email,
      nationality: formData.nationality,
      age: formData.age,
      phone: formData.phone,
      tripDuration: formData.tripDuration,
      itinerary: formData.itinerary,
      startDate: formData.startDate,
      emergencyName: formData.emergencyName,
      emergencyPhone: formData.emergencyPhone,
    };
    onComplete(user);
  };

  const filteredNationalities = nationalities.filter(nationality =>
    nationality.toLowerCase().includes(nationalitySearch.toLowerCase())
  );

  const renderPersonalInfo = () => (
    <div className="space-y-4">
      <div className="grid grid-cols-2 gap-4">
        <div>
          <Label htmlFor="firstName">{getTranslation('firstName', language)}</Label>
          <Input
            id="firstName"
            value={formData.firstName}
            onChange={(e) => handleInputChange('firstName', e.target.value)}
            placeholder={`${getTranslation('enterYour', language)} ${getTranslation('firstName', language).toLowerCase()}`}
          />
        </div>
        <div>
          <Label htmlFor="lastName">{getTranslation('lastName', language)}</Label>
          <Input
            id="lastName"
            value={formData.lastName}
            onChange={(e) => handleInputChange('lastName', e.target.value)}
            placeholder={`${getTranslation('enterYour', language)} ${getTranslation('lastName', language).toLowerCase()}`}
          />
        </div>
      </div>
      
      <div>
        <Label htmlFor="email">Email Address</Label>
        <Input
          id="email"
          type="email"
          value={formData.email}
          onChange={(e) => handleInputChange('email', e.target.value)}
          placeholder="Enter your email address"
        />
        {suggestedEmail && (
          <p className="text-xs text-green-600 mt-1">
            ✓ Using the email you attempted to login with
          </p>
        )}
      </div>
      
      <div>
        <Label>{getTranslation('nationality', language)}</Label>
        <div className="space-y-3">
          <div className="relative">
            <Search className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
            <Input
              placeholder={getTranslation('searchNationality', language)}
              value={nationalitySearch}
              onChange={(e) => setNationalitySearch(e.target.value)}
              className="pl-10"
            />
          </div>
          <ScrollArea className="h-40 w-full rounded-md border p-2">
            <RadioGroup 
              value={formData.nationality} 
              onValueChange={(value) => handleInputChange('nationality', value)}
              className="space-y-2"
            >
              {filteredNationalities.map((nationality) => (
                <div key={nationality} className="flex items-center space-x-2">
                  <RadioGroupItem value={nationality} id={nationality} />
                  <Label htmlFor={nationality} className="text-sm cursor-pointer">
                    {nationality}
                  </Label>
                </div>
              ))}
            </RadioGroup>
          </ScrollArea>
          {formData.nationality && (
            <div className="text-sm text-green-600">
              {getTranslation('selected', language)}: {formData.nationality}
            </div>
          )}
        </div>
      </div>
      
      <div className="grid grid-cols-2 gap-4">
        <div>
          <Label htmlFor="age">{getTranslation('age', language)}</Label>
          <Input
            id="age"
            type="number"
            value={formData.age}
            onChange={(e) => handleInputChange('age', e.target.value)}
            placeholder={`${getTranslation('enterYour', language)} ${getTranslation('age', language).toLowerCase()}`}
          />
        </div>
        <div>
          <Label htmlFor="phone">{getTranslation('phoneNumber', language)}</Label>
          <Input
            id="phone"
            value={formData.phone}
            onChange={(e) => handleInputChange('phone', e.target.value)}
            placeholder={`${getTranslation('enterYour', language)} ${getTranslation('phoneNumber', language).toLowerCase()}`}
          />
        </div>
      </div>
    </div>
  );

  const renderVerification = () => (
    <div className="space-y-4">
      <div className="bg-blue-50 p-3 rounded-lg border border-blue-200">
        <div className="flex items-center space-x-2">
          <Shield className="w-4 h-4 text-blue-600" />
          <span className="text-sm text-blue-700">
            Identity verification ensures your safety and security
          </span>
        </div>
      </div>

      <div>
        <Label>Choose ID Type</Label>
        <Select value={formData.idType} onValueChange={(value) => handleInputChange('idType', value)}>
          <SelectTrigger>
            <SelectValue placeholder="Select ID type" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="aadhaar">
              <div className="flex items-center space-x-2">
                <span>🇮🇳 Aadhaar Number (Recommended)</span>
              </div>
            </SelectItem>
            <SelectItem value="passport">
              <div className="flex items-center space-x-2">
                <span>🛂 Passport Number</span>
              </div>
            </SelectItem>
          </SelectContent>
        </Select>
      </div>
      
      {formData.idType === 'aadhaar' && (
        <div className="space-y-4">
          <div>
            <Label htmlFor="idNumber">Aadhaar Number</Label>
            <Input
              id="idNumber"
              value={formData.idNumber}
              onChange={(e) => handleInputChange('idNumber', e.target.value)}
              placeholder="Enter 12-digit Aadhaar number"
              maxLength={12}
              pattern="[0-9]*"
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <Label htmlFor="dateOfBirth">Date of Birth</Label>
              <Input
                id="dateOfBirth"
                type="date"
                value={formData.dateOfBirth}
                onChange={(e) => handleInputChange('dateOfBirth', e.target.value)}
              />
            </div>
            <div>
              <Label htmlFor="gender">Gender</Label>
              <Select value={formData.gender} onValueChange={(value) => handleInputChange('gender', value)}>
                <SelectTrigger>
                  <SelectValue placeholder="Select gender" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="male">Male</SelectItem>
                  <SelectItem value="female">Female</SelectItem>
                  <SelectItem value="other">Other</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>

          <div>
            <Label htmlFor="address">Address (as per Aadhaar)</Label>
            <Textarea
              id="address"
              value={formData.address}
              onChange={(e) => handleInputChange('address', e.target.value)}
              placeholder="Enter address as mentioned in Aadhaar card"
              rows={2}
            />
          </div>

          {formData.idNumber && formData.dateOfBirth && formData.gender && !isVerified && (
            <Button 
              onClick={handleVerifyAadhaar} 
              className="w-full"
              disabled={isVerifying}
            >
              {isVerifying ? (
                <>
                  <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                  Verifying Aadhaar...
                </>
              ) : (
                <>
                  <Shield className="w-4 h-4 mr-2" />
                  Verify Aadhaar
                </>
              )}
            </Button>
          )}
        </div>
      )}

      {formData.idType === 'passport' && (
        <>
          <div>
            <Label htmlFor="idNumber">Passport Number</Label>
            <Input
              id="idNumber"
              value={formData.idNumber}
              onChange={(e) => handleInputChange('idNumber', e.target.value)}
              placeholder="Enter passport number"
            />
          </div>
          
          {formData.idNumber && !isOtpSent && (
            <Button onClick={handleSendOtp} className="w-full">
              Send OTP
            </Button>
          )}
          
          {isOtpSent && !isVerified && (
            <div className="space-y-4">
              <div>
                <Label htmlFor="otp">Enter OTP</Label>
                <Input
                  id="otp"
                  value={formData.otp}
                  onChange={(e) => handleInputChange('otp', e.target.value)}
                  placeholder="Enter 6-digit OTP"
                  maxLength={6}
                />
              </div>
              <Button onClick={handleVerifyOtp} className="w-full">
                Verify OTP
              </Button>
            </div>
          )}
        </>
      )}
      
      {isVerified && (
        <div className="text-center space-y-3">
          <div className="flex items-center justify-center space-x-2 text-green-600">
            <CheckCircle className="w-5 h-5" />
            <span className="font-medium">Verification Successful</span>
          </div>
          {verificationResult?.verification?.details && (
            <div className="bg-green-50 p-3 rounded-lg border border-green-200 text-sm">
              <p><strong>Verification ID:</strong> {verificationResult.verification.details.verificationId}</p>
              <p className="text-green-600 mt-1">✓ Identity confirmed with government database</p>
            </div>
          )}
        </div>
      )}

      {verificationResult && !verificationResult.verification.isValid && (
        <div className="text-center">
          <div className="flex items-center justify-center space-x-2 text-red-600">
            <AlertCircle className="w-5 h-5" />
            <span className="font-medium">Verification Failed</span>
          </div>
          <p className="text-sm text-red-600 mt-2">
            {verificationResult.verification.error || 'Please check your details and try again'}
          </p>
        </div>
      )}
    </div>
  );

  const renderTripDetails = () => (
    <div className="space-y-4">
      <div>
        <Label>Trip Type</Label>
        <RadioGroup 
          value={formData.tripType} 
          onValueChange={(value) => handleInputChange('tripType', value)}
          className="flex space-x-6 mt-2"
        >
          <div className="flex items-center space-x-2">
            <RadioGroupItem value="solo" id="solo" />
            <Label htmlFor="solo">Solo Trip</Label>
          </div>
          <div className="flex items-center space-x-2">
            <RadioGroupItem value="group" id="group" />
            <Label htmlFor="group">Group Trip</Label>
          </div>
        </RadioGroup>
      </div>
      
      <div>
        <Label htmlFor="tripDuration">{getTranslation('tripDuration', language)}</Label>
        <Input
          id="tripDuration"
          value={formData.tripDuration}
          onChange={(e) => handleInputChange('tripDuration', e.target.value)}
          placeholder="e.g., 7 days"
        />
      </div>
      
      <div>
        <Label htmlFor="itinerary">{getTranslation('itinerary', language)}</Label>
        <Textarea
          id="itinerary"
          value={formData.itinerary}
          onChange={(e) => handleInputChange('itinerary', e.target.value)}
          placeholder="Describe your planned itinerary"
          rows={3}
        />
      </div>
      
      <div>
        <Label htmlFor="startDate">{getTranslation('startDate', language)}</Label>
        <Input
          id="startDate"
          type="date"
          value={formData.startDate}
          onChange={(e) => handleInputChange('startDate', e.target.value)}
        />
      </div>
      
      {formData.tripType === 'group' && (
        <div>
          <Label htmlFor="groupMembers">Group Members</Label>
          <Textarea
            id="groupMembers"
            value={formData.groupMembers}
            onChange={(e) => handleInputChange('groupMembers', e.target.value)}
            placeholder="Enter Digital IDs of group members (required for group trips)"
            rows={2}
          />
          <p className="text-xs text-gray-500 mt-1">
            For group trips, each member must have their own ChaloSafe Digital ID
          </p>
        </div>
      )}
      
      <div className="bg-yellow-50 p-4 rounded-lg">
        <h4 className="font-medium mb-3">{getTranslation('emergencyContact', language)}</h4>
        <div className="space-y-3">
          <div>
            <Label htmlFor="emergencyName">{getTranslation('emergencyContactName', language)}</Label>
            <Input
              id="emergencyName"
              value={formData.emergencyName}
              onChange={(e) => handleInputChange('emergencyName', e.target.value)}
              placeholder="Enter emergency contact name"
            />
          </div>
          <div>
            <Label htmlFor="emergencyPhone">{getTranslation('emergencyContactPhone', language)}</Label>
            <Input
              id="emergencyPhone"
              value={formData.emergencyPhone}
              onChange={(e) => handleInputChange('emergencyPhone', e.target.value)}
              placeholder="Enter emergency contact phone"
            />
          </div>
        </div>
      </div>
    </div>
  );

  const renderDigitalId = () => (
    <div className="text-center space-y-6">
      <div className="bg-gradient-to-br from-blue-100 to-green-100 p-6 rounded-lg">
        <QrCode className="w-24 h-24 mx-auto mb-4 text-blue-600" />
        <h3>{getTranslation('digitalIdCreated', language)}</h3>
        <p className="text-gray-600 mt-2">{getTranslation('blockchainSecured', language)} {getTranslation('digitalId', language)} is ready</p>
      </div>
      
      <div className="bg-white border-2 border-dashed border-gray-300 p-4 rounded-lg">
        <div className="space-y-2">
          <p><strong>Name:</strong> {formData.firstName} {formData.lastName}</p>
          <p><strong>Trip Period:</strong> {formData.startDate} - {formData.tripDuration}</p>
          <p><strong>Digital ID:</strong> DID_{Date.now()}</p>
          <p><strong>{getTranslation('validUntil', language)}:</strong> {new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toLocaleDateString()}</p>
        </div>
      </div>
      
      <div className="flex space-x-3">
        <Button variant="outline" className="flex-1">
          <Download className="w-4 h-4 mr-2" />
          {getTranslation('download', language)} ID
        </Button>
        <Button variant="outline" className="flex-1">
          <Share2 className="w-4 h-4 mr-2" />
          {getTranslation('share', language)} ID
        </Button>
      </div>
    </div>
  );

  const getStepTitle = () => {
    switch (currentStep) {
      case 'personal': return getTranslation('personalInformation', language);
      case 'verification': return 'ID Verification';
      case 'trip': return getTranslation('tripInformation', language);
      case 'digital-id': return 'Digital ID Created';
    }
  };

  const canProceed = () => {
    switch (currentStep) {
      case 'personal':
        return formData.firstName && formData.lastName && formData.email && formData.nationality && formData.age && formData.phone;
      case 'verification':
        return isVerified;
      case 'trip':
        return formData.tripDuration && formData.startDate && formData.emergencyName && formData.emergencyPhone;
      case 'digital-id':
        return true;
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-green-50 flex items-center justify-center p-4">
      <Card className="w-full max-w-md mx-auto">
        <CardHeader className="text-center">
          <div className="flex justify-center mb-4">
            <div className="flex space-x-2">
              {['personal', 'verification', 'trip', 'digital-id'].map((step, index) => (
                <div
                  key={step}
                  className={`w-3 h-3 rounded-full ${
                    step === currentStep ? 'bg-blue-500' : 
                    ['personal', 'verification', 'trip', 'digital-id'].indexOf(currentStep) > index ? 'bg-green-500' : 'bg-gray-300'
                  }`}
                />
              ))}
            </div>
          </div>
          <CardTitle>{getStepTitle()}</CardTitle>
          <p className="text-gray-600">Step {['personal', 'verification', 'trip', 'digital-id'].indexOf(currentStep) + 1} of 4</p>
        </CardHeader>
        
        <CardContent>
          {suggestedEmail && (
            <RegistrationHelper 
              suggestedEmail={suggestedEmail} 
              currentStep={currentStep} 
            />
          )}
          {currentStep === 'personal' && renderPersonalInfo()}
          {currentStep === 'verification' && renderVerification()}
          {currentStep === 'trip' && renderTripDetails()}
          {currentStep === 'digital-id' && renderDigitalId()}
          
          <div className="flex space-x-3 mt-6">
            {currentStep !== 'personal' && (
              <Button variant="outline" onClick={handleBack} className="flex-1">
                <ArrowLeft className="w-4 h-4 mr-2" />
                {getTranslation('back', language)}
              </Button>
            )}
            
            {currentStep !== 'digital-id' ? (
              <Button 
                onClick={handleNext} 
                disabled={!canProceed()}
                className="flex-1"
              >
                {getTranslation('next', language)}
                <ArrowRight className="w-4 h-4 ml-2" />
              </Button>
            ) : (
              <Button 
                onClick={handleComplete}
                className="flex-1 bg-green-600 hover:bg-green-700"
              >
                {getTranslation('completeRegistration', language)}
              </Button>
            )}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
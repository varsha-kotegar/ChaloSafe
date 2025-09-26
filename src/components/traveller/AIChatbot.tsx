import React, { useState, useRef, useEffect } from 'react';
import { Button } from '../ui/button';
import { Input } from '../ui/input';
import { Card, CardContent, CardHeader, CardTitle } from '../ui/card';
import { Avatar } from '../ui/avatar';
import { Badge } from '../ui/badge';
import { 
  Bot, 
  User, 
  Send, 
  X, 
  MessageCircle,
  Mic,
  Copy,
  ThumbsUp,
  ThumbsDown,
  AlertTriangle,
  MapPin,
  Cloud,
  Shield,
  Navigation,
  Heart
} from 'lucide-react';
import { Language } from '../../App';
import { getTranslation } from '../../utils/translations';
import { toast } from 'sonner@2.0.3';

interface Message {
  id: string;
  text: string;
  isUser: boolean;
  timestamp: Date;
  type?: 'text' | 'safety' | 'emergency' | 'weather' | 'navigation';
}

interface AIChatbotProps {
  language: Language;
  isOpen: boolean;
  onClose: () => void;
  userLocation?: { latitude: number; longitude: number };
}

export function AIChatbot({ language, isOpen, onClose, userLocation }: AIChatbotProps) {
  const getWelcomeMessage = () => {
    try {
      return getTranslation('chatbotWelcome', language) || "Hello! I'm your AI safety assistant. How can I help you stay safe today?";
    } catch (error) {
      console.warn('Error getting welcome message translation:', error);
      return "Hello! I'm your AI safety assistant. How can I help you stay safe today?";
    }
  };

  const [messages, setMessages] = useState<Message[]>([
    {
      id: '1',
      text: getWelcomeMessage(),
      isUser: false,
      timestamp: new Date(),
      type: 'text'
    }
  ]);
  const [inputText, setInputText] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const [isListening, setIsListening] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const getQuickActionText = (key: string, fallback: string) => {
    try {
      return getTranslation(key as any, language) || fallback;
    } catch (error) {
      console.warn(`Error getting translation for key "${key}":`, error);
      return fallback;
    }
  };

  const quickActions = [
    { 
      text: getQuickActionText('emergencyHelp', 'Emergency Help'), 
      icon: AlertTriangle, 
      color: 'bg-red-100 text-red-600',
      type: 'emergency' as const
    },
    { 
      text: getQuickActionText('safetyTips', 'Safety Tips'), 
      icon: Shield, 
      color: 'bg-blue-100 text-blue-600',
      type: 'safety' as const
    },
    { 
      text: getQuickActionText('weatherUpdate', 'Weather Update'), 
      icon: Cloud, 
      color: 'bg-gray-100 text-gray-600',
      type: 'weather' as const
    },
    { 
      text: getQuickActionText('navigate', 'Navigate') + ' Help', 
      icon: Navigation, 
      color: 'bg-green-100 text-green-600',
      type: 'navigation' as const
    }
  ];

  const generateAIResponse = (userMessage: string, type?: string): string => {
    const lowerMessage = userMessage.toLowerCase();
    
    // Emergency responses
    if (type === 'emergency' || lowerMessage.includes('emergency') || lowerMessage.includes('help') || lowerMessage.includes('danger')) {
      const emergencyResponses = [
        'I understand this is urgent. For immediate assistance: 🚨\n\n1. Call 100 for Police\n2. Call 108 for Medical Emergency\n3. Use the SOS button in the app\n4. Share your location with emergency contacts\n\nStay calm and stay safe. Help is on the way.',
        '🚨 Emergency Protocol Activated:\n\n• Your location has been logged\n• Emergency contacts will be notified\n• Nearest police station: 2.3 km away\n• Medical facility: 1.8 km away\n\nWhat specific help do you need right now?'
      ];
      return emergencyResponses[Math.floor(Math.random() * emergencyResponses.length)];
    }

    // Safety tips
    if (type === 'safety' || lowerMessage.includes('safety') || lowerMessage.includes('safe') || lowerMessage.includes('tips')) {
      const safetyResponses = [
        '🛡️ Here are some essential safety tips:\n\n• Always share your live location with trusted contacts\n• Avoid isolated areas, especially at night\n• Keep emergency numbers saved\n• Trust your instincts - if something feels wrong, leave\n• Keep your phone charged and carry a power bank\n• Stay aware of your surroundings',
        '🏃‍♀️ Personal Safety Checklist:\n\n✅ Location sharing ON\n✅ Emergency contacts updated\n✅ Local emergency numbers saved\n✅ Avoid displaying expensive items\n✅ Use well-lit, populated routes\n✅ Inform someone about your plans\n\nYour current area has a safety rating of 4.2/5. Stay vigilant!'
      ];
      return safetyResponses[Math.floor(Math.random() * safetyResponses.length)];
    }

    // Weather responses
    if (type === 'weather' || lowerMessage.includes('weather') || lowerMessage.includes('rain') || lowerMessage.includes('storm')) {
      const weatherResponses = [
        '🌤️ Current Weather Update:\n\n• Temperature: 28°C\n• Humidity: 72%\n• Chance of rain: 40%\n• Air Quality: Moderate\n\n🌧️ Rain expected around 3 PM today. Carry an umbrella and avoid low-lying areas prone to flooding.',
        '⛈️ Weather Alert:\n\n• Thunderstorm warning for next 2 hours\n• Wind speed: 45 km/h\n• Visibility: Good\n\nRecommendation: Stay indoors if possible. If traveling, avoid areas near large trees and open spaces.'
      ];
      return weatherResponses[Math.floor(Math.random() * weatherResponses.length)];
    }

    // Navigation responses
    if (type === 'navigation' || lowerMessage.includes('direction') || lowerMessage.includes('route') || lowerMessage.includes('way')) {
      const navigationResponses = [
        '🗺️ Navigation Assistance:\n\n• Safest route to destination calculated\n• Avoiding construction zones\n• Well-lit path recommended\n• Estimated time: 15 minutes\n\n📍 Alternative routes available if needed. Would you like me to guide you step by step?',
        '🚶‍♀️ Smart Route Suggestions:\n\n🟢 Route A: Main road (safest, 20 min)\n🟡 Route B: Park path (scenic, 25 min)\n🔴 Route C: Shortcut (avoid at night)\n\nBased on current time and safety data, I recommend Route A. Shall I start navigation?'
      ];
      return navigationResponses[Math.floor(Math.random() * navigationResponses.length)];
    }

    // Travel and general responses
    if (lowerMessage.includes('travel') || lowerMessage.includes('tourist') || lowerMessage.includes('visit')) {
      const travelResponses = [
        '🧳 Travel Smart with ChaloSafe:\n\n• Your digital ID is verified ✅\n• Local emergency contacts updated\n• Safe zones mapped in your area\n• Cultural guidelines for this region available\n\nWhat would you like to explore today? I can suggest safe and exciting places nearby!',
        '🏛️ Local Recommendations:\n\n🏆 Top rated nearby: Golden Temple (4.9★)\n🏔️ Adventure: Mountain trekking (4.8★)\n🏖️ Relaxing: Marina Beach (4.3★)\n\nAll locations are verified safe with proper security measures. Need detailed info about any place?'
      ];
      return travelResponses[Math.floor(Math.random() * travelResponses.length)];
    }

    // Health related
    if (lowerMessage.includes('health') || lowerMessage.includes('medical') || lowerMessage.includes('hospital')) {
      return '🏥 Health & Medical Info:\n\n• Nearest hospital: City General Hospital (1.8 km)\n• 24/7 pharmacy: MedPlus (0.5 km)\n• Emergency medical: Dial 108\n\n💊 For non-emergency health concerns, I can help find nearby clinics or provide first-aid guidance. What do you need help with?';
    }

    // Food related
    if (lowerMessage.includes('food') || lowerMessage.includes('restaurant') || lowerMessage.includes('eat')) {
      return '🍽️ Safe Dining Options:\n\n🥘 Highly rated restaurants nearby:\n• Spice Route (4.6★) - 300m\n• Café Delight (4.4★) - 500m\n• Local Dhaba (4.5★) - 800m\n\n✅ All locations verified for hygiene standards. Vegetarian and vegan options available. Need specific cuisine recommendations?';
    }

    // Default helpful responses
    const defaultResponses = [
      '🤖 I\'m here to help keep you safe! I can assist with:\n\n🚨 Emergency situations\n🛡️ Safety advice\n🌤️ Weather updates\n🗺️ Navigation help\n🏥 Health information\n🍽️ Restaurant recommendations\n\nWhat would you like to know?',
      '💡 I understand you need assistance. As your AI safety companion, I can help with safety tips, emergency protocols, weather alerts, navigation, and local recommendations. How can I make your journey safer today?',
      '🌟 ChaloSafe AI at your service! I\'m trained to prioritize your safety and comfort. Whether you need emergency help, travel advice, or local information, I\'m here 24/7. What\'s on your mind?'
    ];
    
    return defaultResponses[Math.floor(Math.random() * defaultResponses.length)];
  };

  const handleSend = async (messageText?: string, messageType?: string) => {
    const text = messageText || inputText.trim();
    if (!text) return;

    // Add user message
    const userMessage: Message = {
      id: Date.now().toString(),
      text,
      isUser: true,
      timestamp: new Date(),
      type: 'text'
    };

    setMessages(prev => [...prev, userMessage]);
    setInputText('');
    setIsTyping(true);

    // Simulate AI thinking time
    setTimeout(() => {
      const aiResponse: Message = {
        id: (Date.now() + 1).toString(),
        text: generateAIResponse(text, messageType),
        isUser: false,
        timestamp: new Date(),
        type: messageType as any || 'text'
      };

      setMessages(prev => [...prev, aiResponse]);
      setIsTyping(false);
    }, 1500);
  };

  const handleQuickAction = (action: typeof quickActions[0]) => {
    handleSend(action.text, action.type);
  };

  const handleCopyMessage = (text: string) => {
    navigator.clipboard.writeText(text);
    toast.success('Message copied to clipboard!');
  };

  const handleVoiceInput = () => {
    setIsListening(!isListening);
    toast.info('Voice input feature coming soon!');
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black/30 z-50 flex justify-end">
      <div className="w-full max-w-md h-full bg-white shadow-xl flex flex-col animate-slide-in-right">
        {/* Header */}
        <CardHeader className="border-b bg-gradient-to-r from-blue-600 to-purple-600 text-white">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <Avatar className="w-10 h-10 bg-white/20">
                <Bot className="w-6 h-6 text-white" />
              </Avatar>
              <div>
                <CardTitle className="text-lg">ChaloSafe AI</CardTitle>
                <p className="text-sm text-blue-100">Your Safety Assistant</p>
              </div>
            </div>
            <Button
              variant="ghost"
              size="sm"
              onClick={onClose}
              className="text-white hover:bg-white/20"
            >
              <X className="w-5 h-5" />
            </Button>
          </div>
        </CardHeader>

        {/* Quick Actions */}
        <div className="p-4 border-b bg-gray-50">
          <p className="text-sm font-medium text-gray-700 mb-2">Quick Actions:</p>
          <div className="grid grid-cols-2 gap-2">
            {quickActions.map((action, index) => {
              const IconComponent = action.icon;
              return (
                <Button
                  key={index}
                  variant="outline"
                  size="sm"
                  onClick={() => handleQuickAction(action)}
                  className={`flex items-center space-x-2 p-2 h-auto ${action.color} border-none`}
                >
                  <IconComponent className="w-4 h-4" />
                  <span className="text-xs">{action.text}</span>
                </Button>
              );
            })}
          </div>
        </div>

        {/* Messages */}
        <div className="flex-1 overflow-y-auto p-4 space-y-4">
          {messages.map((message) => (
            <div
              key={message.id}
              className={`flex ${message.isUser ? 'justify-end' : 'justify-start'}`}
            >
              <div
                className={`max-w-[80%] p-3 rounded-lg ${
                  message.isUser
                    ? 'bg-blue-600 text-white'
                    : 'bg-gray-100 text-gray-800'
                }`}
              >
                <div className="flex items-start space-x-2">
                  {!message.isUser && (
                    <Bot className="w-4 h-4 mt-1 text-blue-600" />
                  )}
                  <div className="flex-1">
                    <p className="text-sm whitespace-pre-wrap">{message.text}</p>
                    <div className="flex items-center justify-between mt-2">
                      <span className={`text-xs ${message.isUser ? 'text-blue-200' : 'text-gray-500'}`}>
                        {message.timestamp.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                      </span>
                      {!message.isUser && (
                        <div className="flex items-center space-x-1">
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => handleCopyMessage(message.text)}
                            className="p-1 h-auto"
                          >
                            <Copy className="w-3 h-3" />
                          </Button>
                          <Button
                            variant="ghost"
                            size="sm"
                            className="p-1 h-auto"
                          >
                            <ThumbsUp className="w-3 h-3" />
                          </Button>
                        </div>
                      )}
                    </div>
                  </div>
                  {message.isUser && (
                    <User className="w-4 h-4 mt-1 text-blue-200" />
                  )}
                </div>
              </div>
            </div>
          ))}
          
          {isTyping && (
            <div className="flex justify-start">
              <div className="bg-gray-100 text-gray-800 max-w-[80%] p-3 rounded-lg">
                <div className="flex items-center space-x-2">
                  <Bot className="w-4 h-4 text-blue-600" />
                  <div className="flex space-x-1">
                    <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce"></div>
                    <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '0.1s' }}></div>
                    <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '0.2s' }}></div>
                  </div>
                </div>
              </div>
            </div>
          )}
          
          <div ref={messagesEndRef} />
        </div>

        {/* Input */}
        <div className="border-t p-4 bg-white">
          <div className="flex items-center space-x-2">
            <Button
              variant="outline"
              size="sm"
              onClick={handleVoiceInput}
              className={`p-2 ${isListening ? 'bg-red-100 text-red-600' : ''}`}
            >
              <Mic className="w-4 h-4" />
            </Button>
            <Input
              value={inputText}
              onChange={(e) => setInputText(e.target.value)}
              onKeyPress={(e) => e.key === 'Enter' && handleSend()}
              placeholder={getQuickActionText('typeMessage', 'Type your message...')}
              className="flex-1"
              disabled={isTyping}
            />
            <Button
              onClick={() => handleSend()}
              disabled={!inputText.trim() || isTyping}
              className="p-2"
            >
              <Send className="w-4 h-4" />
            </Button>
          </div>
          <p className="text-xs text-gray-500 mt-2 text-center">
            AI responses are for guidance only. For real emergencies, call 100/108.
          </p>
        </div>
      </div>
    </div>
  );
}
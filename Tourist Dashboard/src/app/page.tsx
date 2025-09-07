'use client';

import React, { useState, useEffect, useMemo, useCallback, useRef } from 'react';
import dynamic from 'next/dynamic';
import { format } from 'date-fns';
import { getRiskAlert } from '@/app/actions';

import type { LatLngTuple, RiskZone, AlertLog } from '@/lib/types';
import { touristRoute, riskZones } from '@/data/geo-data';
import { isPointInPolygon, isPointInCircle, findNearestPointOnRoute } from '@/lib/geo';
import { useOnlineStatus } from '@/hooks/use-online-status';
import { useToast } from '@/hooks/use-toast';

import Sidebar from '@/components/sidebar/sidebar';
import ProfilePanel from '@/components/sidebar/profile-panel';
import TripStatusPanel from '@/components/sidebar/trip-status-panel';
import SafetyPanel from '@/components/sidebar/safety-panel';
import EmergencyPanel from '@/components/sidebar/emergency-panel';
import AlertsLogPanel from '@/components/sidebar/alerts-log-panel';
import ControlsPanel from '@/components/sidebar/controls-panel';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogCancel,
} from '@/components/ui/alert-dialog';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter } from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Icons } from '@/components/icons';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { cn } from '@/lib/utils';
import { Sheet, SheetContent, SheetTrigger } from '@/components/ui/sheet';
import { Label } from '@/components/ui/label';


const DEVIATION_THRESHOLD = 2000; // 2km in meters

interface ChatMessage {
  sender: 'user' | 'bot';
  text: string;
  options?: string[];
}


export default function Home() {
  const [touristPosition, setTouristPosition] = useState<LatLngTuple>(touristRoute[0]);
  const [currentZone, setCurrentZone] = useState<RiskZone | null>(null);
  const [safetyScore, setSafetyScore] = useState(10);
  const [isRouteDeviated, setIsRouteDeviated] = useState(false);
  const [alertLogs, setAlertLogs] = useState<AlertLog[]>([]);
  const [genAIAlert, setGenAIAlert] = useState<{ title: string; message: string; actions: string[] } | null>(null);
  
  const [isCheckinModalOpen, setCheckinModalOpen] = useState(false);
  const [checkinInputValue, setCheckinInputValue] = useState('');
  
  const [securityPin, setSecurityPin] = useState<string | null>(null);
  const [isPinSetupModalOpen, setPinSetupModalOpen] = useState(true);
  const [newPinValue, setNewPinValue] = useState('');
  const [confirmPinValue, setConfirmPinValue] = useState('');

  const checkinInterval = 2 * 60 * 1000; // 2 minutes
  
  const [isSOSModalOpen, setSOSModalOpen] = useState(false);
  const [isChatbotOpen, setChatbotOpen] = useState(false);
  const [chatMessages, setChatMessages] = useState<ChatMessage[]>([
    { sender: 'bot', text: 'Hello! I am your AI safety assistant. How can I help you today?' },
  ]);
  const [chatInput, setChatInput] = useState('');
  const [distressDetected, setDistressDetected] = useState(false);
  
  const isOnline = useOnlineStatus();
  const { toast } = useToast();
  const processingZoneRef = useRef<string | null>(null);
  const chatEndRef = useRef<HTMLDivElement>(null);


  const Map = useMemo(() => dynamic(() => import('@/components/map-component'), {
    loading: () => <div className="w-full h-full bg-muted/30 animate-pulse flex items-center justify-center"><p className="text-muted-foreground">Loading Map...</p></div>,
    ssr: false,
  }), []);

  const checkSafetyStatus = useCallback((position: LatLngTuple) => {
    let inZone: RiskZone | null = null;
    for (const zone of riskZones) {
      const isInside = zone.shape === 'polygon'
        ? isPointInPolygon(position, zone.coords as LatLngTuple[])
        : isPointInCircle(position, zone.coords as LatLngTuple, zone.radius!);
      if (isInside) {
        inZone = zone;
        break;
      }
    }

    if (inZone?.id !== currentZone?.id) {
      setCurrentZone(inZone);
      
      let newScore = 8;
      if (inZone) {
        switch (inZone.riskLevel) {
          case 'safe': newScore = 10; break;
          case 'low': newScore = 7; break;
          case 'moderate': newScore = 5; break;
          case 'high': newScore = 2; break;
        }
      } else {
        newScore = 10;
      }
      setSafetyScore(newScore);

      if (inZone && inZone.riskLevel !== 'safe' && processingZoneRef.current !== inZone.id) {
        processingZoneRef.current = inZone.id;
        const newLog: AlertLog = {
          id: `log-${Date.now()}`,
          message: `Entered ${inZone.name} (${inZone.riskLevel} risk).`,
          timestamp: format(new Date(), 'HH:mm:ss'),
        };
        setAlertLogs(prev => [newLog, ...prev]);

        toast({
          title: "Entering Risk Zone",
          description: newLog.message,
          variant: inZone.riskLevel === 'high' ? 'destructive' : 'default',
        });
        
        getRiskAlert({
          zoneType: inZone.type,
          location: `${position[0].toFixed(4)}, ${position[1].toFixed(4)}`,
          riskLevel: inZone.riskLevel,
          region: inZone.name,
        }).then(res => {
          if (res.success && res.data) {
            setGenAIAlert({
              title: `Alert: ${inZone.name}`,
              message: res.data.alertMessage,
              actions: res.data.recommendedActions,
            });
          }
          processingZoneRef.current = null;
        });
      }
    }

    const { distance } = findNearestPointOnRoute(position, touristRoute);
    const newIsRouteDeviated = distance > DEVIATION_THRESHOLD;
    if(newIsRouteDeviated !== isRouteDeviated){
        setIsRouteDeviated(newIsRouteDeviated);
        if (newIsRouteDeviated) {
          toast({
            title: "Route Deviation",
            description: "You have deviated from the planned route.",
            variant: "destructive"
          });
        }
    }

  }, [currentZone, isRouteDeviated, toast]);
  
  useEffect(() => {
    checkSafetyStatus(touristPosition);
  }, [touristPosition, checkSafetyStatus]);

  useEffect(() => {
    let timer: NodeJS.Timeout | null = null;
    if (typeof window !== 'undefined' && securityPin) {
      timer = setInterval(() => {
        setCheckinModalOpen(true);
      }, checkinInterval);
    }
    return () => {
      if(timer) clearInterval(timer);
    };
  }, [securityPin, checkinInterval]);

  useEffect(() => {
    chatEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [chatMessages]);

  const handleSOS = () => {
    setSOSModalOpen(false);
    toast({
      title: "SOS Signal Sent",
      description: "Emergency services have been notified of your location.",
      variant: "destructive"
    });
  };

  const handleSendMessage = (message: string) => {
    if (!message.trim()) return;

    const newMessages: ChatMessage[] = [...chatMessages, { sender: 'user', text: message }];
    setChatMessages(newMessages);
    setChatInput('');

    const lowerCaseMessage = message.toLowerCase();
    const distressKeywords = ['scared', 'help', 'lost', 'not safe', 'danger'];

    setTimeout(() => {
      if (distressDetected) {
        if (lowerCaseMessage.includes('yes')) {
          setChatMessages(prev => [...prev, { sender: 'bot', text: 'Notifying emergency services and your emergency contact immediately. Please stay where you are if it is safe to do so. Help is on the way.' }]);
          toast({
            title: "Emergency Protocol Activated",
            description: "Authorities and emergency contacts have been notified.",
            variant: "destructive",
          });
        } else {
          setChatMessages(prev => [...prev, { sender: 'bot', text: 'Glad to hear you are safe. Is there anything else I can help you with?' }]);
        }
        setDistressDetected(false);
      } else if (distressKeywords.some(keyword => lowerCaseMessage.includes(keyword))) {
        setChatMessages(prev => [...prev, { sender: 'bot', text: 'I have detected a note of distress in your message. Are you safe? Do you need help?', options: ['Yes, I need help', 'No, I am fine'] }]);
        setDistressDetected(true);
      } else {
         setChatMessages(prev => [...prev, { sender: 'bot', text: 'Thank you for your message. I am a mock assistant and cannot process general queries yet. Please use words like "help" or "lost" to test the emergency flow.' }]);
      }
    }, 500);
  };
  
  const handleCheckinConfirm = () => {
    if (checkinInputValue === securityPin) {
      setCheckinModalOpen(false);
      setCheckinInputValue('');
      toast({
        title: "Safety Confirmed",
        description: "Thank you for checking in.",
        className: 'bg-success text-success-foreground'
      });
    } else {
      toast({
        title: "Incorrect PIN",
        description: "The PIN you entered is incorrect. Please try again.",
        variant: "destructive"
      });
      setCheckinInputValue('');
    }
  };

  const handlePinSetup = () => {
    if (newPinValue.length !== 4) {
      toast({ title: 'Invalid PIN', description: 'PIN must be 4 digits.', variant: 'destructive' });
      return;
    }
    if (newPinValue !== confirmPinValue) {
      toast({ title: 'PINs do not match', description: 'Please re-enter your PIN.', variant: 'destructive' });
      setConfirmPinValue('');
      return;
    }
    setSecurityPin(newPinValue);
    setPinSetupModalOpen(false);
    toast({ title: 'Security PIN Set', description: 'Your PIN has been configured for this session.' });
  };


  const SidebarContent = () => (
    <>
      <ProfilePanel name="Jainam Oswal" id="T4812" emergencyContact="+91 98765 43210" />
      <ControlsPanel 
        isOnline={isOnline}
        checkinInterval={checkinInterval}
      />
      <TripStatusPanel route={touristRoute} currentPosition={touristPosition} />
      <SafetyPanel safetyScore={safetyScore} currentZone={currentZone} isRouteDeviated={isRouteDeviated} />
      <EmergencyPanel onSOS={() => setSOSModalOpen(true)} />
      <AlertsLogPanel alerts={alertLogs} />
    </>
  );


  return (
    <div className="flex h-screen w-full bg-background font-body antialiased">
      <main className="flex-1 h-screen relative">
        <Map
          touristPosition={touristPosition}
          setTouristPosition={setTouristPosition}
          touristRoute={touristRoute}
          riskZones={riskZones}
        />
        
        {/* --- Mobile Sidebar --- */}
        <div className="lg:hidden fixed top-4 right-4 z-[51]">
           <Sheet>
            <SheetTrigger asChild>
              <Button size="icon" className="rounded-full shadow-lg h-14 w-14 bg-slate-900 text-white hover:bg-slate-800">
                <Icons.PanelRightOpen className="h-6 w-6" />
                <span className="sr-only">Open Dashboard</span>
              </Button>
            </SheetTrigger>
            <SheetContent side="right" className="w-full max-w-sm p-0">
               <Sidebar>
                 <SidebarContent />
               </Sidebar>
            </SheetContent>
          </Sheet>
        </div>

        <Button size="icon" className="rounded-full h-16 w-16 fixed bottom-8 left-8 shadow-lg z-10 bg-slate-900 text-white hover:bg-slate-800/90" onClick={() => setChatbotOpen(true)}>
          <Icons.Bot className="h-8 w-8" />
          <span className="sr-only">Open Chat</span>
        </Button>
      </main>
      
      {/* --- Desktop Sidebar --- */}
      <div className="hidden lg:block">
        <Sidebar>
           <SidebarContent />
        </Sidebar>
      </div>


      {genAIAlert && (
        <AlertDialog open={!!genAIAlert} onOpenChange={() => setGenAIAlert(null)}>
          <AlertDialogContent>
            <AlertDialogHeader>
              <AlertDialogTitle className="flex items-center gap-2">
                <Icons.AlertTriangle className="text-amber-500" /> {genAIAlert.title}
              </AlertDialogTitle>
              <AlertDialogDescription>{genAIAlert.message}</AlertDialogDescription>
            </AlertDialogHeader>
            <div className="py-4">
              <h4 className="font-semibold mb-2 text-foreground">Recommended Actions:</h4>
              <ul className="list-disc pl-5 space-y-1 text-sm text-muted-foreground">
                {genAIAlert.actions.map((action, i) => <li key={i}>{action}</li>)}
              </ul>
            </div>
            <AlertDialogFooter>
              <AlertDialogAction onClick={() => setGenAIAlert(null)}>Acknowledge</AlertDialogAction>
            </AlertDialogFooter>
          </AlertDialogContent>
        </AlertDialog>
      )}

      {/* --- PIN Setup Modal --- */}
      <Dialog open={isPinSetupModalOpen}>
        <DialogContent className="sm:max-w-xs">
          <DialogHeader>
            <DialogTitle>Set Security PIN</DialogTitle>
            <DialogDescription>
              Create a 4-digit PIN for your session to use for periodic safety check-ins.
            </DialogDescription>
          </DialogHeader>
          <div className="grid gap-4 py-4">
            <div className="grid gap-2">
              <Label htmlFor="new-pin">Create PIN</Label>
              <Input
                id="new-pin"
                type="password"
                placeholder="****"
                maxLength={4}
                className="text-center text-2xl tracking-[1em]"
                value={newPinValue}
                onChange={(e) => /^\d{0,4}$/.test(e.target.value) && setNewPinValue(e.target.value)}
              />
            </div>
            <div className="grid gap-2">
              <Label htmlFor="confirm-pin">Confirm PIN</Label>
              <Input
                id="confirm-pin"
                type="password"
                placeholder="****"
                maxLength={4}
                className="text-center text-2xl tracking-[1em]"
                value={confirmPinValue}
                onChange={(e) => /^\d{0,4}$/.test(e.target.value) && setConfirmPinValue(e.target.value)}
                onKeyDown={(e) => e.key === 'Enter' && handlePinSetup()}
              />
            </div>
          </div>
          <DialogFooter>
            <Button onClick={handlePinSetup}>Set PIN</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>


      <Dialog open={isCheckinModalOpen} onOpenChange={(open) => { if (!open) setCheckinInputValue(''); setCheckinModalOpen(open);}}>
        <DialogContent className="sm:max-w-xs">
          <DialogHeader>
            <DialogTitle>Periodic Safety Check-in</DialogTitle>
            <DialogDescription>Please enter your 4-digit security passcode to confirm you are safe.</DialogDescription>
          </DialogHeader>
          <div className="flex flex-col gap-4 py-4">
            <Input 
              type="password"
              placeholder="****"
              maxLength={4} 
              className="text-center text-2xl tracking-[1em]"
              value={checkinInputValue}
              onChange={(e) => setCheckinInputValue(e.target.value)}
              onKeyDown={(e) => e.key === 'Enter' && handleCheckinConfirm()}
            />
          </div>
          <DialogFooter>
            <Button onClick={handleCheckinConfirm}>Confirm Safety</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
      
      <AlertDialog open={isSOSModalOpen} onOpenChange={setSOSModalOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle className="text-destructive">Confirm SOS?</AlertDialogTitle>
            <AlertDialogDescription>
              This will immediately notify emergency services with your current location. Only use in a genuine emergency.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction className="bg-destructive hover:bg-destructive/90" onClick={handleSOS}>
              SEND SOS
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>

      <Dialog open={isChatbotOpen} onOpenChange={setChatbotOpen}>
        <DialogContent className="sm:max-w-[425px] w-[calc(100%-2rem)] p-0">
          <DialogHeader className="p-6 pb-2">
            <DialogTitle>Safety Chatbot</DialogTitle>
            <DialogDescription>
              Your AI assistant for on-trip support. In case of emergency, use the SOS button.
            </DialogDescription>
          </DialogHeader>
          <div className="h-[400px] flex flex-col">
            <ScrollArea className="flex-1">
              <div className="space-y-4 p-4">
                {chatMessages.map((msg, index) => (
                  <div key={index} className={cn("flex items-end gap-2", msg.sender === 'user' ? 'justify-end' : 'justify-start')}>
                    {msg.sender === 'bot' && (
                      <Avatar className="h-8 w-8">
                        <AvatarFallback><Icons.Bot/></AvatarFallback>
                      </Avatar>
                    )}
                    <div className={cn("max-w-[75%] rounded-lg p-3 text-sm shadow-md", msg.sender === 'user' ? 'bg-slate-900 text-slate-50' : 'bg-slate-200 text-slate-900')}>
                      <p>{msg.text}</p>
                      {msg.options && (
                        <div className="flex flex-col sm:flex-row gap-2 mt-2">
                          {msg.options.map(option => (
                            <Button key={option} size="sm" variant="outline" className="bg-white/50" onClick={() => handleSendMessage(option)}>{option}</Button>
                          ))}
                        </div>
                      )}
                    </div>
                     {msg.sender === 'user' && (
                      <Avatar className="h-8 w-8">
                        <AvatarFallback>You</AvatarFallback>
                      </Avatar>
                    )}
                  </div>
                ))}
                <div ref={chatEndRef} />
              </div>
            </ScrollArea>
            <div className="p-4 border-t flex items-center gap-2">
              <Input
                value={chatInput}
                onChange={(e) => setChatInput(e.target.value)}
                onKeyDown={(e) => e.key === 'Enter' && handleSendMessage(chatInput)}
                placeholder="Type your message..."
              />
              <Button onClick={() => handleSendMessage(chatInput)} className="bg-slate-900 hover:bg-slate-800">
                <Icons.Send className="h-4 w-4" />
                <span className="sr-only">Send</span>
              </Button>
               <Button variant="outline" size="icon" disabled>
                <Icons.Mic className="h-4 w-4" />
                <span className="sr-only">Record message</span>
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>

    </div>
  );
}

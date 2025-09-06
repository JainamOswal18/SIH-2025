'use client';

import React, { useState, useEffect, useMemo, useCallback, useRef } from 'react';
import dynamic from 'next/dynamic';
import { format } from 'date-fns';
import { getRiskAlert } from '@/app/actions';

import type { LatLngTuple, RiskZone, AlertLog } from '@/lib/types';
import { touristRoute, riskZones } from '@/data/geo-data';
import { isPointInPolygon, isPointInCircle, getDistance, findNearestPointOnRoute } from '@/lib/geo';
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
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from '@/components/ui/alert-dialog';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter } from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Icons } from '@/components/icons';

const DEVIATION_THRESHOLD = 2000; // 2km in meters
const CHECKIN_INTERVAL = 15 * 60 * 1000; // 15 minutes

export default function Home() {
  const [touristPosition, setTouristPosition] = useState<LatLngTuple>(touristRoute[0]);
  const [currentZone, setCurrentZone] = useState<RiskZone | null>(null);
  const [safetyScore, setSafetyScore] = useState(10);
  const [isRouteDeviated, setIsRouteDeviated] = useState(false);
  const [alertLogs, setAlertLogs] = useState<AlertLog[]>([]);
  const [genAIAlert, setGenAIAlert] = useState<{ title: string; message: string; actions: string[] } | null>(null);
  const [isCheckinModalOpen, setCheckinModalOpen] = useState(false);
  const [isSOSModalOpen, setSOSModalOpen] = useState(false);
  
  const isOnline = useOnlineStatus();
  const { toast } = useToast();
  const processingZoneRef = useRef<string | null>(null);

  const Map = useMemo(() => dynamic(() => import('@/components/map-component'), {
    loading: () => <div className="w-full h-full bg-muted animate-pulse flex items-center justify-center"><p className="text-muted-foreground">Loading Map...</p></div>,
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
    const timer = setInterval(() => {
      setCheckinModalOpen(true);
    }, CHECKIN_INTERVAL);
    return () => clearInterval(timer);
  }, []);

  const handleSOS = () => {
    setSOSModalOpen(false);
    toast({
      title: "SOS Signal Sent",
      description: "Emergency services have been notified of your location.",
      variant: "destructive"
    });
  };

  return (
    <div className="flex h-screen w-full bg-background">
      <main className="flex-1 h-screen relative">
        <Map
          touristPosition={touristPosition}
          setTouristPosition={setTouristPosition}
          touristRoute={touristRoute}
          riskZones={riskZones}
        />
      </main>

      <Sidebar>
        <ProfilePanel name="John Doe" id="T4812" emergencyContact="+91 98765 43210" />
        <ControlsPanel isOnline={isOnline} />
        <TripStatusPanel route={touristRoute} currentPosition={touristPosition} />
        <SafetyPanel safetyScore={safetyScore} currentZone={currentZone} isRouteDeviated={isRouteDeviated} />
        <EmergencyPanel onSOS={() => setSOSModalOpen(true)} />
        <AlertsLogPanel alerts={alertLogs} />
      </Sidebar>

      {genAIAlert && (
        <AlertDialog open={!!genAIAlert} onOpenChange={() => setGenAIAlert(null)}>
          <AlertDialogContent>
            <AlertDialogHeader>
              <AlertDialogTitle className="flex items-center gap-2">
                <Icons.AlertTriangle className="text-warning-foreground" /> {genAIAlert.title}
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

      <Dialog open={isCheckinModalOpen} onOpenChange={setCheckinModalOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Periodic Safety Check-in</DialogTitle>
            <DialogDescription>Please enter your 4-digit security passcode to confirm you are safe.</DialogDescription>
          </DialogHeader>
          <div className="flex flex-col gap-4 py-4">
            <Input type="password" placeholder="****" maxLength={4} />
          </div>
          <DialogFooter>
            <Button onClick={() => setCheckinModalOpen(false)}>Confirm Safety</Button>
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
    </div>
  );
}

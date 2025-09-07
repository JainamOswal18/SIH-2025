'use client';

import type { Tourist, Alert, DashboardView } from '@/lib/types';
import { useState, useEffect } from 'react';
import { initialTourists, initialAlerts } from '@/lib/data';
import DashboardHeader from '@/components/dashboard/header';
import DashboardStats from '@/components/dashboard/dashboard-stats';
import AlertsSidebar from '@/components/dashboard/alerts-sidebar';
import TouristProfileModal from '@/components/dashboard/tourist-profile-modal';
import PoliceDashboardFeatures from '@/components/dashboard/police-dashboard-features';
import TourismDashboardFeatures from '@/components/dashboard/tourism-dashboard-features';
import dynamic from 'next/dynamic';
import { Sheet, SheetContent, SheetTrigger } from '@/components/ui/sheet';
import { Button } from '@/components/ui/button';
import { Bell } from 'lucide-react';

const MapView = dynamic(() => import('@/components/dashboard/map-view'), {
  ssr: false,
  loading: () => <div className="w-full h-full bg-muted rounded-xl flex items-center justify-center"><p>Loading Map...</p></div>
});


export default function DashboardPage() {
  const [dashboardView, setDashboardView] = useState<DashboardView>('police');
  const [tourists, setTourists] = useState<Tourist[]>(initialTourists);
  const [alerts, setAlerts] = useState<Alert[]>(initialAlerts);
  const [selectedTourist, setSelectedTourist] = useState<Tourist | null>(null);
  const [isProfileModalOpen, setProfileModalOpen] = useState(false);
  const [isAlertsSheetOpen, setAlertsSheetOpen] = useState(false);

  useEffect(() => {
    const simulationInterval = setInterval(() => {
      // Simulate tourist location updates
      setTourists(prevTourists =>
        prevTourists.map(tourist =>
          Math.random() > 0.7
            ? {
                ...tourist,
                location: {
                  ...tourist.location,
                  lat: Math.min(28.2, Math.max(26, tourist.location.lat + (Math.random() - 0.5) * 0.1)),
                  lng: Math.min(94.5, Math.max(91.5, tourist.location.lng + (Math.random() - 0.5) * 0.1)),
                },
              }
            : tourist
        )
      );

      // Simulate new alerts
      if (Math.random() < 0.15) {
        const randomTourist = tourists[Math.floor(Math.random() * tourists.length)];
        const alertTypes: Alert['type'][] = ['Route Deviation', 'Check-in Failure', 'SOS', 'Missing'];
        const randomType = alertTypes[Math.floor(Math.random() * alertTypes.length)];
        let newAlert: Alert;
        switch(randomType) {
            case 'SOS':
                newAlert = { id: `alert-${Date.now()}`, touristId: randomTourist.id, type: 'SOS', tier: 'CRITICAL', message: `${randomTourist.name} triggered an SOS!`, timestamp: new Date().toISOString() };
                break;
            case 'Check-in Failure':
                newAlert = { id: `alert-${Date.now()}`, touristId: randomTourist.id, type: 'Check-in Failure', tier: 'HIGH', message: `${randomTourist.name} missed a safety check-in.`, timestamp: new Date().toISOString() };
                break;
            case 'Route Deviation':
                newAlert = { id: `alert-${Date.now()}`, touristId: randomTourist.id, type: 'Route Deviation', tier: 'MEDIUM', message: `${randomTourist.name} deviated from planned route.`, timestamp: new Date().toISOString() };
                break;
            case 'Missing':
                newAlert = { id: `alert-${Date.now()}`, touristId: randomTourist.id, type: 'Missing', tier: 'INFO', message: `${randomTourist.name} reported as missing.`, timestamp: new Date().toISOString() };
                break;
        }

        setAlerts(prevAlerts => [newAlert, ...prevAlerts].slice(0, 50));
      }
    }, 5000);

    return () => clearInterval(simulationInterval);
  }, [tourists]);

  const handleSelectTourist = (tourist: Tourist) => {
    setSelectedTourist(tourist);
    setProfileModalOpen(true);
  };

  return (
    <div className="flex flex-col h-screen bg-background text-foreground font-sans">
      <DashboardHeader
        dashboardView={dashboardView}
        setDashboardView={setDashboardView}
        onShowAlerts={() => setAlertsSheetOpen(true)}
      />
      <main className="flex-1 flex overflow-hidden">
        <div className="flex-1 flex flex-col p-4 md:p-6 gap-6 overflow-y-auto">
          <DashboardStats tourists={tourists} alerts={alerts} view={dashboardView} />
          <div className='flex flex-col xl:flex-row gap-6'>
            {dashboardView === 'police' ? 
              <PoliceDashboardFeatures tourists={tourists} /> : 
              <TourismDashboardFeatures tourists={tourists} />
            }
          </div>
          <div className="flex-1 min-h-[400px] xl:min-h-0">
            <MapView tourists={tourists} onSelectTourist={handleSelectTourist} />
          </div>
        </div>
        <div className="hidden md:flex">
          <AlertsSidebar alerts={alerts} tourists={tourists} />
        </div>
      </main>
      {selectedTourist && (
        <TouristProfileModal
          tourist={selectedTourist}
          isOpen={isProfileModalOpen}
          onOpenChange={setProfileModalOpen}
        />
      )}
       <Sheet open={isAlertsSheetOpen} onOpenChange={setAlertsSheetOpen}>
        <SheetContent className="w-full sm:w-[400px] p-0 flex flex-col" side="right">
          <AlertsSidebar alerts={alerts} tourists={tourists} isSheet={true} />
        </SheetContent>
      </Sheet>
    </div>
  );
}

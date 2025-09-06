import React, { useState, useEffect } from 'react';
import { Icons } from '@/components/icons';
import PanelCard from './panel-card';
import type { LatLngTuple } from '@/lib/types';
import { getDistance, findNearestPointOnRoute } from '@/lib/geo';
import { useRealtimeClock } from '@/hooks/use-realtime-clock';
import { formatDistanceStrict } from 'date-fns';

interface TripStatusPanelProps {
  route: LatLngTuple[];
  currentPosition: LatLngTuple;
}

const InfoItem = ({ label, value }: { label: string; value: React.ReactNode }) => (
  <div className="flex justify-between items-center">
    <p className="text-sm text-muted-foreground">{label}</p>
    <p className="font-semibold text-foreground text-sm">{value}</p>
  </div>
);

export default function TripStatusPanel({ route, currentPosition }: TripStatusPanelProps) {
  const [tripStartTime, setTripStartTime] = useState<Date | null>(null);
  const [tripDuration, setTripDuration] = useState('0 seconds');
  const [nextDestination, setNextDestination] = useState('Kaziranga');
  const [eta, setEta] = useState('N/A');
  const currentTime = useRealtimeClock();

  useEffect(() => {
    // Initialize start time only on the client
    if (!tripStartTime) {
      setTripStartTime(new Date());
    }
  }, [tripStartTime]);

  useEffect(() => {
    if (currentTime && tripStartTime) {
      setTripDuration(formatDistanceStrict(currentTime, tripStartTime));
    }

    const { segmentIndex } = findNearestPointOnRoute(currentPosition, route);
    const nextDestIndex = (segmentIndex ?? -1) + 1;

    if (nextDestIndex < route.length) {
      const destName = nextDestIndex === 1 ? 'Kaziranga' : 'Shillong';
      setNextDestination(destName);
      
      const distanceToNextDest = getDistance(currentPosition, route[nextDestIndex]) / 1000; // in km
      const AVERAGE_SPEED_KMH = 40;
      const timeHours = distanceToNextDest / AVERAGE_SPEED_KMH;
      const timeMinutes = Math.round(timeHours * 60);

      const hours = Math.floor(timeMinutes / 60);
      const minutes = timeMinutes % 60;
      setEta(`${hours > 0 ? `${hours}h ` : ''}${minutes}m`);

    } else {
      setNextDestination("Trip Ended");
      setEta("N/A");
    }

  }, [currentTime, currentPosition, route, tripStartTime]);


  return (
    <PanelCard icon={Icons.Route} title="Trip Status">
      <div className="space-y-2">
        <InfoItem label="Trip Duration" value={tripDuration} />
        <InfoItem label="Next Destination" value={nextDestination} />
        <InfoItem label="Est. Time to Next" value={eta} />
      </div>
    </PanelCard>
  );
}

import React from 'react';
import { Icons } from '@/components/icons';
import PanelCard from './panel-card';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Badge } from '@/components/ui/badge';
import { useRealtimeClock } from '@/hooks/use-realtime-clock';
import { format } from 'date-fns';

interface ControlsPanelProps {
  isOnline: boolean;
}

export default function ControlsPanel({ isOnline }: ControlsPanelProps) {
  const currentTime = useRealtimeClock();

  return (
    <PanelCard icon={Icons.Activity} title="System Status & Controls">
      <div className="space-y-4">
        <div className="flex justify-between items-center">
          <label className="text-sm font-medium text-foreground">Language</label>
          <Select defaultValue="en">
            <SelectTrigger className="w-[120px]">
              <SelectValue placeholder="Language" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="en">English</SelectItem>
              <SelectItem value="hi">Hindi</SelectItem>
            </SelectContent>
          </Select>
        </div>
        <div className="flex justify-between items-center">
          <label className="text-sm font-medium text-foreground">Connectivity</label>
          <Badge variant={isOnline ? 'default' : 'destructive'} className={`transition-colors ${isOnline ? 'bg-success' : 'bg-danger'}`}>
            {isOnline ? <Icons.Wifi className="mr-2 h-4 w-4" /> : <Icons.WifiOff className="mr-2 h-4 w-4" />}
            {isOnline ? 'Online' : 'Offline'}
          </Badge>
        </div>
        <div className="flex justify-between items-center">
          <label className="text-sm font-medium text-foreground">Current Time</label>
          <div className="font-mono text-sm font-semibold text-foreground bg-muted px-2 py-1 rounded-md">
            {currentTime ? format(currentTime, 'HH:mm:ss') : '00:00:00'}
          </div>
        </div>
      </div>
    </PanelCard>
  );
}

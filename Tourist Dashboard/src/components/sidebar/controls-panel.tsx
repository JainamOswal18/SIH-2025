import React from 'react';
import { Icons } from '@/components/icons';
import PanelCard from './panel-card';
import { Badge } from '@/components/ui/badge';
import { useRealtimeClock } from '@/hooks/use-realtime-clock';
import { format } from 'date-fns';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';

interface ControlsPanelProps {
  isOnline: boolean;
  checkinInterval: number;
}

export default function ControlsPanel({ isOnline, checkinInterval }: ControlsPanelProps) {
  const currentTime = useRealtimeClock();

  return (
    <PanelCard icon={Icons.Activity} title="System Status & Controls">
      <div className="space-y-4">
        
        <div className="flex justify-between items-center">
          <Label className="text-sm font-medium text-foreground">Check-in Interval</Label>
          <div className="font-mono text-sm font-semibold text-foreground bg-slate-200/60 px-2 py-1 rounded-md">
            {checkinInterval / 60000} mins
          </div>
        </div>
        
        <div className="flex justify-between items-center">
          <Label className="text-sm font-medium text-foreground">Language</Label>
          <Select defaultValue="en">
            <SelectTrigger className="w-[120px]">
              <SelectValue placeholder="Language" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="en">English</SelectItem>
              <SelectItem value="hi">Hindi</SelectItem>
              <SelectItem value="as">Assamese</SelectItem>
              <SelectItem value="bn">Bengali</SelectItem>
              <SelectItem value="fr">French</SelectItem>
              <SelectItem value="es">Spanish</SelectItem>
              <SelectItem value="de">German</SelectItem>
              <SelectItem value="ja">Japanese</SelectItem>
            </SelectContent>
          </Select>
        </div>

        <div className="flex justify-between items-center">
          <Label className="text-sm font-medium text-foreground">Connectivity</Label>
          <Badge variant={isOnline ? 'default' : 'destructive'} className={`transition-colors text-white ${isOnline ? 'bg-green-500' : 'bg-red-500'}`}>
            {isOnline ? <Icons.Wifi className="mr-1 h-3 w-3" /> : <Icons.WifiOff className="mr-1 h-3 w-3" />}
            {isOnline ? 'Online' : 'Offline'}
          </Badge>
        </div>
        
        <div className="flex justify-between items-center">
          <Label className="text-sm font-medium text-foreground">Current Time</Label>
          <div className="font-mono text-sm font-semibold text-foreground bg-slate-200/60 px-2 py-1 rounded-md">
            {currentTime ? format(currentTime, 'HH:mm:ss') : '00:00:00'}
          </div>
        </div>
      </div>
    </PanelCard>
  );
}

import React from 'react';
import { Icons } from '@/components/icons';
import PanelCard from './panel-card';
import { Button } from '@/components/ui/button';

interface EmergencyPanelProps {
  onSOS: () => void;
}

const Contact = ({ name, number }: { name: string; number: string }) => (
    <div className="flex justify-between items-center p-2 rounded-md hover:bg-muted">
        <div className="flex items-center gap-2">
            <Icons.Phone className="h-4 w-4 text-muted-foreground"/>
            <p className="text-sm font-medium text-foreground">{name}</p>
        </div>
        <p className="text-sm font-mono text-muted-foreground">{number}</p>
    </div>
);

export default function EmergencyPanel({ onSOS }: EmergencyPanelProps) {
  return (
    <PanelCard icon={Icons.AlertTriangle} title="Emergency Contacts">
        <div className="space-y-2 mb-4">
            <Contact name="Police" number="100" />
            <Contact name="Ambulance" number="108" />
            <Contact name="Disaster Management" number="1077" />
        </div>
      <Button
        onClick={onSOS}
        className="w-full bg-danger text-danger-foreground hover:bg-danger/90 animate-pulse"
      >
        <Icons.Send className="mr-2 h-4 w-4" />
        EMERGENCY SOS
      </Button>
    </PanelCard>
  );
}

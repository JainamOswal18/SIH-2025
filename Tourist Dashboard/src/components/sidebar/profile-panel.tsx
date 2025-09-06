import React from 'react';
import { Icons } from '@/components/icons';
import PanelCard from './panel-card';

interface ProfilePanelProps {
  name: string;
  id: string;
  emergencyContact: string;
}

const InfoItem = ({ label, value }: { label: string; value: string }) => (
  <div>
    <p className="text-xs text-muted-foreground">{label}</p>
    <p className="font-medium text-foreground">{value}</p>
  </div>
);

export default function ProfilePanel({ name, id, emergencyContact }: ProfilePanelProps) {
  return (
    <PanelCard icon={Icons.UserCheck} title="Tourist Profile">
      <div className="space-y-3">
        <InfoItem label="Name" value={name} />
        <InfoItem label="Tourist ID" value={id} />
        <InfoItem label="Emergency Contact" value={emergencyContact} />
      </div>
    </PanelCard>
  );
}

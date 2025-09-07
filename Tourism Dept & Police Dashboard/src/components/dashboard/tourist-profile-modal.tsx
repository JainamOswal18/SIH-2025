'use client';

import type { Tourist } from '@/lib/types';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from '@/components/ui/dialog';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Badge } from '@/components/ui/badge';
import { CheckCircle, ShieldAlert, Map, HeartPulse, Users } from 'lucide-react';

interface TouristProfileModalProps {
  tourist: Tourist;
  isOpen: boolean;
  onOpenChange: (isOpen: boolean) => void;
}

const InfoSection = ({ icon: Icon, title, children }: { icon: React.ElementType, title: string, children: React.ReactNode }) => (
    <div>
        <div className="flex items-center gap-2 mb-2">
            <Icon className="h-5 w-5 text-primary" />
            <h3 className="font-semibold text-md">{title}</h3>
        </div>
        <div className="pl-7 text-sm text-muted-foreground space-y-1">
            {children}
        </div>
    </div>
);


export default function TouristProfileModal({ tourist, isOpen, onOpenChange }: TouristProfileModalProps) {
  if (!tourist) return null;

  return (
    <Dialog open={isOpen} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[600px] max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <div className="flex items-center gap-4">
            <Avatar className="h-16 w-16">
              <AvatarImage src={tourist.profilePicture} alt={tourist.name} />
              <AvatarFallback>{tourist.name.charAt(0)}</AvatarFallback>
            </Avatar>
            <div>
              <DialogTitle className="text-2xl">{tourist.name}</DialogTitle>
              <DialogDescription>
                {tourist.age}, {tourist.gender} from {tourist.nationality}
              </DialogDescription>
            </div>
          </div>
          <div className="flex items-center gap-2 pt-4">
            {tourist.blockchainVerified && (
              <Badge variant="default" className="bg-green-600 hover:bg-green-700">
                <CheckCircle className="mr-1 h-4 w-4" />
                Blockchain Verified
              </Badge>
            )}
             <Badge variant="secondary">{tourist.status}</Badge>
             <Badge variant={tourist.riskLevel === 'High' ? 'destructive' : 'outline'}>
                {tourist.riskLevel} Risk
            </Badge>
          </div>
        </DialogHeader>
        <div className="grid gap-6 py-4">
            <InfoSection icon={Map} title="Trip Itinerary">
                {tourist.itinerary.map(item => (
                    <p key={item.day}><strong>Day {item.day}:</strong> {item.location} - {item.activity}</p>
                ))}
            </InfoSection>

            <InfoSection icon={Users} title="Emergency Contacts">
                {tourist.emergencyContacts.map(contact => (
                    <p key={contact.phone}><strong>{contact.name} ({contact.relation}):</strong> {contact.phone}</p>
                ))}
            </InfoSection>

            {tourist.medicalFlags.length > 0 && (
                <InfoSection icon={HeartPulse} title="Medical Information">
                     {tourist.medicalFlags.map(flag => (
                        <div key={flag} className="flex items-center gap-2">
                            <ShieldAlert className="h-4 w-4 text-destructive" />
                            <p>{flag}</p>
                        </div>
                    ))}
                </InfoSection>
            )}
        </div>
      </DialogContent>
    </Dialog>
  );
}

'use client';

import type { Tourist } from '@/lib/types';
import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from '@/components/ui/card';
import { FileText, FilePlus, Network } from 'lucide-react';
import RouteAnomalyModal from './route-anomaly-modal';
import { Dialog, DialogTrigger, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter } from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';

export default function PoliceDashboardFeatures({ tourists }: { tourists: Tourist[] }) {
  const [isAnomalyModalOpen, setAnomalyModalOpen] = useState(false);
  const [selectedTouristId, setSelectedTouristId] = useState('');
  
  return (
    <>
      <Card className="flex-1">
        <CardHeader>
          <CardTitle>Police Operations</CardTitle>
          <CardDescription>Emergency response and law enforcement tools.</CardDescription>
        </CardHeader>
        <CardContent className="flex flex-wrap gap-4">
          <Dialog>
            <DialogTrigger asChild>
              <Button>
                <FileText className="mr-2 h-4 w-4" /> New Incident Report
              </Button>
            </DialogTrigger>
            <DialogContent className="sm:max-w-lg">
              <DialogHeader>
                <DialogTitle>Log New Incident Report</DialogTitle>
                <DialogDescription>Record a new incident. Fill in all available details.</DialogDescription>
              </DialogHeader>
              <div className="grid gap-4 py-4">
                <div className="space-y-2">
                  <Label htmlFor="incident-type">Incident Type</Label>
                   <Select>
                    <SelectTrigger id="incident-type">
                      <SelectValue placeholder="Select type" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="theft">Theft/Robbery</SelectItem>
                      <SelectItem value="assault">Assault</SelectItem>
                      <SelectItem value="medical">Medical Emergency</SelectItem>
                      <SelectItem value="missing_person">Missing Person</SelectItem>
                      <SelectItem value="traffic_accident">Traffic Accident</SelectItem>
                      <SelectItem value="public_disturbance">Public Disturbance</SelectItem>
                      <SelectItem value="other">Other</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="location">Location</Label>
                  <Input id="location" placeholder="e.g., Police Bazar, Shillong" />
                </div>
                 <div className="space-y-2">
                  <Label htmlFor="severity">Severity</Label>
                  <Select>
                    <SelectTrigger>
                      <SelectValue placeholder="Select severity" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="low">Low</SelectItem>
                      <SelectItem value="medium">Medium</SelectItem>
                      <SelectItem value="high">High</SelectItem>
                      <SelectItem value="critical">Critical</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="description">Description</Label>
                  <Textarea id="description" placeholder="Briefly describe the incident..." />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="parties-involved">Parties Involved</Label>
                  <Input id="parties-involved" placeholder="e.g., Tourist name, vehicle number" />
                </div>
              </div>
              <DialogFooter>
                <Button variant="outline">Cancel</Button>
                <Button type="submit">Log Incident</Button>
              </DialogFooter>
            </DialogContent>
          </Dialog>

          <Dialog>
            <DialogTrigger asChild>
              <Button>
                <FilePlus className="mr-2 h-4 w-4" /> Generate e-FIR
              </Button>
            </DialogTrigger>
             <DialogContent className="sm:max-w-2xl">
              <DialogHeader>
                <DialogTitle>Generate Electronic First Information Report (e-FIR)</DialogTitle>
                <DialogDescription>Auto-populate and generate an e-FIR for a tourist-related incident.</DialogDescription>
              </DialogHeader>
              <div className="space-y-4 py-4">
                 <div className="grid sm:grid-cols-2 gap-4">
                    <div className='space-y-2'>
                        <Label htmlFor="tourist-select">Complainant (Tourist)</Label>
                        <Select onValueChange={setSelectedTouristId}>
                            <SelectTrigger id="tourist-select">
                            <SelectValue placeholder="Select a tourist..." />
                            </SelectTrigger>
                            <SelectContent>
                            {tourists.map(t => <SelectItem key={t.id} value={t.id}>{t.name} ({t.id})</SelectItem>)}
                            </SelectContent>
                        </Select>
                    </div>
                     <div className='space-y-2'>
                        <Label htmlFor="offense-datetime">Date & Time of Offense</Label>
                        <Input id="offense-datetime" type="datetime-local" />
                    </div>
                </div>
                 <div className='space-y-2'>
                    <Label htmlFor="offense-place">Place of Offense / Occurrence</Label>
                    <Input id="offense-place" placeholder="Detailed address or landmark" />
                </div>
                 <div className='space-y-2'>
                  <Label htmlFor="offense-type">Nature of Offense</Label>
                  <Select>
                    <SelectTrigger id="offense-type">
                      <SelectValue placeholder="Select offense type..." />
                    </SelectTrigger>
                    <SelectContent>
                       <SelectItem value="theft">Theft (Sec 379 IPC)</SelectItem>
                       <SelectItem value="robbery">Robbery (Sec 392 IPC)</SelectItem>
                       <SelectItem value="cheating">Cheating (Sec 420 IPC)</SelectItem>
                       <SelectItem value="assault">Assault/Causing Hurt (Sec 323 IPC)</SelectItem>
                       <SelectItem value="molestation">Outraging Modesty of Woman (Sec 354 IPC)</SelectItem>
                       <SelectItem value="other">Other</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div className='space-y-2'>
                    <Label htmlFor="fir-details">Details of Complaint / Information</Label>
                    <Textarea id="fir-details" placeholder="Narrate the sequence of events, what happened..." rows={4} />
                </div>
                 <div className="grid sm:grid-cols-2 gap-4">
                    <div className='space-y-2'>
                        <Label htmlFor="accused-details">Suspect/Accused Details</Label>
                        <Textarea id="accused-details" placeholder="Name, description, or any identifying information of the accused." />
                    </div>
                    <div className='space-y-2'>
                        <Label htmlFor="witness-details">Witness Details</Label>
                        <Textarea id="witness-details" placeholder="Name and contact information of any witnesses." />
                    </div>
                </div>
                <div className='space-y-2'>
                    <Label htmlFor="stolen-property">Details of Properties Stolen (if any)</Label>
                    <Textarea id="stolen-property" placeholder="List items, brands, serial numbers, estimated value." />
                </div>
              </div>
              <DialogFooter>
                <Button variant="outline">Cancel</Button>
                <Button type="submit">Generate and Save e-FIR</Button>
              </DialogFooter>
            </DialogContent>
          </Dialog>

          <Button onClick={() => setAnomalyModalOpen(true)}>
            <Network className="mr-2 h-4 w-4" /> Route Anomaly Check
          </Button>
        </CardContent>
      </Card>
      
      <RouteAnomalyModal
        isOpen={isAnomalyModalOpen}
        onOpenChange={setAnomalyModalOpen}
        tourists={tourists}
      />
    </>
  );
}

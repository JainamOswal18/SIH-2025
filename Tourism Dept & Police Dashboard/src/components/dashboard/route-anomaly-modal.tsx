'use client';

import { useState } from 'react';
import type { FormEvent } from 'react';
import { analyzeRouteDeviation, RouteDeviationOutput, RouteDeviationInput } from '@/ai/flows/route-anomaly-detection';
import type { Tourist } from '@/lib/types';
import { Button } from '@/components/ui/button';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from '@/components/ui/dialog';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { useToast } from '@/hooks/use-toast';
import { AlertTriangle, Bot, CheckCircle2, Loader2 } from 'lucide-react';
import { Card, CardContent } from '@/components/ui/card';

interface RouteAnomalyModalProps {
  isOpen: boolean;
  onOpenChange: (isOpen: boolean) => void;
  tourists: Tourist[];
}

export default function RouteAnomalyModal({ isOpen, onOpenChange, tourists }: RouteAnomalyModalProps) {
  const [selectedTouristId, setSelectedTouristId] = useState<string>('');
  const [plannedRoute, setPlannedRoute] = useState<string>('');
  const [actualRoute, setActualRoute] = useState<string>('');
  const [result, setResult] = useState<RouteDeviationOutput | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const { toast } = useToast();

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    if (!selectedTouristId || !plannedRoute || !actualRoute) {
      toast({
        variant: 'destructive',
        title: 'Missing Information',
        description: 'Please select a tourist and fill out both route fields.',
      });
      return;
    }
    setIsLoading(true);
    setResult(null);

    const input: RouteDeviationInput = {
      touristId: selectedTouristId,
      plannedRoute,
      actualRoute,
    };
    
    try {
      const analysisResult = await analyzeRouteDeviation(input);
      setResult(analysisResult);
    } catch (error) {
      console.error('Error analyzing route:', error);
      toast({
        variant: 'destructive',
        title: 'Analysis Failed',
        description: 'Could not get a response from the AI model.',
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleTouristSelect = (touristId: string) => {
    setSelectedTouristId(touristId);
    const tourist = tourists.find(t => t.id === touristId);
    if(tourist) {
        const planned = tourist.itinerary.map(i => `Day ${i.day}: ${i.location} (${i.activity})`).join('\n');
        setPlannedRoute(planned);
        setActualRoute(`Current location: ${tourist.location.name}`);
    }
  }

  return (
    <Dialog open={isOpen} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-2xl">
        <DialogHeader>
          <DialogTitle>AI Route Anomaly Detection</DialogTitle>
          <DialogDescription>
            Analyze a tourist's route for deviations and potential risks using AI.
          </DialogDescription>
        </DialogHeader>
        <form onSubmit={handleSubmit}>
          <div className="grid gap-4 py-4">
            <div>
              <Label htmlFor="tourist">Select Tourist</Label>
              <Select value={selectedTouristId} onValueChange={handleTouristSelect}>
                <SelectTrigger id="tourist">
                  <SelectValue placeholder="Select a tourist..." />
                </SelectTrigger>
                <SelectContent>
                  {tourists.map(t => (
                    <SelectItem key={t.id} value={t.id}>{t.name}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div className="grid grid-cols-2 gap-4">
                <div>
                    <Label htmlFor="planned-route">Planned Itinerary</Label>
                    <Textarea
                        id="planned-route"
                        placeholder="e.g., Day 1: Guwahati, Day 2: Shillong..."
                        value={plannedRoute}
                        onChange={e => setPlannedRoute(e.target.value)}
                        className="h-32"
                    />
                </div>
                <div>
                    <Label htmlFor="actual-route">Actual Route Data</Label>
                    <Textarea
                        id="actual-route"
                        placeholder="e.g., GPS pings, check-ins..."
                        value={actualRoute}
                        onChange={e => setActualRoute(e.target.value)}
                        className="h-32"
                    />
                </div>
            </div>
          </div>
          <DialogFooter>
            <Button type="submit" disabled={isLoading}>
              {isLoading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
              Analyze Route
            </Button>
          </DialogFooter>
        </form>
        {result && (
          <div className="mt-4">
            <h3 className="font-semibold flex items-center gap-2"><Bot className="h-5 w-5"/> AI Analysis Result</h3>
             <Card className={`mt-2 ${result.isDeviation ? 'border-destructive' : 'border-green-500'}`}>
                <CardContent className="p-4">
                  {result.isDeviation ? (
                    <div className="flex items-start gap-3">
                        <AlertTriangle className="h-6 w-6 text-destructive flex-shrink-0 mt-1" />
                        <div>
                            <p className="font-bold text-destructive">Deviation Detected</p>
                            <p className="text-sm mt-1"><strong>Details:</strong> {result.deviationDetails}</p>
                            <p className="text-sm mt-1"><strong>Risk Assessment:</strong> {result.riskAssessment}</p>
                        </div>
                    </div>
                  ) : (
                    <div className="flex items-start gap-3">
                        <CheckCircle2 className="h-6 w-6 text-green-600 flex-shrink-0 mt-1" />
                        <div>
                            <p className="font-bold text-green-600">No Deviation Detected</p>
                            <p className="text-sm mt-1">{result.deviationDetails}</p>
                        </div>
                    </div>
                  )}
                </CardContent>
             </Card>
          </div>
        )}
      </DialogContent>
    </Dialog>
  );
}

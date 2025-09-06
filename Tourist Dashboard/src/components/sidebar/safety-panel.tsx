import React from 'react';
import { Icons } from '@/components/icons';
import PanelCard from './panel-card';
import { Progress } from '@/components/ui/progress';
import { Badge } from '@/components/ui/badge';
import type { RiskZone } from '@/lib/types';
import { cn } from '@/lib/utils';

interface SafetyPanelProps {
  safetyScore: number;
  currentZone: RiskZone | null;
  isRouteDeviated: boolean;
}

const getStatus = (zone: RiskZone | null) => {
  if (!zone) return { text: "In Transit", color: "bg-primary", icon: Icons.MapPin };
  switch (zone.riskLevel) {
    case 'safe': return { text: "Safe Zone", color: "bg-success", icon: Icons.ShieldCheck };
    case 'low': return { text: "Low Risk", color: "bg-yellow-500", icon: Icons.ShieldAlert };
    case 'moderate': return { text: "Moderate Risk", color: "bg-warning", icon: Icons.ShieldAlert };
    case 'high': return { text: "High Risk", color: "bg-danger", icon: Icons.ShieldAlert };
    default: return { text: "In Transit", color: "bg-primary", icon: Icons.MapPin };
  }
}

export default function SafetyPanel({ safetyScore, currentZone, isRouteDeviated }: SafetyPanelProps) {
  const status = getStatus(currentZone);
  const scoreColor = safetyScore > 7 ? 'bg-success' : safetyScore > 4 ? 'bg-warning' : 'bg-danger';

  return (
    <PanelCard icon={Icons.Shield} title="Safety Overview">
      <div className="space-y-4">
        <div>
          <div className="flex justify-between items-baseline mb-1">
            <p className="text-sm font-medium text-foreground">Safety Score</p>
            <p className="text-xl font-bold text-foreground">{safetyScore}/10</p>
          </div>
          <Progress value={safetyScore * 10} className={cn("h-3 [&>*]:bg-primary", scoreColor)} />
        </div>
        
        <div className="flex justify-between items-center">
            <p className="text-sm font-medium text-foreground">Current Status</p>
            <Badge className={cn("text-white", status.color)}>
                <status.icon className="mr-2 h-4 w-4" /> {status.text}
            </Badge>
        </div>

        {isRouteDeviated && (
             <div className="flex justify-between items-center p-2 rounded-md bg-destructive/10 border border-destructive/20">
                <div className="flex items-center gap-2">
                    <Icons.AlertTriangle className="h-5 w-5 text-destructive" />
                    <p className="text-sm font-semibold text-destructive">Route Deviation</p>
                </div>
            </div>
        )}
      </div>
    </PanelCard>
  );
}

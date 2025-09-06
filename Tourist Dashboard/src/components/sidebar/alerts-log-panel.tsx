import React from 'react';
import { Icons } from '@/components/icons';
import PanelCard from './panel-card';
import type { AlertLog } from '@/lib/types';
import { ScrollArea } from '@/components/ui/scroll-area';

interface AlertsLogPanelProps {
  alerts: AlertLog[];
}

export default function AlertsLogPanel({ alerts }: AlertsLogPanelProps) {
  return (
    <PanelCard icon={Icons.List} title="Alerts History">
      <ScrollArea className="h-48">
        {alerts.length === 0 ? (
          <div className="flex items-center justify-center h-full text-muted-foreground text-sm">
            <p>No alerts yet.</p>
          </div>
        ) : (
          <div className="space-y-3">
            {alerts.map(alert => (
              <div key={alert.id} className="flex items-start gap-3">
                <Icons.AlertTriangle className="h-4 w-4 mt-1 text-warning flex-shrink-0" />
                <div className="flex-1">
                  <p className="text-sm text-foreground">{alert.message}</p>
                  <p className="text-xs text-muted-foreground">{alert.timestamp}</p>
                </div>
              </div>
            ))}
          </div>
        )}
      </ScrollArea>
    </PanelCard>
  );
}

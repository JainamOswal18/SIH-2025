'use client';

import type { Alert, Tourist } from '@/lib/types';
import { Card, CardContent } from '@/components/ui/card';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Badge } from '@/components/ui/badge';
import { Siren, ShieldAlert, GitBranch, UserX, Clock, Bell } from 'lucide-react';
import { cn } from '@/lib/utils';
import { formatDistanceToNow } from 'date-fns';
import { useState, useEffect } from 'react';

const alertConfig = {
  CRITICAL: {
    icon: Siren,
    color: 'border-red-500 bg-red-500/10 hover:bg-red-500/20',
    badge: 'bg-red-500',
    textColor: 'text-red-500',
  },
  HIGH: {
    icon: ShieldAlert,
    color: 'border-orange-500 bg-orange-500/10 hover:bg-orange-500/20',
    badge: 'bg-orange-500',
    textColor: 'text-orange-500',
  },
  MEDIUM: {
    icon: GitBranch,
    color: 'border-yellow-500 bg-yellow-500/10 hover:bg-yellow-500/20',
    badge: 'bg-yellow-500',
    textColor: 'text-yellow-500',
  },
  INFO: {
    icon: UserX,
    color: 'border-purple-500 bg-purple-500/10 hover:bg-purple-500/20',
    badge: 'bg-purple-500',
    textColor: 'text-purple-500',
  },
};

const AlertCard = ({ alert, touristName }: { alert: Alert; touristName?: string }) => {
  const [timeAgo, setTimeAgo] = useState('');

  useEffect(() => {
    const update = () => setTimeAgo(formatDistanceToNow(new Date(alert.timestamp), { addSuffix: true }));
    update(); // Set initial value
    const interval = setInterval(update, 60000); // Update every minute
    return () => clearInterval(interval);
  }, [alert.timestamp]);

  const config = alertConfig[alert.tier];
  const Icon = config.icon;
  
  if (!timeAgo) {
    // Render nothing on the server and initial client render to avoid mismatch
    return null;
  }

  return (
    <Card className={cn('transition-all', config.color)}>
      <CardContent className="p-3 flex items-start gap-3">
        <div className={cn('p-2 rounded-full', config.badge)}>
          <Icon className="h-5 w-5 text-white" />
        </div>
        <div className="flex-1">
          <div className="flex justify-between items-center">
            <p className="font-semibold text-sm">
              {alert.type} {touristName && `- ${touristName}`}
            </p>
            <Badge variant="outline" className={cn('text-xs', config.textColor)}>{alert.tier}</Badge>
          </div>
          <p className="text-sm text-muted-foreground">{alert.message}</p>
          <div className="flex items-center gap-1 text-xs text-muted-foreground mt-1">
            <Clock className="h-3 w-3" />
            <span>{timeAgo}</span>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default function AlertsSidebar({ alerts, tourists, isSheet = false }: { alerts: Alert[]; tourists: Tourist[], isSheet?: boolean }) {
  const touristMap = new Map(tourists.map(t => [t.id, t.name]));

  return (
    <aside className={cn("bg-card flex flex-col", isSheet ? "w-full h-full" : "w-full md:w-[28rem] lg:w-[30rem] border-l flex-shrink-0")}>
      <div className="p-4 border-b">
        <h2 className="text-lg font-bold">Critical Alerts</h2>
        <p className="text-sm text-muted-foreground">Real-time emergency notifications</p>
      </div>
      <ScrollArea className="flex-1">
        <div className="p-4 space-y-3">
          {alerts.length === 0 ? (
            <div className="text-center text-muted-foreground py-10">
              <Bell className="mx-auto h-12 w-12" />
              <p className="mt-4">No alerts at the moment.</p>
            </div>
          ) : (
            alerts.map(alert => (
              <AlertCard key={alert.id} alert={alert} touristName={touristMap.get(alert.touristId)} />
            ))
          )}
        </div>
      </ScrollArea>
    </aside>
  );
}

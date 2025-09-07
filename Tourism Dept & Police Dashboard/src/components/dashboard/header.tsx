'use client';

import type { DashboardView } from '@/lib/types';
import { ShieldHalf, Bell, MountainSnow } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';

interface DashboardHeaderProps {
  dashboardView: DashboardView;
  setDashboardView: (view: DashboardView) => void;
  onShowAlerts: () => void;
}

export default function DashboardHeader({ dashboardView, setDashboardView, onShowAlerts }: DashboardHeaderProps) {
  return (
    <header className="flex items-center justify-between p-4 border-b bg-card/80 backdrop-blur-sm sticky top-0 z-30">
      <div className="flex items-center gap-3">
        <div className="p-2 bg-primary/10 rounded-lg">
          <MountainSnow className="h-6 w-6 text-primary" />
        </div>
        <h1 className="text-lg md:text-xl font-bold tracking-tight text-foreground">
          NE Frontier Command
        </h1>
      </div>
      <div className="flex items-center gap-2">
        <div className="flex items-center gap-1 p-1 bg-muted rounded-lg">
          <Button
            variant={dashboardView === 'police' ? 'default' : 'ghost'}
            size="sm"
            onClick={() => setDashboardView('police')}
            className={cn(
              'transition-all text-xs sm:text-sm px-3',
              dashboardView === 'police' ? 'shadow-sm' : 'hover:bg-background/80'
            )}
          >
            <ShieldHalf className='mr-2 h-4 w-4' />
            Police
          </Button>
          <Button
            variant={dashboardView === 'tourism' ? 'default' : 'ghost'}
            size="sm"
            onClick={() => setDashboardView('tourism')}
             className={cn(
              'transition-all text-xs sm:text-sm px-3',
              dashboardView === 'tourism' ? 'shadow-sm' : 'hover:bg-background/80'
            )}
          >
            Tourism Dept.
          </Button>
        </div>
         <Button
            variant="outline"
            size="icon"
            onClick={onShowAlerts}
            className="md:hidden"
          >
            <Bell className="h-4 w-4" />
            <span className="sr-only">Show Alerts</span>
          </Button>
      </div>
    </header>
  );
}

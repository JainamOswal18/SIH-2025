'use client';

import type { Tourist, Alert, DashboardView } from '@/lib/types';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Users, Bell, MapPin, ShieldCheck, BarChart2 } from 'lucide-react';

interface DashboardStatsProps {
  tourists: Tourist[];
  alerts: Alert[];
  view: DashboardView;
}

const StatCard = ({ title, value, icon: Icon, description }: { title: string; value: string | number; icon: React.ElementType; description: string; }) => (
  <Card>
    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
      <CardTitle className="text-sm font-medium">{title}</CardTitle>
      <Icon className="h-4 w-4 text-muted-foreground" />
    </CardHeader>
    <CardContent>
      <div className="text-2xl font-bold">{value}</div>
      <p className="text-xs text-muted-foreground">{description}</p>
    </CardContent>
  </Card>
);


export default function DashboardStats({ tourists, alerts, view }: DashboardStatsProps) {
  const activeTourists = tourists.filter(t => t.status === 'Active').length;
  const criticalAlerts = alerts.filter(a => a.tier === 'CRITICAL').length;
  
  const policeStats = [
    { title: "Active Tourists", value: activeTourists, icon: Users, description: "Total tourists currently active" },
    { title: "Critical Alerts", value: criticalAlerts, icon: Bell, description: "Urgent SOS and high-priority events" },
    { title: "High-Risk Tourists", value: tourists.filter(t => t.riskLevel === 'High').length, icon: ShieldCheck, description: "Tourists in high-risk zones" },
    { title: "Officers on Duty", value: "42", icon: ShieldCheck, description: "Personnel currently deployed" },
  ];

  const tourismStats = [
    { title: "Active Tourists", value: activeTourists, icon: Users, description: "Total tourists currently active" },
    { title: "Total Alerts", value: alerts.length, icon: Bell, description: "All active alerts" },
    { title: "Popular Destination", value: "Kaziranga", icon: MapPin, description: "Most visited location today" },
    { title: "Crowd Density", value: "High", icon: BarChart2, description: "Overall crowd level" },
  ];

  const stats = view === 'police' ? policeStats : tourismStats;

  return (
    <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
      {stats.map(stat => (
        <StatCard key={stat.title} {...stat} />
      ))}
    </div>
  );
}

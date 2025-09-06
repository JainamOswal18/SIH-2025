import type { LatLngTuple, RiskZone } from '@/lib/types';

export const touristRoute: LatLngTuple[] = [
  [26.1445, 91.7362], // Guwahati
  [26.5786, 93.1709], // Kaziranga
  [25.5788, 91.8933], // Shillong
];

export const riskZones: RiskZone[] = [
  // High-risk tribal area
  {
    id: 'tribal-area-1',
    name: 'Karbi Anglong Restricted Area',
    type: 'tribal',
    riskLevel: 'high',
    shape: 'polygon',
    coords: [
      [26.3, 93.0],
      [26.4, 93.3],
      [26.2, 93.4],
      [26.1, 93.2],
    ],
    color: 'red',
  },
  // Moderate-risk forest boundary
  {
    id: 'forest-kaziranga',
    name: 'Kaziranga National Park Boundary',
    type: 'forest',
    riskLevel: 'moderate',
    shape: 'polygon',
    coords: [
      [26.55, 93.1],
      [26.75, 93.15],
      [26.7, 93.6],
      [26.5, 93.55],
    ],
    color: 'yellow',
  },
  // Low-risk highway danger spot
  {
    id: 'highway-spot-1',
    name: 'NH27 Accident Prone Zone',
    type: 'highway',
    riskLevel: 'low',
    shape: 'circle',
    coords: [25.8, 92.5],
    radius: 5000, // 5km radius
    color: 'orange',
  },
  // Safe zone around Guwahati
  {
    id: 'safe-guwahati',
    name: 'Guwahati Safe Zone',
    type: 'safe',
    riskLevel: 'safe',
    shape: 'circle',
    coords: [26.1445, 91.7362],
    radius: 10000, // 10km radius
    color: 'green',
  },
  // Safe zone around Shillong
  {
    id: 'safe-shillong',
    name: 'Shillong Safe Zone',
    type: 'safe',
    riskLevel: 'safe',
    shape: 'circle',
    coords: [25.5788, 91.8933],
    radius: 8000, // 8km radius
    color: 'green',
  },
];

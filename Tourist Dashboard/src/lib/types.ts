export type LatLngTuple = [number, number];

export interface RiskZone {
  id: string;
  name: string;
  type: 'tribal' | 'forest' | 'highway' | 'safe';
  riskLevel: 'high' | 'moderate' | 'low' | 'safe';
  shape: 'polygon' | 'circle';
  coords: LatLngTuple[] | LatLngTuple;
  radius?: number; // for circles
  color: 'red' | 'orange' | 'yellow' | 'green';
}

export interface AlertLog {
  id: string;
  message: string;
  timestamp: string;
}

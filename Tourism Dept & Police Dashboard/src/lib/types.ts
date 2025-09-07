export type DashboardView = 'police' | 'tourism';

export interface Tourist {
  id: string;
  name: string;
  age: number;
  gender: 'Male' | 'Female' | 'Other';
  nationality: string;
  status: 'Active' | 'Missing' | 'In-Distress';
  location: {
    name: string;
    lat: number;
    lng: number;
  };
  itinerary: {
    day: number;
    location: string;
    activity: string;
  }[];
  emergencyContacts: {
    name: string;
    relation: string;
    phone: string;
  }[];
  medicalFlags: string[];
  blockchainVerified: boolean;
  profilePicture: string;
  riskLevel: 'Low' | 'Medium' | 'High';
}

export interface Alert {
  id: string;
  touristId: string;
  type: 'SOS' | 'Check-in Failure' | 'Route Deviation' | 'Missing';
  tier: 'CRITICAL' | 'HIGH' | 'MEDIUM' | 'INFO';
  message: string;
  timestamp: string;
}

export interface Incident {
  id: string;
  type: 'Theft' | 'Medical' | 'Harassment' | 'Accident' | 'Other';
  location: string;
  time: string;
  severity: 'Low' | 'Medium' | 'High' | 'Critical';
  description: string;
  reportedBy: string;
}

export type RouteAnomalyInput = {
  plannedRoute: string;
  actualRoute: string;
  touristId: string;
};

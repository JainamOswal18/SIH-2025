'use client';

import type { Tourist } from '@/lib/types';
import 'leaflet/dist/leaflet.css';
import L from 'leaflet';
import 'leaflet.heat';
import { useEffect, useRef } from 'react';

const createCustomIcon = (tourist: Tourist) => {
  const riskColor = {
    Low: 'bg-green-500',
    Medium: 'bg-yellow-500',
    High: 'bg-red-500',
  }[tourist.riskLevel];

  const statusColor = {
    Active: riskColor,
    'In-Distress': 'bg-red-500 animate-pulse',
    Missing: 'bg-purple-500',
  }[tourist.status];

  const iconHtml = `
    <div class="relative flex items-center justify-center w-4 h-4">
      <span class="absolute inset-0 rounded-full ${statusColor} border-2 border-white/80 shadow-lg"></span>
      ${tourist.status === 'In-Distress' ? '<span class="absolute inset-[-4px] rounded-full bg-red-500/50 animate-ping"></span>' : ''}
    </div>
  `;

  return L.divIcon({
    html: iconHtml,
    className: 'bg-transparent border-0',
    iconSize: [16, 16],
    iconAnchor: [8, 8],
  });
};

interface MapViewProps {
  tourists: Tourist[];
  onSelectTourist: (tourist: Tourist) => void;
}

export default function MapView({ tourists, onSelectTourist }: MapViewProps) {
    const mapRef = useRef<L.Map | null>(null);
    const mapContainerRef = useRef<HTMLDivElement>(null);
    const markersRef = useRef<L.Marker[]>([]);
    const heatLayerRef = useRef<L.HeatLayer | null>(null);

    useEffect(() => {
        if (mapContainerRef.current && !mapRef.current) {
            mapRef.current = L.map(mapContainerRef.current, {
                center: [26.75, 92.9],
                zoom: 7,
                scrollWheelZoom: true,
            });

            L.tileLayer('https://{s}.basemaps.cartocdn.com/rastertiles/voyager/{z}/{x}/{y}{r}.png', {
                attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors &copy; <a href="https://carto.com/attributions">CARTO</a>'
            }).addTo(mapRef.current);
        }
    }, []);

    useEffect(() => {
        if (mapRef.current) {
            // Clear existing markers
            markersRef.current.forEach(marker => marker.remove());
            markersRef.current = [];

            const heatPoints: L.LatLngTuple[] = tourists.map(tourist => [tourist.location.lat, tourist.location.lng]);
            
            if (heatLayerRef.current) {
                heatLayerRef.current.setLatLngs(heatPoints);
            } else {
                heatLayerRef.current = L.heatLayer(heatPoints, {
                    radius: 25,
                    blur: 15,
                    maxZoom: 12,
                    gradient: { 0.4: 'blue', 0.65: 'lime', 1: 'red' }
                }).addTo(mapRef.current);
            }


            // Add new markers
            tourists.forEach(tourist => {
                const marker = L.marker([tourist.location.lat, tourist.location.lng], {
                    icon: createCustomIcon(tourist)
                })
                .addTo(mapRef.current!)
                .on('click', () => {
                    onSelectTourist(tourist);
                })
                .bindTooltip(`
                    <p class='font-bold'>${tourist.name}</p>
                    <p>${tourist.location.name}</p>
                    <p>Status: ${tourist.status}</p>
                `);
                markersRef.current.push(marker);
            });
        }
    }, [tourists, onSelectTourist]);


    return (
        <div className="w-full h-full bg-muted rounded-xl overflow-hidden relative shadow-inner z-0">
            <div ref={mapContainerRef} className="w-full h-full" />
            <div className="absolute top-2 left-2 bg-background/80 backdrop-blur-sm p-2 rounded-lg shadow z-[1000]">
                <h3 className="font-bold text-lg">Live Tourist Map</h3>
                <p className="text-sm text-muted-foreground">Northeast India Region</p>
            </div>
        </div>
    );
}
